import React from 'react';
import { connect } from 'react-redux';
import { db } from '../index';
import store from "../store";
import { get, set } from "automate-redux";
import { logout } from "../utils";
import { cond } from "space-api";

import { Row, Col, Card, Button, Form, Icon, Input, notification } from 'antd';

const WrappedDevice1 = Form.create({ name: 'device1' })(
  class Device1 extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.updateDevice(values.voltage1, values.current1);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('voltage1', {
              rules: [{ required: true, message: 'Please input the Voltage value!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.voltage
            })(
              <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Voltage" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('current1', {
              rules: [{ required: true, message: 'Please input the Current value!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.current
            })(
              <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Current" />
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
          this.props.updateDevice(values.voltage2, values.current2);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('voltage2', {
              rules: [{ required: true, message: 'Please input the Voltage value!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.voltage
            })(
              <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Voltage" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('current2', {
              rules: [{ required: true, message: 'Please input the Current value!' }],
              initialValue: this.props.info === undefined ? '' : this.props.info.current
            })(
              <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Current" />
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

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onMount()
  }

  componentWillUnmount() {
    this.props.onUnMount()
  }

  render() {
    const device1Info = this.props.devices.find(device => device._id == '1')
    const device2Info = this.props.devices.find(device => device._id == '2')
    return (
      <Row>
        <div className="topbar" style={{ display: 'flex', padding: '20px 80px', justifyContent: 'space-between' }}>
          <h2>FYP | User</h2>
          <Button onClick={() => logout(this.props.userName)}>Logout</Button>
        </div>
        {/* <Col xs={{ span: 12, offset: 6 }}>
          <br />
          <h2>Change Values of Device 1</h2>
          <br />
          <WrappedDevice1 updateDevice={this.props.updateDevice1} info={device1Info} />
          <br />
          <h2>Change Values of Device 2</h2>
          <br />
          <WrappedDevice2 updateDevice={this.props.updateDevice2} info={device2Info} />
        </Col> */}
        <Col xs={{ span: 12, offset: 6 }}>
          <br />
          <h2>Device 1 Readings!</h2>
          <br />
          <Col xs={{ span: 10, offset: 0 }}>
            <Card>
              <h3>Voltage: {device1Info === undefined ? '' : device1Info.voltage} Volts</h3>
            </Card>
          </Col>
          <Col xs={{ span: 10, offset: 2 }}>
            <Card>
              <h3>Current: {device1Info === undefined ? '' : device1Info.current} Ampere</h3>
            </Card>
          </Col>
        </Col>
        <Col xs={{ span: 12, offset: 6 }}>
          <br /><br />
          <h2>Device 2 Readings!</h2>
          <br />
          <Col xs={{ span: 10, offset: 0 }}>
            <Card>
              <h3>Voltage: {device2Info === undefined ? '' : device2Info.voltage} Volts</h3>
            </Card>
          </Col>
          <Col xs={{ span: 10, offset: 2 }}>
            <Card>
              <h3>Current: {device2Info === undefined ? '' : device2Info.current} Ampere</h3>
            </Card>
          </Col>
        </Col>
      </Row>
    )
  }
}

let unsubscribe = null

// Callback for data changes
const onSnapshot = (drafts, type) => {
  console.log('values:', drafts)
  store.dispatch(set("devices", drafts))
}

// Callback for error while subscribing
const onError = (err) => {
  console.log('Live query error', err)
}

const mapStateToProps = (state) => {
  return {
    devices: get(state, "devices", [])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateDevice1: (voltage, current) => {
      db.updateOne("values")
        .where(cond('_id', '==', '1'))
        .set({ voltage: voltage, current: current }).apply()
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
    updateDevice2: (voltage, current) => {
      db.updateOne("values")
        .where(cond('_id', '==', '2'))
        .set({ voltage: voltage, current: current }).apply()
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
      unsubscribe = db.liveQuery("values").subscribe(onSnapshot, onError);
    },
    onUnMount: () => {
      unsubscribe()
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User)