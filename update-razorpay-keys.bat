@echo off
echo ========================================
echo   Razorpay Credentials Update Helper
echo ========================================
echo.
echo Current credentials in backend/.env:
echo RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
echo RAZORPAY_KEY_SECRET=thisissecretkey
echo.
echo ========================================
echo   How to Get Valid Credentials:
echo ========================================
echo.
echo 1. Go to: https://dashboard.razorpay.com/
echo 2. Sign in or create account
echo 3. Go to Settings -^> API Keys
echo 4. Switch to TEST MODE
echo 5. Copy your test credentials
echo.
echo ========================================
echo.
set /p KEY_ID="Enter your Razorpay Test Key ID (rzp_test_...): "
set /p KEY_SECRET="Enter your Razorpay Test Key Secret: "
echo.

if "%KEY_ID%"=="" (
    echo Error: Key ID cannot be empty
    pause
    exit /b 1
)

if "%KEY_SECRET%"=="" (
    echo Error: Key Secret cannot be empty
    pause
    exit /b 1
)

echo Updating backend/.env...
powershell -Command "(Get-Content 'backend\.env') -replace 'RAZORPAY_KEY_ID=.*', 'RAZORPAY_KEY_ID=%KEY_ID%' | Set-Content 'backend\.env'"
powershell -Command "(Get-Content 'backend\.env') -replace 'RAZORPAY_KEY_SECRET=.*', 'RAZORPAY_KEY_SECRET=%KEY_SECRET%' | Set-Content 'backend\.env'"

echo Updating frontend/.env...
powershell -Command "(Get-Content 'frontend\.env') -replace 'REACT_APP_RAZORPAY_KEY_ID=.*', 'REACT_APP_RAZORPAY_KEY_ID=%KEY_ID%' | Set-Content 'frontend\.env'"

echo.
echo ========================================
echo   Credentials Updated Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C then npm run dev)
echo 2. Restart your frontend (Ctrl+C then npm start)
echo 3. Test payment with razorpay-test.html
echo.
pause
