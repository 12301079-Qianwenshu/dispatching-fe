import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';

const data = [
    { item: '境外来黔', count: 40, percent: 0.40 },
    { item: '国内来黔', count: 50, percent: 0.50 },
    { item: '其他', count: 10, percent: 0.10 },
];

class PieChart extends Component {

    componentDidMount() {
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 300,
        });
        this.chart.data(data);
        this.chart.coordinate('theta', {
            radius: 0.75,
        });
        this.chart.scale('percent', {
            formatter: (val) => {
                val = val * 100 + '%';
                return val;
            },
        });
        this.chart.tooltip({
            showTitle: false,
            showMarkers: false,
        });

        this.chart
            .interval()
            .position('percent')
            .color('item')
            .label('percent', {
                content: (data) => {
                    return `${data.item}: ${data.percent * 100}%`;
                },
            })
            .adjust('stack');

        this.chart.interaction('element-active');
        this.chart.render();
    }

    render() {
        const { title } = this.props
        return (
            <div className="comp-piechart">
                <div className="title">{title}</div>
                <div ref="chart"></div>
            </div>
        );
    }
}

export default PieChart;