let currentQuestion = 0;
let score = 0;
let questions = [];
let answerSelected = false;
let autoAdvance = false;

// Load and randomize questions
fetch('../quiz_data.json')
    .then(response => response.json())
    .then(data => {
        questions = data.filter(q => q.options && q.options.length > 0);
        shuffleArray(questions);
        updateProgress();
        showQuestion();
    });

// Toggle auto-advance
document.getElementById('autoAdvance').addEventListener('change', function(e) {
    autoAdvance = e.target.checked;
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    document.getElementById('progress').textContent = 
        `Question ${currentQuestion + 1}/${questions.length}`;
}

function showQuestion() {
    answerSelected = false;
    updateProgress();
    const question = questions[currentQuestion];
    document.getElementById('question').innerHTML = 
        `${question.question_counter}. ${question.question}`;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = option;
        button.onclick = () => handleAnswerSelection(index);
        optionsDiv.appendChild(button);
    });

    document.getElementById('next-btn').style.display = 'none';
}

function handleAnswerSelection(selectedIndex) {
    if (answerSelected) return;
    answerSelected = true;

    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    const correctIndex = question.correct_answer.charCodeAt(0) - 'a'.charCodeAt(0);

    options.forEach(option => option.disabled = true);

    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
    }

    if (autoAdvance) {
        setTimeout(nextQuestion, 500);
    } else {
        setTimeout(() => {
            document.getElementById('next-btn').style.display = 'block';
        }, 500);
    }
}

document.getElementById('next-btn').addEventListener('click', nextQuestion);

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p>Final Score: ${score}/${questions.length}</p>
        <p>Accuracy: ${Math.round((score/questions.length)*100)}%</p>
        <button onclick="location.reload()">Play Again</button>
    `;
}
