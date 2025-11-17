import mongoose from "mongoose";
import dotenv from "dotenv"; // Load environment variables from .env file
import app from "./app.js";
import { DB_NAME } from "./constant.js";
import connectDB from "./src/Database/database.index.js";
import { createServer } from "http";
import fs from 'fs';
import path from 'path';


dotenv.config({
  path:"./.env"
}); // load env ke variables

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

const DEFAULT_PORT = process.env.PORT || 5000;

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

connectDB()
.then(async () => {
  try {
    // Try to find an available port
    const port = await findAvailablePort(DEFAULT_PORT);
    
    const server = app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`🌐 API available at http://localhost:${port}`);
      if (port !== DEFAULT_PORT) {
        console.log(`⚠️  Note: Port ${DEFAULT_PORT} was in use, using port ${port} instead`);
        console.log(`💡 Update your frontend API URL to: http://localhost:${port}/api/v1`);
      }
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error("❌ Server startup error:", err.message);
  process.exit(1);
});



//  //approch 1
// dotenv.config({ path: "./env" });

// //const app = express();

// (async () => {
//     try {
//         // Use only process.env.MONGO_URI if it already contains the db name
//         await mongoose.connect(process.env.MONGO_URI);

//         app.on("error", (e) => {
//             console.error("Error in app:", e);
//             throw e;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error("Error connecting to the database:", error);
//         process.exit(1); // Exit the process if DB connection fails
//     }
// })();
//     } catch (error) {
//         console.error("Error connecting to the database:", error);
//         process.exit(1); // Exit the process if DB connection fails
//     }
// })();