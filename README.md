# pa-service

The "production" version of this repo is https://github.com/project-awesome/pa-service 
* When the production version is green on Travis-CI, at: https://travis-ci.org/project-awesome/pa-service
* Then the app automatically deploys to https://pa-service-prod.herokuapp.com
 
If/when you fork this repo, you are encouraged to set up your own Travis-CI and Heroku hooks. If you set up your own heroku application for your fork, take note of the environment variables section below.

# Environment Varaiables
Since we aren't making releases of project-awesome, we need to make sure that heroku doesn't cache the code from the project-awesome/project-awesome repository. To prevent caching, we set the environment variable `NODE_MODULES_CACHE` to `false`. This is only a temporary fix. In the future we should be making releases and updating the project-awesome version in package.json.

# Developer Workflow
* Fork https://github.com/project-awesome/pa-service repo to your own personal github
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

http://localhost:5000/v1/...

Where ... is whatever url you are looking for.

# Some things to try:

These are GET requests, so you can test them by just putting 
this URL directly in the browser:

* http://localhost:5000/v1/list?type=questionType
* http://localhost:5000/v1/check?type=seed&value=ABCD1234
* http://localhost:5000/v1/check?type=questionType&value=paq-fr-multiple-choice

These are POST, so you may have to do something different
(TBD: write how to test this...)

* http://localhost:5000/v1/generate?type=json&seed=ABCD1234
* http://localhost:5000/v1/generate?type=moodleXML&seed=ABCD1234

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
