import React from 'react';
import "../components_css/CircularScrollList.css";


const CircleScrollList = ({ onTextClick , disable}) => {
  const texts = [
    // "What are the benefits of practicing yoga in conjunction with Ayurvedic principles?",
    "How can Ayurveda help with managing chronic pain?",
    // "What role does diet play in Ayurveda for maintaining balance and health?",
    "How can I determine my dosha type, and what does it mean for my health?",
    // "What Ayurvedic treatments are recommended for improving digestion?",
    // "How can Ayurveda assist in balancing hormones naturally?",
    "What are some common Ayurvedic practices for enhancing skin health?",
    "Can Ayurveda offer solutions for weight management and obesity?",
    // "How does Ayurvedic medicine address common respiratory issues?",
    "What are some effective Ayurvedic remedies for boosting energy levels?",
    // "How does Ayurveda approach the treatment of arthritis?",
    // "What is the significance of seasonal routines in Ayurveda?",
    // "How can Ayurvedic principles be incorporated into daily routines for better health?",
    // "What are the benefits of using Ayurvedic oils for massage therapy?",
    "How does Ayurveda view the connection between mind and body?",
    "What are some natural Ayurvedic remedies for headaches and migraines?",
    "Can Ayurveda help with improving cardiovascular health?",
    // "What are the key components of an Ayurvedic detox program?",
    "How can Ayurveda aid in better sleep and combating insomnia?",
    "What are the most effective Ayurvedic herbs for managing diabetes?",
    "How does Ayurveda suggest managing stress and anxiety?",
    // "What are the principles behind Ayurvedic cooking?",
    // "How can Ayurveda contribute to healthy aging?",
    // "What is the role of meditation in Ayurveda?",
    // "What are the Ayurvedic approaches to enhancing mental clarity and focus?"
];

  return (
    <div className="circle-scroll-container">
      <div className="circle-scroll-list">
        {texts.map((text, index) => (
          <button key={index} className="circle-scroll-item" onClick={() => onTextClick(text)} disabled = {disable}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CircleScrollList;
