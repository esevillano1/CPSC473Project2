import Ember from 'ember';

var questions = [];
var answers = [];
var currentQuestion = 0;
var indexList = [1,2,3,4];
//changes the text of buttons to the answers
//changes text of div to question
var setAnswers = function () {
	var rand;
	if (currentQuestion < 5) {
		//randomly chooses where the answer should go
		rand = Math.floor(Math.random() * indexList.length);
		Ember.$('#question').html(questions[currentQuestion]);
		Ember.$('#answer' + indexList[rand]).html(answers[currentQuestion]['correct_answer']);
		//remove that element and assign incorrect answers randomly
		indexList.splice(rand, 1);
		//randomly chooses where the incorrect answers should go and removes index from list
		for (var i = 1; i < 4; i++)
		{
			rand = Math.floor(Math.random() * indexList.length);
			Ember.$('#answer' + indexList[rand]).html(answers[currentQuestion]['incorrect_answer_' + i]);
			indexList.splice(rand, 1);
		}
	}
	else {
		//end game function?
		currentQuestion=0;
		indexList = [1,2,3,4];
		$("#startGame").css("display", "");
		alert("Game complete!");

	}
};

var nextQuestion = function(){
	currentQuestion++;
	setAnswers();
};

var showButtons = function() {
	for(var i = 1; i < 5; ++i){
		Ember.$('#answer' + i).show();
	}
};

export default Ember.Controller.extend({
	submitDisabled: true,
	startDisabled: false,
	questionsCount: 5,
	answersCount: 4,
	userScore: 0,
	currentTries: 0,
	maxTries: 3,
	userAnswer: '',
	triviaUrl: 'https://opentdb.com/api.php?amount=5&type=multiple',

	actions: {
		startGame: function(){
			$("#startGame").css("display", "none");
			//this.set('startDisabled', true);
			this.set('currentTries', 0);
			this.set('userScore', 0);
			var url = this.get('triviaUrl');
			var count = this.get('questionsCount');
			// Helpful in determining a solution for this problem
			// https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript
			Ember.$.getJSON(url, function(data){

				// Debug statement to check if the OpenTDB API response was successful
				// console.log(data);

				for(var i = 0; i < count; ++i){
					questions.push(data['results'][i]['question']);
				}

				// Checks if the questions were pushed into the questions array
				// console.log(questions);
				for(var i = 0; i < count; ++i){
					//allow for associative indexing of the answer array
					answers[i] = {};
					answers[i]['correct_answer'] = data['results'][i]['correct_answer'];
					answers[i]['incorrect_answer_1'] = data['results'][i]['incorrect_answers'][0];
					answers[i]['incorrect_answer_2'] = data['results'][i]['incorrect_answers'][1];
					answers[i]['incorrect_answer_3'] = data['results'][i]['incorrect_answers'][2];
				}

				//correctAnswer = data['results'][0]['correct_answer'];
				//answers['correct_answer'] = data['results'][0]['correct_answer'];
				//answers['incorrect_answer_1'] = data['results'][0]['incorrect_answers'][0];
				//answers['incorrect_answer_2'] = data['results'][1]['incorrect_answers'][1];
				//answers['incorrect_answer_3'] = data['results'][2]['incorrect_answers'][2];

				// Creates the quiz screen
				setAnswers();
				showButtons();
			});

			//setAnswers();
			//questionDiv();
			//answerDiv();

		},

		submitAnswer: function() {
			var currentScore = this.get('userScore');
			var tries = this.get('currentTries');
			var maxTries = this.get('maxTries');
			var answerChoice = event.target.id;
			var answer = Ember.$("#" + answerChoice).html();

			if(answers[currentQuestion]['correct_answer'] === answer){
				this.set('userScore', currentScore + 1);
				this.set('currentTries', 0);
				nextQuestion();
			}
			else if (tries + 1 === maxTries) {
				this.set('currentTries', 0);
				nextQuestion();
			} else {
				this.set('currentTries', tries + 1);
			}
		}
	}
});
