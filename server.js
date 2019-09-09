const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).send('Server is working!!!')
})

server.get('/accounts', (req, res) => {
    db('accounts')
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            res.status(500).json(error);
        })
}); 

server.post('/accounts', validatePost, (req, res) => {
    db('accounts').insert(req.body, 'id')
        .then(([results]) => {
            res.status(200).json({message: `record of id ${results} added`});
        })
        .catch(error => {
            res.status(500).json(error);
        })
})

// middleware:
function validatePost(req, res, next) {
    if(!Object.keys(req.body).length) {
        res.status(400).json({message: 'missing post data'})
    } else {
        if (req.body.name && req.body.budget) {
            next();
        } else {
            res.status(400).json({message: 'missing name or budget fields'})
        }
    }
}

module.exports = server;