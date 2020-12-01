import React from "react";
import "../../common/styles/gallery.css";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import CategoryGalleryBook from "./CategoryGalleryBook";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

interface CategoryGalleryTeaserProps {}

interface CategoryGalleryTeaserState {
  isLoading: boolean;
  menuItems: MenuItem[];
}

export class CategoryGalleryTeaser extends React.Component<CategoryGalleryTeaserProps, CategoryGalleryTeaserState> {
  constructor(props: CategoryGalleryTeaserProps) {
    super(props);

    this.state = {
      isLoading: true,
      menuItems: []
    };
  }

  async componentDidMount() {
    try {
      const menuItems = await this.listMenuItems();
      this.setState({ menuItems });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  listMenuItems() {
    return API.get("menuitem", "/menuitem?category=Appeteasers", null);
  }

  render() {
    return (
      this.state.isLoading ? <div className="loader" /> :
      <div>
        <div className="well-bs no-padding-top col-md-12 no-radius">
          <div className="container-category">
            <h3>Appeteasers <small><LinkContainer to="/category/Appeteasers"><a>Browse Appeteasers</a></LinkContainer></small></h3>
            <div className="row">
              {this.state.menuItems.slice(0,4).map(menuItem => <CategoryGalleryBook menuItem={menuItem} key={menuItem.id} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryGalleryTeaser;