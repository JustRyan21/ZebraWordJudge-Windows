import React from 'react';
import './UrlBox.css';

function UrlBox(props) {
    return (
        <div className="main">
          <div className="search">
            <input className="search" type="text"
              id="outlined-basic"
              onChange={props.handleUrl}
              variant="outlined"
              fullWidth
              name="URL"
            />
          </div>
        </div>
      ); 
}

export default UrlBox;