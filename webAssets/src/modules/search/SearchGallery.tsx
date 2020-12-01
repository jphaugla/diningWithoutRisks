import React from "react";
import "../../common/styles/gallery.css";
import { API } from "aws-amplify";
import CategoryGalleryBook from "../category/CategoryGalleryBook";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

interface SearchGalleryProps {
  match: any;
}

interface SearchGalleryState {
  isLoading: boolean;
  menuItems: MenuItem[];
}

export class SearchGallery extends React.Component<SearchGalleryProps, SearchGalleryState> {
  constructor(props: SearchGalleryProps) {
    super(props);

    this.state = {
      isLoading: true,
      menuItems: []
    };
  }

  async componentDidMount() {
    try {
      const searchResults = await this.searchBooks();
      const menuItems = [];
      for (var i = 0; i < searchResults.hits.total; i++) {
        var hit = searchResults.hits.hits[i] && searchResults.hits.hits[i]._source;
        hit && menuItems.push({
          category_name: hit.category_name.S,
          fullImage: hit.fullImage.S,
          id: hit.id.S,
          name: hit.name.S,
          usPrice: hit.usPrice.N,
          description: hit.description.S,
          position: hit.position.N,
          consumable: hit.consumable.S,
          image: hit.image.S,
          menuId: hit.menuId.S,
          menuName: hit.menuName.S,
          rating: hit.rating.N,
        });
      }

      this.setState({ 
        menuItems: menuItems
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  searchBooks() {
    return API.get("search", `/search?q=${this.props.match.params.id}`, null);
  }

  render() {
    return (
      this.state.isLoading ? <div className="loader" /> :
      <div>
        <div className="well-bs no-radius">
          <div className="container-category">
            <h3>Search results</h3>
            <div className="row">
              {this.state.menuItems.map(menuItem => <CategoryGalleryBook menuItem={menuItem} key={menuItem.id} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchGallery;