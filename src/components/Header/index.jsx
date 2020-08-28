import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Menu, Dropdown } from 'antd';
import './index.scss'
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'
import request from '../../utils/request'
import API from '../../api/index'
import { deepCopy } from '../../utils/tools'

const { SubMenu } = Menu;

@inject("commonStore")
@observer
class Header extends Component {

    state = {
        current: '/persontract',
        open: ['sub1'],
        userinfo: null,
        count: null
    }

    menuClick = (e) => {
        this.setState({
            current: e.key
        })
        this.props.history.push(e.key);
    }

    openChange = (openKeys) => {
        this.setState({
            open: openKeys
        })
    }

    usermenuClick = (e) => {
        if (e.key === '/usercenter') {
            this.props.history.push(e.key)
        } else {
            request.delete(API.Login.logout)
                .then(res => {
                    if (res.success) {
                        sessionStorage.clear()
                        this.props.history.push('/login')
                    }
                })
        }
    }

    toLogin = () => {
        this.props.history.push('/login')
    }

    toRegister = () => {
        this.props.history.push('/register')
    }

    usermenu = (
        <Menu onClick={this.usermenuClick} className="user-menu">
            <Menu.Item key="/usercenter">
                <i className="iconfont">&#xe64c;</i>
                <span>个人中心</span>
            </Menu.Item>
            <Menu.Item key="/login">
                <i className="iconfont">&#xe686;</i>
                <span>退出登录</span>
            </Menu.Item>
        </Menu>
    );

    componentDidMount() {
        // 获取用户信息
        request.get(API.Login.info)
            .then(res => {
                if (res.success) {
                    this.props.commonStore.setUserinfo(deepCopy(res.data))
                    let info = toJS(this.props.commonStore.userinfo)
                    this.setState({
                        userinfo: info
                    })
                }
            })
        // 获取指令数量
        request.get(API.Common.count)
            .then(res => {
                this.props.commonStore.setCount(deepCopy(res.data))
                // let count = toJS(this.props.commonStore.count)
                // this.setState({
                //     count: count
                // })
            })
        let path = this.props.location.pathname.split('/')
        let pathname = this.props.location.pathname
        if (path[1] == "persontract" || path[1] == "person") {
            this.setState({
                open: ['sub1']
            })
        } else if (path[1].indexOf("instruct") > -1) {
            this.setState({
                open: ['sub2']
            })
        } else if (path[1] == "statperson" || path[1] == "statinstruction") {
            this.setState({
                open: ['sub3']
            })
        }
        this.setState({
            current: pathname
        })
    }

    componentDidUpdate() {
        const { current } = this.state
        let newpath = this.props.location.pathname
        if (current && current != newpath) {
            if (newpath.indexOf('/instruct/detail') == -1 && newpath.indexOf('person/detail') == -1 && newpath.indexOf('/persontract') == -1 && newpath.indexOf('/person') == -1) {
                this.setState({
                    current: newpath
                })
            }
        }
    }

    render() {
        const { current, open, userinfo } = this.state
        let count = toJS(this.props.commonStore.count)

        return (
            <div className="comp-header">
                <div className="left">
                    <div className="title">
                        <i className="iconfont">&#xe612;</i>
                        <div style={{ textAlign: "center" }}>
                            <h1>贵州省疫情社会防控</h1>
                            <h1>指挥调度系统</h1>
                        </div>
                    </div>
                    <Menu className="main-menu"
                        onClick={this.menuClick}
                        onOpenChange={this.openChange}
                        selectedKeys={[current]}
                        openKeys={open}
                        mode="inline"
                        theme="dark"
                    >
                        <SubMenu key="sub1" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe7b4;</i>} title="人员管理">
                            <Menu.Item key="/persontract">人员轨迹信息</Menu.Item>
                            <Menu.Item key="/person">人员基本信息</Menu.Item>
                        </SubMenu>
                        {
                            userinfo && userinfo.org && userinfo.org.org_level && userinfo.org.org_level == 1 &&
                            <SubMenu key="sub2" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe61c;</i>} title="指令管理">
                                <Menu.Item key="/instruct/pro/add">新增指令</Menu.Item>
                                <Menu.Item key="/instruct/pro/send">待发送 ( {count && count.created || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/pro/sign">已发送-待签收 ( {count && count.sentandunsigned || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/pro/fb">待反馈 ( {count && count.unanswered || 0} )</Menu.Item>
                                {/**
                                        <Menu.Item key="/instruct/pro/signfb">已反馈-待签收 ( {count && count.unfinished || 0} )</Menu.Item>
                                    */}
                                <Menu.Item key="/instruct/pro/done">已完成 ( {count && count.finished || 0} )</Menu.Item>
                                {/**
                                        <Menu.Item key="/instruct/pro/refuse">已反馈-已拒签 ( {count && count.denied || 0} )</Menu.Item>
                                    */}
                                <Menu.Item key="/instruct/pro/recall">已撤回 ( {count && count.withdrawn || 0} )</Menu.Item>
                            </SubMenu>
                        }
                        {
                            userinfo && userinfo.org && userinfo.org.org_level && userinfo.org.org_level == 2 &&
                            <SubMenu key="sub2" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe61c;</i>} title="指令管理">
                                <Menu.Item key="/instruct/city/sign">待签收 ( {count && count.sentandunsigned || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/city/fb">待反馈 ( {count && count.unanswered || 0} )</Menu.Item>
                                {/**
                                        <Menu.Item key="/instruct/city/signfb">已反馈-待签收 ( {count && count.unfinished || 0} )</Menu.Item>
                                    */}
                                <Menu.Item key="/instruct/city/done">已完成 ( {count && count.finished || 0} )</Menu.Item>
                                {/**
                                        <Menu.Item key="/instruct/city/refuse">已反馈-被拒签 ( {count && count.denied || 0} )</Menu.Item>
                                    */}
                            </SubMenu>
                        }
                        {
                            userinfo && userinfo.org && userinfo.org.org_level && userinfo.org.org_level == 3 &&
                            <SubMenu key="sub2" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe61c;</i>} title="指令管理">
                                <Menu.Item key="/instruct/county/fb">待反馈 ( {count && count.transfer || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/county/signfb">已反馈-待签收 ( {count && count.unfinished || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/county/refuse">已反馈-已拒签 ( {count && count.denied || 0} )</Menu.Item>
                                <Menu.Item key="/instruct/county/done">已完成 ( {count && count.finished || 0} )</Menu.Item>
                            </SubMenu>
                        }
                        <SubMenu key="sub3" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe63d;</i>} title="统计分析">
                            <Menu.Item key="/statperson">人员统计</Menu.Item>
                            <Menu.Item key="/statinstruction">指令统计</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="right">
                    {window.sessionStorage.getItem('token') ?
                        <Dropdown className="user" overlay={this.usermenu}>
                            <div style={{ cursor: "pointer" }}>
                                <i className="iconfont">&#xe7b1;</i>
                                <span>{userinfo && userinfo.user.username || '-'}</span>
                            </div>
                        </Dropdown>
                        :
                        <div className="user button">
                            <span onClick={this.toLogin}>登录</span>
                            {/** <span onClick={this.toRegister}>注册</span> */}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Header);