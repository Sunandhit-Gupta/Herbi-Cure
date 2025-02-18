import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CiSaveDown2 } from "react-icons/ci";
import { MdOutlineAttachFile } from "react-icons/md";
import Tesseract from 'tesseract.js';
import Mascot from "../assets/mascot_herbi_cure.png";
import "../components_css/Body.css";
import endpoint from '../services/endpoints';
import ChatContainer from './ChatContainer';
import CircleScrollList from './CircularScrollList';
import FallingLeaves from './FallingLeaves';
import Cloud from "../assets/Cloud.png";
import Moon from "../assets/Moon.png"
import Rainbow from "../assets/Rainbow.png"

export const Body = () => {
  async function fetchData(input_to_ai, inputFileValue, ocrResult) {
    try {
      var postData = new FormData();
      postData.append('country', `${input_to_ai + " " + ocrResult}`);
      postData.append('file', inputFileValue);
      const response = await fetch(endpoint, {
        method: "POST",
        body: postData
      });

      console.log("inner_res", response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      console.log("result", result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputFileValue, setInputFileValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [chatList, setChatList] = useState([{ "type": "botChats", "text": "Hi! I am Leefy🍃.", "Key": Date.now() + Math.random() }]);
  const handleSubmitRef = useRef(null);
  const outputRef = useRef(null);

  const fetchImageFromServer = useCallback(async (searchQuery, response_ai) => {
    try {
      const response = await fetch(`${endpoint}fetch-image?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const newChat = {
        type: "botChats",
        text: response_ai,
        image: data.imageURL,
        Key: Date.now() + Math.random()
      };

      setChatList((prevChatList) => [...prevChatList, newChat]);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }, []);

  const handleFileInput = async (event) => {
    var inputedFile = await document.getElementById('inputFileBtn').files[0];
    setInputFileValue(inputedFile);

    inputedFile ? setFileSelected(true) : setFileSelected(false);

    if (!inputedFile) {
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

  const handleSubmit = useCallback(async (event) => {
    setIsLoading(true);

    setChatList((prevChatList) => [
      ...prevChatList,
      {
        'type': "userChats",
        "text": inputValue,
        "Key": Date.now() + Math.random(),
        "image": selectedImage
      }
    ]);

    console.log('Input value:', inputValue);

    var response_ai = await fetchData(inputValue, inputFileValue, ocrResult);
    var input_to_fetch_image = response_ai;

    console.log("response_ai", response_ai);
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

  }, [inputValue, inputFileValue, ocrResult, selectedImage, fetchImageFromServer]);

  const handleTextClick = (text) => {
    setInputValue(text);
    handleSubmitRef.current = true;
  };

  useEffect(() => {
    if (handleSubmitRef.current) {
      handleSubmit();
      handleSubmitRef.current = false;
    }
  }, [inputValue, handleSubmit]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [chatList, isLoading]);

  // Prevent page from scrolling when input is focused
  useEffect(() => {
    const handleFocus = () => {
      // Save current scroll position
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = -scrollPosition + 'px';
      document.body.style.width = '100%';
    };

    const handleBlur = () => {
      // Restore scroll position
      const scrollPosition = Math.abs(parseInt(document.body.style.top, 10));
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    };

    const inputElement = document.getElementById('inputTextField');
    inputElement.addEventListener('focus', handleFocus);
    inputElement.addEventListener('blur', handleBlur);

    return () => {
      inputElement.removeEventListener('focus', handleFocus);
      inputElement.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleSubmit();
    }
  };


  return (
    <div className='body_container'>
      <div className='decoration'>
        <img className='cloud_1' src={Cloud} alt='cloud'/>
        <img className='rainbow' src={Rainbow} alt='Rainbow'/>
        <img className='moon' src={Moon} alt='Moon'/>
      </div>
      <FallingLeaves />
      <div className='lama_img_body'><img src={Mascot} alt='Mascot' /></div>
      {/* <div id='heading'><h3 className='glow'>Herbi Cure <span>- Ayurvedic Answers Anytime</span> </h3></div> */}
      <h1 className='glow'>Herbi-Cure <span>An Ayurveda Companion</span></h1>
      <div id='connect_search'>
        <div className='output' ref={outputRef}>
          <CircleScrollList onTextClick={handleTextClick} disable={isLoading || isProcessing} />
          {
            chatList.map((e) => { return (<ChatContainer key={e.Key} text={e.text} classID={e.type} image={e.image} />) })
          }
          {isLoading ? <ChatContainer key={-1} text={"Loading..."} classID={"botChats"} /> : null}
        </div>

        <div className='formInputDiv'>
          <label htmlFor="inputFileBtn" className="custom-file-upload">
            {fileSelected ? <CiSaveDown2 /> : <MdOutlineAttachFile />}
          </label>
          <input onChange={handleFileInput} type='file' accept='.jpeg, .png, .jpg' id='inputFileBtn' name='file' />
          <input onChange={handleInputChange} onKeyPress={handleKeyPress} value={inputValue} id='inputTextField' autoComplete='off' placeholder='Message Leefy'/>
          <button onClick={handleSubmit} disabled={isProcessing || isLoading || !inputValue}>Ask</button>
        </div>
      </div>
    </div>
  )
}
