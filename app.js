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
};

function getQuestionFromDB() {
    //generowanie losowej liczby do pytania
    let randomQuestionNumber = Math.floor(Math.random() * 100) + 1;

    // laczenie z baza danych
    let reference = database.ref('questions/' + randomQuestionNumber);
    reference.on('value', getQuestion);
}

// pobieranie pytania i odpowiedzi z bazy i wpisanie ich do odpowiednich pól
function getQuestion(data) {
    let questionFromDB = data.val();
    const { question, answer, correct } = questionFromDB;

    selectors.questionSelector.innerText = question;
    selectors.answerSelector.forEach((selector, id) => {
        selector.innerText = answer[id];
    });

    checkCorrectAnswer(correct);
};

//zerowanie wyniku
function setZeroScore({ scoreValueSelector }) {
    scoreValueSelector.innerText = '0';
}

//sprawdzenie poprawnej odpowiedzi
function checkCorrectAnswer(correct) {

    const { answerButtons, answerSelector } = selectors;

    answerButtons.forEach(selector => {
        selector.addEventListener('click', (e) => {

            selector.innerText == correct ? selector.classList.add('correct') : selector.classList.add('wrong')
        });


        //TODO: zrobic podświetlanie elementów dobrych i złych
    });

}

//funkcja inicjaloizująca,resetowanie pól tekstowych
(function initialFunction({ questionSelector, answerSelector }) {

    questionSelector.innerText = '';
    setZeroScore(selectors);
    answerSelector.forEach((answer => {
        answer.innerText = '';
    }));
    getQuestionFromDB();
})(selectors);

//event nacisnięcia przycisku start, przejście do planszy z grą
selectors.startButtonSelector.addEventListener('click', (e) => {
    const { questionContainerSelector, restartButtonSelector, scoreContainerSelector } = selectors;

    e.toElement.classList.toggle('hide');
    questionContainerSelector.classList.toggle('hide');
    restartButtonSelector.classList.toggle('hide');
    scoreContainerSelector.classList.toggle('hide');
});


selectors.restartButtonSelector.addEventListener('click', () => {
    getQuestionFromDB();
    setZeroScore(selectors);
});






