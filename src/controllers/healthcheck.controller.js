import { response } from "express"
import {ApiResponse} from "../utils/api-response.js"

import {asyncHandler} from "../utils/async-handler.js"

const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { message: "Server is healthy" }))
    
} )

// const healthcheck = async (req, response, next) => {
//     try {
//         const user=await getUserFromDB() // Simulating a database call to check if the server can connect to the database
//         response.status(200).json(
//             new ApiResponse(200, { message: "Server is healthy" })
//         )

//     }
//     catch(err){
//         next(err) // Pass the error to the error handling middleware


//     }
// }

export { healthcheck }