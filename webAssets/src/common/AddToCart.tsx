import React from 'react';
import { API } from 'aws-amplify';
import { Redirect } from 'react-router';
import { Glyphicon } from 'react-bootstrap';

interface AddToCartProps {
  bookId: string;
  price: number;
  variant?: string;
}

interface AddToCartState {
  loading: boolean;
  toCart: boolean;
  toTable: boolean;
}

class AddToCart extends React.Component<AddToCartProps, AddToCartState> {
  constructor(props: AddToCartProps) {
    super(props);

    this.state = {
      loading: false,
      toCart: false,
      toTable: false,
    };
  }

  onAddToCart = async () => {
    this.setState({ loading: true });
    const bookInCart = await API.get("cart", `/cart/${this.props.bookId}`, null);
    const table = await API.get("table", "/table", null);
    if (table) {

      // if the book already exists in the cart, increase the quantity
      if (bookInCart) {
        API.put("cart", "/cart", {
          body: {
            bookId: this.props.bookId,
            quantity: bookInCart.quantity + 1,
            tableId: table.tableId,
          }
        }).then(() => this.setState({
          toCart: true
        }));
      }

      // if the book does not exist in the cart, add it
      else {
        API.post("cart", "/cart", {
          body: {
            bookId: this.props.bookId,
            price: this.props.price,
            quantity: 1,
            tableId: table.tableId,
          }
        }).then(() => this.setState({
          toCart: true
        }));
      }
    } else {
      //  table id not set yet so want to redirect to table-not currently working...
      this.state = { toTable: true, loading: true, toCart: false};
    }
  }
  getVariant = () => {
    let style = "btn btn-black"
    return this.props.variant && this.props.variant === "center" ? style + ` btn-black-center` : style + ` pull-right`;
  }

  render() {
    if (this.state.toTable) 
      return <Redirect to='/table' />
    if (this.state.toCart) 
      return <Redirect to='/cart' />
    
  
    return (
      <button 
        className={this.getVariant()} 
        disabled={this.state.loading}
        type="button" 
        onClick={this.onAddToCart}>
        {this.state.loading && <Glyphicon glyph="refresh" className="spinning" />}
        {this.props.variant === "buyAgain" ? `Buy Again` : `Add to Cart`}
      </button>
    );
  }
}

export default AddToCart;