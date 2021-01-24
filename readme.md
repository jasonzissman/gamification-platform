# Gamification Platform
This project is a generic framework to enable gamification for other applications. It facilitates:

1. the definition of achievements and awards
2. the analysis of actions to determine in realtime if achievement rules have been met for entities (e.g. user).
3. notification when an achievement is fulfilled.
4. (Stretch Goal for later) Tracking of which entities have received which awards.

## Language and Vocabulary
* An `action` is an event that occurs in your application (e.g. user logs in).
* An `entity` is anything that can receive an award as actions occur (e.g. a user).
* An `achievement` is a rule describing some aggregation of actions performed (e.g. user logs in 5 times).
* An `award` is a prize given to an entity after they fulfill an achievement. (e.g. a badge)

## Example #1
Let's give an "Old-Timer" badge (the *award*) to any user (the *entity*) when they log in (the *action*) 5 times (the *achievement*).

First we invoke a REST API to define the login action definition. The response returns an ID for that action definition. 

    POST /action-definitions
    {
        name: "login"
    }

Next we use the achievements API to define the criteria for a user to qualify for this achievement.

    POST /achievements
    {
        name: "Log in 5 times",
        rule: {
            actionDefinitionId: 111,
            entitiesImpacted: ["user"],
            aggregationType: "count",
            aggregationMinValue: 5
        }
    }

Finally, our application invokes the following REST API any time a user logs in

    POST /actions
    {
        actionDefinitionId: 111,
        entities: {
            "user: "user-guid-1234"
        }
    }

## Triggering Multiple Achievements from the Same Event.
Let's define different achievements for different entities *that are triggered by the same event.* In this case, we will define two achievements:

1. Give a "Best-Selling Author" badge (the *award*) when a user (the *entity*) has their blog post viewed (the *action*) 100 times (the *achievement*), **AND**
2. Give a "Prolific Reader" badge (the *award*) when a user (the *entity*) reads blog posts (the *action*) 100 times (the *achievement*).

First we invoke the same REST API to define the blog-post-viewed action.

    POST /action-definitions
    {
        name: "blog-post-viewed"
    }

Next we use the achievements REST API to define the criteria for a user to qualify for either achievement. Notice that we indicate that one of two entities are within scope for the achievement - either the blog post viewer or the blog post author.

    POST /achievements
    {
        name: "View 100 blogs",
        rule: {
            actionDefinitionId: 777,
            entitiesImpacted: ["blog-post-viewer"],
            aggregationType: 'count',
            aggregationMinValue: 100
        }
    }

    POST /achievements
    {
        name: "Have your blogs viewed 100 times",
        rule: {
            actionDefinitionId: 777,
            entitiesImpacted: ["blog-post-author"],
            aggregationType: 'count',
            aggregationMinValue: 100
        }
    }

Finally, our application invokes the following REST API any time a user views a blog post. Notice that the same event contains two identifier sets: one for the blog viewer and one for the blog author.

    POST /actions
    {
        actionDefinitionId: 777,
        entities: {
            "blog-post-viewer":"user-1234",
            "blog-post-author":"user-5678"
        }
    }

## TODO - support to define awards (e.g. badges) for achievements

## TODO - support for more than one rule in achievement

## TODO - support other aggregations besides 'count'. Average? Sum? etc.

## TODO - support for non-event rewards such as "time spent in system"

## TODO - allow client to listening for award notifications

... how to best accomplish this? Subscribe? Websockets seem like overkill but might be necessary. What are typical subscriber patterns that we could use?

## TODO - REST API to see current status towards achievements

