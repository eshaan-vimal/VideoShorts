import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGO_URI!;

if (!MONGODB_URI)
{
    throw new Error("Define MONGODB_URI in .env file");
}


let cached = global.mongoose;

if (!cached)
{
    cached = global.mongoose = {
        conn: null,
        promise: null,
    }
}

async function connectDB ()
{
    if (cached.conn)
    {
        return cached.conn;
    }

    if (!cached.promise)
    {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }

        cached.promise = mongoose
                            .connect(MONGODB_URI, opts)
                            .then(() => mongoose.connection);
    }

    try
    {
        cached.conn = await cached.promise;

    }
    catch (error)
    {
        cached.promise = null;
        throw new Error("Database connection failed.");
    }

    return cached.conn;
}