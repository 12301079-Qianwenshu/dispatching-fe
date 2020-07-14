import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Table, Popconfirm, Modal, Descriptions, Upload, Tag } from 'antd';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'
import './index.scss'

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const innerdataSource = (() => {
    let arr = []
    for (let i = 0; i < 10; i++) {
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

@inject("commonStore")
@observer
class InstructionEdit extends Component {

    state = {
        type: this.props.match.params.type,
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        modalTitle: null,
        modalVisible: false,
        innerpageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        innerModalTitle: null,
        innerModalVisible: false,
        editorState: BraftEditor.createEditorState(null),
        noAnswer: false,
        selectedTrackList: [],
        itemSelected: []
    }

    instructionFormRef = React.createRef();

    componentDidMount() {
        const { type } = this.state
        if (type != "add") {
            // TODO 获取当前指令详情信息
            let info = {
                header: "报头1",
                num: "文号1",
                group: "发令组1",
                title: "这是标题",
                subtitle: "这是副标题",
                cont: "<p>这是指令内容</p>",
                subject: "这是主题",
                receiver: "单位1",
                cc: ['单位1', '单位2'],
                isExamine: "否",
                draft: "拟稿人",
                verification: "核稿人",
                issue: "签发人",
                selectedTrackList: [innerdataSource[0], innerdataSource[1]]
            }
            this.instructionFormRef.current.setFieldsValue({
                header: info.header,
                num: info.num,
                group: info.group,
                title: info.title,
                subtitle: info.subtitle,
                subject: info.subject,
                receiver: info.receiver,
                cc: info.cc,
                isExamine: info.isExamine,
                draft: info.draft,
                verification: info.verification,
                issue: info.issue,
                // selectedTrackList: info.selectedTrackList
            })
            let key = []
            info.selectedTrackList.forEach(item => {
                key.push(item.key)
            })
            this.setState({
                editorState: BraftEditor.createEditorState(info.cont),
                selectedTrackList: info.selectedTrackList,
                itemSelected: info.selectedTrackList,
                itemSelectedKey: key
            })
        } else {
            let list = toJS(this.props.commonStore.selectedTrackList)
            let key = []
            list.forEach(item => {
                key.push(item.key)
            })
            this.setState({
                selectedTrackList: list,
                itemSelected: list,
                itemSelectedKey: key
            })
        }
    }

    componentWillUnmount() {
        this.props.commonStore.setSelectedTrackList([])
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

    innercolumns = [
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
                    <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showDetailModal(item)}>详情</span>
                </div>
            ),
        },
    ];

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
        if (modalTitle == '添加人员') {
            this.setState({
                selectedTrackList: itemSelected
            })
            this.modalCancel()
        } else if (modalTitle == '签收详情') {
            this.modalCancel()
        } else if (modalTitle == "反馈") {
            this.modalCancel()
        }
    }

    // 详情弹窗显示
    showDetailModal = (item) => {
        this.setState({
            innerModalVisible: true,
            innerModalTitle: "详情"
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
        let newPerson = selectedTrackList.filter((d) => d.key != item.key)
        let newKey = itemSelectedKey.filter((d) => d != item.key)
        this.setState({
            selectedTrackList: newPerson,
            itemSelectedKey: newKey,
            itemSelected: newPerson
        })
    }

    // 指令保存
    save = () => {
        this.instructionFormRef.current.validateFields()
            .then(values => {
                console.log(values)
                // 指令内容校验
                let answer = this.state.editorState.toHTML()
                let regRN = /<p>|<\/p>|\s/g;
                let arr = answer.replace(regRN, "")
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
                    let list = this.state.selectedTrackList
                    if (list && list.length == 0) {
                        message.warning("人员选择不能为空！")
                        return
                    } else {
                        console.log(values)
                        console.log(answer)
                        console.log(list)
                    }
                }
            })
    }

    render() {
        const { type, pageInfo, modalTitle, modalVisible, innerpageInfo, innerModalTitle, innerModalVisible, editorState, noAnswer, selectedTrackList, itemSelectedKey } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: type == "add" ? '指令新增' : '指令编辑', link: '' }
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
                                    name='header'
                                    label='指令报头'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                    >
                                        <Option value="报头1">报头1</Option>
                                        <Option value="报头2">报头2</Option>
                                        <Option value="报头3">报头3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='num'
                                    label='指令文号'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                    >
                                        <Option value="文号1">文号1</Option>
                                        <Option value="文号2">文号2</Option>
                                        <Option value="文号3">文号3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='group'
                                    label='发令组'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder="请选择"
                                    >
                                        <Option value="发令组1">发令组1</Option>
                                        <Option value="发令组2">发令组2</Option>
                                        <Option value="发令组3">发令组3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={16} style={{ maxWidth: '45%' }}>
                                <Form.Item
                                    name='time'
                                    label='时间'
                                    rules={[{ required: false }]}
                                    initialValue="2020年07月02日"
                                >
                                    <Input placeholder="请输入" readOnly={true} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='title'
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
                                    name='subtitle'
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
                        </div>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='subject'
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
                                    name='receiver'
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
                                        <Option value="单位1">单位1</Option>
                                        <Option value="单位2">单位2</Option>
                                        <Option value="单位3">单位3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='cc'
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
                                        <Option value="单位1">单位1</Option>
                                        <Option value="单位2">单位2</Option>
                                        <Option value="单位3">单位3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={24}>
                                <Form.Item
                                    name='isExamine'
                                    label='是否需要审核'
                                    rules={[{ required: true }]}
                                    initialValue="否"
                                >
                                    <Radio.Group onChange={this.isExamineChange}>
                                        <Radio value="是">是</Radio>
                                        <Radio value="否">否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='draft'
                                    label='拟稿人'
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='verification'
                                    label='核稿人'
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ maxWidth: '30%' }}>
                                <Form.Item
                                    name='issue'
                                    label='签发人'
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "110px", textAlign: "right", color: "rgba(0, 0, 0, 0.85)", paddingRight: "10px" }}><span style={{ color: "#f50" }}>*</span>人员轨迹选择:</div>
                            <Table
                                columns={this.columns}
                                dataSource={selectedTrackList}
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
                        <Button style={{ display: "inline-block", marginLeft: "110px", marginBottom: "24px", marginTop: "10px" }} onClick={() => this.showAddModal()}>+ 添加人员轨迹</Button>
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
                        <Search
                            placeholder="请输入关键字"
                            onSearch={value => console.log(value)}
                            style={{ width: 240, marginBottom: "10px" }}
                        />
                        <Table
                            columns={this.innercolumns}
                            dataSource={innerdataSource}
                            rowSelection={{
                                selections: true,
                                onChange: this.innerrowCheckedChange,
                                selectedRowKeys: itemSelectedKey
                            }}
                            pagination={{
                                pageSize: innerpageInfo.pageSize,
                                current: innerpageInfo.page,
                                showQuickJumper: true,
                                total: innerpageInfo.total,
                                showTotal(total) {
                                    return `每页10条，共${total}条`
                                },
                                onChange: this.innerpageChange
                            }}
                        />
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