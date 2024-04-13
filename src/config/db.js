import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;