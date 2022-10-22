import React, { useState } from "react";
import './Updatepage.css';
import Logo from '../images/Logo.svg';
import UrlBox from '../UrlBox/UrlBox.js';
import Notification from '../Notification/Notification.js';
import validator from 'validator';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';

function Updatepage(props) {
    const [urlText, setUrlText] = useState("");
    const [loadState, setLoadState] = useState("notDownloading");
    const [errorText, setErrorText] = useState("");
    
//updates typed characters into displayed URL
  const handleUrl = event => {
    let url = event.target.value;
    setUrlText(url)
  }

  //returns confirmation if lexicon was successfuly added
  const handleAddLexicon = async () => {
    setLoadState('downloading');
    var downloadStatus = await props.addLexicon(getName(), urlText);
    setLoadState('notDownloading');
    return downloadStatus;
 };  

  //returns first 5 characters of lexicon
  const getName = () => {
    let name = urlText.split("/").pop().split(".")[0];
    name = name.length > 5 ? name.substring(0,5) : name;   
    return name; 
  }

  const checkURLValid = () => {
    return urlText.substring(urlText.length - 4) === ".txt" && validator.isURL(urlText);
  }

  //checks if user-input is a valid URL, then attempts to download the new lexicon
  const handleDownload = async () => {
    if (!checkURLValid()) {
      setErrorText("Invalid URL, please try again.");
      showError();
      return;
    }
    hideError();
    var downloadStatus = await handleAddLexicon();
    if(downloadStatus === 1) {
      //successfully downloaded
      setLoadState('downloaded');
    } else {
      setErrorText("Download Failed! Please try again.");
      showError();
    }
  }

  const showError = () => {
    var element = document.getElementById('urlInput-ErrorNotification');
    element.classList.remove('hidden');
  }

  const hideError = () => {
    var element = document.getElementById('urlInput-ErrorNotification');
    element.classList.add('hidden');
  }  

  const getActiveComponent = () => {
    switch (loadState) {
      case 'notDownloading' : return (
        <div>
          <button
            onClick={handleDownload}
            className="download-btn">Download
          </button>
        </div>);
      case 'downloading' : return <LoadingSpinner />;
      case 'downloaded' : return (
        <Notification id='urlInput-successNotification' errorText={"Successfully downloaded! Saved as " + getName()} status='success' />
        );
    } 
  }

    return (
        <div className="homepage_container"> 
            <div>
                <Logo height={300}/> 
                <br/> 
                <h1 className="homepage--title">Zebra Word Judge</h1>
                <h2 className="popup-h2">Please enter the URL of the lexicon you wish to use.</h2> 
                <UrlBox handleUrl={handleUrl} handleDownload={handleDownload} />
                <Notification id='urlInput-ErrorNotification' errorText={errorText} status='error'/>
                {getActiveComponent()}

            </div>
      </div>
    ); 
}
export default Updatepage;