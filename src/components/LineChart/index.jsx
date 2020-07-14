import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';

const data = [
    { name: '已发送指令', time: '20200712', num: 18 },
    { name: '已完成指令', time: '20200712', num: 12 },
    { name: '待处理指令', time: '20200712', num: 12 }
];

class LineChart extends Component {

    componentDidMount() {
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 300,
        });
        this.chart.data(data);
        this.chart.scale('num', {
            nice: true,
        });
        this.chart.tooltip({
            showMarkers: false,
            shared: true,
        });

        this.chart
            .interval()
            .position('time*num')
            .color('name')
            .adjust([
                {
                    type: 'dodge',
                    marginRatio: 0, // 分组中各个柱子之间不留空隙
                }
            ]);

        this.chart.interaction('active-region');
        this.chart.render();
    }

    render() {
        const { title } = this.props
        return (
            <div className="comp-linechart">
                <div className="title">{title}</div>
                <div ref="chart"></div>
            </div>
        );
    }
}

export default LineChart;