import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { db, api } from '../index';
import { set } from "automate-redux";

import { Row, Col, Form, Icon, Input, Button, notification } from 'antd';

const WrappedLoginForm = Form.create({ name: 'login' })(
  class LoginForm extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.login(values.username, values.password);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input the username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input the Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Row>
        <Col xs={{ span: 12, offset: 6 }}>
          <br />
          <h2>Enter the below credentials!</h2>
          <br />
          <WrappedLoginForm login={this.props.login} />
        </Col>
      </Row>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, pass) => {
      db.signIn(username, pass).then(res => {
        if (res.status === 404) {
          notification['error']({ message: 'Login failed', description: 'No user with the given email and password' })
          return
        }
        if (res.status === 500) {
          notification['error']({ message: 'Login failed', description: 'Internal server error' })
          return
        }
        if (res.status === 200) {
          const role = res.data.user.role;
          // Set the token id to enable operations of other modules
          api.setToken(res.data.token)
          dispatch(set('user', res.data.user))
          dispatch(set('token', res.data.token))
          if (role === 'admin') {
            history.push('/admin')
          }
          if (role === 'user') {
            history.push('/user')
          }
        }
      }).catch(ex => {
        // Exception occured while processing request
        notification['error']({ message: 'Login failed', description: 'Something went wrong' })
      });
    }
  };
};

export default connect(null, mapDispatchToProps)(Login)
