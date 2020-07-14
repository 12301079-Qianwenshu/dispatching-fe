import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Descriptions, Tag, Table } from 'antd';
import request from '../../../utils/request'
import API from '../../../api/index'
import './index.scss'
import moment from 'moment';

const info = {
    name: '张三',
    id_num: `522501199938279031`,
    passport_num: `GFS34831`,
    phone_num: '17623746352',
    gender: "女",
    age: 18,
    health_code: '绿码',
    is_student_abroad: "是",
    is_broad: "是",
    emergency_contact: "李四",
    emergency_contact_phone: "17339473849",
    nationality: "中国",
    born_address: ["浙江", "杭州", "西湖"],
    live_address: "这是详细地址",
    laiqian: [
        {
            key: 1,
            type: "飞机",
            startPlace: "北京大兴机场",
            status: "低风险",
            endPlace: "贵阳龙洞堡机场",
            typeNum: "EJ123",
            seatNum: "F05",
            startTime: "2020-07-01 12:34:34",
            endTime: "2020-07-01 18:34:34",
            destination: ["浙江", "杭州", "西湖"],
            destinationDetail: "来黔目的地详细地址",
        },
        {
            key: 2,
            type: "飞机",
            startPlace: "北京大兴机场",
            status: "低风险",
            endPlace: "贵阳龙洞堡机场",
            typeNum: "EJ123",
            seatNum: "F05",
            startTime: "2020-07-01 12:34:34",
            endTime: "2020-07-01 18:34:34",
            destination: ["浙江", "杭州", "西湖"],
            destinationDetail: "来黔目的地详细地址",
        }
    ],
    entry: [
        {
            key: 1,
            entrytype: "飞机",
            entryPlace: "入境口岸",
            entryNum: "入境班次",
            entryTime: "2020-07-01 18:34:34",
            entryStartPlace: "美国",
            isHigh: "是"
        },
        {
            key: 2,
            entrytype: "飞机",
            entryPlace: "入境口岸",
            entryNum: "入境班次",
            entryTime: "2020-07-01 18:34:34",
            entryStartPlace: "美国",
            isHigh: "是"
        }
    ]

}
class PageDetail extends Component {

    state = {
        id: this.props.match.params.id,
        laiqianPageInfo: {
            pageSize: 5,
            page: 1,
            total: 50
        },
        entryPageInfo: {
            pageSize: 5,
            page: 1,
            total: 50
        },
        fangyiPageInfo: {
            pageSize: 5,
            page: 1,
            total: 50
        },
        currentItem: null,
        inprovince_infos: [],
        immigration_infos: [],
        prevention_infos: []
    }

    laiqianColumns = [
        {
            title: '来黔方式',
            render: item => {
                let text = '-'
                if (item.transport_type == 1) {
                    text = "飞机"
                } else if (item.transport_type == 2) {
                    text = "高铁"
                } else if (item.transport_type == 3) {
                    text = "汽车"
                } else if (item.transport_type == 4) {
                    text = "自行车"
                } else if (item.transport_type == 5) {
                    text = "步行"
                }
                return text
            }
        },
        {
            title: '出发地',
            render: item => {
                return item.from_address || '-'
            }
        },
        {
            title: '出发地风险等级',
            render: item => {
                if (item.from_address_level == 3) {
                    return <Tag color="red">高风险</Tag>
                } else if (item.from_address_level == 2) {
                    return <Tag color="orange">中风险</Tag>
                } else if (item.from_address_level == 1) {
                    return <Tag color="green">低风险</Tag>
                }
            }
        },
        {
            title: '到达地',
            render: item => {
                return item.station || '-'
            }
        },
        {
            title: '航班/车次',
            render: item => {
                return item.transport_num || '-'
            }
        },
        {
            title: '座位号',
            render: item => {
                return item.seat_num || '-'
            }
        },
        {
            title: '票号/出发日期',
            render: item => {
                let time = item.departure_time
                let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                return result
            }
        },
        {
            title: '到达时间',
            render: item => {
                let time = item.arrival_time
                let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                return result
            }
        },
        {
            title: '来黔目的地',
            render: item => {
                return item.from_address || '-'
            }
        },
        {
            title: '来黔详细地址',
            render: item => {
                return item.des_city ? item.des_city.split(',').join(' / ') : '-'
            }
        },
    ];

