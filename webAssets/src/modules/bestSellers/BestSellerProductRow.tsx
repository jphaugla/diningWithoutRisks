import React from "react";
import { API } from "aws-amplify";

import AddToCart from "../../common/AddToCart";
import StarRating from "../../common/starRating/StarRating";
import "../../common/styles/productRow.css";

interface ProductRowProps {
  menuItem: MenuItem;
}

export interface MenuItem {
  id: string;
  fullImage: string;
  category_name: string;
  name: string;
  description: string;
  usPrice: number;
  position: number;
  consumable: string;
  image: string;
  menuId: string;
  menuName: string;
  rating: number;
}

interface ProductRowState {
  menuItem: MenuItem | undefined;
}

export class ProductRow extends React.Component<ProductRowProps, ProductRowState> {
  constructor(props: ProductRowProps) {
    super(props);

    this.state = {
      menuItem: undefined
    };
  }

  async componentDidMount() {
    try {
      const menuItem = await this.getMenuItem(this.props.menuItem);
      this.setState({ menuItem });
    } catch (e) {
      alert(e);
    }
  }

  getMenuItem(menuItem: MenuItem) {
    return API.get("menuitem", `/menuitem/${menuItem.id}`, null);
  }

  render() {
    if (!this.state.menuItem) return null;

    return (
      <div className="white-box">
        <div className="media">
          <div className="media-left media-middle no-padding">
            <img className="media-object product-thumb" src={this.state.menuItem.fullImage} alt={`${this.state.menuItem.name} menupicture`} />
          </div>
          <div className="media-body product-padding padding-20">
            <h3 className="media-heading">{this.state.menuItem.menuName}
              <small className="pull-right margin-1"><h4>${this.state.menuItem.usPrice}</h4></small>
            </h3>
            <p><small>{this.state.menuItem.category_name}</small></p>
             <p><small>{this.state.menuItem.description}</small></p>
             <p><small>{this.state.menuItem.name}</small></p>
            <div>
              <AddToCart bookId={this.props.menuItem.id} price={this.state.menuItem.usPrice} />
            </div>
            <StarRating stars={this.state.menuItem.rating} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRow;


