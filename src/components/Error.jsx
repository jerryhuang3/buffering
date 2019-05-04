import React from 'react';

export const Error = () => {
  return (
    <div>
      <br />
      <br />
      <p>You are attempting to get {window.location.pathname}</p>
      <p>THIS PAGE DOES NOT FREAKIN EXIST DUDE</p>
      <img src="https://pics.me.me/you-are-one-stupid-motherfucker-memes-com-17945257.png" />
    </div>
  );
};

export const EmailExists = () => {
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-400">
          <h3>Oops! The email you used already exists!</h3>
          <h1>
            <span>4</span>
            <span>0</span>
            <span>0</span>
          </h1>
        </div>
        <br />
        <br />
        <br />
        <h2>
          <a href="/signup">Back to Signup Page</a>
        </h2>
      </div>
    </div>
  );
};

export const WrongLogin = () => {
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-400">
          <h3>Oops! The email or password you entered is incorrect!</h3>
          <h1>
            <span>4</span>
            <span>0</span>
            <span>0</span>
          </h1>
        </div>
        <br />
        <br />
        <br />
        <h2>
          <a href="/login">Back to Login Page</a>
        </h2>
      </div>
    </div>
  );
};
