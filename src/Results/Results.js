import React, {useEffect, useState, useRef} from 'react';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import './Results.css';

function Results(props) {
    const [timer, setTimer] = useState(1);
    const id = useRef(null);
    const clear = () => {
        window.clearInterval(id.current)
    }

    useEffect(() => {
        id.current = window.setInterval(() => {
          setTimer((time) => time + 1);
        }, 70);
        return () => clear();
      }, []);  

    useEffect(() => {
        if (timer === 105) {
          clear();
          props.returnToNumberSelector();
        }
      }, [props, timer]);      

    const handleKeyPress = (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
            return props.returnToNumberSelector();
        }
    }

    //Key down listener
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let filteredWordsArray = props.wordsArray.filter(function (value) { // removes empty strings from wordsArray
        return value !== "";
      });

    let wordslist = filteredWordsArray.map((item, index) => <h4 key={index}> {item} </h4>);

    const timerBgColor = (props.judgeResult) ? 'rgb(131, 243, 153)' : 'rgb(255, 114, 114)';
    const timerPathColor =  (props.judgeResult) ? 'rgb(100, 100, 100)' : `rgba(210, 210, 210, 1)`;

    return (
        <div className={'resultsPage ' + (props.judgeResult ? "ResultsPageValid" : "ResultsPageInvalid")}>
          {/* <div className="progressBar">
            <CircularProgressbar value={timer} strokeWidth={25} styles={buildStyles({strokeLinecap: 'butt', pathColor: timerPathColor, backgroundColor: timerBgColor, trailColor: timerBgColor})}/>
          </div> */}
          <h3 id="resultsTitle">{props.judgeResult ? "Valid" : "Invalid"}</h3>
          <div className='wordListResults'>
            {wordslist}
          </div>
          <br/>
          <button id="new_search-btn"onClick={(props.returnToNumberSelector)}>New Search</button>
        </div>
    );       
}

export default Results;