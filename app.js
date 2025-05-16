const express = require('express');
const path = require('path');
const app = express();
 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/JS
 
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
 
app.get('/api/stocks', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM Stocks');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
 
app.listen(3000, () => console.log('Server running on http://localhost:3000'));