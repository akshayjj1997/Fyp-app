import React from 'react';
import { connect } from 'react-redux';
import { db } from '../index';
import { get, set } from "automate-redux";
import { logout } from "../utils";
import { cond } from "space-api";

import { Row, Col, Form, Icon, Input, Button, notification } from 'antd';

const WrappedDevice1 = Form.create({ name: 'device1' })(
  class Device1 extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.updateDevice(values.ip_add1, values.slave_add1);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('ip_add1', {
              rules: [{ required: true, message: 'Please input the IP Address!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.ip_add
            })(
              <Input prefix={<Icon type="wifi" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="IP Address" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('slave_add1', {
              rules: [{ required: true, message: 'Please input the Slave Address!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.slave_add
            })(
              <Input prefix={<Icon type="wifi" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="Slave Address" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

const WrappedDevice2 = Form.create({ name: 'device2' })(
  class Device2 extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.updateDevice(values.ip_add2, values.slave_add2);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('ip_add2', {
              rules: [{ required: true, message: 'Please input the IP Address!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.ip_add
            })(
              <Input prefix={<Icon type="wifi" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="IP Address" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('slave_add2', {
              rules: [{ required: true, message: 'Please input the Slave Address!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.slave_add
            })(
              <Input prefix={<Icon type="wifi" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="Slave Address" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

class Admin extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onMount()
  }

  render() {
    return (
      <Row>
        <div className="topbar" style={{ display: 'flex', padding: '20px 80px', justifyContent: 'space-between' }}>
          <h2>FYP | Admin</h2>
          <Button onClick={() => logout()}>Logout</Button>
        </div>
        <Col xs={{ span: 12, offset: 6 }}>
          <br />
          <h2>Change Location of Device 1</h2>
          <br />
          <WrappedDevice1 updateDevice={this.props.updateDevice1} info={this.props.devices.find(device => device._id == '1')} />
          <br />
          <h2>Change Location of Device 2</h2>
          <br />
          <WrappedDevice2 updateDevice={this.props.updateDevice2} info={this.props.devices.find(device => device._id == '2')} />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    devices: get(state, "devices", [])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateDevice1: (ip_add, slave_add) => {
      db.updateOne("devices")
        .where(cond('_id', '==', '1'))
        .set({ ip_add: ip_add, slave_add: slave_add }).apply()
        .then(res => {
          if (res.status === 200) {
            notification['success']({ message: 'Success!', description: 'Device 1 info updated' })
            return;
          }
        }).catch(ex => {
          // Exception occured while processing request
          notification['error']({ message: 'Failed!', description: 'Something went wrong' })
        });
    },
    updateDevice2: (ip_add, slave_add) => {
      db.updateOne("devices")
        .where(cond('_id', '==', '2'))
        .set({ ip_add: ip_add, slave_add: slave_add }).apply()
        .then(res => {
          if (res.status === 200) {
            notification['success']({ message: 'Success!', description: 'Device 2 info updated' })
            return;
          }
        }).catch(ex => {
          // Exception occured while processing request
          notification['error']({ message: 'Failed!', description: 'Something went wrong' })
        });
    },
    onMount: () => {
      db.get("devices").apply().then(res => {
        if (res.status === 200) {
          // res.data.result contains the documents returned by the database
          dispatch(set('devices', res.data.result))
          return;
        }
      }).catch(ex => {
        notification['error']({ message: 'Failed!', description: 'Something went wrong' })
      });
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Admin)