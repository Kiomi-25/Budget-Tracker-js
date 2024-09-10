const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// check if localstorage is empty
let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

// update Statistics
function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  console.log(updatedIncome);
  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  console.log(updatedExpense);

  updatedBalance = updatedIncome - updatedExpense;

  balance.textContent = updatedBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
}

updateStatistics();

function generateTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
           <p>
           <span>${source}</span>
           <span id="time">${time}</span>
           </p>
           $<span>${Math.abs(amount)}</span>
           <i class="bi bi-trash3 delete"></i>
           </li>`;
}

// add transaction in transaction history (income || expense)
function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time);
  }
}

// add new transaction
function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()}  ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);

  // store information in local storage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  addTransactionDOM(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.source.value.trim() === "" || form.amount.value === "") {
    return alert("Please ass proper values!");
  }
  addTransaction(form.source.value.trim(), Number(form.amount.value));
  updateStatistics();
  form.reset();
});

// Transaction History print transc from localstorage
function getTransaction() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}
getTransaction();

// delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    //console.log(transaction.id, id) id number
    return transaction.id !== id;
  });
  // update localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    //convert id into number
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

function init() {
  updateStatistics();
  getTransaction();
}

init();
