import React from 'react';
import './Footer.css';
import { iOS_APP_URL, ANDROID_APP_URL, WINDOWS_APP_URL, WORDGAMERS_URL, ASSOCIATION_OF_SCRABBLE_PLAYERS_URL } from '../CONSTANTS.js';


function Footer() {
    return (
        <footer className="footer">
            {/* <div className="app--icons" >
                <a className="app--icon" href={WINDOWS_APP_URL}>
                    <i className="fa fa-windows fa-lg faAppIcon"></i> 
                </a>

                <a className="app--icon" href={ANDROID_APP_URL}>
                    <i className="fa fa-android fa-lg faAppIcon"></i>
                </a>

                <a className="app--icon" href={iOS_APP_URL}>
                    <i className="fa fa-apple fa-lg faAppIcon"></i>
                </a>
            </div>

            <div className="org--icons">
                <a className="org--icon" href={WORDGAMERS_URL}>
                    <img src={require('../images/WGI-logo.png')} width="48" alt="logo" />
                </a>

               <a className="org--icon" href={ASSOCIATION_OF_SCRABBLE_PLAYERS_URL}>
                  <img src={require('../images/NZ_Scrabble_Logo.png')} width="44" alt="NZ Scrabble Association" />
               </a>
            </div> */}
        </footer>
    );
}

export default Footer;