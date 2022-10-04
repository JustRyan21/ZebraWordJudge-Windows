import React from 'react';
import './Header.css';
import im from '../images/Logo.png';

function Header(props) {
    return (
        <header className="header">
            <div className="header--div">
                <img src={im} className="logo" alt="logo" />
                <h2 className="header--title">Zebra Word Judge</h2>
            </div>
            {/* <DropdownMenu lexiconData={props.lexiconData} setShowModal={props.setShowModal} currentLexicon={props.currentLexicon} setCurrentLexicon={(newLexicon) => props.setCurrentLexicon(newLexicon)} addLexicon={props.addLexicon} /> */}
      </header>

    );
}

export default Header;