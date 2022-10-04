import React from "react";
import './DropdownMenu.css';
// import CaretDown from '../images/caret-down.svg';
// import AddNewIMG from '../images/square-plus-solid.svg';
// import ArrowRight from '../images/chevron-right-solid.svg';

function DropdownMenu(props) {
  const toCommas = value => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //returns dropdown list of lexicon names, except for the currentLexicon
  const dropDownItems = props.lexiconData.map((item, index) => {
    var lexiconName = item.name;
    var lexiconSize = toCommas(item.size);
    var lexiconOfficial = item.isOfficial;
    if(lexiconName !== props.currentLexicon) {
        return (
          <div key={index} className="dropdown-item" onClick={() => props.setCurrentLexicon(lexiconName)}>
            <p className="lexiconName">{lexiconName}</p>
            <div className="badges">
              {lexiconOfficial && <span className="lexiconVerify">Official</span>}
              <span className="lexiconSize">{lexiconSize} words</span>
            </div>
          </div>
        );
        //when a dropdown item is clicked, it updates currentLexicon in App.js
    } else {
        return null;
    }
  });

  const isCurrentLexiconOfficial = () => {
    for(let i = 0; i < props.lexiconData.length; i++) {
      if(props.lexiconData[i].name === props.currentLexicon) {
        return props.lexiconData[i].isOfficial;
      }
    }
    return false;
  }

  return (
    <div className="dropdown">
      <div className="dropbtn">
        <span className="drop-btn-text">Lexicon</span>
        {/* <ArrowRight className='arrowRight'/> */}
        <div className="current-lexicon">
          <span className="lexicon-text">{props.currentLexicon}</span>
          {isCurrentLexiconOfficial() && <span className="lexiconVerify">Official</span>}
        </div>
          {/* <CaretDown className='caretDown'/> */}
      </div>
      <div className="dropdown-content">
        {dropDownItems}
        <div onClick={() => props.setShowModal(true)} className="btn-modal">
          {/* <AddNewIMG className="addNewIMG"/>  */}
          <span className="addNewText">
            Add New
          </span>
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;