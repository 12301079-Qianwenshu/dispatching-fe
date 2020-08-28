import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Table, Popconfirm, Modal, Descriptions, Upload, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.scss'
import request from '../../utils/request'
import API from '../../api/index'
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'
import moment from 'moment';
import { POSITION } from '../../constant/position'
import { NATION } from '../../constant/nation'
import { deepCopy } from '../../utils/tools'

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Search } = Input;

const options = POSITION
const optionsChildren = POSITION.filter((item) => item.label == "贵州省")[0].children

@inject("commonStore")
@observer
class InstructionCounty extends Component {

    state = {
        pathname: this.props.location.pathname,
        orgs: [],
        users: [],
        itemSelected: [],
        batchValue: '请选择',
        list: [],
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 0
        },
        loading: true,
        modalVisible: false,
        modalTitle: null,
        currentItem: null,
        innerModalTitle: null,
        innerModalVisible: false,
        innerPageInfo: {
            pageSize: 10,
            page: 1,
            total: 0
        },
        extendPageInfo: {
            pageSize: 5,
            page: 1,
            total: 0
        },
        trackItem: null,
        is_broad: false,
        expandedInstru: [],
        levelorg: []

    }

    searchFormRef = React.createRef(); // 搜索form
    innerNotSignFormRef = React.createRef(); // 拒签form
    innerForwardFormRef = React.createRef(); // 转发form
    // 轨迹反馈编辑表格，人员基础信息、来黔信息、入境信息、防疫信息
    baseFormRef = React.createRef();
    laiqianFormRef = React.createRef();
    entryFormRef = React.createRef();
    preventFormRef = React.createRef();

    // 指令column设置
    getColumns = (role) => {
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
                onFilter: (value, record) => record.in_province_info.transport_type === value,
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
                onFilter: (value, record) => record.in_province_info.from_address_level === value,
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
                title: '更新时间',
                render: item => {
                    let time = item.update_time
                    let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                    return result
                }
            },
            {
                title: '操作',
                render: item => (
                    <div>
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showTrackDetailModal(item)}>轨迹详情</span>
                        {
                            role != 1 && (item.track_status == 5 || item.track_status == 8) &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showTrackEditModal(item)}>反馈</span>
                        }
                        {
                            (item.track_status != 8 && item.track_status != 6) && role != 1 &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showTrackEditModal(item, '反馈详情')}>反馈详情</span>
                        }
                    </div>
                ),
            },
        ];

        return columns
    }

    // 拒签记录column设置
    getFeedbackColumns = () => {
        let columns = [
            {
                title: '操作类型',
                dataIndex: 'operation_type',
                render: item => {
                    if (item == 8) {
                        return '转发'
                    } else if (item == 4) {
                        return '反馈'
                    } else if (item == 5) {
                        return '拒签'
                    } else if (item == 1) {
                        return '发送'
                    } else if (item == 2) {
                        return '签收'
                    } else if (item == 6) {
                        return '完成'
                    }
                }
            },
            {
                title: '操作内容',
                dataIndex: 'description',
                render: item => {
                    return item || '-'
                }
            },
            {
                title: '操作人员',
                render: item => {
                    let user = item.operate_user
                    let text = '-'
                    if (user) {
                        text = user.username
                    }
                    return text
                }
            },
            {
                title: '操作时间',
                render: item => {
                    let time = item.create_time
                    let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                    return result
                }
            }
        ];

        return columns
    }

    // 反馈弹框出现
    showTrackEditModal = (item, title = '反馈') => {
        const { expandedInstru, list } = this.state
        let currentItem = null
        if (expandedInstru && expandedInstru.length > 0) {
            let index = expandedInstru[expandedInstru.length - 1]
            currentItem = list.filter(item => { return item.id == index })[0]
        }
        this.setState({
            innerModalTitle: title,
            innerModalVisible: true,
            currentItem: currentItem
        }, () => {
            request.get(`${API.Track.track}${item.id}/`)
                .then((res) => {
                    if (res.success) {
                        let data = res.data
                        this.baseFormRef.current.setFieldsValue({
                            name: data.person.name,
                            id_num: data.person.id_num,
                            phone_num: data.person.phone_num,
                            passport_num: data.person.passport_num,
                            gender: data.person.gender,
                            age: data.person.age,
                            health_code: data.person.health_code,
                            is_student_abroad: data.person.is_student_abroad,
                            is_broad: data.person.is_broad,
                            emergency_contact: data.person.emergency_contact,
                            emergency_contact_phone: data.person.emergency_contact_phone,
                            nationality: data.person.nationality,
                            born_address: data.person.born_address && data.person.born_address.split(','),
                            live_address: data.person.live_address
                        })
                        if (data.in_province_info) {
                            this.laiqianFormRef.current.setFieldsValue({
                                transport_type: data.in_province_info.transport_type,
                                from_address: data.in_province_info.from_address && data.in_province_info.from_address.split(','),
                                from_address_level: data.in_province_info.from_address_level,
                                station: data.in_province_info.station,
                                transport_num: data.in_province_info.transport_num,
                                seat_num: data.in_province_info.seat_num,
                                departure_time: data.in_province_info.departure_time ? moment(data.in_province_info.departure_time, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                arrival_time: data.in_province_info.arrival_time ? moment(data.in_province_info.arrival_time, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                des_city: data.in_province_info.des_city && data.in_province_info.des_city.split(','),
                                des_address: data.in_province_info.des_address,
                                note: data.in_province_info.note
                            })
                        }
                        if (data.person.is_broad && data.immigration_info) {
                            this.entryFormRef.current.setFieldsValue({
                                immigration_type: data.immigration_info.immigration_type,
                                station: data.immigration_info.station,
                                immigration_num: data.immigration_info.immigration_num,
                                immigration_time: data.immigration_info.immigration_time ? moment(data.immigration_info.immigration_time, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                from_country: data.immigration_info.from_country,
                                is_danger: data.immigration_info.is_danger,
                                note: data.immigration_info.note
                            })
                        }
                        // 防疫信息初始化
                        if (data.prevention_info) {
                            this.preventFormRef.current.setFieldsValue({
                                is_7_days_nat: data.prevention_info.is_7_days_nat,
                                nat_date: data.prevention_info.nat_date ? moment(data.prevention_info.nat_date, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                nat_address: data.prevention_info.nat_address,
                                nat_result: data.prevention_info.nat_result,
                                is_14_days_medical_observation: data.prevention_info.is_14_days_medical_observation,
                                observation_address: data.prevention_info.observation_address,
                                observation_start: data.prevention_info.observation_start ? moment(data.prevention_info.observation_start, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                observation_end: data.prevention_info.observation_end ? moment(data.prevention_info.observation_end, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                home_isolation: data.prevention_info.home_isolation,
                                isolation_start: data.prevention_info.isolation_start ? moment(data.prevention_info.isolation_start, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                isolation_end: data.prevention_info.isolation_end ? moment(data.prevention_info.isolation_end, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                twice_nat_date: data.prevention_info.twice_nat_date ? moment(data.prevention_info.twice_nat_date, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                twice_nat_result: data.prevention_info.twice_nat_result,
                                note: data.prevention_info.note
                            })
                        }
                        this.setState({
                            trackItem: data,
                            is_broad: data.person.is_broad
                        })
                    }
                })
        })
    }

    // 轨迹详情弹窗出现
    showTrackDetailModal = (item) => {
        const { expandedInstru, list } = this.state
        let currentItem = null
        if (expandedInstru && expandedInstru.length > 0) {
            let index = expandedInstru[expandedInstru.length - 1]
            currentItem = list.filter(item => { return item.id == index })[0]
        }
        this.setState({
            modalTitle: "轨迹详情",
            modalVisible: true,
            trackItem: item,
            currentItem: currentItem
        })
    }

    // 是否为入境人员变化回调
    isBroadChange = (e) => {
        this.setState({
            is_broad: e.target.value
        })
    }

    // 搜索
    search = () => {
        this.searchFormRef.current.validateFields()
            .then(values => {
                console.log(values)
            })
    }

    // 指令表格多选变化回调
    rowCheckedChange = (selected, selectedItem) => {
        this.setState({
            itemSelected: selectedItem
        })
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

    // 弹窗点击取消时的回调
    modalCancel = () => {
        this.setState({
            modalVisible: false,
            modalTitle: null
        })
    }

    // 反馈弹窗页码改变的回调
    innerPageChange = (page) => {
        this.setState({
            innerPageInfo: {
                ...this.state.innerPageInfo,
                page: page
            }
        })
    }

    // 弹窗点击取消时的回调
    innerModalCancel = () => {
        console.log('modalCancel')
        this.setState({
            innerModalVisible: false,
            innerModalTitle: null
        })
    }

    // 轨迹反馈
    trackFeedback = () => {
        let info = {}
        let { is_broad, trackItem, pathname } = this.state
        // 人员基本信息
        this.baseFormRef.current.validateFields()
            .then(values => {
                let { id_num, passport_num, phone_num } = values
                if (!id_num && !passport_num && !phone_num) {
                    message.warning("身份证、护照号、电话不能都为空，至少录入一个！")
                    return
                } else {
                    info = {
                        ...info,
                        person_info_fields: {
                            ...values,
                            born_address: values.born_address && values.born_address.join(",")
                        }
                    }
                    // 来黔信息
                    this.laiqianFormRef.current.validateFields()
                        .then(values => {
                            info = {
                                ...info,
                                inprovince_info_fields: {
                                    ...values,
                                    des_city: values.des_city && values.des_city.join(","),
                                    from_address: values.from_address && values.from_address.join(",")
                                }
                            }
                            // 防疫信息
                            this.preventFormRef.current.validateFields()
                                .then(values => {
                                    info = {
                                        ...info,
                                        prevention_info_fields: {
                                            ...values
                                        }
                                    }
                                    if (is_broad == true) {
                                        // 入境信息
                                        this.entryFormRef.current.validateFields()
                                            .then(values => {
                                                info = {
                                                    ...info,
                                                    immigration_info_fields: values
                                                }
                                                request.patch(`${API.Track.track}${trackItem.id}/`, info)
                                                    .then(res => {
                                                        if (res.success) {
                                                            request.put(`${API.Track.track}${trackItem.id}/answer_track/`)
                                                                .then(res => {
                                                                    if (res.success) {
                                                                        message.success(res.message)
                                                                        this.innerModalCancel()
                                                                        if (pathname.indexOf('fb') > -1) {
                                                                            this.getList(8)
                                                                        } else {
                                                                            this.getList(5)
                                                                        }
                                                                        this.getCount()
                                                                    }
                                                                })
                                                        }
                                                    })

                                            })
                                    } else {
                                        info['immigration_info_fields'] = {}
                                        request.patch(`${API.Track.track}${trackItem.id}/`, info)
                                            .then(res => {
                                                if (res.success) {
                                                    request.put(`${API.Track.track}${trackItem.id}/answer_track/`)
                                                        .then(res => {
                                                            if (res.success) {
                                                                message.success(res.message)
                                                                this.innerModalCancel()
                                                                if (pathname.indexOf('fb') > -1) {
                                                                    this.getList(8)
                                                                } else {
                                                                    this.getList(5)
                                                                }
                                                                this.getCount()
                                                            }
                                                        })
                                                }
                                            })
                                    }
                                })
                        })
                }
            })
    }

    // 获取指令列表
    getList = (status) => {
        request.get(API.Track.track, { track_status: status })
            .then(res => {
                if (res.success) {
                    this.setState({
                        list: res.data,
                        pageInfo: {
                            ...this.state.pageInfo,
                            total: res.data.length
                        },
                        loading: false
                    })
                }
            })
    }

    // 获取机构
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

    // 获取指令数量
    getCount = () => {
        request.get(API.Common.count)
            .then(res => {
                this.props.commonStore.setCount(deepCopy(res.data))
            })
    }

    // 交通方式渲染
    renderType = (type = '') => {
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

    componentDidMount() {
        const { pathname } = this.state
        this.getOrgs()
        this.getUsers()
        // 待发送
        if (pathname == "/instruct/county/fb") {
            this.getList(8)
        } else if (pathname == "/instruct/county/signfb") {
            this.getList(4)
        } else if (pathname == "/instruct/county/done") {
            this.getList(6)
        } else if (pathname == "/instruct/county/refuse") {
            this.getList(5)
        }

    }

    componentDidUpdate() {
        const { pathname } = this.state
        let newpath = this.props.location.pathname
        if (pathname && pathname != newpath) {
            this.getOrgs()
            this.setState({
                pathname: newpath
            })
            // 待发送
            if (newpath == "/instruct/county/fb") {
                this.getList(8)
            } else if (newpath == "/instruct/county/signfb") {
                this.getList(4)
            } else if (newpath == "/instruct/county/done") {
                this.getList(6)
            } else if (newpath == "/instruct/county/refuse") {
                this.getList(5)
            }
        }
    }

    render() {
        const { batchValue, itemSelected, pageInfo, list, modalTitle, modalVisible, innerModalTitle, innerModalVisible, innerPageInfo, orgs, currentItem, is_broad, pathname, loading, expandedInstru, trackItem, levelorg } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: '指令列表', link: '' }
        ]
        let tag = '-'
        if (trackItem && trackItem.person && trackItem.person.health_code == 4) {
            tag = <Tag color="red">红码</Tag>
        } else if (trackItem && trackItem.person && trackItem.person.health_code == 3) {
            tag = <Tag color="orange">橙码</Tag>
        } else if (trackItem && trackItem.person && trackItem.person.health_code == 1) {
            tag = <Tag color="green">绿码</Tag>
        } else if (trackItem && trackItem.person && trackItem.person.health_code == 2) {
            tag = <Tag color="gold">黄码</Tag>
        } else if (trackItem && trackItem.person && trackItem.person.health_code == 5) {
            tag = <Tag color="purple">紫码</Tag>
        }
        let from_address_level = '-'
        if (trackItem && trackItem.in_province_info && trackItem.in_province_info.from_address_level == 1) {
            from_address_level = '低风险'
        } else if (trackItem && trackItem.in_province_info && trackItem.in_province_info.from_address_level == 2) {
            from_address_level = '中风险'
        } else if (trackItem && trackItem.in_province_info && trackItem.in_province_info.from_address_level == 3) {
            from_address_level = '高风险'
        }
        let userinfo = toJS(this.props.commonStore.userinfo)
        let role = null
        if (userinfo) {
            role = userinfo.org && userinfo.org.org_level || 0
        }

        return (
            <div className="page-instructionCounty">
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
                    <div className="operation">
                        <Search
                            placeholder="请输入关键字"
                            onSearch={value => console.log(value)}
                            style={{ width: 240 }}
                        />
                    </div>
                    <Table
                        columns={this.getColumns(role)}
                        dataSource={list}
                        rowKey="id"
                        rowSelection={{
                            selections: true,
                            onChange: this.rowCheckedChange
                        }}
                        loading={loading}
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
                    />
                </div>
                <Modal
                    getContainer={false}
                    title={innerModalTitle || '标题'}
                    visible={innerModalVisible}
                    onOk={this.innerModalOk}
                    onCancel={this.innerModalCancel}
                    wrapClassName="inner-modal nofooter"
                    width='70%'
                >
                    {
                        innerModalTitle && innerModalTitle.indexOf('反馈') > -1 &&
                        <div className="detail">
                            {
                                trackItem && trackItem.track_operation_records && trackItem.track_operation_records.length > 0 &&
                                <React.Fragment>
                                    <h2 className="title" style={{ background: "transparent" }}>操作记录</h2>
                                    <Table
                                        columns={this.getFeedbackColumns()}
                                        dataSource={trackItem.track_operation_records.reverse()}
                                        rowKey="id"
                                        pagination={{
                                            pageSize: innerPageInfo.pageSize,
                                            current: innerPageInfo.page,
                                            showQuickJumper: true,
                                            total: innerPageInfo.total,
                                            showTotal(total) {
                                                return `每页${innerPageInfo.pageSize}条，共${total}条`
                                            },
                                            onChange: this.innerPageChange
                                        }}
                                    />
                                </React.Fragment>
                            }
                            <h2 className="title">人员基本信息</h2>
                            <Form
                                name="base-from"
                                ref={this.baseFormRef}
                            >
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='name'
                                            label='姓名'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='id_num'
                                            label='身份证'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="性别"
                                            name="gender"
                                            rules={[{ required: false }]}
                                            initialValue="男"
                                        >
                                            <Radio.Group>
                                                <Radio value="男">男</Radio>
                                                <Radio value="女">女</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='phone_num'
                                            label='电话'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='passport_num'
                                            label='护照号'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="是否为留学生"
                                            name="is_student_abroad"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='health_code'
                                            label='健康码'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={1}>绿码</Option>
                                                <Option value={2}>黄码</Option>
                                                <Option value={3}>橙码</Option>
                                                <Option value={4}>红码</Option>
                                                <Option value={5}>紫码</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='age'
                                            label='年龄'
                                            rules={[{ required: false }]}
                                        >
                                            <InputNumber min={1} max={120} placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="是否为入境人员"
                                            name="is_broad"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                        >
                                            <Radio.Group onChange={this.isBroadChange}>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='emergency_contact'
                                            label='紧急联系人'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='emergency_contact_phone'
                                            label='紧急联系电话'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}></Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='nationality'
                                            label='国家/地区'
                                            rules={[{ required: false }]}
                                            initialValue="中国大陆"
                                        >
                                            <Select
                                                placeholder="请选择"
                                                showSearch
                                            >
                                                {
                                                    NATION.map((item, i) => {
                                                        return (
                                                            <Option value={item} key={item}>{item}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='born_address'
                                            label='户籍地'
                                            rules={[{ required: false }]}
                                        >
                                            <Cascader options={options} placeholder="请选择" changeOnSelect
                                                fieldNames={
                                                    { label: 'label', value: 'label', children: 'children' }
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}></Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={16} style={{ maxWidth: '65%' }}>
                                        <Form.Item
                                            name='live_address'
                                            label='住址'
                                            rules={[{ required: false }]}
                                        >
                                            <TextArea rows={2} placeholder="请输入详细住址" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <h2 className="title">来黔信息</h2>
                            <Form
                                name="laiqian-from"
                                ref={this.laiqianFormRef}
                            >
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='transport_type'
                                            label='来黔方式'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={1}>飞机</Option>
                                                <Option value={2}>高铁</Option>
                                                <Option value={3}>汽车</Option>
                                                <Option value={4}>自行车</Option>
                                                <Option value={5}>步行</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='from_address'
                                            label='出发地'
                                            rules={[{ required: false }]}
                                        >
                                            <Cascader options={options} placeholder="请选择" changeOnSelect
                                                fieldNames={
                                                    { label: 'label', value: 'label', children: 'children' }
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='from_address_level'
                                            label='出发地风险等级'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={3}>高风险</Option>
                                                <Option value={2}>中风险</Option>
                                                <Option value={1}>低风险</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='station'
                                            label={
                                                <span>
                                                    到达地&nbsp;
                                            <Tooltip title="到达机场/车站/入黔收费站">
                                                        <QuestionCircleOutlined />
                                                    </Tooltip>
                                                </span>
                                            }
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='transport_num'
                                            label='航班/车次'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='seat_num'
                                            label='座位号'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='departure_time'
                                            label='票号/出发日期'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='arrival_time'
                                            label='到达时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='des_city'
                                            label='来黔目的地'
                                            rules={[{ required: false }]}
                                        >
                                            <Cascader options={optionsChildren} placeholder="请选择" changeOnSelect
                                                fieldNames={
                                                    { label: 'label', value: 'label', children: 'children' }
                                                } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={16} style={{ maxWidth: '65%' }}>
                                        <Form.Item
                                            name='des_address'
                                            label='来黔详细地址'
                                            rules={[{ required: false }]}
                                        >
                                            <TextArea rows={2} placeholder="请输入来黔详细地址" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={16} style={{ maxWidth: '65%' }}>
                                        <Form.Item
                                            name='note'
                                            label='备注'
                                            rules={[{ required: false }]}
                                        >
                                            <TextArea rows={2} placeholder="请输入备注" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <h2 className="title"
                                style={{
                                    display: is_broad == true ? 'block' : 'none',
                                }}
                            >入境信息</h2>
                            <Form
                                name="entry-from"
                                ref={this.entryFormRef}
                                className="immigration_form"
                                style={{
                                    height: is_broad == true ? 'auto' : 0,
                                    overflow: 'hidden'
                                }}
                            >
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='immigration_type'
                                            label='入境方式'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={1}>飞机</Option>
                                                <Option value={2}>高铁</Option>
                                                <Option value={3}>汽车</Option>
                                                <Option value={4}>自行车</Option>
                                                <Option value={5}>步行</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='station'
                                            label='入境口岸'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='immigration_num'
                                            label='入境班次'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='immigration_time'
                                            label='入境时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='from_country'
                                            label='入境始发国家/地区'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                showSearch
                                            >
                                                {
                                                    NATION.map((item, i) => {
                                                        if (item != "中国大陆") {
                                                            return (
                                                                <Option value={item} key={item}>{item}</Option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="是否为重点区域"
                                            name="is_danger"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={16} style={{ maxWidth: '65%' }}>
                                        <Form.Item
                                            name='note'
                                            label='备注'
                                            rules={[{ required: false }]}
                                        >
                                            <TextArea rows={2} placeholder="请输入备注" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <h2 className="title">防疫信息</h2>
                            <Form
                                name="entry-from"
                                ref={this.preventFormRef}
                                className="prevent-form"
                            >
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '40%' }}>
                                        <Form.Item
                                            label="有无7天内核酸检测报告"
                                            name="is_7_days_nat"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                            className="is_7_days_nat"
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='nat_date'
                                            label='核酸检测时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='nat_address'
                                            label='核酸检测地点'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='nat_result'
                                            label='核酸检测结果'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={0}>阴性</Option>
                                                <Option value={1}>阳性</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='twice_nat_date'
                                            label='二次核酸检测时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='twice_nat_result'
                                            label='二次核酸检测结果'
                                            rules={[{ required: false }]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                            >
                                                <Option value={0}>阴性</Option>
                                                <Option value={1}>阳性</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}></Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="有无14天集中隔离"
                                            name="is_14_days_medical_observation"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='observation_start'
                                            label='集中隔离开始时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='observation_end'
                                            label='集中隔离期满时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='observation_address'
                                            label='集中隔离期满地点'
                                            rules={[{ required: false }]}
                                        >
                                            <Input placeholder="请输入" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            label="是否居家隔离"
                                            name="home_isolation"
                                            rules={[{ required: false }]}
                                            initialValue={false}
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='isolation_start'
                                            label='居家隔离开始时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ maxWidth: '30%' }}>
                                        <Form.Item
                                            name='isolation_end'
                                            label='居家隔离期满时间'
                                            rules={[{ required: false }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="space-between">
                                    <Col span={16} style={{ maxWidth: '65%' }}>
                                        <Form.Item
                                            name='note'
                                            label='备注'
                                            rules={[{ required: false }]}
                                        >
                                            <TextArea rows={2} placeholder="请输入备注" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            {
                                role && role != 1 && trackItem && (trackItem.track_status == 3 || trackItem.track_status == 5 || trackItem.track_status == 8) &&
                                <div className="btn">
                                    <Button style={{ marginRight: '8px' }} onClick={this.innerModalCancel}>取消</Button>
                                    <Button type="primary" onClick={this.trackFeedback}>反馈</Button>
                                </div>
                            }
                        </div>
                    }
                </Modal>
                <Modal
                    getContainer={false}
                    title={modalTitle || '标题'}
                    visible={modalVisible}
                    onOk={this.modalOk}
                    onCancel={this.modalCancel}
                    okText="确定"
                    cancelText="取消"
                    wrapClassName={modalTitle && modalTitle == "轨迹详情" ? "instruction-modal nofooter" : "instruction-modal"}
                    width='70%'
                >
                    {
                        modalTitle && modalTitle == "轨迹详情" &&
                        <React.Fragment>
                            {
                                trackItem && trackItem.person &&
                                <Descriptions title="人员基本信息">
                                    <Descriptions.Item label="姓名">{trackItem.person.name || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="身份证">{trackItem.person.id_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="性别">{trackItem.person.gender || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="电话">{trackItem.person.phone_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="护照号">{trackItem.person.passport_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="是否为留学生">{trackItem.person.is_student_abroad == 0 ? "否" : "是"}</Descriptions.Item>
                                    <Descriptions.Item label="健康码">{tag}</Descriptions.Item>
                                    <Descriptions.Item label="年龄">{trackItem.person.age || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="是否为入境人员">{trackItem.person.is_broad == 0 ? "否" : "是"}</Descriptions.Item>
                                    <Descriptions.Item label="紧急联系人">{trackItem.person.emergency_contact || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="紧急联系电话">{trackItem.person.emergency_contact_phone || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="国籍">{trackItem.person.nationality || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="户籍地">{trackItem.person.born_address && trackItem.person.born_address.split(',').join(' / ') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="住址">{trackItem.person.live_address || '-'}</Descriptions.Item>
                                </Descriptions>
                            }
                            {
                                trackItem && trackItem.in_province_info &&
                                <Descriptions title="来黔信息">
                                    <Descriptions.Item label="来黔方式">{this.renderType(trackItem.in_province_info.transport_type)}</Descriptions.Item>
                                    <Descriptions.Item label="出发地">{trackItem.in_province_info.from_address && trackItem.in_province_info.from_address.split(',').join(' / ') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="出发地风险等级">{from_address_level}</Descriptions.Item>
                                    <Descriptions.Item label="到达地">{trackItem.in_province_info.station || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="航班/车次">{trackItem.in_province_info.transport_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="座位号">{trackItem.in_province_info.seat_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="票号/出发日期">{trackItem.in_province_info.departure_time ? moment(trackItem.in_province_info.departure_time).format('YYYY-MM-DD HH:mm:ss') : "-"}</Descriptions.Item>
                                    <Descriptions.Item label="到达时间">{trackItem.in_province_info.arrival_time ? moment(trackItem.in_province_info.arrival_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="来黔目的地">{trackItem.in_province_info.des_city && trackItem.in_province_info.des_city.split(',').join(' / ') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="来黔详细地址">{trackItem.in_province_info.des_address || '-'}</Descriptions.Item>
                                </Descriptions>
                            }
                            {
                                trackItem && trackItem.person && trackItem.person.is_broad == true && trackItem.immigration_info &&
                                <Descriptions title="入境信息">
                                    <Descriptions.Item label="入境方式">{this.renderType(trackItem.immigration_info.entrytype)}</Descriptions.Item>
                                    <Descriptions.Item label="入境口岸">{trackItem.immigration_info.station || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="入境班次">{trackItem.immigration_info.immigration_num || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="入境时间">{trackItem.immigration_info.immigration_time ? moment(trackItem.immigration_info.immigration_time).format('YYYY-MM-DD HH:mm:ss') : "-"}</Descriptions.Item>
                                    <Descriptions.Item label="入境始发国">{trackItem.immigration_info.from_country || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="是否为重点区域">{trackItem.immigration_info.is_danger == false ? "否" : "是"}</Descriptions.Item>
                                </Descriptions>
                            }
                            {
                                trackItem && trackItem.prevention_info &&
                                <Descriptions title="防疫信息">
                                    <Descriptions.Item label="有无7天内核酸检测报告
                            ">{trackItem.prevention_info.is_7_days_nat == false ? "否" : "是"}</Descriptions.Item>
                                    <Descriptions.Item label="核酸检测时间">{trackItem.prevention_info.nat_date ? moment(trackItem.prevention_info.nat_date).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="核酸检测地点">{trackItem.prevention_info.nat_address || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="核酸检测结果">{trackItem.prevention_info.nat_result == 0 ? "阴性" : "阳性"}</Descriptions.Item>
                                    <Descriptions.Item label="二次核酸检测时间">{trackItem.prevention_info.twice_nat_date ? moment(trackItem.prevention_info.twice_nat_date).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="二次核酸检测结果">{trackItem.prevention_info.twice_nat_result == 0 ? "阴性" : "阳性"}</Descriptions.Item>
                                    <Descriptions.Item label="有无14天集中隔离
                            ">{trackItem.prevention_info.is_14_days_medical_observation == false ? "否" : "是"}</Descriptions.Item>
                                    <Descriptions.Item label="集中隔离开始时间">{trackItem.prevention_info.observation_start ? moment(trackItem.prevention_info.observation_start).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="集中隔离期满时间">{trackItem.prevention_info.observation_end ? moment(trackItem.prevention_info.observation_end).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="集中隔离期满地点">{trackItem.prevention_info.observation_address || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="是否居家隔离">{trackItem.prevention_info.home_isolation == false ? "否" : "是"}</Descriptions.Item>
                                    <Descriptions.Item label="居家隔离开始时间">{trackItem.prevention_info.isolation_start ? moment(trackItem.prevention_info.isolation_start).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                    <Descriptions.Item label="居家隔离期满时间">{trackItem.prevention_info.isolation_end ? moment(trackItem.prevention_info.isolation_end).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                                </Descriptions>
                            }
                        </React.Fragment>
                    }
                </Modal>
            </div>
        );
    }
}

export default InstructionCounty;