@echo off
echo Generating self-signed SSL certificate for frontend...
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=192.168.10.7"
echo Certificate generated successfully!
pause
