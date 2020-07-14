/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-06-02 16:27:28
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-04 15:25:35
 */ 
import { mergeApi } from '../utils/tools'

const HOST = '';

const CLOUDMONITORUSER = '/api';

//登陆
const Login = mergeApi({
    login: '/v1/login/',
    register: ''
}, CLOUDMONITORUSER);

//人员管理
const Person = mergeApi({
    personBase: '/v1/rest/persons/',
}, CLOUDMONITORUSER);

//轨迹管理
const Track = mergeApi({
    track: '/v1/rest/tracks/',
}, CLOUDMONITORUSER);

const API = mergeApi({
    Login,
    Person,
    Track
}, HOST);

export default API;
