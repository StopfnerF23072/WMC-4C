'use strict';

import express from 'express';

let users = [
    {id: 1, name: 'Hans'},
    {id: 2, name: 'Susi'},
    {id: 3, name: 'Otto'},
];

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hallo, Fabian');
});

// http://localhost:3000/api/users
// app.get('/api/users', (req, res) => {
//     res.json(users);
// });

// .../api/users/2
// .../api/users?name=s
app.get('/api/users{/:id}', (req, res) => {

    const nameFilter = req.query.name?.toLowerCase();

    if(nameFilter){
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(nameFilter));
        if(filteredUsers.length === 0){
            res.sendStatus(404);
            return;
        }
        res.json(filteredUsers);
        return;
    }

    if(!req.params.id){
        res.json(users);
        return;
    }

    const id = +req.params.id;
    console.log(`/api/users/${id}`);
    
    const user = users.find((user) => user.id === id);

    if(!user){
        res.status(404).send(`no user found with id ${id}`);
        return;
    }
    res.json(user);
});

app.post('/api/users', (req, res) => {
    const username = req.body.name;
    let id = Math.max(...users.map((user) => user.id)) + 1;
    console.log(`name = ${username}`);
    users = [...users, {id, username}];
    res.status(201).json(users[users.length - 1]);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
