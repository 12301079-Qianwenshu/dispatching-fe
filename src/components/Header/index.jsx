import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Menu, Dropdown } from 'antd';
import './index.scss'

const { SubMenu } = Menu;

export default function Header(props) {
    let history = useHistory();
    const [current, setCurrent] = useState('/persontract');
    const [open, setOpen] = useState(['sub1']);

    useEffect(() => {
        let path = history.location.pathname.split('/')
        setCurrent(`/${path[1]}`)
    });

    useEffect(() => {
        let path = history.location.pathname.split('/')
        if (path[1] == "persontract" || path[1] == "person") {
            setOpen(['sub1'])
        } else if (path[1] == "statperson" || path[1] == "statinstruction") {
            setOpen(['sub2'])
        }
    }, []);

    let menuClick = (e) => {
        setCurrent(e.key)
        history.push(e.key);
    }

    let openChange = (openKeys) => {
        setOpen(openKeys)
    }

    let usermenuClick = (e) => {
        if (e.key === '/usercenter') {
            history.push(e.key)
        } else {
            // TODO 退出登录后后转到登录页
        }
    }

    let toLogin = () => {
        history.push('/login')
    }

    let toRegister = () => {
        history.push('/register')
    }

    const usermenu = (
        <Menu onClick={usermenuClick} className="user-menu">
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


    return (
        <div className="comp-header">
            <div className="left">
                <div className="title">
                    <i className="iconfont">&#xe612;</i>
                    <h1>指挥调度系统</h1>
                </div>
                <Menu className="main-menu"
                    onClick={menuClick}
                    onOpenChange={openChange}
                    selectedKeys={[current]}
                    openKeys={open}
                    mode="inline"
                    theme="dark"
                >
                    <SubMenu key="sub1" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe7b4;</i>} title="人员管理">
                        <Menu.Item key="/persontract">人员轨迹信息</Menu.Item>
                        <Menu.Item key="/person">人员基本信息</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/instruction">
                        <i className="iconfont" style={{ marginRight: '8px' }}>&#xe61c;</i>
                        指令管理
                    </Menu.Item>
                    <SubMenu key="sub2" icon={<i className="iconfont" style={{ marginRight: '8px' }}>&#xe63d;</i>} title="统计分析">
                        <Menu.Item key="/statperson">人员统计</Menu.Item>
                        <Menu.Item key="/statinstruction">指令统计</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
            <div className="right">
                {window.sessionStorage.getItem('token') ?
                    <Dropdown className="user" overlay={usermenu}>
                        <div>
                            <i className="iconfont">&#xe7b1;</i>
                            <span>用户名</span>
                        </div>
                    </Dropdown>
                    :
                    <div className="user button">
                        <span onClick={toLogin}>登录</span>
                        <span onClick={toRegister}>注册</span>
                    </div>
                }
            </div>
        </div>
    )
}