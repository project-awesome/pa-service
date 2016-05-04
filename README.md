# pa-service
  
The "production" version of this repo is https://github.com/project-awesome/pa-service 
* When the production version is green on Travis-CI, at: https://travis-ci.org/project-awesome/pa-service
* Then the app automatically deploys to https://pa-service-prod.herokuapp.com
 
If/when you fork this repo, you are encouraged to set up your own Travis-CI and Heroku hooks. If you set up your own heroku application for your fork, take note of the environment variables section below.

# Environment Varaiables
Since we aren't making releases of project-awesome, we need to make sure that heroku doesn't cache the code from the project-awesome/project-awesome repository. To prevent caching, we set the environment variable `NODE_MODULES_CACHE` to `false`. This is only a temporary fix. In the future we should be making releases and updating the project-awesome version in package.json.

# Developer Workflow
* Fork https://github.com/project-awesome/pa-service repo to your own personal github
* Run npm install
* Make your changes
* Test locally via `npm test`
* [Set up your own personal Travis CI](https://github.com/project-awesome/TEAM-DOCUMENTATION/blob/master/HOW-TO-TRAVIS-CI.md)
* Make sure your own personal Travis CI is green
* Do a pull request back to https://github.com/project-awesome/pa-service
# Testing
* CI: https://travis-ci.org/project-awesome/pa-service
* Interactive Testing: 
```
npm install
npm test
```
Before accepting a pull request to https://github.com/project-awesome/pa-service, CI should be green.

To run locally:

```
npm install
foreman start web

```

then check on localhost:5000

try:

http://localhost:5000/index.html (or on C9: http://workspaceName.userName.c9users.io/index.html)

from index, click on the button related to the function you'd like to test (check, list, generate, validate)

Sample quiz descriptors can be found here: https://github.com/project-awesome/project-awesome/tree/master/Examples

#### API TEST Actions:
- **LIST** all supported question types
 - input: `questionType`
 - returns: all supported question types.
- **CHECK** whether a seed is valid for the given question type.
  - inputs: 
    - lowercase hexidecimal seed, such as `abcd1234`,
    - a question type, such as `mc-change-of-base-5`
  - returns:
    - 
- **VALIDATE** whether a quiz descriptor is valid. 
  - inputs:
    - type: `qd` 
    - quiz desciptor [here are example quiz descriptors](https://github.com/project-awesome/project-awesome/tree/master/Examples)
  - returns: 
    - If there are no errors, empty json is returned
- **GENERATE** a quiz in a supported output format.
  - inputs:
    - quiz format (`json`, `moodleXML`, etc) 
    - a valid quiz descriptor
    - seed (`abcd1234`)
  - returns: 
    - a quiz descriptor in the format selectet

# Some things to try:

Check and List are GET requests, so you can alternatively test them by just putting 
this URL directly in the browser:

* http://localhost:5000/v1/list?type=questionType
* http://localhost:5000/v1/check?type=seed&value=ABCD1234
* http://localhost:5000/v1/check?type=questionType&value=paq-fr-multiple-choice

Generate and Validate are POST, so please use the index page to test them
* start a local instance of pa-service with `heroku local:start`
* navigate to `localhost:3000`
* To test generate, navigate to YourWebAddress/generate.html
* To test validate, navigate to YourWebAddress/validate.html

//* http://localhost:5000/v1/generate?type=json&seed=abcd1234
//* http://localhost:5000/v1/generate?type=moodleXML&seed=abcd1234

For generate, there is another parameter, the quiz descriptor.

qd is short for "quiz descriptor".

Example quiz descriptors can be found here:

* https://github.com/project-awesome/project-awesome/tree/master/Examples

Each qd describes how many question, of what types,
what parameters to the questions, and what order.

The qd value to generate is supplied via POST
parameter, because its great big and putting it in the
URL requires urlencoding it, which is hard to do by
hand, and taking a big long multi-line thing and
stripping out all the lines breaks.

# Debugging the production application (or apps on Heroku in general)

If you are using the production version at:

To see the logs, you can do:

```
heroku login
heroku logs --app pa-service-prod
```

Or, to see the log in a continuous stream, use:

```
heroku logs --app pa-service-prod --tail
```


You may need to request to be added as a "collaborator" on the pa-service-prod Heroku application.  Ask another developer that has access to add you.
