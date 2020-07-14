import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

const data = [
    { item: '完成率', value: 70 },
    { item: '签收率', value: 60 },
    { item: '处理率', value: 50 },
    { item: '撤回率', value: 40 },
    { item: '转发率', value: 60 }
];

const { DataView } = DataSet;
const dv = new DataView().source(data);
dv.transform({
    type: 'fold',
    fields: ['value'], // 展开字段集
    key: 'user', // key字段
    value: 'score', // value字段
});

class RadarChart extends Component {

    componentDidMount() {
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 438,
        });
        this.chart.data(dv.rows);
        this.chart.scale('score', {
            min: 0,
            max: 100,
        });
        this.chart.coordinate('polar', {
            radius: 0.7,
        });
        this.chart.tooltip({
            shared: true,
            showCrosshairs: true,
            crosshairs: {
                line: {
                    style: {
                        lineDash: [4, 4],
                        stroke: '#333'
                    }
                }
            }
        });
        this.chart.axis('item', {
            line: null,
            tickLine: null,
            grid: {
                line: {
                    style: {
                        lineDash: null,
                    },
                },
            },
        });
        this.chart.axis('score', {
            line: null,
            tickLine: null,
            grid: {
                line: {
                    type: 'line',
                    style: {
                        lineDash: null,
                    },
                },
            },
        });
        this.chart.legend(false);

        this.chart
            .line()
            .position('item*score')
            .color('user')
            .size(2);
        this.chart
            .point()
            .position('item*score')
            .color('user')
            .shape('circle')
            .size(4)
            .style({
                stroke: '#fff',
                lineWidth: 1,
                fillOpacity: 1,
            });
        this.chart
            .area()
            .position('item*score')
            .color('user')

        this.chart.render();
    }

    render() {
        const { title } = this.props
        return (
            <div className="comp-radarchart">
                <div className="title">{title}</div>
                <div ref="chart"></div>
            </div>
        );
    }
}

export default RadarChart;