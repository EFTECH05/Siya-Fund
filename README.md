# Siya-Fund
Siya Fund is a mobile financial management application developed as part of a 5-month WIL project. Our team is building the app with React Native and Expo, focusing on group management, contributions, transactions, loans, user accounts, and a simple, user-friendly experience.


Siya-Fund/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── app/                  ← Expo Router
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── groups/
│   │   │   ├── contributions/
│   │   │   ├── transactions/
│   │   │   └── loans/
│   │   │
│   │   ├── views/                ← UI
│   │   │   ├── screens/
│   │   │   └── components/
│   │   │
│   │   ├── controllers/          ← Application logic
│   │   │   ├── AuthController.js
│   │   │   ├── GroupController.js
│   │   │   ├── ContributionController.js
│   │   │   ├── TransactionController.js
│   │   │   └── LoanController.js
│   │   │
│   │   ├── models/               ← Data structures
│   │   │   ├── User.js
│   │   │   ├── Group.js
│   │   │   ├── Contribution.js
│   │   │   ├── Transaction.js
│   │   │   └── Loan.js
│   │   │
│   │   └── services/
│   │       ├── firebase.js
│   │       ├── AuthService.js
│   │       ├── GroupService.js
│   │       ├── ContributionService.js
│   │       ├── TransactionService.js
│   │       └── LoanService.js
│   │
│   └── package.json
│
├── README.md
└── .gitignore



Siya-Fund/
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── app/                              ← Expo Router
│   │   │   │
│   │   │   ├── _layout.jsx
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx                    ← 👤 Person 1
│   │   │   ├── register.jsx                 ← 👤 Person 1
│   │   │   ├── dashboard.jsx                 ← 👤 Person 5
│   │   │   │
│   │   │   ├── groups/                       ← 👤 Person 2
│   │   │   │   ├── index.jsx
│   │   │   │   ├── create.jsx
│   │   │   │   └── [id].jsx
│   │   │   │
│   │   │   ├── contributions/               ← 👤 Person 3
│   │   │   │   ├── index.jsx
│   │   │   │   └── create.jsx
│   │   │   │
│   │   │   ├── transactions/                ← 👤 Person 3
│   │   │   │   ├── index.jsx
│   │   │   │   └── [id].jsx
│   │   │   │
│   │   │   └── loans/                        ← 👤 Person 4
│   │   │       ├── index.jsx
│   │   │       ├── request.jsx
│   │   │       └── [id].jsx
│   │   │
│   │   ├── views/                            ← 🎨 Person 5
│   │   │   └── components/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── GroupCard.jsx             ← Person 2
│   │   │       ├── LoanCard.jsx              ← Person 4
│   │   │       └── TransactionCard.jsx       ← Person 3
│   │   │
│   │   ├── controllers/
│   │   │   │
│   │   │   ├── AuthController.js             ← 👤 Person 1
│   │   │   ├── GroupController.js            ← 👤 Person 2
│   │   │   ├── ContributionController.js    ← 👤 Person 3
│   │   │   ├── TransactionController.js     ← 👤 Person 3
│   │   │   └── LoanController.js             ← 👤 Person 4
│   │   │
│   │   ├── models/
│   │   │   │
│   │   │   ├── User.js                       ← 👤 Person 1
│   │   │   ├── Group.js                      ← 👤 Person 2
│   │   │   ├── Contribution.js               ← 👤 Person 3
│   │   │   ├── Transaction.js                ← 👤 Person 3
│   │   │   └── Loan.js                       ← 👤 Person 4
│   │   │
│   │   ├── services/
│   │   │   │
│   │   │   ├── firebase.js                   ← 👥 Shared
│   │   │   ├── AuthService.js                ← 👤 Person 1
│   │   │   ├── GroupService.js               ← 👤 Person 2
│   │   │   ├── ContributionService.js        ← 👤 Person 3
│   │   │   ├── TransactionService.js         ← 👤 Person 3
│   │   │   └── LoanService.js                ← 👤 Person 4
│   │   │
│   │   └── utils/
│   │       ├── validation.js                 ← 👥 Shared
│   │       └── constants.js                  ← 👥 Shared
│   │
│   ├── assets/
│   │   ├── images/                           ← 👤 Person 5
│   │   └── icons/                            ← 👤 Person 5
│   │
│   ├── package.json                          ← 👥 Shared
│   └── app.json                              ← 👤 Person 5
│
├── docs/                                     ← 👥 ALL MEMBERS
│   ├── requirements/
│   ├── architecture/
│   ├── database/
│   ├── testing/
│   └── user-manual/
│
├── README.md                                 ← 👤 Person 5
└── .gitignore                                ← 👥 Shared