import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './style.scss'
import { Input, Form, Checkbox, message } from 'antd';
import request from '../../utils/request'
import API from '../../api/index'
import axios from "axios"
import { observer, inject } from 'mobx-react';

@inject("commonStore")
@observer
class Login extends Component {

    state = {
        height: document.body.clientWidth * 0.48125 * (585 / 924),
        count: {
            shuyu: 0,
            shuwang: 0,
            shusuan: 0,
            shuli: 0
        }
    }

    loginFormRef = React.createRef();

    login = () => {
        this.loginFormRef.current.validateFields()
            .then(values => {
                const formData = new FormData();
                formData.append("phone_num", values.username);
                formData.append("password", values.password);
                formData.append("client_id", 'command_control');
                if (values.remember === true) {
                    window.localStorage.setItem('psw', values.password)
                    window.localStorage.setItem('username', values.username)
                } else {
                    window.localStorage.removeItem('username')
                    window.localStorage.removeItem('psw')
                }
                axios.post(API.Login.login,
                    formData,
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                )
                    .then((response) => {
                        if (response.status == '200') {
                            window.sessionStorage.setItem("token", response.data.access_token)
                            this.props.history.push('/persontract')
                        }
                    })
                    .catch((error) => {
                        message.warning(error.response.data.detail || '出错了！')
                    })
            })
    }

    toRegister = () => {
        this.props.history.push('/register')
    }

    windowRisize = (e) => {
        let height = document.body.clientWidth * 0.48125 * (585 / 924)
        this.setState({
            height
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowRisize)
        this.loginFormRef.current.setFieldsValue({
            username: window.localStorage.getItem('username') || undefined,
            password: window.localStorage.getItem('psw') || undefined
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowRisize)
    }

    render() {

        return (
            <div className="page-login">
                <div className="logo">
                    贵州省疫情社会防控指挥调度系统
                </div>
                <div className="cont">
                    <div className="right">
                        <h3>登录</h3>
                        <p>输入正确的用户名与密码即可登录 </p>
                        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 25 }}
                            className="loginForm"
                            ref={this.loginFormRef}
                        >
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
                                    placeholder="请输入登录密码"
                                    onPressEnter={this.login}
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="remember"
                                valuePropName='checked'
                                initialValue={true}
                            >
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                        </Form>
                        <div className="btn" onClick={this.login}>登录</div>
                        {/** <div className="toRegister">没有账户？<span onClick={this.toRegister}>去注册</span></div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;