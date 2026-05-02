import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../models/Content.js';

dotenv.config();

const checkContent = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const contents = await Content.find();
    console.log(`Found ${contents.length} content items:\n`);

    contents.forEach(item => {
      console.log(`Section: ${item.sectionId}`);
      console.log(`English: ${item.content}`);
      console.log(`Hindi: ${item.contentHindi || 'NOT SET'}`);
      console.log('---');
    });

    console.log('\nDo you want to delete all content? (This will make the site use hardcoded translations)');
    console.log('To delete, run: node scripts/clearContent.js --delete');
    
    if (process.argv.includes('--delete')) {
      await Content.deleteMany({});
      console.log('\n✓ All content deleted. Site will now use hardcoded translations.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkContent();
