  

$(document).ready(function() {
    
    const DB_NAME = 'mdn-demo-indexeddb-epublications';
    const DB_VERSION = 1; // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'publications';

    var db;
    
      // Used to keep track of which view is displayed to avoid uselessly reloading it
    var current_view_pub_key;

    function openDb() {
        console.log("openDb ...");
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = function (evt) {
            // db = req.result;
            db = this.result;
            console.log("openDb DONE");
        };
        req.onerror = function (evt) {
            console.error("openDb:", evt.target.errorCode);
        };

        req.onupgradeneeded = function (evt) {
            console.log("openDb.onupgradeneeded");
            var store = evt.currentTarget.result.createObjectStore(
            DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

            store.createIndex('biblioid', 'biblioid', { unique: true });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('year', 'year', { unique: false });
        };
    }
});




function saveToIndexedDB(data) {
    
    
    
}