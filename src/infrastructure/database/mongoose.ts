import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://root:example@localhost:27017/app?authSource=admin')
        console.log('MongoDB connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1) // Exit process with failure
    }
}

export default connectDB
