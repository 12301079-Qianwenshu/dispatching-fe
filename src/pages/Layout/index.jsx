import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from '../../components/Header/index'
import './index.scss'

class Layout extends Component {

    render() {
        return (
            <div className="page-layout">
                <Header />
                <div className="cont">{this.props.children}</div>
            </div>
        );
    }
}

export default withRouter(Layout);

