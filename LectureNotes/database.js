$(function () {
  var COMPAT_ENVS = [
    ['Firefox', ">= 16.0"],
    ['Google Chrome',
     ">= 24.0"]
  ];
  var compat = $('#compat');
  compat.empty();
  compat.append('<ul id="compat-list"></ul>');
  COMPAT_ENVS.forEach(function(val, idx, array) {
    $('#compat-list').append('<li>' + val[0] + ': ' + val[1] + '</li>');
  });

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

      store.createIndex('lec-id', 'lec-id', { unique: true });
      store.createIndex('slide-id', 'slide-id', { unique: true });
      store.createIndex('note-id', 'note-id', { unique: true });
      store.createIndex('note', 'note', { unique: false });
    };
  }

  /**
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function clearObjectStore(store_name) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayNotes(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }

  function getBlob(key, store, success_callback) {
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.blob);
    };
  }

  /**
   * @param {IDBObjectStore=} store
   */
  function displayNotes(store) {
    console.log("displayNotes");

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');

    var note_msg = $('#note-msg');
    note_msg.empty();
    var note_list = $('#note-list');
    note_list.empty();
    // Resetting the iframe so that it doesn't display previous content
    newViewerFrame();

    var req;
    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      note_msg.append('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;

      // If the cursor is pointing at something, ask for the data
      if (cursor) {
        console.log("displayNotes cursor:", cursor);
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          var list_item = $('<li>' +
                            '[' + cursor.key + '] ' +
                            '(Lecture ID: ' + value.lectureID + ')' +
                            '(Slide ID: ' + value.slideID + ')' + 
                            '(Note ID: ' + value.noteID + ')' + 
                            '(Note :' + value.noteVal + ')' +
                            '</li>');

          note_list.append(list_item);
        };

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct ids
        i++;
      } else {
        console.log("No more entries");
      }
    };
  }

  function newViewerFrame() {
    var viewer = $('#note-viewer');
    viewer.empty();
    var iframe = $('<iframe />');
    viewer.append(iframe);
    return iframe;
  }

  function setInViewer(key) {
    console.log("setInViewer:", arguments);
    key = Number(key);
    if (key == current_view_pub_key)
      return;

    current_view_pub_key = key;

    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    getBlob(key, store, function(blob) {
      console.log("setInViewer blob:", blob);
      var iframe = newViewerFrame();

      // It is not possible to set a direct link to the
      // blob to provide a mean to directly download it.
      if (blob.type == 'text/html') {
        var reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = (function(evt) {
          var html = evt.target.result;
          //var text = reader.result;
          //console.log("setInViewer HTML:", text);
          iframe.contents().find('html').html(html);
        });
      } else if (blob.type.indexOf('image/') == 0) {
        var obj_url = window.URL.createObjectURL(blob);
        console.log("setInViewer IMAGE:"+obj_url);
        iframe.load(function() {
          var img_id = 'image-' + key;
          var img = $('<img id="' + img_id + '"/>');
          $(this).contents().find('body').html(img);
          $(this).contents().find('#' + img_id).attr('src', obj_url);
          window.URL.revokeObjectURL(obj_url);
        });
        iframe.attr('src', obj_url);
      } else {
        iframe.contents().find('body').html("No view available");
      }

    });
  }


  /**
   * @param {string} biblioid
   * @param {string} title
   * @param {number} year
   * @param {Blob=} blob
   */
  function addNote(lectureID, slideID, noteID, noteVal) {
    console.log("addNote arguments:", arguments);
    var obj = { lectureID: lectureID, slideID: slideID, noteID: noteID, noteVal:noteVal };

    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
      
    var req;
    try {
      req = store.add(obj);
    } catch (e) {
      if (e.name == 'DataCloneError')
        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                             "use Firefox");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      displayActionSuccess();
      displayNotes(store);
    };
    req.onerror = function() {
      console.error("addNote error", this.error);
      displayActionFailure(this.error);
    };
  }

  /**
   * @param {string} biblioid
   */
  function deleteNoteFromStore(lectureID, slideID, noteID) {
    console.log("deleteNoteFromStore:", arguments);
  
      
    var transaction = db.transaction([DB_STORE_NAME], "readwrite");
      
      console.log("Transaction: ");
      console.log(transaction);

      
/*    transaction.oncomplete = function(event){
        console.log(event);
    }*/
    
    var objectStore = transaction.objectStore(DB_STORE_NAME);

    console.log("objectStore: ");
      console.log(objectStore);
      
    objectStore.get(lectureID).onsuccess = function(e){
      if (typeof e.target.result == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      objectStore.delete(e.target.result.id);
    }
      

    
  }

  /**
   * @param {number} key
   * @param {IDBObjectStore=} store
   */
  function deleteNote(key, store) {
    console.log("deleteNote:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readwrite');

    // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
    // the result of the Object Store Deletion Operation algorithm is
    // undefined, so it's not possible to know if some records were actually
    // deleted by looking at the request result.
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      // Warning: The exact same key used for creation needs to be passed for
      // the deletion. If the key was a Number for creation, then it needs to
      // be a Number for deletion.
      req = store.delete(key);
      req.onsuccess = function(evt) {
        console.log("evt:", evt);
        console.log("evt.target:", evt.target);
        console.log("evt.target.result:", evt.target.result);
        console.log("delete successful");
        displayActionSuccess("Deletion successful");
        displayNotes(store);
      };
      req.onerror = function (evt) {
        console.error("deleteNote:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("deleteNote:", evt.target.errorCode);
    };
  }

  function displayActionSuccess(msg) {
    msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
    $('#msg').html('<span class="action-success">' + msg + '</span>');
  }
  function displayActionFailure(msg) {
    msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
    $('#msg').html('<span class="action-failure">' + msg + '</span>');
  }
  function resetActionStatus() {
    console.log("resetActionStatus ...");
    $('#msg').empty();
    console.log("resetActionStatus DONE");
  }

  function addEventListeners() {
    console.log("addEventListeners");

    $('#register-form-reset').click(function(evt) {
      resetActionStatus();
    });

    $('#add-button').click(function(evt) {
      console.log("add ...");
      var lectureID = $('#lec-id').val();
      var slideID = $('#slide-id').val();
      var noteID = $('#note-id').val();
      var noteVal = $('#note').val();
      if (!lectureID || !slideID) {
        displayActionFailure("Required field(s) missing");
        return;
      }
        
      if (isNaN(lectureID)){
          displayActionFailure("Invalid lecture ID");
          return;
      }
      else if(isNaN(slideID)){
          displayActionFailure("Invalid slide ID");
          return;
      }
      else if(isNaN(noteID)){
          displayActionFailure("Invalid note ID");
          return;
      }
      
      addNote(lectureID, slideID, noteID, noteVal);

    });

    $('#delete-button').click(function(evt) {
      console.log("delete ...");
      var lectureID = $('#lec-id-to-delete').val();
      var slideID = $('#slide-id-to-delete').val();
      var noteID = $('#note-id-to-delete').val();

      if (lectureID && slideID && noteID)
          deleteNoteFromStore(lectureID, slideID, noteID);
      else if (!lectureID){
          displayActionFailure("Invalid lecture ID");
          return;
      }
      else if (!slideID){
          displayActionFailure("Invalid slide ID");
          return;
      }
      else if (!noteID){
          displayActionFailure("Invalid note ID");
          return;
      }
          
        
        
      
    });

    $('#clear-store-button').click(function(evt) {
      clearObjectStore();
    });

    var search_button = $('#search-list-button');
    search_button.click(function(evt) {
      displayNotes();
    });

  }

  openDb();
  addEventListeners();

}); 