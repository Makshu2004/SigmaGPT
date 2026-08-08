import "./Chatwindow.css";
import Chat from "./Chat.jsx"
import { MyContext } from "./MyContext.jsx";
import { useContext,useState,useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function Chatwindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }


  //append new chat to prevchat

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

    const handleProfile=()=>{
        setIsOpen(!isOpen);
    }

    return (
        //navbar
        <div className="chatwindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconeDiv" onClick={handleProfile}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>

            </div>  
          
          {
            isOpen && 
            <div className="dropdown">
               
                <div className="dropdownitem"><i className="fa-solid fa-gear"></i>Setting</div>
                 <div className="dropdownitem"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade plane</div>
                <div className="dropdownitem  logout"><i className="fa-solid  fa-right-from-bracket"></i>LogOut</div>
                
             
             </div>
          }
         
           {/* diplay chats */}
            <Chat></Chat> 
        
              <ScaleLoader color="#fff"  loading={loading}></ScaleLoader>

             {/* chat input part */}

            <div className="chatInput">
                <div className="inputbox">
                    <input placeholder="Ask anythig" 
                     value={prompt}
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                   
                    </input>
                    <div id="submit" onClick={getReply}> <i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="Info">
                  SigmaGPT can make mistake. Check important info.See Cookie Preferences.    
                 </p>

            </div>

           
        </div>
    )
}

export default Chatwindow;