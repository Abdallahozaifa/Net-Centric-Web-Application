$(document).ready(function() {
    $('#rosterJSP').click(function(){
        rosterJSP();
    });
    $('#rosterMVC').click(function(){
        rosterMVC();
    });
    
    $('#aws').click(function() {
        amazonWebSearch();
    })
    

    $("#rosterJTable").click(function(){
        console.log("RosterJTable clicked!");
        rosterJSPTable();
    });  

});

function rosterMVC() {
    
    var contentFrame = parent.document.getElementById('cframe');
    var rosterFrame = contentFrame.contentWindow.document.getElementById('rosterFrame');
    rosterFrame.src = "/Services/RosterMVC/roster";
}

function rosterJSP() {
    var contentFrame = parent.document.getElementById('cframe');
    var rosterFrame = contentFrame.contentWindow.document.getElementById('rosterFrame');
    rosterFrame.src = "/Services/RosterJSP/roster";
}

function rosterJSPTable() {
    var contentFrame = parent.document.getElementById('cframe');
    var rosterFrame = contentFrame.contentWindow.document.getElementById('rosterFrame');
    rosterFrame.src = "/RosterJTable";
}


function amazonWebSearch() {
    var contentFrame = parent.document.getElementById('cframe');
    var rosterFrame = contentFrame.contentWindow.document.getElementById('rosterFrame');
    rosterFrame.src = "/AmazonBook/search.html";
}