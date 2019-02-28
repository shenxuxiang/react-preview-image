import ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CreatePortal extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor() {
    super();
    this.state = {};
    this.previewImage = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.previewImage);
  }

  componentWillUnmount() {
    document.body.removeChild(this.previewImage);
    this.previewImage = null;
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(
      children,
      this.previewImage,
    );
  }
}
