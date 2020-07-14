import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './style.scss'
import { Input, Breadcrumb, Modal, Form } from 'antd';

class Usercenter extends Component {

    state = {
        active: '基本设置',
        pswModalShow: false,
        confirmDirty: false
    }

    activeChange = (value) => {
        this.setState({
            active: value
        })
    }

    pswModalShow = () => {
        this.setState({
            pswModalShow: true
        })
    }

    pswModalHidden = () => {
        // this.props.form.resetFields('pswold')
        // this.props.form.resetFields('pswnew')
        // this.props.form.resetFields('confirm')
        this.setState({
            pswModalShow: false
        })
    }

    pswChange = () => {

    }

    saveBaseInfo = () => {

    }

    render() {
        const { active, pswModalShow } = this.state

        return (
            <div className="page-usercenter">
                <Breadcrumb>
                    <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                </Breadcrumb>
                <div className="detail">
                    <div className="user-center-cont">
                        <div className="left">
                            <div className={active === '基本设置' ? "active" : ''} onClick={() => this.activeChange('基本设置')}>基本设置</div>
                            <div className={active === '安全设置' ? "active" : ''} onClick={() => this.activeChange('安全设置')}>安全设置</div>
                        </div>
                        <div className="right">
                            {
                                active === '基本设置' ?
                                    <div>
                                        <h3>基本设置</h3>
                                        <div>
                                            <Form labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} className="topForm">
                                                <Form.Item
                                                    label="用户名"
                                                    name="username"
                                                    rules={[{ required: true, message: '用户名不能为空' }]}
                                                >
                                                    <Input placeholder="请输入" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="手机号"
                                                    name="mobile"
                                                    rules={[{ required: true, message: '手机号不能为空' }]}
                                                >
                                                    <Input placeholder="请输入" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="邮箱"
                                                    name="email"
                                                    rules={[{ required: true, message: '邮箱不能为空' }]}
                                                >
                                                    <Input placeholder="请输入" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="所属单位"
                                                    name="department"
                                                    rules={[{ required: true, message: '所属单位不能为空' }]}
                                                >
                                                    <Input placeholder="请输入" />
                                                </Form.Item>
                                            </Form>
                                            <span className="btn" onClick={this.saveBaseInfo}>保存</span>
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                active === '安全设置' ?
                                    <div className="safe">
                                        <h3>安全设置</h3>
                                        <div>
                                            <span>账户密码</span>
                                            <div onClick={this.pswModalShow}>
                                                <i className="iconfont">&#xe75d;</i>
                                                <span>修改</span>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                        <Modal
                            className="feedbackModal"
                            title="密码修改"
                            visible={pswModalShow}
                            onOk={this.pswChange}
                            onCancel={this.pswModalHidden}
                            centered={true}
                            maskClosable={false}
                        >
                            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} className="pswForm">
                                <Form.Item
                                    label="原密码"
                                    name="pswold"
                                    rules={[{ required: true, message: '密码不能为空' }]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="请输入" />
                                </Form.Item>
                                <Form.Item
                                    label="新密码"
                                    name="pswnew"
                                    rules={[{ required: true, message: '密码不能为空' }]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="请输入" />
                                </Form.Item>
                                <Form.Item
                                    label="确认密码"
                                    name="confirm"
                                    rules={[
                                        { required: true, message: '密码不能为空' },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('pswnew') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('密码不一致');
                                            },
                                        })
                                    ]}
                                    dependencies={['pswnew']}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="请输入" />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default Usercenter;