# Service Content Management - Implementation Guide

## ✅ What Was Implemented

### Backend Components
1. **Service Model** (`backend/models/Service.js`)
   - Stores service content (title, descriptions, features, duration)
   - Supports active/inactive toggle
   - Display order management

2. **Service Routes** (`backend/routes/services.js`)
   - `GET /api/services` - Public endpoint for active services
   - `GET /api/services/:serviceType` - Get single service
   - `PUT /api/services/:serviceType` - Admin update service (protected)
   - `GET /api/services/admin/all` - Admin view all services (protected)

3. **Seed Script** (`backend/scripts/seedServices.js`)
   - Populates initial service data from existing content
   - Run with: `npm run seed:services`

### Frontend Components
1. **ServiceManager Component** (`frontend/src/components/ServiceManager.jsx`)
   - Admin interface to edit service content
   - Edit title, descriptions, features, duration
   - Toggle service active/inactive status
   - Real-time preview

2. **Admin Dashboard Integration**
   - New "Services" tab in admin panel
   - Accessible alongside Bookings, Messages, and Content tabs

## 🚀 Setup Instructions

### Step 1: Seed Initial Data
```bash
cd backend
npm run seed:services
```

This will populate the database with initial service content.

### Step 2: Restart Backend
```bash
npm run dev
```

### Step 3: Access Admin Panel
1. Navigate to admin dashboard
2. Login with admin credentials
3. Click on "Services" tab
4. Edit service content as needed

## 📝 How to Use

### Editing Services
1. Go to Admin Dashboard → Services tab
2. Click "Edit" on any service card
3. Modify:
   - **Title**: Service name
   - **Short Description**: Brief summary (max 200 chars)
   - **Full Description**: Detailed explanation
   - **Features**: One per line
   - **Duration**: Session length
   - **Active**: Toggle visibility on website
4. Click "Save Changes"

### Service Fields
- **serviceType**: `tarot`, `reiki`, `water-divination` (fixed, cannot change)
- **title**: Display name
- **shortDescription**: Card preview text (200 char limit)
- **fullDescription**: Expanded description
- **features**: Array of bullet points
- **duration**: e.g., "45-60 minutes"
- **isActive**: Show/hide on website
- **displayOrder**: Sort order (future use)

## 🔄 Next Steps (Optional Enhancements)

### Phase 2: Dynamic Frontend
Currently, the Landing page still uses hardcoded service content. To make it fully dynamic:

1. **Update Landing.jsx** to fetch from `/api/services`
2. **Replace hardcoded service data** with API response
3. **Add loading states** for service cards

### Phase 3: Image Upload
Add image upload functionality:
1. Install `multer` for file uploads
2. Add image upload endpoint
3. Store images in `/public/uploads` or cloud storage
4. Update ServiceManager with image upload UI

### Phase 4: Rich Text Editor
For better content editing:
1. Install `react-quill` or similar
2. Replace textarea with rich text editor
3. Support formatting (bold, italic, lists)

## 📁 Files Created/Modified

### Created:
- `backend/models/Service.js`
- `backend/routes/services.js`
- `backend/scripts/seedServices.js`
- `frontend/src/components/ServiceManager.jsx`
- `SERVICE_MANAGEMENT_GUIDE.md`

### Modified:
- `backend/server.js` - Added services routes
- `backend/package.json` - Added seed script
- `frontend/src/pages/AdminDashboard.jsx` - Added Services tab

## 🎯 Current Status

✅ Backend API complete
✅ Admin UI complete
✅ Seed data ready
⏳ Frontend Landing page still uses hardcoded content (Phase 2)
⏳ Image upload not implemented (Phase 3)

## 🔐 Security

- All admin endpoints protected with JWT authentication
- Input validation on all fields
- XSS protection via sanitization
- Rate limiting applied

## 📊 Database Schema

```javascript
{
  serviceType: String (unique, enum),
  title: String (required),
  shortDescription: String (required, max 200),
  fullDescription: String (required),
  features: [String],
  imageUrl: String,
  duration: String,
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  timestamps: true
}
```

## 🎉 Ready to Use!

The service content management system is now live in your admin panel. Run the seed script and start editing!
