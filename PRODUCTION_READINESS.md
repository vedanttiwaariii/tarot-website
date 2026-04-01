# Production Readiness Guide

## 🚨 CRITICAL FINDINGS

### Console.log Statements: 372 found
**Status**: ⚠️ MUST FIX BEFORE PRODUCTION

Console.log statements expose sensitive information and impact performance.

---

## 📝 Action Items Summary

### 🔴 CRITICAL (Must fix before deployment)
1. **Remove/Replace 372 console.log statements**
2. **Regenerate all secrets and credentials**
3. **Switch to MongoDB Atlas with authentication**
4. **Switch to Razorpay live keys**
5. **Configure production CORS**

### 🟡 HIGH PRIORITY (Fix before launch)
6. **Set up error monitoring (Sentry/LogRocket)**
7. **Configure production logging**
8. **Set up automated backups**
9. **Configure SSL/HTTPS**
10. **Test payment flow end-to-end**

### 🟢 MEDIUM PRIORITY (Fix within first week)
11. **Set up uptime monitoring**
12. **Configure CDN for static assets**
13. **Optimize database indexes**
14. **Set up analytics**

---

## 🔧 Console.log Removal Strategy

### Option 1: Conditional Logging (Recommended)
Create a logger utility that only logs in development:

**File**: `backend/utils/logger.js`
```javascript
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args)
    }
  },
  error: (...args) => {
    // Always log errors, but send to monitoring service in production
    console.error(...args)
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args)
    }
  }
}

export default logger
```

**Usage**:
```javascript
// Replace: console.log('User logged in')
// With: logger.log('User logged in')

// Replace: console.error('Payment failed')
// With: logger.error('Payment failed')
```

### Option 2: Build-time Removal
Use babel plugin to remove console.logs in production build.

**Install**:
```bash
npm install --save-dev babel-plugin-transform-remove-console
```

**Configure** (`.babelrc` or `babel.config.js`):
```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

### Option 3: Manual Removal
Search and remove manually (not recommended for 372 instances).

---

## 🔐 Security Hardening Steps

### Step 1: Regenerate All Secrets

```bash
# Generate strong secrets
node -e "console.log('ADMIN_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Update Environment Variables

**Backend Production (.env.production)**:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tarot-website
FRONTEND_URL=https://yourdomain.com
ADMIN_KEY=<generated-secret-here>
JWT_SECRET=<generated-secret-here>
RAZORPAY_KEY_ID=rzp_live_<your-live-key>
RAZORPAY_KEY_SECRET=<your-live-secret>
RAZORPAY_WEBHOOK_SECRET=<from-razorpay-dashboard>
```

**Frontend Production (.env.production)**:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_<your-live-key>
VITE_APP_NAME=Krushnalaya
VITE_WHATSAPP_NUMBER=+919893578135
GENERATE_SOURCEMAP=false
```

### Step 3: Verify .gitignore

Ensure these are in `.gitignore`:
```
.env
.env.local
.env.production
.env.development
*.env
node_modules/
dist/
build/
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Go to https://cloud.mongodb.com/
2. Create free cluster
3. Choose region closest to your users
4. Wait for cluster to be created

### Step 2: Create Database User
1. Database Access → Add New Database User
2. Username: `tarot-admin`
3. Password: Generate strong password
4. Database User Privileges: Read and write to any database

### Step 3: Configure Network Access
1. Network Access → Add IP Address
2. For testing: Allow access from anywhere (0.0.0.0/0)
3. For production: Add your server's IP address

### Step 4: Get Connection String
1. Clusters → Connect → Connect your application
2. Copy connection string
3. Replace `<password>` with your database password
4. Replace `<dbname>` with `tarot-website`

---

## 💳 Razorpay Production Setup

### Step 1: Activate Live Mode
1. Go to https://dashboard.razorpay.com/
2. Complete KYC verification
3. Activate live mode

### Step 2: Get Live Keys
1. Settings → API Keys
2. Generate Live Keys
3. Copy Key ID and Key Secret
4. Store securely

### Step 3: Configure Webhook
1. Settings → Webhooks
2. Add webhook URL: `https://api.yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Generate webhook secret
5. Copy secret to environment variables

### Step 4: Test Payment
1. Use small amount (₹1)
2. Complete full payment flow
3. Verify booking is updated
4. Check webhook logs

---

## 🚀 Deployment Steps

