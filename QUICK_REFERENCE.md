# 🚀 Quick Reference - Service Content Management

## ⚡ Quick Start (30 seconds)

```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm start

# Go to: Admin Dashboard → Services tab → Edit → Save
```

## 🎯 What It Does

**Admin edits content** → **Saves to database** → **Website updates automatically**

## 📍 Where to Find It

```
Your Website
  └─ Admin Dashboard (login required)
      └─ Services Tab ← HERE
          ├─ Tarot Reading [Edit]
          ├─ Reiki Healing [Edit]
          └─ Water Divination [Edit]
```

## ✏️ What You Can Edit

| Field | Description | Example |
|-------|-------------|---------|
| Title | Service name | "Tarot Reading" |
| Short Desc | Card preview (200 max) | "Gain clarity and insight..." |
| Full Desc | Detailed explanation | "Experience profound insights..." |
| Features | Bullet points (one/line) | "Personalized interpretation" |
| Duration | Session length | "45-60 minutes" |
| Active | Show/hide on website | ☑ Checked = Visible |

## 🔄 Workflow

1. **Edit** → Click Edit button
2. **Change** → Modify text fields
3. **Save** → Click Save Changes
4. **Refresh** → Reload website (F5)
5. **See** → Changes appear!

## 🎨 Tips

- **Short Description**: Keep under 200 chars (counter shows remaining)
- **Features**: Press Enter for new line (one feature per line)
- **Duration**: Be specific (e.g., "30 minutes" or "45-60 minutes")
- **Active Toggle**: Uncheck to hide service temporarily

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes not showing | Refresh website (F5) |
| Can't save | Check all required fields filled |
| Service disappeared | Check "Active" checkbox is checked |
| Edit button not working | Ensure you're logged in as admin |

## 📞 API Endpoints

```
GET  /api/services              → Get all active services (public)
GET  /api/services/:type        → Get single service (public)
PUT  /api/services/:type        → Update service (admin only)
GET  /api/services/admin/all    → Get all services (admin only)
```

## 🔐 Security

- ✅ JWT authentication required for editing
- ✅ Public can only view
- ✅ Input validation on all fields
- ✅ XSS protection enabled

## 📊 Service Types

- `tarot` - Tarot Reading
- `reiki` - Reiki Healing
- `water-divination` - Water Divination (Jal Jyotish)

## 💡 Pro Tips

1. **Preview before saving**: Read your changes in the form
2. **Use clear language**: Write for your customers
3. **Keep features concise**: Short, impactful bullet points
4. **Test on mobile**: Check how it looks on phone
5. **Backup important text**: Copy before major changes

## 🎯 Common Tasks

### Change Service Title
```
Services → Tarot Reading → Edit
Title: [New Title Here]
Save Changes
```

### Add New Feature
```
Services → Service → Edit
Features: (add new line at end)
  Existing feature 1
  Existing feature 2
  + Your new feature here
Save Changes
```

### Hide Service Temporarily
```
Services → Service → Edit
☐ Uncheck "Active (visible on website)"
Save Changes
```

### Update Description
```
Services → Service → Edit
Full Description: [Your new description]
Save Changes
```

## ✅ Checklist

Before going live with changes:
- [ ] Spelling and grammar checked
- [ ] Short description under 200 chars
- [ ] Features are clear and concise
- [ ] Duration is accurate
- [ ] Active checkbox is checked
- [ ] Tested on website (refreshed page)

## 🎊 That's It!

Simple, powerful, and fully functional. Start editing! 🚀

---

**Need detailed docs?** See `IMPLEMENTATION_COMPLETE.md`
