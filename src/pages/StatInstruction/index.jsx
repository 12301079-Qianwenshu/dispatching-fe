import React, { Component } from 'react';
import { Button, Select, Input, Table, Tag, Modal, Form, Upload, Popconfirm, message, Breadcrumb, DatePicker } from 'antd';
import './index.scss'
import Card from '../../components/Card/index'
import LineChart from '../../components/LineChart/index'
import RadarChart from '../../components/RadarChart/index'

const { RangePicker } = DatePicker;

class Statinstruction extends Component {

    state = {
        active: "今日",
        rangeData: [],
        area: '全球'
    }

    activeChange = (value) => {
        this.setState({
            active: value
        })
    }

    rangeChange = (value) => {
        this.setState({
            active: '',
            rangeData: value
        })
    }

    render() {
        const { active } = this.state
        let breadlist = [
            { text: '统计分析', link: '' },
            { text: '指令统计', link: '' }
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
                    <div className="condition">
                        <span className={active == "今日" ? 'active' : ""} onClick={() => this.activeChange("今日")}>今日</span>
                        <span className={active == "本周" ? 'active' : ""} onClick={() => this.activeChange("本周")}>本周</span>
                        <span className={active == "本月" ? 'active' : ""} onClick={() => this.activeChange("本月")}>本月</span>
                        <span className={active == "全年" ? 'active' : ""} onClick={() => this.activeChange("全年")}>全年</span>
                        <RangePicker onChange={this.rangeChange} allowClear={false} />
                    </div>
                    <div className="maincont">
                        <div className="left">
                            <div className="cards">
                                <Card icon="&#xe661" title="已发送指令数" data="1234" color="#1890ff" />
                                <Card icon="&#xe60f" title="已完成指令数" data="1234" color="#13c2c2" />
                                <Card icon="&#xe66d" title="待处理指令数" data="1234" color="#2fc25b" />
                            </div>
                            <LineChart title="指令数据趋势" />
                        </div>
                        <div className="right">
                            <RadarChart title="指令传达 & 执行指数" />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Statinstruction;