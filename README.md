🏦 Bankist App (HTML, CSS, JavaScript)

A beginner-friendly banking application UI built with vanilla JavaScript, HTML, and CSS.
Users can log in, view their account movements, transfer money, request loans, and close accounts. The app is designed to practice DOM manipulation, array methods, and event handling.

🚀 Features

Log in using username and PIN

Display account balance and transactions (deposits & withdrawals)

Show summary: total deposits, withdrawals, and interest

Transfer money to other accounts

Request a loan based on account eligibility

Close an account by confirming username and PIN

Sort transactions (ascending/descending)

Dynamic UI updates with real-time changes

🛠️ Tech Stack

JavaScript (ES6+) – Logic for banking operations and UI updates

HTML5 – Page structure

CSS3 – Styling and layout

DOM API – Manipulating and updating the page dynamically

Array Methods – map, filter, reduce, forEach, find, some, every, flatMap

📂 Project Structure
bankist-app/
│
├─ index.html          # Main HTML structure
├─ style.css           # Styles for layout and design
├─ script.js           # JavaScript logic and event handlers
└─ README.md           # This file

🧩 How It Works

Login:

Users enter username and PIN.

The app finds the corresponding account and displays the UI.

Display Movements:

Deposits (positive) and withdrawals (negative) are shown as rows.

Option to sort movements.

Balance & Summary:

Balance calculated using reduce() on movements.

Summary shows total deposits, withdrawals, and interest.

Transfer Money:

Validates the receiver account and available balance.

Updates both accounts and UI.

Request Loan:

Can request a loan if at least one deposit is ≥ 10% of requested amount.

Loan is added to movements and UI updates.

Close Account:

Validates username and PIN.

Removes the account and hides the UI.

📝 Sample Accounts
Owner	Username	PIN	Type
Jonas Schmedtmann	js	1111	premium
Jessica Davis	jd	2222	standard
Steven Thomas Williams	stw	3333	premium
Sarah Smith	ss	4444	basic

Usernames are generated from initials automatically.

⚡ How to Run

1. Clone the repo:

git clone https://github.com/yourusername/bankist-app.git


2. Open index.html in your browser.

3. Use the sample accounts to log in and interact with the app.
