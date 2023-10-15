import React, { useState, useRef, Fragment } from "react";
import { auth } from "./src/firebase.js";
import { firestore } from "./src/firebase.js";
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { get } from 'lodash';
import { generateUserDocument } from "./src/firebase.js"
import './authenticateStyles.css';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email1, setEmail1] = useState('');
  const [password1, setPassword1] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);



  const signInWithEmailAndPasswordHandler =
    (event, email, password) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password)
        .then(function (res) {
          const user = get(res, 'user');
          if (user && !user.emailVerified) {
            auth.signOut();
            alert("This email is not verified yet!");

          }
          else {
            alert("Sign in successfully!")
            window.location.href = '/';
          }
        })
        .catch(error => {
          setError("Error signing in with password and email!");
          console.error("Error signing in with password and email", error);
        });
    };
  const createUserWithEmailAndPasswordHandler = (event, email1, password1, confirmPassword) => {
    event.preventDefault();
    let firestore1 = firestore;
    if (password1.match(/[a-z]/g) && password1.match(
      /[A-Z]/g) && password1.match(
        /[0-9]/g) && password1.match(
          /[^a-zA-Z\d]/g) && password1.length >= 8
      && password1 === confirmPassword) {
      try {
        const { user } = auth.createUserWithEmailAndPassword(email1, password1)
          .then(function (user) {
            const uid = user.user.uid;
            const emailCreate = user.user.email;
            console.log(uid);
            console.log(emailCreate);
            const userRef = firestore.doc(`users/${uid}`);
            try {
              userRef.set({
                email: emailCreate,
                userType: "NORMAL"
              });
            } catch (error) {
              console.error("Error creating user document", error);
            }
            user.user.sendEmailVerification()
              .then(function () {
                alert("Sign up successfully, email verification sent!")
                auth.signOut();
              });
          })
          .catch(function (error) {
            setError("Error signing up with password and email!");
            console.error("Error signing up with password and email", error);
          });

      }
      catch (error) {
        setError('Error Signing up with email and password');
      }


    } else {
      alert("Your password did not satisfy the constraints!")
    }
    setEmail1("");
    setPassword1("");
    setConfirmPassword("");
  };



  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    }
    else if (name === 'userPassword') {
      setPassword(value);
    }
    else if (name === 'userEmail1') {
      setEmail1(value);
    }
    else if (name === 'userPassword1') {
      setPassword1(value);
    }
    else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };
  const [signUpActive, setSignUpActive] = useState(false);

  return (
    <CustomHeaderMenu
      activeSearchBar={false}
      childrenRender={(
        <div class={`container authen ${signUpActive ? 'right-panel-active' : ''}`} id="container">
          <div class="form-container sign-up-container">
            <form className="authen" action="#">
              <h1>Create Account</h1>
              <div class="social-container">
              </div>
              <span></span>
              <input
                type="email"
                name="userEmail1"
                value={email1}
                placeholder="Your Email"
                id="userEmail1"
                onChange={event => onChangeHandler(event)}
              />
              <input
                type="password"
                name="userPassword1"
                value={password1}
                placeholder="Your Password"
                id="userPassword1"
                onChange={event => onChangeHandler(event)}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number, one special character and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Password"
                id="confirmPassword"
                onChange={event => onChangeHandler(event)}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number and, one special character and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              />
              <button
                onClick={event => createUserWithEmailAndPasswordHandler(event, email1, password1, confirmPassword)}
              >
                Sign Up
              </button>
            </form>
          </div>
          <div class="form-container sign-in-container">
            <form className="authen" action="#">
              <h1>Sign in</h1>
              <div class="social-container">
              </div>
              <span></span>
              <input
                type="email"
                name="userEmail"
                value={email}
                placeholder="Your Email"
                id="userEmail"
                onChange={(event) => onChangeHandler(event)} />
              <input
                type="password"
                name="userPassword"
                value={password}
                placeholder="Your Password"
                id="userPassword"
                onChange={(event) => onChangeHandler(event)}
              />
              <a href="#">Forgot your password?</a>
              <button
                onClick={(event) => signInWithEmailAndPasswordHandler(event, email, password)}
              >
                Sign In
              </button>
            </form>
          </div>
          <div class="overlay-container">
            <div class="overlay">
              <div class="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button class="ghost" id="signIn" onClick={() => setSignUpActive(!signUpActive)}>Sign In</button>
              </div>
              <div class="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button class="ghost" id="signUp" onClick={() => setSignUpActive(!signUpActive)}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};
export default SignIn;
let styles = {
  SignIn: {
    position: 'relative',
    width: 650,
    float: 'Left'
  },
  SignUp: {
    position: 'relative',
    width: 650,
    float: 'Right'
  },
  Message: {
    position: 'relative',
    width: 640,
    float: "Left"
  }
}

