'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// -----------------------------
// DATA: Bank Accounts
// -----------------------------
// Different accounts with movements, PIN, interest rate, and account type
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // % interest rate for deposits
  pin: 1111, // numeric PIN
  type: 'premium', // account type
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

// Array containing all accounts
const accounts = [account1, account2, account3, account4];

// -----------------------------
// ELEMENTS: Selecting DOM elements
// -----------------------------
const labelWelcome = document.querySelector('.welcome'); // Welcome message
const labelDate = document.querySelector('.date'); // Date element
const labelBalance = document.querySelector('.balance__value'); // Current balance
const labelSumIn = document.querySelector('.summary__value--in'); // Total deposits
const labelSumOut = document.querySelector('.summary__value--out'); // Total withdrawals
const labelSumInterest = document.querySelector('.summary__value--interest'); // Interest
const labelTimer = document.querySelector('.timer'); // Logout timer

const containerApp = document.querySelector('.app'); // Main app container
const containerMovements = document.querySelector('.movements'); // Movements container

// Buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Input fields
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////
// FUNCTION: Display Movements
/////////////////////////
// Loops through an account's movements and displays them in the DOM
// Optional sorting of movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // Clear previous movements

  // Copy and sort movements if requested
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    // Determine type: deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // HTML template for movement
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    // Add movement to DOM
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////
// FUNCTION: Calculate and Display Balance
/////////////////////////
const calcDisplayBalance = function (acc) {
  // Sum all movements using reduce
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // Display balance in UI
  labelBalance.textContent = `${acc.balance}€`;
};

/////////////////////////
// FUNCTION: Calculate Summary
/////////////////////////
// Displays total deposits, withdrawals, and interest
const calcDisplaySummary = function (acc) {
  // Total deposits
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  // Total withdrawals
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // Total interest (only deposits with interest >= 1)
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/////////////////////////
// FUNCTION: Create Usernames
/////////////////////////
// Converts owner name to username (initials, lowercase)
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

/////////////////////////
// FUNCTION: Update UI
/////////////////////////
// Updates movements, balance, and summary for a given account
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

/////////////////////////
// EVENT HANDLER: LOGIN
/////////////////////////
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission

  // Find account based on username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Check PIN
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and show UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI with account data
    updateUI(currentAccount);
  }
});

/////////////////////////
// EVENT HANDLER: TRANSFER
/////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  // Validations: positive amount, enough balance, not sending to self
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Perform transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

/////////////////////////
// EVENT HANDLER: LOAN
/////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  // Loan condition: at least one deposit >= 10% of requested loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount); // Add loan to movements
    updateUI(currentAccount); // Update UI
  }

  inputLoanAmount.value = '';
});

/////////////////////////
// EVENT HANDLER: CLOSE ACCOUNT
/////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Validate username and PIN
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1); // Delete account
    containerApp.style.opacity = 0; // Hide UI
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////
// EVENT HANDLER: SORT MOVEMENTS
/////////////////////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted); // Toggle sort
  sorted = !sorted;
});

// -----------------------------
// ADDITIONAL ARRAY METHODS PRACTICE
// -----------------------------
// Examples using flatMap, reduce, filter, map, etc.
// These are mostly for learning and exercises

// Sum of all deposits in the bank
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// Number of deposits >= 1000
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);

// Total deposits and withdrawals using reduce
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// Convert title to title case (helper function)
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};
console.log(convertTitleCase('this is a nice title'));
