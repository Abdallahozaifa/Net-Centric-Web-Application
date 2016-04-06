// Correct Answers for the Questions
var correctAnswers = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'];

var express = require('express');
var fs = require('fs');
var bodyParser  = require('body-parser');
var nodemailer = require('nodemailer');

//setup the root path
var root = __dirname;

var app = express();

// Variable declarations
var ids = [];
var answers = [];
var scores = new Object();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("jsonp callback", true);

app.listen(8888, function() {
  console.log('Server running at http://127.0.0.1:8888/');
});

//Root directory is not working for app.use()
app.use('/', express.static(__dirname+'/public'));

app.use('/EvalTool',express.static('EvalTool'));
app.use('/EvalJSONP', express.static('EvalJSONP'));
app.use('/Schedule', express.static('Schedule'));
app.use('/Syllabus', express.static('Syllabus'));
app.use('/CloudChat', express.static('CloudChat'));
app.use('/ThreeRegion', express.static('ThreeRegion'));
app.use('/CanvasAnimation', express.static('CanvasAnimation'));
app.use('/LectureNotes', express.static('LectureNotes'));
app.use('/Services/RosterJSP', express.static('Services/RosterJSP'));
app.use('/Services', express.static('Services'));




//These are still here because app.use(express.static) is not functioning at the
//root level
//*****************************************************************************//
//**************************Root level get functions***************************//
//*****************************************************************************//

