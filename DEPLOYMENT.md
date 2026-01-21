# Deployment & Hosting Guide

## Quick Reference

| Platform | Setup Time | Cost | Recommendation |
|----------|-----------|------|-----------------|
| **Vercel** | 5 min | Free tier | ⭐ Best for Startups |
| **Netlify** | 5 min | Free tier | ⭐ Great Alternative |
| **GitHub Pages** | 10 min | Free | ✅ Good for Static Sites |
| **AWS S3 + CF** | 20 min | $1-10/mo | 🏢 Enterprise |
| **Docker + VPS** | 30 min | $5-20/mo | 🏢 Full Control |
| **Azure Static Webs** | 10 min | Free tier | ✅ Microsoft Ecosystem |

---

## 1. VERCEL (Recommended - Easiest)

### Why Vercel?
- ✅ Zero configuration needed
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN (50+ regions)
- ✅ Free tier includes: 100GB bandwidth, auto-scaling
- ✅ 1-click GitHub integration
- ✅ Environment variables UI
- ✅ Analytics included
- ✅ Automatic deployments on Git push

### Steps:

**Step 1: Create Vercel Account**
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Connect GitHub account
```

**Step 2: Deploy Repository**
```
1. Once logged in, click "New Project"
2. Select your GitHub repository
3. Click "Import"
```

**Step 3: Configure Project**
```
Vercel will auto-detect:
- Framework: Vite (Auto-detected ✓)
- Build Command: npm run build (Auto-detected ✓)
- Output Directory: dist (Auto-detected ✓)
- Install Command: npm install (Auto-detected ✓)
```

**Step 4: Set Environment Variables** (if needed)
```
1. Go to Project Settings → Environment Variables
2. Add your variables:
   - VITE_API_URL = https://api.example.com
   - VITE_ENVIRONMENT = production
3. Click "Save"
```

**Step 5: Deploy**
```
1. Click "Deploy"
2. Wait for build (usually 2-3 minutes)
3. You get a URL: https://your-project.vercel.app
```

**Step 6: Add Custom Domain**
```
1. Go to Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., dealer-pcc.vw.com)
4. Vercel shows DNS records to add
5. Add those records to your domain registrar
6. Wait for DNS propagation (5-30 min)
```

### Cost
- **Free tier**: Perfect for this project
  - 100GB bandwidth/month
  - Unlimited projects
  - Unlimited deployments
  - Auto-scaling
- **Pro tier**: $20/month if you need more

---

## 2. NETLIFY (Great Alternative)

### Steps:

**Step 1: Connect Repository**
```
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub
4. Authorize and choose repository
```

**Step 2: Configure Build**
```
Build command: npm run build
Publish directory: dist
```

**Step 3: Deploy**
```
1. Click "Deploy"
2. Get automatic URL
3. Add custom domain in Domain settings
```

### Cost
- Free tier includes everything you need

---

## 3. GITHUB PAGES (Free, Static Only)

### Limitations
- Static files only (works with our Vite build!)
- No server-side rendering
- No environment variables (workaround: build-time variables)
- Must be public repository

### Steps:

**Step 1: Create gh-pages branch**
```bash
git branch gh-pages
```

**Step 2: Add deployment script**
Create `deploy.sh`:
```bash
#!/bin/bash
npm run build
cd dist
git init
git add .
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin https://github.com/username/repo.git
git push -u origin gh-pages
```

**Step 3: Update vite.config.ts**
```typescript
export default defineConfig({
  base: '/repo-name/', // If using project site
  // OR
  base: '/', // If using user/org site
  ...
})
```

**Step 4: Enable GitHub Pages**
- Go to Repository Settings
- Pages section
- Select "Deploy from a branch"
- Choose gh-pages branch
- Save

---

## 4. AWS S3 + CLOUDFRONT (Enterprise)

### Best For
- High performance requirements
- Large-scale applications
- Existing AWS infrastructure
- Maximum customization

### Architecture
```
Your Domain
    ↓
