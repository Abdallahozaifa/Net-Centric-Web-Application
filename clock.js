// JavaScript source code


function showTime() {
    var clock = document.getElementById("clock");
    var t = new Date();
    clock.innerHTML = t.toLocaleTimeString();
    //setTimeout(showTime, 1000);
}

function showBrowserInfo() {
    console.log(window.navigator.appName);
    console.log(window.navigator.appVersion);
    console.log(window.navigator.appCodeName);
};

window.onload = function () {
    showTime();
    setInterval(showTime, 1000);
    showBrowserInfo();
};
