import React from 'react';
import './Footer.css';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js'

function Footer(props) {
    return (
        <footer className="footer">
            <DropdownMenu setShowModal={props.setShowModal} currentLexicon={props.currentLexicon} setCurrentLexicon={(newLexicon) => props.setCurrentLexicon(newLexicon)} />
        </footer>
    );
}

export default Footer;