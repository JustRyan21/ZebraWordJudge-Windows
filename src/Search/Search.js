import React from 'react';
import './Search.css';

export default function Search(props) {
    var wordList = props.wordList.split(" ");

    const wordListColumn1 = wordList.map((word, index) => {
        if(index < 4) return <p className="text" key={index}>{word}</p>
    });

    const wordListColumn2 = wordList.map((word, index) => {
        if(index >= 4) return <p className="text" key={index}>{word}</p>
    });

    return (
        <div className="container" onClick={() => props.onClick(props.timestamp)}>
            <div className={"banner " + (props.selected ? "selected" : "unselected")}>
                <div className="iconAndResult">
                    <div className={"circle " + (props.result === 1 ? "circleCorrect" : "circleIncorrect")}></div>
                    <p className="bannerText">{props.result === 1 ? "ACCEPTABLE": "UNACCEPTABLE"}</p>
                </div>
                <div className="LexiconAndDate">
                    <p className="bannerText">{props.lexicon}</p>
                    <p className="date">{timeSince(props.timestamp)}</p>  
                </div>
            </div>
        
            <div className={"wordList " + (props.selected ? "selected" : "unselected")}>
                <div className="wordListColumn">{wordListColumn1}</div>
                <div className="wordListColumn">{wordListColumn2}</div>
            </div>
        </div>
    );
}


const timeSince = (timestamp) => {
    var date = new Date(timestamp);
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    var digit;
    
    if (interval > 1) {
        digit = Math.floor(interval);
        return digit + (digit === 1 ? " year ago" : " years ago");
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        digit = Math.floor(interval);
        return digit + (digit === 1 ? " month ago" : " months ago");
    }

    interval = seconds / 86400;
    if (interval > 1) {
        digit = Math.floor(interval);
        return digit + (digit === 1 ? " day ago" : " days ago");
    }

    interval = seconds / 3600;
    if (interval > 1) {
        digit = Math.floor(interval);
        return digit + (digit === 1 ? " hour ago" : " hours ago");
    }

    interval = seconds / 60;
    if (interval > 1) {
        digit = Math.floor(interval);
        return digit + (digit === 1 ? " minute ago" : " minutes ago");
    }

    digit = Math.floor(seconds)
    return digit + (digit === 1 ? " second ago" : " seconds ago");;
}