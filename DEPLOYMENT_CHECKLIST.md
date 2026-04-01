# 🚀 Deployment Checklist - Krushnalaya Website

## ⚠️ CRITICAL SECURITY ISSUES FOUND

### 🔴 HIGH PRIORITY - FIX BEFORE DEPLOYMENT

#### 1. **Exposed Sensitive Credentials in .env Files**
**Status**: ❌ CRITICAL
**Location**: `backend/.env`

**Issues Found**:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx  ❌ EXPOSED (Example)
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ❌ EXPOSED (Example)
ADMIN_KEY=Krushnalayabyraj2026  ❌ WEAK & EXPOSED
JWT_SECRET=websiteforKrushnalayabyraj2026  ❌ WEAK & EXPOSED
RAZORPAY_KEY_SECRET=HZjlUOUfpICXG1GWA8NrDrJT  ❌ EXPOSED
```

**Action Required**:
- [ ] **IMMEDIATELY** regenerate ALL secrets
- [ ] Use strong random secrets (32+ characters)
- [ ] Never commit .env files to Git
- [ ] Add `.env` to `.gitignore`
- [ ] Rotate Twilio credentials
- [ ] Rotate Razorpay test keys before going live

**Recommended Secrets Generation**:
```bash
# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

#### 2. **Razorpay Test Mode**
**Status**: ⚠️ WARNING
**Current**: Using test keys (`rzp_test_`)

**Action Required**:
- [ ] Switch to live Razorpay keys for production
- [ ] Update `RAZORPAY_KEY_ID` with live key
- [ ] Update `RAZORPAY_KEY_SECRET` with live secret
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Set `RAZORPAY_WEBHOOK_SECRET` properly

---

#### 3. **Weak Admin Credentials**
**Status**: ❌ CRITICAL

**Issues**:
- Admin key is predictable: `Krushnalayabyraj2026`
- JWT secret is predictable: `websiteforKrushnalayabyraj2026`

**Action Required**:
- [ ] Generate cryptographically secure random strings
- [ ] Minimum 32 characters
- [ ] Use mix of uppercase, lowercase, numbers, symbols

---

#### 4. **MongoDB Connection**
**Status**: ⚠️ WARNING
**Current**: `mongodb://127.0.0.1:27017/tarot-website`

**Action Required**:
- [ ] Use MongoDB Atlas for production
- [ ] Enable authentication
- [ ] Use connection string with credentials
- [ ] Enable IP whitelist
- [ ] Enable SSL/TLS
- [ ] Set up automated backups

**Recommended**:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tarot-website?retryWrites=true&w=majority
```

---

#### 5. **CORS Configuration**
**Status**: ⚠️ NEEDS UPDATE

**Current Issues**:
- Development mode allows all origins
- Frontend URL hardcoded: `http://192.168.10.7:5174`

**Action Required**:
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Remove development URLs from production
- [ ] Ensure `NODE_ENV=production` is set
- [ ] Test CORS with production domain

**Production .env**:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

---

## 📋 Pre-Deployment Checklist

### Environment Configuration

#### Backend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT` (default 5000 or as per hosting)
- [ ] `MONGO_URI` (MongoDB Atlas connection string)
- [ ] `FRONTEND_URL` (production domain)
- [ ] `ADMIN_KEY` (strong random secret)
- [ ] `JWT_SECRET` (strong random secret)
- [ ] `RAZORPAY_KEY_ID` (live key)
- [ ] `RAZORPAY_KEY_SECRET` (live secret)
- [ ] `RAZORPAY_WEBHOOK_SECRET` (from Razorpay dashboard)
- [ ] `TWILIO_ACCOUNT_SID` (if using WhatsApp)
- [ ] `TWILIO_AUTH_TOKEN` (if using WhatsApp)
- [ ] `TWILIO_WHATSAPP_FROM` (if using WhatsApp)

#### Frontend Environment Variables
- [ ] `VITE_API_URL` (production backend URL)
- [ ] `VITE_RAZORPAY_KEY_ID` (live public key)
- [ ] `VITE_APP_NAME=Krushnalaya`
- [ ] `VITE_WHATSAPP_NUMBER=+919893578135`
- [ ] `GENERATE_SOURCEMAP=false`

---

### Security Hardening

#### Code Security
- [ ] Remove all `console.log()` statements from production code
- [ ] Remove debug code and comments
- [ ] Verify no hardcoded credentials
- [ ] Check for exposed API keys
- [ ] Verify error messages don't expose sensitive info

#### Server Security
- [ ] Helmet configured ✅ (Already done)
- [ ] CORS properly configured ⚠️ (Needs production URL)
- [ ] Rate limiting enabled ✅ (Already done)
- [ ] XSS protection enabled ✅ (Already done)
- [ ] NoSQL injection protection ✅ (Already done)
- [ ] Input validation on all routes ✅ (Already done)
- [ ] HTTPS/SSL certificate installed
- [ ] Security headers configured

#### Database Security
- [ ] MongoDB authentication enabled
- [ ] Database user with minimal permissions
- [ ] IP whitelist configured
- [ ] Connection string encrypted
- [ ] Backup strategy in place
- [ ] Indexes optimized

#### Payment Security
- [ ] Razorpay signature verification ✅ (Already done)
- [ ] Webhook signature verification ✅ (Already done)
- [ ] Payment amount validation ✅ (Already done)
- [ ] Duplicate payment prevention ✅ (Already done)
- [ ] Live keys configured
- [ ] Webhook URL registered

