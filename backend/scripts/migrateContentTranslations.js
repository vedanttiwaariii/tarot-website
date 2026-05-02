import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../models/Content.js';
import { translateToHindi } from '../utils/translator.js';

dotenv.config();

const migrateContentTranslations = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const contents = await Content.find({ contentHindi: { $exists: false } });
    console.log(`Found ${contents.length} content items without Hindi translations`);

    for (const content of contents) {
      if (typeof content.content === 'string') {
        console.log(`Translating: ${content.sectionId}`);
        const hindiTranslation = await translateToHindi(content.content);
        content.contentHindi = hindiTranslation;
        await content.save();
        console.log(`✓ Translated: ${content.sectionId}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateContentTranslations();
