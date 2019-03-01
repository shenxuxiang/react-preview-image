# react-preview-image

A light-weight React preview-image component with extremely easy API（只适用于移动端项目）. [Online Demo](https://shenxuxiang.github.io/react-preview-image/)

## Installation

```sh
npm install react-preview-image --save
```

## Usage

```js
import img1 from './static/images/11.jpg';
import img2 from './static/images/12.jpg';
import img3 from './static/images/13.jpg';
import img4 from './static/images/14.jpg';
import img5 from './static/images/15.jpg';
import PreviewImage from './PreviewImage';

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
      // 点开后展示的是第几张图片
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

```

## props


| param            | detail                                         | type     | default         |
| ---------------- | -----------------------------------------------| -------- | -------         |
| source           | store a collection of image src attributes     | array    | []              |
| visible          | whether to display components                  | bool     | false           |
| visibleIndicator | whether to display the indicator               | bool     | false           |
| index            | the subscript of the currently displayed image | number   | 0               |
| onHide           | how to close a component                       | function |                 |
| indicatorStyle   | add a style name to the indicator              | object   | { top: '50px' } |
