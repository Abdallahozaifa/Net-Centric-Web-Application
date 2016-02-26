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
    this.currentQuestion = 1;
    this.previousButton = $(".previous");
    this.nextButton = $(".next");
    this.userAnswers = ["","","","","","","","","",""];
};

/*
* Feed Back Area object that defines all the properties for the feed back area
*/
var FeedBackArea = function(){
    this.form = $("form").eq(1);
    console.log(this.form);
};

/*
* hides the Feed back form
*/
FeedBackArea.prototype.hideForm = function(){
    console.log(this.form);
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
QuizArea.prototype.changeQuestion = function(questionNumber){
    this.questionTitle.text(Questions[questionNumber].Question);
    this.choice1Label.text("A) " + Questions[questionNumber].A);
    this.choice2Label.text("B) " + Questions[questionNumber].B);
    this.choice3Label.text("C) " + Questions[questionNumber].C);
    this.choice4Label.text("D) " + Questions[questionNumber].D);
};

/*
* Shows the first Question 
*/
QuizArea.prototype.showFirstQuestion = function(){
    this.changeQuestion(this.currentQuestion-1);
};

/**
 * cycles to the next question
 */
QuizArea.prototype.nextQuestion = function(){
    this.currentQuestion++;
    this.changeQuestion(this.currentQuestion-1);
}

/**
 * Cycles to the previous question
 */
QuizArea.prototype.prevQuestion = function(){
    this.currentQuestion--;      
    this.changeQuestion(this.currentQuestion-1); 
};

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
QuizArea.prototype.selectRadioButton = function(currentQuestion){
    var userLetterChosen = this.userAnswers[currentQuestion];
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
    var selectButton = this.radioButtonSelection[userLetterChosen];
    selectButton != undefined ? selectButton.attr('checked', true) : this.deSelectAllRadioButton(); 
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
            quizArea.userAnswers[quizArea.currentQuestion-1] = quizArea.getAnswerSelected();
            quizArea.selectRadioButton(quizArea.currentQuestion);
            console.log(quizArea.userAnswers);
            quizArea.nextQuestion();
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

/**
 * Adds an event listener to the previous button
 */
quizArea.previousButton.on("click", function() {
         /*
         * Prevents the Current Question from going below 1 
         */
        if(quizArea.currentQuestion > 1){
            quizArea.userAnswers[quizArea.currentQuestion-1] = quizArea.getAnswerSelected();
            quizArea.selectRadioButton(quizArea.currentQuestion-2);
            console.log(quizArea.userAnswers);
            quizArea.prevQuestion();
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
    quizArea.userAnswers[9] = quizArea.getAnswerSelected(); // pushes the 10th answer
    console.log(quizArea.userAnswers);
    /*
    * Checks to see if all the questions are answered
    */
//    if(quizArea.userAnswers.indexOf(undefined) >-1){
//        event.preventDefault();
//        alert("Please Answer all Questions!");
//    }else{
//        
//    }
    
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/quiz");
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(quizArea.userAnswers.toJson()));
    quizArea.hideQuiz();
    feedBackArea.showForm();
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

function createCookie(name, value) {
  var cookie = name + "=" + value + ";";
  document.cookie = cookie;
  //createCookie("Hozaifa", "Awesome");
  //console.log(document.cookie);
};



