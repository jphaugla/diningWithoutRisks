import React from "react";
import "../../common/styles/gallery.css";
import "../../common/styles/productRow.css";
import StarRating from "../../common/starRating/StarRating";
import AddToCart from "../../common/AddToCart";
import { MenuItem } from "../bestSellers/BestSellerProductRow";

interface CategoryGalleryBookProps {
  menuItem: MenuItem;
}

export class CategoryGalleryBook extends React.Component<CategoryGalleryBookProps> {
  render() {
    if (!this.props.menuItem) return;
    return (
      <div className="col-sm-3 col-md-3">
        <div className="thumbnail no-border">
          <p className="rating-container"><StarRating stars={this.props.menuItem.rating} /><span className="pull-right">{`$${this.props.menuItem.usPrice}`}</span></p>
          <img src={this.props.menuItem.fullImage} className="media-object product-thumb" alt={`${this.props.menuItem.menuName} menuItem`} />
          <div className="caption">
            <h4 className="text-center">{this.props.menuItem.menuName}</h4>
            <h4 className="text-center"><small> {this.props.menuItem.description}</small></h4>
            <h4 className="text-center"><small> {this.props.menuItem.name}</small></h4>
            <AddToCart bookId={this.props.menuItem.id} price={this.props.menuItem.usPrice} variant="center" />
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryGalleryBook;