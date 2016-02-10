# pa-service
This repo, when green on CI, automatically deploys to https://pa-service-prod.herokuapp.com
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
