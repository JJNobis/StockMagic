const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/JS
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// SQL Server config with Windows Authentication
const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'localhost',
    database: 'StockMagic',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

app.post('/addFunds', async (req, res) => {
    const { moneyIncome, accountID } = req.body;
    console.log(moneyIncome);
    let addFunds = JSON.parse(moneyIncome);
    let userID = JSON.parse(accountID);

    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * from users where userID = ${userID}`);
        const user = result.recordset[0];
        const amt= addFunds;

        addFunds = addFunds + user.funds;
        console.log(addFunds);
        await sql.query(`UPDATE users SET funds = ${addFunds} WHERE userID = ${userID}`);
        await sql.query(`insert into fundsTXHist(userID, depWith, fundAmount) values (${userID}, 0, ${amt});`);


    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/getStockPrices', async (req, res) => {
    const { accountID } = req.body;

    let userID = JSON.parse(accountID);

    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * from userStocks where userID = ${userID}`);
        const user = result.recordset;

    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/subtractFunds', async (req, res) => {
    const { outgoingMoney, accountID } = req.body;

    console.log(outgoingMoney);
    let subtractFunds = JSON.parse(outgoingMoney);
    let userID = JSON.parse(accountID);

    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * from users where userID = ${userID}`);
        const user = result.recordset[0];
        const amt = subtractFunds;

        subtractFunds = user.funds - subtractFunds;

        await sql.query(`UPDATE users SET funds = ${subtractFunds} WHERE userID = ${userID}`);
        await sql.query(`insert into fundsTXHist(userID, depWith, fundAmount) values (${userID}, 1, ${amt});`);


    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();

});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query(`SELECt * from users where username = '${username}'`);
        const user = result.recordset[0];

        if (user && password == user.pwd) {
            res.json(user);
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/api/signUp', async (req, res) => {
    const { first, last, emailAddress, username, password, fundsAccount } = req.body;
    const routingNums = 1234;
    try {
        await sql.connect(config);
        await sql.query(`INSERT INTO users (fName, lName, email, username, pwd, funds, routingNums ) VALUES 
                   ('${first}', '${last}', '${emailAddress}', '${username}', '${password}', '${fundsAccount}', '${routingNums}')`);
    } catch (err) {
        res.status(500).send(err.message);
    }
    await sql.close();
});


app.post('/addStock', async (req, res) => {
    const { symbol, accountID, qty, sellPrice } = req.body;

    try {
        await sql.connect(config);
        await sql.query(`INSERT INTO stockTXHist (sym, buySell, userID, qty, sellPrice ) VALUES 
                   ('${symbol}', 1, ${accountID}, ${qty}, ${sellPrice})`);

    } catch (err) {
        res.status(500).send(err.message);
    }
    await sql.close();
});



app.post('/purchaseStock', async (req, res) => {
    const { symbol, accountID, qty, sellPrice } = req.body;
    try {
        await sql.connect(config);

        await sql.query(`INSERT INTO userStocks (userID, sym, qty, Bought_price, Current_price) VALUES
                (${accountID}, '${symbol}', ${qty}, ${sellPrice}, ${sellPrice})`);

    } catch (err) {
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/pullTXHist', async (req, res) => {
    // Error Test: console.log(req.body);
    const { accountID } = req.body;
    //Error Test: console.log(`Test C ${accountID}`);
    //Error Test: console.log(req.body);
    try {
        await sql.connect(config);
        const result = await sql.query(`select * from StockTXHist where userID = ${accountID}`);
        const user = result.recordset;
        //Error Test: console.log(user);
        res.json(user);
    } catch (err) {
        TXHistArray = [['ERROR']];
    }
});

app.post('/updateStocks', async (req, res) => {
    const { accountID, symbol, price } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query(`select * from userStocks where userID = ${accountID}`);
        const user = result.recordset;

        res.json(user);
    } catch (err) {
        console.log(err);
    }

});
app.post('/getStocks', async (req, res) => {
    const { accountID } = req.body;

    let userID = JSON.parse(accountID);


    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM userStocks WHERE userID = ${userID}`);
        const user = result.recordset;
        res.json(user);

    } catch (err) {
        console.log(err);
    }


});

