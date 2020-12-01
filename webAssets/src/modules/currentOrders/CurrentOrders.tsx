import React, { Component } from "react";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
import "../../common/hero/hero.css";
import { PurchasedProductRow } from "../pastPurchases/PurchasedProductRow";
import { Auth, API } from "aws-amplify";
import bestSellers from "../../images/bestSellers.png";
import yourshoppingcart from "../../images/yourshoppingcart.png";
import { Order } from "../cart/CartProductRow";
import UpdateOrder  from "./UpdateCurrentOrder";

interface CurrentOrdersProps {}

const merge = require('deepmerge');

interface currentOrders {
  orderDate: number;
  orderStatus: string;
  orderComplete: number;
  orderDelivered: number;
  orderPaid: number;
  orderId: string;
  books: Order[];
  customerId: string;
}

interface CurrentOrdersState {
  userInfo: any; // FIXME
  isLoading: boolean;
  orders: currentOrders[];
}

export default class CurrentOrders extends Component<CurrentOrdersProps, CurrentOrdersState> {
  constructor(props: CurrentOrdersProps) {
    super(props);

    this.state = {
      userInfo: null,
      isLoading: true,
      orders: []
    };
  }

  async componentDidMount() {
    const userInfo = await Auth.currentUserInfo();
    this.setState({ userInfo })

    try {
      const ordersEntered= await this.listOrders("Entered");
      const ordersComplete = await this.listOrders("Complete");
      const ordersDelivered = await this.listOrders("Delivered");
      const orderstemp = merge(ordersEntered, ordersComplete);
      const orders = merge(orderstemp, ordersDelivered);
      this.setState({ 
        orders: orders,
        isLoading: false
     });
    } catch (e) {
      alert(e);
    }
  }

  listOrders(orderStat: string) {
    return API.get("orders", `/orders?orderStatus=${orderStat}`, null);
  }
  

  getPrettyDate = (dateLabel: string, orderDate: number) => {
    if (orderDate) {
        const date = new Date(orderDate);
        // getmonth starts at 0
        return ` ${dateLabel}  ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
        
    } else {
        return " ";  
    }
  }
  getOrderTotal = (inorder: Order[]) => {
    return ` $${inorder.reduce((total, book) => {
      return total + book.price * book.quantity;
    }, 0).toFixed(2).toString()}`;
  }

  render() {

    return (
      <div className="Category">
        <CategoryNavBar />
        <div className="well-bs col-md-12">
          {this.state.userInfo && <div className="white-box no-margin-top">
            <h3>{`Hello ${this.state.userInfo.attributes.email}!`}</h3>
          </div>}
          <div className="white-box">
            <h3>Current Orders</h3>
          </div>
          {!this.state.isLoading && this.state.orders && this.state.orders
            .sort((order1, order2) => order2.orderDate - order1.orderDate)
            .map(order => 
              <div className="order-date" key={order.orderId}>
                <h4>{`Order Status: ${order.orderStatus} Order Amount: ${this.getOrderTotal(order.books)}`}</h4>
                <h4>{`${this.getPrettyDate("Entered Date: ",order.orderDate)}  ${this.getPrettyDate("Delivered Date: ",order.orderDelivered)}`}</h4>
                  <UpdateOrder orderId={order.orderId} customerId={order.customerId} orderStatus={order.orderStatus} 
                         orderComplete={order.orderComplete} orderDelivered={order.orderDelivered} variant="center" />
                   {order.books.map((book) => <PurchasedProductRow order={book} key={book.bookId} />)}
                 </div>)
          }
          <div className="well-bs no-margin-top no-padding col-md-12">
          <a href="/best"><img src={bestSellers} alt="Best sellers" className="checkout-img no-padding" /></a>
          <a href="/cart"><img src={yourshoppingcart} alt="Shopping cart" className="checkout-img no-padding" /></a>
          
          </div>
        </div>
      </div>
    );
  }
}