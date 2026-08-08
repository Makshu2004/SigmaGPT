// import express from "express";
// import'dotenv/config';
// import cors from "cors";

// const app=express();
// const PORT=8000;

// app.use(express.json());
// app.use(cors());

// app.listen(PORT,()=>{
//   console.log(`server running on ${PORT}`);
// })

// app.post("/text",async(req,res)=>{
//   const option={
//     method:"POST",
//     headers:{
      
//     }
//   }
// })




// 
//import OpenAI from 'openai';
// import { GoogleGenAI } from '@google/genai';
// import'dotenv/config';

// const client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY, 
// });
// async function main(){
// const response = await client.models.generateContent({
//   model: 'gemini-2.0-flash',
//   contents: 'joke related to computer science',
// });

// console.log(response.text);
// }
// main();

// import Groq from 'groq-sdk';

// const client = new Groq({
//   apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
// });

// const chatCompletion = await client.chat.completions.create({
//   messages: [{ role: 'user', content: 'Explain the importance of low latency LLMs' }],
//   model: 'openai/gpt-oss-20b',
// });

// console.log(chatCompletion.id);
// 
import 'dotenv/config';
import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chats.js"
 


 const app=express();
 const PORT=8000;
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON format sent in request body" });
  }
  next();
});


 app.use("/api",chatRoutes);

 const connectionDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database");
  }catch(err){
    console.log("Fail to connect DB",err);
  }
 }

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });



// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     });

//    const data=res.json({
//       reply: response.choices[0].message.content,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "Something went wrong",
//     });
//   }
// });



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectionDB();
});