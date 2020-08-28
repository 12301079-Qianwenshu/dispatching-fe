import React, { Component } from 'react';
import { Button, Select, Input, Table, Tag, Modal, Form, Upload, Popconfirm, message, Breadcrumb, DatePicker, Radio } from 'antd';
import Card from '../../components/Card/index'
import BarChart from '../../components/BarChart/index'
import CircleChart from '../../components/CircleChart/index'
import PieChart from '../../components/PieChart'
import Map from '../../components/Map/index'
import ChainMap from '../../components/ChainMap/index'
import GuizhouMap from '../../components/GuizhouMap/index'
import './index.scss'
import request from '../../utils/request'
import API from '../../api/index'
import moment from 'moment';

const { RangePicker } = DatePicker;

class Statperson extends Component {

    state = {
        active: 0,
        rangeData: [],
        area: '贵州省',
        statisticNum: null,
        inProvince: [],
        healthCode: null,
        trendData: [],
        global: [],
        china: [],
        guizhou: []
    }

    // 来黔人员数据统计
    personStatistics = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.person_statistics, { day, start_date, end_date })
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

    // 来黔人员类型分布
    inProvince = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.in_province, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    this.setState({
                        inProvince: res.data
                    })
                }
            })
    }

    // 人员健康码分布
    healthCode = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.health_code, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    let result = {}
                    if (res.data && res.data.length > 0) {
                        res.data.forEach((item) => {
                            result[item.item] = item.count
                        })
                    }
                    this.setState({
                        healthCode: result
                    })
                }
            })
    }

    // 管控数据趋势
    controlTrends = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.control_trends, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    this.setState({
                        trendData: res.data
                    })
                }
            })
    }

    // 人员地理信息分布
    geographicInfo = (day = 0, start_date = '0000-0-0', end_date = '0000-0-0') => {
        request.get(API.Statistics.geographic_info, { day, start_date, end_date })
            .then(res => {
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        let allData = res.data[0]
                        let global = allData['全球'] || []
                        let china = allData['国内'] || []
                        let guizhou = allData['贵州省'] || []
                        global = global.map((item) => {
                            return {
                                name: item.item[0],
                                value: item.count
                            }
                        })
                        china = china.map((item) => {
                            return {
                                name: item.item[0].indexOf(',') > -1 ? item.item[0].split(',')[0] : item.item[0].split('，')[0],
                                value: item.count
                            }
                        })
                        guizhou = guizhou.map((item) => {
                            return {
                                name: item.item[0].indexOf(',') > -1 ? item.item[0].split(',')[0] : item.item[0].split('，')[0],
                                value: item.count
                            }
                        })
                        this.setState({
                            global,
                            china,
                            guizhou
                        })
                    }
                }
            })
    }

    activeChange = (value) => {
        this.setState({
            active: value,
            rangeData: []
        })
        this.personStatistics(value)
        this.inProvince(value)
        this.healthCode(value)
        this.controlTrends(value)
        this.geographicInfo(value)
    }

    rangeChange = (value) => {
        let start = moment(value[0].format('YYYY-MM-DD'))._i
        let end = moment(value[1].format('YYYY-MM-DD'))._i
        this.setState({
            active: '',
            rangeData: value
        })
        this.personStatistics(0, start, end)
        this.inProvince(0, start, end)
        this.healthCode(0, start, end)
        this.controlTrends(0, start, end)
        this.geographicInfo(0, start, end)
    }

    handleAreaChange = (e) => {
        this.setState({
            area: e.target.value
        })
    }

    componentDidMount() {
        this.personStatistics()
        this.inProvince()
        this.healthCode()
        this.controlTrends()
        this.geographicInfo()
    }

    render() {
        const { active, area, statisticNum, rangeData, inProvince, healthCode, trendData, global, china, guizhou } = this.state
        let breadlist = [
            { text: '统计分析', link: '' },
            { text: '人员统计', link: '' }
        ]

        return (
            <div className="page-statperson">
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
                        <span className={active == 6 ? 'active' : ""} onClick={() => this.activeChange(6)}>近一周</span>
                        <span className={active == 29 ? 'active' : ""} onClick={() => this.activeChange(29)}>近一月</span>
                        <span className={active == 365 ? 'active' : ""} onClick={() => this.activeChange(365)}>近一年</span>
                        <RangePicker onChange={this.rangeChange} allowClear={false} value={rangeData} />
                    </div>
                    <div className="cards">
                        <Card icon="&#xe661" title="录入轨迹数" data={statisticNum && statisticNum['录入轨迹数']} color="#1890ff" />
                        <Card icon="&#xe60f" title="录入人员数" data={statisticNum && statisticNum['录入人员数']} color="#13c2c2" />
                        <Card icon="&#xe66d" title="核酸检测阴性数" data={statisticNum && statisticNum['核酸检测阴性数']} color="#2fc25b" />
                        <Card icon="&#xe63e" title="核酸检测阳性数" data={statisticNum && statisticNum['核酸检测阳性数']} color="#f04864" />
                    </div>
                    <div className="row1">
                        <BarChart title="管控数据趋势" data={trendData} />
                        <div>
                            <div className="title">健康码分布</div>
                            <div>
                                <CircleChart
                                    data={[{ type: '正常', value: healthCode && healthCode['正常'] || 0 }, { type: '自我观察', value: healthCode && healthCode['自我观察'] || 0 }, { type: '居家隔离', value: healthCode && healthCode['居家隔离'] }] || 0} />
                                <CircleChart
                                    data={[{ type: '集中隔离', value: healthCode && healthCode['集中隔离'] || 0 }, { type: '医院隔离', value: healthCode && healthCode['医院隔离'] || 0 }]} />
                            </div>
                        </div>
                    </div>
                    <div className="row1">
                        <PieChart title="来黔人员类型分布" data={inProvince} />
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="title" style={{ marginTop: "10px" }}>来黔人员地理位置分布</div>
                                <div>
                                    <Radio.Group onChange={this.handleAreaChange} value={area}>
                                        <Radio.Button value="全球">全球</Radio.Button>
                                        <Radio.Button value="国内">国内</Radio.Button>
                                        <Radio.Button value="贵州省">贵州省</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </div>
                            {area == "全球" ? <Map data={global} /> : null}
                            {area == "国内" ? <ChainMap data={china} /> : null}
                            {area == "贵州省" ? <GuizhouMap data={guizhou} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Statperson;