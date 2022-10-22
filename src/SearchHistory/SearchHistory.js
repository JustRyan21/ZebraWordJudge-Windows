import React, {useEffect, useState} from 'react';
import Search from '../Search/Search.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { faFileExport } from "@fortawesome/free-solid-svg-icons/faFileExport";
import sendAsync from '../../renderer';
import './SearchHistory.css';

export default function SearchHistory() {
    const [searchHistory, setSearchHistory] = useState([]);
    const [selectedSearches, setSelectedSearches] = useState([]);
    
    const getSearchHistoryFromDB = () => {
        var searchHistoryArray = [];
        const sql = "SELECT * FROM History";
        sendAsync(sql).then((results) => {
            if(results.length > 0) {
                var timestamp;
                var wordList;
                var result;
                var lexicon;
                for(let i=0; i<results.length; i++) {
                    wordList = results[i].words;
                    result = results[i].result;
                    timestamp = results[i].timestamp;
                    lexicon = results[i].lexicon;
                    searchHistoryArray.push({timestamp : timestamp, wordList : wordList, lexicon : lexicon, result : result})
                }
            }
        }).catch(err => console.log("ERROR getting Search History"));
        setSearchHistory(searchHistoryArray);
    }

    const deleteHistoryFromDB = () => {
        const sql = "DELETE FROM history";
        sendAsync(sql).then((result) => {}).catch(e => console.log(e));
    }

    const deleteSelectedSearchesFromDB = (selectedSearches) => {
        for(let i=0; i<selectedSearches.length; i++) {
            const sql = "DELETE FROM history WHERE timestamp='" + selectedSearches[i] + "'";
            sendAsync(sql).then((result) => {}).catch(e => console.log(e));
        }
    }

    const selectSearch = timestamp => {
        if (selectedSearches.includes(timestamp)) {
            const newListItems = selectedSearches.filter(searchID => searchID !== timestamp);
            return setSelectedSearches([...newListItems]);
        }
        setSelectedSearches([...selectedSearches, timestamp]);
  };

    const clearAll = async () => {
        deleteHistoryFromDB();
        getSearchHistoryFromDB();
    }

    const handleonClick = (timestamp) => {
        selectSearch(timestamp);
    }

    const searches = searchHistory.slice(0).reverse().map((search, index) => {
        return <Search 
            key={index}
            timestamp={search.timestamp} 
            lexicon={search.lexicon} 
            wordList={search.wordList} 
            result={search.result}
            onClick={handleonClick}
            selected={selectedSearches.includes(search.timestamp)}
            />
    });

    const removeFromSearchHistory = (selectedSearches) => {
        var updatedHistory = searchHistory.filter(value => !selectedSearches.includes(value.timestamp));
        setSearchHistory(updatedHistory);
    }

    const deleteSelectedSearches = () => {
        deleteSelectedSearchesFromDB(selectedSearches);
        setSelectedSearches([]);
        removeFromSearchHistory(selectedSearches)
    }

    useEffect(() => {
        getSearchHistoryFromDB();
    }, []);

    console.log(searchHistory);

    const handleExport = () => {
        var exampleEmail = 'support@example.com'
        var subject = 'Zebra Word Judge History'
        var body = getEmailBody();
        window.open('mailto:' + exampleEmail + '?subject=' + subject + '&body=' + body);
    }

    const getEmailBody = () => {
        var body = "Exported " + searchHistory.length + " Searches from Zebra Word Judge iOS App.\n\n";
        var searchString = "";
        for(let i=0; i<searchHistory.length; i++) {
            var time = searchHistory[i].timestamp;
            var wordList = searchHistory[i].wordList;
            var result = searchHistory[i].result;
            var lexicon = searchHistory[i].lexicon;
            
            searchString += (i+1) + ")\n";
            searchString += "result: " + (result === 1 ? "ACCEPTED " : "UNACCEPTED") + "\n";
            searchString += "time: " + time + "\n"; 
            searchString += "lexicon: " + lexicon + "\n";
            searchString +=  wordList.split(" ").length + (wordList.split(" ").length === 1 ? " word" : " words") + ": " + wordList.replace(/[ ]+/g, ", ") + "\n\n";
        }
        return body + searchString;
    }

    return (
        <div className='bg'>
            <div className='titleContainer'>
                <div onClick={handleExport} className="exportButton">
                <h1 className="exportText">History</h1>
                {/* <FontAwesomeIcon icon={faFileExport} size={"2x"} className="exportText"/> */}
            </div>
        </div>
        <div className="historyFooter">
                <div className="buttonRow">
                    <div onClick={deleteSelectedSearches} className="clearButton">
                        <FontAwesomeIcon className={"icon " + (selectedSearches.length ? "btnEnabled" : "btnDisabled")} icon={faTrashCan} size={"sm"}/>
                        <p className={"clearText " + (selectedSearches.length ? "btnEnabled" : "btnDisabled")}>Delete {selectedSearches.length ? "(" + selectedSearches.length + ") " : ""}</p>
                    </div>

                    <p className="clearText">{searchHistory.length}{searchHistory.length === 1 ? " Item" : " Items"}</p>

                    <div onClick={clearAll} className="clearButton">
                        <p className="clearText">Clear All</p>
                        <FontAwesomeIcon icon={faArrowsRotate} size={"sm"} />
                    </div>
                </div>
            </div>

            <div className="searches">
                {searches}
            </div>

            <div className="historyFooter">
                <div className="buttonRow">
                   <p>End of History</p>
                </div>
            </div>

        </div>
        
    )
}