const sql = require('mssql/msnodesqlv8');

const apiKey = '8G92EAMNYI9SW94C';  //API key to connect to Stock Market

const config = {
    server: 'localhost',
    database: 'StockMarketDB',
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
//Future plan --- Make sure when creating account that username doesn't already exist.


function loginAccount() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        customerID = 0;
        pullArray();

        username = document.getElementById('username').value;//Input values from user to attempt to login
        password = document.getElementById('password').value;//Input values from user to attempt to login
        
        //Check with array to see if the user input matches what was used when they created the account. Password is always one element more then the username. 
        for (let i = 0; i < passedArray.length; i++){

            if (passedArray[i] == "Contact"){
                customerID++;
            }

            if (username === passedArray[i] && password === passedArray[i+1]) {

                fundLine = i + 5;
                localStorage.setItem("first-name", passedArray[i+2]);
                localStorage.setItem("last-name", passedArray[i+3]);
                localStorage.setItem("email", passedArray[i+4]);
                localStorage.setItem("funds", passedArray[i+5]);
                localStorage.setItem("ID", customerID);
                localStorage.setItem("accountArray", passedArray);
                localStorage.setItem("fundsInTxt", fundLine);

                
                document.getElementById('message').textContent = '';
                document.getElementById("login").onclick = window.location.href = "AccountOV.html";
                

                break;
            } 
            document.getElementById('message').textContent = 'Login failed. Incorrect username or password.';
        }
});
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


function openFundsBox(){
    document.getElementById("addFundsForm").style.display = "block";
}

function greetingMessage(){
    userFirstName = localStorage.getItem("first-name");
    userLastName = localStorage.getItem("last-name");
    availableFunds = localStorage.getItem("funds");
    passedArray = localStorage.getItem("accountArray");
    fundLine = localStorage.getItem("fundsInTxt");
    document.getElementById("hiddenArray").innerHTML = passedArray;

    document.getElementById("greeting").innerHTML = `Welcome, ${userFirstName} ${userLastName}.`;
    document.getElementById("fundsMessage").innerHTML = `Your available funds are: $${availableFunds}.`;
}
//Displays available funds at start of page loading.
function addMoneyToAccount(){
    const money = document.getElementById('cashAdded').value;

    availableFunds = availableFunds + money;
    passedArray[fundLine] = availableFunds;

    document.getElementById("hiddenArray").innerHTML = passedArray;
    document.getElementById("fundsMessage").innerHTML = `Your available funds are: $${availableFunds}.`;
    document.getElementById('addFundsForm').style.display = 'block';
    
}

//Searches for stock and its price also makes further buying actions appear.
function getPriceStock(){
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
            
            if(buyAmount==0){
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

function buyStock(){

    const purchasedShares = document.getElementById('numberofShares').value;
    

    if(purchasedShares <= buyAmount && purchasedShares >= 1){
        availableFunds = availableFunds - (purchasedShares * finalPrice);
        availableFunds= availableFunds.toFixed(2);
        document.getElementById("fundsMessage").innerHTML = `Your Available Funds: $${availableFunds}`;
        document.getElementById("purchaseMessage").innerHTML = `Congratulations!!! You've purchased ${purchasedShares} shares of ${symbol.toUpperCase()}`;
        document.getElementById('result').innerHTML =  "";
        
    } else {
        document.getElementById("purchaseMessage").innerHTML = `You only have enough funds to purchase up to ${buyAmount} shares.`;
    }

}
function closeStock(){

    document.querySelector('#shareMessage').style.display = 'none';
    document.querySelector('#numberofShares').style.display = 'none';
    document.querySelector('#buyButton').style.display = 'none';
    document.querySelector('#closeBuyButton').style.display = 'none';
    document.querySelector('#purchaseMessage').style.display = 'none';

}

function getFinalPrice(){
    return finalPrice;
}

function getBuyAmount(){
    return buyAmount;
}
function setAvailableFunds(funds){
    availableFunds= availableFunds + funds;
}
function getAvailableFunds(){
    return availableFunds;
}

