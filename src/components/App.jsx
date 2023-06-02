// App.jsx

import React from 'react';
import Layout from './layout';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import { LoaderWrapper } from './App.styled';
import Swal from 'sweetalert2';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '18445929-e575d6623fb59f5ed7bcd7f03';
const PER_PAGE = 12;
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

  componentDidUpdate(prevProps, { searchQuery: prevSearchQuery }) {
    const { searchQuery } = this.state;
    if (prevSearchQuery !== searchQuery) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { images, searchQuery, currentPage } = this.state;
    this.setState({ loading: true });

    try {
      if (images.length < MAX_IMAGES) {
        const response = await axios.get(
          `${BASE_URL}?q=${searchQuery}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
        );

        if (response.data.hits.length === 0) {
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
          const newImages = [...prevState.images, ...response.data.hits];
          const newCurrentPage = prevState.currentPage + 1;
          const hasMoreImages =
            response.data.hits.length === PER_PAGE &&
            newImages.length < MAX_IMAGES;
          return {
            images: newImages,
            currentPage: newCurrentPage,
            hasMoreImages,
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
      fetchImages,
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
          <Button onClick={fetchImages} />
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
