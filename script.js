const apiKey = '8G92EAMNYI9SW94C';  // Replace with your Alpha Vantage API key 
let finalPrice = 0;
let buyAmount = 0;
let availableFunds = 10000;
var maxInput = document.querySelector('#numberofShares')
var symbol = document.getElementById('symbol').value; 


window.addEventListener('load', (event) => {
    symbol = document.getElementById('symbol').value; 
    document.getElementById("fundsMessage").innerHTML = `Your Available Funds: $${availableFunds}`;
});

document.getElementById('getPrice').addEventListener('click', () => { 
    symbol = document.getElementById('symbol').value; 
    getStockPrice(symbol); 

    document.querySelector('#shareMessage').style.display = 'inline-block';
    document.querySelector('#numberofShares').style.display = 'inline-block';
    document.querySelector('#buyButton').style.display = 'inline-block';
    document.querySelector('#closeBuyButton').style.display = 'inline-block';
}); 
 
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

document.getElementById('buyButton').addEventListener('click', () => { 
    const purchasedShares = document.getElementById('numberofShares').value;
    
    if(purchasedShares <= buyAmount && purchasedShares >= 1){
        availableFunds = availableFunds - (purchasedShares * finalPrice);
        document.getElementById("fundsMessage").innerHTML = `Your Available Funds: $${availableFunds}`;
        document.getElementById("purchaseMessage").innerHTML = `Congratulations!!! You've purchased ${purchasedShares} shares of ${symbol.toUpperCase()}`;
    } else {
        document.getElementById("purchaseMessage").innerHTML = `You only have enough funds to purchase up to ${buyAmount} shares.`;
    }
});

document.getElementById('closeBuyButton').addEventListener('click', () => { 

    document.querySelector('#shareMessage').style.display = 'none';
    document.querySelector('#numberofShares').style.display = 'none';
    document.querySelector('#buyButton').style.display = 'none';
    document.querySelector('#closeBuyButton').style.display = 'none';
    document.querySelector('#purchaseMessage').style.display = 'none';
});

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