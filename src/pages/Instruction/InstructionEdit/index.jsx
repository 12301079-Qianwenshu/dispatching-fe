import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, Radio, Select, Button, message, Table, Popconfirm, Modal, Descriptions, Upload, Tag } from 'antd';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'
import './index.scss'
import moment from 'moment';
import { deepCopy } from '../../../utils/tools'
import request from '../../../utils/request'
import API from '../../../api/index'

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

@inject("commonStore")
@observer
class InstructionEdit extends Component {

    state = {
        pathname: this.props.location.pathname,
        users: [],
        orgs: [],
        pageInfo: {
            pageSize: 5,
            page: 1,
            total: 0
        },
        modalTitle: null,
        modalVisible: false,
        innerList: [],
        innerpageInfo: {
            pageSize: 10,
            page: 1,
            total: 0
        },
        innerLoading: true,
        innerModalTitle: null,
        innerModalVisible: false,
        editorState: BraftEditor.createEditorState(null),
        noAnswer: false,
        selectedTrackList: [],
        itemSelected: [],
        itemSelectedKey: [],
        detailItem: null,
        command_head: '',
        commandheads: [],
        commandgroups: [],
        cmd_num_cls: [],
        template: []
    }

    instructionFormRef = React.createRef();
    saveAsTempFormRef = React.createRef();

