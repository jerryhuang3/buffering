# Buffering

Buffering is a Fitness app using Google Fit integration that punishes the user for not meeting their daily steps goal. Users must meet their steps goals for the past three days or their internet experience will suffer.

Created in collaboration with [Aleksey Van Leeuwarden](https://github.com/VanLeeuwarden) and [Matt Davey](https://github.com/MattTurnip).

## Testing Live App on Heroku

Download the `chrome_extension_prod` folder onto your computer. Go to chrome://extensions/ and turn on developer mode. On the top left, click 'Load unpacked', select the downloaded folder to turn on the extension.

Sign up with your Google credentials at https://buffrng.herokuapp.com and set your initial step goal to any number you like.

If you do not use Google Fit, you will have no step data associated with your account. You can demo the app on the Demo page by manually setting your desired experience status.

## Final Product

Buffering landing page. 
!["Buffering Home Page"](https://github.com/jerryhuang3/buffering/blob/master/docs/home.png)

Profile page.
!["Profile Page"](https://github.com/jerryhuang3/buffering/blob/master/docs/profile.gif)

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

## Setting up Development Environment

1. Clone the repo to your local machine and install dependencies. You must have node installed on your system.

```
git clone git@github.com:jerryhuang3/buffering.git
cd buffering
npm install
```

2. Set up Google API OAuth credentials at https://console.developers.google.com/apis/credentials. You must be logged into Google to view this.
3. Click on the "Create credentials" dropdown menu and select OAuth client id.
4. Choose Web application for the "Application type". You can set the Name to whatever you want.
5. Set "Authorized JavaScript origins" and "Authorized redirect URIs" to http://localhost:3000 and create your client.
6. Save the Client ID and Client Secret in the .env file provided. Your .env file should look like this:

```
CLIENT_ID={your client ID without curly brackets}
CLIENT_SECRET={your client secret without curly brackets}
SCOPES=https://www.googleapis.com/auth/fitness.activity.read
REDIRECT_URI=http://localhost:3000
DB_HOST=localhost
DB_USER=coolkid
DB_PASS=coolkid
DB_NAME=buffering
DB_PORT=5432
PORT=3000
```

8. Add a SESSION_KEY variable with any value in the .env file to use for server cookies.

```
SESSION_KEY={your session key without curly brackets}
```

7. Make sure PostgreSQL is installed on your system. Go into the PG terminal with the command `psql`. Then create the database with the following commands:

```
create role coolkid with login password 'coolkid';
create database buffering with owner coolkid;
```

8. Exit the psql terminal and run `knex migrate:latest`
9. Start the server.

```
npm run dev
```

10. Go to localhost:3000 on your Chrome browser.

## Using Chrome Extension in Development

Go to chrome://extensions/ and turn on developer mode. On the top left, click 'Load unpacked', select the folder chrome_extension_dev from this repo, and turn on the extension.

On your dev server, sign up (or log in) to your Google account and allow the Google Fit API to access your data. If you do not have any data, your step count will automatically be at 0. Based on the goals you set initially, the extension should alter most websites that you are visiting.
