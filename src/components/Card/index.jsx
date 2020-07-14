import React, { Component } from 'react';
import './index.scss'

class Card extends Component {
    render() {
        const { icon, title, data, color } = this.props
        return (
            <div className="comp-card">
                <i className="iconfont" dangerouslySetInnerHTML={{ __html: icon }} style={{ background: color }}></i>
                <div>
                    <div>{title}</div>
                    <div className="num">{data}</div>
                </div>
            </div>
        );
    }
}

export default Card;