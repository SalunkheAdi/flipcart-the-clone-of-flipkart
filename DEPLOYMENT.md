# Deployment Guide - Flipcart Clone

Complete guide to deploy your e-commerce application to production.

## Deployment Options

### Backend Deployment Options
1. **Render** (Recommended - Free tier available)
2. **Railway**
3. **Heroku**
4. **AWS, Google Cloud, Azure**

### Frontend Deployment Options
1. **Vercel** (Recommended - Free tier available)
2. **Netlify**
3. **GitHub Pages**
4. **AWS S3 + CloudFront**

---

## Option 1: Deploy Backend on Render (Recommended)

### Prerequisites
- Render account (sign up at https://render.com)
- GitHub account with your code pushed

### Step 1: Create Render PostgreSQL Database

1. Go to https://render.com/dashboard
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: `flipcart-db`
   - Region: Choose closest to users
   - PostgreSQL Version: 15
4. Create database (takes ~2 minutes)
5. Copy connection details

### Step 2: Initialize Database Schema

1. From your local machine:
```bash
# Use Render's connection string
psql [connection-string] < backend/database/schema.sql

# Or copy schema and execute in Render's query tool
```

2. Seed initial data:
```bash
# Modify seed.js to use Render connection temporarily
# Or use pgAdmin/DBeaver to execute seed manually
```

### Step 3: Deploy Backend Service

1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Connect GitHub:
   - Authorize Render
   - Select your repository
4. Configure:
   - Name: `flipcart-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Region: Same as database
   - Plan: Free (or Starter)

### Step 4: Set Environment Variables

In Render dashboard, add environment variables:

```
DB_USER=postgres
DB_PASSWORD=[from Render DB details]
DB_HOST=[external connection host from Render]
DB_PORT=5432
DB_NAME=[database name from Render]
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render automatically deploys from main branch
3. View logs in dashboard
4. Get your backend URL: `https://flipcart-backend.onrender.com`

### Step 6: Verify Deployment

```bash
# Test health check
curl https://flipcart-backend.onrender.com/api/health

# Get products
curl https://flipcart-backend.onrender.com/api/products
```

---

## Option 2: Deploy Frontend on Vercel (Recommended)

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository
- Backend URL from previous deployment

### Step 1: Update Backend URL in Code

Edit `frontend/.env.production`:
```
VITE_API_URL=https://flipcart-backend.onrender.com/api
```

Or set it as environment variable in Vercel.

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Set Environment Variables

In Vercel project settings:
- Go to "Settings" → "Environment Variables"
- Add: `VITE_API_URL=https://flipcart-backend.onrender.com/api`

### Step 4: Deploy

1. Click "Deploy"
2. Vercel builds and deploys automatically
3. Get your frontend URL: `https://flipcart-clone.vercel.app`

### Step 5: Configure Auto-Deployment

- Vercel automatically deploys on push to main
- Disable auto-deploy if needed in project settings

---

## Alternative: Deploy Backend on Railway

### Step 1: Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### Step 2: Create PostgreSQL Database
1. New Project → Provision PostgreSQL
2. Copy connection string

### Step 3: Create Web Service
1. New Project → GitHub repo
2. Set environment variables
3. Set start command: `npm start`

### Step 4: Deploy
- Railway auto-deploys on push
- Get backend URL from dashboard

---

## Alternative: Deploy on Heroku (with updates)

Heroku removed free tier, but process is:

```bash
# Login to Heroku
heroku login

# Create app
heroku create flipcart-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## Step-by-Step Full Deployment

### Timeline: ~15 minutes

**Preparation (2 min)**
- [ ] Commit and push latest code to GitHub
- [ ] Verify app works locally

**Backend Deployment (6 min)**
- [ ] Create Render PostgreSQL database
- [ ] Initialize schema and seed data
- [ ] Deploy backend service
- [ ] Set environment variables
- [ ] Test backend endpoints

**Frontend Deployment (5 min)**
- [ ] Update .env with backend URL
- [ ] Connect to Vercel
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and verify

**Post-Deployment (2 min)**
- [ ] Test all features
- [ ] Check error logs
- [ ] Set up monitoring

---

## Production Checklist

### Backend
- [ ] Environment variables set correctly
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] CORS configured properly
- [ ] Error logging enabled
- [ ] Health check endpoint working
- [ ] All APIs tested
- [ ] Sensitive data not in logs
- [ ] Database backups configured
- [ ] Monitoring/alerts set up

### Frontend
- [ ] API URL points to production
- [ ] Build optimized
- [ ] No console errors
- [ ] Images optimized
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] Links work correctly
- [ ] Form validation works
- [ ] Error handling tested

### Database
- [ ] Backups enabled
- [ ] Connection pooling configured
- [ ] Indexes created
- [ ] Slow query logs enabled
- [ ] SSL/TLS enabled
- [ ] Access restricted
- [ ] Regular backups scheduled

---

## Environment Variables for Production

### Backend

```env
DB_USER=prod_user
DB_PASSWORD=strong_secure_password
DB_HOST=your-render-db.onrender.com
DB_PORT=5432
DB_NAME=flipcart_prod
PORT=5000
NODE_ENV=production
```

### Frontend

```env
VITE_API_URL=https://your-backend-url/api
```

---

## Testing Production Deployment

### Functional Tests
```bash
# Test each API endpoint
curl https://your-backend-url/api/products
curl https://your-backend-url/api/products/categories
curl https://your-backend-url/api/health

# Test frontend
# 1. Open https://your-frontend-url
# 2. Browse products
# 3. Add to cart
# 4. Complete checkout
# 5. Verify order confirmation
```

### Performance Tests
- Use Lighthouse (DevTools → Lighthouse)
- Check Core Web Vitals
- Test loading speed
- Test API response times

### Security Tests
- Run OWASP ZAP
- Check SSL certificate
- Verify CORS headers
- Test input validation

---

## Monitoring & Maintenance

### Set Up Monitoring

**Render Dashboard**
- Monitor application logs
- Check response times
- Monitor error rates
- Set up alerts

**Vercel Analytics**
- View traffic patterns
- Monitor performance
- Track deployments

### Common Issues & Solutions

**502 Bad Gateway**
- Backend service crashed
- Check Render logs
- Restart service

**CORS Error**
- Frontend can't reach backend
- Check VITE_API_URL
- Verify CORS enabled on backend

**Database Connection Error**
- Connection string incorrect
- Database not running
- Network access blocked

**Slow Performance**
- Add database indexes
- Enable caching
- Optimize images
- Consider upgrading plan

### Regular Maintenance

- Monitor logs weekly
- Check database size
- Review error patterns
- Update dependencies
- Backup data regularly

---

## Cost Breakdown

### Monthly Costs (Approximate)

**Render Free Tier**
- Backend: Free
- PostgreSQL: Free (512 MB limit)
- Cost: $0/month

**Render Paid Tier**
- Backend: $7+/month
- PostgreSQL: $7+/month
- Cost: $14+/month

**Vercel Free Tier**
- Frontend: Free
- Serverless Functions: $0
- Cost: $0/month

**Vercel Paid Tier**
- Pro: $20/month
- Plus: $50/month

### Recommendations
- Start with free tier for testing
- Upgrade when needed
- Monitor usage to optimize costs

---

## Scaling Guide

### When to Scale

- **100+ concurrent users** → Upgrade backend plan
- **Large database** → Add more resources
- **High traffic** → Enable CDN
- **International users** → Use regional deployments

### Scaling Strategies

1. **Database**
   - Add read replicas
   - Implement caching
   - Optimize queries

2. **Backend**
   - Use load balancing
   - Deploy multiple instances
   - Use serverless functions

3. **Frontend**
   - Use CDN
   - Implement lazy loading
   - Optimize bundle size

---

## Troubleshooting Deployment

### Backend Won't Start
```
Check logs: See error message
Common issues:
- Wrong NODE_ENV
- Missing dependencies
- Environment variables not set
- Port already in use
```

### Database Connection Failed
```
Check:
- Connection string correct
- Network access enabled
- Credentials valid
- Database exists
```

### Frontend Not Loading
```
Check:
- Build successful
- API URL correct
- Environment variables set
- Cache cleared
```

### Slow Application
```
Check:
- Database query performance
- API response times
- Frontend bundle size
- Network latency
```

---

## Database Backup Strategy

### Automatic Backups
- Render: Daily backups (free tier) or hourly (paid)
- Set retention period

### Manual Backups
```bash
# Export database
pg_dump postgres://user:pass@host/db > backup.sql

# Restore database
psql postgres://user:pass@host/db < backup.sql
```

### Backup Frequency
- Development: Weekly
- Staging: Daily
- Production: Daily or more frequent

---

## SSL/TLS Certificates

- Render: Automatic SSL (included)
- Vercel: Automatic SSL (included)
- No additional setup needed

---

## Cleanup After Deployment

1. **Verify Everything Works**
   - All APIs respond
   - Frontend loads
   - Shopping flow works
   - Orders save to database

2. **Update Documentation**
   - Update production URLs
   - Document environment setup
   - Note any custom configurations

3. **Remove Local Test Data**
   - Re-seed production database if needed
   - Update admin credentials

4. **Enable Monitoring**
   - Set up error tracking
   - Configure alerts
   - Enable analytics

---

## Post-Deployment Checklist

- [ ] Backend URL working
- [ ] Frontend URL working
- [ ] All pages load
- [ ] Search works
- [ ] Add to cart works
- [ ] Checkout completes
- [ ] Order confirmation shows
- [ ] Database contains orders
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Documentation updated

---

## Going Live Checklist

- [ ] Test all features on production
- [ ] Create admin account
- [ ] Set up email notifications
- [ ] Test error handling
- [ ] Monitor first 24 hours
- [ ] Have rollback plan
- [ ] Document deployment process
- [ ] Train team on production access
- [ ] Set up support process

---

## Rollback Plan

If something goes wrong:

1. **Immediate Action**
   - Render: Click "Rollback" in deployment history
   - Vercel: Select previous deployment
   - Takes ~2-5 minutes

2. **Investigate Issue**
   - Check logs
   - Identify what failed
   - Fix locally

3. **Re-deploy**
   - Commit fixes
   - Push to main
   - Auto-deploys or manual deploy

---

**Your application is now live! 🎉**

Continue monitoring, maintain, and improve your application!