    entryColumns = [
        {
            title: '入境方式',
            render: item => {
                let text = '-'
                if (item.immigration_type == 1) {
                    text = "飞机"
                } else if (item.immigration_type == 2) {
                    text = "高铁"
                } else if (item.immigration_type == 3) {
                    text = "汽车"
                } else if (item.immigration_type == 4) {
                    text = "自行车"
                } else if (item.immigration_type == 5) {
                    text = "步行"
                }
                return text
            }
        },
        {
            title: '入境口岸',
            render: item => {
                return item.station || '-'
            }
        },
        {
            title: '入境班次',
            render: item => {
                return item.immigration_num || '-'
            }
        },
        {
            title: '入境时间',
            render: item => {
                let time = item.immigration_time
                let result = moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
                return result
            }
        },
        {
            title: '入境始发国',
            render: item => {
                return item.from_country || '-'
            }
        },
        {
            title: '是否为重点区域',
            render: item => {
                return item.is_danger == true ? "是" : "否"
            }
        }
    ];

    fangyiColumns = [
        {
            title: '7天内核酸检测报告',
            render: item => {
                return item.is_7_days_nat == true ? "是" : "否"
            }
        },
        {
            title: '核酸检测时间',
            render: item => {
                let time = item.nat_date
                let result = moment(new Date(time)).format('YYYY-MM-DD')
                return result
            }
        },
        {
            title: '核酸检测地点',
            render: item => {
                return item.nat_address || '-'
            }
        },
        {
            title: '14天医学观察',
            render: item => {
                return item.is_14_days_medical_observation == true ? "是" : "否"
            }

        },
        {
            title: '观察开始时间',
            render: item => {
                let time = item.observation_start
                let result = moment(new Date(time)).format('YYYY-MM-DD')
                return result
            }
        },
        {
            title: '观察期满时间',
            render: item => {
                let time = item.observation_end
                let result = moment(new Date(time)).format('YYYY-MM-DD')
                return result
            }
        },
        {
            title: '观察地点',
            render: item => {
                return item.observation_address || '-'
            }
        },
        {
            title: '居家隔离',
            render: item => {
                return item.home_isolation == true ? "是" : "否"
            }
        },
        {
            title: '隔离开始时间',
            render: item => {
                let time = item.isolation_start
                let result = moment(new Date(time)).format('YYYY-MM-DD')
                return result
            }
        },
        {
            title: '隔离期满',
            render: item => {
                let time = item.isolation_end
                let result = moment(new Date(time)).format('YYYY-MM-DD')
                return result
            }
        }
    ];

    componentDidMount() {
        const { id } = this.state
        request.get(`${API.Person.personBase}${id}/`)
            .then((res) => {
                if (res.success) {
                    this.setState({
                        currentItem: res.data,
                        inprovince_infos: res.data.inprovince_infos,
                        immigration_infos: res.data.immigration_infos,
                        prevention_infos: res.data.prevention_infos,
                        laiqianPageInfo: {
                            ...this.state.laiqianPageInfo,
                            total: res.data.inprovince_infos ? res.data.inprovince_infos.length : 0
                        },
                        entryPageInfo: {
                            ...this.state.entryPageInfo,
                            total: res.data.immigration_infos ? res.data.immigration_infos.length : 0
                        },
                        fangyiPageInfo: {
                            ...this.state.fangyiPageInfo,
                            total: res.data.prevention_infos ? res.data.prevention_infos.length : 0
                        }
                    })
                }
            })
    }

