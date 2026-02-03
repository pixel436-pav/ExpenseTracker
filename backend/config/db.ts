import mongoose from 'mongoose';

export const connectDb = async () :Promise<void> => {
try {
    const conn  = await mongoose.connect(process.env.MongoDbURL as string)
    console.log(`Connection has been established on ${conn.connection.host}`)
} catch (error) {
    console.error(`Error while Connection:${error}`)
    process.exit(1)
    
}
  
}

