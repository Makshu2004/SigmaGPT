import express from "express"
import Thread from "../models/Thread.js"
import getopenairesponse from "../utiles/openai.js";


const router=express.Router();


//testing
router.post("/test",async(req,res)=>{
    try{
     const thread=new Thread({
       threadId:"hi",
       title:"how are you"
      
     });

     const response=await thread.save();
     res.send(response);
     
    }catch(err){
      console.log("error",err);
      res.status(500).json({error:"Failed to save id"});
      
    }
})

router.get("/thread",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});

        //most resent chat come first
        res.json(threads);


    }catch(err){
        console.log("error",err);
        res.status(500).json({error:"Failed to fetch threads"});
      
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
   try{
    const thread=await Thread.findOne({threadId});

    if(!thread){
      res.status(404).json({error:"Thread not found"})
    }

    res.json(thread.messages);
       
   }catch(err){
     console.log("error",err);
        res.status(500).json({error:"Failed to fetch by theadid"});
      
   }
   
})



router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;

    try{
        const deletethead=await Thread.findOneAndDelete({threadId});

        if(!deletethead){
            res.status(404).json({error:"Thread could not be found"});
        }

        res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
     console.log("error",err);
        res.status(500).json({error:"Failed to delete by theadid"});
      
   }
});

router.post("/chat",async(req,res)=>{
   const {threadId,message}=req.body;

   if(!threadId ||!message){
    return res.status(404).json({error:"missing require field"})
   }
    try{  
         let thread=await Thread.findOne({threadId});

        if(!thread){
            thread=new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}],
            })
        }else{
                 thread.messages.push({role:"user",content:message});    
            }
              const assistenReply= await getopenairesponse(message);
              thread.messages.push({role:"assistant",content:assistenReply});
              thread.updatedAt=new Date();

            await thread.save();
            return res.json({reply:assistenReply});

    }catch(err){
     console.log(err)
     res.status(500).json({error:"somthing went wrong"});
    }
})









export default router;