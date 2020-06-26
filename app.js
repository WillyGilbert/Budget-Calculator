/* 
 * Made by: Willy Gilbert
 *    Date: April 22, 2020
 * Collage: MITT
 * Program: Software Developer
 * Subject: JavaScript OOP
 * Project: Final Project
 */

/*
 * This class contains the names of the months of the year and when it is instantiated 
 * generates the ordinal numbers from 1 to 31 using the method setDaysOfMoths().
 */
class InternalDate {
  constructor() {
    this.date = "";
    this.months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }
    this.days = this.setDaysOfMoths();
  }

  setDaysOfMoths() {
    let days = {};
    let day = 0;
    for (let day = 1; day <= 31; day++) {
      if (day >= 1 && day <= 3 || day >= 21 && day <= 23 || day > 30) {
        if (day === 1 || day === 21 || day === 31) days[day] = day + "st";
        if (day === 2 || day === 22) days[day] = day + "nd";
        if (day === 3 || day === 23) days[day] = day + "rd";
      } else {
        days[day] = day + "th";
      }
    }
    return days;
  }

  /*
   * This method returns the date in the format "Jun. 4th, 2020".
   */
  getDateOfTransaction() {
    this.date = new Date();
    return `${this.months[this.date.getMonth()].substring(0, 3)}. ${this.days[this.date.getDate()]}, ${this.date.getFullYear()}`;
  }

  /*
   * This method returns the date in the format "June 2020".
   */
  getcurrentDate() {
    this.date = new Date();
    return `${this.months[this.date.getMonth()]} ${this.date.getFullYear()}`
  }

}

/*
 * This class manages the list of transactions (income and expenses).
 */
class TransactionList {
  constructor() {
    this.id = 0;
    this.incomeList = [];
    this.expenseList = [];
    this.expensesPercentage = 0;
    this.currentDate = new InternalDate();
    this.run();
  }

  /*
   * This method initializes / displays the title, date and resets the total income 
   * and total expenditure field when the program starts.
   */
  run() {
    addDescription.focus();
    this.redrawBudgetTitle();
    this.redrawBudgetTotalCard("Income");
    this.redrawBudgetTotalCard("Expenses");
  }

  /*
   * This method adds a new transaction, if the value is greater than zero add an income 
   * and if it is less than zero add an expense, then update the program section, to add the new record.
   */
  addNewTransaction(description, value) {
    if (value > 0) {
      this.incomeList.push(new Transaction("I" + this.id++, description, value, this.currentDate.getDateOfTransaction()));
    }
    if (value < 0) {
      this.expenseList.push(new Transaction("E" + this.id++, description, Math.abs(value), this.currentDate.getDateOfTransaction()));
    }
    this.redrawPageSection(this.incomeList, incomeListHTML, '+');
    this.redrawPageSection(this.expenseList, expensesListHTML, '-');
  }

  /*
   * This method deletes a transaction by id, validates if the id has an "I" indicator that stands for (Income) 
   * and looks for it in the income list, otherwise it looks for it in the expense list. After finding the id, 
   * remove the item from the corresponding list.
   */
  removeTransaction(id) {
    if (id.includes("I")) {
      let index = this.incomeList.findIndex(item => item.id == id);
      this.incomeList.splice(index, 1);
    } else {
      let index = this.expenseList.findIndex(item => item.id == id);
      this.expenseList.splice(index, 1);
    }
    this.redrawPageSection(this.incomeList, incomeListHTML, '+');
    this.redrawPageSection(this.expenseList, expensesListHTML, '-');
  }

  /*
   * Calculate total Income
   */
  calculateIncome() {
    let totalIncome = 0;
    this.incomeList.forEach(function(item) {
      totalIncome += item.amount;
    });
    return (totalIncome === 'undefined') ? 0 : totalIncome;
  }

  /*
   * Calculate total Expenses
   */
  calculateExpenses() {
    let totalExpenses = 0;
    this.expenseList.forEach(function(item) {
      totalExpenses += item.amount;
    });
    return (totalExpenses === 'undefined') ? 0 : totalExpenses;
  }

