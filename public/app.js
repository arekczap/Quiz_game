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

let totalScore = 0;
let questionFromDb;
let correctAswerFromDb = '';
let checkedAnswer = '';


function getQuestionFromDB() {
    return new Promise((resolve, reject) => {
        let random = Math.floor(Math.random() * 99) + 1;
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

function checkAnswer() {

    event.toElement.parentNode.classList.add('checked');
    checkedAnswer = event.toElement.textContent;

    return new Promise((resolve) => {
        const { answerSelector, answerButtons } = selectors;

        setTimeout(() => {
            answerButtons.forEach(sel => {
                sel.textContent == correctAswerFromDb ? sel.classList.add('correct') : sel.classList.add('wrong');

                sel.classList.remove('checked');
            });
            updateScore();
            resolve()
        }, 3000);
    })
}


function clearAddedClassNames() {
    return new Promise((resolve) => {
        const { answerSelector, scoreUpdateSelector, answerButtons } = selectors;


        setTimeout(() => {
            answerButtons.forEach(sel => {
                sel.classList.remove('correct');
                sel.classList.remove('wrong');
                scoreUpdateSelector.classList.remove('updatePlus');
                scoreUpdateSelector.classList.remove('updateMinus');
            })
            scoreUpdateSelector.classList.remove('update');
            blockClickAnwsersButtons(false);
            resolve();
        }, 3000);
    })
}

function initialFunction() {
    return new Promise((resolve) => {
        const { questionSelector, answerSelector, scoreUpdateSelector } = selectors;
        questionSelector.innerText = '';
        answerSelector.forEach((answer => {
            answer.innerText = '';
        }));
        scoreUpdateSelector.textContent = '0';

        resolve();
    })

};


function updateScoreNumberHtml(score) {
    const { scoreValueSelector } = selectors;
    totalScore += score;
    scoreValueSelector.textContent = totalScore;
}




function blockClickAnwsersButtons(state) {
    const { answerSelector } = selectors;
    answerSelector.forEach(sel => {
        if (state) {
            sel.parentNode.disabled = true;
        } else {
            sel.parentNode.disabled = false;
        }
    });
}

function updateScore() {

    let plusScore = 10;
    let minusScore = -7;

    if (checkedAnswer == correctAswerFromDb) {
        updateScoreNumberHtml(plusScore);
    } else {
        updateScoreNumberHtml(minusScore);
    }
}




async function getQuestion() {
    await getQuestionFromDB();
    await initialFunction();
    await attachQuestionToSelectors();
}

async function checkCorrectAnswer() {

    blockClickAnwsersButtons(true);
    await checkAnswer();
    await clearAddedClassNames().then(() => getQuestion());

}

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

selectors.answerButtons.forEach(selector => {

    selector.addEventListener('click', checkCorrectAnswer)
});




