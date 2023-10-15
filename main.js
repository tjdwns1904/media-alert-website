import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

function students(state = [], action) {
  if (action.type == 'FETCH_STUDENT_SUCCESS') {
    return action.payload
  }
  else if (action.type == 'ADD_STUDENT') {
    console.log(action.payload)
    return [...state, action.payload]
  } else if (action.type === 'DELETE_STUDENT') { //by id now
    return state.filter((s) => s._id !== action.payload)
  }
  else {
    return state
  }
}
function games(state = [], action) {
  if (action.type == 'FETCH_GAME') {
    return action.payload
  } else {
    return state
  }
}

const movies = (state = [], action) => action && action.type === 'FETCH_MOVIES' ? action.payload : state;

//Always has to initialize this, otherwise it will inject a undefined to edit form
function editedStudent(state = { id: '', name: '', age: '' }, action) {
  if (action.type === 'EDIT_STUDENT') {
    return action.payload
  }
  else return state
}

export function fetchStudent() {
  return function (dispatch) {
    fetch('http://bestlab.us:8080/students')
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {

        console.log(data)
        dispatch({
          type: 'FETCH_STUDENT_SUCCESS',
          payload: data
        })
      })
  }
}

export function addStudent(student) {
  return function (dispatch) {
    fetch('http://bestlab.us:8080/students', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(student)
    })
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        dispatch({
          type: 'ADD_STUDENT',
          payload: data
        })
      })
  }
}

export function updateStudent(student) {
  return function (dispatch) {
    fetch('http://bestlab.us:8080/students', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(student)
    })
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        dispatch(fetchStudent())
      })
  }
}

export function deleteStudent(id) {
  return function (dispatch) {
    fetch('http://bestlab.us:8080/students/' + id, {
      method: 'delete'
    })
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        dispatch({
          type: 'DELETE_STUDENT',
          payload: id
        })
      })
  }
}

export function getStudent(id) {
  return function (dispatch) {
    fetch('http://bestlab.us:8080/students/' + id)
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        dispatch({
          type: 'EDIT_STUDENT',
          payload: data
        })
      })
  }
}

var centralState = combineReducers({
  games,
  movies,
})

var logging = store => next => action => {
  console.log(action.type)
}

var store = createStore(centralState, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('app')

)