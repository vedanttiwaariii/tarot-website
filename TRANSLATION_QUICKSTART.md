# Quick Start: Auto-Translation Setup

## ✅ What's Already Done

The auto-translation system is now integrated! Here's what happens automatically:

1. **Admin edits content** → System translates to Hindi
2. **User switches language** → Sees translated content
3. **Fonts preserved** → English and Hindi use different fonts

## 🚀 Getting Started

### Step 1: Start Your Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 2: Test the Translation

1. **Login to Admin Panel**
   - Go to `http://localhost:5173`
   - Click on Admin (login with your credentials)

2. **Edit Content**
   - Go to "Content" tab
   - Click "Edit" on any section (e.g., Hero Title)
   - Change the English text
   - Click "Save"
   - ✨ Hindi translation is generated automatically!

3. **View Translation**
   - Click "हिन्दी देखें" button to see Hindi version
   - Click "Show English" to switch back

4. **Test on Frontend**
   - Go back to home page
   - Click language toggle (🌐 icon in navbar)
   - Switch between English and Hindi
   - Your edited content appears in both languages!

## 🔧 Optional: Google Translate API

For better translations, add Google Translate API key:

1. Get API key: https://cloud.google.com/translate/docs/setup
2. Edit `backend/.env`:
   ```
   GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```
3. Restart backend server

**Note**: Without API key, system uses free LibreTranslate (works fine for most cases)

## 📝 Migrate Existing Content

If you have existing content without Hindi translations:

```bash
cd backend
node scripts/migrateContentTranslations.js
```

This adds Hindi translations to all existing content.

## ✨ Features

- ✅ Auto-translate on save
- ✅ View both languages in admin
- ✅ Preserved fonts (English: Cinzel, Hindi: Tiro Devanagari)
- ✅ Preserved layouts
- ✅ Language toggle on frontend
- ✅ Browser language detection
- ✅ Free translation service (LibreTranslate)
- ✅ Optional Google Translate for better quality

## 🎯 What Gets Translated

Currently auto-translates:
- Hero Title
- Hero Tagline
- Hero Description
- About Journey

All other UI text uses hardcoded translations in `frontend/src/i18n/translations.js`

## 📚 Full Documentation

See `TRANSLATION.md` for complete technical details.

## 🐛 Troubleshooting

**Translation not working?**
- Check backend console for errors
- Verify internet connection (needs to reach LibreTranslate API)
- Try adding Google Translate API key

**Hindi text not showing?**
- Clear browser cache
- Check language selection in navbar
- Verify content was saved in admin panel

**Fonts look wrong?**
- Check `frontend/src/index.css` has both fonts loaded
- Verify language class is applied correctly

## 🎉 You're Done!

Your content management system now automatically translates to Hindi while preserving all fonts and layouts!
