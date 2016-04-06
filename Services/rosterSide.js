$(document).ready(function() {
    $('#rosterJSP').click(function(){
        rosterJSP();
    })
    $('#rosterMVC').click(function(){
        rosterMVC();
    })
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
