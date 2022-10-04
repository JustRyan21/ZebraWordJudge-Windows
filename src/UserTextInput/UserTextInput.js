import React, { useEffect } from 'react';
import './UserTextInput.css';
import TextBox from '../TextBox/TextBox.js';
import Notification from '../Notification/Notification.js';

function UserTextInput(props) {
    const wordsArray = props.wordsArray
    const numWords = props.numWords     //number of words to judge

    //takes in each keystroke from a TextBox component, and updates the wordsArray at the correct index 
    const handleInput = event => {
        let text = event.target.value;
        let maxWordLength = 30;
        if(text.length > maxWordLength) return; 

        var punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        var numberRegex = /[0-9]/g;
        text = text.replace(punctuationRegex, '')   //doesn't allow any punctuation characters
                    .replace(numberRegex, '')       //doesn't allow any number characters
                    .replace(' ', '');              //doesn't allow spaces

        var index = event.target.id;
        var newArr = [...wordsArray];
        newArr[index] = text.toUpperCase();
        props.setWordsArray(newArr);
        hideEmptyInputError();
    }

    //checks that no words in the array are blank
    const handleSubmit = event => {
        event.preventDefault();
        var valid = checkInputValid();
        if(!valid) {
            showEmptyInputError();
        } else {
            props.setAppState('Results');
        } 
    }

    const checkInputValid = () => {
        for(let i=0; i<numWords; i++) {
            if(wordsArray[i] === '') {
                return false;
            }
        }
        return true;
    }

    const clearAllText = (event) => {
        hideEmptyInputError();
        props.setWordsArray(new Array(8).fill(""));
        event.preventDefault();
    }

    const showEmptyInputError = () => {
        var element = document.getElementById('userInput-ErrorNotification');
        element.classList.remove('hidden');
    }

    const hideEmptyInputError = () => {
        var element = document.getElementById('userInput-ErrorNotification');
        element.classList.add('hidden');
    }

    const getEmptyErrorText = () => {
        var newErrorText;
        if(numWords === 1) {
            newErrorText = "Please enter a word";
        } else {
            newErrorText = "Please enter " + numWords + " words";
        }
        return newErrorText;
    }

    // Handles return to number selection button
    const handleReturnToNum = (event) => {
        event.preventDefault();
        if (event.target.id !== 'numWords-btn') {
            props.setAppState("NumberSelector");
        }
    }
    
    const handleKeyPress = (event) => {
    let textBoxID = Number(event.target.id);
    let lastTextBoxID = numWords - 1;
    switch(event.key) {
        case 'ArrowUp' : {
            if (document.getElementById('judge-btn') === document.activeElement) {
                return document.getElementById(lastTextBoxID).focus();
            } else if (textBoxID > 0) {
                return document.getElementById(Number(document.activeElement.id) - 1).focus();
            } break;
        }
        case 'ArrowDown' : {
            if (textBoxID < lastTextBoxID) {
                return document.getElementById(Number(document.activeElement.id) + 1).focus();
            } else if (textBoxID === lastTextBoxID) {
                return document.getElementById('judge-btn').focus();
            } break;
        }
        case ' ' : {
            if (textBoxID < lastTextBoxID) {
                return document.getElementById(Number(document.activeElement.id) + 1).focus();
            } break;
        }
        case 'Escape' : {
            return props.setAppState('NumberSelector');
        }
        case 'Enter' : {
            return document.getElementById('judge-btn').click();
        }
        default: return;
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

    //create a list containing the correct number of textBox's
    const textBoxList = wordsArray.map((item, index) => {
                        if(index < numWords) {
                            return <TextBox key={index} index={index} value={wordsArray[index]} handleInput={handleInput}/>;
                            }
                        else {
                            return null;
                        }
                    }); 
    
    const instructionText = (numWords === 1) ? "Enter a word" : "Enter " + numWords + " words";

    return (
        <div className="UserTextInput center">
            <form id="searchWords">
                <h1 className="UserTextInput-h1">{instructionText}</h1>
                <div className="btn-row">
                    <button id="numWords-btn" onClick={handleReturnToNum}><i className="fa fa-arrow-left" ></i> <span id="backtext"> Back</span></button>
                    <button id="clear-btn" onClick={clearAllText}> Clear <i className="fa fa-refresh" ></i></button>
                </div>
                {textBoxList}
                <Notification id='userInput-ErrorNotification' errorText={getEmptyErrorText()} status='error'/> 
                <button id="judge-btn" onClick={handleSubmit}>Judge</button>
            </form>
        </div>
    );
}

export default UserTextInput;

 