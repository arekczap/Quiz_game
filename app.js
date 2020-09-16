import { database } from './firebase.js';

const selectors = {
    questionContainerSelector: document.querySelector('.question-container'),
    questionSelector: document.querySelector('.question'),
    answerSelector: document.querySelectorAll('.anwser'),
    answerButtons: document.querySelectorAll('.answer-buttons .btn'),
    startButtonSelector: document.querySelector('.controls__start-button'),
    scoreContainerSelector: document.querySelector('.score'),
    scoreValueSelector: document.querySelector('.score__value'),
    scoreUpdateSelector: document.querySelector('.score__update')
};

let totalScore;
let questionFromDb;
let correctAswerFromDb = '';


function getQuestionFromDB() {
    return new Promise((resolve, reject) => {
        let random = Math.floor(Math.random() * 100) + 1;
        // laczenie z baza danych
        let someData = database.ref('questions/' + random).once('value').then((snapshot) => {
            return snapshot.val();
        });
        resolve(someData);

    }).then((response) => {
        questionFromDb = response;
        correctAswerFromDb = questionFromDb.correct;
    });
}

function attachQuestionToSelectors() {
    return new Promise((resolve) => {

        const { question, answer } = questionFromDb;
        selectors.questionSelector.innerText = question;
        selectors.answerSelector.forEach((selector, id) => {
            selector.innerText = answer[id];
        })
        resolve()
    })
}

function timeoutCheckAnswer() {

    event.toElement.classList.add('checked');

    return new Promise((resolve) => {
        const { answerButtons, answerSelector, scoreUpdateSelector } = selectors;

        console.log((correctAswerFromDb));

        setTimeout(() => {
            answerSelector.forEach(sel => {
                if (sel.textContent == correctAswerFromDb) {
                    sel.classList.add('correct');

                    scoreUpdateSelector.classList.add('update');
                }
                else {
                    sel.classList.add('wrong');
                    scoreUpdateSelector.classList.add('update');
                }
                sel.classList.remove('checked');
            });
            resolve()
        }, 3000);
    })
}


function clearAddedClassNames() {
    return new Promise((resolve) => {
        const { answerSelector } = selectors;


        setTimeout(() => {
            answerSelector.forEach(sel => {
                sel.classList.remove('correct');
                sel.classList.remove('wrong');
            })
            resolve();
        }, 3000);
    })
}

function initialFunction() {
    return new Promise((resolve) => {
        const { questionSelector, answerSelector } = selectors;
        questionSelector.innerText = '';
        answerSelector.forEach((answer => {
            answer.innerText = '';
        }));
        totalScore = 0;
        resolve();
    })

};

//zmiana wyniku
function updateScoreNumber(numberToChangeScore) {
    const { scoreValueSelector } = selectors;
    totalScore += numberToChangeScore;
    scoreValueSelector.textContent = totalScore;
}





function nextQuestion() {
    return new Promise((resolve) => {
        getQuestionFromDB();
        resolve();
    })
}

async function getQuestion() {
    await getQuestionFromDB();
    await initialFunction();
    await attachQuestionToSelectors();
}

async function checkCorrectAnswer() {
    await timeoutCheckAnswer();
    await clearAddedClassNames().then(() => getQuestion());

}
//sprawdzenie poprawnej odpowiedzi
selectors.answerButtons.forEach(selector => {
    selector.addEventListener('click', checkCorrectAnswer)
});



    // setTimeout(() => {
    //     e.toElement.textContent == correctAnswerFromDB ? updateScoreNumber(10) : updateScoreNumber(-7);
    //     scoreUpdateSelector.classList.remove('update');

    // }, 4000);





selectors.startButtonSelector.addEventListener('click', (e) => {

    e.toElement.disabled = true;
    getQuestion();

    setTimeout(() => {
        const { questionContainerSelector, scoreContainerSelector } = selectors;

        e.toElement.classList.toggle('hide');
        questionContainerSelector.classList.toggle('hide');
        scoreContainerSelector.classList.toggle('hide');

    }, 500);
});


