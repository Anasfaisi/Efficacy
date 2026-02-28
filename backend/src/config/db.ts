import { logger } from '@/utils/logMiddlewares';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/Efficacy'
        );
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
export default connectDB;
