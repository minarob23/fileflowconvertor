# Quick Railway Diagnosis Guide

## 🔍 Check These Things on Railway

### 1. Check Railway Logs

Look for the startup verification output:

```
🔍 Verifying dependencies...
✅ Python virtual environment activated
📄 Checking LibreOffice...
✅ LibreOffice found: LibreOffice X.X.X
🐍 Checking Python...
✅ Python found: Python 3.11.X
📦 Checking Python packages...
✅ pdf2docx installed
✅ tabula-py installed
✅ openpyxl installed
✅ python-pptx installed
✅ pdf2image installed
✅ Pillow installed
```

### 2. Check Build Method

**In Railway Dashboard:**
- Go to: Project → Settings → Build
- Check which method is selected:
  - ✅ **Docker** (Recommended - uses Dockerfile)
  - ⚠️ Nixpacks (May have issues with Python venv)

**If using Nixpacks, switch to Docker:**
1. Settings → Build → Select "Docker"
2. Redeploy

### 3. Check Health Endpoint

Visit: `https://your-app.railway.app/api/health`

Should return:
```json
{
  "status": "ok",
  "dependencies": {
    "libreoffice": true,
    "python": true,
    "pythonPackages": true,
    "poppler": true,
    "java": true
  }
}
```

**If `pythonPackages: false`:**
- Python packages not installed correctly
- Switch to Docker build method
- Check build logs for errors

### 4. Environment Variables in Railway

Make sure these are set:
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret
JWT_SECRET=your-secret
NODE_ENV=production
```

**DO NOT** set `VIRTUAL_ENV` or `PATH` manually - Docker handles this.

### 5. Check Specific Error Messages

When conversion fails, check Railway logs for:

**"No module named 'pdf2docx'":**
- Python packages not installed
- Switch to Docker build
- Verify `server/requirements.txt` exists

**"python3: command not found":**
- Python not installed
- Check Docker build logs
- Ensure Dockerfile completed successfully

**"Unable to get page count":**
- Poppler not installed
- Check Docker build includes `poppler-utils`

### 6. Force Clean Rebuild

If issues persist:

```bash
# In Railway Dashboard
Settings → Clear Build Cache → Redeploy

# Or push empty commit
git commit --allow-empty -m "Force rebuild"
git push
```

### 7. Test Locally with Docker

Before deploying to Railway, test locally:

```bash
# Build Docker image
docker build -t fileflow-test .

# Run container
docker run -p 5000:5000 fileflow-test

# Test conversions
# Upload file at http://localhost:5000
```

If it works locally but not on Railway:
- Environment variable mismatch
- Check Railway environment variables
- Ensure all files committed to Git

### 8. Quick Fix Checklist

- [ ] Using Docker build method (not Nixpacks)
- [ ] `Dockerfile` exists in repository root
- [ ] `server/requirements.txt` exists
- [ ] `start.sh` is executable
- [ ] Build logs show all packages installed
- [ ] Runtime logs show ✅ for all dependencies
- [ ] Health endpoint returns all `true`

### 9. Common Railway Issues

**Build succeeds but packages missing:**
- Clear build cache and redeploy

**"externally-managed-environment" error:**
- Fixed in Dockerfile with virtual environment
- Make sure using latest Dockerfile

**Python venv not activated:**
- Check `start.sh` includes venv activation
- Ensure `PATH` set in Dockerfile

### 10. Get More Info

**Check detailed logs:**
```
Railway Dashboard → Your Project → View Logs
```

**Filter for errors:**
```
Search logs for: "❌"
```

**Check build process:**
```
Deployments → Latest → Build Logs
```

## 🚀 Recommended Action Now

1. **Switch to Docker build:**
   - Railway Settings → Build → Docker
   
2. **Redeploy:**
   - Railway will rebuild with Dockerfile
   
3. **Check logs:**
   - Should see all ✅ marks
   
4. **Test conversions:**
   - Try PDF → Word
   - Check Railway logs for any errors

## 📞 Still Not Working?

Check Railway logs and share:
1. The exact error message
2. Output from `/api/health` endpoint
3. Build method (Docker or Nixpacks)
4. First 50 lines of runtime logs
