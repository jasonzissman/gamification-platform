const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

////////////////////////////////////////////////////////////

let MEMORY_STORE = {
    "actionDefinitions": [],
    "awards": [],
    "achievements": [],
    "actions": []
};

////////////////////////////////////////////////////////////

app.post('/action-definitions', (req,res) => {

    // todo validate input here

    let newActionDefinition = {
        id: uuidv4(),
        name: req.body.name,
        entitiesImpacted: req.body.entitiesImpacted
    };
    MEMORY_STORE.actionDefinitions.push(newActionDefinition);

    res.send(newActionDefinition);
});


app.post('/awards', (req,res) => {

    // todo validate input here

    let newAward = {
        id: uuidv4(),
        name: req.body.name,
        description: req.body.description
    };
    MEMORY_STORE.awards.push(newAward);

    res.send(newAward);
});


app.post('/achievements', (req,res) => {

    // todo validate input here

    let newAchievement = {
        id: uuidv4(),
        awards: req.body.awards,
        rules: req.body.rules
    };
    MEMORY_STORE.achievements.push(newAchievement);

    res.send(newAchievement);
});

app.post('/actions', (req,res) => {

    // todo validate input here

    let newAction = {
        id: uuidv4(),
        actionDefinitionId: req.body.actionDefinitionId,
        entities: req.body.entities
    };
    MEMORY_STORE.actions.push(newAction);

    res.send(newAction);
});


//////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});