import { database } from './firebase.js';

const selectors = {
    questionContainerSelector: document.querySelector('.question-container'),
    questionSelector: document.querySelector('.question'),
    answerSelector1: document.querySelector('.anwser1'),
    answerSelector2: document.querySelector('.anwser2'),
    answerSelector3: document.querySelector('.anwser3'),
    answerSelector4: document.querySelector('.anwser4'),
    startButtonSelector: document.querySelector('.controls__start-button'),
    restartButtonSelector: document.querySelector('.controls__next-button'),
    scoreContainerSelector: document.querySelector('.score'),
    scoreValueSelector: document.querySelector('.score__value'),
};


(function initialFunction({ questionSelector, answerSelector1, answerSelector2, answerSelector3, answerSelector4, scoreValueSelector }) {

    questionSelector.innerText = '';
    answerSelector1.innerText = '';
    answerSelector2.innerText = '';
    answerSelector3.innerText = '';
    answerSelector4.innerText = '';
    scoreValueSelector.innerText = '0';

})(selectors);

selectors.startButtonSelector.addEventListener('click', (e) => {
    const { questionContainerSelector, restartButtonSelector, scoreContainerSelector} = selectors;

    e.toElement.classList.toggle('hide');
    questionContainerSelector.classList.toggle('hide');
    restartButtonSelector.classList.toggle('hide');
    scoreContainerSelector.classList.toggle('hide');

});


    let randomQuestionNumber = Math.floor(Math.random() * 100) + 1;


    // laczenie z baza danych
    var reference = database.ref('questions/' + randomQuestionNumber);
    reference.on('value', getQuestionFromDB);



    function getQuestionFromDB(data) {
        const questionFromDB = data.val();
        const { question, answer, correct } = questionFromDB;



        selectors.questionSelector.innerText = question;



    };


// console.log(getQuestionFromDataBase());















// anwsers.forEach(anwser => {
//     anwser.addEventListener('click', (e) => {
//         e.toElement.classList.toggle('correct');
//     });
// });

