# Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code changes committed to Git
- [ ] `nixpacks.toml` file exists (for Nixpacks deployment)
- [ ] `Dockerfile` file exists (for Docker deployment)
- [ ] `server/requirements.txt` exists with all Python dependencies
- [ ] Environment variables prepared

## 📝 Required Files

### Configuration Files
- ✅ `nixpacks.toml` - Nixpacks configuration (LibreOffice, Python, Poppler)
- ✅ `Dockerfile` - Docker configuration (alternative to Nixpacks)
- ✅ `server/requirements.txt` - Python dependencies
- ✅ `.railwayignore` - Files to exclude from deployment

### Code Files
- ✅ `server/conversionQueue.ts` - Updated with Linux path support
- ✅ `server/routes.ts` - Updated with Linux path support
- ✅ `server/pdf_converter.py` - Python converter script

## 🔧 Railway Setup Steps

### 1. Create Railway Project
```
1. Go to https://railway.app/
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects configuration
```

### 2. Configure Environment Variables

Add these in Railway Settings → Variables:

```env
# Required
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Optional - Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Optional - Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your_account_id.r2.cloudflarestorage.com

# Auto-configured by Railway
PORT=5000
NODE_ENV=production
```

### 3. Deploy

Railway will automatically:
- ✅ Install LibreOffice
- ✅ Install Python 3.11 & pip
- ✅ Install Poppler
- ✅ Install Node.js dependencies
- ✅ Install Python dependencies
- ✅ Build the application
- ✅ Start the server

## 🧪 Post-Deployment Testing

### 1. Check Health Endpoint

Visit: `https://your-app.railway.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T...",
  "dependencies": {
    "libreoffice": true,
    "python": true,
    "poppler": true,
    "r2Storage": true
  },
  "platform": "linux"
}
```

### 2. Check Railway Logs

Look for:
```
✓ LibreOffice detected: soffice - LibreOffice 7.x.x
serving on port 5000
```

### 3. Test Conversions

**Test 1: Office → PDF**
- Upload `.docx`, `.xlsx`, or `.pptx` file
- Should convert successfully

**Test 2: PDF → Word**
- Upload `.pdf` file
- Select "Word" format
- Should convert successfully

**Test 3: PDF → PowerPoint**
- Upload `.pdf` file
- Select "PowerPoint" format
- Should convert successfully (requires Poppler)

**Test 4: PDF → Excel**
- Upload `.pdf` file with tables
- Select "Excel" format
- Should extract tables successfully

## 🐛 Troubleshooting

### Issue: LibreOffice not detected

**Check:**
1. Railway logs show "✓ LibreOffice detected"?
2. Health endpoint shows `"libreoffice": true`?

**Fix:**
1. Verify `nixpacks.toml` includes `libreoffice`
2. Redeploy the application
3. Check build logs for installation errors

### Issue: Python dependencies missing

**Check:**
1. `server/requirements.txt` exists?
2. Build logs show "pip install -r server/requirements.txt"?

**Fix:**
1. Commit `server/requirements.txt` to Git
2. Verify `nixpacks.toml` install phase includes pip install
3. Redeploy

### Issue: Poppler not found

**Check:**
1. PDF → PowerPoint conversion fails?
2. Health endpoint shows `"poppler": false`?

**Fix:**
1. Verify `nixpacks.toml` includes `poppler_utils`
2. Redeploy the application

### Issue: Build fails

**Solution 1: Switch to Docker**
```
Railway Settings → Build → Select "Docker"
```

**Solution 2: Check Build Logs**
- Look for specific error messages
- Verify all dependencies are listed correctly

### Issue: Files not persisting

**Cause:** Railway containers are ephemeral

**Solution:** Configure Cloudflare R2 storage
- Add R2 environment variables
- Files will be stored in R2 instead of local filesystem

## 🔄 Updating Deployment

To deploy changes:
```
1. Commit changes to Git
2. Push to GitHub
3. Railway auto-deploys
```

Or manually redeploy:
```
Railway Dashboard → Deployments → Redeploy
```

## 📊 Monitoring

### Check Application Logs
```
Railway Dashboard → Your Project → Logs
```

### Monitor Metrics
```
Railway Dashboard → Your Project → Metrics
- CPU usage
- Memory usage
- Network traffic
```

## 🎉 Success Indicators

- ✅ Health endpoint returns all dependencies as `true`
- ✅ Railway logs show "✓ LibreOffice detected"
- ✅ Office → PDF conversion works
- ✅ PDF → Office conversion works
- ✅ No error messages in logs
- ✅ Application is accessible via Railway URL

## 📚 Additional Resources

- [Railway Deployment Guide](RAILWAY_DEPLOYMENT.md) - Detailed guide
- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/)

## Need Help?

1. Check Railway logs for error messages
2. Visit health endpoint: `/api/health`
3. Review [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
4. Check Railway community: https://discord.gg/railway
