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
import SearchHistory from './SearchHistory/SearchHistory.js';

const MAX_NUM_CHALLENGES = 4;

function App() {
  const [wordsArray, setWordsArray] = useState(new Array(MAX_NUM_CHALLENGES).fill("")); //array containing the words to judge
  const [numWordsSelected, setNumWordsSelected] = useState(4);
  const [appState, setAppState] = useState('SearchHistory'); 
  const [currentLexicon, setCurrentLexicon] = useState({name : "", wordList : [], isOfficial : false, hash : "", size : 0});
  const [showModal, setShowModal] = useState(false);

   function send(data) {
    sendAsync(data).then((result) => {
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
      const sql = "SELECT Wordlist FROM lexicon";
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
    const sql = "DELETE from lexicon where name like name";
    sendAsync(sql).then((result) => {
    }).catch(e => console.log(e));
  }

  const changeLexicon = async (lexiconName, lexiconURL) => {
      try {
          await fetchLexicon(lexiconURL).then(fetchedLexicon => {
              var hash = getHash(fetchedLexicon); // hash fetched lexicon
              var isOfficial = checkIsOfficial(lexiconName, hash); //compare name + hash to our official list
              var chunks = chunkify(fetchedLexicon);
              deleteLexiconFromDB();    
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

  const addSearchEntry = (timestamp, wordList, lexicon, result) => {
      var words = wordList.join(" ").trim();
      try {
          const sql = "INSERT into history (timestamp, words, lexicon, result) VALUES ('"+timestamp+"','"+words+"','"+lexicon+"',"+result+");"
        sendAsync(sql).then((result) => {console.log(result)});
      } catch {
          throw new Error("Error Inserting Search Entry into DB");
      }
  }
  
  const deleteOldSearchesFromSearchHistory = () => {
      var oneYearOldSearches = []
      const sql = "SELECT * FROM history";
      sendAsync(sql).then((results) => {
          if(results.length) {
            for(let i=0; i<results.length; i++) {
                let timestamp = results[i].timestamp;
                let date = new Date(timestamp);
                let secondsSinceSearch = Math.floor((new Date() - date) / 1000);
                let yearsSinceSearch = Math.floor(secondsSinceSearch / 31536000);
                if (yearsSinceSearch) {
                    oneYearOldSearches.push(timestamp);
                } else {
                    break;
                }
            }
          }
      }).then(() => {
        for(let i=0; i<oneYearOldSearches.length; i++) {
          var sql2 = "DELETE FROM history WHERE timestamp='" + oneYearOldSearches[i] + "'";
          sendAsync(sql2).then((result) => {}).catch(e => console.log(e));
        }
      }).catch(e => console.log(e));
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

  useEffect(() => {
    // deleteLexiconFromDB();    
    initCurrentLexicon();
    deleteOldSearchesFromSearchHistory();
  }, []);

  const loadLexicon = async (Lexicon) => {
    const response = await fetch(Lexicon);
    if(!response.ok) {
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
    var result = judgeWords.filter(word => word !== "").every(word => (currentLexicon.wordList).includes(word));
    addSearchEntry((new Date()).toString(), judgeWords, currentLexicon.name, (result === true) ? 1 : 0);
    return result;
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
          case 'SearchHistory' : return <SearchHistory />
          default : return <p>Test</p>; 
        }
  }

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
