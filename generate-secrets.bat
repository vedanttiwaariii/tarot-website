@echo off
echo ========================================
echo Krushnalaya - Production Secrets Generator
echo ========================================
echo.

echo Generating strong random secrets...
echo.

echo ADMIN_KEY:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.

echo JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.

echo RAZORPAY_WEBHOOK_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.

echo ========================================
echo IMPORTANT:
echo 1. Copy these secrets to your .env.production file
echo 2. NEVER commit .env.production to Git
echo 3. Store these secrets securely
echo 4. Use different secrets for production and development
echo ========================================
echo.

pause
