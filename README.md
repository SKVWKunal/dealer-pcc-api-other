# One Aftersales - Dealer Service Management Platform

A comprehensive dealer service management platform built for Volkswagen and Skoda dealerships. Enables seamless management of PCC submissions, technical surveys, warranty surveys, MT meets, and API registrations.

## Features

- **PCC Management** - Manage dealer participation in PCC (Performance Center Program)
- **Surveys** - Technical, Warranty, and Workshop surveys for dealer feedback
- **MT Meets** - Event registration and management for MT (Management Training) meetings
- **API Registration** - Simple API registration and documentation
- **Admin Console** - Audit logs and module management
- **Authentication** - Secure login with role-based access control
- **Export Functionality** - Export survey data and reports

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI Components
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Themes**: Next-themes (Light/Dark mode support)
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SKVWKunal/dealer-pcc-api-other.git
   cd dealer-pcc-api-other
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file (if needed)
   ```bash
   cp .env.example .env.local
   ```

4. Start development server
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build with development mode
npm run build:dev

# Preview production build locally
npm preview

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Sidebar, AppLayout)
│   ├── survey/         # Survey-related components
│   ├── ui/             # Shadcn UI components
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── api/            # API registration pages
│   ├── mtmeet/         # MT Meet pages
│   ├── pcc/            # PCC management pages
│   └── survey/         # Survey pages
├── services/           # API & business logic services
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Auth, FeatureFlags)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Library utilities
```

## Design System

The application uses a professional **Volkswagen and Skoda brand color palette**:

### Light Mode
- **Primary**: VW Blue (#001f3f)
- **Accent**: Light Blue (#00ADEF)
- **Background**: Off-White (#F7F7F7)
- **Text**: Dark Blue (#001f3f)

### Dark Mode
- **Primary**: Light Blue (#00ADEF)
- **Background**: Very Dark Blue (#0a0f1e)
- **Text**: Near White (#f5f7fa)

## Testing

### Build Test
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Hosting & Deployment

### Quick Deployment Options

#### 1. **Vercel (Recommended - Fastest)**
- Zero-config deployment for Vite projects
- Automatic CI/CD with Git integration
- Free tier available
- Custom domain support
- Environment variables management

**Steps:**
```bash
1. Push code to GitHub
2. Go to vercel.com and sign up
3. Click "New Project" → Import your repo
4. Vercel auto-detects Vite → Deploy
5. Add custom domain in project settings
```

#### 2. **Netlify**
- Similar to Vercel with excellent DX
- Build command: `npm run build`
- Publish directory: `dist`
- Automatic SSL/TLS

**Steps:**
```bash
1. Connect GitHub repository
2. Set build command: npm run build
3. Set publish directory: dist
4. Deploy
```

#### 3. **AWS (S3 + CloudFront)**
- Best for enterprise deployments
- High performance with CDN
- More control and scalability

**Steps:**
```bash
1. Build: npm run build
2. Create S3 bucket for static hosting
3. Upload dist/ folder to S3
4. Configure CloudFront CDN
5. Update Route53 DNS
```

#### 4. **Azure Static Web Apps**
- Integrated with Microsoft ecosystem
- Automated builds from Git
- Free tier available

#### 5. **Self-hosted (VPS)**
- Full control over infrastructure
- Docker containerization option
- Use Nginx or Apache for reverse proxy

**Basic setup:**
```bash
1. SSH into server
2. Install Node.js
3. Clone repository
4. npm install && npm run build
5. Use PM2 for process management
6. Configure reverse proxy (Nginx)
```

### Recommended Deployment: **Vercel**

**Why?**
- ✅ Fastest setup (5 minutes)
- ✅ Automatic HTTPS
- ✅ Edge functions for API routes
- ✅ Analytics included
- ✅ Free tier sufficient for most use cases
- ✅ Environment variables easy to manage
- ✅ Automatic deployments on push

**Deployment Steps for Vercel:**

1. **Initialize Git** (if not done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/dealer-pcc.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Vercel will auto-detect settings
   - Click Deploy

4. **Add Environment Variables** (if needed)
   - Go to Project Settings → Environment Variables
   - Add any API endpoints, keys, etc.

5. **Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Environment Variables

Create `.env.local` file:
```env
VITE_API_URL=https://your-api.example.com
VITE_ENVIRONMENT=production
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Configuration Files

- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.ts** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins
- **eslint.config.js** - ESLint rules
- **.env.example** - Environment variables template

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Commit with descriptive messages
5. Push and create a Pull Request

## Performance Optimization

- ✅ Code splitting enabled
- ✅ Lazy loading for routes
- ✅ Image optimization
- ✅ Responsive design
- ✅ Dark mode support
- ✅ CSS-in-JS with Tailwind (atomic CSS)

## Security

- ✅ XSS protection via React
- ✅ CSRF protection via tokens
- ✅ Environment variables for secrets
- ✅ Protected routes with authentication
- ✅ Role-based access control (RBAC)

## License

Proprietary - Volkswagen/Skoda Internal Use

## Support

For issues or questions, contact the development team.

---

**Last Updated**: January 18, 2026
**Version**: 1.0.0
