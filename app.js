import { database } from './firebase.js';

const selectors = {
    questionContainerSelector: document.querySelector('.question-container'),
    questionSelector: document.querySelector('.question'),
    answerSelector: document.querySelectorAll('.anwser'),
    answerButtons: document.querySelectorAll('.answer-buttons .btn'),
    startButtonSelector: document.querySelector('.controls__start-button'),
    restartButtonSelector: document.querySelector('.controls__next-button'),
    scoreContainerSelector: document.querySelector('.score'),
    scoreValueSelector: document.querySelector('.score__value'),
    scoreUpdateSelector: document.querySelector('.score__update')
};

let totalScore;
let correctQuestionFromDb = '';


function getQuestionFromDB() {

    let random = Math.floor(Math.random() * 100) + 1;
    // laczenie z baza danych
    let reference = database.ref('questions/' + random);
    reference.on('value', getQuestion, getError);

}


function getError(error) {
    console.log(error)

}



// pobieranie pytania i odpowiedzi z bazy i wpisanie ich do odpowiednich pól
function getQuestion(data) {
    let questionFromDB = data.val();
    const { question, answer, correct } = questionFromDB;

    correctQuestionFromDb = correct;
    selectors.questionSelector.innerText = question;
    selectors.answerSelector.forEach((selector, id) => {
        selector.innerText = answer[id];
    });
};



//zmiana wyniku
function updateScoreNumber(numberToChangeScore) {
    const { scoreValueSelector } = selectors;
    totalScore += numberToChangeScore;
    scoreValueSelector.textContent = totalScore;
}




//sprawdzenie poprawnej odpowiedzi
selectors.answerButtons.forEach(selector => {
    selector.addEventListener('click', checkCorrectAnswer)
});


function checkCorrectAnswer() {

    console.log(correctQuestionFromDb);
    const { answerButtons, answerSelector, scoreUpdateSelector } = selectors;

//poprawić skrypt dobrego pytania po zmianach algorytmu
    getQuestionFromDB();
    // e.toElement.classList.add('checked');
    // setTimeout(() => {

    //     answerSelector.forEach(sel => {
    //         if (sel.textContent == correct) {
    //             sel.classList.add('correct');

    //             scoreUpdateSelector.classList.add('update');
    //         }
    //         else {
    //             sel.classList.add('wrong');
    //             scoreUpdateSelector.classList.add('update');
    //         }
    //     });
    //     e.toElement.classList.remove('checked');

    // }, 3000);


    // setTimeout(() => {
    //     e.toElement.textContent == correctAnswerFromDB ? updateScoreNumber(10) : updateScoreNumber(-7);
    //     scoreUpdateSelector.classList.remove('update');

    // }, 4000);



    // setTimeout(() => {
    //     // clearAddedClassNames();
    //     
    // }, 5000);



}

function clearAddedClassNames() {
    const { answerSelector } = selectors;

    answerSelector.forEach(sel => {


        sel.classList.remove('correct');
        sel.classList.remove('wrong');
    })
}

//funkcja inicjaloizująca,resetowanie pól tekstowych
function initialFunction() {

    const { questionSelector, answerSelector } = selectors;
    questionSelector.innerText = '';
    answerSelector.forEach((answer => {
        answer.innerText = '';
    }));

    totalScore = 0;
    getQuestionFromDB();
};

// event nacisnięcia przycisku start, przejście do planszy z grą
selectors.startButtonSelector.addEventListener('click', (e) => {
    const { questionContainerSelector, restartButtonSelector, scoreContainerSelector } = selectors;

    e.toElement.classList.toggle('hide');
    questionContainerSelector.classList.toggle('hide');
    restartButtonSelector.classList.toggle('hide');
    scoreContainerSelector.classList.toggle('hide');
    initialFunction();
});


selectors.restartButtonSelector.addEventListener('click', () => {
    getQuestionFromDB();
    totalScore = 0;
    selectors.scoreValueSelector.textContent = totalScore;

});
