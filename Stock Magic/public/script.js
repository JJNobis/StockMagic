const apiKey = 'W14I9M4P1PD5SM52';  //API key to connect to Stock Market
//Spare API 
//8G92EAMNYI9SW94C
//W14I9M4P1PD5SM52
//5ORFBD05O917SGOR
let finalPrice; //Used to display the price of a stock
let buyAmount; //Maximum number of shares that can be purchased. 
var availableFunds; // Funds that are available for buying stocks. This will get updated later to incorporate the array. 
var symbol; //Used for stock name.
let customerID;
var userFirstName;
var userLastName;
var userEmail;
let total;
var fundLine;
var userID;
//Future plan --- Make sure when creating account that username doesn't already exist.

// Function for logging in calls app /login to check credentials
function login() {
    localStorage.clear();
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
            localStorage.setItem('loggedIn', 1);
            localStorage.setItem('userIDStor', user.userID);
            localStorage.setItem("first-name", user.fName);
            localStorage.setItem("last-name", user.lName);
            localStorage.setItem("email", user.email);
            localStorage.setItem("funds", user.funds);
            localStorage.setItem("ID", user.userID);
            window.location.href = "AccountOV.html";
        })
        .catch(err => {
            document.getElementById('message').innerText = 'Invalid login';
        });
}
//clear data for logging back in. 
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('ID');
    location.reload();
    localStorage.clear();
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

//makes the addfunds form appear
function openFundsBox() {
    document.getElementById("addFundsForm").style.display = "block";
}
//creates header information at the top of stocksearch page. 
function stockBySearchMessage() {
    userFirstName = localStorage.getItem("first-name");
    userLastName = localStorage.getItem("last-name");
    availableFunds = localStorage.getItem("funds");
    userID = localStorage.getItem("ID");
    document.getElementById("greeting").innerHTML = `Welcome, ${userFirstName} ${userLastName}.`;
}
//Display user information on page searches for updated stock prices as well
function greetingMessage() {
    userFirstName = localStorage.getItem("first-name");
    userLastName = localStorage.getItem("last-name");
    availableFunds = localStorage.getItem("funds");
    userID = localStorage.getItem("ID");
    availableFunds = parseFloat(availableFunds);

    let check = localStorage.getItem('loggedIn');
    if (check == 1) {
        getActiveStocks();

    }
    getStockValue();
    document.getElementById("greeting").innerHTML = `Welcome, ${userFirstName} ${userLastName}.`;
    document.getElementById("fundsDisplay").innerHTML = `$${availableFunds.toFixed(2)}`;
    document.getElementById("totalMoney").innerHTML = `$0`;
    document.getElementById("stockMoney").innerHTML = `$0`;

}
//updates stock price by getting stocks and sending them to setCurrentPrice function
async function getActiveStocks() {
    accountID = localStorage.getItem('ID');
    localStorage.setItem("total", 0);
    //let previousTotal = 0;
    fetch('http://localhost:3000/getStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to get Stocks");
            return res.json();
        })
        .then(user => {
            user.forEach(stock => {
                //  previousTotal = previousTotal + (stock.qty * stock.Current_price);
                localStorage.setItem("qty", stock.qty);
                setCurrentPrice(stock.sym);


            })

            //localStorage.setItem('loggedIn', 0);
            // let completeValue = parseFloat(availableFunds) + total;
            // document.getElementById("totalMoney").innerHTML = `$${completeValue.toFixed(2)}`;
            //document.getElementById("stockMoney").innerHTML = `$${total.toFixed(2)}`;
        })

        .catch(err => {
            console.log(err);
        });


}

