var addStudentButton;
var deleteStudentButton;
var deleteTeamButton;
var buttonAlreadyPressed = false;
$(document).ready(function() {
    
    addStudentButton = document.getElementById('addStudentButton');
    deleteStudentButton = document.getElementById('deleteStudentButton');
    deleteTeamButton = document.getElementById('deleteTeamButton'); 
    
    // Add student button action 
    addStudentButton.onclick = function() {
        if (buttonAlreadyPressed == false) {
            buttonAlreadyPressed = true;
            var form = createForm('newStudent');
            document.body.insertBefore(form, document.getElementById('rosterTable'));
            addStudentButton.disabled = true;
        } else
            alert('One thing at a time!');
    }
    deleteStudentButton.onclick = function() {
        if (buttonAlreadyPressed == false) {
            buttonAlreadyPressed = true;
            var form = createForm('deleteStudent');
            document.body.insertBefore(form, document.getElementById('rosterTable'));
            deleteStudentButton.disabled = true;
        } else
            alert('One thing at a time!');
    };
    deleteTeamButton.onclick = function() {
        if (buttonAlreadyPressed == false) {
            buttonAlreadyPressed = true;
            // Create a new form object to add the student and display it
            var deleteTeamForm = document.createElement('form');
            deleteTeamForm.id = 'deleteTeamForm';

            var teamField = document.createElement('input');
            teamField.type = "text";
            teamField.id = 'teamField';
            teamField.name = 'team';

            var teamLabel = document.createElement('label');
            teamLabel.for = 'teamField';
            teamLabel.innerHTML = 'Team: ';

            // Create the submit button to send request to add student
            var submitButton = document.createElement('button');
            submitButton.type = 'button';
            submitButton.innerHTML = 'Delete';
            $(submitButton).on('click', sendDeleteTeamForm);


            // Create a cancel button 
            var cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.type = 'button';    // to avoid the cancel button submitting the form
            cancelButton.onclick = function() {
                document.body.removeChild(deleteTeamForm);
                deleteTeamButton.disabled = false;
                buttonAlreadyPressed = false;
            };

            deleteTeamForm.appendChild(teamLabel);
            deleteTeamForm.appendChild(teamField);
            deleteTeamForm.appendChild(document.createElement('br'));

            deleteTeamForm.appendChild(submitButton);
            deleteTeamForm.appendChild(cancelButton);

            document.body.insertBefore(deleteTeamForm, document.getElementById('rosterTable'));

            deleteTeamButton.disabled = true;
        } else
            alert('One thing at a time!');
    
    };   
    
});

