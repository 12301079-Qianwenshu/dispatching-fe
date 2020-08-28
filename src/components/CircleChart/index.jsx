import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';

class CircleChart extends Component {

    state = {
        data: this.props.data
    }

    componentDidMount() {
        let { data } = this.state
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 150,
        });
        this.chart.data(data);
        this.chart.legend(false);
        this.chart.tooltip(false)
        this.chart.facet('rect', {
            fields: ['type'],
            padding: 10,
            showTitle: false,
            eachView: (view, facet) => {
                const data = facet.data;
                let color;
                if (data[0].type === '正常') {
                    color = 'green';
                } else if (data[0].type === '自我观察') {
                    color = 'gold';
                } else if (data[0].type === '居家隔离') {
                    color = '#orange';
                } else if (data[0].type === '集中隔离') {
                    color = 'red';
                } else if (data[0].type === '医院隔离') {
                    color = 'purplr';
                }
                data.push({ type: '其他', value: 100 - data[0].value });
                view.data(data);
                view.coordinate('theta', {
                    radius: 1,
                    innerRadius: 0.7
                });
                view
                    .interval()
                    .adjust('stack')
                    .position('value')
                    .color('type', [color, '#eceef1'])
                    .style({
                        opacity: 1,
                    });
                view.annotation().text({
                    position: ['50%', '50%'],
                    content: data[0].type,
                    style: {
                        fontSize: 12,
                        fill: '#8c8c8c',
                        fontWeight: 300,
                        textBaseline: 'bottom',
                        textAlign: 'center'
                    },
                    offsetY: -10,
                });

                view.annotation().text({
                    position: ['50%', '50%'],
                    content: data[0].value,
                    style: {
                        fontSize: 18,
                        fill: '#000',
                        fontWeight: 500,
                        textAlign: 'center'
                    },
                    offsetY: 10,
                });
            }
        });
        this.chart.render();
    }

    componentDidUpdate() {
        let data = this.props.data
        this.chart.changeData(data);
        this.chart.render();
    }

    render() {
        return (
            <div className="comp-circlechart">
                <div ref="chart"></div>
            </div>
        );
    }
}

export default CircleChart;