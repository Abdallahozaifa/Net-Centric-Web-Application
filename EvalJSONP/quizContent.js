/*
* Quiz Area object that defines all the properties for the quiz area
*/    
var navDocument = parent.getSideFrameDoc();
var quizArea = undefined;

var QuizArea = function() {
    
    this.form = $("form").eq(0);
    
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
    this.userAnswer = undefined;
};

QuizArea.prototype.fetchNavButtons = function(){
    this.previousButton = $("#previous");
    this.nextButton = $("#next");
    this.startButton = $("#start");
    this.cancelButton =  $("#cancel");
    this.submitButton = $("#submit");
}

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
    refreshProgress(1);  // 2 is for no direction, request same question
    quizArea.showNextButton();
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
        userAnswer = undefined;
    }
};


function refreshProgress(direct) {  
    
    // User Query for JSONP
    var progress = "?idnum=" + parent.sessionStorage.idnum;
    progress += "&ans=" + this.userAnswer;
    progress += "&qnum=" + quizArea.currentQuestion;
    //this.userAnswer = 'E'; // set back to default (no answer) of E
    
    var request;
    if (direct == 0)  // 0 means previous
        getJSONP("/EvalJSONP/JSONP/prev"+progress, handleJSONP);
    else if (direct == 1) // 1 is next
        getJSONP("/EvalJSONP/JSONP/next"+progress, handleJSONP);
    else if (direct == 2) // 2 is submit
        getJSONP("/EvalJSONP/JSONP/submit"+progress, handleJSONP);
}

// ************************* \\
// ***** JSONP METHODS ***** \\
// ************************* \\

function getJSONP(url, handler) {
    var cbnum = "cb" + getJSONP.counter++;
    var cbname = "getJSONP." + cbnum;
    if (url.indexOf("?") == -1) // ? not found in url
        url += "?";
    else
        url += "&";
    url += "callback=" + cbname;
    var script = document.createElement('script');
    getJSONP[cbnum] = function(response) {
        try {
            handler(response);
        } finally {
            delete getJSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    }
    // To trigger the HTTP request
    script.src = url;
    document.body.appendChild(script);
}

getJSONP.counter = 0;

function handleJSONP(obj) {
    questionObject = JSON.parse(obj);
    
    if (questionObject.correctAnswers == undefined) {
        quizArea.changeQuestion(questionObject);
    } else {
        $('#message').text('My score was ' + questionObject.correctAnswers + '/10.');
        $('#message').attr('readonly', true);
    }
}

// ************************ \\
// * END OF JSONP METHODS * \\
// ************************ \\

var submitAction = function() {
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
    quizArea.hideQuiz();
    quizArea.hidePreviousButton();
    quizArea.hideSubmitButton();
    feedBackArea.showForm();
};


/**
 * Adds an event listener to the next button
 */
var nextAction = function() {
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
};

/*
/**
 * Adds an event listener to the previous button
 */
var prevAction = function() {
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
};

var startAction = function() {
    quizArea.cancelButton.hide();
    quizArea.startButton.hide();
    quizArea.showQuiz();
    quizArea.startQuiz(); 
};


var updateAnswer = function() {
    userAnswer = this.value;
}

$(document).ready(function() {
	//Remove side window contents
	parent.clearSideBar();
	
    sessionStorage.idnum = "" + Math.round(1000000 * Math.random());
    $('input[type=radio][name=quiz]').on('click', updateAnswer);  
    
	/*
     * Creates a Quiz Area Object
     */
    quizArea = new QuizArea();
    feedBackArea = new FeedBackArea();
    feedBackArea.hideForm();
    quizArea.hideQuiz(); 
    quizArea.fetchNavButtons();
    quizArea.hideNextButton();
    quizArea.hideSubmitButton();
    quizArea.hidePreviousButton();
    
    //if (flag)
    //    quizArea.fetchNavButtons();
    //else 
    //    setTimeout(quizArea.fetchNavButtons, 500);
    
    quizArea.nextButton.on('click', nextAction);
    quizArea.previousButton.on('click', prevAction);
    quizArea.submitButton.on('click', submitAction);
    quizArea.startButton.on('click', startAction);
    
});


