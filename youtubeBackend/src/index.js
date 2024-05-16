import { app } from "./app.js";
import connectDB from "./db/db.js"
import dotenv from "dotenv"
dotenv.config();

// mongodb starting
const startServer = async () => {
    try {
        // Attempt to connect to the database
        await connectDB();
        
        app.on("error", (error)=>{
            console.log('Error occurred:', error);
            if (error.shouldShutdown) {
                // Perform cleanup and shutdown the server gracefully
                process.exit(1); // or use another method to shut down the server
            }
            throw error;
        })
        // If the connection is successful, start the server
        const port = process.env.PORT || 6000;
        app.listen(port, () => {
            console.log(`App is listening at Port: ${port}`);
        });
    } catch (err) {
        // Handle any errors that occurred during the connection
        console.log("MongoDB connection failed:", err);
    }
};

// Call the async function to start the server
startServer();
