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
import sendAsync from '../renderer.js';
import {DEFAULT_LEXICON} from "./CONSTANTS";

const MAX_NUM_CHALLENGES = 4;

function App() {
  const [wordsArray, setWordsArray] = useState(new Array(MAX_NUM_CHALLENGES).fill("")); //array containing the words to judge
  const [numWordsSelected, setNumWordsSelected] = useState(4);
  const [appState, setAppState] = useState('Homepage'); 
  const [currentLexicon, setCurrentLexicon] = useState({name : "asd", wordList : [], isOfficial : true, hash : "", size : 1});
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

   function send(data) {
    sendAsync(data).then((result) => {
      console.log("response: ", result);
      return result;
    }).catch(e => console.log(e));
  }

  const getHash = () => {return '1'}
  const checkIsOfficial = () => {return true}
  const chunkify = () => {['sdsadasdasdasdad']}

  const storeLexicon = (lexiconName, lexiconChunks, lexiconHash) => {
    for(let i=0; i < lexiconChunks.length; i++) {
      send("INSERT into lexicon (Name, Wordlist, Hash) VALUES (" + lexiconName + "-" + i + "," + lexiconChunks[i] + "," + lexiconHash + ")");
    }
  }

  //gets lexicon chunks from DB, joins them into large string, then splits into array and updates currentLexicon
  const getWordlistFromDB = async () => {
      const sql = "SELECT Wordlist FROM lexicon WHERE NAME LIKE NAME";
      sendAsync(sql).then((result) => {
        setResponses(result);
        if(result.length) {
          var joinedWordlist = "";
          for(let i=0; i<result.length; i++) {
              joinedWordlist += result[i].Wordlist;
          }
          var lexiconWords = joinedWordlist.split(/\r?\n/);
          setCurrentLexicon((currentLexicon) => ({...currentLexicon, wordList : lexiconWords, size : lexiconWords.length}));
        } else {
        console.log("Unable to find");
        }
      }).catch(e => console.log(e));
  }

   const deleteLexiconFromDB = () => {
    const sql = "DELETE from lexicon";
    sendAsync(sql).then((result) => {
      console.log("response: ", result);
    }).catch(e => console.log(e));
    }

  const changeLexicon = async (lexiconName, lexiconURL) => {
      try {
          await fetchLexicon(lexiconURL).then(fetchedLexicon => {
              var hash = getHash(fetchedLexicon); // hash fetched lexicon
              var isOfficial = checkIsOfficial(lexiconName, hash); //compare name + hash to our official list
              var chunks = chunkify(fetchedLexicon);
              // deleteLexiconFromDB();      for some reason causes infinite render loop
              storeLexicon(lexiconName, chunks, hash).then(() => {
                  setCurrentLexicon({...currentLexicon, name : lexiconName, isOfficial : isOfficial, hash : hash});
                  // getWordlistFromDB();
              }).catch(() => {throw new Error("Store Lexicon Error"); return -1;});
          }).catch(() => {throw new Error("Fetch Lexicon Error"); return -1;});
      } catch (error) {
          console.log("Error storing lex");
          return -1;
      }
      console.log('Successfully stored in db: ', lexiconName);
      return 1;
  }

  const initCurrentLexicon = async () => {
    const sql = "SELECT * from Lexicon";
    sendAsync(sql).then((result) => {
      if(result.length > 0) {
        console.log("Lex Found: ", result);
      } else {
        var lexiconName = DEFAULT_LEXICON.name;
        var lexiconURL = DEFAULT_LEXICON.url;
        changeLexicon(lexiconName, lexiconURL);
      }
    }).catch(e => console.log(e));
  }

  useEffect(() => {
    // send("SELECT * from History");
    initCurrentLexicon()
    // send("SELECT * from History where words like 'sadsad'");
    // send("INSERT into history values ('-1', 'testtest', 'testtest', 0);");
  }, []);

  const loadLexicon = async (Lexicon) => {
    const response = await fetch(Lexicon);
    if(!response.ok) {
      console.log(response);
      throw new Error("Invalid URL!");
    }
    return (await response.text()).split(/\r?\n/);
  };

    //fetches lexicon from URL
  const fetchLexicon = async (LexiconURL) => {
      var fetchedLexiconWords; 
      try {
          fetchedLexiconWords = await loadLexicon(LexiconURL);
      } catch {
          throw new Error("ERROR FETCHING LEXICON");
      }
      return fetchedLexiconWords;
  }

  const getResult = (judgeWords) => {
    return judgeWords.filter(word => word !== "").every(word => (lexiconDictionary[currentLexicon].words).includes(word));
  }

  const handleNumberSelected = (event) => {
    setNumWordsSelected(Number(event.target.value));
    setWordsArray(new Array(MAX_NUM_CHALLENGES).fill(""));
    setAppState('TextInput');
  }

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