// purpose should be a string indication on of the options below
// purpose="newStudent" ; purpose="deleteStudent" ; purpose="deleteTeam"
function createForm(purpose) {
    
    var purposeName;
    
    if (purpose === "newStudent" || purpose === "deleteStudent" || purpose === "deleteTeam")
        purposeName = purpose;
    else // if an invalid or no purpose is provided, assume a new student is going to be added
        purposeName = "newStudent";
    
    var newForm = document.createElement('form');
        newForm.id = purposeName + 'Form';
        
        // Create text fields for student name, last name, id, and team number
        var nameField = document.createElement('input');
        nameField.type = "text";
        nameField.id = 'lastNameField';
        nameField.name = 'firstName';
        
        var lastNameField = document.createElement('input');
        lastNameField.type = "text";
        lastNameField.id = 'firstNameField';
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
        nameLabel.for = 'firstNameField';
        nameLabel.innerHTML = 'First Name: ';
        
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
        if (purpose === "newStudent") {
            submitButton.innerHTML = 'Add';
            $(submitButton).on('click', sendNewStudentForm);
        } else if (purpose === "deleteStudent") {
            submitButton.innerHTML = 'Delete';            
            $(submitButton).on('click', sendDeleteStudentForm);
        }

        
        // Create a cancel button 
        var cancelButton = document.createElement('button');
        cancelButton.innerHTML = 'Cancel';
        cancelButton.type = 'button';    // to avoid the cancel button submitting the form
        if (purpose == "newStudent") {
            cancelButton.onclick = function() {
                document.body.removeChild(newForm);
                addStudentButton.disabled = false;
                buttonAlreadyPressed = false;
            };
        } else if (purpose == "deleteStudent") {
            cancelButton.onclick = function() {
                document.body.removeChild(newForm);
                deleteStudentButton.disabled = false;
                buttonAlreadyPressed = false;
            };
        } else if (purpose == "deleteTeam") {
            cancelButton.onclick = function() {
                document.body.removeChild(newForm);
                deleteTeamButton.disabled = false;
                buttonAlreadyPressed = false;
            };
        }
        
        newForm.appendChild(nameLabel);
        newForm.appendChild(nameField);
        newForm.appendChild(document.createElement('br'));
        
        newForm.appendChild(lastNameLabel);
        newForm.appendChild(lastNameField);
        newForm.appendChild(document.createElement('br'));
    
    // Write out an OR to show that the user can either enter first and last name OR the ID
        if (purpose == "deleteStudent") {
            var or = document.createElement('label')
            or.innerHTML = 'OR';
            newForm.appendChild(or);
            newForm.appendChild(document.createElement('br'));
        }
        
        newForm.appendChild(idLabel);
        newForm.appendChild(idField);
        newForm.appendChild(document.createElement('br'));
        
        if (purpose != "deleteStudent") {
            newForm.appendChild(teamLabel);
            newForm.appendChild(teamField);
            newForm.appendChild(document.createElement('br'));
        }
        
        newForm.appendChild(submitButton);
        newForm.appendChild(cancelButton);
        
    return newForm;
}

var sendNewStudentForm = function() {
        
    var firstNameField = document.getElementById('firstNameField');
    var lastNameField = document.getElementById('lastNameField');
    var idField = document.getElementById('idField');
    var teamField = document.getElementById('teamField');
    
    // Check that all fields are populated
    if (firstNameField.value != '' && lastNameField.value != '' && idField.value != '' 
        && teamField.value != '') 
    {
        var http = new XMLHttpRequest();
        http.open("POST", "http://localhost:8080/WebRosterMVC/Roster", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
        // sets params to all the content of the form in proper format
        var params =  $('#newStudentForm').serialize();
        http.send('purpose=add&'+ params);
        http.onload = function() {
            window.location.reload();
        };    
    } else
        alert('Please fill in all fields for the new student.');
};

var sendDeleteStudentForm = function() {
    var firstNameField = document.getElementById('firstNameField');
    var lastNameField = document.getElementById('lastNameField');
    var idField = document.getElementById('idField');
    var pass;
    
    if (firstNameField.value != '' && lastNameField.value != '')
        pass = 'name';
    else if (idField.value != '')
        pass = 'id';
    
    var http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/WebRosterMVC/Roster", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
    // sets params to all the content of the form in proper format
    var params;
    
    if (pass == 'id') {
        params = 'purpose=delete&target=student&id=' + idField.value;
        http.send(params);
    }
    else if (pass == 'name') {
        params = 'purpose=delete&target=student&firstName=' + firstNameField.value + '&' + 'lastName=' + lastNameField.value;
        http.send(params);
    }
    else
        alert('Please provide a first & last name OR and ID.');
    
    
    http.onload = function() {
        window.location.reload();
    };  
}

var sendDeleteTeamForm = function() {
    var teamField = document.getElementById('teamField');
    if (teamField.value != '') {
        var http = new XMLHttpRequest();
        http.open("POST", "http://localhost:8080/WebRosterMVC/Roster", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
        // sets params to all the content of the form in proper format
        var params = 'purpose=delete&target=team&team=' + teamField.value;
        http.send(params);
        
        http.onload = function() {
            window.location.reload();
        };
    } else
        alert('Please fill in the team field!');
}
