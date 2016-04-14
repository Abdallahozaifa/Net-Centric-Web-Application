$(document).ready(function() {
    $("#submitButton").on('click', function() {
        sendAWSRequest();
    })
});

function sendAWSRequest() {
    var accessID = document.getElementById('accessID');
    var secretKey = document.getElementById('secretKey');
    var searchQuery = document.getElementById('searchQuery');
    
    // Check that all fields are populated
    if (accessID.value != '' && secretKey.value != '' && searchQuery.value != '') 
    {
        var http = new XMLHttpRequest();
        http.open("POST", "/amazonWebServiceSearch", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
        // sets params to all the content of the form in proper format
        var params =  $('#searchForm').serialize();
        http.send(params);   
        
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
            var responseObject = JSON.parse(http.responseText);
            loadResponse(responseObject);
        }
};
        
    } else
        alert('Please fill in all fields for the new student.');
}

function loadResponse(responseObject) {
    $("#searchForm").hide();
    var message;
    for (var i in responseObject) {
        var span = document.createElement('span');

        for (var ii in responseObject[i]) {
            var infoElementP = document.createElement('label')
            infoElementP.textContent = responseObject[i][ii];
            span.appendChild(infoElementP);
            span.appendChild(document.createElement('br'));
        }
        span.appendChild(document.createElement('br'));

        document.body.appendChild(span);
    }
}