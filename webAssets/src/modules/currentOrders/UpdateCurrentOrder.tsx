import React from 'react';
import { API } from 'aws-amplify';
import { Redirect } from 'react-router';
import { Glyphicon } from 'react-bootstrap';


interface UpdateOrderProps {
  orderId: string;
  customerId: string;
  orderStatus: string;
  orderComplete: number;
  orderDelivered: number;
  variant?: string;
}

interface UpdateOrderState {
  loading: boolean;
  setEntered: boolean;
}

class UpdateOrder extends React.Component<UpdateOrderProps, UpdateOrderState> {
  constructor(props: UpdateOrderProps) {
    super(props);

    this.state = {
      loading: false,
      setEntered: false
    };
  }

  onUpdateOrder = async () => {
    this.setState({ loading: true });
        // `/menuitem?category=${this.props.match.params.id}`
        // eturn API.get("menuitem", `/menuitem/${menuItem.id}`, null);
    API.put("orders", `/orders/${this.props.orderId}`,
      {body: {
        customerId: this.props.customerId,
        orderStatus: "Paid",
      }
      }).then(() => this.setState({
        setEntered: true
      }));
  }

  getVariant = () => {
    let style = "btn btn-black"
    return this.props.variant && this.props.variant === "center" ? style + ` btn-black-center` : style + ` pull-right`;
  }


  render() {
    if (this.state.setEntered) return <Redirect to='/checkout' />
    if (this.props.orderStatus === "Delivered") 
       return  <button 
       className={this.getVariant()} 
       disabled={this.state.setEntered}
       type="button" 
       onClick={this.onUpdateOrder}>
       {this.state.loading && <Glyphicon glyph="refresh" className="spinning" />}
       {this.props.variant === "buyAgain" ? `Pay Order` : `Pay Order`}
       </button>
    return null
  }
}

export default UpdateOrder;