### Backend Deployment (Example: Heroku)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create krushnalaya-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your-mongodb-atlas-uri"
heroku config:set FRONTEND_URL="https://yourdomain.com"
heroku config:set ADMIN_KEY="your-generated-secret"
heroku config:set JWT_SECRET="your-generated-secret"
heroku config:set RAZORPAY_KEY_ID="rzp_live_xxx"
heroku config:set RAZORPAY_KEY_SECRET="your-secret"
heroku config:set RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Frontend Deployment (Example: Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

---

## 🔍 Testing Checklist

### Pre-Deployment Testing

#### Backend API Tests
```bash
# Health check
curl https://api.yourdomain.com/api/health

# Create booking (should work)
curl -X POST https://api.yourdomain.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9999999999","service":"tarot","date":"2024-12-25","time":"10:00 AM","sessionType":"online"}'

# Get pricing
curl https://api.yourdomain.com/api/pricing
```

#### Frontend Tests
- [ ] Homepage loads
- [ ] Services display correctly
- [ ] Booking form works
- [ ] Payment modal opens
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] Desktop optimized

#### Payment Flow Tests
- [ ] Create order succeeds
- [ ] Payment modal opens
- [ ] Test payment succeeds
- [ ] Booking status updates
- [ ] Confirmation shown
- [ ] Webhook received

---

## 📊 Monitoring Setup

### Error Monitoring (Sentry)

```bash
# Install
npm install @sentry/node @sentry/react

# Backend setup (server.js)
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

# Frontend setup (main.jsx)
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE
})
```

### Uptime Monitoring
- Sign up for UptimeRobot (free)
- Add monitor for: `https://api.yourdomain.com/api/health`
- Set alert email
- Check every 5 minutes

---

## 🔄 Backup Strategy

### Database Backups
```bash
# MongoDB Atlas automatic backups (enabled by default)
# Manual backup
mongodump --uri="your-mongodb-atlas-uri" --out=./backup

# Restore
mongorestore --uri="your-mongodb-atlas-uri" ./backup
```

### Code Backups
- Git repository (primary)
- GitHub/GitLab (remote)
- Local backup (secondary)

### Environment Variables Backup
- Store encrypted in password manager
- Document in secure wiki
- Keep offline backup

---

## 🚨 Emergency Procedures

### If Payment System Fails
1. Check Razorpay dashboard for issues
2. Verify webhook is receiving events
3. Check server logs for errors
4. Temporarily disable bookings if needed
5. Notify users via WhatsApp/Email

### If Server Goes Down
1. Check hosting provider status
2. Check error logs
3. Restart server
4. If persists, rollback to previous version
5. Investigate root cause

### If Database Connection Fails
1. Check MongoDB Atlas status
2. Verify connection string
3. Check IP whitelist
4. Verify database user credentials
5. Check network connectivity

### If Security Breach Detected
1. Immediately rotate all secrets
2. Revoke compromised API keys
3. Check logs for unauthorized access
4. Notify affected users
5. Document incident
6. Implement additional security measures

---

## ✅ Final Pre-Launch Checklist

### Security
- [ ] All secrets regenerated and strong
- [ ] No credentials in code
- [ ] HTTPS enabled
- [ ] CORS configured for production only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] NoSQL injection protection enabled

### Configuration
- [ ] NODE_ENV=production
- [ ] MongoDB Atlas configured
- [ ] Razorpay live keys configured
- [ ] Webhook URL registered
- [ ] Frontend URL updated
- [ ] All environment variables set

### Code Quality
- [ ] Console.logs removed/replaced
- [ ] Debug code removed
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Error messages user-friendly

### Testing
- [ ] All features tested
- [ ] Payment flow tested with real money
- [ ] Mobile responsive verified
- [ ] Desktop optimized verified
- [ ] Cross-browser tested
- [ ] Performance tested

### Monitoring
- [ ] Error monitoring configured
- [ ] Uptime monitoring configured
- [ ] Logging configured
- [ ] Analytics configured
- [ ] Alerts configured

### Backup
- [ ] Database backups enabled
- [ ] Code backed up to Git
- [ ] Environment variables documented
- [ ] Recovery procedure tested

### Documentation
- [ ] API documentation complete
- [ ] Deployment guide complete
- [ ] Admin guide complete
- [ ] Troubleshooting guide complete
- [ ] Emergency procedures documented

---

## 📞 Support Contacts

### Technical Support
- Hosting Provider: [Contact]
- MongoDB Atlas: support@mongodb.com
- Razorpay: support@razorpay.com
- Domain Registrar: [Contact]

### Emergency Contacts
- Lead Developer: [Phone/Email]
- System Administrator: [Phone/Email]
- Business Owner: [Phone/Email]

---

## 📅 Post-Launch Schedule

### Daily (First Week)
- Check error logs
- Monitor payment success rate
- Review user feedback
- Fix critical bugs

### Weekly
- Review performance metrics
- Check security logs
- Update dependencies
- Backup verification

### Monthly
- Security audit
- Performance optimization
- Feature planning
- User feedback review

### Quarterly
- Comprehensive security review
- Disaster recovery test
- Documentation update
- Team training

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Next Review**: [Date]
