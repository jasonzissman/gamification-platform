# Gamification Platform
This project is a generic framework to enable gamification for other applications. It facilitates:

1. the definition of achievements and awards
2. the analysis of actions to determine in realtime if achievement rules have been met for entities (e.g. user).
3. notification when an achievement is fulfilled.
4. (Stretch Goal for later) Tracking of which entities have received which awards.

## Language and Vocabulary

* An `action` is an event that occurs in your application (e.g. user logs in).
* An `entity` is anything that can receive an award as actions occur (e.g. a user).
* An `achievement` is a set of rules describing some aggregration of actions performed (e.g. user logs in 5 times).
* An `award` is a prize give to an entity after they fulfill an achievement. (e.g. "Old-Timer" badge)

## Example #1
Let's give an "Old-Timer" badge (the *award*) to any user (the *entity*) when they log in (the *action*) 5 times (the *achievement*).

First we invoke a REST API to define the login action. The response returns an ID for the action definition. 

    ## Request
    POST /action-definitions
    {
        name: "login",
        entitiesImpacted: ["user"]
    }

    ## Response
    {
        actionDefinitionId: 111
    }

Next we invoke a different REST API to define an "Old-Timer" award. The response returns an ID for the award.

    POST /awards
    {
        name: "Old-Timer",
        description: "Log into MY_COOL_APP at least 5 times."
    }

    ## Response
    {
        awardId: 222
    }

Next we use the achievements REST API to define the criteria for a user to qualify for this award.

    POST /achievements
    {
        name: "Log in 5 times",
        rules: [
            {
                actionDefinitionId: 111,
                entitiesImpacted: ["user"],
                aggregrationType: 'sum',
                aggregrationMinValue: 5
            }
        ],
        awards: [222]
    }

Finally, our application invokes the following REST API any time a user logs in

    POST /actions
    {
        actionDefinitionId: 111,
        entities: {
            "user: "user-guid-1234"
        }
    }

## Example #2
You can give a "Best-Selling Author" badge (the *award*) when a user (the *entity*) has their blog post viewed (the *action*) 100 times (the *achievement*).

First we invoke a REST API to define the blog-post-viewed action. The response returns an ID for the action definition. 

    ## Request
    POST /action-definitions
    {
        name: "blog-post-viewed",
        entitiesImpacted: ["blog-post-author"]
    }

    ## Response
    {
        actionDefinitionId: 777
    }

Next we invoke a different REST API to define an "Best-Selling Author" award. The response returns an ID for the award.

    POST /awards
    {
        name: "Best-Selling Author",
        description: "Have one of your blog posts viewed at least 100 times."
    }

    ## Response
    {
        awardId: 888
    }

Next we use the achievements REST API to define the criteria for a user to qualify for this award.

    POST /achievements
    {
        name: "Have blog post viewed 100 times",
        rules: [
            {
                actionDefinitionId: 777,
                entitiesImpacted: ["blog-post-author"],
                aggregrationType: 'sum',
                aggregrationMinValue: 100
            }
        ],
        awards: [888]
    }

Finally, our application invokes the following REST API any time a user views a blog post:

    POST /actions
    {
        actionDefinitionId: 777,
        entities: {
            "blog-post-author":"author-5678"
        }
    }

## Example #3
Let's build on top of our previous example and define different awards for different entities *that are triggered by the same event.* In this case, we will define two achievements:

1. Give a "Best-Selling Author" badge (the *award*) when a user (the *entity*) has their blog post viewed (the *action*) 100 times (the *achievement*), **AND**
2. Give a "Prolific Reader" badge (the *award*) when a user (the *entity*) reads blog posts (the *action*) 100 times (the *achievement*).

First we invoke a REST API to define the blog-post-viewed action. In this case we indicate that two entities are impacted by this action - the blog post viewer and the blog post author.

    ## Request
    POST /action-definitions
    {
        name: "blog-post-viewed",
        entitiesImpacted: ["blog-post-viewer","blog-post-author"]
    }

    ## Response
    {
        actionDefinitionId: 777
    }

Next we invoke the REST API to define two awards: "Best-Selling Author" and "Prolific Reader".

    POST /awards
    {
        name: "Best-Selling Author",
        description: "Have one of your blog posts viewed at least 100 times."
    }

    POST /awards
    {
        name: "Prolific Reader",
        description: "Read at least 100 Blog Posts."
    }


Next we use the achievements REST API to define the criteria for a user to qualify for either award.

    POST /achievements
    {
        name: "Author a blog post that is viewed 100 times",
        rules: [
            {
                actionDefinitionId: 777,
                entitiesImpacted: ["blog-post-author"],
                aggregrationType: 'sum',
                aggregrationMinValue: 100
            }
        ],
        awards: [888]
    }

    POST /achievements
    {
        name: "View blog posts 100 times",
        rules: [
            {
                actionDefinitionId: 777,
                entitiesImpacted: ["blog-post-viewer"],
                aggregrationType: 'sum',
                aggregrationMinValue: 100
            }
        ],
        awards: [999]
    }

Finally, our application invokes the following REST API any time a user views a blog post:

    POST /actions
    {
        actionDefinitionId: 777,
        entities: {
            "blog-post-viewer":"user-1234",
            "blog-post-author":"user-5678"
        }
    }

## Listening for Award Notifications

... how to best accomplish this? Subscribe? Websockets seem like overkill but might be necessary. What are typical subscriber patterns that we could use?

## See Current Status towards Achievements

GET /achievements?entity={entity_id}
