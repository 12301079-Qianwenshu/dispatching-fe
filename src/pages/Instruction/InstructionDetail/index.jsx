import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Table, Popconfirm, Modal, Descriptions, Upload, Tag } from 'antd';
import './index.scss'

const selectedPersonlist = (() => {
    let arr = []
    for (let i = 0; i < 2; i++) {
        arr.push({
            key: i,
            orderStatus: i % 2 == 0 ? '待创建' : '已创建',
            time: '2020-09-21  08:50:08',
            name: `张三${i}`,
            id_num: `52250119993827903${i}`,
            passport_num: `GFS3483${i}`,
            phone_num: '17623746352',
            gender: "女",
            age: 18,
            health_code: i % 2 == 0 ? '绿码' : i % 3 == 0 ? '橙码' : '红码',
            is_student_abroad: "是",
            is_broad: "是",
            contactname: "李四",
            contactphone_num: "17339473849",
            nationality: "中国",
            domicile: ["浙江", "杭州", "西湖"],
            address: "这是详细地址",
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
            entrytype: "飞机",
            entryPlace: "入境口岸",
            entryNum: "入境班次",
            entryTime: "2020-07-01 18:34:34",
            entryStartPlace: "美国",
            isHigh: "是"
        })
    }
    return arr
})()
const signData = {
    depart: "签收单位",
    ip: "10.4.12.131",
    time: "2020-07-08 09:05:33",
    person: "张三",
    desc: "无"
}
const feedbackdataSource = (() => {
    let arr = []
    for (let i = 0; i < 2; i++) {
        arr.push({
            key: i,
            depart: `单位${i}`,
            desc: `这是反馈内容-${i}`,
            result: `这是处理意见-${i}`,
            status: '待签收'
        })
    }
    return arr
})()
const info = {
    orderStatus: '待创建',
    time: '2020-09-21  08:50:08',
    name: `张三`,
    id_num: `52250119993827903`,
    passport_num: `GFS3483`,
    phone_num: '17623746352',
    gender: "女",
    age: 18,
    health_code: '绿码',
    is_student_abroad: "是",
    is_broad: "是",
    contactname: "李四",
    contactphone_num: "17339473849",
    nationality: "中国",
    domicile: ["浙江", "杭州", "西湖"],
    address: "这是详细地址",
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
    entrytype: "飞机",
    entryPlace: "入境口岸",
    entryNum: "入境班次",
    entryTime: "2020-07-01 18:34:34",
    entryStartPlace: "美国",
    isHigh: "是"
}

class InstructionDetail extends Component {

    state = {
        id: this.props.match.params.id,
        currentItem: null,
        modalVisible: false,
        modalTitle: null,
        feedbackPageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        innerModalVisible: false,
        innerModalTitle: null
    }

