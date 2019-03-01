import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Createportal from './CreatePortal';
import './index.less';

// 屏幕宽度
const screenWidth = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
// 预设距离，当滑动距离大于这个数值，就会构成了下一页条件
const DISTX = 50;
// 预设时间
const DURATION = 200;
// 动画的速度
const SPEED = 10;
// 动画曲线
const Quad = (t, b, c, d) => {
  // eslint-disable-next-line
  return (-c * (t /= d) * (t - 2) + b);
};

export default class PreviewImage extends PureComponent {
  static propTypes = {
    // 资源
    source: PropTypes.array,
    // 是否展示
    visible: PropTypes.bool,
    // 是否展示指示器
    visibleIndicator: PropTypes.bool,
    // 展示图片在列表中的下标索引值
    index: PropTypes.number,
    // 关闭展示
    onHide: PropTypes.func,
    // 指示器的样式
    indicatorStyle: PropTypes.object,
  }

  static defaultProps = {
    source: [],
    visible: false,
    visibleIndicator: true,
    index: 0,
    onHide: () => {},
    indicatorStyle: {
      top: '50px',
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      // 重新渲染次数
      rerenders: 0,
      // 是否展示内容
      visible: props.visible,
      // 组件是否即将隐藏 true表示即将隐藏 false是常态
      willClose: false,
      // 当前展示那一张图片 从0 开始
      index: props.index,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, index } = nextProps;
    if (prevState.rerenders === 0 && visible) {
      return {
        rerenders: prevState.rerenders + 1,
        visible: true,
        index,
      };
    } else if (prevState.visible !== visible) {
      return {
        visible,
        index,
      };
    }
    return null;
  }

  componentWillUnMount() {
    this.clearTimer();
  }

  // 清理定时器
  clearTimer = () => {
    if (!this.interval) return;
    clearTimeout(this.interval);
    this.interval = null;
  }

  // 动画过度效果
  animation = (idx) => {
    const { index } = this.state;
    // 动画执行的次数
    let start = 0;
    // 动画当前所处的位置
    const currentPos = this.currentPos || index * screenWidth;
    // 动画的偏移量 = 目标位置 - 当前位置
    const offset = idx * screenWidth - currentPos;
    // 动画会执行多少次，取整
    const during = Math.abs(offset) / SPEED;
    const run = () => {
      start += 1;
      let dist = Math.ceil(Quad(start, currentPos, offset, during));
      // 这么做是为了避免最后滚动到的位置和预期的位置有偏差
      if (start + 1 >= during) {
        dist = idx * screenWidth;
      }
      this.wrapper.style.transform = `translate3d(${-dist}px, 0, 0)`;
      this.wrapper.style.webkitTransform = `translate3d(${-dist}px, 0, 0)`;
      if (start < during) {
        requestAnimationFrame(run);
      }
    };
    // 如果不构成翻页的情况，那么动画回弹到原型位置，不在往下进行
    if (idx === index) {
      run();
      return;
    }

    this.setState({ index: idx }, () => run());
  }

  handleTouchStart = (event) => {
    // 滑动开始的时间
    this.stateTimer = new Date();
    this.clientX = event.touches[0].clientX;
    this.clientY = event.touches[0].clientY;
  }

  handleTouchMove = (event) => {
    const { clientX } = event.changedTouches[0];
    // 计算偏移距离
    const distX = clientX - this.clientX;
    const { index } = this.state;
    // 计算当前图片的位置
    this.currentPos = index * screenWidth - distX;
    this.wrapper.style.transform = `translate3d(${-this.currentPos}px, 0, 0)`;
    this.wrapper.style.webkitTransform = `translate3d(${-this.currentPos}px, 0, 0)`;
    // 阻止默认行为传递，不让父元素跟随滚动
    event.preventDefault();
  }

  handleTouchEnd = (event) => {
    // 当前图片的索引
    const { index } = this.state;
    // 一共多少张图片 还要再减去1
    const len = this.props.source.length - 1;
    // 滑动持续的时间
    const duration = new Date() - this.stateTimer;
    // 获取当前滑块的位置
    const { clientX } = event.changedTouches[0];
    // 相对touchStart的偏移量
    const distX = clientX - this.clientX;

    // 当前是第一张图片且是向右滑动 或者 当前是最后张图片且是向左滑动
    if ((index === 0 && distX > 0) || (index === len && distX < 0)) {
      this.animation(index);
      this.currentPos = null;
      return;
    }

    // duration如果小于预先设定的时间那么就属于快速滑动时
    if (duration <= DURATION) {
      if (distX > 0) {
        this.animation(index - 1);
      } else if (distX < 0) {
        this.animation(index + 1);
      }
    } else {
      // 往右边滑动
      if (distX >= DISTX) {
        this.animation(index - 1);
      } else if (distX > 0 && distX < DISTX) {
        this.animation(index);
      }
      // 往左边滑动
      if (distX <= -DISTX) {
        this.animation(index + 1);
      } else if (distX < 0 && distX > -DISTX) {
        this.animation(index);
      }
    }
  }

  handleClose = (event) => {
    // 组织默认行为，双击图片会放大，不希望有这种情况出现，组织默认行为
    event.preventDefault();
    this.clearTimer();
    const { onHide } = this.props;
    this.setState({ willClose: true });
    this.interval = setTimeout(() => {
      this.setState({ willClose: false });
      onHide();
    }, 500);
  }

  render() {
    const { rerenders, visible, index, willClose } = this.state;
    const { source, visibleIndicator, indicatorStyle } = this.props;
    // 页面初始化的时候不跟随页面一同渲染，只在第一次展示的时候渲染，后面不会自动销毁组件
    if (rerenders === 0) return null;
    return (
      <Createportal>
        <div
          className={`react-preview-image ${willClose ? 'hide' : ''}`}
          onClick={this.handleClose}
          style={{ display: visible ? 'block' : 'none' }}
        >
          <div
            className="react-preview-image-wrapper"
            style={{
              width: `${source.length * screenWidth}px`,
              transform: `translate3d(-${index * screenWidth}px, 0, 0)`,
              WebkitTransform: `translate3d(-${index * screenWidth}px, 0, 0)`,
            }}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            ref={ref => this.wrapper = ref}
          >
            {
              source.map((item, idx) =>
                <div
                  className="wrapper-item"
                  // eslint-disable-next-line
                  key={idx}
                  style={{ width: `${screenWidth}px` }}
                >
                  <img
                    src={item}
                    alt="tupian"
                    className={`wrapper-item-img ${willClose ? 'scale' : ''}`}
                  />
                </div>
              )
            }
          </div>
          {
            visibleIndicator &&
              <div
                className="react-preview-image-indicator"
                style={indicatorStyle}
              >
                {`${index + 1} / ${source.length}`}
              </div>
          }
        </div>
      </Createportal>
    );
  }
}
