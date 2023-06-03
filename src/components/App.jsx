// App.jsx

import React from 'react';
import Layout from './layout';
import { ThreeDots } from 'react-loader-spinner';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import { LoaderWrapper } from './App.styled';
import Swal from 'sweetalert2';

import { fetchImages } from 'utils/api';
const MAX_IMAGES = 500;

class App extends React.Component {
  state = {
    images: [],
    loading: false,
    error: null,
    searchQuery: '',
    currentPage: 1,
    largeImage: null,
    showModal: false,
    isLargeImageLoaded: false,
    hasMoreImages: true,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery } = this.state;
    if (prevState.searchQuery !== searchQuery) {
      this.fetchImages();
    }
  }

  fetchImages = async (page = this.state.currentPage) => {
    const { images, searchQuery } = this.state;
    this.setState({ loading: true });

    try {
      if (images.length < MAX_IMAGES) {
        const data = await fetchImages(searchQuery, page);

        if (data.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: `No images found for ${searchQuery}. Please try another query.`,
            timer: 3000,
          });
          this.setState({ loading: false });
          return;
        }
        this.setState(prevState => {
          const newImages = [...prevState.images, ...data];
          const hasMoreImages = newImages.length < MAX_IMAGES;
          return {
            images: newImages,
            hasMoreImages,
            currentPage: page,
          };
        });
      } else {
        this.setState({ hasMoreImages: false });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ hasMoreImages: false });
      } else {
        this.setState({ error: true });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearchSubmit = newQuery => {
    const trimmedNewQuery = newQuery.trim();
    const { searchQuery } = this.state;

    if (trimmedNewQuery.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Search query cannot be empty. Please enter a valid search query.',
        timer: 3000,
      });
      return;
    }

    if (trimmedNewQuery !== searchQuery) {
      this.setState({
        searchQuery: trimmedNewQuery,
        images: [],
        currentPage: 1,
        error: null,
        hasMoreImages: true,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'You entered the same search query. Please enter a new one.',
        timer: 3000,
      });
    }
  };

  loadMoreImages = () => {
    this.fetchImages(this.state.currentPage + 1);
  };

  openModal = image => {
    this.setState({
      largeImage: image,
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      largeImage: null,
      showModal: false,
      isLargeImageLoaded: false,
    });
  };

  handleImageLoad = () => {
    this.setState({ isLargeImageLoaded: true });
  };

  render() {
    const {
      state: {
        images,
        loading,
        error,
        largeImage,
        showModal,
        isLargeImageLoaded,
        hasMoreImages,
      },
      handleSearchSubmit,
      openModal,
      loadMoreImages,
      closeModal,
      handleImageLoad,
    } = this;

    return (
      <Layout className="App">
        <Searchbar onSubmit={handleSearchSubmit} isSubmitting={loading} />
        {error && <p>Something went wrong...</p>}

        <ImageGallery images={images} onImageClick={openModal} />

        {loading && (
          <LoaderWrapper>
            <ThreeDots color="#00BFFF" height={80} width={80} />
          </LoaderWrapper>
        )}
        {!loading && images.length > 0 && hasMoreImages && (
          <Button onClick={loadMoreImages} />
        )}

        {showModal && (
          <Modal
            onClose={closeModal}
            largeImageURL={largeImage.largeImageURL}
            isLargeImageLoaded={isLargeImageLoaded}
            onImageLoad={handleImageLoad}
          />
        )}
      </Layout>
    );
  }
}

export default App;
