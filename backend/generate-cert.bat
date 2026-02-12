@echo off
echo Generating self-signed SSL certificate...
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
echo Done! cert.pem and key.pem created.
pause
