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
        let data = this.props.data
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
            showMarkers: true,
            shared: true,
            showCrosshairs: true,
        });

        this.chart
            .line()
            .position('time*num')
            .color('name')
            .shape('smooth')

        this.chart
            .point()
            .position('time*num')
            .color('name')
            .shape('circle');

        this.chart.interaction('active-region');
        this.chart.render();
    }

    componentDidUpdate() {
        let data = this.props.data
        this.chart.changeData(data);
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