import { createContext, useEffect, useState } from "react";
import run from "../Config/Gemini"


export const Context = createContext();


const ContextProvider = (props)=> {

    const [input,setInput] = useState("");
    const [recentPrompt , setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("");
    const [isRunReady, setIsRunReady] = useState(true);
    

  useEffect(() => {
    // Simulate checking if 'run' is ready (replace with actual logic)
    const checkRunReady = async () => {
      // ... your logic to check if 'run' is initialized
      // For example, if 'run' is an API client, 
      // you might need to wait for it to connect
      setIsRunReady(true); 
    };

    checkRunReady();
  }, []); // Empty dependency array ensures this runs only once


  const delayPara = (index,nextWord)=>{
        setTimeout(function (){
            setResultData(prev => prev+nextWord)
        },75*index)
  }

  const newChat =  ()=> {
        setLoading(false);
        setShowResult(false);
  }


  const onSent = async (prompt) => {
    
    if (isRunReady) {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);

        } else{
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input)
           
           response = await run(input);
        }
       
      let responseArray = response.split("**");
      let newResponse="";
      for(let i=0; i<responseArray.length; i++)
        {
            if(i === 0 || i%2 !==1  ){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray =newResponse2.split(" ");
    for(let i=0; i<newResponseArray.length; i++){
       const nextWord = newResponseArray[i];

        delayPara(i,nextWord+" ")
    }
      setLoading(false)
      setInput("")
    } else {
      console.error("Error: 'run' is not yet ready.");
      // Handle the case where 'run' is not ready
    }
  };

  


const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
      

}

return (
    <Context.Provider value= {contextValue}>
        {props.children}
    </Context.Provider>
)




}

export default ContextProvider;


