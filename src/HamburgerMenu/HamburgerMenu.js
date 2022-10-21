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
  <button onClick={myFunction} class="hamburgerdropbtn">Dropdown</button>
  <div id="hamburgermyDropdown" class="hamburgerdropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div>

  );
}

export default HamburgerMenu;