//Gets the newest stock prices and displays the price on AccountOV page
function getStockValue() {
    accountID = localStorage.getItem('ID');
    localStorage.setItem("total", 0);
    let total = 0;
    availableFunds = parseFloat(localStorage.getItem("funds"));

    fetch('http://localhost:3000/getStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to get Stocks");
            return res.json();
        })
        .then(user => {
            user.forEach(stock => {
                total = total + (stock.qty * stock.Current_price);
                document.getElementById("totalMoney").innerHTML = `$${(availableFunds + total).toFixed(2)}`;
                document.getElementById("stockMoney").innerHTML = `$${total.toFixed(2)}`;

            })
            localStorage.setItem("total", total);
            // let previousTotal = parseFloat(localStorage.getItem("previousTotal"));
            // document.getElementById("priceChange").innerHTML = `Price change since last viewed: $${(total - previousTotal).toFixed(2)}`;
        })

        .catch(err => {
            console.log(err);
        });


}

//funcition to prompt for withdrawing funds
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
    location.reload();
}

// calls the app to update sql table with new available funds
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

//Prompts to ask for money to update sql database
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

    } else {
        alert('Invalid input.')
    }
    location.reload()
}

//calls app to update sql database with new available funds
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
            console.log(err);
        });

}
//settings page start//

