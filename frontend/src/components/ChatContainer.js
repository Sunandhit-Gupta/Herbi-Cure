import React, { Component } from 'react'
import "../components_css/ChatContainer.css"
import MyComponent from './Response';
import Mascot from "../assets/mascot_herbi_cure.png"


export class ChatContainer extends Component {

  render() {
    var text = this.props.text;

    var classID = this.props.classID;

    var image = this.props.image; // Retrieve the image from props

    return (
      <div className={classID}>
        <div id='outer_div_content'>
        <span id='title'>{this.props.classID === "botChats"? <img src={Mascot} alt='Mascot'/>: '🧔You:'}</span>
        <div id='content'>
        < MyComponent text = {text}/>
        {image && <img src={image} alt="Uploaded" style={{ display:'block', maxWidth: '100px', maxHeight: '100px', marginTop: '30px', marginLeft:'auto', marginRight:'auto'}} />} {/* Conditionally render the image */}

        </div>
        </div>
      </div>
    )
  }
}

export default ChatContainer