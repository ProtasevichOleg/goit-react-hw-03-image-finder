// ImageGalleryItem.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { GalleryItem, GalleryImage } from './ImageGalleryItem.styled';

class ImageGalleryItem extends React.Component {
  handleClick = () => {
    const { image, onImageClick } = this.props;
    onImageClick(image);
  };

  render() {
    const { image } = this.props;

    return (
      <GalleryItem onClick={this.handleClick}>
        <GalleryImage
          src={image.webformatURL}
          alt={image.tags}
          className="ImageGalleryItem-image"
        />
      </GalleryItem>
    );
  }
}

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
