import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';

class BarChart extends Component {

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
            <div className="comp-barchart">
                <div className="title">{title}</div>
                <div ref="chart"></div>
            </div>
        );
    }
}

export default BarChart;