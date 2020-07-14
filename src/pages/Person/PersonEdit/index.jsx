import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.scss'
import { POSITION } from '../../../constant/position'
import { NATION } from '../../../constant/nation'
import request from '../../../utils/request'
import API from '../../../api/index'

const { Option } = Select;
const { TextArea } = Input;

const options = POSITION

class PersonEdit extends Component {

    state = {
        type: this.props.match.params.type,
        currentItem: null
    }

    baseFormRef = React.createRef();

    // 人员信息保存
    save = () => {
        const { type } = this.state
        let baseInfo = {}
        // 人员基本信息
        this.baseFormRef.current.validateFields()
            .then(values => {
                let { id_num, passport_num, phone_num } = values
                if (!id_num && !passport_num && !phone_num) {
                    message.warning("身份证、护照号、电话不能都为空，至少录入一个！")
                    return
                } else {
                    values.born_address = values.born_address ? values.born_address.join(',') : null
                    baseInfo = values
                    if (type == "add") {
                        request.post(API.Person.personBase, baseInfo)
                            .then(res => {
                                if (res.success) {
                                    message.success(res.message)
                                    this.props.history.push('/person')
                                }
                            })
                    } else {
                        // 编辑
                        request.patch(`${API.Person.personBase}${type}/`, { person_info_fields: baseInfo })
                            .then(res => {
                                if (res.success) {
                                    message.success(res.message)
                                    this.props.history.push('/person')
                                }
                            })
                    }
                }
            })
    }

    // 取消返回
    cancel = () => {
        this.props.history.push('/person')
    }

    componentDidMount() {
        const { type } = this.state
        if (type != "add") {
            request.get(`${API.Person.personBase}${type}/`)
                .then((res) => {
                    if (res.success) {
                        let info = res.data
                        this.baseFormRef.current.setFieldsValue({
                            name: info.name,
                            id_num: info.id_num,
                            phone_num: info.phone_num,
                            passport_num: info.passport_num,
                            gender: info.gender,
                            age: info.age,
                            health_code: info.health_code,
                            is_student_abroad: info.is_student_abroad,
                            is_broad: info.is_broad,
                            emergency_contact: info.emergency_contact,
                            emergency_contact_phone: info.emergency_contact_phone,
                            nationality: info.nationality,
                            born_address: info.born_address && info.born_address.split(','),
                            live_address: info.live_address
                        })
                        this.setState({
                            currentItem: info
                        })
                    }
                })
        }
    }

    render() {
        const { type } = this.state
        let breadlist = [
            { text: '人员管理', link: '' },
            { text: '人员基本信息', link: '' },
            { text: type == "add" ? '人员新增' : '人员编辑', link: '' }
        ]
        return (
            <div className="page-personEdit">
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
                                    <Cascader options={options} placeholder="请选择"
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
                    <div className="btn">
                        <Button type="primary" style={{ marginRight: '8px' }} onClick={this.save}>保存</Button>
                        <Button onClick={this.cancel}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonEdit;