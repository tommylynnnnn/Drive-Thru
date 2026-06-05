// =======================
// DRIVE THRU SIMULATOR
// VERSION 1 CORE LOGIC
// =======================

// GAME STATE
let score = 0;
let customerCount = 1;
let day = 1;
let timeLeft = 20;

let currentOrder = {};
let timerInterval = null;

// =======================
// DOM ELEMENTS
// =======================
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const customerNumberEl = document.getElementById("customerNumber");

const burgerSelect = document.getElementById("burgerSelect");
const friesType = document.getElementById("friesType");
const friesSize = document.getElementById("friesSize");
const drinkType = document.getElementById("drinkType");
const drinkSize = document.getElementById("drinkSize");

const submitBtn = document.getElementById("submitOrder");

const customerSpeech = document.getElementById("customerSpeech");
const resultMessage = document.getElementById("resultMessage");

const popup = document.getElementById("dayPopup");
const finalScore = document.getElementById("finalScore");
const nextDayBtn = document.getElementById("nextDayBtn");

// =======================
// ORDER GENERATION
// =======================
function generateOrder() {
    const burgers = ["Hamburger", "Cheeseburger", "Double Burger", "Bacon Burger", "Chicken Burger"];
    const fries = ["Regular", "Curly", "Crinkle", "Waffle"];
    const drinks = ["Cola", "Lemonade", "Orange Soda", "Root Beer", "Water"];
    const sizes = ["Small", "Medium", "Large"];

    currentOrder = {
        burger: burgers[Math.floor(Math.random() * burgers.length)],
        friesType: fries[Math.floor(Math.random() * fries.length)],
        friesSize: sizes[Math.floor(Math.random() * sizes.length)],
        drinkType: drinks[Math.floor(Math.random() * drinks.length)],
        drinkSize: sizes[Math.floor(Math.random() * sizes.length)]
    };

    customerSpeech.textContent =
        `I'd like a ${currentOrder.burger}, ` +
        `${currentOrder.friesSize} ${currentOrder.friesType} Fries, ` +
        `and a ${currentOrder.drinkSize} ${currentOrder.drinkType}.`;
}

// =======================
// TIMER
// =======================
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitOrder(true); // auto fail
        }
    }, 1000);
}

// =======================
// CHECK ORDER
// =======================
function checkOrder() {
    let correct = 0;
    let total = 5;

    if (burgerSelect.value === currentOrder.burger) correct++;
    if (friesType.value === currentOrder.friesType) correct++;
    if (friesSize.value === currentOrder.friesSize) correct++;
    if (drinkType.value === currentOrder.drinkType) correct++;
    if (drinkSize.value === currentOrder.drinkSize) correct++;

    return { correct, total };
}

// =======================
// SUBMIT ORDER
// =======================
function submitOrder(autoFail = false) {
    clearInterval(timerInterval);

    const result = checkOrder();

    let earned = 0;

    if (!autoFail) {
        earned = Math.floor((result.correct / result.total) * 100);
    }

    score += earned;

    if (result.correct === 5 && !autoFail) {
        resultMessage.textContent = "Perfect Order! +100";
    } else if (autoFail) {
        resultMessage.textContent = "Too slow! Customer left!";
    } else {
        resultMessage.textContent = `Order ${result.correct}/5 correct. +${earned}`;
    }

    updateUI();

    setTimeout(nextCustomer, 1200);
}

// =======================
// NEXT CUSTOMER
// =======================
function nextCustomer() {
    customerCount++;

    if (customerCount > 5) {
        endDay();
        return;
    }

    resetInputs();
    generateOrder();
    startTimer();
    updateUI();
}

// =======================
// RESET INPUTS
// =======================
function resetInputs() {
    burgerSelect.value = "";
    friesType.value = "";
    friesSize.value = "";
    drinkType.value = "";
    drinkSize.value = "";
}

// =======================
// END DAY
// =======================
function endDay() {
    clearInterval(timerInterval);

    finalScore.textContent = score;
    popup.classList.remove("hidden");
}

// =======================
// NEW DAY
// =======================
nextDayBtn.addEventListener("click", () => {
    popup.classList.add("hidden");

    customerCount = 1;
    day++;

    score = 0;

    updateUI();
    resetInputs();
    generateOrder();
    startTimer();
});

// =======================
// UI UPDATE
// =======================
function updateUI() {
    scoreEl.textContent = score;
    customerNumberEl.textContent = `${customerCount} / 5`;
}

// =======================
// EVENTS
// =======================
submitBtn.addEventListener("click", () => {
    submitOrder(false);
});

// =======================
// START GAME
// =======================
generateOrder();
startTimer();
updateUI();
