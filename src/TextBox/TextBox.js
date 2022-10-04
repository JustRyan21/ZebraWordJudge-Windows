import React from 'react';
import './TextBox.css';

function TextBox(props) {
    const placeholderText = (props.index === 0) ? "Enter a word" : "";

    return (
        <div className="TextBox">
            <label className="textBox-Label">{1 + props.index}.</label>
            <input className="textBox-input" type="text" value={props.value} 
                    onChange={props.handleInput} autoComplete="off" placeholder={placeholderText} id={props.index} autoFocus={props.index === 0}/>
        </div>
    );
}

export default TextBox;