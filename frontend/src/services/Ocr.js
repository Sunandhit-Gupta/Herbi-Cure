import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OcrComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleStartOcr = () => {
    if (!selectedImage) {
      alert('Please select an image file.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = () => {
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

    reader.readAsDataURL(selectedImage);
  };
}

export default OcrComponent;
