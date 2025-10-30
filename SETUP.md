# 🔧 Setup Guide

## Environment Configuration

This application uses environment variables to securely store sensitive information like API keys.

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Or on Windows:

```cmd
copy .env.example .env
```

### Step 2: Configure API Key

Open the `.env` file and update it with your API key:

```env
VITE_API_BASE_URL=https://unreliableunicorn-api.onrender.com
VITE_API_KEY=dev-unreliable-unicorn-api-key-2024
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

## 🔐 Security Notes

### Important Security Practices:

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Don't share your API key** - Keep it private
3. **Use different keys for different environments** - Production vs Development
4. **Rotate keys regularly** - Change them periodically for security

### How the API Key Works:

The API key is automatically added to all HTTP requests via Axios interceptors:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
})
```

All API endpoints are now protected and require this header.

## 🚀 Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)
2. **Never include `.env` in version control**
3. **Use production API keys** instead of development keys

### Example for Vercel:

```bash
vercel env add VITE_API_BASE_URL
vercel env add VITE_API_KEY
```

### Example for Netlify:

Add environment variables in: Site settings → Build & deploy → Environment

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Base URL for the UnreliableUnicorn API | Yes |
| `VITE_API_KEY` | API key for authentication | Yes |

## 🆘 Troubleshooting

### Issue: "API key is missing"

**Solution:** Make sure you:
1. Created the `.env` file
2. Added the `VITE_API_KEY` variable
3. Restarted the dev server after creating `.env`

### Issue: "401 Unauthorized"

**Solution:** Your API key might be incorrect. Double-check the key in `.env`

### Issue: Environment variables not loading

**Solution:**
1. Restart the Vite dev server
2. Make sure variable names start with `VITE_`
3. Check that `.env` is in the project root directory
