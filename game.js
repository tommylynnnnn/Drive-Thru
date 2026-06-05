// =======================
// DRIVE THRU SIM V2
// UPGRADES SYSTEM ADDED
// =======================

let money = 0;
let score = 0;
let customerCount = 1;
let day = 1;

let timeLimit = 20;
let timeLeft = timeLimit;

let incomeMultiplier = 1;

let currentOrder = {};
let timerInterval = null;

// DOM
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

const upgradeTimeBtn = document.getElementById("upgradeTime");
const upgradePayBtn = document.getElementById("upgradePay");

// ORDER
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

// TIMER
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = timeLimit;

    timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitOrder(true);
        }
    }, 1000);
}

// CHECK
function checkOrder() {
    let correct = 0;

    if (burgerSelect.value === currentOrder.burger) correct++;
    if (friesType.value === currentOrder.friesType) correct++;
    if (friesSize.value === currentOrder.friesSize) correct++;
    if (drinkType.value === currentOrder.drinkType) correct++;
    if (drinkSize.value === currentOrder.drinkSize) correct++;

    return correct;
}

// SUBMIT
function submitOrder(autoFail = false) {
    clearInterval(timerInterval);

    let correct = checkOrder();

    let earned = Math.floor((correct / 5) * 100 * incomeMultiplier);

    if (autoFail) {
        earned = 0;
        resultMessage.textContent = "Too slow! Customer left!";
    } else if (correct === 5) {
        resultMessage.textContent = "Perfect Order! +Bonus!";
    } else {
        resultMessage.textContent = `${correct}/5 correct`;
    }

    money += earned;

    updateUI();

    setTimeout(nextCustomer, 1000);
}

// NEXT CUSTOMER
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

// RESET
function resetInputs() {
    burgerSelect.value = "";
    friesType.value = "";
    friesSize.value = "";
    drinkType.value = "";
    drinkSize.value = "";
}

// END DAY
function endDay() {
    clearInterval(timerInterval);

    finalScore.textContent = money;
    popup.classList.remove("hidden");
}

// NEW DAY
nextDayBtn.addEventListener("click", () => {
    popup.classList.add("hidden");

    customerCount = 1;
    day++;

    updateUI();
    resetInputs();
    generateOrder();
    startTimer();
});

// UPGRADES
upgradeTimeBtn.addEventListener("click", () => {
    if (money >= 100) {
        money -= 100;
        timeLimit += 2;
        alert("Upgrade purchased: +2 seconds!");
        updateUI();
    }
});

upgradePayBtn.addEventListener("click", () => {
    if (money >= 150) {
        money -= 150;
        incomeMultiplier += 0.2;
        alert("Upgrade purchased: +20% earnings!");
        updateUI();
    }
});

// UI
function updateUI() {
    scoreEl.textContent = money;
    customerNumberEl.textContent = `${customerCount} / 5`;
}

// EVENTS
submitBtn.addEventListener("click", () => submitOrder(false));

// START GAME
generateOrder();
startTimer();
updateUI();
