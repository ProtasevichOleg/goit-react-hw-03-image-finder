// Modal.jsx

import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalEl, LargeImageStyled } from './Modal.styled';
import { ThreeDots } from 'react-loader-spinner';

const modalRoot = document.querySelector('#modal-root');

class Modal extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    const { onClose } = this.props;
    if (event.code === 'Escape') {
      onClose();
    }
  };

  handleBackdropClick = event => {
    const { onClose } = this.props;
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  render() {
    const { largeImageURL, isLargeImageLoaded, onImageLoad } = this.props;

    return createPortal(
      <Overlay onClick={this.handleBackdropClick}>
        <ModalEl>
          {!isLargeImageLoaded && (
            <ThreeDots color="#00BFFF" height={80} width={80} />
          )}
          <LargeImageStyled
            src={largeImageURL}
            alt=""
            onLoad={onImageLoad}
            isLargeImageLoaded={isLargeImageLoaded}
          />
        </ModalEl>
      </Overlay>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  isLargeImageLoaded: PropTypes.bool.isRequired,
  onImageLoad: PropTypes.func.isRequired,
};

export default Modal;
