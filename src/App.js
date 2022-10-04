import React, { useState, useEffect, } from 'react';
import UserTextInput from './UserTextInput/UserTextInput.js';
import NumberSelector from './NumberSelector/NumberSelector.js';
import PopUp from './PopUp/PopUp.js'
import Results from './Results/Results.js';
import Header from './Header/Header.js';
import Footer from './Footer/Footer.js';
import {PROXY_URL} from './CONSTANTS.js';
import './App.css';
import IEL22 from './Lexicons/IEL22.txt'; //DEFAULT LEXICONS THAT WILL LOAD ON FIRST VISIT
import NZL21 from './Lexicons/NZL21.txt'; //IF YOU WANT TO ADD MORE, add inside the useEffect() method

const MAX_NUM_CHALLENGES = 4;

function App() {
  const [wordsArray, setWordsArray] = useState(new Array(MAX_NUM_CHALLENGES).fill("")); //array containing the words to judge
  const [numWordsSelected, setNumWordsSelected] = useState(4);
  const [appState, setAppState] = useState('NumberSelector');
  const [lexiconDictionary, setLexiconDictionary] = useState({}); //an object that holds all Lexicons in the format 'lexiconName : {name: ..., size: ..., array : ...}'
  const [currentLexicon, setCurrentLexicon] = useState('IEL22');
  const [showModal, setShowModal] = useState(false);

  const loadLexicon = async (Lexicon) => {
    const response = await fetch(Lexicon);
    if(!response.ok) {
      console.log(response);
      throw new Error("Invalid URL!");
    }
    return (await response.text()).split(/\r?\n/);
  };

  //adds lexicon to lexiconDictionary
  const addLexicon = async (lexiconName, lexiconURL, local) => {
    let prefix = local ? "" : PROXY_URL;
    var fetchedLexiconWords;
    try {
      fetchedLexiconWords = await loadLexicon(prefix + lexiconURL);
    } catch {
      return -1;
    }
    if(!fetchedLexiconWords) {
      throw new Error("Empty lexicon!")
    }
    const setValue = new Set(fetchedLexiconWords); //removes duplicate words
    const filteredlexiconArray = [...setValue].filter(element => {
        return element.trim() !== '';}); //removes empty strings
    const newLexiconObject = {name: lexiconName, size : filteredlexiconArray.length, words : filteredlexiconArray, isOfficial : local}
    setLexiconDictionary((lexiconDictionary) => ({...lexiconDictionary, [lexiconName] : newLexiconObject}));
    return 1;
  }

  const getResult = (judgeWords) => {
    return judgeWords.filter(word => word !== "").every(word => (lexiconDictionary[currentLexicon].words).includes(word));
  }

  const handleNumberSelected = (event) => {
    setNumWordsSelected(Number(event.target.value));
    setWordsArray(new Array(MAX_NUM_CHALLENGES).fill(""));
    setAppState('TextInput');
  }

  //returns array of all lexicon names and sizes
  const lexiconData = (Object.keys(lexiconDictionary)).map( key => { 
    return { name: lexiconDictionary[key].name, size: lexiconDictionary[key].size, isOfficial: lexiconDictionary[key].isOfficial }; 
  });

  const getActiveComponent = () => {
        switch(appState) {
          case 'NumberSelector': return <NumberSelector onClick={handleNumberSelected} />;
          case 'TextInput': return <UserTextInput setWordsArray={(newArray) => setWordsArray(newArray)} wordsArray = {wordsArray} numWords={numWordsSelected} setAppState={(newAppState) => setAppState(newAppState)} />;
          case 'Results' : return <Results wordsArray={wordsArray} judgeResult={getResult(wordsArray)} returnToNumberSelector={() => setAppState('NumberSelector')} />;
          default : return <p>Test</p>;
        }
  }

  // loads default lexicons on initial render
  useEffect(() => {
    // addLexicon("IEL22", IEL22, true);
    // addLexicon("NZL21", NZL21, true);
    addLexicon("IEL22", "https://www.wordgamers.org/wp-content/uploads/2022/07/IEL22.txt", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(lexiconDictionary);

  const activeComponent = getActiveComponent();

  return (
    <div className="App">
      <Header lexiconData={lexiconData} setShowModal={setShowModal} setCurrentLexicon={setCurrentLexicon} currentLexicon={currentLexicon} />
      <div className="container">
        {/* {showModal && <PopUp addLexicon={addLexicon} setCurrentLexicon={setCurrentLexicon} showModal={showModal} setShowModal={setShowModal}/>} */}
        {activeComponent}
      </div>
      <Footer />
    </div>
  );
}

export default App;