    render() {
        const { laiqianPageInfo, entryPageInfo, currentItem, inprovince_infos, immigration_infos, prevention_infos, fangyiPageInfo } = this.state
        let breadlist = [
            { text: '人员管理', link: '' },
            { text: '人员基本信息', link: '' },
            { text: '人员详情', link: '' }
        ]
        let tag = null
        if (currentItem && currentItem.health_code == 4) {
            tag = <Tag color="red">红码</Tag>
        } else if (currentItem && currentItem.health_code == 3) {
            tag = <Tag color="orange">橙码</Tag>
        } else if (currentItem && currentItem.health_code == 1) {
            tag = <Tag color="green">绿码</Tag>
        } else if (currentItem && currentItem.health_code == 2) {
            tag = <Tag color="gold">黄码</Tag>
        } else if (currentItem && currentItem.health_code == 5) {
            tag = <Tag color="purple">紫码</Tag>
        }

        return (
            <div className="page-pageDetail">
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
                    <Descriptions title="人员基本信息">
                        <Descriptions.Item label="姓名">{currentItem && currentItem.name || '-'}</Descriptions.Item>
                        <Descriptions.Item label="身份证">{currentItem && currentItem.id_num || '-'}</Descriptions.Item>
                        <Descriptions.Item label="性别">{currentItem && currentItem.gender}</Descriptions.Item>
                        <Descriptions.Item label="电话">{currentItem && currentItem.phone_num || '-'}</Descriptions.Item>
                        <Descriptions.Item label="护照号">{currentItem && currentItem.passport_num || '-'}</Descriptions.Item>
                        <Descriptions.Item label="是否为留学生">{(currentItem && currentItem.is_student_abroad == true) ? "是" : "否"}</Descriptions.Item>
                        <Descriptions.Item label="健康码">{tag}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{currentItem && currentItem.age || '-'}</Descriptions.Item>
                        <Descriptions.Item label="是否为入境人员">{(currentItem && currentItem.is_broad == true) ? "是" : "否"}</Descriptions.Item>
                        <Descriptions.Item label="紧急联系人">{currentItem && currentItem.emergency_contact || '-'}</Descriptions.Item>
                        <Descriptions.Item label="紧急联系电话">{currentItem && currentItem.emergency_contact_phone || '-'}</Descriptions.Item>
                        <Descriptions.Item label="国籍">{currentItem && currentItem.nationality || '-'}</Descriptions.Item>
                        <Descriptions.Item label="户籍地">{(currentItem && currentItem.born_address && currentItem.born_address.split(',').length > 0) ? currentItem.born_address.split(',').join(' / ') : '-'}</Descriptions.Item>
                        <Descriptions.Item label="住址">{currentItem && currentItem.live_address || '-'}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="来黔信息"></Descriptions>
                    <Table
                        columns={this.laiqianColumns}
                        dataSource={inprovince_infos || []}
                        rowKey="id"
                        pagination={{
                            pageSize: laiqianPageInfo.pageSize,
                            current: laiqianPageInfo.page,
                            showQuickJumper: true,
                            total: laiqianPageInfo.total,
                            showTotal(total) {
                                return `每页${laiqianPageInfo.pageSize}条，共${total}条`
                            },
                            onChange: this.laiqianPageChange
                        }}
                    />
                    {
                        currentItem && currentItem.is_broad == true &&
                        <React.Fragment>
                            <Descriptions title="入境信息"></Descriptions>
                            <Table
                                columns={this.entryColumns}
                                dataSource={immigration_infos || []}
                                rowKey="id"
                                pagination={{
                                    pageSize: entryPageInfo.pageSize,
                                    current: entryPageInfo.page,
                                    showQuickJumper: true,
                                    total: entryPageInfo.total,
                                    showTotal(total) {
                                        return `每页${entryPageInfo.pageSize}条，共${total}条`
                                    },
                                    onChange: this.entryPageChange
                                }}
                            />
                        </React.Fragment>
                    }
                    <Descriptions title="防疫信息"></Descriptions>
                    <Table
                        columns={this.fangyiColumns}
                        dataSource={prevention_infos || []}
                        rowKey="id"
                        pagination={{
                            pageSize: fangyiPageInfo.pageSize,
                            current: fangyiPageInfo.page,
                            showQuickJumper: true,
                            total: fangyiPageInfo.total,
                            showTotal(total) {
                                return `每页${fangyiPageInfo.pageSize}条，共${total}条`
                            },
                            onChange: this.fangyiPageInfo
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default PageDetail;