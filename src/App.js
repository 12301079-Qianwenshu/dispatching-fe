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
import InstructionCounty from './pages/InstructionCounty/index'

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
                                <Route path='/instruct/detail/:id' component={InstructionDetail} />
                                <Route path='/instruct/pro/edit/:id' component={InstructionEdit} />
                                <Route path='/instruct/pro/add' component={InstructionEdit} />
                                <Route path='/instruct/pro/send' component={Instruction} />
                                <Route path='/instruct/pro/sign' component={Instruction} />
                                <Route path='/instruct/pro/fb' component={Instruction} />
                                <Route path='/instruct/pro/signfb' component={Instruction} />
                                <Route path='/instruct/pro/done' component={Instruction} />
                                <Route path='/instruct/pro/refuse' component={Instruction} />
                                <Route path='/instruct/pro/recall' component={Instruction} />

                                <Route path='/instruct/city/sign' component={Instruction} />
                                <Route path='/instruct/city/fb' component={Instruction} />
                                <Route path='/instruct/city/signfb' component={Instruction} />
                                <Route path='/instruct/city/done' component={Instruction} />
                                <Route path='/instruct/city/refuse' component={Instruction} />

                                <Route path='/instruct/county/fb' component={InstructionCounty} />
                                <Route path='/instruct/county/signfb' component={InstructionCounty} />
                                <Route path='/instruct/county/refuse' component={InstructionCounty} />
                                <Route path='/instruct/county/done' component={InstructionCounty} />
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
