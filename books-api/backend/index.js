'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use((req, res, next) => {
    const allowedOrigins = new Set([
        'http://localhost:4200',
        'http://127.0.0.1:4200',
    ]);
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
});
app.use(express.json());

const csvPath = path.join(__dirname, 'books.csv');

const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.trim().split(/\r?\n/);

let books = lines.slice(1).map((line) => {
    const [id, title, author, year] = line.split(',');

    return {
        id: Number(id),
        title,
        author,
        year: Number(year),
    };
});

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((item) => item.id === id);

    if (!book) {
        res.status(404).send(`No book found with id ${id}`);
        return;
    }

    res.json(book);
});

app.post('/books', (req, res) => {
    const id = Math.max(0, ...books.map((book) => book.id)) + 1;
    const book = {
        id,
        title: req.body.title,
        author: req.body.author,
        year: Number(req.body.year),
    };

    books.push(book);
    res.status(201).json(book);
});

app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        res.status(404).send(`No book found with id ${id}`);
        return;
    }

    books[index] = {
        ...books[index],
        ...req.body,
        id,
        year: req.body.year !== undefined ? Number(req.body.year) : books[index].year,
    };

    res.json(books[index]);
});

app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        res.status(404).send(`No book found with id ${id}`);
        return;
    }

    books.splice(index, 1);
    res.sendStatus(204);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});