import React, { Component } from "react";
import { CheckoutForm } from "./checkoutForm/CheckoutForm";

export default class Checkout extends Component {
  render() {
    return (
      <div>
        <div className="well-bs">
          <div className="white-box no-margin-top no-margin-bottom">
            <h3>Pay with Credit Card</h3>
          </div>
        </div>
        <CheckoutForm />
      </div>
    );
  }
}