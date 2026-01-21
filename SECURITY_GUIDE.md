# Security Implementation Guide

## Overview
Comprehensive security measures for the One Aftersales platform.

---

## 1. Authentication & Authorization

### JWT Token Implementation
```typescript
// Backend: Token generation
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  dealerId?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '1h', // Access token expires in 1 hour
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Role-Based Access Control (RBAC)
```typescript
// Middleware for route protection
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};

export const authorizeModule = (module: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if user has access to the module
    const hasAccess = await checkModuleAccess(req.user.userId, module);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Module access denied' });
    }

    next();
  };
};
```

---

## 2. API Security

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Strict rate limiting for login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});
```

### CORS Configuration
```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
```

### Input Validation & Sanitization
```typescript
import { z } from 'zod';
import validator from 'validator';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['dealer', 'manufacturer']),
});

// Sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize all string inputs
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = validator.escape(req.body[key]).trim();
    }
  }
  next();
};
```

### SQL Injection Prevention
```typescript
// Always use parameterized queries
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GOOD - Parameterized query
export async function getUserByEmail(email: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// BAD - String concatenation (NEVER DO THIS)
// const query = `SELECT * FROM users WHERE email = '${email}'`;
```

### XSS Prevention
```typescript
import helmet from 'helmet';

// Use Helmet for security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
```

---

## 3. Data Protection

### Encryption at Rest
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}
```

### Secure Session Management
```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'strict',
  },
});
```

---

## 4. Audit Logging

### Activity Logging
```typescript
interface AuditLog {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
}

export async function logActivity(log: AuditLog) {
  await pool.query(
    `INSERT INTO audit_logs 
     (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      log.userId,
      log.action,
      log.entityType,
      log.entityId,
      JSON.stringify(log.oldValues),
      JSON.stringify(log.newValues),
      log.ipAddress,
      log.userAgent,
    ]
  );
}

// Middleware to log all API requests
export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on('finish', async () => {
    if (req.user) {
      await logActivity({
        userId: req.user.userId,
        action: `${req.method} ${req.path}`,
        entityType: 'api_request',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || '',
      });
    }
  });
  next();
};
```

---

## 5. Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/oneaftersales
DATABASE_SSL=true

# JWT Secrets (use strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key-here

# Session
SESSION_SECRET=your-session-secret-min-32-chars
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@oneaftersales.com
SMTP_PASS=your-smtp-password

# Environment
NODE_ENV=production
PORT=3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

---

## 6. Security Checklist

### Pre-Production
- [ ] All passwords hashed with bcrypt (min 12 rounds)
- [ ] JWT secrets are strong and unique
- [ ] HTTPS enabled for all production traffic
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS prevention implemented
- [ ] CSRF protection enabled
- [ ] Security headers configured (Helmet)
- [ ] Sensitive data encrypted at rest
- [ ] Audit logging implemented
- [ ] Error messages don't leak sensitive info
- [ ] Database credentials secured
- [ ] API keys rotated regularly

### Ongoing Monitoring
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Log monitoring and alerting
- [ ] Failed login attempt tracking
- [ ] Unusual activity detection
- [ ] Regular backup verification
- [ ] Incident response plan documented

---

## 7. Common Security Vulnerabilities to Avoid

### ❌ Don't
```typescript
// Don't store passwords in plain text
user.password = req.body.password;

// Don't expose sensitive errors
res.status(500).json({ error: error.stack });

// Don't use string concatenation in SQL
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Don't trust user input
const filename = req.body.filename;
fs.readFile(filename); // Path traversal vulnerability
```

### ✅ Do
```typescript
// Do hash passwords
user.password = await hashPassword(req.body.password);

// Do return generic errors
res.status(500).json({ error: 'Internal server error' });

// Do use parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
await pool.query(query, [userId]);

// Do validate and sanitize input
const filename = path.basename(req.body.filename);
if (!/^[a-zA-Z0-9_-]+\.(jpg|png|pdf)$/.test(filename)) {
  throw new Error('Invalid filename');
}
```

---

## 8. Deployment Security

### Production Checklist
1. **SSL/TLS Certificate**: Use Let's Encrypt or commercial SSL
2. **Firewall Rules**: Only allow necessary ports (443, 80)
3. **Database Access**: Restrict to application servers only
4. **Environment Variables**: Use secrets manager (AWS Secrets Manager, Azure Key Vault)
5. **Backups**: Automated daily backups with encryption
6. **Monitoring**: CloudWatch, DataDog, or similar
7. **Updates**: Regular security patches
8. **Access Control**: Principle of least privilege
9. **DDoS Protection**: CloudFlare or AWS Shield
10. **Penetration Testing**: Quarterly security audits

---

**Remember**: Security is an ongoing process, not a one-time setup. Regular audits and updates are essential.
