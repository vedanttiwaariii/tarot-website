# 📱 Mobile Razorpay Fix - HTTPS Setup

## Problem
Razorpay test mode requires HTTPS on real mobile devices (but works on desktop without it).

## Solution: Enable HTTPS

### Step 1: Generate SSL Certificates

**Backend:**
```bash
cd backend
generate-cert.bat
```

**Frontend:**
```bash
cd frontend
generate-cert.bat
```

### Step 2: Restart Servers

**Backend:**
```bash
cd backend
npm run dev
```
Should show: `🔒 URL: https://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
Should show: `https://192.168.10.7:5173`

### Step 3: Accept Certificate on Phone

1. Open Chrome on your phone
2. Go to `https://192.168.10.7:5173`
3. Click "Advanced" → "Proceed to 192.168.10.7 (unsafe)"
4. Also visit `https://192.168.10.7:5000/api/health` and accept
5. Now Razorpay will work!

## Alternative: Quick Test (No HTTPS)

If you just want to test quickly without HTTPS:

1. Revert `.env` files to use `http://` instead of `https://`
2. Use **Chrome on Android** (best Razorpay support)
3. Ensure phone is on same WiFi
4. Disable any ad blockers on phone

## Troubleshooting

**Certificate Error on Desktop:**
- Click "Advanced" → "Proceed to localhost (unsafe)"
- This is normal for self-signed certificates

**Still not working on phone:**
1. Check firewall: Allow port 5000 and 5173
2. Verify phone can access: `https://192.168.10.7:5173`
3. Clear browser cache on phone
4. Try incognito mode on phone

**OpenSSL not found:**
- Install Git for Windows (includes OpenSSL)
- Or download from: https://slproweb.com/products/Win32OpenSSL.html
