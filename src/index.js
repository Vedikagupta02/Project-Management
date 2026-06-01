import dotenv from 'dotenv';
import connectdb from './db/index.js';
import app from './app.js'
dotenv.config({
    path: './.env',
})

const PORT = process.env.PORT || 3000

connectdb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process with failure
})