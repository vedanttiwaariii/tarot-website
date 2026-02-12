# 🔮 Krushnalaya - Complete Spiritual Services Website

A modern, full-stack website for spiritual services including Tarot Reading, Reiki Healing, and Water Divination with integrated Razorpay payment system.

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX**: Mystical design with deep purple, midnight blue, gold accents
- **Responsive Design**: Mobile-first approach, fully responsive
- **Smooth Animations**: Framer Motion animations and transitions
- **Interactive Components**: Service cards, booking forms, contact forms
- **Form Validation**: React Hook Form with autofill support
- **Payment Integration**: Complete Razorpay payment flow

### 🚀 Backend Features
- **RESTful API**: Clean API endpoints for bookings, contact, and payments
- **Payment Processing**: Complete Razorpay integration with webhooks
- **Data Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: Protection against spam and abuse
- **Security**: Helmet, CORS, XSS protection, NoSQL injection prevention
- **Admin Dashboard**: Complete booking and message management

### 💳 Payment Features
- **Razorpay Integration**: Test and production ready
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Secure Processing**: Signature verification and webhook handling
- **Error Handling**: Comprehensive payment failure management
- **Access Codes**: Skip payment for special bookings

## 🏗 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Razorpay SDK** for payments
- **Express Validator** for validation
- **Rate Limiting** and security middleware
- **JWT** authentication for admin

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- Razorpay account (test mode)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd tarot-website

# Run setup script
# Windows:
setup.bat

# Linux/Mac:
chmod +x setup.sh
./setup.sh
```

### 2. Configure Razorpay
1. Get your keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Update `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
```

### 3. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 4. Test Integration
Open `razorpay-test.html` in your browser to test the payment flow.

## 📁 Project Structure

```
tarot-website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PaymentButton.jsx     # Reusable payment component
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Main page with booking
│   │   │   ├── AdminDashboard.jsx    # Admin panel
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── razorpayHandler.js    # Payment flow logic
│   │   ├── config/
│   │   │   └── api.js                # API configuration
│   │   └── ...
│   ├── .env                          # Frontend environment
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── payments.js               # Enhanced payment routes
│   │   ├── bookings.js
│   │   └── ...
│   ├── models/
│   │   ├── Booking.js
│   │   └── ...
│   ├── .env                          # Backend environment
│   └── server.js                     # Enhanced server config
├── razorpay-test.html                # Payment testing tool
├── setup.bat / setup.sh              # Setup scripts
└── README.md
```

## 💳 Payment Flow

1. **User fills booking form** → Form validation
2. **Submit booking** → Create booking in database
3. **Payment required** → Create Razorpay order
4. **Open payment modal** → User completes payment
5. **Verify signature** → Update booking status
6. **Confirmation** → Show success message

## 🧪 Testing

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Testing Steps
1. Open `razorpay-test.html`
2. Click "Check SDK" → Should be green
3. Click "Test Backend" → Should connect
4. Click "Create Order" → Should create order
5. Click "Start Payment" → Modal should open
6. Use test card → Payment should complete

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tarot-website
NODE_ENV=development

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here

# Admin
ADMIN_KEY=your_admin_key
JWT_SECRET=your_jwt_secret
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_here
REACT_APP_NAME=Krushnalaya
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Express Validator with sanitization
- **XSS Protection**: Custom XSS filtering
- **NoSQL Injection**: Mongoose sanitization
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Payment Security**: Signature verification

## 📊 API Endpoints

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature
- `POST /api/payments/failure` - Handle payment failures
- `POST /api/payments/webhook` - Razorpay webhook handler
- `GET /api/payments/config` - Get public key

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/available-slots/:date` - Get time slots
- `PUT /api/bookings/cancel-all` - Cancel all bookings (Admin)
- `DELETE /api/bookings/delete-cancelled` - Delete cancelled bookings (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (Admin)

## 🚀 Production Deployment

### Before Going Live
1. Switch to live Razorpay keys
2. Set `NODE_ENV=production`
3. Configure webhook URL in Razorpay dashboard
4. Update CORS origins
5. Set up SSL certificate
6. Configure MongoDB Atlas
7. Set up monitoring and logging

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Razorpay webhooks configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backup strategy in place

## 🐛 Troubleshooting

### Common Issues

**Razorpay Modal Not Opening**
- Check if script is loaded: `console.log(window.Razorpay)`
- Verify order creation in backend logs
- Check browser console for errors

**Payment Verification Failed**
- Verify Razorpay secret key
- Check signature format
- Ensure all three values (order_id, payment_id, signature) are received

**CORS Errors**
- Update CORS configuration in server.js
- Check frontend API base URL

### Debug Mode
Set `NODE_ENV=development` for detailed logging.

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review browser console and backend logs
- Test with `razorpay-test.html`
- Verify Razorpay dashboard for payment status

## 🎉 Features Completed

✅ **Complete payment integration**  
✅ **Form validation with autofill support**  
✅ **Admin dashboard with booking management**  
✅ **Responsive design**  
✅ **Security hardening**  
✅ **Error handling**  
✅ **Testing tools**  
✅ **Setup automation**  

## 📝 License

MIT License - Built for spiritual seekers and healing practitioners.

---

**🔮 Ready to serve spiritual seekers with modern technology! ✨**