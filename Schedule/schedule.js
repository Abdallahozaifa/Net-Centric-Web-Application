var schedule;

$(document).ready(function (){
    //console.log("$ready function");
    loadContents();
});

function loadContents() {
    //console.log("loadContents() is run");
	$.getJSON("/Schedule/schedule.json", generateTable);
}



function generateTable(data) {
	//Clear sidebar contents
	parent.clearSideBar();
	//console.log("generateTable()");
    var table = $('<table id="theTable"/>');
	
	//Iterates through each object in the data array
	$.each(data, function(i, row){
		var tempRow = '<tr ';
        tempRow += styleRow(i, row);
        tempRow += '> ';

		//Iterates through each field in the individual objects of data array
		$.each(row, function(i2, rowdata){
            tempRow += '<td '
            tempRow += styleCell(rowdata, i2, i);
			tempRow += '>' + rowdata + '</td>';
		});
		tempRow += '</tr>';
		table.append(tempRow);
	});
	
	$('#table').append(table);
	
}

styleCell.orangeQueue = 0;
styleCell.blueQueue = 0; // queues to set next x cells to blue or orange or purple
styleCell.purpleQueue = 0;

function styleCell(rowdata, i, rowNum) {
    var stylingString = '';
    var LabMatches = /Lab\d/.exec(rowdata);
    var QuizMatches = /Quiz\d/.exec(rowdata);
    var orangeRowMatch = /F:/.exec(rowdata);
    var workOnProjectMatch = /Work on project/.exec(rowdata);
    var FinalProjectMatch = /Final project/.exec(rowdata);
    var teamWorkCalendarMatch = /Teamwork Calendar/.exec(rowdata);
    
    if ((i == 'topic' || i == 'project' || i == 'notes') && rowNum != 0)
        stylingString="id=blueBG ";
    if (orangeRowMatch) 
        orangeQueue = 5;
    
    if (this.orangeQueue > 0) {
        if (this.orangeQueue <= 3)
            stylingString= "id=orangeBG ";
        this.orangeQueue--;
    }
    
    if (FinalProjectMatch) {
        stylingString= "id=purpleBG ";
        this.purpleQueue = 3;
    }
    
    if (this.purpleQueue > 0) {
        stylingString="id=purpleBG ";
        this.purpleQueue--;
    }
    
    if (LabMatches)  // if lab is in topic, set class to lab for styling
        stylingString+= "class=lab ";
    
    else if (workOnProjectMatch) {
        stylingString+= "class=work ";
}
    else if (QuizMatches)
        stylingString+= "class=quiz ";
    
    else if (teamWorkCalendarMatch)
        stylingString+= "class=teamwork ";
    
    
        
    return stylingString;
}

styleRow.color = 'gray';
function styleRow(i, row) {
    var stylingString = '';
    if (i == 0)
        stylingString += 'class=header ';
    else if (row.tag != '') {
        if (styleRow.color == 'white')
            styleRow.color = 'gray';
        else
            styleRow.color = 'white';
    }
    if (i != 0)
        stylingString += 'id=' + styleRow.color + ' ';
    return stylingString;
}