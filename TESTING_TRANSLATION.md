# Testing Auto-Translation System

## Test Scenarios

### Scenario 1: No Database Content (Fresh Install)
**Expected Behavior:**
- English mode: Shows "Krushnalaya" with Cinzel font
- Hindi mode: Shows "कृष्णालय" with Tiro Devanagari font
- All text from `translations.js` file

**How to Test:**
1. Start fresh (no content in database)
2. Switch between English and Hindi
3. Verify fonts and text change correctly

### Scenario 2: Admin Edits Content
**Expected Behavior:**
- Admin edits "Hero Title" to "Welcome to Krushnalaya"
- System auto-translates to Hindi
- English mode: Shows "Welcome to Krushnalaya" with Cinzel font
- Hindi mode: Shows translated version with Tiro Devanagari font

**How to Test:**
1. Login to admin panel
2. Go to Content tab
3. Edit "Hero Title" to "Welcome to Krushnalaya"
4. Click Save (wait for translation)
5. Go to home page
6. Switch to Hindi
7. Verify: Shows Hindi translation with correct font

### Scenario 3: Mixed Content
**Expected Behavior:**
- Some content from database (edited)
- Some content from translations.js (not edited)
- All fonts correct for each language

**How to Test:**
1. Edit only "Hero Title" in admin
2. Leave other sections unedited
3. Switch languages
4. Verify: Edited content shows translated, unedited shows from translations.js

## Font Verification

### English Font (Cinzel Decorative)
- Class: `brand-title` or `font-mystical`
- Should be elegant, decorative serif
- Applied when `language === 'en'`

### Hindi Font (Tiro Devanagari Hindi)
- Class: `brand-title-hindi` or `font-mystical-hindi`
- Should be traditional Devanagari script
- Applied when `language === 'hi'`

## Checklist

- [ ] Fresh install shows correct translations
- [ ] Fresh install shows correct fonts
- [ ] Admin can edit content
- [ ] Translation happens automatically
- [ ] Hindi translation appears in admin
- [ ] Frontend shows translated content
- [ ] Fonts preserved in both languages
- [ ] Layout unchanged
- [ ] Language toggle works
- [ ] Content updates on language switch

## Common Issues

### Issue: Hindi shows English text
**Cause:** Database content not yet translated
**Fix:** 
1. Check if content exists in database
2. Run migration: `node backend/scripts/migrateContentTranslations.js`
3. Or re-save content in admin panel

### Issue: Wrong font displayed
**Cause:** Font class not applied correctly
**Fix:**
1. Check `language` variable in component
2. Verify conditional className logic
3. Check CSS file has both fonts loaded

### Issue: Translation not happening
**Cause:** Translation API error
**Fix:**
1. Check backend console for errors
2. Verify internet connection
3. Try adding Google Translate API key

## Expected Results

### Hero Section (English)
```
Title: Krushnalaya (or edited version)
Font: Cinzel Decorative
Tagline: KNOW · HEAL · GROW
Description: When life feels uncertain...
```

### Hero Section (Hindi)
```
Title: कृष्णालय (or translated version)
Font: Tiro Devanagari Hindi
Tagline: जानो · जागो · उभरो
Description: जब जीवन अनिश्चित लगे...
```

## Success Criteria

✅ All text translates correctly
✅ All fonts display correctly
✅ All layouts preserved
✅ Admin can edit and see both versions
✅ Frontend switches languages smoothly
✅ No English text in Hindi mode
✅ No Hindi text in English mode
