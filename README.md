# Buffering

Buffering is a Fitness app using Google Fit integration that punishes the user for not meeting their daily steps goal. Users must meet their steps goals for the past three days or their internet experience will suffer.

Created in collaboration with [Aleksey Van Leeuwarden](https://github.com/VanLeeuwarden) and [Matt Davey](https://github.com/MattTurnip).

## Final Product
Buffering landing page. Requires user to either log in or register.
!["Buffering Home Page"](https://github.com/jerryhuang3/buffering/blob/master/docs/buffering%20home.png)

User experience if goal is not met at all the past 3 days.
!["User with Hell status"](https://github.com/jerryhuang3/buffering/blob/master/docs/bufferinghell.gif)

User experience if goal is not met 2 out of the past 3 days.
!["User in Awful status"](https://github.com/jerryhuang3/buffering/blob/master/docs/bufferingawful.gif)

## Dependencies

- React
- React-router
- Express
- Knex
- Postgres
- JQuery
- Moment
- Bcrypt
- Cookie-session
- Chart JS
- Semantic UI

## Starting the dev server

Clone the repo to your local machine.
```
git clone git@github.com:jerryhuang3/buffering.git
cd buffering
```
Install the dependencies and start the server.
```
npm install
npm run dev
```

go to http://localhost:3000


## Using the Chrome Extension

Go to chrome://extensions/ and turn on developer mode. On the top left, click 'Load unpacked', select the folder chrome_extension from this repo, and turn on the extension. 

On your dev server, sign up (or log in) to your Google account and allow the Google Fit API to access your data. If you do not have any data, your step count will automatically be at 0. Based on the goals you set initially, the extension should alter most websites that you are visiting.

