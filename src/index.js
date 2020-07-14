/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-26 10:19:59
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-16 10:05:14
 */
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from "mobx-react";
import { ConfigProvider } from 'antd';
import './styles/normalize.css';
import 'antd/dist/antd.css';
import './styles/iconfont/iconfont.css';
import zhCN from 'antd/es/locale/zh_CN';
import App from './App';
import stores from './store/index'

ReactDom.render(
    <Provider {...stores}>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);
