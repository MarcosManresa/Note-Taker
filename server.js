const Port = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');

const express = require('express');
const apple = express();

const notesAll = require('./db/db.json');

apple.use(express.urlencoded({extended: true}));
apple.use(express.json());
apple.use(express.static('public'));

apple.get('/api/notes', (req, res) => {
    res.json(notesAll.slice(1));
});

apple.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

apple.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

apple.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function aquireNew(body, notesArray){
    const noteNew = body;
    if (!Array.isArray(notesArray))
        notesArray =[];

    if (notesArray.legnth === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(noteNew);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return noteNew;
}

apple.post('/api/notes', (req,res) => {
    const noteNew = aquireNew(req.body, notesAll);
    res.json(noteNew);
});

function noteDelete(id, notesArray){
    for( let i = 0; i < notesArray.length; i++){
        let nate = notesArray[i];

        if(nate.id == id){
            notesArray.splice(i , 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null , 2)
            );

            break;
        }
    }
}

apple.delete('/api/notes/:id', (req, res) => {
    noteDelete(req.params.id, notesAll);
    res.json(true);
});

apple.listen(Port, () => {
    console.log(`API server is available on port ${Port}!`);
});