# 🚀 AWS Hosting Guide - Step by Step

Complete guide to host your React project on AWS services.

---

## 📋 AWS Hosting Options (Ranked by Ease)

| Option | Difficulty | Cost | Time | Best For |
|--------|-----------|------|------|----------|
| **AWS Amplify** | ⭐ Easy | Low | 10 min | Quick deployment with CI/CD |
| **S3 + CloudFront** | ⭐⭐ Medium | Low | 20 min | Static files with CDN |
| **Elastic Beanstalk** | ⭐⭐⭐ Medium | Medium | 30 min | Full backend integration |
| **EC2 + Nginx** | ⭐⭐⭐⭐ Hard | Medium | 45 min | Maximum control |

**Recommendation:** Start with **AWS Amplify** (easiest) or **S3 + CloudFront** (most cost-effective)

---

## 🏃 QUICKEST: AWS Amplify (10 minutes)

### Overview
- Automatic CI/CD from GitHub
- Free tier included
- HTTPS automatic
- CDN included
- Best for: Quick deployment

### Prerequisites
✅ GitHub account with your code pushed
✅ AWS account (free tier available)
✅ Your project in GitHub repository

---

### Step 1: Create GitHub Repository

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dealer-pcc.git
git branch -M main
git push -u origin main
```

**Verify:** Go to github.com → See your repository

---

### Step 2: Sign Up for AWS (If needed)

1. Go to: https://aws.amazon.com
2. Click "Create AWS Account"
3. Enter email & password
4. Complete verification
5. Add payment method
6. Done! ✅

**Note:** Free tier includes 1 year of AWS services

---

### Step 3: Set Up AWS Amplify

1. **Go to AWS Amplify:**
   - Visit: https://console.aws.amazon.com/amplify/
   - Click "Get Started"
   - Select "Amplify Hosting"

2. **Connect Your Repository:**
   - Click "Connect app"
   - Select "GitHub"
   - Authorize AWS to access GitHub
   - Select your repository
   - Select "main" branch
   - Click "Next"

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Build environment: Use defaults
   - Click "Next"

4. **Review & Deploy:**
   - Review settings
   - Click "Save and deploy"
   - Wait 2-3 minutes for build

5. **Get Your URL:**
   - Once deployed, you'll see: `https://YOUR-APP.amplifyapp.com`
   - Your site is live! 🎉

---

### Step 4: Configure Custom Domain (Optional)

In Amplify Console:
1. Click "Domain management"
2. Click "Add domain"
3. Enter your domain (e.g., `dealer-pcc.com`)
4. Follow DNS configuration steps
5. Wait 24-48 hours for DNS propagation

---

### Step 5: Enable Automatic Deployments

Already enabled! 🎉
- Every push to `main` branch → Auto deploy
- See build logs in Amplify console
- Automatic rollback on failed builds

---

### Amplify Pricing (Free Tier)

- **Build minutes:** 1,000/month (usually enough)
- **Data transfer:** 1GB/month (enough for most)
- **First 12 months:** Free
- **After 12 months:** ~$0.01 per build minute

**Total Cost:** Usually **$0-5/month**

---

## 💰 MOST COST-EFFECTIVE: S3 + CloudFront (20 minutes)

### Overview
- Very cheap (~$1-5/month)
- Manual deployments
- Ultra-fast CDN
- HTTPS included
- Best for: Cost optimization

---

### Step 1: Build Your Project Locally

```bash
npm run build
# Creates dist/ folder with production files
```

**Result:** `dist/` folder ready for upload

---

### Step 2: Create S3 Bucket

1. **Go to S3 Console:**
   - Visit: https://console.aws.amazon.com/s3/
   - Click "Create bucket"

2. **Configure Bucket:**
   - **Bucket name:** `dealer-pcc-prod` (must be globally unique)
   - **Region:** Choose closest to your users (e.g., us-east-1)
   - **Block all public access:** Uncheck all boxes
   - Click "Create bucket"

3. **Enable Website Hosting:**
   - Click on your bucket
   - Go to "Properties" tab
   - Scroll to "Static website hosting"
   - Click "Edit"
   - Enable "Static website hosting"
   - Index document: `index.html`
   - Error document: `index.html` (for React Router)
   - Click "Save changes"

