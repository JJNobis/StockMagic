const apiKey = '8G92EAMNYI9SW94C';  //API key to connect to Stock Market

const config = {
    server: 'localhost',
    database: 'StockMagic',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificat: true
    }
};

let finalPrice; //Used to display the price of a stock
let buyAmount; //Maximum number of shares that can be purchased. 
var availableFunds; // Funds that are available for buying stocks. This will get updated later to incorporate the array. 
var symbol; //Used for stock name.
let customerID;
var userFirstName;
var userLastName;
var userEmail;
var passedArray;
var fundLine;
var userID;
//Future plan --- Make sure when creating account that username doesn't already exist.


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (!res.ok) throw new Error("Login failed");
            return res.json();
        })
        .then(user => {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userIDStor', user.userID);
            localStorage.setItem("first-name", user.fName);
            localStorage.setItem("last-name", user.lName);
            localStorage.setItem("email", user.email);
            localStorage.setItem("funds", user.funds);
            localStorage.setItem("ID", user.userID);
            localStorage.setItem('loggedIn', 'true');
            window.location.href = "AccountOV.html";
        })
        .catch(err => {
            document.getElementById('message').innerText = 'Invalid login';
        });
}
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('ID');
    location.reload();
    window.location.href = "index.html";
}

//Displays create account box
function openCreate() {
    document.getElementById("createForm").style.display = "block";
}
//Closes create account box
function closeForm() {
    document.getElementById("createForm").style.display = "none";
}
//Display alert that account was created
function accountCreated() {


    alert("Account created! You may now login.");
    closeForm();
}


function openFundsBox() {
    document.getElementById("addFundsForm").style.display = "block";
}
//Display user information on page
function greetingMessage() {
    userFirstName = localStorage.getItem("first-name");
    userLastName = localStorage.getItem("last-name");
    availableFunds = localStorage.getItem("funds");
    userID = localStorage.getItem("ID");
    availableFunds = parseFloat(availableFunds).toFixed(2);
    document.getElementById("greeting").innerHTML = `Welcome, ${userFirstName} ${userLastName}.`;
    document.getElementById("fundsDisplay").innerHTML = `$${availableFunds}`;
    document.getElementById("stockMoney").innerHTML = `$0`;
    document.getElementById("totalMoney").innerHTML = `$${availableFunds}`;
}

function withdrawMoney() {
    const accountID = localStorage.getItem("ID");
    availableFunds = localStorage.getItem("funds");
    const num1 = parseFloat(availableFunds);
    let subtractMoney = prompt(`Please enter withdrawal amount (Max withdrawal amount: $${availableFunds}): `);
    const num2 = parseFloat(subtractMoney).toFixed(2);
    if (!isNaN(num2) && subtractMoney !== '' && num2 > 0 && num2 <= num1) {
        withdrawMoneyFromAccount(num2, accountID);

        const sum = num1 - num2;
        localStorage.setItem("funds", sum.toFixed(2));
        document.getElementById("fundsDisplay").innerHTML = `$${sum.toFixed(2)}`;
        window.location.reload();

    } else {
        alert('Invalid input.')
    }
}

function withdrawMoneyFromAccount(outgoingMoney, accountID) {
    fetch('http://localhost:3000/subtractFunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outgoingMoney, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add Money");
            return res.json();
        })
        .then(user => {
            document.getElementById("fundsDisplay").innerHTML = `$${user.funds}`;
        })
        .catch(err => {
            document.getElementById('fundsDisplay').innerText = 'ERROR';
        });



}

function askForMoney() {
    const accountID = localStorage.getItem("ID");
    availableFunds = localStorage.getItem("funds");
    let addMoney = prompt("Please enter amount of money to add to account:");
    addMoney = parseFloat(addMoney).toFixed(2);
    if (!isNaN(addMoney) && addMoney !== '' && addMoney > 0) {
        addMoneyToAccount(addMoney, accountID);
        const num1 = parseFloat(availableFunds);
        const num2 = parseFloat(addMoney);
        const sum = num1 + num2;
        localStorage.setItem("funds", sum);
        document.getElementById("fundsDisplay").innerHTML = `$${sum}`;
        window.location.reload();

    } else {
        alert('Invalid input.')
    }
}

