# Railway Deployment Guide

This guide will help you deploy FileFlowConvertor to Railway with all required dependencies (LibreOffice, Python, Poppler).

## Prerequisites

- A Railway account (https://railway.app/)
- Your GitHub repository connected to Railway
- Environment variables configured

## Deployment Options

Railway supports two deployment methods:

### Option 1: Using Nixpacks (Recommended)

Railway will automatically use the `nixpacks.toml` file in your repository.

**Configuration is already set up in `nixpacks.toml`:**
```toml
[phases.setup]
nixPkgs = ["...", "libreoffice", "python311", "python311Packages.pip", "poppler_utils"]
```

This automatically installs:
- ✅ LibreOffice (for Office → PDF conversion)
- ✅ Python 3.11 and pip (for PDF → Office conversion)
- ✅ Poppler (for PDF → PowerPoint conversion)

### Option 2: Using Docker

Railway can also use the `Dockerfile` provided in the repository.

To use Docker instead of Nixpacks:
1. Go to your Railway project settings
2. Under "Build", select "Docker" as the build method
3. Railway will automatically use the `Dockerfile`

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `fileflowconvertor` repository
5. Railway will automatically detect the configuration

### 2. Configure Environment Variables

In Railway project settings, add these environment variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_xxx@ep-xxx.neon.tech/neondb?sslmode=require

# Session & JWT Secrets
SESSION_SECRET=your-secret-key-change-this-in-production
JWT_SECRET=your-jwt-secret-change-this-in-production-make-it-long-and-random

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your_account_id.r2.cloudflarestorage.com

# Port (Railway sets this automatically)
PORT=5000

# Node Environment
NODE_ENV=production
```

### 3. Deploy

Railway will automatically:
1. Install system dependencies (LibreOffice, Python, Poppler)
2. Install Node.js dependencies (`npm install`)
3. Install Python dependencies (`pip install -r server/requirements.txt`)
4. Build the application (`npm run build`)
5. Start the server (`npm run start`)

### 4. Verify Deployment

After deployment, check the logs for:
```
✓ LibreOffice detected: soffice
```

This confirms LibreOffice is properly installed.

## Testing Conversions

### Test Office → PDF Conversion
1. Upload a `.docx`, `.xlsx`, or `.pptx` file
2. Select "Convert to PDF"
3. Check the conversion completes successfully

### Test PDF → Office Conversion
1. Upload a `.pdf` file
2. Select target format (Word, Excel, or PowerPoint)
3. Verify the conversion works

## Troubleshooting

### LibreOffice Not Found

**Symptom:** Error message "LibreOffice is not installed"

**Solution:**
1. Verify `nixpacks.toml` includes `libreoffice` in nixPkgs
2. Or ensure `Dockerfile` installs LibreOffice
3. Redeploy the application
4. Check Railway logs for "✓ LibreOffice detected"

### Python Dependencies Missing

**Symptom:** PDF to Office conversion fails with "No module named 'pdf2docx'"

**Solution:**
1. Ensure `server/requirements.txt` exists and contains all dependencies
2. Verify `nixpacks.toml` or `Dockerfile` runs `pip install -r server/requirements.txt`
3. Check Railway build logs for successful pip installation
4. Redeploy if necessary

### Poppler Not Installed

**Symptom:** PDF to PowerPoint fails with "Unable to get page count"

**Solution:**
1. Verify `nixpacks.toml` includes `poppler_utils`
2. Or ensure `Dockerfile` installs `poppler-utils`
3. Redeploy the application

### Build Failures

**If Nixpacks build fails:**
- Switch to Docker: Settings → Build → Select "Docker"
- Dockerfile includes all dependencies explicitly

**If Docker build fails:**
- Check Railway logs for specific error
- Verify all files are committed to Git
- Ensure `server/requirements.txt` is present

## File Storage

### Local Storage (Default)
Files are stored in the container's filesystem. **Note:** Railway containers are ephemeral, so files may be lost on restart.

### Cloudflare R2 (Recommended)
Configure R2 environment variables for persistent storage:
- Files automatically upload to R2 after conversion
- Download links use presigned R2 URLs
- Files persist across deployments

## Database

The application uses PostgreSQL (Neon recommended):
1. Create a Neon database: https://neon.tech/
2. Add `DATABASE_URL` to Railway environment variables
3. Run migrations if needed

## Custom Domain (Optional)

1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Deployments**: History of all deployments

Check logs regularly for:
- ✓ LibreOffice detected
- Conversion successes/failures
- Error messages

## Cost Optimization

Railway offers:
- Free tier with limited resources
- Pay-as-you-go pricing
- Automatic scaling

**Tips:**
- Use R2 storage to avoid local file storage issues
- Monitor usage in Railway dashboard
- Set up usage alerts

## Support

If you encounter issues:
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Test locally first using `npm run dev`
4. Review build logs for dependency installation errors

## Updating Your Deployment

To deploy updates:
1. Push changes to your GitHub repository
2. Railway automatically detects changes and redeploys
3. Monitor deployment status in Railway dashboard

Or manually trigger a deployment:
- Railway Dashboard → Your Project → Deployments → "Redeploy"

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/)
- [Docker Documentation](https://docs.docker.com/)
- [LibreOffice Headless Mode](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html)
