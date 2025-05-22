let currentQuestion = 0;
let score = 0;
let questions = [];
let answerSelected = false;
let autoAdvance = false;
let quizDataFile = "";

// Listen for auto-advance toggle
document.getElementById('autoAdvance').addEventListener('change', function(e) {
    autoAdvance = e.target.checked;
});

// Function to load the chosen course's JSON file and start the quiz
function loadCourse(file) {
    quizDataFile = file;
    // Hide course selection and show quiz section
    document.getElementById('course-selection').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';

    // Reset quiz variables
    currentQuestion = 0;
    score = 0;
    questions = [];
    answerSelected = false;
    document.getElementById('score').textContent = score;

    // Load and randomize questions from the selected file
    fetch(quizDataFile)
        .then(response => response.json())
        .then(data => {
            // Filter out any questions that don’t have options
            questions = data.filter(q => q.options && q.options.length > 0);
            shuffleArray(questions);
            updateProgress();
            showQuestion();
        });
}

// Shuffle questions using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Update progress text
function updateProgress() {
    document.getElementById('progress').textContent = 
        `Question ${currentQuestion + 1}/${questions.length}`;
}

// Display current question and options
function showQuestion() {
    answerSelected = false;
    updateProgress();
    const question = questions[currentQuestion];
    document.getElementById('question').innerHTML = 
        `${question.question_counter}. ${question.question.replace(/\n/g, '<br>')}`;
    
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

// Handle answer selection and highlight correct/incorrect options
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

// Next question or show results if finished
document.getElementById('next-btn').addEventListener('click', nextQuestion);
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Display final results and quiz summary
function showResults() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = 
        `<h2 class="results-title">Game Over!</h2>
         <p class="results-score">Final Score: ${score}/${questions.length}</p>
         <p class="results-accuracy">Accuracy: ${Math.round((score/questions.length)*100)}%</p>
         <button class="results-btn" onclick="location.reload()">Play Again</button>`;
}

// Back to Course Selection button handler
document.getElementById('back-to-selection').addEventListener('click', function() {
    // Option 1: Simply reload the page
    // location.reload();

    // Option 2: Reset quiz state and show course selection again
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('course-selection').style.display = 'block';
});
