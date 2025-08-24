# Vercel Deployment Guide for Docko Frontend

## ✅ Build Status
- **Build**: Successfully compiled
- **TypeScript**: All types validated
- **ESLint**: All errors resolved
- **Bundle Size**: ~161 KB First Load JS (optimized)

## 📋 Environment Variables Required for Vercel

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```env
# Auth0 Configuration
AUTH0_SECRET='[generate with: openssl rand -hex 32]'
AUTH0_BASE_URL='https://your-vercel-domain.vercel.app'
AUTH0_DOMAIN='https://dev-fmc7kvtfo01myyou.jp.auth0.com'
AUTH0_ISSUER_BASE_URL='https://dev-fmc7kvtfo01myyou.jp.auth0.com'
AUTH0_CLIENT_ID='lIQfcOqhzBiw5OasuM697hy89mFh4oNw'
AUTH0_CLIENT_SECRET='[your-auth0-client-secret]'
AUTH0_SCOPE='openid profile email'

# API Configuration  
NEXT_PUBLIC_API_BASE_URL='https://your-backend-api.com/api/v1'

# App Configuration
NEXT_PUBLIC_APP_NAME='Docko'
NEXT_PUBLIC_APP_URL='https://your-vercel-domain.vercel.app'
```

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production-ready MVP: 3-step document generation workflow"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select your repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Auth0
Update Auth0 Application Settings:
- **Allowed Callback URLs**: 
  ```
  https://your-vercel-domain.vercel.app/api/auth/callback
  ```
- **Allowed Logout URLs**: 
  ```
  https://your-vercel-domain.vercel.app
  ```
- **Allowed Web Origins**: 
  ```
  https://your-vercel-domain.vercel.app
  ```

### 4. Configure Backend CORS
Update your backend to allow requests from:
```
https://your-vercel-domain.vercel.app
```

## 🔍 Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Auth0 redirects working
- [ ] API connection established
- [ ] File upload functionality tested
- [ ] Variable detection working
- [ ] Document export successful
- [ ] Mobile responsive verified

## 📊 Production Features

### Implemented (MVP)
- ✅ Auth0 authentication
- ✅ 3-step document generation workflow
- ✅ Upload & variable detection
- ✅ Variable filling with dynamic forms
- ✅ Export with optional formatting
- ✅ Base64 file storage (sessionStorage)
- ✅ Progress indicators
- ✅ Error handling

### Known Limitations
- File size: ~8MB recommended (sessionStorage limit)
- No document preview (placeholder shown)
- PDF export requires backend implementation
- Single user sessions only

### Future Enhancements
- Server-side file storage
- Document preview
- PDF export
- Batch processing
- Template library
- Team collaboration

## 🐛 Troubleshooting

### Auth0 Errors
- Verify AUTH0_SECRET matches between environments
- Check callback URLs are exact matches
- Ensure AUTH0_BASE_URL uses HTTPS in production

### API Connection Issues
- Verify NEXT_PUBLIC_API_BASE_URL is correct
- Check CORS settings on backend
- Ensure backend is deployed and accessible

### Build Failures
- Clear Vercel cache and redeploy
- Check all environment variables are set
- Verify Node.js version compatibility (18.x or higher)

## 📞 Support

For issues or questions:
- Frontend: Check `/frontend/README.md`
- Backend: Check `/backend/README.md`
- Auth0: Visit Auth0 Dashboard logs