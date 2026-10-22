
/* =========================
   EDU RISE AI
   INTERACTIVE FEATURES
========================= */

/* =========================
   STUDY PLANNER
========================= */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskSubject = document.getElementById("task-subject");
const taskList = document.getElementById("task-list");
const completedCount = document.getElementById("completed-count");
const taskTotal = document.getElementById("task-total");
const taskProgress = document.getElementById("task-progress");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("eduriseTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("eduriseTasks", JSON.stringify(tasks));
    } catch (error) {
        console.warn("Tasks could not be saved in this browser.");
    }
}

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent =
            "No study tasks yet. Add your first task above! 📚";

        taskList.appendChild(emptyMessage);
    }

    tasks.forEach(function (task) {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.name + " as completed"
        );

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const details = document.createElement("div");
        details.className = "task-details";

        const name = document.createElement("div");
        name.className = "task-name";
        name.textContent = task.name;

        const subject = document.createElement("span");
        subject.className = "task-subject-label";
        subject.textContent = task.subject;

        details.appendChild(name);
        details.appendChild(subject);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + task.name);

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (savedTask) {
                return savedTask.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        item.appendChild(checkbox);
        item.appendChild(details);
        item.appendChild(deleteButton);

        taskList.appendChild(item);
    });

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    taskTotal.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");

    taskProgress.textContent = completed + " completed";
    completedCount.textContent = completed;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (!name) {
        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        name: name,
        subject: taskSubject.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

renderTasks();


/* =========================
   VIDEO TUTORIAL FILTERS
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const videoCards = document.querySelectorAll(".video-card");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
            filterButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        videoCards.forEach(function (card) {
            const category = card.dataset.category;

            if (
                selectedCategory === "all" ||
                category === selectedCategory
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });

    button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false"
    );
});


/* =========================
   PRACTICE QUIZ
========================= */

const quizQuestions = [
    {
        question: "What is 5 × 6?",
        options: ["11", "30", "25", "35"],
        answer: 1,
        explanation: "5 multiplied by 6 equals 30."
    },
    {
        question: "Which language is commonly used to style web pages?",
        options: ["Python", "Java", "CSS", "SQL"],
        answer: 2,
        explanation: "CSS controls the appearance and layout of web pages."
    },
    {
        question: "What is the chemical formula of water?",
        options: ["CO2", "O2", "NaCl", "H2O"],
        answer: 3,
        explanation: "Water contains two hydrogen atoms and one oxygen atom."
    }
];

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const quizFeedback = document.getElementById("quiz-feedback");
const nextQuestionButton = document.getElementById("next-question");
const restartQuizButton = document.getElementById("restart-quiz");
const quizScoreDisplay = document.getElementById("quiz-score");

let currentQuestion = 0;
let score = 0;
let questionAnswered = false;

try {
    const savedScore = localStorage.getItem("eduriseQuizScore");

    if (savedScore !== null && Number.isFinite(Number(savedScore))) {
        quizScoreDisplay.textContent = savedScore + "%";
    }
} catch (error) {
    // The quiz still works if browser storage is unavailable.
}

function showQuestion() {
    questionAnswered = false;

    const question = quizQuestions[currentQuestion];

    questionNumber.textContent =
        "Question " + (currentQuestion + 1) +
        " of " + quizQuestions.length;

    questionText.textContent = question.question;
    answerOptions.innerHTML = "";
    quizFeedback.textContent = "";

    nextQuestionButton.hidden = true;
    restartQuizButton.hidden = true;

    question.options.forEach(function (option, index) {
        const button = document.createElement("button");

        button.className = "answer-option";
        button.textContent = option;

        button.addEventListener("click", function () {
            checkAnswer(index, button);
        });

        answerOptions.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    if (questionAnswered) {
        return;
    }

    questionAnswered = true;

    const question = quizQuestions[currentQuestion];
    const buttons = answerOptions.querySelectorAll(".answer-option");

    buttons.forEach(function (button, index) {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }
    });

    if (selectedIndex === question.answer) {
        score++;
        quizFeedback.textContent = "Correct! 🎉 " + question.explanation;
        quizFeedback.style.color = "#18794e";
    } else {
        selectedButton.classList.add("incorrect");
        quizFeedback.textContent = "Not quite. " + question.explanation;
        quizFeedback.style.color = "#c13d49";
    }

    if (currentQuestion < quizQuestions.length - 1) {
        nextQuestionButton.hidden = false;
    } else {
        const percentage = Math.round(
            (score / quizQuestions.length) * 100
        );

        quizScoreDisplay.textContent = percentage + "%";

        try {
            localStorage.setItem("eduriseQuizScore", String(percentage));
        } catch (error) {
            // Display the score even if it cannot be saved.
        }

        questionNumber.textContent = "Quiz completed!";
        quizFeedback.textContent +=
            " Your score: " + score + "/" + quizQuestions.length + ".";

        restartQuizButton.hidden = false;
    }
}

nextQuestionButton.addEventListener("click", function () {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
});

restartQuizButton.addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;
    showQuestion();
});