---

### Step 3: Upload Files to S3

**Option A: AWS Console (Easy)**

1. In S3 console, click your bucket
2. Click "Upload"
3. Drag & drop `dist/` folder contents
4. Click "Upload"
5. Wait for completion ✅

**Option B: AWS CLI (Faster for updates)**

```bash
# Install AWS CLI if needed
# https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter: AWS Access Key ID
# Enter: AWS Secret Access Key
# Enter: Default region (us-east-1)
# Enter: Default output format (json)

# Upload files
aws s3 sync dist/ s3://dealer-pcc-prod/ --delete
```

---

### Step 4: Configure Bucket Permissions

1. In S3 console, go to your bucket
2. Click "Permissions" tab
3. Scroll to "Bucket policy"
4. Click "Edit"
5. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dealer-pcc-prod/*"
    }
  ]
}
```

6. Click "Save changes"

---

### Step 5: Create CloudFront Distribution

1. **Go to CloudFront Console:**
   - Visit: https://console.aws.amazon.com/cloudfront/
   - Click "Distributions"
   - Click "Create distribution"

2. **Configure Distribution:**
   - **Origin domain:** Select your S3 bucket from dropdown
   - **Origin access:** Select "Origin access control settings"
   - **Create new OAC:** Click button, use defaults, create
   - **Viewer protocol policy:** "Redirect HTTP to HTTPS"
   - **Cache policy:** Select "CachingOptimized"
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS
   - **Compress objects automatically:** Enable
   - **Default root object:** `index.html`

3. **Review & Create:**
   - Click "Create distribution"
   - Wait 5-15 minutes for deployment

4. **Get CloudFront URL:**
   - Once deployed, you'll see: `https://d123abc.cloudfront.net`
   - Your site is live! 🎉

---

### Step 6: Set Up Custom Domain (Optional)

1. **Request SSL Certificate:**
   - Go to: https://console.aws.amazon.com/acm/
   - Click "Request certificate"
   - Domain: `yourdomain.com`
   - Validation: Choose "DNS validation"
   - Complete validation (add DNS records to your registrar)
   - Wait for certificate approval (~5 min)

2. **Update CloudFront:**
   - Go to CloudFront distribution
   - Click "Edit"
   - **Alternate domain names:** Add `yourdomain.com`
   - **Custom SSL certificate:** Select your certificate
   - Click "Save changes"
   - Wait 5-15 minutes for update

3. **Update DNS Records:**
   - At your domain registrar (GoDaddy, Namecheap, etc.):
   - Add CNAME record:
     - **Name:** `yourdomain.com`
     - **Value:** `d123abc.cloudfront.net` (your CloudFront domain)
   - Wait 24-48 hours for DNS propagation

---

### Step 7: Update on Each Deploy

After making changes locally:

```bash
# 1. Build locally
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://dealer-pcc-prod/ --delete

# 3. Invalidate CloudFront cache (forces refresh)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Note:** CloudFront caches files for 24 hours by default

---

### S3 + CloudFront Pricing

- **S3 Storage:** ~$0.023 per GB/month (~$2.30 for 100GB)
- **S3 Requests:** ~$0.0004 per request (usually <$1)
- **CloudFront Data transfer:** ~$0.085 per GB (usually $2-5)
- **HTTPS:** Free
- **No SSL certificate cost:** Already included

**Total Monthly Cost:** $2-8/month (very cheap!)

---

## 🏢 ENTERPRISE: Elastic Beanstalk (30 minutes)

### Best For
- Node.js backend included
- Database integration
- Auto-scaling
- Full control with ease

---

### Step 1: Prepare Application

```bash
# Create server.js for Node backend
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API routes here (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve React app for all other routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF
```

2. Update `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js"
  }
}
```

3. Commit and push:

```bash
git add .
git commit -m "Add server for Elastic Beanstalk"
git push
```

---

### Step 2: Install EB CLI

```bash
# Install AWS CLI (if not done)
# https://aws.amazon.com/cli/

# Install Elastic Beanstalk CLI
pip install awsebcli

# Verify installation
eb --version
```

---

### Step 3: Initialize Elastic Beanstalk

```bash
cd your-project-directory

# Initialize EB
eb init -p node.js-18 dealer-pcc

# When prompted:
# - Region: Choose us-east-1 (or closer to you)
# - CodeCommit: Select 'n' (no)
# - SSH: Select 'y' then create key pair
```

---

### Step 4: Create Environment

```bash
# Create production environment
eb create dealer-pcc-prod \
  --instance-type t3.micro \
  --envvars NODE_ENV=production

# This takes 5-10 minutes to create
```

---

### Step 5: Deploy Application

```bash
# Deploy to Elastic Beanstalk
eb deploy

# View logs
eb logs

# Check status
eb status
```

---

### Step 6: Get Your URL

```bash
# Display environment info
eb open
# Opens your application URL in browser
```

You'll get URL like: `http://dealer-pcc-prod.elasticbeanstalk.com`

---

### Step 7: Configure Custom Domain

```bash
# Create CNAME record at your domain registrar
# Name: yourdomain.com
# Value: dealer-pcc-prod.elasticbeanstalk.com
```

---

### Elastic Beanstalk Pricing

- **EC2 Instance (t3.micro):** Free tier (1 year)
- **After free tier:** ~$5-10/month
- **Data transfer:** ~$0.085 per GB
- **Total:** $5-20/month

---

## 🖥️ MAXIMUM CONTROL: EC2 + Nginx (45 minutes)

### Best For
- Full server control
- Custom configurations
- Running backend services
- Learning AWS infrastructure

---

### Step 1: Launch EC2 Instance

1. **Go to EC2 Console:**
   - Visit: https://console.aws.amazon.com/ec2/
   - Click "Instances"
   - Click "Launch instances"

2. **Choose AMI:**
   - Select "Ubuntu Server 22.04 LTS"
   - Click "Select"

3. **Instance Type:**
   - Select `t3.micro` (free tier eligible)
   - Click "Next: Configure Instance Details"

4. **Network Settings:**
   - Keep defaults
   - Click "Next: Add Storage"

5. **Storage:**
   - 20 GB (free tier)
   - Click "Next: Add Tags"

6. **Tags (Optional):**
   - Key: `Name`
   - Value: `dealer-pcc-server`
   - Click "Next: Configure Security Group"

7. **Security Group:**
   - Create new security group
   - Name: `dealer-pcc-sg`
   - Allow inbound:
     - HTTP (80) from 0.0.0.0/0
     - HTTPS (443) from 0.0.0.0/0
     - SSH (22) from YOUR_IP_ONLY
   - Click "Review and Launch"

8. **Review & Launch:**
   - Click "Launch"
   - Create new key pair: `dealer-pcc-key`
   - Download `.pem` file (keep safe!)
   - Click "Launch Instances"

---

### Step 2: Connect to Server

**On Windows (PowerShell):**

```powershell
# Convert .pem to .ppk (if needed for PuTTY)
# Or use Windows SSH directly

# Find your instance IP:
# EC2 Console → Instances → Copy "Public IPv4 address"

$keyPath = "C:\path\to\dealer-pcc-key.pem"
$serverIp = "123.45.67.89"

ssh -i $keyPath ubuntu@$serverIp
```

**On Mac/Linux:**

```bash
chmod 600 dealer-pcc-key.pem
ssh -i dealer-pcc-key.pem ubuntu@123.45.67.89
```

---

### Step 3: Install Required Software

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Install Git
sudo apt-get install -y git

# Verify installations
node --version
npm --version
nginx -v
```

---

### Step 4: Deploy Application

```bash
# Clone your repository
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/dealer-pcc.git
cd dealer-pcc

# Install dependencies
sudo npm install

# Build project
sudo npm run build

# Verify dist/ folder created
ls -la dist/
```

---

### Step 5: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/dealer-pcc
```

Paste this configuration:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/dealer-pcc/dist;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Route all requests to index.html (for React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    # location /api/ {
    #     proxy_pass http://localhost:3000;
    # }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/dealer-pcc /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### Step 6: Set Up HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# When prompted:
# - Enter email
# - Agree to terms
# - Choose auto-renew
```

Certbot automatically updates your Nginx config! ✅

---

### Step 7: Update DNS Records

At your domain registrar, add:

```
A Record:
Name: yourdomain.com
Value: YOUR_INSTANCE_PUBLIC_IP
TTL: 3600
```

Wait 24-48 hours for propagation.

---

### Step 8: Automated Updates (Systemd Service)

Create auto-deployment on git push:

```bash
# Create update script
sudo nano /usr/local/bin/deploy-dealer-pcc.sh
```

Paste:

```bash
#!/bin/bash
cd /var/www/dealer-pcc
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/deploy-dealer-pcc.sh
```

---

### EC2 Pricing

- **t3.micro instance:** Free tier (1 year)
- **Data transfer:** $0.085 per GB
- **After free tier:** ~$5-10/month
- **Total:** $0-20/month

---

## 📊 Comparison Summary

| Feature | Amplify | S3+CF | Beanstalk | EC2+Nginx |
|---------|---------|-------|-----------|-----------|
| Setup Time | 10 min | 20 min | 30 min | 45 min |
| Cost | $0-5 | $2-8 | $5-20 | $0-20 |
| Difficulty | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| CI/CD | Auto | Manual | Auto | Manual |
| HTTPS | ✅ | ✅ | ✅ | ✅ |
| Backend | ❌ | ❌ | ✅ | ✅ |
| Best For | Quick | Budget | Growth | Control |

---

## 🔧 Troubleshooting

### Site showing old version after deploy
**Solution:**
- Clear CloudFront cache (S3 option)
- Or invalidate cache manually
- Or clear browser cache (Ctrl+Shift+Delete)

### 404 errors on page refresh
**Solution:**
- Ensure `index.html` is set as error document
- Or configure Nginx/server to route to `index.html`

### CORS errors
**Solution:**
- Configure API endpoints properly
- Use relative URLs if possible
- Or set up CORS headers on backend

### Certificate errors
**Solution:**
- Wait 24-48 hours for DNS propagation
- Or use HTTP temporarily
- Check certificate status in AWS ACM console

---

## ✅ Verification Checklist

After deployment:

- [ ] Site loads in browser
- [ ] URL is correct
- [ ] HTTPS works
- [ ] No console errors (F12)
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Forms work
- [ ] API calls work (if backend integrated)
- [ ] Navigation works
- [ ] Images load correctly

---

## 🚀 Performance Tips

1. **Enable compression** (all options do this by default)
2. **Use CloudFront/CDN** (S3+CF, Amplify, Beanstalk)
3. **Set cache headers** for static files
4. **Monitor with CloudWatch** (free AWS monitoring)
5. **Use RDS for database** if needed

---

## 📱 Monitor Your Site

### Using AWS CloudWatch

1. Go to: https://console.aws.amazon.com/cloudwatch/
2. Create dashboard
3. Add metrics:
   - HTTP requests
   - Error rate
   - Response time
   - Data transfer

### Using Third-party Tools

- **Uptime monitoring:** https://uptime.com
- **Performance:** https://web.dev
- **Analytics:** https://analytics.google.com

---

## 💡 Next Steps After Deployment

1. ✅ Set up monitoring
2. ✅ Configure backups
3. ✅ Set up error logging
4. ✅ Add analytics
5. ✅ Test on mobile
6. ✅ Load test your site
7. ✅ Plan scaling strategy

---

## 🎯 Recommended for Your Project

**My Recommendation:**

**Start with:** AWS Amplify (10 min setup)
- Easiest to get running
- Auto CI/CD included
- Free tier perfect for your needs
- Can upgrade later if needed

**Later consider:** S3 + CloudFront (when traffic grows)
- More cost-effective at scale
- Better performance
- Manual deployments are easy

---

## 📞 Support

### AWS Documentation
- [Amplify Docs](https://docs.aws.amazon.com/amplify/)
- [S3 Docs](https://docs.aws.amazon.com/s3/)
- [EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [CloudFront Docs](https://docs.aws.amazon.com/cloudfront/)

### Getting Help
- AWS Support (paid)
- Stack Overflow (search AWS+issue)
- AWS Forums
- GitHub Issues

---

*Last Updated: January 18, 2026*
*AWS Hosting Guide v1.0*