CloudFront (CDN) → caches globally
    ↓
S3 Bucket → stores your files
```

### Steps:

**Step 1: Create S3 Bucket**
```bash
# Using AWS CLI
aws s3 mb s3://dealer-pcc-production --region us-east-1
```

**Step 2: Enable Static Hosting**
```bash
aws s3 website s3://dealer-pcc-production \
  --index-document index.html \
  --error-document index.html
```

**Step 3: Upload Build**
```bash
npm run build
aws s3 sync dist/ s3://dealer-pcc-production --delete
```

**Step 4: Create CloudFront Distribution**
- Redirect HTTP to HTTPS
- Set S3 bucket as origin
- Add custom domain (CNAME)
- Request SSL certificate in ACM

**Step 5: Update Route53 DNS**
```
Add A record pointing to CloudFront distribution
```

### Cost
- S3: $0.023 per GB stored + $0.0007 per 1000 PUT requests
- CloudFront: $0.085 per GB delivered
- Typical cost: $2-10/month

### CLI Deployment Script
```bash
#!/bin/bash
# build.sh
npm run build
aws s3 sync dist/ s3://dealer-pcc-production --delete --cache-control "max-age=3600"
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/*"
```

---

## 5. DOCKER + VPS (Full Control)

### Best For
- Backend API integration
- Custom server configuration
- Running cron jobs
- Maximum control

### Prerequisites
- Linux VPS (Ubuntu 20.04+ recommended)
- SSH access
- Domain + DNS setup

### Steps:

**Step 1: Create Dockerfile**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Step 2: Create nginx.conf**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Step 3: Build & Push to Registry**
```bash
docker build -t dealer-pcc:latest .
docker tag dealer-pcc:latest your-registry.azurecr.io/dealer-pcc:latest
docker push your-registry.azurecr.io/dealer-pcc:latest
```

**Step 4: Deploy on VPS**
```bash
ssh user@your-vps.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Run container
sudo docker run -d \
  --name dealer-pcc \
  -p 80:80 \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  your-registry.azurecr.io/dealer-pcc:latest
```

**Step 5: Add HTTPS with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d dealer-pcc.example.com
```

### Cost
- Minimal VPS: $5-20/month
- Domains: $10-15/year

---

## 6. AZURE STATIC WEB APPS

### Best For
- Microsoft ecosystem integration
- .NET/Node.js backend APIs
- Serverless functions
- Free tier sufficient

### Steps:

**Step 1: Create Azure Account**
- Go to https://azure.microsoft.com
- Free $200 credit for 30 days

**Step 2: Create Static Web App**
- Azure Portal → "Create a resource"
- Search for "Static Web App"
- Click "Create"

**Step 3: Configure**
```
- Resource Group: Create new
- Name: dealer-pcc
- Plan: Free
- Build Preset: Vite
- App location: /
- API location: (leave blank for now)
- Output location: dist
```

**Step 4: Connect GitHub**
- Authorize Azure
- Select repository
- Azure auto-detects build settings

**Step 5: Deploy**
- Push to main branch
- GitHub Actions auto-deploys
- Get your Azure URL

**Step 6: Custom Domain**
- Static Web App → Custom domains
- Add CNAME record
- Verify domain ownership

### Cost
- **Free tier**: 
  - 1 free static web app
  - 100 GB bandwidth/month
  - Unlimited deployments
- **Standard tier**: $9/month for custom domains + premium features

---

## DEPLOYMENT DECISION MATRIX

Choose based on your needs:

### Development/Testing
→ **Vercel** (no config, instant)

### Production with Low Budget
→ **Vercel Free** or **Netlify Free**

### Production with Backend
→ **Vercel** (with Edge Functions) or **Docker + VPS**

### Enterprise Requirement
→ **AWS S3 + CloudFront** + **Route53**

### Microsoft Stack
→ **Azure Static Web Apps**

### Maximum Control
→ **Docker + VPS + Nginx**

---

## CI/CD BEST PRACTICES

### GitHub Actions Example (Vercel)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          prod: true
```

### Environment Variables Security
```
⚠️  NEVER commit .env files
✅ Use platform-provided UI (Vercel, Netlify, etc.)
✅ Use secrets in GitHub Actions
✅ Rotate keys regularly
✅ Use different keys per environment
```

---

## MONITORING & MAINTENANCE

### Uptime Monitoring
- Uptime Robot (free): https://uptimerobot.com
- Configure alerts for downtime

### Performance Monitoring
- **Vercel Analytics**: Built-in
- **Netlify Analytics**: Built-in
- **New Relic**: For detailed metrics
- **DataDog**: Enterprise monitoring

### Logging
- Check deployment logs in your platform
- Set up error tracking (Sentry)
- Monitor API responses

### Backup Strategy
```
- Git repository: automatic (GitHub)
- Environment config: document in .env.example
- Database: depends on your backend
- CDN cache: purge on production deployments
```

---

## DOMAIN & DNS SETUP

### Domain Registration
1. Register domain: Godaddy, Namecheap, Route53, etc.
2. Get nameservers from your hosting provider
3. Update domain registrar with nameservers
4. Wait 24-48 hours for propagation

### DNS Records Needed
```dns
Type    | Name  | Value
--------|-------|----------------------------------
A       | @     | 76.76.21.161 (Vercel example)
CNAME   | www   | cname.vercel-dns.com
TXT     | @     | v=spf1 include:_spf.vercel.com ~all (for email)
```

### SSL/TLS Certificate
- **Vercel/Netlify**: Automatic (free Let's Encrypt)
- **GitHub Pages**: Automatic HTTPS
- **VPS**: Use Let's Encrypt (free)
- **AWS**: Use AWS Certificate Manager (free)

---

## POST-DEPLOYMENT CHECKLIST

- [ ] Custom domain configured
- [ ] HTTPS working
- [ ] 404 redirects to index.html (SPA)
- [ ] Environment variables set
- [ ] Cache headers configured
- [ ] Analytics enabled
- [ ] Error tracking enabled
- [ ] Uptime monitoring active
- [ ] Team access configured
- [ ] Backup plan documented
- [ ] Performance monitored
- [ ] Security headers configured

---

## QUICK DEPLOY COMMANDS

### Vercel CLI
```bash
npm install -g vercel
vercel  # Deploy to staging
vercel --prod  # Deploy to production
```

### Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### AWS CLI
```bash
aws s3 sync dist/ s3://bucket-name --delete
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

---

## TROUBLESHOOTING

### Blank Page After Deploy
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify 404.html → index.html redirect
- Check build output directory

### Environment Variables Not Working
- Ensure prefixed with `VITE_`
- Rebuild after changing
- Check platform's env var UI
- Verify in build logs

### Domain Not Working
- Check DNS propagation: https://dnschecker.org
- Verify CNAME/A records match platform
- Clear local DNS cache: `ipconfig /flushdns`
- Wait 24 hours for global propagation

### Performance Issues
- Enable gzip compression
- Optimize images (use WebP)
- Minimize bundle size: `npm run build` and check dist/
- Enable CDN caching headers
- Use defer on script tags

---

## RECOMMENDATIONS FOR YOUR PROJECT

**Immediate (Free):**
- Deploy on **Vercel** (5 min setup)
- Get production URL
- Share with stakeholders

**Short-term (1-2 weeks):**
- Register custom domain
- Add to Vercel
- Set up monitoring

**Long-term (1-3 months):**
- Evaluate usage patterns
- Move to paid tier if needed
- Add backend API integration
- Implement CI/CD pipeline

---

*Last Updated: January 18, 2026*
