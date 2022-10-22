import React from "react";
import './DropdownMenu.css';
import CaretDown from '../images/caret-down.svg';
import AddNewIMG from '../images/square-plus-solid.svg';
import ArrowRight from '../images/chevron-right-solid.svg';

function DropdownMenu(props) {
  return (
    <div className="dropdown">
      <div className="dropbtn">
        <span className="drop-btn-text">Lexicon</span>
        <ArrowRight className='arrowRight'/>
        <div className="current-lexicon">
          <span className="lexicon-text">{props.currentLexicon.name}</span>
          {props.currentLexicon.isOfficial && <span className="lexiconVerify">Official</span>}
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;