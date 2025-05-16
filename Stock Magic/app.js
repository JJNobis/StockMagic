const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/JS
app.use(express.urlencoded({extended: true}));
app.use(cors());

// SQL Server config with Windows Authentication
const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'localhost',
    database: 'stockMagic',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};


app.post('/api/signUp', async (req, res) => {
    const {first, last, emailAddress, username, password, fundsAccount} = req.body;
    const bankAccount = 1234;
    try {
        await sql.connect(config);
                   await sql.query(`INSERT INTO users (fName, lName, email, username, password, funds, bankAccount ) VALUES 
                   ('${first}', '${last}', '${emailAddress}', '${username}', '${password}', '${fundsAccount}', '${bankAccount}')`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