app.post('/updateCurrentPrice', async (req, res) => {
    const { symbol, getStockPrice, accountID } = req.body;

    let userID = JSON.parse(accountID);
    console.log(req.body);
    try {
        await sql.connect(config);

        await sql.query(`UPDATE userStocks SET Current_price = ${getStockPrice} WHERE userID = ${userID} AND sym = '${symbol}'`);


    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();

});

app.post('/sellStocks', async (req, res) => {
    const { sym, newQty, accountID, qty } = req.body;
    console.log(req.body);
    let leftoverQTY = JSON.parse(newQty);
    let userID = JSON.parse(accountID);
    let oldQty = JSON.parse(qty);

    try {
        await sql.connect(config);
        await sql.query(`UPDATE userStocks SET qty = ${leftoverQTY} WHERE userID = ${userID} AND sym = '${sym}' AND qty = ${oldQty} `);


    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/deleteStocks', async (req, res) => {
    const { sym, accountID, qty } = req.body;

    let userID = JSON.parse(accountID);
    let oldQty = JSON.parse(qty);

    try {
        await sql.connect(config);
        await sql.query(`DELETE FROM userStocks WHERE userID = ${userID} AND sym = '${sym}' AND qty = ${oldQty} `);


    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});


//TX Hist load in
app.post('/pullTXHist', async (req, res) => {
    // Error Test: console.log(req.body);
    const { accountID } = req.body;
    //Error Test: console.log(`Test C ${accountID}`);
    //Error Test: console.log(req.body);
    try {
        await sql.connect(config);
        const result = await sql.query(`select * from StockTXHist where userID = ${accountID}`);
        const user = result.recordset;
        //Error Test: console.log(user);
        res.json(user);
    } catch (err) {
        TXHistArray = [['ERROR']];
    }
});

//settings page change bank//
app.post('/changeBank', async (req, res) => {
    const { bankAccount, accountID } = req.body;
    console.log(req.body);
    try {
        let changeBank = JSON.parse(bankAccount);
        await sql.query(`UPDATE users SET routingNums = ${changeBank} WHERE userID = ${userID}`);
    } catch (err) {
        console.log(`DB Error: ${err}`)
    }

});

//settings page change name and email//
app.post('/changeEmail', async (req, res) => {
    const { newEmail, accountID } = req.body;
    console.log(req.body);
    let userID = JSON.parse(accountID);

    try {
        await sql.connect(config);
        await sql.query(`UPDATE users SET email = '${newEmail}' WHERE userID = ${userID}`);
    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

//settings change password//
app.post('/passChange', async (req, res) => {
    const { newPassword, accountID } = req.body;
    console.log(req.body);
    let userID = JSON.parse(accountID);
    let nPass = JSON.parse(newPassword);

    try {
        await sql.connect(config);
        await sql.query(`UPDATE users SET pwd = '${nPass}' WHERE userID = ${userID}`);

    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
    await sql.close();
});

//Funds Hist load in
app.post('/pullFundsHist', async (req, res) => {
    // Error Test: console.log(req.body);
    const { accountID } = req.body;
    //Error Test: console.log(`Test C ${accountID}`);
    //Error Test: console.log(req.body);
    try {
        await sql.connect(config);
        const result = await sql.query(`select * from fundsTXHist where userID = ${accountID}`);
        const user = result.recordset;
        //Error Test: console.log(user);
        res.json(user);
    } catch (err) {
        TXHistArray = [['ERROR']];
    }
});

app.post('/accAdd', async (req, res) => {
    const { newAccNum, accountID } = req.body;
    console.log(req.body);
    let userID = JSON.parse(accountID);

    try {
        await sql.connect(config);
        await sql.query(`UPDATE users SET accountNumber = '${newAccNum}' WHERE userID = ${userID}`);
 

    } catch (err) {
        console.log(`DB Error: ${err}`)  
    }});
          
app.post('/updateTxTable', async (req, res) => {
    const { sym, qty, price, accountID, total } = req.body;

    try {
        await sql.connect(config);
        await sql.query(`INSERT INTO stockTXHist (sym, buySell, userID, qty, sellPrice ) VALUES 
                   ('${sym}', 0, ${accountID}, ${qty}, ${price})`);

    } catch (err) {
        res.status(500).send(err.message);
    }
    await sql.close();
});

app.post('/contactResponse', async (req) => {
    console.log(req.body)
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
