# Auto-Translation Feature

## Overview
Content edited through the Admin Content Manager is automatically translated from English to Hindi. The system preserves all fonts and layouts for both languages.

## How It Works

1. **Admin edits content** in English through the Content Manager
2. **System auto-translates** to Hindi using LibreTranslate (free) or Google Translate API
3. **Both versions stored** in database (English + Hindi)
4. **Frontend displays** correct version based on user's language preference
5. **Fonts preserved** - English uses mystical font, Hindi uses mystical-hindi font

## Translation Service

### Default: LibreTranslate (Free)
- No API key required
- Uses public LibreTranslate API
- Free and open-source
- May have rate limits

### Optional: Google Translate API
- More accurate translations
- Higher rate limits
- Requires API key and billing account

To use Google Translate:
1. Get API key from: https://cloud.google.com/translate/docs/setup
2. Add to `backend/.env`:
   ```
   GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```

## Editable Content Sections

The following sections support auto-translation:
- Hero Title
- Hero Tagline
- Hero Description
- About Journey

## Admin Interface

### Viewing Translations
- Click "हिन्दी देखें" button to toggle between English and Hindi
- Both versions displayed in Content Manager

### Editing Content
1. Click "Edit" on any content section
2. Enter English text
3. Click "Save"
4. System automatically translates to Hindi
5. Both versions saved to database

### Translation Indicator
- Shows "✨ Hindi translation will be generated automatically" during edit
- Shows "Translating..." while saving

## Frontend Display

### Language Detection
- Auto-detects browser language on first visit
- Shows language selection modal
- Saves preference to localStorage

### Content Loading
- Fetches content based on selected language
- Falls back to hardcoded translations if database content not available
- Maintains all fonts and layouts

## Migration

To add Hindi translations to existing content:

```bash
cd backend
node scripts/migrateContentTranslations.js
```

This will:
- Find all content without Hindi translations
- Translate each to Hindi
- Save translations to database

## Technical Details

### Database Schema
```javascript
{
  sectionId: String,
  content: String,        // English content
  contentHindi: String,   // Hindi translation
  type: String,
  updatedBy: String,
  timestamps: true
}
```

### API Endpoints
- `GET /api/content?lang=hi` - Get Hindi content
- `GET /api/content?lang=en` - Get English content
- `PUT /api/content/:sectionId` - Update content (auto-translates)

### Translation Flow
```
Admin Edit → English Content → Auto-Translate → Hindi Content → Save Both → Display by Language
```

## Fonts

### English
- Font: 'Cinzel Decorative' (mystical)
- Class: `brand-title`, `font-mystical`

### Hindi
- Font: 'Tiro Devanagari Hindi' (mystical-hindi)
- Class: `brand-title-hindi`, `font-mystical-hindi`

Both fonts loaded in `index.css` and applied conditionally based on language.

## Limitations

1. **Translation Quality**: Automatic translations may not be perfect
2. **Rate Limits**: Free LibreTranslate has rate limits
3. **Text Only**: Only translates text content, not images or complex HTML
4. **Manual Review**: Recommended to review auto-translations for accuracy

## Future Enhancements

- [ ] Manual translation override option
- [ ] Translation history/versioning
- [ ] Support for more languages
- [ ] Batch translation for all content
- [ ] Translation quality feedback system
