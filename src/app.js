import React, { PureComponent } from 'react';
import img1 from './static/images/11.jpg';
import img2 from './static/images/12.jpg';
import img3 from './static/images/13.jpg';
import img4 from './static/images/14.jpg';
import img5 from './static/images/15.jpg';
import PreviewImage from './PreviewImage';
import './app.css';

const SOURCE = [img1, img2, img3, img4, img5];
const indicatorStyle = {
  bottom: '50px',
};
export default class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      // 是否展示 PreviewImage
      visible: false,
      // 点开后展示的是第一张图片
      // 0 表示第一张，默认第一张
      index: 0,
    };
  }

  handleTriggle = () => this.setState(prevState => ({ visible: !prevState.visible }))

  render() {
    const { visible, index } = this.state;
    return (
      <div className="container">
        <div className="button" onClick={this.handleTriggle}>展示</div>
        <PreviewImage
          source={SOURCE}
          index={index}
          visible={visible}
          indicatorStyle={indicatorStyle}
          onHide={this.handleTriggle}
        />
      </div>
    );
  }
}
