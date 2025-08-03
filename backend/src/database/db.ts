import {config} from 'dotenv';
config();
import mongoose from 'mongoose';

export default class Database {
  private static mongoURL = process.env.MONGO_URL || '';

  public static async connect(): Promise<void> {
    if (!this.mongoURL) {
      throw new Error('MONGO_URL environment variable not set');
    }

    try {
      await mongoose.connect(this.mongoURL);
      console.log('Database Connected');
    } catch (error) {
      console.error('Database Connection Failed', error);
      process.exit(1);
    }
  }
}
