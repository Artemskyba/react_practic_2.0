import { Component } from 'react';
import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    isLoading: false,
    error: null,
    isEmpty: false,
    isVisible: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.getPhotos(query, page);
    }
  }

  getPhotos = async (query, page) => {
    if (!query) {
      return;
    }
    this.setState({ isLoading: true })

    try {
      const { photos, total_results, page: currentPage, per_page } = await ImageService.getImages(query, page);
      
      if (photos.length === 0) {
        this.setState({ isEmpty: true });
      } 

      this.setState(prevState => ({ images: [...prevState.images, ...photos], isVisible: currentPage < Math.ceil(total_results / per_page) }));

    } catch (error) {
      this.setState({ error });

    } finally { 
      this.setState({ isLoading: false });
    }
  }

  onHandleSubmit = value => {
    this.setState({ query: value });
  };

  render() {
    const { query } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      </>
    );
  }
}
