import React, { Component } from 'react';
import { Breadcrumb, Form, Row, Col, Input, InputNumber, Radio, Select, Cascader, Tooltip, DatePicker, Button, message, Table, Popconfirm, Modal, Descriptions, Upload } from 'antd';
import './index.scss'

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusarr = ['待下发', '待签收', '待反馈', '处理中', '已完成', '待下发', '待签收', '待反馈', '处理中', '已完成']
const dataSource = (() => {
    let arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({
            key: i,
            title: `标题${i}`,
            num: `黔疫情防控-${i}`,
            receive: `单位-${i}`,
            status: statusarr[i],
            time: '2020-09-21  08:50:08'
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

class Instruction extends Component {

    state = {
        itemSelected: [],
        batchValue: '请选择',
        pageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
        role: "管理部门",
        modalVisible: false,
        modalTitle: null,
        currentItem: null,
        innerModalTitle: null,
        innerModalVisible: false,
        innerPageInfo: {
            pageSize: 10,
            page: 1,
            total: 50
        },
    }

    searchFormRef = React.createRef();
    signFormRef = React.createRef();
    feedbackFormRef = React.createRef();
    innerFeedbackFormRef = React.createRef();
    innerSignFormRef = React.createRef();
    innerNotSignFormRef = React.createRef();

    getColumns = () => {
        const { role } = this.state
        let columns = [
            {
                title: '标题',
                dataIndex: 'title',
            },
            {
                title: '文号',
                dataIndex: 'num',
            },
            {
                title: '接收单位',
                dataIndex: 'receive',
            },
            {
                title: '状态',
                render: item => {
                    if (item.status == "待下发" && role == "管理部门") {
                        return <span><i className="iconfont">&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "待签收") {
                        return <span><i className="iconfont" style={{ color: "#f50" }}>&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "待反馈") {
                        return <span><i className="iconfont" style={{ color: "orange" }}>&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "处理中") {
                        return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>{item.status}</span>
                    } else if (item.status == "已完成") {
                        return <span><i className="iconfont" style={{ color: "#87d068" }}>&#xe63f;</i>{item.status}</span>
                    }
                }
            },
            {
                title: '发文时间',
                dataIndex: 'time',
            },
            {
                title: '操作',
                render: item => (
                    <div>
                        {
                            role == "管理部门" && item.status == "待下发" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.editItem(item)}>编辑</span>
                        }
                        {
                            role == "管理部门" && item.status == "待下发" &&
                            <Popconfirm
                                title="确定发送此指令吗？"
                                onConfirm={() => this.sendItemConfirm(item)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }}>发送</span>
                            </Popconfirm>
                        }
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.toDetail(item)}>详情</span>
                        {
                            role != "管理部门" && item.status == "待签收" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showSignModal(item)}>签收</span>
                        }
                        {
                            item.status != "待签收" && item.status != "待下发" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showSignDetailModal(item)}>签收详情</span>
                        }
                        {
                            item.status == "待反馈" && role != "管理部门" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showFeedbackModal(item)}>反馈</span>
                        }
                        {
                            item.status == "处理中" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showFeedbackHandelModal(item)}>反馈处理</span>
                        }
                        {
                            item.status == "已完成" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showFeedbackDetailModal(item)}>反馈详情</span>
                        }
                        {
                            role == "管理部门" && item.status == "处理中" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }}>转发</span>
                        }
                        {
                            role == "管理部门" && item.status != "待下发" && item.status != "已完成" &&
                            <Popconfirm
                                title="确定撤回此指令吗？"
                                onConfirm={() => this.deleteItemConfirm(item)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <span style={{ cursor: 'pointer', color: '#ff4d4f' }}>撤回</span>
                            </Popconfirm>
                        }
                    </div>
                ),
            },
        ];

        if (role != "管理部门") {
            columns.splice(2, 1)
        }

        return columns
    }

    getFeedbackColumns = () => {
        const { role } = this.state
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
                        {
                            role == "管理部门" && item.status == "待签收" &&
                            <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.showInnerSignModal(item)}>签收</span>
                        }
                        {
                            role == "管理部门" && item.status == "待签收" &&
                            <span style={{ cursor: 'pointer', color: '#ff4d4f', marginRight: '15px' }} onClick={() => this.showInnerNotSignModal(item)}>拒签</span>
                        }
                        <span style={{ cursor: 'pointer', color: '#40a9ff' }}>附件</span>
                    </div>
                ),
            },
        ];

        return columns
    }

    // 搜索
    search = () => {
        this.searchFormRef.current.validateFields()
            .then(values => {
                console.log(values)
            })
    }

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
        if (value == '转发') {
            console.log('转发')
            Modal.confirm({
                title: <span>批量转发指令</span>,
                content: `确定要批量转发所选的指令吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                    if (itemSelected.length > 0) {
                        for (let i = 0; i < itemSelected.length; i++) {
                            if (itemSelected[i].status != "处理中") {
                                message.warning("所选条目中存在不能进行转发操作的指令，请检查！")
                                return
                            }
                        }
                        console.log(`批量转发指令`)
                        console.log(itemSelected)
                    }
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        } else if (value == '发送') {
            console.log('发送')
            Modal.confirm({
                title: <span>批量发送指令</span>,
                content: `确定要批量发送所选的指令吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                    if (itemSelected.length > 0) {
                        for (let i = 0; i < itemSelected.length; i++) {
                            if (itemSelected[i].status != "待下发") {
                                message.warning("所选条目中存在不能进行发送操作的指令，请检查！")
                                return
                            }
                        }
                        console.log(`批量发送指令`)
                        console.log(itemSelected)
                    }
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        } else if (value == '撤回') {
            console.log('撤回')
            Modal.confirm({
                title: <span>批量撤回指令</span>,
                content: `确定要批量撤回所选的指令吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                    if (itemSelected.length > 0) {
                        for (let i = 0; i < itemSelected.length; i++) {
                            if (itemSelected[i].status == "待下发" || itemSelected[i].status == "已完成") {
                                message.warning("所选条目中存在不能进行撤回操作的指令，请检查！")
                                return
                            }
                        }
                        console.log(`批量撤回指令`)
                        console.log(itemSelected)
                    }
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        }
    }

    // 指令撤回
    deleteItemConfirm = (item) => {
        console.log(item)
    }

    // 指令发送
    sendItemConfirm = (item) => {
        console.log(item)
    }

    // 页码改变的回调
    pageChange = (page) => {
        console.log(page)
    }

    // 签收弹窗出现
    showSignModal = (item) => {
        this.setState({
            modalTitle: "签收",
            modalVisible: true,
            currentItem: item
        })
    }

    // 签收详情弹窗出现
    showSignDetailModal = (item) => {
        this.setState({
            modalTitle: "签收详情",
            modalVisible: true,
            currentItem: item
        })
    }

    // 反馈弹窗出现
    showFeedbackModal = (item) => {
        this.setState({
            modalTitle: "反馈",
            modalVisible: true,
            currentItem: item
        })
    }

    // 反馈处理弹窗出现
    showFeedbackHandelModal = (item) => {
        this.setState({
            modalTitle: "反馈处理",
            modalVisible: true,
            currentItem: item
        })
    }

    // 反馈详情弹窗出现
    showFeedbackDetailModal = (item) => {
        this.setState({
            modalTitle: "反馈详情",
            modalVisible: true,
            currentItem: item
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
        let { modalTitle, currentItem } = this.state
        if (modalTitle == '签收') {
            this.signFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    console.log(currentItem)
                    this.modalCancel()
                })
        } else if (modalTitle == '签收详情') {
            this.modalCancel()
        } else if (modalTitle == "反馈") {
            this.feedbackFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    this.modalCancel()
                })
        }
    }

    // 添加反馈
    addFeedBack = () => {
        this.setState({
            innerModalVisible: true,
            innerModalTitle: "添加反馈"
        })
    }

    // 文件选择回调
    innerNormFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        let fileList = e.fileList
        return e && fileList;
    }

    // 反馈处理签收弹窗出现
    showInnerSignModal = (item) => {
        this.setState({
            innerModalVisible: true,
            innerModalTitle: "签收"
        })
    }

    // 反馈处理拒签弹窗出现
    showInnerNotSignModal = (item) => {
        this.setState({
            innerModalVisible: true,
            innerModalTitle: "拒签"
        })
    }

    // 反馈弹窗页码改变的回调
    innerPageChange = (page) => {
        console.log(page)
    }

    // 弹窗点击取消时的回调
    innerModalCancel = () => {
        console.log('modalCancel')
        this.setState({
            innerModalVisible: false,
            innerModalTitle: null
        })
    }

    // 弹窗点击确定时的回调
    innerModalOk = () => {
        let { innerModalTitle, currentItem } = this.state
        if (innerModalTitle == '添加反馈') {
            this.innerFeedbackFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    this.innerModalCancel()
                })
        } else if (innerModalTitle == '签收') {
            this.innerSignFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    this.innerModalCancel()
                })
        } else if (innerModalTitle == '拒签') {
            this.innerNotSignFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    this.innerModalCancel()
                })
        }
    }

    // 新增指令
    addInstruction = () => {
        this.props.history.push('/instruction/add')
    }

    // 指令编辑
    editItem = (item) => {
        this.props.history.push(`/instruction/${item.key}`)
    }

    // 指令详情
    toDetail = (item) => {
        this.props.history.push(`/instruction/detail/${item.key}`)
    }

    render() {
        const { batchValue, itemSelected, pageInfo, role, modalTitle, modalVisible, innerModalTitle, innerModalVisible, innerPageInfo } = this.state
        let breadlist = [
            { text: '指令管理', link: '' },
            { text: '指令列表', link: '' }
        ]

        return (
            <div className="page-instruction">
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
                    <div className="search">
                        <Form
                            name="search-from"
                            ref={this.searchFormRef}
                        >
                            <Row style={{ justifyContent: 'space-between' }}>
                                <Col span={8} style={{ maxWidth: '30%' }}>
                                    <Form.Item
                                        name='title'
                                        label='指令标题'
                                        rules={[{ required: false }]}
                                    >
                                        <Input placeholder="请输入" />
                                    </Form.Item>
                                </Col>
                                <Col span={8} style={{ maxWidth: '30%' }}>
                                    <Form.Item
                                        name='status'
                                        label='指令状态'
                                        rules={[{ required: false }]}
                                    >
                                        <Select
                                            placeholder="请选择"
                                            allowClear
                                        >
                                            <Option value="待下发">待下发</Option>
                                            <Option value="待签收">待签收</Option>
                                            <Option value="待反馈">待反馈</Option>
                                            <Option value="处理中">处理中</Option>
                                            <Option value="已完成">已完成</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8} style={{ maxWidth: '30%' }}>
                                    {
                                        role == "管理部门" ?

                                            <Form.Item
                                                name='singleanswer'
                                                label='接收单位'
                                                rules={[{ required: false }]}
                                            >
                                                <Select
                                                    placeholder="请选择"
                                                    allowClear
                                                    mode="multiple"
                                                    maxTagCount={2}
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    <Option value="待下发">单位-0</Option>
                                                    <Option value="待签收">单位-1</Option>
                                                    <Option value="待反馈">单位-2</Option>
                                                    <Option value="处理中">单位-3</Option>
                                                    <Option value="已完成">单位-4</Option>
                                                </Select>
                                            </Form.Item>

                                            : null
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16}>
                                    <Form.Item
                                        name="time"
                                        label="发文时间"
                                        rules={[{ type: 'array', required: false }]}
                                    >
                                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                    </Form.Item>
                                </Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    <Button type="primary" onClick={this.search}>搜索</Button>
                                    <Button
                                        style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            this.searchFormRef.current.resetFields()
                                        }}
                                    >
                                        重置
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    {
                        role == "管理部门" ?
                            <div className="operation">
                                <div>
                                    <Button type="primary" style={{ width: 120, marginRight: '10px' }} onClick={this.addInstruction}>+ 新增指令</Button>
                                    <span>批量操作：</span>
                                    <Select style={{ width: 120 }}
                                        onChange={this.batchChange}
                                        placeholder="请选择"
                                        disabled={itemSelected && itemSelected.length ? false : true}
                                        value={batchValue}
                                    >
                                        <Option value="撤回">撤回</Option>
                                        <Option value="发送">发送</Option>
                                        <Option value="转发">转发</Option>
                                    </Select>
                                </div>
                            </div>
                            : null
                    }
                    <Table
                        columns={this.getColumns()}
                        dataSource={dataSource}
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
                <Modal
                    getContainer={false}
                    title={modalTitle || '标题'}
                    visible={modalVisible}
                    onOk={this.modalOk}
                    onCancel={this.modalCancel}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName={modalTitle && (modalTitle == "签收详情" || modalTitle == "反馈处理" || modalTitle == "反馈详情") ? "instruction-modal nofooter" : "instruction-modal"}
                    width={modalTitle && (modalTitle == "反馈处理" || modalTitle == "反馈详情") ? "70%" : 520}
                >
                    {
                        modalTitle && modalTitle == "签收" &&
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            name="sign-form"
                            ref={this.signFormRef}
                        >
                            <Form.Item
                                label="签收意见"
                                name="signdesc"
                                rules={[{ required: false }]}
                                style={{ marginBottom: '0' }}
                            >
                                <Input.TextArea placeholder="请输入签收意见" />
                            </Form.Item>
                        </Form>
                    }
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
                        modalTitle && modalTitle == "反馈" &&
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            name="sign-form"
                            ref={this.feedbackFormRef}
                        >
                            <Form.Item
                                label="反馈内容"
                                name="feedbackInfo"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea placeholder="请输入反馈内容" />
                            </Form.Item>
                            <Form.Item
                                name="upload"
                                label="附件上传"
                                rules={[{ required: false, message: '请选择文件' }]}
                                valuePropName="fileList"
                                getValueFromEvent={this.normFile}
                                style={{ marginBottom: '0' }}
                            >
                                <Upload
                                    name="uploadfile"
                                >
                                    <Button><i className="iconfont">&#xe621;</i>&nbsp;上传文件</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    }
                    {
                        modalTitle && (modalTitle == "反馈处理" || modalTitle == "反馈详情") &&
                        <div>
                            {
                                modalTitle && modalTitle == "反馈处理" && role != "管理部门" &&
                                <Button style={{ marginBottom: "8px" }} onClick={this.addFeedBack}>+ 添加反馈</Button>
                            }
                            <Table
                                columns={this.getFeedbackColumns()}
                                dataSource={feedbackdataSource}
                                pagination={{
                                    pageSize: innerPageInfo.pageSize,
                                    current: innerPageInfo.page,
                                    showQuickJumper: true,
                                    total: innerPageInfo.total,
                                    showTotal(total) {
                                        return `每页10条，共${total}条`
                                    },
                                    onChange: this.innerPageChange
                                }}
                            />
                        </div>
                    }
                    <Modal
                        getContainer={false}
                        title={innerModalTitle || '标题'}
                        visible={innerModalVisible}
                        onOk={this.innerModalOk}
                        onCancel={this.innerModalCancel}
                        okText="确认"
                        cancelText="取消"
                        wrapClassName="inner-modal"
                    >
                        {
                            innerModalTitle && innerModalTitle == "添加反馈" &&
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                name="sign-form"
                                ref={this.innerFeedbackFormRef}
                            >
                                <Form.Item
                                    label="反馈内容"
                                    name="feedbackInfo"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea placeholder="请输入反馈内容" />
                                </Form.Item>
                                <Form.Item
                                    name="upload"
                                    label="附件上传"
                                    rules={[{ required: false, message: '请选择文件' }]}
                                    valuePropName="fileList"
                                    getValueFromEvent={this.innerNormFile}
                                    style={{ marginBottom: '0' }}
                                >
                                    <Upload
                                        name="uploadfile"
                                    >
                                        <Button><i className="iconfont">&#xe621;</i>&nbsp;上传文件</Button>
                                    </Upload>
                                </Form.Item>
                            </Form>
                        }
                        {
                            innerModalTitle && innerModalTitle == "签收" &&
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                name="sign-form"
                                ref={this.innerSignFormRef}
                            >
                                <Form.Item
                                    label="签收意见"
                                    name="signdesc"
                                    rules={[{ required: false }]}
                                    style={{ marginBottom: '0' }}
                                >
                                    <Input.TextArea placeholder="请输入签收意见" />
                                </Form.Item>
                            </Form>
                        }
                        {
                            innerModalTitle && innerModalTitle == "拒签" &&
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18 }}
                                name="sign-form"
                                ref={this.innerNotSignFormRef}
                            >
                                <Form.Item
                                    label="拒签原因"
                                    name="signdesc"
                                    rules={[{ required: true }]}
                                    style={{ marginBottom: '0' }}
                                >
                                    <Input.TextArea placeholder="请输入拒签原因" />
                                </Form.Item>
                            </Form>
                        }
                    </Modal>
                </Modal>
            </div>
        );
    }
}

export default Instruction;