function updateEmail() {

    const newEmail = document.getElementById("email").value;
    console.log(newEmail);
    const accountID = localStorage.getItem("ID");
    fetch('http://localhost:3000/changeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update Email");
            return res.json();
        })
        .then(data => {
            // handle success, e.g. shows a message
            console.log("Email updated successfully", data);
        })

        .catch(err => {
            console.log(err);
        });

    alert("Email changed");
}
//function to call app to update password
function passChange() {
    const currentPassword = document.getElementById("CurrentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    console.log(newPassword);
    const accountID = localStorage.getItem("ID");
    fetch('http://localhost:3000/passChange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update password");
            return res.json();
        })
        .then(data => {
            // handle success, e.g. shows a message
            console.log("Password updated successfully");
        })

        .catch(err => {
            console.log(err);
        });

    alert("Password changed");
}
//Adds stock that are purchased to transaction table
function addStockToDatabase(symbol, qty, sellPrice) {
    const accountID = localStorage.getItem("ID");

    fetch('http://localhost:3000/addStock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, accountID, qty, sellPrice })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add stock");
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}
//adds stock to active stocked owned by a user
function addActiveStock(symbol, qty, sellPrice) {
    const accountID = localStorage.getItem("ID");

    fetch('http://localhost:3000/purchaseStock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, accountID, qty, sellPrice })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add stock");
            return res.json();
        })
        .catch(err => {
            console.log(err);
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
//searches using api key to update stock prices
async function setCurrentPrice(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;
    accountID = localStorage.getItem("ID");
    console.log("Hello");
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data['Time Series (1min)']) {
            const latestTime = Object.keys(data['Time Series (1min)'])[0];
            const latestData = data['Time Series (1min)'][latestTime];
            const price = latestData['1. open'];

            let getStockPrice = parseFloat(price);
            fetch('http://localhost:3000/updateCurrentPrice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, getStockPrice, accountID })
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to add Money");
                    return res.json();
                })
                .catch(err => {

                    console.log(err);
                });
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
//Gets the stock prices for stock search buy page
async function getStockPrice(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;
    console.log("Hello")

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
            console.log(buyAmount);
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


//checks to make sure funds are enough to buy the stock and adds data to databases
function buyStock() {

    const purchasedShares = document.getElementById('numberofShares').value;
    const accountID = localStorage.getItem("ID");

    if (purchasedShares <= buyAmount && purchasedShares >= 1) {
        let price = purchasedShares * finalPrice;
        price = price.toFixed(2);
        availableFunds = availableFunds - (purchasedShares * finalPrice);
        availableFunds = availableFunds.toFixed(2);
        withdrawMoneyFromAccount(price, accountID);
        addStockToDatabase(symbol.toUpperCase(), purchasedShares, finalPrice);
        addActiveStock(symbol.toUpperCase(), purchasedShares, finalPrice);


        document.getElementById("fundsMessage").innerHTML = `Your Available Funds: $${availableFunds}`;
        document.getElementById("purchaseMessage").innerHTML = `Congratulations! You've purchased ${purchasedShares} shares of ${symbol.toUpperCase()}`;
        document.getElementById('result').innerHTML = "";
        localStorage.setItem("funds", availableFunds);
        closeStock();
    } else {
        document.getElementById("purchaseMessage").innerHTML = `You only have enough funds to purchase up to ${buyAmount} shares.`;
    }

}
//closes the form for buying stock
function closeStock() {

    document.querySelector('#shareMessage').style.display = 'none';
    document.querySelector('#numberofShares').style.display = 'none';
    document.querySelector('#buyButton').style.display = 'none';
    document.querySelector('#closeBuyButton').style.display = 'none';
    document.querySelector('#purchaseMessage').style.display = 'none';

}
//update backaccount 
function updateBankAcc() {
    console.log("hello");
    const accountID = localStorage.getItem("ID");
    console.log(`test A ${accountID}`);
    fetch('http://localhost:3000/pullTXHist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankAccount, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to Update Bank Account");
            return res.json();
        })
        .then(user => {
            console.log("Received transactions:", user);
            const table = document.getElementById("TXTable");
            user.forEach(tx => {
                console.log("Single TX object:", tx);
                let row = table.insertRow(-1);
                const fields = [
                    tx.sym, //Symbol
                    tx.buySell ? "BOUGHT" : "SOLD", //Transaction Type
                    tx.qty, //Quantity
                    `$${tx.sellPrice.toFixed(2)}`, //Price/Share
                    `$${(tx.qty * tx.sellPrice).toFixed(2)}`,  //Tota;
                    new Date(tx.txDate).toLocaleDateString() //Date
                ];
                console.log("TX row values:", fields);
                fields.forEach(value => {
                    const cell = row.insertCell();
                    cell.innerHTML = value ?? '-'; //fallback in case value is undefined
                });
            });
        })
        .catch(err => {
            console.log(err)
        });
}


/**********TXHist load in*******/
function loadTXHist() {
    const accountID = localStorage.getItem("ID");
    // Error test: console.log(`test A ${accountID}`);
    fetch('http://localhost:3000/pullTXHist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load Transactions");
            return res.json();
        })
        .then(user => {
            //Error test: console.log("Received transactions:", user);
            const table = document.getElementById("TXTable");
            user.forEach(tx => {
                //Error test: console.log("Single TX object:", tx);
                let row = table.insertRow(-1);
                const fields = [
                    tx.sym, //Symbol
                    tx.buySell ? "BOUGHT" : "SOLD", //Transaction Type
                    tx.qty, //Quantity
                    `$${tx.sellPrice.toFixed(2)}`, //Price/Share
                    `$${(tx.qty * tx.sellPrice).toFixed(2)}`,  //Tota;
                    new Date(tx.txDate).toLocaleDateString() //Date
                ];
                //Error test: console.log("TX row values:", fields);
                fields.forEach(value => {
                    const cell = row.insertCell();
                    cell.innerHTML = value ?? '-'; //fallback in case value is undefined
                });
            });
        })
        .catch(err => {
            console.error("Error loading transaction history:", err);
        });
}



/**********fundsHist load in*******/
function loadFundsHist() {
    const accountID = localStorage.getItem("ID");
    // Error test: console.log(`test A ${accountID}`);
    fetch('http://localhost:3000/pullFundsHist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load Transactions");
            return res.json();
        })
        .then(user => {
            //Error test: console.log("Received transactions:", user);
            const table = document.getElementById("fundsTable");
            user.forEach(tx => {
                //Error test: console.log("Single TX object:", tx);
                let row = table.insertRow(-1);
                const fields = [
                    tx.depWith ? "WITHDRAWL" : "DEPOSIT", //Transaction Type
                    tx.fundAmount,
                    new Date(tx.txDate).toLocaleDateString() //Date
                ];
                //Error test: console.log("TX row values:", fields);
                fields.forEach(value => {
                    const cell = row.insertCell();
                    cell.innerHTML = value ?? '-'; //fallback in case value is undefined
                });
            });
        })
        .catch(err => {
            console.error("Error loading transaction history:", err);
        });
}

/*function to load greeting and then Funds hist, b/c you can't do multiple onloads*/
function accountOVPage() {
    greetingMessage()
    loadFundsHist()
}

//pull up stocks that are currently owned.
function loadOwnedStocks() {
    const accountID = localStorage.getItem("ID");
    // Error test: console.log(`test A ${accountID}`);
    let currentPrice;
    fetch('http://localhost:3000/updateStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load stocks");
            return res.json();
        })
        .then(user => {
            //Error test: console.log("Received transactions:", user);
            const table = document.getElementById("stockTable");
            user.forEach(stock => {
                //Error test: console.log("Single TX object:", tx);
                console.log(finalPrice);
                let row = table.insertRow(-1);
                const fields = [
                    stock.sym, //Symbol
                    stock.qty, //Quantity
                    `$${stock.Bought_price.toFixed(2)}`,
                    `$${stock.Current_price.toFixed(2)}`,
                    //Price/Share
                    `$${(stock.Current_price * stock.qty).toFixed(2)}`//Total;

                ];
                //Error test: console.log("TX row values:", fields);
                fields.forEach(value => {
                    const cell = row.insertCell();
                    cell.innerHTML = value ?? '-'; //fallback in case value is undefined
                });
            });
            addButtonsToTable("stockTable");
        })
        .catch(err => {
            console.error("Error loading stocks:", err);
        });
}
//Adds the sell button to the end of each row for buying the stock
function addButtonsToTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error('Table not found');
        return;
    }

    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        const button = document.createElement('button');
        button.textContent = 'Sell';
        button.classList.add('sellbuttons');
        button.addEventListener('click', function () {
            const symbol = row.cells[0].textContent;
            let qty = parseFloat(row.cells[1].textContent);
            let currentPrice = row.cells[3].textContent;
            availableFunds = parseFloat(localStorage.getItem("funds"));
            currentPrice = currentPrice.replace(/\$/g, '');
            currentPrice = parseFloat(currentPrice);
            accountID = localStorage.getItem("ID");

            let purchase = prompt(`How many shares of ${symbol} would you like to Sell: `);
            let num = parseFloat(purchase);
            if (!isNaN(num) && purchase !== '' && num > 0 && num <= qty) {
                let addMoney = num * currentPrice;
                console.log(addMoney);
                addMoneyToAccount(addMoney, accountID);
                const num1 = parseFloat(availableFunds);
                const num2 = parseFloat(addMoney);
                const sum = num1 + num2;
                localStorage.setItem("funds", sum);

                let newQty = qty - num;
                if (newQty > 0) {
                    changeQuantity(symbol, newQty, accountID, qty);
                    alert(`${symbol} shares sold for a total of $${addMoney.toFixed(2)}`);
                    updateSoldHistory(symbol, num, currentPrice, addMoney);
                    window.location.reload();
                } else if (newQty == 0) {
                    deleteStocks(symbol, qty, accountID)
                    alert(`All shares of ${symbol} sold for a total of $${addMoney.toFixed(2)}`);
                    updateSoldHistory(symbol, num, currentPrice, addMoney);
                    window.location.reload();

                }
            } else {
                alert("Invalid response");
            }
        });

        const cell = document.createElement('td');
        cell.appendChild(button);
        row.appendChild(cell);
    }
}
//update transaction table with sold data
function updateSoldHistory(sym, qty, price, total) {
    accountID = localStorage.getItem("ID");
    fetch('http://localhost:3000/updateTxTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sym, qty, price, accountID, total })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}
//change quantity of stocks sold
function changeQuantity(sym, newQty, accountID, qty) {

    fetch('http://localhost:3000/sellStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sym, newQty, accountID, qty })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add Money");
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });

}
//delete stock from active list if all shares are sold
function deleteStocks(sym, qty, accountID) {
    fetch('http://localhost:3000/deleteStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sym, qty, accountID })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add Money");
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}
//sell
function accAdd(bankAccount, accountID) {

    fetch('http://localhost:3000/sellStocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankAccount, accountID, qty })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add Money");
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });

}