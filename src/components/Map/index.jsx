import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

const mapData = require('../../constant/world.json')

const data = [
    { name: '已发送指令', time: '20200712', num: 18 },
    { name: '已完成指令', time: '20200712', num: 12 },
    { name: '待处理指令', time: '20200712', num: 12 }
];

class Map extends Component {

    componentDidMount() {
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 300,
        });
        this.chart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
        });
        // 同步度量
        this.chart.scale({
            longitude: {
                sync: true
            },
            latitude: {
                sync: true
            }
        });
        this.chart.axis(false);
        this.chart.legend('trend', {
            position: 'left'
        });

        // 绘制世界地图背景
        const ds = new DataSet();
        const worldMap = ds.createView('back')
            .source(mapData, {
                type: 'GeoJSON'
            });
        const worldMapView = this.chart.createView();
        worldMapView.data(worldMap.rows);
        worldMapView.tooltip(false);
        worldMapView.polygon().position('longitude*latitude').style({
            fill: '#fff',
            stroke: '#ccc',
            lineWidth: 1
        });

        // 可视化用户数据
        const userData = [
            { name: 'Russia', value: 86 },
            { name: 'Japan', value: 94 },
            { name: 'Mongolia', value: 98 },
            { name: 'Canada', value: 98 },
            { name: 'United Kingdom', value: 97 },
            { name: 'United States of America', value: 98 },
            { name: 'Brazil', value: 96 },
            { name: 'Argentina', value: 95 },
            { name: 'Algeria', value: 101 },
            { name: 'France', value: 94 },
            { name: 'Germany', value: 96 },
            { name: 'Ukraine', value: 86 },
            { name: 'Egypt', value: 102 },
            { name: 'South Africa', value: 101 },
            { name: 'India', value: 107 },
            { name: 'Australia', value: 99 },
            { name: 'Saudi Arabia', value: 130 },
            { name: 'Afghanistan', value: 106 },
            { name: 'Kazakhstan', value: 93 },
            { name: 'Indonesia', value: 101 }
        ];
        const userDv = ds.createView()
            .source(userData)
            .transform({
                geoDataView: worldMap,
                field: 'name',
                type: 'geo.region',
                as: ['longitude', 'latitude']
            })
            .transform({
                type: 'map',
                callback: obj => {
                    obj.trend = obj.value
                    return obj;
                }
            });
        const userView = this.chart.createView();
        userView.data(userDv.rows);
        userView.scale({
            trend: {
                alias: '来黔人数'
            }
        });
        userView.polygon()
            .position('longitude*latitude')
            .color('trend', ['#0A61D7', '#F51D27'])
            .tooltip('name*trend')
            .style({
                fillOpacity: 0.85
            })
            .animate({
                leave: {
                    animation: 'fade-out'
                }
            });
        userView.interaction('element-active');

        this.chart.render();
    }

    render() {
        return (
            <div className="comp-map">
                <div ref="chart"></div>
            </div>
        );
    }
}

export default Map;