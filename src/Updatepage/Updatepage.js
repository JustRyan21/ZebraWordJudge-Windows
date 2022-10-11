import React from 'react';
import './Updatepage.css';
import Logo from '../images/Logo.svg';
import UrlBox from '../UrlBox/UrlBox.js';
import Notification from '../Notification/Notification.js';

function Updatepage(props) {
    return (
        <div className="homepage_container"> 
            <div>
                <Logo height={300}/> 
                <br/> 
                <h1 className="homepage--title">Zebra Word Judge</h1>
                <h2 className="popup-h2">Please enter the URL of the lexicon you wish to use.</h2> 
                <UrlBox></UrlBox>

            </div>
      </div>
    ); 
}
export default Updatepage;