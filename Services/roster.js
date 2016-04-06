//Global variables holding the buttons of the side panel 
//for the Web Services page
var rosterJSPBtn;

$(document).ready(function(){
    loadContents();
});

function loadContents() {
    parent.parent.clearSideBar();    
    setSide(parent.parent.getSideFrameWin());
}
    
    
function setSide(sideFrameWin) {
    sideFrameWin.location = "/Services/side.html";
}