    getColumns = () => {
        let columns = [
            {
                title: '姓名',
                render: item => {
                    return item.person.name || '-'
                }
            },
            {
                title: '来黔方式',
                filters: [
                    {
                        text: '飞机',
                        value: 1,
                    },
                    {
                        text: '高铁',
                        value: 2,
                    },
                    {
                        text: '汽车',
                        value: 3,
                    },
                    {
                        text: '自行车',
                        value: 4,
                    },
                    {
                        text: '步行',
                        value: 5,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.in_province_info && record.in_province_info.transport_type === value,
                render: item => {
                    let text = '-'
                    if (item.in_province_info) {
                        if (item.in_province_info.transport_type == 1) {
                            text = "飞机"
                        } else if (item.in_province_info.transport_type == 2) {
                            text = "高铁"
                        } else if (item.in_province_info.transport_type == 3) {
                            text = "汽车"
                        } else if (item.in_province_info.transport_type == 4) {
                            text = "自行车"
                        } else if (item.in_province_info.transport_type == 5) {
                            text = "步行"
                        }
                    }
                    return text
                }
            },
            {
                title: '出发地',
                render: item => {
                    // return item.in_province_info && item.in_province_info.from_address || '-'
                    return item.in_province_info && item.in_province_info.from_address && item.in_province_info.from_address.length > 0 && item.in_province_info.from_address.split(',').join(' / ') || '-'
                }
            },
            {
                title: '到达地',
                render: item => {
                    return item.in_province_info && item.in_province_info.station || '-'
                }
            },
            {
                title: '来黔目的地',
                render: item => {
                    return item.in_province_info && item.in_province_info.des_city && item.in_province_info.des_city.length > 0 && item.in_province_info.des_city.split(',').join(' / ') || '-'
                }
            },
            {
                title: '是否入境',
                filters: [
                    {
                        text: '是',
                        value: true,
                    },
                    {
                        text: '否',
                        value: false,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.person.is_broad === value,
                render: item => {
                    return item.person.is_broad == true ? "是" : "否"
                }
            },
            {
                title: '出发地风险等级',
                filters: [
                    {
                        text: '低风险',
                        value: 1,
                    },
                    {
                        text: '中风险',
                        value: 2,
                    },
                    {
                        text: '高风险',
                        value: 3,
                    },
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.in_province_info && record.in_province_info.from_address_level === value,
                render: item => {
                    if (item.in_province_info) {
                        if (item.in_province_info.from_address_level == 3) {
                            return <Tag color="red">高风险</Tag>
                        } else if (item.in_province_info.from_address_level == 2) {
                            return <Tag color="orange">中风险</Tag>
                        } else if (item.in_province_info.from_address_level == 1) {
                            return <Tag color="green">低风险</Tag>
                        }
                    } else {
                        return '-'
                    }
                }
            },
            {
                title: '轨迹状态',
                filters: [
                    {
                        text: '待发送',
                        value: 1,
                    },
                    {
                        text: '已发送-待签收',
                        value: 2,
                    },
                    {
                        text: '待反馈',
                        value: 3,
                    },
                    {
                        text: '已反馈-待签收',
                        value: 4,
                    },
                    {
                        text: '已反馈-已拒签',
                        value: 5,
                    },
                    {
                        text: '已完成',
                        value: 6,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.track_status == value,
                render: item => {
                    if (item.track_status == 1) {
                        return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>待发送</span>
                    } else if (item.track_status == 2) {
                        return <span><i className="iconfont">&#xe63f;</i>已发送-待签收</span>
                    } else if (item.track_status == 3) {
                        return <span><i className="iconfont">&#xe63f;</i>待反馈</span>
                    } else if (item.track_status == 4) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-待签收</span>
                    } else if (item.track_status == 5) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-已拒签</span>
                    } else if (item.track_status == 6) {
                        return <span><i className="iconfont">&#xe63f;</i>已完成</span>
                    }
                }
            },
            {
                title: '录入时间',
                render: item => {
                    let time = item.create_time
                    let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                    return result
                }
            },
            {
                title: '操作',
                render: item => (
                    <div>
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showDetailModal(item)}>详情</span>
                        <Popconfirm
                            title="确定移除此人员轨迹吗？"
                            onConfirm={() => this.deleteItemConfirm(item)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <span style={{ cursor: 'pointer', color: '#ff4d4f' }}>移除</span>
                        </Popconfirm>
                    </div>
                ),
            },
        ];

        return columns
    }

    getInnercolumns = () => {
        let innercolumns = [
            {
                title: '姓名',
                render: item => {
                    return item.person.name || '-'
                }
            },
            {
                title: '来黔方式',
                filters: [
                    {
                        text: '飞机',
                        value: 1,
                    },
                    {
                        text: '高铁',
                        value: 2,
                    },
                    {
                        text: '汽车',
                        value: 3,
                    },
                    {
                        text: '自行车',
                        value: 4,
                    },
                    {
                        text: '步行',
                        value: 5,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.in_province_info && record.in_province_info.transport_type === value,
                render: item => {
                    let text = '-'
                    if (item.in_province_info) {
                        if (item.in_province_info.transport_type == 1) {
                            text = "飞机"
                        } else if (item.in_province_info.transport_type == 2) {
                            text = "高铁"
                        } else if (item.in_province_info.transport_type == 3) {
                            text = "汽车"
                        } else if (item.in_province_info.transport_type == 4) {
                            text = "自行车"
                        } else if (item.in_province_info.transport_type == 5) {
                            text = "步行"
                        }
                    }
                    return text
                }
            },
            {
                title: '出发地',
                render: item => {
                    // return item.in_province_info && item.in_province_info.from_address || '-'
                    return item.in_province_info && item.in_province_info.from_address && item.in_province_info.from_address.length > 0 && item.in_province_info.from_address.split(',').join(' / ') || '-'
                }
            },
            {
                title: '到达地',
                render: item => {
                    return item.in_province_info && item.in_province_info.station || '-'
                }
            },
            {
                title: '来黔目的地',
                render: item => {
                    return item.in_province_info && item.in_province_info.des_city && item.in_province_info.des_city.length > 0 && item.in_province_info.des_city.split(',').join(' / ') || '-'
                }
            },
            {
                title: '是否入境',
                filters: [
                    {
                        text: '是',
                        value: true,
                    },
                    {
                        text: '否',
                        value: false,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.person.is_broad === value,
                render: item => {
                    return item.person.is_broad == true ? "是" : "否"
                }
            },
            {
                title: '出发地风险等级',
                filters: [
                    {
                        text: '低风险',
                        value: 1,
                    },
                    {
                        text: '中风险',
                        value: 2,
                    },
                    {
                        text: '高风险',
                        value: 3,
                    },
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.in_province_info && record.in_province_info.from_address_level === value,
                render: item => {
                    if (item.in_province_info) {
                        if (item.in_province_info.from_address_level == 3) {
                            return <Tag color="red">高风险</Tag>
                        } else if (item.in_province_info.from_address_level == 2) {
                            return <Tag color="orange">中风险</Tag>
                        } else if (item.in_province_info.from_address_level == 1) {
                            return <Tag color="green">低风险</Tag>
                        }
                    } else {
                        return '-'
                    }
                }
            },
            {
                title: '轨迹状态',
                filters: [
                    {
                        text: '待发送',
                        value: 1,
                    },
                    {
                        text: '已发送-待签收',
                        value: 2,
                    },
                    {
                        text: '待反馈',
                        value: 3,
                    },
                    {
                        text: '已反馈-待签收',
                        value: 4,
                    },
                    {
                        text: '已反馈-已拒签',
                        value: 5,
                    },
                    {
                        text: '已完成',
                        value: 6,
                    }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.track_status == value,
                render: item => {
                    if (item.track_status == 1) {
                        return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>待发送</span>
                    } else if (item.track_status == 2) {
                        return <span><i className="iconfont">&#xe63f;</i>已发送-待签收</span>
                    } else if (item.track_status == 3) {
                        return <span><i className="iconfont">&#xe63f;</i>待反馈</span>
                    } else if (item.track_status == 4) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-待签收</span>
                    } else if (item.track_status == 5) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-已拒签</span>
                    } else if (item.track_status == 6) {
                        return <span><i className="iconfont">&#xe63f;</i>已完成</span>
                    }
                }
            },
            {
                title: '录入时间',
                render: item => {
                    let time = item.create_time
                    let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                    return result
                }
            },
            {
                title: '操作',
                render: item => (
                    <div>
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showDetailModal(item)}>详情</span>
                    </div>
                ),
            },
        ];

        return innercolumns
    }

    // 页码改变的回调
    pageChange = (page) => {
        this.setState({
            pageInfo: {
                ...this.state.pageInfo,
                page: page
            }
        })
    }

    // 页码改变的回调
    innerpageChange = (page) => {
        this.setState({
            innerpageInfo: {
                ...this.state.innerpageInfo,
                page: page
            }
        })
    }

    // 文件选择回调
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        let fileList = e.fileList
        return e && fileList;
    }

    // 添加人员详情展示
    showAddModal = () => {
        const { innerList } = this.state
        if (innerList && innerList.length == 0) {
            this.getTrack()
        }
        this.setState({
            modalTitle: "添加人员轨迹",
            modalVisible: true
        })
    }

    // 指令内容富文本框回调
    answerChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    // 弹窗点击取消时的回调
    modalCancel = () => {
        console.log('modalCancel')
        this.setState({
            modalVisible: false,
            modalTitle: null
        })
    }

    // 弹窗点击确定时的回调
    modalOk = () => {
        let { modalTitle, currentItem, itemSelected } = this.state
        if (modalTitle == '添加人员轨迹') {
            this.setState({
                selectedTrackList: itemSelected,
                pageInfo: {
                    ...this.state.pageInfo,
                    total: itemSelected.length
                }
            })
            this.modalCancel()
        } else if (modalTitle == '保存为模板') {
            this.saveAsTempFormRef.current.validateFields()
                .then(values => {
                    let name = values['template_name']
                    let content = this.state.editorState.toHTML()
                    request.post(API.Command.template, { name, content })
                        .then(res => {
                            console.log(res)
                            if (res.success) {
                                this.modalCancel()
                                message.success("模板保存成功")
                            }
                        })
                })
        }
    }

    // 详情弹窗显示
    showDetailModal = (item) => {
        console.log(item)
        this.setState({
            innerModalVisible: true,
            innerModalTitle: "详情",
            detailItem: item
        })
    }

    // 弹窗点击取消时的回调
    innerModalCancel = () => {
        this.setState({
            innerModalVisible: false,
            innerModalTitle: null
        })
    }

    // innermodal 表格多选回调
    innerrowCheckedChange = (selected, selectedItem) => {
        this.setState({
            itemSelected: selectedItem,
            itemSelectedKey: selected
        })
    }

    // 移除选中人员
    deleteItemConfirm = (item) => {
        let { selectedTrackList, itemSelectedKey } = this.state
        let newPerson = selectedTrackList.filter((d) => d.id != item.id)
        let newKey = itemSelectedKey.filter((d) => d != item.id)
        this.setState({
            selectedTrackList: newPerson,
            itemSelectedKey: newKey,
            itemSelected: newPerson
        })
    }

    // 交通方式渲染
    renderType = (type) => {
        let dom = ''
        if (type == 1) {
            dom = "飞机"
        } else if (type == 2) {
            dom = "高铁"
        } else if (type == 3) {
            dom = "汽车"
        } else if (type == 4) {
            dom = "自行车"
        } else if (type == 5) {
            dom = "步行"
        }
        return dom
    }

    // 指令报头变化回调
    commandHeadChange = (value) => {
        this.setState({
            command_head: value
        })
    }

    // 指令模板选择变化回调
    templateChange = (value) => {
        let { template } = this.state
        let target = template.find((item => {
            return item.id == value
        }))
        if (target) {
            this.setState({
                editorState: BraftEditor.createEditorState(target.content),
            })
        }
    }

    // 将指令内容保存为模板
    saveAsTemp = () => {
        // 指令内容校验
        let command_content = this.state.editorState.toHTML()
        let regRN = /<p>|<\/p>|\s/g;
        let arr = command_content.replace(regRN, "")
        if (!arr) {
            this.setState({
                noAnswer: true
            })
            message.warning("指令内容不能为空！")
            return
        } else {
            this.setState({
                modalTitle: "保存为模板",
                modalVisible: true
            })
        }
    }

    // 指令保存
    save = () => {
        const { pathname, cmd_num_cls } = this.state
        this.instructionFormRef.current.validateFields()
            .then(values => {
                delete values['time']
                // 指令内容校验
                let command_content = this.state.editorState.toHTML()
                let regRN = /<p>|<\/p>|\s/g;
                let arr = command_content.replace(regRN, "")
                if (!arr) {
                    this.setState({
                        noAnswer: true
                    })
                    message.warning("指令内容不能为空！")
                    return
                } else {
                    this.setState({
                        noAnswer: false
                    })
                    // 选中人员校验，至少存在一名人员
                    let list = this.state.itemSelectedKey
                    if (list && list.length == 0) {
                        message.warning("人员选择不能为空！")
                        return
                    } else {
                        values['command_content'] = command_content
                        values['track_records'] = list
                        let command_num = cmd_num_cls.find(d => { return d.id == values['command_num'] })
                        if (command_num) {
                            values['command_num'] = command_num.name
                        }
                        // 新增
                        if (pathname.indexOf("add") > -1) {
                            request.post(API.Command.command, values)
                                .then(res => {
                                    if (res.success) {
                                        message.success(res.message)
                                        this.props.history.push('/instruct/pro/send')
                                    }
                                })
                        } else {
                            const { id } = this.props.match.params
                            request.patch(`${API.Command.command}${id}/`, values)
                                .then(res => {
                                    if (res.success) {
                                        message.success(res.message)
                                        this.props.history.push('/instruct/pro/send')
                                    }
                                })
                        }
                    }
                }
            })
    }

    // 指令编辑取消
    cancel = () => {
        this.props.history.go(-1)
    }

    // 获取轨迹列表
    getTrack = () => {
        request.get(API.Track.track, { track_status: 1 })
            .then(res => {
                if (res.success) {
                    this.setState({
                        innerList: res.data || [],
                        innerpageInfo: {
                            ...this.state.innerpageInfo,
                            total: res.data.length
                        },
                        innerLoading: false
                    })
                }
            })
    }

    // 指令文号变化回调，获取后端计算得到的指令文号
    cmdNumChange = (value) => {
        const { cmd_num_cls } = this.state
        let index = cmd_num_cls.findIndex(d => { return d.id == value })
        let arrCopy = deepCopy(cmd_num_cls)
        request.post(API.Command.cmd_nums, { classify_id: value })
            .then(res => {
                if (res.success) {
                    let item = {
                        id: res.data.classify,
                        name: res.data.name
                    }
                    arrCopy.splice(index, 1, item)
                    this.setState({
                        cmd_num_cls: arrCopy
                    })
                }
            })
    }

    // 获取系统用户
    getUsers = () => {
        request.get(API.Common.users)
            .then(res => {
                if (res.success) {
                    this.setState({
                        users: res.data
                    })
                }
            })
    }

    // 获取系统用户
    getTemplates = () => {
        request.get(API.Command.template)
            .then(res => {
                if (res.success) {
                    this.setState({
                        template: res.data
                    })
                }
            })
    }

    // 获取系统组织机构
    getOrgs = () => {
        request.get(API.Common.orgs)
            .then(res => {
                if (res.success) {
                    this.setState({
                        orgs: res.data
                    })
                }
            })
    }

    // 获取系统指令报头
    getCommandheads = () => {
        request.get(API.Common.commandheads)
            .then(res => {
                if (res.success) {
                    this.setState({
                        commandheads: res.data
                    })
                }
            })
    }

    // 获取系统发令组
    getCommandgroups = () => {
        request.get(API.Common.commandgroups)
            .then(res => {
                if (res.success) {
                    this.setState({
                        commandgroups: res.data
                    })
                }
            })
    }

    // 获取系统发令文号类别
    getCmdNumCls = () => {
        request.get(API.Common.cmd_num_cls)
            .then(res => {
                if (res.success) {
                    this.setState({
                        cmd_num_cls: res.data
                    })
                }
            })
    }

    componentDidMount() {
        const { pathname } = this.state
        this.getUsers()
        this.getOrgs()
        this.getCommandheads()
        this.getCommandgroups()
        this.getCmdNumCls()
        this.getTemplates()
        if (pathname.indexOf("edit") > -1) {
            // 获取当前指令详情信息
            const { id } = this.props.match.params
            request.get(`${API.Command.command}${id}/`)
                .then(res => {
                    if (res.success) {
                        let info = res.data
                        let cc_orgs_id = []
                        if (info && info.cc_orgs) {
                            info.cc_orgs.forEach(item => {
                                cc_orgs_id.push(item.cc_org.id)
                            })
                        }
                        this.instructionFormRef.current.setFieldsValue({
                            command_head: info && info.command_head,
                            command_num: info && info.command_num,
                            command_group: info && info.command_group,
                            command_title: info && info.command_title,
                            command_vice_title: info && info.command_vice_title,
                            key_words: info && info.key_words,
                            org_to_id: info && info.org_to,
                            cc_orgs: cc_orgs_id,
                            is_need_verify: info && info.is_need_verify,
                            draft_user_id: info && info.draft_user,
                            approve_user_id: info && info.approve_user,
                            sign_user_id: info && info.sign_user
                        })
                        let list = info && info.track_records || []
                        let key = []
                        list.forEach(item => {
                            key.push(item.id)
                        })
                        this.setState({
                            editorState: BraftEditor.createEditorState(info.command_content),
                            selectedTrackList: list,
                            itemSelected: list,
                            itemSelectedKey: key,
                            pageInfo: {
                                ...this.state.pageInfo,
                                total: key.length
                            }
                        })
                    }
                })
        }
        else {
            let list = toJS(this.props.commonStore.selectedTrackList)
            let key = []
            list.forEach(item => {
                key.push(item.id)
            })
            this.setState({
                selectedTrackList: list,
                itemSelected: list,
                itemSelectedKey: key
            })
        }
    }

    componentDidUpdate() {
        const { pathname } = this.state
        let newpath = this.props.location.pathname
        if (pathname && pathname != newpath) {
            this.setState({
                pathname: newpath,
                editorState: BraftEditor.createEditorState(null),
                noAnswer: false,
                selectedTrackList: [],
                itemSelected: [],
                itemSelectedKey: []
            })
            this.instructionFormRef.current.resetFields()
        }
    }

    componentWillUnmount() {
        this.props.commonStore.setSelectedTrackList([])
    }

    render() {
        const { type, pageInfo, modalTitle, modalVisible, innerpageInfo, innerModalTitle, innerModalVisible, editorState, noAnswer, selectedTrackList, itemSelectedKey, innerList, users, orgs, innerLoading, detailItem, command_head, commandheads, commandgroups,
            cmd_num_cls, template } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: type == "add" ? '指令新增' : '指令编辑', link: '' }
        ]
        let tag = '-'
        if (detailItem && detailItem.person && detailItem.person.health_code == 4) {
            tag = <Tag color="red">红码</Tag>
        } else if (detailItem && detailItem.person && detailItem.person.health_code == 3) {
            tag = <Tag color="orange">橙码</Tag>
        } else if (detailItem && detailItem.person && detailItem.person.health_code == 1) {
            tag = <Tag color="green">绿码</Tag>
        } else if (detailItem && detailItem.person && detailItem.person.health_code == 2) {
            tag = <Tag color="gold">黄码</Tag>
        } else if (detailItem && detailItem.person && detailItem.person.health_code == 5) {
            tag = <Tag color="purple">紫码</Tag>
        }
        let from_address_level = '-'
        if (detailItem && detailItem.in_province_info && detailItem.in_province_info.from_address_level == 1) {
            from_address_level = '低风险'
        } else if (detailItem && detailItem.in_province_info && detailItem.in_province_info.from_address_level == 2) {
            from_address_level = '中风险'
        } else if (detailItem && detailItem.in_province_info && detailItem.in_province_info.from_address_level == 3) {
            from_address_level = '高风险'
        }

        return (
            <div className="page-instructionedit">
                <Breadcrumb>
                    {
                        breadlist && breadlist.length > 0 &&
                        breadlist.map((item, i) => {
                            return (
                                <Breadcrumb.Item key={i}>{item.text}</Breadcrumb.Item>
                            )
                        })
                    }
                </Breadcrumb>
                <div className="detail">
                    <Form
                        name="instruction-from"
                        ref={this.instructionFormRef}
                    >
                        <Row justify="space-between">
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='command_head'
                                    label='指令报头'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                        onChange={this.commandHeadChange}
                                    >
                                        {
                                            commandheads && commandheads.length > 0 &&
                                            commandheads.map(item => {
                                                return (
                                                    <Option value={item.name} key={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='command_num'
                                    label='指令文号'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                        onChange={this.cmdNumChange}
                                    >
                                        {
                                            cmd_num_cls && cmd_num_cls.length > 0 &&
                                            cmd_num_cls.map(item => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='command_group'
                                    label='发令组'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                    >
                                        {
                                            commandgroups && commandgroups.length > 0 &&
                                            commandgroups.map(item => {
                                                return (
                                                    <Option value={item.name} key={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='time'
                                    label='时间'
                                    rules={[{ required: false }]}
                                    initialValue={moment(new Date()).format('YYYY年MM月DD日')}
                                >
                                    <Input placeholder="请输入" readOnly={true} />
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            command_head &&
                            <Row justify="center">
                                <Col span={24}>
                                    <div style={{ width: "640px", textAlign: "center", fontFamily: "gb2312", margin: "10px auto" }}>
                                        <div style={{ fontSize: "20px", color: "red", fontWeight: "bold" }}
                                        >{command_head}</div>
                                        <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0", marginBottom: "20px" }}></div>
                                    </div>
                                </Col>
                            </Row>
                        }
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='command_title'
                                    label='标题'
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={2} placeholder="请输入标题" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='command_vice_title'
                                    label='副标题'
                                    rules={[{ required: false }]}
                                >
                                    <TextArea rows={2} placeholder="请输入副标题" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "110px", textAlign: "right", color: "rgba(0, 0, 0, 0.85)", paddingRight: "10px" }}><span style={{ color: "#f50" }}>*</span> 指令内容:</div>
                            <BraftEditor
                                className={noAnswer ? "answer-editor noAnswer" : "answer-editor"}
                                value={editorState}
                                placeholder="请输入指令内容"
                                excludeControls={['line-height', 'letter-spacing', 'remove-styles', 'emoji', 'italic', 'underline', 'strike-through', 'list-ul', 'list-ol', 'blockquote', 'code', 'hr', 'clear', 'text-align']}
                                onChange={this.answerChange}
                            />
                            <div style={{ position: 'absolute', right: '50px', marginTop: '8px' }}>
                                <span style={{ color: '#1890ff', cursor: 'pointer', marginRight: '8px' }} onClick={this.saveAsTemp}>保存为模板</span>
                                <Select
                                    placeholder="请选择模板"
                                    style={{ width: "200px" }}
                                    showSearch
                                    onChange={this.templateChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        template && template.length > 0 &&
                                        template.map(item => {
                                            return (
                                                <Option value={item.id} key={item.id}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='key_words'
                                    label='主题词'
                                    rules={[{ required: false }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='org_to_id'
                                    label='接收单位'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择，支持搜索"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            orgs && orgs.length > 0 &&
                                            orgs.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.org_name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='cc_orgs'
                                    label='抄送单位'
                                    rules={[{ required: false, type: "array" }]}
                                >
                                    <Select
                                        placeholder="请选择，支持搜索"
                                        mode="multiple"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            orgs && orgs.length > 0 &&
                                            orgs.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.org_name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='is_need_verify'
                                    label='是否需要审核'
                                    rules={[{ required: true }]}
                                    initialValue={false}
                                >
                                    <Radio.Group onChange={this.isExamineChange}>
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='draft_user_id'
                                    label='拟稿人'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择，支持搜索"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            users && users.length > 0 &&
                                            users.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.username}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='approve_user_id'
                                    label='核稿人'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择，支持搜索"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            users && users.length > 0 &&
                                            users.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.username}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='sign_user_id'
                                    label='签发人'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择，支持搜索"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            users && users.length > 0 &&
                                            users.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>{item.username}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "110px", textAlign: "right", color: "rgba(0, 0, 0, 0.85)", paddingRight: "10px" }}><span style={{ color: "#f50" }}>*</span>人员轨迹选择:</div>
                            <Table
                                columns={this.getColumns()}
                                dataSource={selectedTrackList}
                                rowKey="id"
                                pagination={{
                                    pageSize: pageInfo.pageSize,
                                    current: pageInfo.page,
                                    showQuickJumper: true,
                                    total: pageInfo.total,
                                    showTotal(total) {
                                        return `每页${pageInfo.pageSize}条，共${total}条`
                                    },
                                    onChange: this.pageChange
                                }}
                                style={{ flex: "auto" }}
                            />
                        </div>
                        <Button style={{ display: "inline-block", marginLeft: "110px", marginBottom: "24px", marginTop: "10px" }} onClick={() => this.showAddModal()}>+ 添加人员轨迹</Button>
                        {/** 
                            <Row justify="space-between">
                                <Col span={24}>
                                    <Form.Item
                                        name="upload"
                                        label="附件"
                                        rules={[{ required: false, message: '请选择文件' }]}
                                        valuePropName="fileList"
                                        getValueFromEvent={this.normFile}
                                    >
                                        <Upload
                                            name="uploadfile"
                                        >
                                            <Button><i className="iconfont">&#xe621;</i>&nbsp;上传文件</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                        */}
                    </Form>
                    <Modal
                        getContainer={false}
                        title={modalTitle || '标题'}
                        visible={modalVisible}
                        onOk={this.modalOk}
                        onCancel={this.modalCancel}
                        okText="确认"
                        cancelText="取消"
                        wrapClassName="instructionedit-modal"
                        width="70%"
                    >
                        {
                            modalTitle && modalTitle == '添加人员轨迹' &&
                            <Search
                                placeholder="请输入关键字"
                                onSearch={value => console.log(value)}
                                style={{ width: 240, marginBottom: "10px" }}
                            />
                        }
                        {
                            modalTitle && modalTitle == '添加人员轨迹' &&
                            <Table
                                columns={this.getInnercolumns()}
                                dataSource={innerList}
                                rowKey="id"
                                rowSelection={{
                                    selections: true,
                                    onChange: this.innerrowCheckedChange,
                                    selectedRowKeys: itemSelectedKey
                                }}
                                loading={innerLoading}
                                pagination={{
                                    pageSize: innerpageInfo.pageSize,
                                    current: innerpageInfo.page,
                                    showQuickJumper: true,
                                    total: innerpageInfo.total,
                                    showTotal(total) {
                                        return `每页${innerpageInfo.pageSize}条，共${total}条`
                                    },
                                    onChange: this.innerpageChange
                                }}
                            />
                        }
                        {
                            modalTitle && modalTitle == '保存为模板' &&
                            <Form
                                name="saveAsTemp-from"
                                ref={this.saveAsTempFormRef}
                            >
                                <Form.Item
                                    name='template_name'
                                    label='模板名称'
                                    rules={[{ required: true }]}
                                >
                                    <Input rows={2} placeholder="请输入模板名称" />
                                </Form.Item>
                            </Form>
                        }
                    </Modal>
                    <Modal
                        getContainer={false}
                        title={innerModalTitle || '标题'}
                        visible={innerModalVisible}
                        onCancel={this.innerModalCancel}
                        okText="确认"
                        cancelText="取消"
                        wrapClassName="instructionedit-inner-modal"
                        width="65%"
                        footer={null}
                    >
                        {
                            detailItem && detailItem.person &&
                            <Descriptions title="人员基本信息">
                                <Descriptions.Item label="姓名">{detailItem.person.name || '-'}</Descriptions.Item>
                                <Descriptions.Item label="身份证">{detailItem.person.id_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="性别">{detailItem.person.gender || '-'}</Descriptions.Item>
                                <Descriptions.Item label="电话">{detailItem.person.phone_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="护照号">{detailItem.person.passport_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="是否为留学生">{detailItem.person.is_student_abroad == 0 ? "否" : "是"}</Descriptions.Item>
                                <Descriptions.Item label="健康码">{tag}</Descriptions.Item>
                                <Descriptions.Item label="年龄">{detailItem.person.age || '-'}</Descriptions.Item>
                                <Descriptions.Item label="是否为入境人员">{detailItem.person.is_broad == 0 ? "否" : "是"}</Descriptions.Item>
                                <Descriptions.Item label="紧急联系人">{detailItem.person.emergency_contact || '-'}</Descriptions.Item>
                                <Descriptions.Item label="紧急联系电话">{detailItem.person.emergency_contact_phone || '-'}</Descriptions.Item>
                                <Descriptions.Item label="国籍">{detailItem.person.nationality || '-'}</Descriptions.Item>
                                <Descriptions.Item label="户籍地">{detailItem.person.born_address && detailItem.person.born_address.split(',').join(' / ') || '-'}</Descriptions.Item>
                                <Descriptions.Item label="住址">{detailItem.person.live_address || '-'}</Descriptions.Item>
                            </Descriptions>
                        }
                        {
                            detailItem && detailItem.in_province_info &&
                            <Descriptions title="来黔信息">
                                <Descriptions.Item label="来黔方式">{this.renderType(detailItem.in_province_info.transport_type)}</Descriptions.Item>
                                <Descriptions.Item label="出发地">{detailItem.in_province_info.from_address && detailItem.in_province_info.from_address.split(',').join(' / ') || '-'}</Descriptions.Item>
                                <Descriptions.Item label="出发地风险等级">{from_address_level}</Descriptions.Item>
                                <Descriptions.Item label="到达地">{detailItem.in_province_info.station || '-'}</Descriptions.Item>
                                <Descriptions.Item label="航班/车次">{detailItem.in_province_info.transport_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="座位号">{detailItem.in_province_info.seat_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="票号/出发日期">{detailItem.in_province_info.departure_time ? moment(detailItem.in_province_info.departure_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="到达时间">{detailItem.in_province_info.arrival_time ? moment(detailItem.in_province_info.arrival_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="来黔目的地">{detailItem.in_province_info.des_city && detailItem.in_province_info.des_city.split(',').join(' / ') || '-'}</Descriptions.Item>
                                <Descriptions.Item label="来黔详细地址">{detailItem.in_province_info.des_address || '-'}</Descriptions.Item>
                            </Descriptions>
                        }
                        {
                            detailItem && detailItem.person && detailItem.person.is_broad == true &&
                            <Descriptions title="入境信息">
                                <Descriptions.Item label="入境方式">{this.renderType(detailItem.immigration_info.entrytype)}</Descriptions.Item>
                                <Descriptions.Item label="入境口岸">{detailItem.immigration_info.station || '-'}</Descriptions.Item>
                                <Descriptions.Item label="入境班次">{detailItem.immigration_info.immigration_num || '-'}</Descriptions.Item>
                                <Descriptions.Item label="入境时间">{detailItem.immigration_info.immigration_time ? moment(detailItem.immigration_info.immigration_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="入境始发国">{detailItem.immigration_info.from_country || '-'}</Descriptions.Item>
                                <Descriptions.Item label="是否为重点区域">{detailItem.immigration_info.is_danger == false ? "否" : "是"}</Descriptions.Item>
                            </Descriptions>
                        }
                        {
                            detailItem && detailItem.prevention_info &&
                            <Descriptions title="防疫信息">
                                <Descriptions.Item label="有无7天内核酸检测报告
                                ">{detailItem.prevention_info.is_7_days_nat == false ? "否" : "是"}</Descriptions.Item>
                                <Descriptions.Item label="核酸检测时间">{detailItem.prevention_info.nat_date ? moment(detailItem.prevention_info.nat_date).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="核酸检测地点">{detailItem.prevention_info.nat_address || '-'}</Descriptions.Item>
                                <Descriptions.Item label="核酸检测结果">{detailItem.prevention_info.nat_result == 0 ? "阴性" : "阳性"}</Descriptions.Item>
                                <Descriptions.Item label="二次核酸检测时间">{detailItem.prevention_info.twice_nat_date ? moment(detailItem.prevention_info.twice_nat_date).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="二次核酸检测结果">{detailItem.prevention_info.twice_nat_result == 0 ? "阴性" : "阳性"}</Descriptions.Item>
                                <Descriptions.Item label="有无14天集中隔离
                                ">{detailItem.prevention_info.is_14_days_medical_observation == false ? "否" : "是"}</Descriptions.Item>
                                <Descriptions.Item label="集中隔离开始时间">{detailItem.prevention_info.observation_start ? moment(detailItem.prevention_info.observation_start).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="集中隔离期满时间">{detailItem.prevention_info.observation_end ? moment(detailItem.prevention_info.observation_end).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="集中隔离期满地点">{detailItem.prevention_info.observation_address || '-'}</Descriptions.Item>
                                <Descriptions.Item label="是否居家隔离">{detailItem.prevention_info.home_isolation == false ? "否" : "是"}</Descriptions.Item>
                                <Descriptions.Item label="居家隔离开始时间">{detailItem.prevention_info.isolation_start ? moment(detailItem.prevention_info.isolation_start).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                <Descriptions.Item label="居家隔离期满时间">{detailItem.prevention_info.isolation_end ? moment(detailItem.prevention_info.isolation_end).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            </Descriptions>
                        }
                    </Modal>
                    <div className="btn">
                        <Button type="primary" style={{ marginRight: '8px' }} onClick={this.save}>保存</Button>
                        <Button onClick={this.cancel}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InstructionEdit;