function addMoneyToAccount(moneyIncome, accountID) {
    fetch('http://localhost:3000/addFunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moneyIncome, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add Money");
            return res.json();
        })
        .then(user => {
            document.getElementById("fundsDisplay").innerHTML = `$${user.funds}`;
        })
        .catch(err => {
            document.getElementById('fundsDisplay').innerText = 'ERROR';
        });

}

//Searches for stock and its price also makes further buying actions appear.
function getPriceStock() {
    symbol = document.getElementById('symbol').value;
    getStockPrice(symbol);

    document.querySelector('#shareMessage').style.display = 'inline-block';
    document.querySelector('#numberofShares').style.display = 'inline-block';
    document.querySelector('#buyButton').style.display = 'inline-block';
    document.querySelector('#closeBuyButton').style.display = 'inline-block';

}

async function getStockPrice(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data['Time Series (1min)']) {
            const latestTime = Object.keys(data['Time Series (1min)'])[0];
            const latestData = data['Time Series (1min)'][latestTime];
            const price = latestData['1. open'];

            finalPrice = parseFloat(price).toFixed(2);

            buyAmount = Math.floor(availableFunds / price);
            document.querySelector('#numberofShares').setAttribute('max', buyAmount);

            if (buyAmount == 0) {
                document.getElementById('result').innerHTML =
                    `Sorry you don't have enough funds to purchase any shares of ${symbol.toUpperCase()}, 1 share currently cost $${finalPrice}.`;

                document.querySelector('#shareMessage').style.display = 'none';
                document.querySelector('#numberofShares').style.display = 'none';
                document.querySelector('#buyButton').style.display = 'none';
                document.querySelector('#closeBuyButton').style.display = 'none';
                document.querySelector('#purchaseMessage').style.display = 'none';

            } else {
                document.getElementById('result').innerHTML =
                    `<strong>${symbol.toUpperCase()}:</strong> $${finalPrice} at ${latestTime}. You may buy up to ${buyAmount} shares of <strong>${symbol.toUpperCase()}</strong>`;
            }

        } else {
            document.getElementById('result').innerHTML =
                `<strong>Error:</strong> ${data['Note'] || 'Stock symbol not found.'}`;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').innerHTML =
            `<strong>Error:</strong> Unable to retrieve stock data.`;
    }



}

function buyStock() {

    const purchasedShares = document.getElementById('numberofShares').value;
    const accountID = localStorage.getItem("ID")

    if (purchasedShares <= buyAmount && purchasedShares >= 1) {
        let price = purchasedShares * finalPrice;
        price = price.toFixed(2);
        availableFunds = availableFunds - (purchasedShares * finalPrice);
        availableFunds = availableFunds.toFixed(2);
        withdrawMoneyFromAccount(price, accountID);
        document.getElementById("fundsMessage").innerHTML = `Your Available Funds: $${availableFunds}`;
        document.getElementById("purchaseMessage").innerHTML = `Congratulations! You've purchased ${purchasedShares} shares of ${symbol.toUpperCase()}`;
        document.getElementById('result').innerHTML = "";
        localStorage.setItem("funds", availableFunds);
    } else {
        document.getElementById("purchaseMessage").innerHTML = `You only have enough funds to purchase up to ${buyAmount} shares.`;
    }

}
function closeStock() {

    document.querySelector('#shareMessage').style.display = 'none';
    document.querySelector('#numberofShares').style.display = 'none';
    document.querySelector('#buyButton').style.display = 'none';
    document.querySelector('#closeBuyButton').style.display = 'none';
    document.querySelector('#purchaseMessage').style.display = 'none';

}



