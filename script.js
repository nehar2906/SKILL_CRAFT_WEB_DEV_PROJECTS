// -------------------- Questions (10 General Knowledge) --------------------
const questions = [
  {
    q: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars","Saturn"],
    answer: 2
  },
  {
    q: "Who wrote the play 'Romeo and Juliet'?",
    options: ["William Wordsworth", "William Shakespeare", "Charles Dickens", "Jane Austen"],
    answer: 1
  },
  {
    q: "What is the capital city of Japan?",
    options: ["Seoul", "Osaka", "Kyoto", "Tokyo"],
    answer: 3
  },
  {
    q: "Which element has chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Iron"],
    answer: 1
  },
  {
    q: "In computing, what does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyperlink Text Transfer Protocol", "HyperText Transmission Program"],
    answer: 0
  },
  {
    q: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: 2
  },
  {
    q: "Which country is the largest by land area?",
    options: ["USA", "Canada", "China", "Russia"],
    answer: 3
  },
  {
    q: "Which natural resource is used to make glass?",
    options: ["Sand", "Coal", "Copper", "Limestone"],
    answer: 0
  },
  {
    q: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    answer: 2
  },
  {
    q: "Which organ pumps blood throughout the human body?",
    options: ["Lungs", "Liver", "Heart", "Kidneys"],
    answer: 2
  }
];

// -------------------- DOM Elements --------------------
const questionTitle = document.getElementById('questionTitle');
const optionsList = document.getElementById('optionsList');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const scoreNumber = document.getElementById('scoreNumber');
const scorePercent = document.getElementById('scorePercent');
const feedbackText = document.getElementById('feedbackText');
const restartBtn = document.getElementById('restartBtn');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

let current = 0;
let score = 0;
let selectedIndex = null;
let answered = false;

// initialize
function startQuiz(){
  current = 0;
  score = 0;
  selectedIndex = null;
  answered = false;
  resultCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  renderQuestion();
  updateProgress();
}
startQuiz();

// render a question
function renderQuestion(){
  const item = questions[current];
  questionTitle.textContent = item.q;
  optionsList.innerHTML = '';
  item.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.addEventListener('click', onSelect);
    optionsList.appendChild(btn);
    updateBackground(current);
  });
  nextBtn.disabled = true;
  answered = false;
  selectedIndex = null;
  // update progress text
  progressText.textContent = `Question ${current+1} / ${questions.length}`;
  updateProgress();
}

// when option clicked
function onSelect(e){
  if(answered) return;
  selectedIndex = Number(e.currentTarget.dataset.index);
  // visually mark selected
  Array.from(optionsList.children).forEach(b => b.classList.remove('selected'));
  e.currentTarget.classList.add('selected');
  nextBtn.disabled = false;
}

// reveal answer & mark
function showAnswerAndMove(){
  answered = true;
  // disable selection
  Array.from(optionsList.children).forEach(b => b.removeEventListener('click', onSelect));
  const correctIdx = questions[current].answer;

  // color options
  Array.from(optionsList.children).forEach((b, idx) => {
    const i = Number(b.dataset.index);
    if(i === correctIdx) b.classList.add('correct');
    if(selectedIndex !== null && i === selectedIndex && selectedIndex !== correctIdx){
      b.classList.add('incorrect');
    }
    b.classList.remove('selected');
  });

  // update score & feedback
  if(selectedIndex === correctIdx){
    score++;
    feedbackText.textContent = "Great! That's correct.";
  } else {
    feedbackText.textContent = `Oops — the correct answer was "${questions[current].options[correctIdx]}".`;
  }

  // if last question, change next button label
  if(current === questions.length - 1){
    nextBtn.textContent = 'Finish';
  } else {
    nextBtn.textContent = 'Next';
  }
}

// next button handler
nextBtn.addEventListener('click', () => {
  if(!answered){
    // first press will show answer
    showAnswerAndMove();
    // allow user to read for 900ms then either move automatically or wait for click
    setTimeout(() => {
      if(current < questions.length - 1){
        current++;
        renderQuestion();
      } else {
        showResults();
      }
    }, 900);
  } else {
    // if already showed answer (rare), just move
    if(current < questions.length - 1){
      current++;
      renderQuestion();
    } else {
      showResults();
    }
  }
});

// quit button
quitBtn.addEventListener('click', () => {
  if(confirm('Quit quiz and see results?')) showResults();
});

// show results
function showResults(){
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  scoreNumber.textContent = `${score} / ${questions.length}`;
  const pct = Math.round((score / questions.length) * 100);
  scorePercent.textContent = `${pct}%`;
  if(pct === 100) feedbackText.textContent = "Perfect! You're a genius ✨";
  else if(pct >= 70) feedbackText.textContent = "Great job! Well done 👍";
  else if(pct >= 40) feedbackText.textContent = "Nice attempt — keep learning!";
  else feedbackText.textContent = "Don't worry — practice makes perfect!";
  // set live link (optional)
  document.getElementById('viewLive').href = location.href.replace(/index\.html.*$/,'') + 'SCT_WD_03/';
}

// restart
restartBtn.addEventListener('click', () => {
  startQuiz();
});

// progress bar update
function updateProgress(){
  const pct = Math.round(((current) / questions.length) * 100);
  progressBar.style.width = `${pct}%`;
}
function updateBackground(qIndex) {
  const body = document.body;

  // remove old theme classes
  body.className = "";

  // apply new gradient class
  body.classList.add(`question-bg-${qIndex + 1}`);
}
