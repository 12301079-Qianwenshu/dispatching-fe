import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Table, Popconfirm, Modal, Descriptions, Upload, Tag } from 'antd';
import './index.scss'
import request from '../../../utils/request'
import API from '../../../api/index'
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'

@inject("commonStore")
@observer
class InstructionDetail extends Component {

    state = {
        id: this.props.match.params.id,
        users: [],
        orgs: [],
        currentItem: null,
        modalVisible: false,
        modalTitle: null,
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 0
        },
        innerModalVisible: false,
        innerModalTitle: null,
        detailItem: null
    }

    getUsers = () => {
        request.get(API.Common.users)
            .then(res => {
                if (res.success) {
                    this.setState({
                        users: res.data
                    }, () => {
                        this.getOrgs()
                    })
                }
            })
    }

    getOrgs = () => {
        request.get(API.Common.orgs)
            .then(res => {
                if (res.success) {
                    this.setState({
                        orgs: res.data
                    }, () => {
                        const { users, orgs } = this.state
                        const { id } = this.props.match.params
                        request.get(`${API.Command.command}${id}/`)
                            .then(res => {
                                if (res.success) {
                                    let info = res.data
                                    if (info && info.cc_orgs) {
                                        let cc_users = info.cc_orgs
                                        let cc_users_item = []
                                        if (cc_users.length > 0) {
                                            for (let i = 0; i < cc_users.length; i++) {
                                                cc_users_item.push(cc_users[i].cc_org.org_name)
                                            }
                                        }
                                        info['cc_users_item'] = cc_users_item
                                    }
                                    if (info && info.org_to) {
                                        let result = orgs.filter(item => { return item.id == info.org_to })
                                        if (result && result.length > 0) {
                                            info['user_to_text'] = result[0].org_name
                                        }
                                    }
                                    if (info && info.draft_user) {
                                        let result = users.filter(item => { return item.id == info.draft_user })
                                        if (result) {
                                            info['draft_user_text'] = result[0].username
                                        }
                                    }
                                    if (info && info.approve_user) {
                                        let result = users.filter(item => { return item.id == info.approve_user })
                                        if (result) {
                                            info['approve_user_text'] = result[0].username
                                        }
                                    }
                                    if (info && info.sign_user) {
                                        let result = users.filter(item => { return item.id == info.sign_user })
                                        if (result) {
                                            info['sign_user_text'] = result[0].username
                                        }
                                    }
                                    this.setState({
                                        currentItem: info
                                    })
                                }
                            })
                    })
                }
            })
    }

    componentDidMount() {
        this.getUsers()
    }

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
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showTrackDetailModal(item)}>详情</span>
                    </div>
                ),
            },
        ];

        if (role != 1) {
            columns.splice(7, 1, {
                title: '轨迹状态',
                filters: [
                    {
                        text: '待发送',
                        value: 1,
                    },
                    {
                        text: '待签收',
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
                        text: '已反馈-被拒签',
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
                        return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>待签收</span>
                    } else if (item.track_status == 3) {
                        return <span><i className="iconfont">&#xe63f;</i>待反馈</span>
                    } else if (item.track_status == 4) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-待签收</span>
                    } else if (item.track_status == 5) {
                        return <span><i className="iconfont">&#xe63f;</i>已反馈-被拒签</span>
                    } else if (item.track_status == 6) {
                        return <span><i className="iconfont">&#xe63f;</i>已完成</span>
                    }
                }
            })
        }

        return columns
    }

    // 渲染附件详情dom
    renderFile = () => {
        let { currentItem } = this.state
        let dom = []
        if (currentItem && currentItem.file) {
            currentItem.file.forEach((item, i) => {
                dom.push(
                    <Button type="link" key={i} style={{ marginRight: "10px" }}>{item.name}</Button>
                )
            })
        }
        return dom
    }

    // 人员列表页码改变回调
    pageChange = (page) => {
        this.setState({
            pageInfo: {
                ...this.state.pageInfo,
                page: page
            }
        })
    }

    // 弹窗显示
    showDetailModal = (type) => {
        const { currentItem } = this.state
        this.setState({
            modalVisible: true,
            modalTitle: type,
        })
        if (type == "人员轨迹") {
            this.setState({
                pageInfo: {
                    ...this.state.pageInfo,
                    total: currentItem.track_records.length
                }
            })
        }
    }

    // 弹窗点击取消时的回调
    modalCancel = () => {
        this.setState({
            modalVisible: false,
            modalTitle: null
        })
    }

    // 弹窗点击确定时的回调
    modalOk = () => {
        let { modalTitle } = this.state
        if (modalTitle == "人员轨迹") {
            this.modalCancel()
        }
    }

    // 具体某一人员信息详情
    showTrackDetailModal = (item) => {
        this.setState({
            innerModalTitle: "详情",
            innerModalVisible: true,
            detailItem: item
        })
    }

    // 关闭具体某一人员详情弹窗
    innerModalCancel = () => {
        this.setState({
            innerModalTitle: null,
            innerModalVisible: false
        })
    }

    // 渲染指令状态
    renderStatus = (role) => {
        let { currentItem } = this.state
        let dom = null
        if (currentItem && currentItem.status) {
            if (currentItem.status == 1) {
                dom = <span><i className="iconfont">&#xe63f;</i>待发送</span>
            } else if (currentItem.status == 2) {
                dom = <span><i className="iconfont" style={{ color: "#f50" }}>&#xe63f;</i>{role == 1 ? "已发送-待签收" : "待签收"}</span>
            } else if (currentItem.status == 3) {
                dom = <span><i className="iconfont" style={{ color: "orange" }}>&#xe63f;</i>待反馈</span>
            } else if (currentItem.status == 4) {
                dom = <span><i className="iconfont" style={{ color: "orange" }}>&#xe63f;</i>已反馈-待签收</span>
            } else if (currentItem.status == 5) {
                dom = <span><i className="iconfont" style={{ color: "orange" }}>&#xe63f;</i>{role == 1 ? "已反馈-已拒签" : "已反馈-被拒签"}</span>
            } else if (currentItem.status == "处理中") {
                dom = <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>{currentItem.status}</span>
            } else if (currentItem.status == 6) {
                dom = <span><i className="iconfont" style={{ color: "#87d068" }}>&#xe63f;</i>已完成</span>
            } else if (currentItem.status == -1) {
                dom = <span><i className="iconfont" style={{ color: "#87d068" }}>&#xe63f;</i>已撤回</span>
            }
        }
        return dom
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

    // 打印
    print = () => {
        let printHtml = this.refs.article.innerHTML
        let wind = window.open("", 'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
        wind.document.body.innerHTML = printHtml;
        let newStyle = wind.document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
            @font-face {
                font-family: 'gb2312';
                src: url('../../../styles/iconfont/gb2312.ttf') format('truetype')
            }
        `));
        wind.document.head.appendChild(newStyle);
        wind.print();
    }

    render() {
        const { currentItem, modalTitle, modalVisible, pageInfo, innerModalTitle, innerModalVisible, detailItem } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: '指令详情', link: '' }
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
        let userinfo = toJS(this.props.commonStore.userinfo)
        let role = null
        if (userinfo) {
            role = userinfo.org && userinfo.org.org_level || 0
        }
        return (
            <div className="page-instructiondetail">
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
                    <div className="main-cont">
                        <div className="title">
                            <h3>全文内容</h3>
                            <Button type="link" onClick={this.print}>打印</Button>
                        </div>
                        <div className="real-article" style={{ fontFamily: "gb2312", color: "#000", display: "flex", justifyContent: "center" }} ref="article">
                            <div style={{ width: "640px", textAlign: "center", fontFamily: "gb2312" }}>
                                <div style={{ fontSize: "20px", color: "red", fontWeight: "bold" }}
                                >{currentItem && currentItem.command_head}</div>
                                <div style={{ fontSize: "18px", marginTop: "10px" }}>{currentItem && currentItem.command_num}</div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "18px", fontFamily: "黑体", fontWeight: "bold", marginTop: "16px" }}>{currentItem && currentItem.command_title}</div>
                                <div style={{ fontSize: "16px", fontFamily: "黑体", marginBottom: '16px' }}>{currentItem && currentItem.command_vice_title}</div>

                                <div style={{ fontSize: "14px", fontFamily: "gb2312", textAlign: "left" }} dangerouslySetInnerHTML={{ __html: currentItem && currentItem.command_content }}></div>

                                <div style={{ fontSize: "18px", fontFamily: "黑体", display: "flex" }}>
                                    <span style={{ fontWeight: "bold", flexShrink: "0", display: "inline-block", marginTop: "-2px" }}>主题词：</span>
                                    <span style={{ fontSize: "14px", textAlign: "left" }}>{currentItem && currentItem.key_words}</span>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", textAlign: "left" }}>
                                    <div>抄送：</div>
                                    <div style={{ textIndent: "28px" }}>{currentItem && currentItem.cc_users_item && currentItem.cc_users_item.length > 0 && currentItem.cc_users_item.join("、")}</div>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                                    <div>{currentItem && currentItem.command_group}</div>
                                    <div>{currentItem && moment(new Date(currentItem.create_time)).format('YYYY年MM月DD日')} 印发</div>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                                    <div>拟稿：{currentItem && currentItem.draft_user_text}</div>
                                    <div>核稿：{currentItem && currentItem.approve_user_text}</div>
                                    <div>签发：{currentItem && currentItem.sign_user_text}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="other-cont">
                        <div className="title">
                            <h3>其他信息</h3>
                        </div>
                        <div>
                            <Descriptions column={1}>
                                <Descriptions.Item label="接收单位">{currentItem && currentItem.user_to_text}</Descriptions.Item>
                                <Descriptions.Item label="指令状态">{this.renderStatus(role)}</Descriptions.Item>
                                {/** 
                                    currentItem && currentItem.status != 1 && currentItem.status != 2 &&
                                    <Descriptions.Item label="签收详情"><Button type="link" onClick={() => this.showDetailModal("签收详情")}>详情查看</Button></Descriptions.Item>
                                */}
                                {
                                    currentItem && (currentItem.status == "处理中" || currentItem.status == "已完成") &&
                                    <Descriptions.Item label="反馈详情"><Button type="link" onClick={() => this.showDetailModal("反馈详情")}>详情查看</Button></Descriptions.Item>
                                }
                                <Descriptions.Item label="人员轨迹"><Button type="link" onClick={() => this.showDetailModal("人员轨迹")}>详情查看</Button></Descriptions.Item>
                                {/** 
                                    <Descriptions.Item label="附件详情" className="file-desc">{this.renderFile()}</Descriptions.Item>
                                */}
                            </Descriptions>
                        </div>
                    </div>
                </div>
                <Modal
                    getContainer={false}
                    title={modalTitle || '标题'}
                    visible={modalVisible}
                    onOk={this.modalOk}
                    onCancel={this.modalCancel}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName="instruction-detail-modal"
                    width={modalTitle && (modalTitle == "人员轨迹" || modalTitle == "反馈详情") ? "70%" : 520}
                    footer={null}
                >
                    {
                        modalTitle && modalTitle == "人员轨迹" &&
                        <div>
                            <Table
                                columns={this.getColumns()}
                                dataSource={currentItem && currentItem.track_records}
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
                    }
                </Modal>
                <Modal
                    getContainer={false}
                    title={innerModalTitle || '标题'}
                    visible={innerModalVisible}
                    onCancel={this.innerModalCancel}
                    width="65%"
                    footer={null}
                    wrapClassName="instruction-detail-person-modal"
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
                            <Descriptions.Item label="票号/出发日期">{detailItem.in_province_info.departure_time ? moment(detailItem.in_province_info.departure_time).format('YYYY-MM-DD HH:mm:ss') : "-"}</Descriptions.Item>
                            <Descriptions.Item label="到达时间">{detailItem.in_province_info.arrival_time ? moment(detailItem.in_province_info.arrival_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="来黔目的地">{detailItem.in_province_info.des_city && detailItem.in_province_info.des_city.split(',').join(' / ') || '-'}</Descriptions.Item>
                            <Descriptions.Item label="来黔详细地址">{detailItem.in_province_info.des_address || '-'}</Descriptions.Item>
                        </Descriptions>
                    }
                    {
                        detailItem && detailItem.person && detailItem.person.is_broad == true && detailItem.immigration_info &&
                        <Descriptions title="入境信息">
                            <Descriptions.Item label="入境方式">{this.renderType(detailItem.immigration_info.entrytype)}</Descriptions.Item>
                            <Descriptions.Item label="入境口岸">{detailItem.immigration_info.station || '-'}</Descriptions.Item>
                            <Descriptions.Item label="入境班次">{detailItem.immigration_info.immigration_num || '-'}</Descriptions.Item>
                            <Descriptions.Item label="入境时间">{detailItem.immigration_info.immigration_time ? moment(detailItem.immigration_info.immigration_time).format('YYYY-MM-DD HH:mm:ss') : "-"}</Descriptions.Item>
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
            </div>
        );
    }
}

export default InstructionDetail;