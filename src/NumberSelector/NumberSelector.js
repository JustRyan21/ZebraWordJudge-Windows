import React, { useEffect } from 'react';
import './NumberSelector.css';
import NumberBox from '../NumberBox/NumberBox.js';

function NumberSelector(props) {
    const handleKeyPress = (event) => {
        if (isNaN(parseInt(event.key)) === false && event.key !== "0" && event.key !== "9") {
            event.target.value = event.key;
            return props.onClick(event);
        }
    }

    // Key down listener
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='numpad'>
            <h1 className="NumberSelector-h1">How many words would you like to judge?</h1>
            <div className='numberBoxes'>
                <div>
                    <NumberBox number={1} onClick={props.onClick}/>
                    <NumberBox number={2} onClick={props.onClick}/>
                </div>
                <div>
                    <NumberBox number={3} onClick={props.onClick}/>
                    <NumberBox number={4} onClick={props.onClick}/>
                </div>
            </div>
        </div>
    )
}

export default NumberSelector;