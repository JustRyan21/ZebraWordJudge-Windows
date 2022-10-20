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
import { OFFICIAL_LEXICONS } from './CONSTANTS';
import sha256 from 'js-sha256'; 

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

  //checks if lexicon is official
  const checkIsOfficial = (name, hash) => {
    for(let i=0; i<OFFICIAL_LEXICONS.length; i++) {
        if(name === OFFICIAL_LEXICONS[i].officialName && hash === OFFICIAL_LEXICONS[i].officialHash) {
            return true;
        }
    }
    return false;
  }

  const chunkify = (lexiconWords) => {
    var wordsArray = [];
    if(lexiconWords.length < 10000000) {
        for(let i=0; i < lexiconWords.length; i+=1000000) {
            wordsArray.push(lexiconWords.substring(i, Math.min(lexiconWords.length,  i + 1000000)));
        }
    } else {
        throw new Error("Lexicon Too Large");
    }
    return wordsArray;
  }

  const storeLexicon = (lexiconName, lexiconChunks, lexiconHash) => {
    for(let i=0; i < lexiconChunks.length; i++) {
      send("INSERT into lexicon (Name, Wordlist, Hash) VALUES ('" + lexiconName + "-" + i + "','" + lexiconChunks[i] + "','" + lexiconHash + "')");
    }
  }

  //gets lexicon chunks from DB, joins them into large string, then splits into array and updates currentLexicon
  const getWordlistFromDB = async () => {
      const sql = "SELECT Wordlist FROM lexicon WHERE NAME LIKE NAME";
      // const sql = "SELECT Wordlist FROM lexicon";
      sendAsync(sql).then((result) => {
        if(result.length > 0) {
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
                  getWordlistFromDB();
              }).catch(() => {throw new Error("Store Lexicon Error"); return -1;});
          }).catch(() => {throw new Error("Fetch Lexicon Error"); return -1;});
      } catch (error) {
          console.log("Error storing lex");
          return -1;
      }
      console.log('Successfully stored in db: ', lexiconName);
      return 1;
  }

  const getHash = (fetchedLexicon) => {
    var newLineRegex = /\r\n/g;
    var combinedString = fetchedLexicon.replace(newLineRegex, "\n");  
    var lexiconHash = sha256(combinedString);
    console.log("lexHash", lexiconHash);
    return lexiconHash;
}

  const getHashFromDB = () => {
    const sql = "SELECT Name, Hash FROM lexicon";
    sendAsync(sql).then((result) => {
      if(result.length > 0) {
        var name = ((result[0].Name).split('-'))[0];
        var hashValue = result[0].Hash;
        const isOfficial = checkIsOfficial(name, hashValue);
        setCurrentLexicon((currentLexicon) => ({...currentLexicon, hash : hashValue, isOfficial : isOfficial}));
      } else {
        console.log("Unable to find hash value in DB");
      }
    }).catch(e => console.log(e));
  }

  const getNameFromDB = () => {
    const sql = "SELECT Name FROM lexicon";
    sendAsync(sql).then((result) => {
      if(result.length > 0) {
        var lexiconName = ((result[0].Name).split('-'))[0];
        setCurrentLexicon((currentLexicon) => ({...currentLexicon, name : lexiconName}));
      } else {
        console.log("Unable to find hash value in DB");
      }
    }).catch(e => console.log(e));
  }

  const setCurrentLexiconDetails = () => {
    getHashFromDB();
    getNameFromDB();
    getWordlistFromDB();
  }

  const initCurrentLexicon = async () => {
    const sql = "SELECT * from Lexicon";
    sendAsync(sql).then((result) => {
      if(result.length > 0) {
        setCurrentLexiconDetails();
      } else {
        var lexiconName = DEFAULT_LEXICON.name;
        var lexiconURL = DEFAULT_LEXICON.url;
        changeLexicon(lexiconName, lexiconURL);
      }
    }).catch(e => console.log(e));
  }

  console.log(currentLexicon);

  useEffect(() => {
    // deleteLexiconFromDB();
    initCurrentLexicon();
  }, []);

  const loadLexicon = async (Lexicon) => {
    const response = await fetch(Lexicon);
    if(!response.ok) {
      console.log(response);
      throw new Error("Invalid URL!");
    }
    return (await response.text());
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
    return judgeWords.filter(word => word !== "").every(word => (currentLexicon.wordList).includes(word));
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
