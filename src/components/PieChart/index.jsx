import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';

class PieChart extends Component {

    componentDidMount() {
        let data = this.props.data
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

    componentDidUpdate() {
        let data = this.props.data
        this.chart.changeData(data);
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