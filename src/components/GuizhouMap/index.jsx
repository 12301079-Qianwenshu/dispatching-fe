import React, { Component } from 'react';
import './index.scss'
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

const mapData = require('../../constant/guizhou.json')

class GuizhouMap extends Component {

    componentDidMount() {
        let dom = this.refs.chart
        this.chart = new Chart({
            container: dom,
            autoFit: true,
            height: 300,
            padding: [0, 80]
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
        // const userData = [
        //     { name: '贵阳市', value: 86 },
        // ];
        const userData = this.props.data
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

    componentDidUpdate() {
        this.chart.clear(); // 清理所有图形

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

        const userData = this.props.data
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
            <div className="comp-guizhoumap">
                <div ref="chart"></div>
            </div>
        );
    }
}

export default GuizhouMap;