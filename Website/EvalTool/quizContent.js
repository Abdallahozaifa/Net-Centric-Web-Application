/*
* Quiz Area object that defines all the properties for the quiz area
*/
var QuizArea = function(){
    this.form = $("form").eq(0);
    this.startButton = $(".start");
    this.cancelButton =  $(".cancel");
    this.submitButton = $("#submitButton");
    this.questionTitle = $("#question");
    this.choice1Label = $("#choice1");
    this.choice2Label = $("#choice2");
    this.choice3Label = $("#choice3");
    this.choice4Label = $("#choice4");
    this.radioButton1 = $("#question1");
    this.radioButton2 = $("#question2");
    this.radioButton3 = $("#question3");
    this.radioButton4 = $("#question4");
    this.currentQuestion = 0; // the start button is question 0
    this.previousButton = $(".previous");
    this.nextButton = $(".next");
    this.userAnswer = "E";
};

/*
* Feed Back Area object that defines all the properties for the feed back area
*/
var FeedBackArea = function(){
    this.form = $("form").eq(1);
};

/*
* hides the Feed back form
*/
FeedBackArea.prototype.hideForm = function(){
    this.form.hide();
};

/*
* shows the Feed back form
*/
FeedBackArea.prototype.showForm = function(){
    this.form.show();
};
/*
* obtains the answers selected
*/
QuizArea.prototype.getAnswerSelected = function(){
    var userChoiceSelected = $('input:radio[name=quiz]:checked').val();
    return userChoiceSelected;
};

/*
* Changes the question to a different question in the Questions object
*/
QuizArea.prototype.changeQuestion = function(question){
    this.questionTitle.text(question.questionTitle);
    this.choice1Label.text("A) " + question.A);
    this.choice2Label.text("B) " + question.B);
    this.choice3Label.text("C) " + question.C);
    this.choice4Label.text("D) " + question.D);
    this.selectRadioButton(question.userAnswer);
    this.userAnswer = question.userAnswer;
};

/* 
* Shows the first Question 
*/
QuizArea.prototype.showFirstQuestion = function(){
    refreshProgress(2);  // 2 is for no direction, request same question
    quizArea.currentQuestion=1;
};

/**
 * cycles to the next question
 */
//QuizArea.prototype.nextQuestion = function(){
//    this.currentQuestion++;
//    this.changeQuestion(this.currentQuestion-1);
//}

/**
 * Cycles to the previous question
 */
//QuizArea.prototype.prevQuestion = function(){
//    this.currentQuestion--;      
//    this.changeQuestion(this.currentQuestion-1); 
//};

/*
* starts the quiz 
*/
QuizArea.prototype.startQuiz = function(){      
    this.showFirstQuestion();   
};

/**
 * hides the quiz
 */
QuizArea.prototype.hideQuiz = function(){    
    this.form.hide();
};

/**
 * hides the Submit Button
 */
QuizArea.prototype.hideSubmitButton = function(){    
    this.submitButton.hide();
};

/**
 * shows the Submit Button
 */
QuizArea.prototype.showSubmitButton = function(){    
    this.submitButton.show();
};


/**
 * Hides the Submit Button
 */
QuizArea.prototype.hideSubmitButton = function(){    
    this.submitButton.hide();
};

/**
 * Hides the Previous button
 */
QuizArea.prototype.hidePreviousButton = function(){    
    this.previousButton.hide();
};

/**
 * Shows the Previous button
 */
QuizArea.prototype.showPreviousButton = function(){    
    this.previousButton.show();
};

/**
 * Hides the Next button
 */
QuizArea.prototype.hideNextButton = function(){    
    this.nextButton.hide();
};

/**
 * Shows the Next button
 */
QuizArea.prototype.showNextButton = function(){    
    this.nextButton.show();
};

/**
 * shows the quiz
 */
QuizArea.prototype.showQuiz = function(){
    this.form.show();
};

/**
 * selects the radio button according to the users previous choice
 */
QuizArea.prototype.selectRadioButton = function(letterToSelect){
    /*
    * Obtains the radio button for Each Letter the user chooses
    */
    this.radioButtonSelection = {
        "A": this.radioButton1,
        "B": this.radioButton2,
        "C": this.radioButton3,
        "D": this.radioButton4
    };
    /*
    * Deselects all the radio buttons for the next qsuestion
    */
    this.deSelectAllRadioButton = function(){
        this.radioButtonSelection.A.attr('checked', false);
        this.radioButtonSelection.B.attr('checked', false);
        this.radioButtonSelection.C.attr('checked', false);
        this.radioButtonSelection.D.attr('checked', false);
    };
    var selectButton = this.radioButtonSelection[letterToSelect];
    if (selectButton != undefined) {
        selectButton.attr('checked', true)
        userAnswer = letterToSelect;
    }
    else {
        this.deSelectAllRadioButton();
        userAnswer = 'E';
    }
};

