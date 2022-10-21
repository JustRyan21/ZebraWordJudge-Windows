import React from 'react';
import './Header.css';
import Logo from '../images/Logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

function Header(props) {
    return (
        <header className="header"> 
            <div className="header--div">
                <Logo height={80} onClick={() => props.setAppState('Homepage')}/>
                <h2 className="header--title" onClick={() => props.setAppState('Homepage')}>Zebra Word Judge</h2>
                
            </div> 

            <div>
                <HamburgerMenu setAppState={(newAppState) => props.setAppState(newAppState)}/>
            </div>
      </header>

    );
}
export default Header;