    componentDidMount() {
        let info = {
            header: "贵州省疫情防控领导小组社会防控组文件",
            num: "黔疫情社会防控〔2020〕2667号",
            group: "省疫情社会防控组",
            title: "疫情防控指令（20201277）",
            subtitle: "",
            cont: "<p>这是指令内容</p>",
            subject: ["主题1", "主题2"],
            receiver: "单位1",
            cc: ['单位1', '单位2'],
            isExamine: "否",
            draft: "拟稿人",
            verification: "核稿人",
            issue: "签发人",
            selectedPersonlist: selectedPersonlist,
            status: '待下发',
            file: [{ name: "附件1", link: "" }, { name: "附件2", link: "" }],
            time: "2020年7月8日"
        }
        this.setState({
            currentItem: info
        })
    }

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '来黔方式',
            dataIndex: 'type',
        },
        {
            title: '出发地',
            dataIndex: 'startPlace',
        },
        {
            title: '目的地',
            render: item => {
                return item && item.destination && item.destination.length && item.destination.join(" / ")
            }
        },
        {
            title: '是否入境',
            filters: [
                {
                    text: '是',
                    value: '是',
                },
                {
                    text: '否',
                    value: '否',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.is_broad === value,
            render: item => {
                return item.is_broad
            }
        },
        {
            title: '出发地风险等级',
            filters: [
                {
                    text: '低风险',
                    value: '低风险',
                },
                {
                    text: '中风险',
                    value: '中风险',
                },
                {
                    text: '高风险',
                    value: '高风险',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.status === value,
            render: item => {
                if (item.status == "高风险") {
                    return <Tag color="red">{item.status}</Tag>
                } else if (item.status == "中风险") {
                    return <Tag color="orange">{item.status}</Tag>
                } else if (item.status == "低风险") {
                    return <Tag color="green">{item.status}</Tag>
                }
            }
        },
        {
            title: '指令状态',
            filters: [
                {
                    text: '已创建',
                    value: '已创建',
                },
                {
                    text: '待创建',
                    value: '待创建',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.orderStatus === value,
            render: item => {
                if (item.orderStatus == "已创建") {
                    return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>{item.orderStatus}</span>
                } else if (item.orderStatus == "待创建") {
                    return <span><i className="iconfont">&#xe63f;</i>{item.orderStatus}</span>
                }
            }
        },
        {
            title: '录入时间',
            dataIndex: 'time',
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

    // 反馈详情表格列设置
    getFeedbackColumns = () => {
        let columns = [
            {
                title: '反馈单位',
                dataIndex: 'depart',
            },
            {
                title: '反馈内容',
                dataIndex: 'desc',
            },
            {
                title: '处理意见',
                dataIndex: 'result',
            },
            {
                title: '处理状态',
                render: item => {
                    if (item.status == "待签收") {
                        return <span><i className="iconfont">&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "已拒签") {
                        return <span><i className="iconfont" style={{ color: "#f50" }}>&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "已签收") {
                        return <span><i className="iconfont" style={{ color: "#87d068" }}>&#xe63f;</i>{item.status}</span>
                    }
                }
            },
            {
                title: '操作',
                render: item => (
                    <div>
                        <span style={{ cursor: 'pointer', color: '#40a9ff' }}>附件</span>
                    </div>
                ),
            },
        ];

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

    // 反馈弹窗页码改变的回调
    feedbackPageChange = (page) => {
        console.log(page)
    }

    // 人员列表页码改变回调
    pageChange = (page) => {
        console.log(page)
    }

    // 弹窗显示
    showDetailModal = (type) => {
        console.log(type)
        this.setState({
            modalVisible: true,
            modalTitle: type
        })
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
        if (modalTitle == '签收详情') {
            this.modalCancel()
        } else if (modalTitle == '反馈详情') {
            this.modalCancel()
        } else if (modalTitle == "人员轨迹") {
            this.modalCancel()
        }
    }

    // 具体某一人员信息详情
    showTrackDetailModal = (item) => {
        this.setState({
            innerModalTitle: "详情",
            innerModalVisible: true
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
    renderStatus = () => {
        let { currentItem } = this.state
        let dom = null
        if (currentItem && currentItem.status) {
            if (currentItem.status == "待下发") {
                dom = <span><i className="iconfont">&#xe63f;</i>{currentItem.status}</span>
            } else if (currentItem.status == "待签收") {
                dom = <span><i className="iconfont" style={{ color: "#f50" }}>&#xe63f;</i>{currentItem.status}</span>
            } else if (currentItem.status == "待反馈") {
                dom = <span><i className="iconfont" style={{ color: "orange" }}>&#xe63f;</i>{currentItem.status}</span>
            } else if (currentItem.status == "处理中") {
                dom = <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>{currentItem.status}</span>
            } else if (currentItem.status == "已完成") {
                dom = <span><i className="iconfont" style={{ color: "#87d068" }}>&#xe63f;</i>{currentItem.status}</span>
            }
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
        const { currentItem, modalTitle, modalVisible, feedbackPageInfo, pageInfo, innerModalTitle, innerModalVisible } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: '指令详情', link: '' }
        ]
        let tag = null
        if (info && info.health_code == "红码") {
            tag = <Tag color="red">{info.health_code}</Tag>
        } else if (info && info.health_code == "橙码") {
            tag = <Tag color="orange">{info.health_code}</Tag>
        } else if (info && info.health_code == "绿码") {
            tag = <Tag color="green">{info.health_code}</Tag>
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
                                >{currentItem && currentItem.header}</div>
                                <div style={{ fontSize: "18px", marginTop: "10px" }}>{currentItem && currentItem.num}</div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "18px", fontFamily: "黑体", fontWeight: "bold", marginTop: "16px" }}>{currentItem && currentItem.title}</div>
                                <div style={{ fontSize: "16px", fontFamily: "黑体", marginBottom: '16px' }}>{currentItem && currentItem.subtitle}</div>

                                <div style={{ fontSize: "14px", fontFamily: "gb2312", textAlign: "left" }} dangerouslySetInnerHTML={{ __html: currentItem && currentItem.cont }}></div>
                                
                                <div style={{ fontSize: "18px", fontFamily: "黑体", display: "flex" }}>
                                    <span style={{ fontWeight: "bold", flexShrink: "0", display: "inline-block", marginTop: "-2px" }}>主题词：</span>
                                    <span style={{ fontSize: "14px", textAlign: "left" }}>{currentItem && currentItem.subject && currentItem.subject.length > 0 && currentItem.subject.join("；")}</span>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", textAlign: "left" }}>
                                    <div>抄送：</div>
                                    <div style={{ textIndent: "28px" }}>{currentItem && currentItem.cc && currentItem.cc.length > 0 && currentItem.cc.join("、")}</div>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                                    <div>{currentItem && currentItem.group}</div>
                                    <div>{currentItem && currentItem.time} 印发</div>
                                </div>
                                <div style={{ borderTop: "2px solid red", width: "100%", margin: "7px 0" }}></div>
                                <div style={{ fontSize: "14px", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                                    <div>签发：{currentItem && currentItem.issue}</div>
                                    <div>核稿：{currentItem && currentItem.verification}</div>
                                    <div>拟稿：{currentItem && currentItem.draft}</div>
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
                                <Descriptions.Item label="接收单位">{currentItem && currentItem.receiver}</Descriptions.Item>
                                <Descriptions.Item label="指令状态">{this.renderStatus()}</Descriptions.Item>
                                {
                                    currentItem && currentItem.status != "待下发" && currentItem.status != "待签收" &&
                                    <Descriptions.Item label="签收详情"><Button type="link" onClick={() => this.showDetailModal("签收详情")}>详情查看</Button></Descriptions.Item>
                                }
                                {
                                    currentItem && (currentItem.status == "处理中" || currentItem.status == "已完成") &&
                                    <Descriptions.Item label="反馈详情"><Button type="link" onClick={() => this.showDetailModal("反馈详情")}>详情查看</Button></Descriptions.Item>
                                }
                                <Descriptions.Item label="人员轨迹"><Button type="link" onClick={() => this.showDetailModal("人员轨迹")}>详情查看</Button></Descriptions.Item>
                                <Descriptions.Item label="附件详情" className="file-desc">{this.renderFile()}</Descriptions.Item>
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
                        modalTitle && modalTitle == "签收详情" &&
                        <Descriptions column={2}>
                            <Descriptions.Item label="签收单位">{signData.depart}</Descriptions.Item>
                            <Descriptions.Item label="IP地址">{signData.ip}</Descriptions.Item>
                            <Descriptions.Item label="签收时间">{signData.time}</Descriptions.Item>
                            <Descriptions.Item label="签收人">{signData.person}</Descriptions.Item>
                            <Descriptions.Item label="签收意见">{signData.desc}</Descriptions.Item>
                        </Descriptions>
                    }
                    {
                        modalTitle && modalTitle == "反馈详情" &&
                        <div>
                            <Table
                                columns={this.getFeedbackColumns()}
                                dataSource={feedbackdataSource}
                                pagination={{
                                    pageSize: feedbackPageInfo.pageSize,
                                    current: feedbackPageInfo.page,
                                    showQuickJumper: true,
                                    total: feedbackPageInfo.total,
                                    showTotal(total) {
                                        return `每页10条，共${total}条`
                                    },
                                    onChange: this.feedbackPageChange
                                }}
                            />
                        </div>
                    }
                    {
                        modalTitle && modalTitle == "人员轨迹" &&
                        <div>
                            <Table
                                columns={this.columns}
                                dataSource={currentItem && currentItem.selectedPersonlist}
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
                    <Descriptions title="人员基本信息">
                        <Descriptions.Item label="姓名">{info.name}</Descriptions.Item>
                        <Descriptions.Item label="身份证">{info.id_num}</Descriptions.Item>
                        <Descriptions.Item label="性别">{info.gender}</Descriptions.Item>
                        <Descriptions.Item label="电话">{info.phone_num}</Descriptions.Item>
                        <Descriptions.Item label="护照号">{info.passport_num}</Descriptions.Item>
                        <Descriptions.Item label="是否为留学生">{info.is_student_abroad}</Descriptions.Item>
                        <Descriptions.Item label="健康码">{tag}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{info.age}</Descriptions.Item>
                        <Descriptions.Item label="是否为入境人员">{info.is_broad}</Descriptions.Item>
                        <Descriptions.Item label="紧急联系人">{info.contactname}</Descriptions.Item>
                        <Descriptions.Item label="紧急联系电话">{info.contactmobile}</Descriptions.Item>
                        <Descriptions.Item label="国籍">{info.nationality}</Descriptions.Item>
                        <Descriptions.Item label="户籍地">{info.domicile.length > 0 ? info.domicile.join(' / ') : '无'}</Descriptions.Item>
                        <Descriptions.Item label="住址">{info.address}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="来黔信息">
                        <Descriptions.Item label="来黔方式">{info.type}</Descriptions.Item>
                        <Descriptions.Item label="出发地">{info.startPlace}</Descriptions.Item>
                        <Descriptions.Item label="出发地风险等级">{info.status}</Descriptions.Item>
                        <Descriptions.Item label="到达地">{info.endPlace}</Descriptions.Item>
                        <Descriptions.Item label="航班/车次">{info.typeNum}</Descriptions.Item>
                        <Descriptions.Item label="座位号">{info.seatNum}</Descriptions.Item>
                        <Descriptions.Item label="票号/出发日期">{info.startTime}</Descriptions.Item>
                        <Descriptions.Item label="到达时间">{info.endTime}</Descriptions.Item>
                        <Descriptions.Item label="来黔目的地">{info.destination}</Descriptions.Item>
                        <Descriptions.Item label="来黔详细地址">{info.destinationDetail}</Descriptions.Item>
                    </Descriptions>
                    {
                        info && info.is_broad == "是" &&
                        <Descriptions title="入境信息">
                            <Descriptions.Item label="入境方式">{info.entrytype}</Descriptions.Item>
                            <Descriptions.Item label="入境口岸">{info.entryPlace}</Descriptions.Item>
                            <Descriptions.Item label="入境班次">{info.entryNum}</Descriptions.Item>
                            <Descriptions.Item label="入境时间">{info.entryTime}</Descriptions.Item>
                            <Descriptions.Item label="入境始发国">{info.entryStartPlace}</Descriptions.Item>
                            <Descriptions.Item label="是否为重点区域">{info.isHigh}</Descriptions.Item>
                        </Descriptions>
                    }
                </Modal>
            </div>
        );
    }
}

export default InstructionDetail;