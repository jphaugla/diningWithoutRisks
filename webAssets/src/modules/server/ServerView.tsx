import React, { Component } from "react";
import "../../common/hero/hero.css";
import { Auth, API } from "aws-amplify";
import { Order } from "../cart/CartProductRow";
import UpdateOrder from "./UpdateServerOrder";
import { ProductRow } from "../../common/ProductRow";

interface CurrentOrdersProps {}

interface currentOrders {
  orderDate: number;
  orderStatus: string;
  orderComplete: number;
  orderDelivered: number;
  orderPaid: number;
  orderId: string;
  tableId: string;
  customerId: string;
  books: Order[];
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
      const orders = await this.listOrders();
      this.setState({ 
        orders: orders,
        isLoading: false
     });
    } catch (e) {
      alert(e);
    }
  }

  listOrders() {
    return API.get("orders", `/orders?orderStatus=Complete&seeAll=true`, null);
  }


  getPrettyDate = (orderDate: number) => {
    if (orderDate) {
        const date = new Date(orderDate);
        //  get month starts at 0
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
        
    } else {
        return 'NA';  
    }
  }


  render() {
    return (
      <div className="Server">
        <div className="well-bs col-md-12">
          <div className="white-box">
            <h3>Orders Completed to Be Delivered</h3>
          </div>
          {!this.state.isLoading && this.state.orders && this.state.orders
            .sort((order1, order2) => order2.orderDate - order1.orderDate)
            .map(order => 
              <div className="order-date" key={order.orderId}>
                <h4>{`Order ID: ${order.orderId} Order Status: ${order.orderStatus} `}</h4>
                <h4>{`Table ID: ${order.tableId} Order Date: ${this.getPrettyDate(order.orderDate)}`}</h4>
                <UpdateOrder orderId={order.orderId} customerId={order.customerId} variant="center" />
                {order.books.map((book) => <ProductRow order={book} key={book.bookId} />)}
              </div>)
              
          }
          <div className="well-bs no-margin-top no-padding col-md-12">
          
          </div>
        </div>
      </div>
    );
  }
}