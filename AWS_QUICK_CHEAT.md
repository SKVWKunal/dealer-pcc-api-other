# ⚡ AWS Hosting - Quick Cheat Sheet

## 🎯 Pick Your Path (30 seconds)

### "I want it working in 10 minutes"
→ Use **AWS Amplify** (see below)

### "I want it super cheap"
→ Use **S3 + CloudFront** 

### "I want a backend too"
→ Use **Elastic Beanstalk**

### "I want total control"
→ Use **EC2 + Nginx**

---

## 🚀 AWS AMPLIFY - FASTEST (10 min)

### Prerequisites
- GitHub account (code pushed)
- AWS account (https://aws.amazon.com)

### Commands

```bash
# In your project
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/YOUR_USER/dealer-pcc.git
git push -u origin main
```

### In AWS Console (5 minutes)

1. Go: https://console.aws.amazon.com/amplify/
2. Click: "Get Started" → "Amplify Hosting"
3. Connect: GitHub → Authorize → Select repo → main branch
4. Build settings: Keep defaults (auto-detected)
5. Deploy: Click "Save and deploy"
6. Wait: 2-3 minutes
7. URL: You'll see `https://YOUR-APP.amplifyapp.com` ✅

### Deploy Updates

Push to GitHub → Auto-deploys! 🎉

### Custom Domain

In Amplify console:
- Domain management → Add domain → Follow steps → Done

### Cost
**$0-5/month** (often free!)

---

## 💰 S3 + CLOUDFRONT - CHEAPEST (20 min)

### Step 1: Build
```bash
npm run build
```

### Step 2: Create S3 Bucket
1. Go: https://console.aws.amazon.com/s3/
2. Create bucket: `dealer-pcc-prod` (unique name)
3. Uncheck: "Block all public access"
4. Enable: "Static website hosting"
5. Index: `index.html`
6. Error: `index.html`

### Step 3: Upload Files
```bash
# Option A: AWS Console drag & drop
# Go to bucket → Upload → Add dist/ folder

# Option B: CLI (faster)
aws s3 sync dist/ s3://dealer-pcc-prod/ --delete
```

### Step 4: Bucket Policy
In S3 bucket → Permissions → Bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::dealer-pcc-prod/*"
  }]
}
```

### Step 5: CloudFront Distribution
1. Go: https://console.aws.amazon.com/cloudfront/
2. Create distribution
3. Origin: Your S3 bucket
4. Default root object: `index.html`
5. Compress: Enable
6. HTTPS: Enforce
7. Create

### Step 6: Get Your URL
Wait 5-15 min → You get: `https://d123abc.cloudfront.net` ✅

### Deploy Updates
```bash
npm run build
aws s3 sync dist/ s3://dealer-pcc-prod/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Custom Domain
1. Buy domain (GoDaddy, etc.)
2. Request SSL certificate (AWS ACM)
3. Add certificate to CloudFront
4. Update CloudFront alternate domain
5. Add CNAME record at registrar: `yourdomain.com` → `d123abc.cloudfront.net`
6. Wait 24-48 hours

### Cost
**$2-8/month**

---

## 🏢 ELASTIC BEANSTALK - BALANCED (30 min)

### Prerequisites
```bash
pip install awsebcli
aws configure
```

### Steps
```bash
# 1. Create server.js
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000);
EOF

# 2. Update package.json
# Add to scripts: "start": "node server.js"

# 3. Deploy
npm run build
eb init -p node.js-18 dealer-pcc
eb create dealer-pcc-prod --instance-type t3.micro
eb deploy
eb open
```

### Cost
**Free tier first year, then $5-10/month**

---

## 🖥️ EC2 + NGINX - FULL CONTROL (45 min)

### Quick Setup
```bash
# 1. Launch EC2 (t3.micro, Ubuntu 22.04)
# 2. Security: Allow HTTP/HTTPS/SSH

# 3. Connect
ssh -i key.pem ubuntu@123.45.67.89

# 4. Install
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# 5. Deploy
cd /var/www
sudo git clone https://github.com/YOUR_USER/dealer-pcc.git
cd dealer-pcc
sudo npm install
sudo npm run build

# 6. Configure Nginx
sudo nano /etc/nginx/sites-available/dealer-pcc
# Paste config from AWS_HOSTING_GUIDE.md

sudo ln -s /etc/nginx/sites-available/dealer-pcc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 7. HTTPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Cost
**Free tier first year, then $5-20/month**

---

## 📊 Quick Comparison

| | Amplify | S3+CF | Beanstalk | EC2 |
|---|---------|-------|-----------|-----|
| Setup | 10m | 20m | 30m | 45m |
| Cost | $0-5 | $2-8 | $5-20 | $0-20 |
| Easy | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ |
| CI/CD | ✅ | ❌ | ✅ | ❌ |
| Backend | ❌ | ❌ | ✅ | ✅ |

---

## 🔑 AWS CLI Setup

```bash
# Install
# Windows: https://awscli.amazonaws.com/AWSCLIV2.msi
# Mac: brew install awscli
# Linux: pip install awscliv2

# Configure
aws configure
# Paste your AWS Access Key ID
# Paste your AWS Secret Access Key
# Region: us-east-1
# Format: json
```

**Get Keys:**
1. AWS Console → IAM → Users → YOUR_USER
2. Security credentials → Create access key
3. Paste into terminal when prompted

---

## 📱 Monitor Your Site

```bash
# CloudWatch dashboard
# https://console.aws.amazon.com/cloudwatch/

# Check site health
# https://www.uptime.com (free tier)

# Performance test
# https://web.dev
```

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Site shows old version | Clear CloudFront cache or browser cache |
| 404 on page refresh | Set `index.html` as error document |
| CORS errors | Configure API endpoints correctly |
| SSL errors | Wait 24-48h for DNS or check certificate |
| High cost | Use t3.micro (free tier) or S3+CF |

---

## ✅ After Deployment Checklist

- [ ] Site loads
- [ ] HTTPS works
- [ ] URL is correct
- [ ] No console errors (F12)
- [ ] Mobile works
- [ ] Dark mode works
- [ ] Forms submit
- [ ] Navigation works

---

## 📞 Links

- **AWS Console**: https://console.aws.amazon.com
- **Amplify Docs**: https://docs.aws.amazon.com/amplify/
- **S3 Docs**: https://docs.aws.amazon.com/s3/
- **EC2 Docs**: https://docs.aws.amazon.com/ec2/
- **AWS Support**: https://console.aws.amazon.com/support/

---

## 🎯 Recommendation

**Try this order:**

1. **First**: AWS Amplify (10 min, very easy)
2. **If cheap needed**: S3 + CloudFront (20 min, $2-8/mo)
3. **If backend needed**: Elastic Beanstalk (30 min)
4. **If custom setup**: EC2 + Nginx (45 min)

---

**Ready? Start with Amplify!** → Follow "AWS AMPLIFY - FASTEST" above ⬆️

*Cheat Sheet v1.0 - Jan 18, 2026*
