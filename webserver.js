// Correct Answers for the Questions
var correctAnswers = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'];

var express = require('express');
var fs = require('fs');
var bodyParser  = require('body-parser');
var nodemailer = require('nodemailer');

var ChatServer  = require('./CloudChat/ChatServer');
var syllabus  = require('./Syllabus/syllabus');
var quiz = require("./EvalTool/quiz");

//setup the root path
var root = __dirname;
ChatServer.gettool.root = root;
syllabus.gettool.root = root;
quiz.gettool.root = root;

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

app.get('/EvalJSONP/JSONP/next', function(req, res) {
    handleJSONP(req, res);
});
app.get('/EvalJSONP/JSONP/submit', function(req, res) {
    handleJSONP(req, res);
});
app.get('/EvalJSONP/JSONP/prev', function(req, res) {
    handleJSONP(req, res);
});

app.use('/EvalTool',express.static('EvalTool'));
app.use('/EvalJSONP', express.static('EvalJSONP'));

app.get('/tableofcontents.js', function (req, res) {
	fs.readFile('tableofcontents.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/quizContent.js', function (req, res) {
	fs.readFile('quizContent.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/quizPage.js', function(req, res) {
    fs.readFile('quizPage.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});
});

app.get('/quiz.css', function (req, res) {
	fs.readFile('quiz.css', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/ThreeRegion/*', threeregion);
function threeregion(req, res) {
	var fileName = root +req.path;
	  res.sendFile(fileName, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
	    else {
	      console.log('Sent:', req.path);
	    }
	  });
}

app.get('/CloudChat/*', ChatServer.gettool);
app.get('/Syllabus/*', syllabus.gettool);
app.get('/quiz/*', quiz.gettool);


app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});



// JSONP responses
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