  /*
   * Calculate the budget based on income and expenses, also stores the percentage of expenses in a variable.
   */
  calculateBudget() {
    let calculatedBudget = this.calculateIncome() - this.calculateExpenses();
    let BudgetString = `  $` + calculatedBudget.toFixed(2);

    if (calculatedBudget > 0) {
      BudgetString = `+ $` + calculatedBudget.toFixed(2);
    } else if (calculatedBudget < 0) {
      BudgetString = `- $` + Math.abs(calculatedBudget.toFixed(2));
    }

    if (this.calculateIncome() === 0) {
      this.expensesPercentage = "100";
    } else {
      this.expensesPercentage = (this.calculateExpenses() / this.calculateIncome() * 100).toFixed();
    }

    return BudgetString;
  }

  /*
   * Display the current system date in HTML
   */
  redrawBudgetTitle() {
    budgetTitleMonth.innerHTML = "";
    budgetTitleMonth.insertAdjacentHTML('afterbegin', `${this.currentDate.getcurrentDate()}`);
  }

  /*
   * Show in HTML the total income and expenses
   */
  redrawBudgetTotalCard(TransactionType) {
    let budgetCard = document.querySelector(`.budget__${TransactionType}`);
    let budget = `  $0.00`;

    if (TransactionType === 'Income') {
      if (this.calculateIncome() !== 0) budget = `+ $` + this.calculateIncome().toFixed(2);
    } else {
      if (this.calculateExpenses() !== 0) budget = `- $` + this.calculateExpenses().toFixed(2)
    }

    budgetCard.innerHTML = "";
    budgetCard.insertAdjacentHTML('afterbegin', `
      <div class="budget__${TransactionType.toLowerCase()}--text">${TransactionType}</div>
      <div class="right">
        <div class="budget__${TransactionType.toLowerCase()}--value">${budget}</div>
        <div class="budget__${TransactionType.toLowerCase()}--percentage">
          ${(TransactionType === 'Expenses') ? (this.expensesPercentage + "%"): "&nbsp;"}
        </div>
      </div>
    `);
  }

  /*
   * Draw the income and expenses lists on the screen
   */
  redrawPageSection(listOfElements, cardToDisplay, sign) {
    this.redrawBudgetTitle();
    budgetValue.innerHTML = "";
    budgetValue.insertAdjacentHTML('afterbegin', `${this.calculateBudget()}`);

    this.redrawBudgetTotalCard("Income");
    this.redrawBudgetTotalCard("Expenses");
    let calculatedAmount = this.calculateIncome();
    if (this.calculateIncome() === 0) {
      calculatedAmount = this.calculateExpenses();
    }
    let classItemPercentage = ``;

    let list = "";
    cardToDisplay.innerHTML = list;
    listOfElements.forEach(function(item) {
      classItemPercentage = `<div class="item__percentage">${((parseFloat(item.amount) / calculatedAmount)*100).toFixed()}%</div>`;
      list += `
      <div class="item" data-transaction-id="${item.id}">
      <div class="item__description">${item.description}</div>
      <div class="right">
        <div class="item__value">${sign} $${parseFloat(item.amount).toFixed(2)}</div>
        ${(sign === '-') ? classItemPercentage : ""}
        <div class="item__delete">
          <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
        </div>
      </div>
      <div class="item__date">${item.date}</div>
    </div>
      `;
    });
    cardToDisplay.insertAdjacentHTML('afterbegin', list);
  }
}

/*
 * This class represents a transaction
 */
class Transaction {
  constructor(id, description, amount, date) {
    this.id = id;
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
}

/*
 * This block takes from the DOM the elements that are used to obtain or present information
 */
const incomeListHTML = document.querySelector('.income__list');
const expensesListHTML = document.querySelector('.expenses__list');
const container = document.querySelector('.container');
const addDescription = document.querySelector('.add__description');
const addValue = document.querySelector('.add__value');
const addBtn = document.querySelector('.add__btn');
const budgetTitleMonth = document.querySelector(`.budget__title--month`);
const budgetValue = document.querySelector(`.budget__value`);
const transaction = new TransactionList();

/*
 * Capture the event that add the record from the income or expense list.
 */
addBtn.addEventListener('click', function(e) {
  if (addDescription.value.trim() !== "" && addValue.value !== "" && addValue.value !== 0) {
    transaction.addNewTransaction(addDescription.value, parseFloat(addValue.value));
    addDescription.value = "";
    addValue.value = "";
    addDescription.focus();
  }
});

/*
 * Capture the event that removes the record from the income or expense list.
 */
container.addEventListener('click', function(event) {
  if (event.target.nodeName === "I") {
    let itemId = event.target.closest(".item").dataset.transactionId;
    transaction.removeTransaction(itemId);
    addDescription.focus();
  }
});