import React, { Component } from 'react';
import { Button, Select, Input, Table, Tag, Modal, Form, Upload, Popconfirm, message, Breadcrumb } from 'antd';
import moment from 'moment';
import './index.scss'
import request from '../../utils/request'
import API from '../../api/index'

const { Option } = Select;
const { Search } = Input;

const QRcode = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
const dataSource = (() => {
    let arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({
            key: i,
            name: `张三${i}`,
            idCard: `52250119993827903${i}`,
            passport: `GFS3483${i}`,
            mobile: '17623746352',
            QRcode: QRcode[i],
            orderStatus: i % 2 == 0 ? '待创建' : '已创建',
            time: '2020-09-21  08:50:08'
        })
    }
    return arr
})()

class Person extends Component {

    state = {
        itemSelected: [],
        batchValue: '请选择',
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        list: []
    }

    uploadFormRef = React.createRef();

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            render: text => {
                return text || '-'
            }
        },
        {
            title: '身份证',
            dataIndex: 'id_num',
            render: text => {
                return text || '-'
            }
        },
        {
            title: '护照号',
            dataIndex: 'passport_num',
            render: text => {
                return text || '-'
            }
        },
        {
            title: '电话',
            dataIndex: 'phone_num',
            render: text => {
                return text || '-'
            }
        },
        {
            title: '健康码',
            filters: [
                {
                    text: '绿码',
                    value: 1,
                },
                {
                    text: '黄码',
                    value: 2,
                },
                {
                    text: '橙码',
                    value: 3,
                },
                {
                    text: '红码',
                    value: 4,
                },
                {
                    text: '紫码',
                    value: 5,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.health_code === value,
            render: item => {
                if (item.health_code == null) {
                    return '-'
                } else if (item.health_code == 4) {
                    let text = "红码"
                    return <Tag color="red">{text}</Tag>
                } else if (item.health_code == 3) {
                    let text = "橙码"
                    return <Tag color="orange">{text}</Tag>
                } else if (item.health_code == 1) {
                    let text = "绿码"
                    return <Tag color="green">{text}</Tag>
                } else if (item.health_code == 2) {
                    let text = "黄码"
                    return <Tag color="gold">{text}</Tag>
                } else if (item.health_code == 5) {
                    let text = "紫码"
                    return <Tag color="purple">{text}</Tag>
                }
            }
        },
        {
            title: '录入时间',
            render: item => {
                let time = item.create_time || item.immigration_infos[0].create_time
                let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                return result
            }
        },
        {
            title: '操作',
            render: item => (
                <div>
                    <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.toEdit(item)}>编辑</span>
                    <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.toDetail(item)}>详情</span>
                    <Popconfirm
                        title="确定删除此人员信息吗？"
                        onConfirm={() => this.deleteItemConfirm(item)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <span style={{ cursor: 'pointer', color: '#ff4d4f' }}>删除</span>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // 表格多选变化回调
    rowCheckedChange = (selected, selectedItem) => {
        this.setState({
            itemSelected: selectedItem
        })
    }

    // 批量操作
    batchChange = (value) => {
        const _this = this
        const { itemSelected } = this.state
        if (value == '导出') {
            console.log('导出')
            Modal.confirm({
                title: <span>批量导出人员信息</span>,
                content: `确定要批量导出所选的人员信息吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                    console.log(itemSelected)
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        } else if (value == '删除') {
            console.log('删除')
            Modal.confirm({
                title: <span>批量删除人员信息</span>,
                content: `确定要批量删除所选的人员信息吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    console.log(`批量删除人员信息`)
                    console.log(itemSelected)
                    _this.setState({
                        batchValue: '请选择'
                    })
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        }
    }

    // 人员信息删除
    deleteItemConfirm = (item) => {
        request.delete(`${API.Person.personBase}${item.id}/`)
            .then(() => {
                message.success("删除成功")
                this.getList()
            })
    }

    // 页码改变的回调
    pageChange = (page) => {
        console.log(page)
    }

    // 进入人员新增页面
    addPerson = () => {
        this.props.history.push('/person/add')
    }

    // 进入人员详情页面
    toDetail = (item) => {
        this.props.history.push(`/person/detail/${item.id}`)
    }

    // 人员信息编辑页面
    toEdit = (item) => {
        this.props.history.push(`/person/${item.id}`)
    }

    getList = () => {
        request.get(API.Person.personBase)
            .then(res => {
                if (res.success) {
                    let list = res.data.map((item, i) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })
                    this.setState({
                        list: list || [],
                        pageInfo: {
                            ...this.state.pageInfo,
                            total: list.length
                        }
                    })
                }
            })
    }

    componentDidMount() {
        this.getList()
    }

    render() {
        const { itemSelected, batchValue, pageInfo, list } = this.state
        let breadlist = [
            { text: '人员管理', link: '' },
            { text: '人员基本信息', link: '' }
        ]
        return (
            <div className="page-person">
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
                        <div>
                            <Button type="primary" style={{ width: 120, marginRight: '10px' }} onClick={this.addPerson}>+ 人员新增</Button>
                            <span>批量操作：</span>
                            <Select style={{ width: 120 }}
                                onChange={this.batchChange}
                                placeholder="请选择"
                                disabled={itemSelected && itemSelected.length ? false : true}
                                value={batchValue}
                            >
                                <Option value="导出">导出</Option>
                                <Option value="删除">删除</Option>
                            </Select>
                        </div>
                        <Search
                            placeholder="请输入关键字"
                            onSearch={value => console.log(value)}
                            style={{ width: 240 }}
                        />
                    </div>
                    <Table
                        columns={this.columns}
                        dataSource={list}
                        rowSelection={{
                            selections: true,
                            onChange: this.rowCheckedChange
                        }}
                        pagination={{
                            pageSize: pageInfo.pageSize,
                            current: pageInfo.page,
                            showQuickJumper: true,
                            total: pageInfo.total,
                            showTotal(total) {
                                return `每页10条，共${total}条`
                            },
                            onChange: this.pageChange
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Person;