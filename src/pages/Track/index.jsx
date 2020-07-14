import React, { Component } from 'react';
import { Button, Select, Input, Table, Tag, Modal, Form, Upload, Popconfirm, message, Breadcrumb } from 'antd';
import './index.scss'
import request from '../../utils/request'
import API from '../../api/index'
import { observer, inject } from 'mobx-react';
import moment from 'moment';

const { Option } = Select;
const { Search } = Input;

const dataSource = (() => {
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

@inject("commonStore")
@observer
class Track extends Component {

    state = {
        itemSelected: [],
        batchValue: '请选择',
        modalTitle: null,
        modalVisible: false,
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
                return text
            }
        },
        {
            title: '出发地',
            render: item => {
                return item.in_province_info.from_address || '-'
            }
        },
        {
            title: '到达地',
            render: item => {
                return item.in_province_info.station || '-'
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
                if (item.in_province_info.from_address_level == 3) {
                    return <Tag color="red">高风险</Tag>
                } else if (item.in_province_info.from_address_level == 2) {
                    return <Tag color="orange">中风险</Tag>
                } else if (item.in_province_info.from_address_level == 1) {
                    return <Tag color="green">低风险</Tag>
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
            onFilter: (value, record) => record.in_province_info.orderStatus === value,
            render: item => {
                if (item.in_province_info.orderStatus == "已创建") {
                    return <span><i className="iconfont" style={{ color: "#108ee9" }}>&#xe63f;</i>{item.in_province_info.orderStatus}</span>
                } else if (item.in_province_info.orderStatus == "待创建") {
                    return <span><i className="iconfont">&#xe63f;</i>{item.in_province_info.orderStatus}</span>
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
                    {
                        item.in_province_info.orderStatus == "待创建" &&
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.createOrder(item)}>指令创建</span>
                    }
                    {
                        item.in_province_info.orderStatus == "已创建" &&
                        <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} >指令查看</span>
                    }
                    <span style={{ cursor: 'pointer', color: '#40a9ff', marginRight: '15px' }} onClick={() => this.toDetail(item)}>轨迹详情</span>
                    <Popconfirm
                        title="确定删除此人员轨迹信息吗？"
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
        if (value == '指令创建') {
            Modal.confirm({
                title: <span>批量创建指令</span>,
                content: `确定要批量创建指令吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                    if (itemSelected.length > 0) {
                        for (let i = 0; i < itemSelected.length; i++) {
                            if (itemSelected[i].orderStatus == "已创建") {
                                message.warning("所选条目中存在不能进行指令创建操作的指令，请检查！")
                                return
                            }
                        }
                        _this.props.commonStore.setSelectedTrackList(itemSelected)
                        _this.props.history.push('/instruction/add')
                    }
                },
                onCancel() {
                    _this.setState({
                        batchValue: '请选择'
                    })
                }
            });
        } else if (value == '导出') {
            console.log('导出')
            Modal.confirm({
                title: <span>批量导出人员轨迹信息</span>,
                content: `确定要批量导出所选的人员轨迹信息吗？`,
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
                title: <span>批量删除人员轨迹信息</span>,
                content: `确定要批量删除所选的人员轨迹信息吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    console.log(`批量删除人员轨迹信息`)
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

    // 指令创建，单个
    createOrder = (item) => {
        this.props.commonStore.setSelectedTrackList([item])
        this.props.history.push('/instruction/add')
    }

    // 导入人员轨迹信息
    importItem = () => {
        console.log('importItem')
        this.setState({
            modalVisible: true,
            modalTitle: "导入人员轨迹信息"
        })
    }

    // 文件选择回调
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        let fileList = e.fileList.slice(-1)
        return e && fileList;
    }

    // 导入模板下载
    downloadTemp = () => {
        console.log('downloadTemp')
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
        let { modalTitle } = this.state
        if (modalTitle == '导入人员轨迹信息') {
            this.uploadFormRef.current.validateFields()
                .then(values => {
                    console.log(values)
                    this.modalCancel()
                })
        }
    }

    // 轨迹信息删除
    deleteItemConfirm = (item) => {
        console.log(item)
        request.delete(`${API.Track.track}${item.id}/`)
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
    addTrack = () => {
        this.props.history.push('/persontract/add')
    }

    // 进入轨迹详情页面
    toDetail = (item) => {
        this.props.history.push(`/persontract/${item.id}`)
    }

    getList = () => {
        request.get(API.Track.track)
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
        const { itemSelected, batchValue, modalTitle, modalVisible, pageInfo, list } = this.state
        let breadlist = [
            { text: '人员管理', link: '' },
            { text: '人员轨迹信息', link: '' }
        ]
        return (
            <div className="page-track">
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
                            <Button type="primary" style={{ width: 120, marginRight: '10px' }} onClick={this.addTrack}>+ 轨迹新增</Button>
                            <Button type="primary" style={{ width: 120, marginRight: '10px' }} onClick={this.importItem}>+ 导入</Button>
                            <span>批量操作：</span>
                            <Select style={{ width: 120 }}
                                onChange={this.batchChange}
                                placeholder="请选择"
                                disabled={itemSelected && itemSelected.length ? false : true}
                                value={batchValue}
                            >
                                <Option value="指令创建">指令创建</Option>
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
                <Modal
                    getContainer={false}
                    title={modalTitle || '标题'}
                    visible={modalVisible}
                    onOk={this.modalOk}
                    onCancel={this.modalCancel}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName="index-modal"
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                        name="upload-form"
                        ref={this.uploadFormRef}
                    >
                        <Form.Item
                            name="upload"
                            label="导入文件"
                            rules={[{ required: true, message: '请选择文件' }]}
                            valuePropName="fileList"
                            getValueFromEvent={this.normFile}
                        >
                            <Upload
                                name="uploadfile"
                            >
                                <Button><i className="iconfont">&#xe621;</i>&nbsp;上传文件</Button>
                            </Upload>
                        </Form.Item>
                        <span onClick={this.downloadTemp} style={{ marginLeft: '10px', color: '#1890ff', cursor: 'pointer' }}>下载模板</span>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Track;