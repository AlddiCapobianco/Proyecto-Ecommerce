let productos = [];

let mysql = require("mysql");

const express = require("express");
const app = express();
app.use(express.json());

const path = require('path');

app.use(express.static('segufer'));
app.use('/segufer', express.static('segufer'));


app.get('/ferreteria/', (req, res) => {
    let connection = mysql.createConnection({
        host:'localhost',
        user: 'Aldana',
        password: 'aldana',
        database: 'segufer'
    })
    
    connection.connect((err) => {
        if (err) throw err;
        console.log("Conexion satisfactoria a la base de datos Segufer");
    })
    
    connection.query('SELECT * FROM ferreteria', (err, rows) => {
        if (err) throw err;
    
        productos = rows;

        res.json(productos);
    })
    
    connection.end();
});

app.get('/ferreteria/:id', (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(produ => produ.id === id);
    res.json(producto);
});

app.delete('/ferreteria/:id', (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(produ => produ.id === id);
    productos = productos.filter(produ => produ.id !== id);
    res.json(productos);
});

app.post('/ferreteria/', (req, res) => {
    const producto = req.body;
    res.json(producto);
    productos.push(producto);
})

const port = 3001;
app.listen(port);
console.log(`Server is running on port ${port}`);