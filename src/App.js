/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-26 10:21:03
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-16 10:07:14
 */
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import Layout from './pages/Layout/index'
import Person from './pages/Person/index'
import PersonDetail from './pages/Person/PersonDetail/index'
import PersonEdit from './pages/Person/PersonEdit/index'
import Track from './pages/Track/index'
import TrackDetail from './pages/Track/TrackDetail/index'
import Instruction from './pages/Instruction/index'
import InstructionEdit from './pages/Instruction/InstructionEdit/index'
import InstructionDetail from './pages/Instruction/InstructionDetail/index'
import Statperson from './pages/Statperson/index'
import Statinstruction from './pages/StatInstruction/index'
import Login from './pages/Login/index'
import Register from './pages/Login/Register/index'
import Usercenter from './pages/Usercenter/index'

class App extends Component {

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path='/' render={() => (
                        <Redirect to='/persontract' />
                    )} />
                    {/* 登录 */}
                    <Route exact path='/login' component={Login} />
                    {/* 注册 */}
                    {/* <Route exact path='/register' component={Register} /> */}
                    <Route path='/' render={() => (
                        <Layout>
                            <Switch>
                                {/* 人员管理 */}
                                <Route path='/person/detail/:id' component={PersonDetail} />
                                <Route path='/person/:type' component={PersonEdit} />
                                <Route path='/person' component={Person} />
                                <Route path='/persontract/:type' component={TrackDetail} />
                                <Route path='/persontract' component={Track} />
                                {/* 指令管理 */}
                                <Route path='/instruction/detail/:id' component={InstructionDetail} />
                                <Route path='/instruction/:type' component={InstructionEdit} />
                                <Route path='/instruction' component={Instruction} />
                                {/* 统计分析 */}
                                <Route path='/statperson' component={Statperson} />
                                <Route path='/statinstruction' component={Statinstruction} />
                                {/* 个人中心 */}
                                <Route path='/usercenter' component={Usercenter} />
                            </Switch>
                        </Layout>
                    )}>
                    </Route>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;
