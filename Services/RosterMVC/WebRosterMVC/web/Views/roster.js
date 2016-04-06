$(document).ready(function() {
    
    var addStudentButton = document.getElementById('addStudentButton');
    
    // Add student button action 
    addStudentButton.onclick = function() {
        // Create a new form object to add the student and display it
        var newStudentForm = document.createElement('form');
        newStudentForm.method = "POST";
        newStudentForm.id = 'newStudentForm';
        
        // Create text fields for student name, last name, id, and team number
        var nameField = document.createElement('input');
        nameField.type = "text";
        nameField.id = 'nameField';
        nameField.name = 'firstName';
        
        var lastNameField = document.createElement('input');
        lastNameField.type = "text";
        lastNameField.id = 'lastNameField';
        lastNameField.name = 'lastName';
        
        var idField = document.createElement('input');
        idField.type = "text";
        idField.id = 'idField';
        idField.name = 'id';
        
        var teamField = document.createElement('input');
        teamField.type = "text";
        teamField.id = 'teamField';
        teamField.name = 'team';
        
        // Create appropriate labels for the fields
        var nameLabel = document.createElement('label');
        nameLabel.for = 'nameField';
        nameLabel.innerHTML = 'Name: ';
        
        var lastNameLabel = document.createElement('label');
        lastNameLabel.for = 'lastNameField';
        lastNameLabel.innerHTML = 'Last Name: ';
        
        var idLabel = document.createElement('label');
        idLabel.for = 'idField';
        idLabel.innerHTML = 'ID: ';
        
        var teamLabel = document.createElement('label');
        teamLabel.for = 'teamField';
        teamLabel.innerHTML = 'Team: ';
        
        
        // Create the submit button to send request to add student
        var submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.innerHTML = 'Add';
        $(submitButton).on('click', sendForm);

        
        // Create a cancel button 
        var cancelButton = document.createElement('button');
        cancelButton.innerHTML = 'Cancel';
        cancelButton.type = 'button';    // to avoid the cancel button submitting the form
        cancelButton.onclick = function() {
            document.body.removeChild(newStudentForm);
            addStudentButton.disabled = false;
        };
        
        newStudentForm.appendChild(nameLabel);
        newStudentForm.appendChild(nameField);
        newStudentForm.appendChild(document.createElement('br'));
        
        newStudentForm.appendChild(lastNameLabel);
        newStudentForm.appendChild(lastNameField);
        newStudentForm.appendChild(document.createElement('br'));
        
        newStudentForm.appendChild(idLabel);
        newStudentForm.appendChild(idField);
        newStudentForm.appendChild(document.createElement('br'));
        
        newStudentForm.appendChild(teamLabel);
        newStudentForm.appendChild(teamField);
        newStudentForm.appendChild(document.createElement('br'));
        
        newStudentForm.appendChild(submitButton);
        newStudentForm.appendChild(cancelButton);
        
        document.body.insertBefore(newStudentForm, document.getElementById('rosterTable'));
        
        addStudentButton.disabled = true;
    };
    
});

var sendForm = function() {
    var http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/WebRosterMVC/Roster", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
    // sets params to all the content of the form in proper format
    var params =  $('#newStudentForm').serialize();
    http.send(params);
    http.onload = function() {
        window.location.reload();
    };  
};