showQuestion();


/* =========================
   AI TUTOR DEMO
========================= */

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

function addChatMessage(message, type) {
    const bubble = document.createElement("div");

    bubble.className = "chat-message " + type;
    bubble.textContent = message;

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getTutorResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! 😊 What subject would you like help with today?";
    }

    if (
        text.includes("math") ||
        text.includes("algebra") ||
        text.includes("equation")
    ) {
        return "Mathematics tip 📘: Start by identifying what you know and what you need to find. For equations, perform the same operation on both sides. Ask me about a specific topic to explore it further.";
    }

    if (
        text.includes("physics") ||
        text.includes("force") ||
        text.includes("motion")
    ) {
        return "Physics tip ⚛️: Understand the concept first, then identify the given values and choose the correct formula. For example, speed = distance ÷ time.";
    }

    if (
        text.includes("chemistry") ||
        text.includes("atom") ||
        text.includes("chemical")
    ) {
        return "Chemistry tip 🧪: Learn the symbols of common elements first. Remember that atoms are the basic units of elements, and chemical equations represent chemical reactions.";
    }

    if (
        text.includes("python") ||
        text.includes("programming") ||
        text.includes("coding") ||
        text.includes("javascript")
    ) {
        return "Programming tip 💻: Break a problem into small steps. Learn variables, conditions, loops, and functions, then practise writing small programs.";
    }

    if (text.includes("study") || text.includes("exam")) {
        return "Study tip 📚: Break your syllabus into small tasks, practise questions, take short breaks, and revise what you learned at the end of each session.";
    }

    if (text.includes("thank")) {
        return "You're welcome! 💜 Keep practising, and don't be afraid to ask questions.";
    }

    return "Let's work through that step by step! Try mentioning the subject and topic, such as Python loops, algebra, motion, or atoms. This demo uses predefined responses and does not connect to a live AI model.";
}

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = chatInput.value.trim();

    if (!message) {
        return;
    }

    addChatMessage(message, "user-message");
    chatInput.value = "";

    const response = getTutorResponse(message);
    addChatMessage(response, "bot-message");

    chatInput.focus();
});


/* =========================
   FOCUS TIMER
========================= */

const timerDisplay = document.getElementById("timer-display");
const startTimerButton = document.getElementById("start-timer");
const pauseTimerButton = document.getElementById("pause-timer");
const resetTimerButton = document.getElementById("reset-timer");
const timerMessage = document.getElementById("timer-message");

const focusDuration = 25 * 60;
let timeRemaining = focusDuration;
let timerInterval = null;

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

startTimerButton.addEventListener("click", function () {
    if (timerInterval !== null) {
        return;
    }

    if (timeRemaining <= 0) {
        timeRemaining = focusDuration;
        updateTimerDisplay();
    }

    timerMessage.textContent = "Focus time! You've got this. 💪";

    timerInterval = setInterval(function () {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        }

        if (timeRemaining <= 0) {
            stopTimer();
            timerMessage.textContent =
                "Great work! 🎉 Your focus session is complete. Take a break.";
        }
    }, 1000);
});

pauseTimerButton.addEventListener("click", function () {
    stopTimer();
    timerMessage.textContent = "Timer paused. Resume when you're ready.";
});

resetTimerButton.addEventListener("click", function () {
    stopTimer();
    timeRemaining = focusDuration;
    updateTimerDisplay();
    timerMessage.textContent = "Timer reset. Ready for another session!";
});

updateTimerDisplay();


/* =========================
   SIDEBAR NAVIGATION
========================= */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.forEach(function (navLink) {
            navLink.classList.remove("active");
        });

        link.classList.add("active");
    });
});
