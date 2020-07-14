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

const { RangePicker } = DatePicker;

class Statperson extends Component {

    state = {
        active: "今日",
        rangeData: [],
        area: '贵州省'
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

    handleAreaChange = (e) => {
        this.setState({
            area: e.target.value
        })
    }

    render() {
        const { active, area } = this.state
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
                        <span className={active == "今日" ? 'active' : ""} onClick={() => this.activeChange("今日")}>今日</span>
                        <span className={active == "本周" ? 'active' : ""} onClick={() => this.activeChange("本周")}>本周</span>
                        <span className={active == "本月" ? 'active' : ""} onClick={() => this.activeChange("本月")}>本月</span>
                        <span className={active == "全年" ? 'active' : ""} onClick={() => this.activeChange("全年")}>全年</span>
                        <RangePicker onChange={this.rangeChange} allowClear={false} />
                    </div>
                    <div className="cards">
                        <Card icon="&#xe661" title="录入轨迹数" data="1234" color="#1890ff" />
                        <Card icon="&#xe60f" title="录入人员数" data="1234" color="#13c2c2" />
                        <Card icon="&#xe66d" title="核酸检测阴性数" data="1234" color="#2fc25b" />
                        <Card icon="&#xe63e" title="核酸检测阳性数" data="1234" color="#f04864" />
                    </div>
                    <div className="row1">
                        <BarChart title="管控数据趋势" />
                        <div>
                            <div className="title">健康码分布</div>
                            <div>
                                <CircleChart
                                    data={[{ type: '正常', value: 80 }, { type: '自我观察', value: 10 }, { type: '居家隔离', value: 3 }]} />
                                <CircleChart
                                    data={[{ type: '集中隔离', value: 7 }, { type: '医院隔离', value: 0 }]} />
                            </div>
                        </div>
                    </div>
                    <div className="row1">
                        <PieChart title="来黔人员类型分布" />
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
                            {area == "全球" ? <Map /> : null}
                            {area == "国内" ? <ChainMap /> : null}
                            {area == "贵州省" ? <GuizhouMap /> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Statperson;