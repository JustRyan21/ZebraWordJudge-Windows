import React from 'react';
import './NumberBox.css';

function NumberBox(props) {
    return (
        <button value={props.number} className="numberButton btn-1" onClick={props.onClick}>
            {props.number}
        </button>
    );
}

export default NumberBox;