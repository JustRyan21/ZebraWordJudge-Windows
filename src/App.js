import React, { useState, useEffect, } from 'react';
import UserTextInput from './UserTextInput/UserTextInput.js';
import NumberSelector from './NumberSelector/NumberSelector.js';
import PopUp from './PopUp/PopUp.js'
import Homepage from './Homepage/Homepage.js';
import Updatepage from './Updatepage/Updatepage.js';
import Results from './Results/Results.js';
import Header from './Header/Header.js';
import Footer from './Footer/Footer.js';
import './App.css';

const MAX_NUM_CHALLENGES = 4;

function App() {
  const [wordsArray, setWordsArray] = useState(new Array(MAX_NUM_CHALLENGES).fill("")); //array containing the words to judge
  const [numWordsSelected, setNumWordsSelected] = useState(4);
  const [appState, setAppState] = useState('Homepage'); 
  const [currentLexicon, setCurrentLexicon] = useState({name : "asd", wordList : [], isOfficial : true, hash : "", size : 1});
  const [showModal, setShowModal] = useState(false);

  // const loadLexicon = async (Lexicon) => {
  //   const response = await fetch(Lexicon);
  //   if(!response.ok) {
  //     console.log(response);
  //     throw new Error("Invalid URL!");
  //   }
  //   return (await response.text()).split(/\r?\n/);
  // };

  // //adds lexicon to lexiconDictionary
  // const addLexicon = async (lexiconName, lexiconURL, local) => {
  //   let prefix = local ? "" : PROXY_URL;
  //   var fetchedLexiconWords;
  //   try {
  //     fetchedLexiconWords = await loadLexicon(prefix + lexiconURL);
  //   } catch {
  //     return -1;
  //   }
  //   if(!fetchedLexiconWords) {
  //     throw new Error("Empty lexicon!")
  //   }
  //   const setValue = new Set(fetchedLexiconWords); //removes duplicate words
  //   const filteredlexiconArray = [...setValue].filter(element => {
  //       return element.trim() !== '';}); //removes empty strings
  //   const newLexiconObject = {name: lexiconName, size : filteredlexiconArray.length, words : filteredlexiconArray, isOfficial : local}
  //   setLexiconDictionary((lexiconDictionary) => ({...lexiconDictionary, [lexiconName] : newLexiconObject}));
  //   return 1;
  // }

  // const getResult = (judgeWords) => {
  //   return judgeWords.filter(word => word !== "").every(word => (lexiconDictionary[currentLexicon].words).includes(word));
  // }

  // const handleNumberSelected = (event) => {
  //   setNumWordsSelected(Number(event.target.value));
  //   setWordsArray(new Array(MAX_NUM_CHALLENGES).fill(""));
  //   setAppState('TextInput');
  // }

  // //returns array of all lexicon names and sizes
  // const lexiconData = (Object.keys(lexiconDictionary)).map( key => { 
  //   return { name: lexiconDictionary[key].name, size: lexiconDictionary[key].size, isOfficial: lexiconDictionary[key].isOfficial }; 
  // });

  const getActiveComponent = () => {
        switch(appState) {
          case 'NumberSelector': return <NumberSelector onClick={handleNumberSelected} />;
          case 'TextInput': return <UserTextInput setWordsArray={(newArray) => setWordsArray(newArray)} wordsArray = {wordsArray} numWords={numWordsSelected} setAppState={(newAppState) => setAppState(newAppState)} />;
          case 'Results' : return <Results wordsArray={wordsArray} judgeResult={getResult(wordsArray)} returnToNumberSelector={() => setAppState('NumberSelector')} />;
          case 'Homepage': return <Homepage setAppState={(newAppState) => setAppState(newAppState)} currentLexicon={currentLexicon} />;
          case 'Updatepage': return <Updatepage setAppState={(newAppState) => setAppState(newAppState)} setShowModal={setShowModal} setCurrentLexicon={setCurrentLexicon} currentLexicon={currentLexicon}/>;
          default : return <p>Test</p>; 
        }
  }

  // loads default lexicons on initial render
  useEffect(() => {
  }, []);

  const activeComponent = getActiveComponent();

  return (
    <div className="App">
      <Header setAppState={(newAppState) => setAppState(newAppState)}/>
      <div className="container">
        {activeComponent}
      </div>
      <Footer setShowModal={setShowModal} setCurrentLexicon={setCurrentLexicon} currentLexicon={currentLexicon} />
    </div>
  );  
}

export default App;
