import React from "react";
import "../../common/styles/gallery.css";
import { API } from "aws-amplify";
import CategoryGalleryBook from "./CategoryGalleryBook";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

interface CategoryGalleryProps {
  match: any;
}

interface CategoryGalleryState {
  isLoading: boolean;
  menuItems: MenuItem[];
}

export class CategoryGallery extends React.Component<CategoryGalleryProps, CategoryGalleryState> {
  constructor(props: CategoryGalleryProps) {
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
    return API.get("menuitem", `/menuitem?category=${this.props.match.params.id}`, null);
  }

  render() {
    return (
      this.state.isLoading ? <div className="loader" /> :
      <div>
        <div className="well-bs no-radius">
          <div className="container-category">
            <h3>{this.props.match.params.id}</h3>
            <div className="row" >
              {this.state.menuItems.map(menuItem => <CategoryGalleryBook menuItem={menuItem} key={menuItem.id} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryGallery;