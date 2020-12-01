import React from "react";
import "../../common/styles/productRow.css";
import StarRating from "../../common/starRating/StarRating";
import { API } from "aws-amplify";
import AddToCart from "../../common/AddToCart";
import FriendRecommendations from "../../common/friendRecommendations/FriendRecommendations";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

interface ProductRowProps {
  itemId: string;
}

interface ProductRowState {
  menuItem: MenuItem | undefined;
}

export class ProductRow extends React.Component<ProductRowProps, ProductRowState> {
  constructor(props: ProductRowProps) {
    super(props);

    this.state = {
      menuItem: undefined,
    };
  }

  componentDidMount() {
    API.get("menuitem", `/menuitem/${this.props.itemId}`, null)
      .then(response => this.setState({ menuItem: response }))
      .catch(error => alert(error));
  }

  render() {
    if (!this.state.menuItem) return null;

    return (
      <div className="white-box">
        <div className="media">
          <div className="media-left media-middle no-padding">
            <img className="product-thumb border" src={this.state.menuItem.fullImage} alt={`${this.state.menuItem.name} cover`} />
          </div>
          <div className="media-body product-padding padding-20">
            <h3 className="media-heading">{this.state.menuItem.name}
              <small className="pull-right ">${this.state.menuItem.usPrice}</small>
            </h3>
            <p className="no-margin"><small>{this.state.menuItem.category_name}</small></p>
            <FriendRecommendations bookId={this.props.itemId} />
            <div>
              Rating
              <AddToCart bookId={this.state.menuItem.id} price={this.state.menuItem.usPrice} />
            </div>
            <StarRating stars={this.state.menuItem.position} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRow;


