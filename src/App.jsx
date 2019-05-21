import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { db, api } from './index';
import { set } from "automate-redux";

import { notification } from 'antd';

import history from './history'
import Login from './components/Login';
import Admin from './components/Admin';
import User from './components/User';

class App extends Component {
  render() {
    //this.props.signup('admin', 'admin', '123', 'admin');
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/user" component={User} />
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (email, name, pass, role) => {
      db.signUp(email, name, pass, role).then(res => {
        if (res.status === 404) {
          notification['error']({ message: 'Signup failed', description: 'User already exists' })
          return
        }
        if (res.status === 401) {
          notification['error']({ message: 'Signup failed', description: 'Request was unauthenticated' })
          return
        }
        if (res.status === 403) {
          notification['error']({ message: 'Signup failed', description: 'Request was unauthorized' })
          return
        }
        if (res.status === 500) {
          notification['error']({ message: 'Signup failed', description: 'Internal server error' })
          return
        }
        if (res.status === 200) {
          console.log('here!')
          // Set the token id to enable operations of other modules
          api.setToken(res.data.token)
          dispatch(set('user', res.data.user))
          dispatch(set('token', res.data.token))
        }
      }).catch(ex => {
        // Exception occured while processing request
        notification['error']({ message: 'Signup failed', description: 'Something went wrong' })
      });
    }
  };
};

export default connect(null, mapDispatchToProps)(App)

//export default App;
