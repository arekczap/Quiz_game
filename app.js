import { database } from './firebase.js';

const anwsers = document.querySelectorAll('.anwser');
let randomQuestionNumber = Math.floor(Math.random() * 100) + 1;


//laczenie z baza danych
var ref = database.ref('questions' + '/' + randomQuestionNumber);
ref.on('value', received);

function received (data) {
    let questions = data.val();
    console.log(questions)
};






anwsers.forEach(anwser => {
    anwser.addEventListener('click', (e) => {
        e.toElement.classList.toggle('correct');
    });
});








