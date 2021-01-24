const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

////////////////////////////////////////////////////////////

let DATA_STORE = {
    "actionDefinitions": [],
    "awards": [],
    "achievements": [],
    "actions": [],
    "entities": {},
};

////////////////////////////////////////////////////////////

app.post('/action-definitions', (req, res) => {

    // todo validate input here

    let newActionDefinition = {
        id: uuidv4(),
        name: req.body.name
    };
    DATA_STORE.actionDefinitions.push(newActionDefinition);

    res.send(newActionDefinition);
});


app.post('/awards', (req, res) => {

    // todo validate input here

    let newAward = {
        id: uuidv4(),
        name: req.body.name,
        description: req.body.description
    };
    DATA_STORE.awards.push(newAward);

    res.send(newAward);
});


app.post('/achievements', (req, res) => {

    // todo validate input here

    let newAchievement = {
        id: uuidv4(),
        award: req.body.award,
        rules: [req.body.rule] // TODO - only allowing one rule for now
    };
    DATA_STORE.achievements.push(newAchievement);

    res.send(newAchievement);
});

app.post('/actions', (req, res) => {

    // todo validate input here

    const actionDefinitionId = req.body.actionDefinitionId;

    let newAction = {
        id: uuidv4(),
        actionDefinitionId: actionDefinitionId,
        entities: req.body.entities
    };
    DATA_STORE.actions.push(newAction);

    res.send(newAction);

    // Process for each impacted entity
    for (let entityType in newAction.entities) {
        
        // Get achievements related to this event
        let relevantAchievements = [];
        for (let achievement of DATA_STORE.achievements) {
            for (let rule of achievement.rules) {
                if (rule.actionDefinitionId == actionDefinitionId && rule.entitiesImpacted.indexOf(entityType) > -1) {
                    relevantAchievements.push(achievement);
                }
            }
        }

        // Get the user entity indicated in this event
        const entityId = newAction.entities[entityType];
        if (!DATA_STORE.entities[entityId]) {
            DATA_STORE.entities[entityId] = {
                "achievementProgress": {}
            };
        }

        for (let relevantAchievement of relevantAchievements) {
            if (!DATA_STORE.entities[entityId]["achievementProgress"][relevantAchievement.id]) {
                DATA_STORE.entities[entityId]["achievementProgress"][relevantAchievement.id] = {
                    "aggregationType": relevantAchievement.rules[0].aggregationType, // TODO enforcing just one rule for today
                    [relevantAchievement.rules[0].aggregationType]: 0 //TODO enforcing just one rule for today
                };
            }

            if (DATA_STORE.entities[entityId]["achievementProgress"][relevantAchievement.id]["aggregationType"] == "count") {
                DATA_STORE.entities[entityId]["achievementProgress"][relevantAchievement.id]["count"] += 1;
            }
        }
    }

});


//////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.json(DATA_STORE.entities);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});