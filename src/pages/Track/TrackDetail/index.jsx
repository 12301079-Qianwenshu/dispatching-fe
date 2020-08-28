import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.scss'
import { POSITION } from '../../../constant/position'
import { NATION } from '../../../constant/nation'
import request from '../../../utils/request'
import API from '../../../api/index'
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

const { Option } = Select;
const { TextArea } = Input;

const options = POSITION
const optionsChildren = POSITION.filter((item) => item.label == "贵州省")[0].children

@inject("commonStore")
@observer
class TrackDetail extends Component {

    state = {
        is_broad: false,
        type: this.props.match.params.type,
        currentItem: null,
        isblur: false
    }

    baseFormRef = React.createRef();
    laiqianFormRef = React.createRef();
    entryFormRef = React.createRef();
    preventFormRef = React.createRef();

    // 是否为入境人员变化回调
    isBroadChange = (e) => {
        this.setState({
            is_broad: e.target.value
        })
    }

    // 根据电话号、身份证号、护照号获取人员基本信息并回填
    keyBlur = (e, key) => {
        const { type, isblur } = this.state
        if (type == "add") {
            if (e.target.value && !isblur) {
                request.get(`${API.Person.personBase}`, { [key]: e.target.value })
                    .then(res => {
                        if (res.success) {
                            if (res.data && res.data.length > 0) {
                                let text = ''
                                if (key = "phone_num") {
                                    text = "电话"
                                } else if (key = "id_num") {
                                    text = "身份证号"
                                } else if (key = "passport_num") {
                                    text = "护照号"
                                }
                                message.success(`该${text}对应人员基本信息已存在，系统已自动补全其他基本信息`)
                                let data = res.data[0]
                                this.baseFormRef.current.setFieldsValue({
                                    name: data.name,
                                    id_num: data.id_num,
                                    phone_num: data.phone_num,
                                    passport_num: data.passport_num,
                                    gender: data.gender,
                                    age: data.age,
                                    health_code: data.health_code,
                                    is_student_abroad: data.is_student_abroad,
                                    is_broad: data.is_broad,
                                    emergency_contact: data.emergency_contact,
                                    emergency_contact_phone: data.emergency_contact_phone,
                                    nationality: data.nationality,
                                    born_address: data.born_address && data.born_address.split(','),
                                    live_address: data.live_address
                                })
                                this.setState({
                                    isblur: true,
                                    currentItem: data,
                                    is_broad: data.is_broad
                                })
                            }
                        }
                    })
            }

        }
    }

    // 人员信息保存
    save = () => {
        let info = {}
        let { is_broad, type } = this.state
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
                                                if (type == "add") {
                                                    request.post(API.Track.track, info)
                                                        .then(res => {
                                                            if (res.success) {
                                                                message.success(res.message)
                                                                this.props.history.push('/persontract')
                                                            }
                                                        })
                                                } else {
                                                    request.patch(`${API.Track.track}${type}/`, info)
                                                        .then(res => {
                                                            if (res.success) {
                                                                message.success(res.message)
                                                                this.props.history.push('/persontract')
                                                            }
                                                        })

                                                }
                                            })
                                    } else {
                                        info['immigration_info_fields'] = {}
                                        if (type == "add") {
                                            request.post(API.Track.track, info)
                                                .then(res => {
                                                    if (res.success) {
                                                        message.success(res.message)
                                                        this.props.history.push('/persontract')
                                                    }
                                                })
                                        } else {
                                            request.patch(`${API.Track.track}${type}/`, info)
                                                .then(res => {
                                                    if (res.success) {
                                                        message.success(res.message)
                                                        this.props.history.push('/persontract')
                                                    }
                                                })
                                        }
                                    }
                                })
                        })
                }
            })
    }

    // 取消返回
    cancel = () => {
        this.props.history.push('/persontract')
    }

    componentDidMount() {
        const { type } = this.state
        if (type != "add") {
            // 获取当前人员详情信息
            request.get(`${API.Track.track}${type}/`)
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
                            currentItem: data,
                            is_broad: data.person.is_broad
                        })
                    }
                })
        }
    }

    render() {
        const { is_broad, type } = this.state
        let breadlist = [
            { text: '人员管理', link: '' },
            { text: '人员轨迹信息', link: '' },
            { text: type == "add" ? '轨迹新增' : '轨迹详情', link: '' }
        ]
        let userinfo = toJS(this.props.commonStore.userinfo)
        let role = null
        if (userinfo) {
            role = userinfo.org && userinfo.org.org_level || 0
        }

        return (
            <div className="page-trackDetail">
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
                                    <Input placeholder="请输入" onBlur={(e) => this.keyBlur(e, "id_num")} />
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
                                    <Input placeholder="请输入" onBlur={(e) => this.keyBlur(e, "phone_num")} />
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='passport_num'
                                    label='护照号'
                                    rules={[{ required: false }]}
                                >
                                    <Input placeholder="请输入" onBlur={(e) => this.keyBlur(e, "passport_num")} />
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
                        role && role == 1 &&
                        <div className="btn">
                            <Button type="primary" style={{ marginRight: '8px' }} onClick={this.save}>保存</Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default TrackDetail;