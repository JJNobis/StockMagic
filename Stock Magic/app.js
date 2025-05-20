const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');



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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;


    try {
        await sql.connect(config);
        const result = await sql.query(`SELECt * from users where username = '${username}'`);
        const user = result.recordset[0];


        // if (user && await bcrypt.compare(password, user.pwd)) {
        if (user && password == user.pwd) {
            res.json(user);
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (err) {
        console.log(`DB Error: ${err}`)
        res.status(500).send(err.message);
    }
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
});

app.post(`/api/OVName/`, async (req, res) => {
    const userIDStor = req.body;
    try {
        await sql.connect(config);
        await sql.query(`select username from users where ${userIDStor}=userID`)
    } catch (err) {
        logInName = 'Error';
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
