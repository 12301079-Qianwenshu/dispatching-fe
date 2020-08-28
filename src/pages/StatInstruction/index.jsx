import React, { Component } from 'react';
import { Button, Select, Input, Table, Tag, Modal, Form, Upload, Popconfirm, message, Breadcrumb, DatePicker } from 'antd';
import './index.scss'
import Card from '../../components/Card/index'
import LineChart from '../../components/LineChart/index'
import RadarChart from '../../components/RadarChart/index'
import request from '../../utils/request'
import API from '../../api/index'
import moment from 'moment';

const { RangePicker } = DatePicker;

class Statinstruction extends Component {

    state = {
        active: 0,
        rangeData: [],
        statisticNum: null,
        trendData: []
    }

    // 指令数据统计
    commandStatistics = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.command_statistics, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    let result = {}
                    if (res.data && res.data.length > 0) {
                        res.data.forEach((item) => {
                            result[item.item] = item.count
                        })
                    }
                    this.setState({
                        statisticNum: result
                    })
                }
            })
    }

    // 指令数据趋势
    commandTrends = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.command_trends, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    this.setState({
                        trendData: res.data
                    })
                }
            })
    }

    activeChange = (value) => {
        this.setState({
            active: value,
            rangeData: []
        })
        this.commandStatistics(value)
        this.commandTrends(value)
    }

    rangeChange = (value) => {
        let start = moment(value[0].format('YYYY-MM-DD'))._i
        let end = moment(value[1].format('YYYY-MM-DD'))._i
        this.setState({
            active: '',
            rangeData: value
        })
        this.commandStatistics(0, start, end)
        this.commandTrends(0, start, end)
    }

    componentDidMount() {
        this.commandStatistics()
        this.commandTrends()
    }

    render() {
        const { active, statisticNum, trendData } = this.state
        let breadlist = [
            { text: '统计分析', link: '' },
            { text: '指令统计', link: '' }
        ]

        console.log(statisticNum)

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
                        <span className={active == 0 ? 'active' : ""} onClick={() => this.activeChange(0)}>今日</span>
                        <span className={active == 6 ? 'active' : ""} onClick={() => this.activeChange(6)}>本周</span>
                        <span className={active == 29 ? 'active' : ""} onClick={() => this.activeChange(29)}>本月</span>
                        <span className={active == 365 ? 'active' : ""} onClick={() => this.activeChange(365)}>全年</span>
                        <RangePicker onChange={this.rangeChange} allowClear={false} />
                    </div>
                    <div className="maincont">
                        <div className="left">
                            <div className="cards">
                                {
                                    statisticNum && Object.keys(statisticNum).length > 0 &&
                                    Object.keys(statisticNum).map((item, i) => {
                                        return (
                                            <Card icon="&#xe661" key={i} title={`${item}指令数`} data={statisticNum[item]} color="#1890ff" />
                                        )
                                    })
                                }
                            </div>
                            <LineChart title="指令数据趋势" data={trendData} />
                        </div>
                        {/** 
                            <div className="right">
                                <RadarChart title="指令传达 & 执行指数" />
                            </div>
                        */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Statinstruction;