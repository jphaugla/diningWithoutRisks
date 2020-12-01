import React from "react";
import "./styles/productRow.css";
import { API } from "aws-amplify";
import { MenuItem } from "../modules/bestSellers/BestSellerProductRow";
import { Order } from "../modules/cart/CartProductRow";

interface ProductRowProps {
  order: Order;
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
          <div className="media-body">
            <h3 className="media-heading">{this.state.menuItem.menuName}
              <div className="pull-right margin-1">
                <small>{`${this.props.order.quantity}`}</small>
              </div>
            </h3>
            <small>{this.state.menuItem.name}</small>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRow;


