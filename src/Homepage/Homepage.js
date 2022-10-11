import React from 'react';
import './Homepage.css';
import Logo from '../images/Logo.svg';

function Homepage(props) {
    return (
        <div className="homepage_container"> 
            <div>
                <Logo height={300}/> 
                <br/> 
                <h1 className="homepage--title">Zebra Word Judge</h1>
                <button className="change_btn" onClick={() => props.setAppState('Updatepage')}>Update Lexicon</button> 
                <br/> 
                <button className="continue_btn" onClick={() => props.setAppState('NumberSelector')}>Continue</button>   
            </div>
      </div>
    ); 
}
export default Homepage;