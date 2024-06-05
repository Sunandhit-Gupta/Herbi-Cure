import React, { useState,useEffect, useRef } from 'react';
import { CiSaveDown2 } from "react-icons/ci";
import { MdOutlineAttachFile } from "react-icons/md";
import "../components_css/Body.css";
import ChatContainer from './ChatContainer';
import Tesseract from 'tesseract.js';
import Mascot from "../assets/mascot_herbi_cure.png"
import CircleScrollList from './CircularScrollList';
import FallingLeaves from './FallingLeaves';



// Now 'htmlOutput' contains the HTML representation of your Markdown.



export const Body = () => {

  async function fetchData  (input_to_ai , inputFileValue, ocrResult) {

      try {
        // Make a GET request to the server
        var postData = new FormData();
        postData.append('country',`${input_to_ai + " "+ ocrResult}`);
        postData.append('file',inputFileValue);
        const response = await fetch('http://localhost:5000/', {method : "POST",
          body: postData
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response body as JSON
        const result = await response.json();

        return result;
      } catch (error) {
        console.log(error);
      }
    };


    const [fetchedImageUrl, setFetchedImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputFileValue, setInputFileValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected , setFileSelected] = useState(false);
  const [chatList,setChatList] = useState([{"type": "botChats","text": "Hi! I am Leefy🍃.","Key":Date.now()+Math.random()}]);
// const chatList = [];
const handleSubmitRef = useRef(null);
const outputRef = useRef(null); // Create a ref for the output div




const fetchImageFromServer = async (searchQuery,response_ai) => {
  try {
    const response = await fetch(`http://localhost:5000/fetch-image?query=${encodeURIComponent(searchQuery)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setFetchedImageUrl(data.imageURL); // Update the state with the fetched image URL


    const newChat = {
      type: "botChats",
      text:response_ai,
      image: data.imageURL, // The fetched image URL
      Key: Date.now() + Math.random()
    };

    setChatList([...chatList, newChat]); // Update the chat list with the new bot response

  } catch (error) {
    console.error('Error fetching image:', error);
  }
};




  const handleFileInput = async (event)=>{
    console.log("calling mom");
    var inputedFile = await document.getElementById('inputFileBtn').files[0];
    console.log(inputedFile);
    setInputFileValue(inputedFile);

    inputedFile ? setFileSelected(true):setFileSelected(false);

    if(!inputedFile){
      setSelectedImage(false);
      setFileSelected(false);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();


    reader.onload = () => {
      setSelectedImage(reader.result);
      Tesseract.recognize(
        reader.result,
        'eng',
        {
          logger: (m) => console.log(m)
        }
      ).then(({ data: { text } }) => {
        setOcrResult(text);

        setIsProcessing(false);
      }).catch(err => {
        console.error(err);
        setOcrResult('Error recognizing text.');
        setIsProcessing(false);
      });
    };

    reader.readAsDataURL(inputedFile);

    document.getElementById('inputFileBtn').value = "";

  }


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  const handleSubmit = async(event) => {

    setIsLoading(true);


    chatList.push({'type':"userChats",
      "text": inputValue,
      "Key":Date.now()+Math.random(),
      "image": selectedImage  // Add the selected image to the user chat
    });

   setChatList(chatList);

   console.log('Input value:', inputValue);


   var response_ai =  await fetchData(inputValue,inputFileValue, ocrResult);
   var input_to_fetch_image = response_ai;
   if (response_ai.length > 100) {
     input_to_fetch_image = response_ai.substring(0, 100);
  }

   await fetchImageFromServer(input_to_fetch_image, response_ai);

   setInputFileValue();
   setInputValue("");
   setOcrResult('');
   setFileSelected(false);
   setSelectedImage();
   setIsLoading(false);

   var text = response_ai;


  //  chatList.push({"type": "botChats",
  //  "text":response_ai,
  //  "Key":Date.now()+Math.random(),
  //  "image": fetchedImageUrl
  //  });

  };

  const handleTextClick = (text) => {
    setInputValue(text);

    handleSubmitRef.current = true;

  };

  useEffect(() => {
    if (handleSubmitRef.current) {
      handleSubmit();
      handleSubmitRef.current = false;
    }
  }, [inputValue]);


  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [chatList, isLoading]); // Scroll to bottom whenever chatList or isLoading changes



  return (

    <div className='body_container'>

       <FallingLeaves/>

        <div className='lama_img_body'><img src= {Mascot} alt='Mascot'/></div>

        <div id='heading'><h3>Herbi Cure <span>- Ayurvedic Answers Anytime</span> </h3></div>

    <div id='connect_search'>
        <div className='output' ref={outputRef}>

        <CircleScrollList onTextClick={handleTextClick} disable= {isLoading || isProcessing}/>
        {

        chatList.map((e)=>{ return (<ChatContainer key={e.Key} text={e.text} classID={e.type} image={e.image} />)})

        }
        {isLoading?<ChatContainer key = {-1} text = {"Loading..."} classID = {"botChats"} />: null}

        {/* {fetchedImageUrl && (
        <div className='fetched-image-container'>
          <img src={fetchedImageUrl} alt="Fetched" />
        </div>
      )} */}

        </div>

  <div className='formInputDiv'>

<label htmlFor="inputFileBtn" className="custom-file-upload">
{fileSelected?<CiSaveDown2/> : <MdOutlineAttachFile/>}
</label>

<input onChange={handleFileInput} type='file' accept='.jpeg, .png, .jpg' id='inputFileBtn' name='file'/>
<input onChange={handleInputChange} value={inputValue} id='inputTextField'/>
<button  onClick={handleSubmit} disabled = {isProcessing || isLoading}>Ask</button>

</div>
</div>
    </div>
  )
}
