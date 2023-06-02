// Searchbar.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  SearchbarHeader,
  SearchForm,
  SearchButton,
  SearchButtonLabel,
  SearchInput,
  StyledIcon,
} from './Searchbar.styled';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class Searchbar extends React.Component {
  state = {
    inputValue: '',
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { onSubmit } = this.props;
    const { inputValue } = this.state;

    onSubmit(inputValue);
    this.setState({ inputValue: '' });
  };

  render() {
    const { inputValue } = this.state;
    const { isSubmitting } = this.props;
    return (
      <SearchbarHeader>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchButton disabled={isSubmitting} type="submit">
            <StyledIcon icon={faSearch} />
            <SearchButtonLabel>Search</SearchButtonLabel>
          </SearchButton>

          <SearchInput
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={inputValue}
            onChange={this.handleChange}
          />
        </SearchForm>
      </SearchbarHeader>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
