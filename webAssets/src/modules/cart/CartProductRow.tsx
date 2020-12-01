import React from "react";
import "../../common/styles/productRow.css";
import { API } from "aws-amplify";
import StarRating from "../../common/starRating/StarRating";
import { Glyphicon } from "react-bootstrap";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

export interface Order {
  bookId: string;
  quantity: number;
  price: number
  tableId: string;
}

interface CartProductRowProps {
  order: Order;
  calculateTotal: () => void;
}

interface CartProductRowState {
  book: MenuItem | undefined;
  removeLoading: boolean;
}

export class CartProductRow extends React.Component<CartProductRowProps, CartProductRowState> {
  constructor(props: CartProductRowProps) {
    super(props);

    this.state = {
      book: undefined,
      removeLoading: false
    };
  }

  async componentDidMount() {
    try {
      const book = await this.getBook(this.props.order);
      this.setState({ book });
    } catch (e) {
      alert(e);
    }
  }

  getBook(order: Order) {
    return API.get("menuitem", `/menuitem/${order.bookId}`, null);
  }

  onRemove = async () => {
    this.setState({ removeLoading: true });
    await API.del("cart", "/cart", {
      body: {
        bookId: this.props.order.bookId,
      }
    });

    this.props.calculateTotal();
  }

  onQuantityUpdated = async (event: any) => {
    await API.put("cart", "/cart", {
      body: {
        bookId: this.props.order.bookId,
        quantity: parseInt(event.target.value, 10)
      }
    });
  }

  render() {
    if (!this.state.book) return null;

    return (
      <div className="white-box">
        <div className="media">
          <div className="media-left media-middle">
            <img className="media-object product-thumb" src={this.state.book.fullImage} alt={`${this.state.book.menuName} menuItem`} />
          </div>
          <div className="media-body">
            <h3 className="media-heading">{this.state.book.menuName}
              <div className="pull-right margin-1">
                <small>${this.state.book.usPrice}</small>
              </div>
            </h3>
            <h4> <small>{this.state.book.name}</small> </h4>
            <h4> <small>{this.state.book.category_name}</small></h4>
            <div>
              Rating
              <div className="pull-right">
                <div className="input-group">

                  <input type="number" className="form-control" placeholder="Quantity" defaultValue={this.props.order.quantity.toString()} onChange={this.onQuantityUpdated} min={1} />
                  <span className="input-group-btn">
                    <button className="btn btn-black" type="button" onClick={this.onRemove} disabled={this.state.removeLoading}>
                      {this.state.removeLoading && <Glyphicon glyph="refresh" className="spinning" />} 
                      Remove
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <p><StarRating stars={this.state.book.rating} /></p>
          </div>
        </div>
      </div>
    );
  }
}

export default CartProductRow;