app.get('/', function (req, res) {
	fs.readFile('home.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/about.html', function (req, res) {
	fs.readFile('about.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/side.html', function (req, res) {
	fs.readFile('side.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/clock.js', function (req, res) {
	fs.readFile('clock.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/quiz.js', function (req, res) {
	fs.readFile('/EvalTool/quiz.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/tableofcontents.js', function (req, res) {
	fs.readFile('tableofcontents.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});





//*****************************************************************************//
//*****************************EvalTool functions******************************//
//*****************************************************************************//

app.post('/EvalTool/submit', function(req, res) {
    
    var id = req.body['idnum'];
    var index = findIndexForId(id);
    var correctResponses = 0;
    
    for (var i = 0; i < 10; i++) {
        if (answers[index][i] == correctAnswers[i])
            correctResponses++;
    }
    
    scores[id] = correctResponses;
    console.log('User ' + id + ' scored ' + scores[id]);
    
    var scoreObject = new Object();
    scoreObject.score = scores[id];
    
    res.write(JSON.stringify(scoreObject));
    res.end();
    
});



app.post('/EvalTool/quiz',function(req,res){
        
    var id = req.body["idnum"];
    
    if (ids.length < 10) {
        var index = findIndexForId(id);
        
        if (index == -1)    // New ID
            index = createIdEntry(id);
        
        var questionNumber = req.body["qnum"];
        var answer = req.body["ans"];
        var direction = req.body["dir"];
        
        if (questionNumber == 0)
            questionNumber = 1;
        
        if (answer != undefined)
            answers[index][questionNumber-1] = answer;    
        
        console.log(answers[index]);
        
        // update the questionNumber to the question to be served
        if (direction == 0) // if 0, previous
            questionNumber--;
        else if (direction == 1) // if 1, next
            questionNumber++;
        // if 2, or anything else, serve the same question
        
        if (questionNumber < 0 || questionNumber > 10)
            throw Error("Question number is not within range.");
        
        
                
        res.write(JSON.stringify(question));
        res.end();
    }
    
});
app.post('/EvalTool/sendmail', function(req, res) {
    console.log('email request recieved');
    var transport = nodemailer.createTransport();
    mailObject = new Object();
    mailObject.from = req.body.fname + '<' + req.body.femail + '>';
    mailObject.subject = req.body.subject;
    mailObject.to = req.body.tname + '<' + req.body.temail + '>';
    mailObject.text = req.body.message;
    transport.sendMail(mailObject, function(error, info) {
	   if(error){
		   console.log(error);
	   } else {
		   console.log("Message sent: " + info.response);
	   }
    });
    
    res.write('Request recieved');
    res.end();
});




//*****************************************************************************//
//****************************EvalJSONP functions******************************//
//*****************************************************************************//

app.get('/EvalJSONP/JSONP/next', function(req, res) {
    handleJSONP(req, res);
});
app.get('/EvalJSONP/JSONP/submit', function(req, res) {
    handleJSONP(req, res);
});
app.get('/EvalJSONP/JSONP/prev', function(req, res) {
    handleJSONP(req, res);
});



//*****************************************************************************//
//*****************************Schedule functions******************************//
//*****************************************************************************//

app.get('/Schedule/schedule.json', function(req, res){
    res.send(schedule);
});


//*****************************************************************************//
//****************************JSONP Quiz Functions*****************************//
//*****************************************************************************//

function handleJSONP(req, res) {
    var index = findIndexForId(req.query.idnum);
    if (index == -1) {
        index = createIdEntry(req.query.idnum)
    }
    
    if (req.query.ans != undefined && req.query.qnum != 0) 
        answers[index][req.query.qnum-1] = req.query.ans;
    
    if (req.path == "/EvalJSONP/JSONP/next") {
        req.query.direction = "next";
        sendJSONP(res, req);
    } else if (req.path == "/EvalJSONP/JSONP/submit") {
        req.query.direction = "submit";
        sendJSONP(res, req);
    } else if (req.path == "/EvalJSONP/JSONP/prev") {
        req.query.direction = "prev";
        sendJSONP(res, req);
    }
}

function sendJSONP(res, req) {
    var questionObject;
    var idnum = req.query.idnum;
    
    if (req.query.direction == "next") {
        questionObject = getQuestion(parseInt(req.query.qnum)+1, idnum);
    } else if (req.query.direction == "prev") {
        questionObject = getQuestion(req.query.qnum-1, idnum);
    } else if (req.query.direction == "submit") {
        questionObject = checkAnswers(idnum);
    }
    
    res.jsonp(JSON.stringify(questionObject));
}

function gettool(req, res) {
    if (/JSONP/.exec(req.path)!=null) handleJSONP(res, req);
    else {
        var fileName = gettool.root + req.path;
        res.sendFile(fileName, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        } else 
            console.log('Sent: ' + req.path);
        });
    }
}

function getQuestion(questionNumber, id) {
    var index = findIndexForId(id);
    // question object to send back
    var question = new Object();
    console.log(questionNumber + '    ');
    question.questionTitle = Questions[questionNumber-1]["Question"];
    question.A = Questions[questionNumber-1]["A"];
    question.B = Questions[questionNumber-1]["B"];
    question.C = Questions[questionNumber-1]["C"];
    question.D = Questions[questionNumber-1]["D"];
    
    if (id != undefined && index != -1)
        question.userAnswer = answers[index][questionNumber-1];
    else
        question.userAnswer = undefined;
    
    return question;
}

function checkAnswers(idnum) {
    var index = findIndexForId(idnum);
    var object = new Object();
    object.correctAnswers = 0;
    if (index == -1)
        console.log('id not found?');
    else 
        for (var i = 0; i < 10; i++) 
            if (correctAnswers[i] == answers[index][i])
                object.correctAnswers++;
    
    return object;
}

function findIndexForId(id) {
    for (var i = 0; i < ids.length; i++)
        if (ids[i] == id)
            return i;
   return -1;
}
    
    // creates a new entry for the id 
function createIdEntry(id) {
    ids.push(id);
        index = ids.length-1;
        answers.push(new Array());
        for (var i = 0; i < 10; i++)
            answers[index].push(undefined);
    
    return index;       
}

//******************************************************************************//
//***************************WEB SERVICES FUNCTIONS*****************************//
//******************************************************************************//

app.get('/Services/RosterJSP/roster', function(req, res){
    res.redirect("http://localhost:8080/WebRoster/roster.jsp");
});

app.get('/Services/RosterMVC/roster', function(req, res){
    res.redirect("http://localhost:8080/WebRosterMVC");
});

//******************************************************************************//
//*********************************DATA*****************************************//
//******************************************************************************//

/*
* Schedule object containing table data for schedule page
*/
var schedule = [
    //Title
    {
        "classNo":"Class #",
        "date":"Date",
        "tag":"Tag",
        "topic":"Topic",
        "project":"Project",
        "notes":"Notes" 
    },
    //Row 1
    {
        "classNo":1,
        "date":"M: 1/11",
        "tag":"JScript",
        "topic":"Introduction to Web Applications",
        "project":"Topic: Course Web Application",
        "notes":""
    },
    //Row 2
    {
        "classNo":2,
        "date":"W: 1/13",
        "tag":"",
        "topic":"Fundamental Javascript",
        "project":"",
        "notes":"David 2-8" 
    },
    //Row 3
    {
        "classNo":3,
        "date":"F: 1/15",
        "tag":"",
        "topic":"Regular Expressions",
        "project":"",
        "notes":"David 10"
    },
    //Row 4
    {
        "classNo":4,
        "date":"W: 1/20",
        "tag":"JScript",
        "topic":"Server-Side JavaScript",
        "project":"",
        "notes":"David 12"
    },
    //Row 5
    {
        "classNo":"",
        "date":"F: 1/22",
        "tag":"",
        "topic":"Lab1: Node.js",
        "project":"Node server",
        "notes":"Quiz1"
    },
    //Row 6
    {
        "classNo":5,
        "date":"M: 1/25",
        "tag":"JScript",
        "topic":"Javascript in Web Browsers",
        "project":"",
        "notes":"David 13" 
    },
    //Row 7
    {
        "classNo":6,
        "date":"W: 1/27",
        "tag":"",
        "topic":"Javascript: the Window object",
        "project":"",
        "notes":"David 14"
    },
    //Row 8
    {
        "classNo":"",
        "date":"F: 1/29",
        "tag":"",
        "topic":"Lab2: Node.js",
        "project":"Simple web site",
        "notes":"Quiz2" 
    },
    //Row 9
    {
        "classNo":7,
        "date":"M: 2/1",
        "tag":"HTML & CSS",
        "topic":"Scripting Document: the model",
        "project":"Scripting client",
        "notes":"David 15"
    },
    //Row 10
    {
        "classNo":8,
        "date":"W: 2/3",
        "tag":"",
        "topic":"Scripting CSS: the view",
        "project":"CSS design",
        "notes":"David 16"
    },
    //Row 11
    {
        "classNo":"",
        "date":"F: 2/5",
        "tag":"",
        "topic":"Lab3: Node.js",
        "project":"Syllabus TOC",
        "notes":"Quiz3"
    },
    //Row 12
    {
        "classNo":9,
        "date":"M: 2/8",
        "tag":"Event",
        "topic":"Advanced Javascript: event handling",
        "project":"Scripting client",
        "notes":"David 17"
    },
    //Row 13
    {
        "classNo":10,
        "date":"W: 2/10",
        "tag":"",
        "topic":"Advanced Javascript: event handling",
        "project":"Scripting client",
        "notes":"David 17"
    },
    //Row 14
    {
        "classNo":"",
        "date":"F: 2/12",
        "tag":"",
        "topic":"Lab4: Node.js",
        "project":"Simple Evaluation tool",
        "notes":"Quiz4"
    },
    //Row 15
    {
        "classNo":11,
        "date":"M: 2/15",
        "tag":"Ajax",
        "topic":"Advanced Javascript: Ajax I",
        "project":"Ajax component",
        "notes":"David 18"
    },
    //Row 16
    {
        "classNo":12,
        "date":"W: 2/17",
        "tag":"",
        "topic":"Advanced Javascript: Ajax II",
        "project":"Ajax component",
        "notes":"David 18"
    },
    //Row 17
    {
        "classNo":"",
        "date":"F: 2/19",
        "tag":"",
        "topic":"Lab5: Node.js",
        "project":"Evaluation tool upon Ajax",
        "notes":"Quiz5"
    },
    //Row 18
    {
        "classNo":13,
        "date":"M: 2/22",
        "tag":"jQuery",
        "topic":"Advanced Javascript: jQuery I",
        "project":"Use jQuery",
        "notes":"David 19"
    },
    //Row 19
    {
        "classNo":14,
        "date":"W: 2/24",
        "tag":"",
        "topic":"Advanced Javascript: jQuery II",
        "project":"Use jQuery",
        "notes":"David 19"
    },
    //Row 20
    {
        "classNo":"",
        "date":"F: 2/26",
        "tag":"",
        "topic":"Lab6: Node.js",
        "project":"Construct schedule table",
        "notes":"Quiz6"
    },
    //Row 21
    {
        "classNo":15,
        "date":"M: 2/29",
        "tag":"HTML Media & Graphics",
        "topic":"Scripting Images",
        "project":"",
        "notes":"David 21" 
    },
    //Row 22
    {
        "classNo":16,
        "date":"W: 3/2",
        "tag":"",
        "topic":"Graphics in canvas",
        "project":"",
        "notes": "David 21"
    },
    //Row 23
    {
        "classNo":"",
        "date":"F: 3/4",
        "tag":"",
        "topic":"Lab7: Node.js",
        "project":"UML class editor",
        "notes":"David 21"
    },
    //Row 24
    {
        "classNo":17,
        "date":"M: 3/14",
        "tag":"HTML5 API",
        "topic":"Web Workers",
        "project":"",
        "notes":"Quiz7"
    },
    //Row 25
    {
        "classNo":18,
        "date":"W: 3/16",
        "tag":"",
        "topic":"Web Sockets",
        "project":"",
        "notes":"David 22"
    },
    //Row 26
    {
        "classNo":"",
        "date":"F: 3/18",
        "tag":"",
        "topic":"Lab8: Node.js",
        "project":"Group chat",
        "notes":"David 22"
    },
    //Row 27
    {
        "classNo":19,
        "date":"M: 3/21",
        "tag":"JSP",
        "topic":"Fundamental JSP",
        "project":"Use GlassFish inside NetBeans",
        "notes":"Quiz8"
    },
    //Row 28
    {
        "classNo":20,
        "date":"W: 3/23",
        "tag":"",
        "topic":"JSP & JavaBeans",
        "project":"",
        "notes":"Martin ch1"
    },
    {
        "classNo":"",
        "date":"F: 3/25",
        "tag":"",
        "topic":"Lab9: JSP",
        "project":"Roster JSP with JavaBeans",
        "notes":"Quiz9"
    },
    {
        "classNo":21,
        "date":"M: 3/28",
        "tag":"REST",
        "topic":"JSP & MVC",
        "project":"",
        "notes":"Martin ch1"
    },
    {
        "classNo":22,
        "date":"W: 3/30",
        "tag":"",
        "topic":"RESTful Web Services: HttpServlet",
        "project":"Intro to REST principles",
        "notes":"Martin ch2"
    },
    {
        "classNo":"",
        "date":"F: 4/1",
        "tag":"",
        "topic":"Lab10: RESTful Web Services (MVC)",
        "project":"RESTful services with MVC",
        "notes": "Quiz10"
    },
    {
        "classNo":23,
        "date":"M: 4/4",
        "tag":"REST",
        "topic":"RESTful Web Services: jTable & DB",
        "project":"",
        "notes":""
    },
    {
        "classNo":24,
        "date":"W: 4/6",
        "tag":"",
        "topic":"RESTful Web Services: Restlet",
        "project":"",
        "notes":"Martin ch2"
    },
    {
        "classNo":"",
        "date":"F: 4/8",
        "tag":"",
        "topic":"Lab11: RESTful Web Services (jTable)",
        "project":"RESTful Web Services with jTable UI",
        "notes":""
    },
    {
        "classNo":25,
        "date":"M: 4/11",
        "tag":"REST",
        "topic":"Consuming RESTful Services on the Web",
        "project":"Javascript client to Pub. REST",
        "notes":"Martin ch3"
    },
    {
        "classNo":26,
        "date":"W: 4/13",
        "tag":"",
        "topic":"Lab12: Real world RESTful Web Services",
        "project":"",
        "notes":"Martin ch3"
    },
    {
        "classNo":"",
        "date":"F: 4/15",
        "tag":"",
        "topic":"Work on project",
        "project":"Teamwork Calendar",
        "notes":""
    },
    {
        "classNo":27,
        "date":"M: 4/18",
        "tag":"Project",
        "topic":"Work on project",
        "project":"",
        "notes":""
    },
    {
        "classNo":28,
        "date":"W: 4/20",
        "tag":"",
        "topic":"Work on project",
        "project":"",
        "notes":""
    },
    {
        "classNo":"",
        "date":"F: 4/22",
        "tag":"",
        "topic":"Work on project",
        "project":"",
        "notes":""
    },
    {
        "classNo":"",
        "date":"M: 4/25",
        "tag":"Project",
        "topic":"Final project Presentation",
        "project":"",
        "notes":""
    },
    {
        "classNo":"",
        "date":"W: 4/27",
        "tag":"",
        "topic":"Final project Presentation",
        "project":"",
        "notes":""
    },
    {
        "classNo":"",
        "date":"F: 4/29",
        "tag":"",
        "topic":"Final project Presentation; Course Review",
        "project":"",
        "notes":""
    }
]


/*
*  Question object that contains all 10 questions
*/
var Questions = [
    {
        "Question": "1. Which of the following is not a valid CSS selector?",
        "A": "div, p",
        "B": "[target=_blank]",
        "C": "#p, [target]",
        "D": "a:active"
    },
    {
        "Question": "2. Where can bubbling be stopped from?",
        "A": "Bubbling cannot be stopped",
        "B": "Anywhere on the propogation tree",
        "C": "Only from the object on which the event was registered",
        "D": "Only through the containing window object"

    },
    {
        "Question": "3. Which of the following events is an example of an exception to element bubbling?",
        "A": "Scroll Events",
        "B": "Button Clicks",
        "C": "Page Loading",
        "D": "Mouse Drag"

    },
    {
        "Question": "4. The three phases involved in event propogation are?",
        "A": "Capturing, Propogation, Bubbling",
        "B": "Propogation, Invocation, Bubbling",
        "C": "Capturing, Invocation, Bubbling",
        "D": "Bubbling, Invocation, Execution"

    },
    {
        "Question": "5. Which is not a valid state for an anchor object?",
        "A": "Clicked",
        "B": "Visited",
        "C": "Link",
        "D": "Hover"
    },
    {
        "Question": "6. The setTimeout() and setInterval() functions belong to which JavaScript object?",
        "A": "Document",
        "B": "Window",
        "C": "They are local to each browser page",
        "D": "They are predefined as event objects"

    },
    {
        "Question": "7. JavaScipt files cannot be",
        "A": "Included on an HTML page as a local file",
        "B": "Included on an HTML page as an external file",
        "C": "Written in-line on an HTML page",
        "D": "Run as a standalone file"
    },
    {
        "Question": "8. What does CSS stand for?",
        "A": "Creative Style Sheets",
        "B": "Colorful Style Sheets",
        "C": "Computer Style Sheets",
        "D": "Cascading Style Sheets",

    },
    {
        "Question": "9. Client-side scripts have access to cookies through what object?",
        "A": "Window",
        "B": "Document",
        "C": "localStorage",
        "D": "Browser"

    },
    {
        "Question": "10. Which of the following is not a JavaScript keyword?",
        "A": "this",
        "B": "return",
        "C": "screen",
        "D": "button"
    }    
];

