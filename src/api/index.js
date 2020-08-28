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
const Common = mergeApi({
    users: '/v1/rest/users/',
    orgs: '/v1/rest/orgs/',
    count: '/v1/get_num_by_status/',
    commandheads: '/v1/rest/commandheads/',
    commandgroups: '/v1/rest/commandgroups/',
    cmd_num_cls: '/v1/rest/cmd_num_cls/',
    get_template: '/v1/get_template_file/',
    get_org_by_level: '/v1/rest/orgs/'
}, CLOUDMONITORUSER);

//登陆
const Login = mergeApi({
    login: '/v1/login/',
    logout: '/v1/logout/',
    info: '/v1/rest/profiles/me/'
}, CLOUDMONITORUSER);

//人员管理
const Person = mergeApi({
    personBase: '/v1/rest/persons/',
    multiplePerson: '/v1/rest/persons/multiple_delete/'
}, CLOUDMONITORUSER);

//轨迹管理
const Track = mergeApi({
    track: '/v1/rest/tracks/',
    multipleTrack: '/v1/rest/tracks/multiple_delete/',
    check_and_upload: '/v1/check_and_upload/'
}, CLOUDMONITORUSER);

//指令管理
const Command = mergeApi({
    command: '/v1/rest/commands/',
    cmd_nums: '/v1/rest/cmd_nums/',
    template: '/v1/rest/template/'
}, CLOUDMONITORUSER);

// 统计分析
const Statistics = mergeApi({
    person_statistics: '/v1/rest/statistics/person_statistics',
    in_province: '/v1/rest/statistics/in_province',
    health_code: '/v1/rest/statistics/health_code',
    control_trends: '/v1/rest/statistics/control_trends',
    geographic_info: '/v1/rest/statistics/geographic_info',
    command_statistics: '/v1/rest/statistics/command_statistics',
    command_trends: '/v1/rest/statistics/command_trends',
}, CLOUDMONITORUSER);

const API = mergeApi({
    Common,
    Login,
    Person,
    Track,
    Command,
    Statistics
}, HOST);

export default API;
