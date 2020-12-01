import React from "react";
import "../../common/styles/productRow.css";
import StarRating from "../../common/starRating/StarRating";
import { API } from "aws-amplify";
import AddToCart from "../../common/AddToCart";
import { MenuItem } from "../bestSellers/BestSellerProductRow";
import { Order } from "../cart/CartProductRow";

interface PurchasedProductRowProps {
  order: Order;
}

interface PurchasedProductRowState {
  menuItem: MenuItem | undefined;
}

export class PurchasedProductRow extends React.Component<PurchasedProductRowProps, PurchasedProductRowState> {
  constructor(props: PurchasedProductRowProps) {
    super(props);

    this.state = {
      menuItem: undefined
    };
  }

  async componentDidMount() {
    try {
      const menuItem = await this.getMenuItem(this.props.order);
      this.setState({ menuItem });
    } catch (e) {
      alert(e);
    }
  }

  getMenuItem(order: Order) {
    return API.get("menuitem", `/menuitem/${order.bookId}`, null);
  }

  render() {
    if (!this.state.menuItem) {
      return (
        <div className="white-box">
          <div className="media">
            <div className="media-left media-middle">
              <div className="loader-no-margin" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="white-box">
        <div className="media">
          <div className="media-left media-middle">
            <img className="media-object product-thumb" src={this.state.menuItem.fullImage} alt={`${this.state.menuItem.name} items`} />
          </div>
          <div className="media-body">
            <h3 className="media-heading">{this.state.menuItem.menuName}
              <div className="pull-right margin-1">
                <small>{`${this.props.order.quantity} @ ${this.state.menuItem.usPrice}`}</small>
              </div>
            </h3>
            <small>{this.state.menuItem.category_name}</small>
            <small>{this.state.menuItem.name}</small>
            <div>
              Rating
              <AddToCart bookId={this.state.menuItem.id} price={this.state.menuItem.usPrice} variant="buyAgain" />
            </div>
            <StarRating stars={this.state.menuItem.rating} />
          </div>
        </div>
      </div>
    );
  }
}

export default PurchasedProductRow;


