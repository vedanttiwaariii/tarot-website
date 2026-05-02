import axios from 'axios';

/**
 * Translate text from English to Hindi using Google Translate API
 * Falls back to LibreTranslate if Google API is not configured
 */
export const translateToHindi = async (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  try {
    // Try Google Translate API if key is available
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        {},
        {
          params: {
            q: text,
            target: 'hi',
            source: 'en',
            key: process.env.GOOGLE_TRANSLATE_API_KEY
          }
        }
      );
      return response.data.data.translations[0].translatedText;
    }

    // Fallback to LibreTranslate (free, self-hosted option)
    const response = await axios.post(
      'https://libretranslate.com/translate',
      {
        q: text,
        source: 'en',
        target: 'hi',
        format: 'text'
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error.message);
    // Return original text if translation fails
    return text;
  }
};

/**
 * Translate multiple texts in batch
 */
export const translateBatch = async (texts) => {
  if (!Array.isArray(texts)) {
    return texts;
  }

  try {
    const translations = await Promise.all(
      texts.map(text => translateToHindi(text))
    );
    return translations;
  } catch (error) {
    console.error('Batch translation error:', error.message);
    return texts;
  }
};
