import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from 'uuid'

function Sidebar(){
  const {allthreads,setAllthreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);

  const getAllthead=async()=>{
    
    try{
       const response=await fetch("http://localhost:8000/api/thread");
       const res=await response.json();
       const filterData=res.map(thread=>({threadId:thread.threadId,title:thread.title}))
       console.log(filterData);
       setAllthreads(filterData);
        
    }catch(e){
        console.log(e);
    }
  };

  useEffect(()=>{
    getAllthead();

  },[currThreadId])

  const createNewChat=()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }

  const changeThread=async(newThreadId)=>{
    setCurrThreadId(newThreadId);
    try{
        const response=await fetch(`http://localhost:8000/api/thread/${newThreadId}`);
        const res=await response.json();
        console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
    }catch(e){
        console.log(e);
    }
     
  }

  const deleteThread=async(threadId)=>{
    try{
       const response=await fetch(`http://localhost:8000/api/thread/${threadId}`,{method:"DELETE"});
       const res=await response.json();
       console.log(res);

       setAllthreads(prev=>prev.filter(thread=>thread.threadId!=threadId));

       if(threadId===currThreadId){
        createNewChat();
       }

    }catch(e){
        console.log(e);
    }
  }

    return (
        <section className="sidebar">
            <button  onClick={createNewChat}>
                <img src="src/assets/blacklogo.png"  alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
                <ul className="history">
                    {
                        allthreads?.map((thread,idx)=>(
                            <li key={idx} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId===currThreadId?"highlighted":" "}>
                            {thread.title} <i className="fa-solid fa-trash"  onClick={(e)=>{e.stopPropagation()
                                deleteThread(thread.threadId)
                            }}></i>
                           </li>
                            
                        ))
                    }
                </ul>

                <div className="sign">
                    <p> Apna College &hearts;</p>

                </div>
            
        </section>
    )
}

export default Sidebar;