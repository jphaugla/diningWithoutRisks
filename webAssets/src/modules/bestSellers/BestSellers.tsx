import React from "react";
import { API } from "aws-amplify";

import BestSellerProductRow from "./BestSellerProductRow";
import { MenuItem } from "./BestSellerProductRow";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";

interface BestSellersProps {
  match: any;
}

interface BestSellersState {
  isLoading: boolean;
  menuItems: MenuItem [];
}

export default class BestSellers extends React.Component<BestSellersProps, BestSellersState> {
  constructor(props: BestSellersProps) {
    super(props);

    this.state = {
      isLoading: true,
      menuItems: []
    };
  }

  async componentDidMount() {
    try {
      const menuItems = await API.get("bestsellers", "/bestsellers", null);
      this.setState({
        menuItems: menuItems,
        isLoading: false
      });
    } catch(error) {
      alert(error);
    }
  }

  render() {
    return (
      <div className="Category">
        <CategoryNavBar />
        <div>
          <div className="well-bs no-radius">
            <div className="container-category">
              <h3>Featured Items</h3>
            </div>
            {this.state.isLoading ? <div className="loader" /> :
              this.state.menuItems.slice(0,20).map(menuItem => <BestSellerProductRow menuItem={menuItem} key={menuItem.id} />
            )}  
          </div>
        </div>
      </div>
    );
  }
}