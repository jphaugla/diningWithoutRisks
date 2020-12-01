import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { NavItem } from "react-bootstrap";
import "../../../common/styles/gallery.css";
import "../../../common/styles/productRow.css";

import platter from "../../../images/bestSellers/chickenlargeplatter.jpeg";
import chickenbreast from "../../../images/bestSellers/butterflychickenbreast.jpg";
import cataplana from "../../../images/bestSellers/peripericataplana.jpeg";
import chickenthighs from "../../../images/bestSellers/periperichickenthighs.jpeg";
import redpepper from "../../../images/bestSellers/redpepperdippita.jpg";
import cheesecake from "../../../images/bestSellers/caramelcheesecake.jpg";

const bestSellers = [platter, chickenbreast, cataplana, chickenthighs, redpepper, cheesecake];

export class BestSellersBar extends React.Component {
  render() {
    return (
      <div className="center ad-gallery nav">
        <div className="col-md-2 hidden-sm hidden-xs">
          <LinkContainer to="/best">
            <NavItem><h3>Featured Items</h3></NavItem>
          </LinkContainer>
        </div>
        <div className="row">
          {bestSellers.map(menuitem =>
            <div className="col-md-2 hidden-sm hidden-xs" key={menuitem}>
              <LinkContainer to="/best">
                <NavItem><img src={menuitem} className="media-object product-thumb-sm" /></NavItem>
              </LinkContainer>
            </div>)}
        </div>
      </div>
    );
  }
}


export default BestSellersBar;