---

### Performance Optimization

#### Frontend
- [ ] Build production bundle: `npm run build`
- [ ] Verify bundle size is reasonable
- [ ] Test lazy loading works
- [ ] Optimize images (compress, WebP format)
- [ ] Enable gzip/brotli compression
- [ ] Configure CDN (optional)
- [ ] Test mobile performance

#### Backend
- [ ] Database indexes created
- [ ] Query optimization verified
- [ ] Response caching configured (if needed)
- [ ] Connection pooling configured
- [ ] Memory leaks checked

---

### Functionality Testing

#### Critical Flows
- [ ] User can view services
- [ ] User can book appointment
- [ ] Payment flow works end-to-end
- [ ] Payment success updates booking
- [ ] Payment failure handled gracefully
- [ ] Booking confirmation sent
- [ ] Contact form works
- [ ] Admin login works
- [ ] Admin can view bookings
- [ ] Admin can manage content

#### Edge Cases
- [ ] Duplicate booking prevention
- [ ] Invalid payment signature handling
- [ ] Network failure handling
- [ ] Form validation errors
- [ ] Rate limiting triggers correctly
- [ ] CORS errors handled

#### Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Payment modal works
- [ ] Bottom navigation works

#### Desktop Testing
- [ ] Layout optimized ✅ (Already done)
- [ ] All sections display correctly
- [ ] Forms are usable
- [ ] Payment flow works
- [ ] Navigation works

---

### Monitoring & Logging

#### Setup Required
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Performance monitoring (New Relic, DataDog, etc.)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Log aggregation (CloudWatch, Papertrail, etc.)
- [ ] Analytics (Google Analytics, Plausible, etc.)

#### Alerts
- [ ] Server down alerts
- [ ] High error rate alerts
- [ ] Payment failure alerts
- [ ] Database connection alerts
- [ ] Disk space alerts

---

### Backup & Recovery

#### Backup Strategy
- [ ] Database automated backups (daily)
- [ ] Code repository backed up (Git)
- [ ] Environment variables documented securely
- [ ] SSL certificates backed up
- [ ] Recovery procedure documented
- [ ] Test restore process

---

### Documentation

#### Required Documentation
- [ ] API documentation
- [ ] Deployment procedure
- [ ] Environment setup guide
- [ ] Troubleshooting guide
- [ ] Admin user guide
- [ ] Backup/restore procedure
- [ ] Incident response plan

---

### Deployment Steps

#### Pre-Deployment
1. [ ] Run all tests
2. [ ] Build production bundles
3. [ ] Verify environment variables
4. [ ] Create database backup
5. [ ] Review security checklist

#### Deployment
1. [ ] Deploy backend to hosting (Heroku, AWS, DigitalOcean, etc.)
2. [ ] Deploy frontend to hosting (Vercel, Netlify, AWS S3, etc.)
3. [ ] Configure domain and SSL
4. [ ] Update DNS records
5. [ ] Configure Razorpay webhook URL
6. [ ] Test production deployment

#### Post-Deployment
1. [ ] Verify all functionality works
2. [ ] Test payment flow with small amount
3. [ ] Monitor error logs
4. [ ] Check performance metrics
5. [ ] Verify backups are running
6. [ ] Update documentation

---

## 🔧 Recommended Hosting Options

### Backend Hosting
- **Heroku**: Easy deployment, free tier available
- **AWS EC2**: Full control, scalable
- **DigitalOcean**: Simple, affordable
- **Railway**: Modern, easy to use
- **Render**: Free tier, auto-deploy from Git

### Frontend Hosting
- **Vercel**: Optimized for React, free tier
- **Netlify**: Easy deployment, free tier
- **AWS S3 + CloudFront**: Scalable, CDN included
- **GitHub Pages**: Free for static sites

### Database
- **MongoDB Atlas**: Free tier, managed service
- **AWS DocumentDB**: MongoDB-compatible
- **Self-hosted**: Full control, more maintenance

---

## 🚨 Emergency Contacts & Procedures

### Critical Issues
- **Payment failures**: Check Razorpay dashboard
- **Server down**: Check hosting provider status
- **Database issues**: Check MongoDB Atlas
- **Security breach**: Rotate all credentials immediately

### Rollback Procedure
1. Revert to previous Git commit
2. Redeploy previous version
3. Restore database backup if needed
4. Notify users if necessary

---

## ✅ Final Verification

Before going live, verify:
- [ ] All secrets are strong and unique
- [ ] No credentials in code or Git history
- [ ] HTTPS is working
- [ ] Payment flow works with live keys
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Team has access to all systems
- [ ] Documentation is complete

---

## 📞 Support & Maintenance

### Regular Maintenance
- Weekly: Check error logs
- Weekly: Review payment transactions
- Monthly: Security updates
- Monthly: Performance review
- Quarterly: Backup restore test
- Yearly: Security audit

### Updates
- Keep dependencies updated
- Monitor security advisories
- Test updates in staging first
- Have rollback plan ready

---

## 🎯 Post-Launch Checklist

### Week 1
- [ ] Monitor error rates daily
- [ ] Check payment success rate
- [ ] Review user feedback
- [ ] Fix critical bugs immediately

### Month 1
- [ ] Analyze user behavior
- [ ] Optimize slow queries
- [ ] Review security logs
- [ ] Plan feature improvements

---

**Last Updated**: [Current Date]
**Reviewed By**: [Your Name]
**Next Review**: [Date]
