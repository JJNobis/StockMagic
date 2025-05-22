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


        addFunds = addFunds + user.funds;
        console.log(addFunds);
        await sql.query(`UPDATE users SET funds = ${addFunds} WHERE userID = ${userID}`);


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


        subtractFunds = user.funds - subtractFunds;

        await sql.query(`UPDATE users SET funds = ${subtractFunds} WHERE userID = ${userID}`);


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


        // if (user && await (password, user.pwd)) {
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

app.post(`/api/OVBal/`, async (req, res) => {
    const userIDStor = req.body;
    try {
        await sql.connect(config);
        const result = await sql.query(`select funds from users where ${userIDStor}=userID`);
        const user = result.record
    } catch (err) {
        logInName = 'Error';
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
