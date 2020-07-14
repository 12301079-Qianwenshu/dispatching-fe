/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2019-09-06 18:20:31
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-02 14:43:01
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './style.scss'
import { Input, Form, Checkbox, message } from 'antd';

class Register extends Component {

    state = {
        height: document.body.clientWidth * 0.48125 * (585 / 924),
        confirmDirty: false
    }

    toLogin = () => {
        this.props.history.push('/login')
    }

    register = () => {
        // this.props.form.validateFields(['username', 'password', 'telephone', 'email', 'department'], (err, values) => {
        //     if (!err) {
        //         LoginService.register(values).then(res => {
        //             if (res.status === 500) {
        //                 message.warning(res.data.detail);
        //             } else {
        //                 message.success(res.data.detail);
        //                 this.props.history.push('/platform/login')
        //             }
        //         })
        //     }
        // });
    }

    windowRisize = (e) => {
        let height = document.body.clientWidth * 0.48125 * (585 / 924)
        this.setState({
            height
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowRisize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowRisize)
    }

    render() {
        const { height } = this.state

        return (
            <div className="page-register">
                <div className="logo">
                    指挥调度系统
                </div>
                <div className="cont">
                    <div className="right">
                        <h3>注册</h3>
                        <p>注册账号后即可以登录</p>
                        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 25 }} className="loginForm">
                            <Form.Item
                                label=""
                                name="username"
                                rules={[{ required: true, message: '用户名不能为空' }]}
                            >
                                <Input
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe7b1;</i>}
                                    placeholder="请输入用户名"
                                />
                            </Form.Item>
                            <Form.Item
                                hasFeedback
                                label=""
                                name="password"
                                rules={[{ required: true, message: '密码不能为空' }]}
                            >
                                <Input.Password
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe7b6;</i>}
                                    placeholder="6 - 16位密码，区分大小写"
                                />
                            </Form.Item>
                            <Form.Item
                                hasFeedback
                                label=""
                                name="confirm"
                                rules={[
                                    { required: true, message: '密码不能为空' },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('密码不一致');
                                        },
                                    }),
                                ]}
                                dependencies={['password']}
                            >
                                <Input.Password
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe7b6;</i>}
                                    placeholder="确认密码"
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="telephone"
                                rules={[{ required: true, message: '手机号不能为空' }]}
                            >
                                <Input
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe66e;</i>}
                                    placeholder="请输入手机号"
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="email"
                                rules={[{ required: true, message: '邮箱不能为空' }]}
                            >
                                <Input
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe6cf;</i>}
                                    placeholder="请输入邮箱"
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="department"
                                rules={[{ required: true, message: '所属单位不能为空' }]}
                            >
                                <Input
                                    prefix={<i className="iconfont" style={{ color: 'rgba(0,0,0,.25)' }}>&#xe64d;</i>}
                                    placeholder="请输入所属单位"
                                />
                            </Form.Item>
                        </Form>
                        <div className="btn" onClick={this.register}>注册</div>
                        <div className="toRegister"><span onClick={this.toLogin}>使用已有账号登录</span></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;