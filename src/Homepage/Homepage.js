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
                <button className="change_btn">Update Lexicon</button> 
                <br/> 
                <button className="continue_btn">Continue</button>  
            </div>
      </div>
    );
}
export default Homepage;