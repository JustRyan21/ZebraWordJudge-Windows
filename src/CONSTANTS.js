// URL to the homepage of this website     -- Header.js
export const HOMEPAGE_URL = "https://uoa-compsci399-s2-2022.github.io/ZebraWordJudgeWebV/";

//URL to download app for other platforms  -- Footer.js
export const iOS_APP_URL = ""; 
export const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=dev.isaacy.zebra";
export const WINDOWS_APP_URL = "";

// //URL to organization homepages         -- Footer.js
export const WORDGAMERS_URL = "https://www.wordgamers.org/";
export const ASSOCIATION_OF_SCRABBLE_PLAYERS_URL = "https://scrabble.org.nz/";

//Allows accessing the contents of a .txt file URL using the fetch API -- App.js
export const PROXY_URL = "https://stark-plateau-11908.herokuapp.com/";
export const DEFAULT_LEXICON = {name : "IEL22", url : "https://raw.githubusercontent.com/Dylan-Early/Zebra/main/IEL22.txt"};
export const OFFICIAL_LEXICONS = [
    { officialName : "NZL21" , officialHash : "384d521e516ddaf2c1046f73779c90b675629612d2d57cca8888bf10537f19b0" },
    { officialName : "IEL22" , officialHash : "384d521e516ddaf2c1046f73779c90b675629612d2d57cca8888bf10537f19b0" }
];