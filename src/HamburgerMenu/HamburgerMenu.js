import React from "react";
import './HamburgerMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

function myFunction() {
    document.getElementById("hamburgermyDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.hamburgerdropbtn')) {
      var dropdowns = document.getElementsByClassName("hamburgerdropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

function HamburgerMenu(props) {
  return (
<div class="hamburgerdropdown">
  <FontAwesomeIcon  onClick={myFunction} className="hamburgerdropbtn" icon={faBars} size="2x"/>
  <div id="hamburgermyDropdown" class="hamburgerdropdown-content">
    <a href="#" onClick={() => props.setAppState('Homepage')}>Home</a>
    <a href="#" onClick={() => props.setAppState('Updatepage')}>Change Lexicon</a>
    <a href="#" onClick={() => props.setAppState('SearchHistory')}>View History</a>
  </div>
</div>

  );
}

export default HamburgerMenu;