/*
* Creates a Quiz Area Object
*/
quizArea = new QuizArea();
feedBackArea = new FeedBackArea();
feedBackArea.hideForm();
quizArea.hideQuiz();
quizArea.hideSubmitButton();
quizArea.hidePreviousButton();

/**
 * Adds an event listener to the next button
 */
quizArea.nextButton.on("click", function() {
         /*
         * Prevents the Current Question from going past 10
         */
        if(quizArea.currentQuestion < 10){
            
            // 'Next' direction is 1
            refreshProgress(1);
            quizArea.currentQuestion++;            
        }
        /*
         * Displays the submit button on the 10th Question
         */
        if(quizArea.currentQuestion == 10){
            quizArea.showSubmitButton();
            quizArea.hideNextButton();
        }else{
            quizArea.showNextButton();
        }
        
         /*
         * Shows the previous button if the Current Question is greater than 1
         */
        if(quizArea.currentQuestion > 1){
            quizArea.showPreviousButton();
        }
});

function refreshProgress(direct) {
    var progress = new Object();
    progress.idnum = this.idnum;
    progress.answer = this.userAnswer;
    progress.direction = direct;
    progress.questionNumber = quizArea.currentQuestion;
    this.userAnswer = 'E'; // set back to default (no answer) of E

    if (progress.questionNumber == null)
        progress.questionNumber = 1;
    
    var request;
    if (window.XMLHttpRequest)
        request = new XMLHttpRequest;
    else
        request = new ActiveXObject("Microsoft.XMLHTTP");
    
    request.open("POST", "/EvalTool/quiz");
    
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var messageString = "idnum=" + this.idnum;
    messageString += "&ans=" + progress.answer;
    messageString += "&dir=" + progress.direction;
    messageString += "&qnum=" + progress.questionNumber;
    request.send(messageString);
    
    // Handle requests
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var newContent = JSON.parse(request.responseText);
            quizArea.changeQuestion(newContent);
        }
    }
}

/**
 * Adds an event listener to the previous button
 */
quizArea.previousButton.on("click", function() {
         /*
         * Prevents the Current Question from going below 1 
         */
        if(quizArea.currentQuestion > 1){
            // Previous is 0
            refreshProgress(0);
            quizArea.currentQuestion--;
        }
         /*
         * Hides the submit button if the Current Question is not 10
         */
        if(quizArea.currentQuestion != 10){
            quizArea.hideSubmitButton();
            quizArea.showNextButton();
        }
        
        /*
         * Hides the previous button if the Current Question is 1
         */
        if(quizArea.currentQuestion == 1){
            quizArea.hidePreviousButton();
        }
    
    
});

quizArea.form.submit(function(event) {
    /*
    * Checks to see if all the questions are answered
    */
//    if(quizArea.userAnswers.indexOf(undefined) >-1){
//        event.preventDefault();
//        alert("Please Answer all Questions!");
//    }else{
//        
//    }
    refreshProgress(2);
    var httpRequest;
    if (window.XMLHttpRequest)
        httpRequest = new XMLHttpRequest;
    else
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    
    httpRequest.open("POST", "/EvalTool/submit");
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var messageString = "idnum="+ idnum;
    httpRequest.send(messageString)
    quizArea.hideQuiz();
    feedBackArea.showForm();
    
    // Handle requests
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var scoreObject = JSON.parse(httpRequest.responseText);
            var score = scoreObject.score;
            console.log('Score is: ' + score);
            $('#message').text(score);
        }
    }
});

/**
 * Event handler for when the start buttons is clicked
 */
quizArea.startButton.click(function(){
   quizArea.cancelButton.hide();
   quizArea.startButton.hide();
   quizArea.showQuiz();
   quizArea.startQuiz(); 
});

window.onload = function() {
    this.idnum = Math.round(1000000 * Math.random());
    sessionStorage.idnum = this.idnum;
    $('input[type=radio][name=quiz]').on('click', updateAnswer);
    
}

var updateAnswer = function() {
    userAnswer = this.value;
}


