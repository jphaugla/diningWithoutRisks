import React, { Component } from "react";
import { CategoryNavBar } from "./categoryNavBar/CategoryNavBar";
import { BestSellersBar } from "../bestSellers/bestSellersBar/BestSellersBar";
import { CategoryGallery } from "./CategoryGallery";

import appeteasers from "../../images/hero/appeteasers.jpg";
import burgers from "../../images/hero/burgers.jpeg";
import dessert from "../../images/hero/dessert.jpg";
import finoSides from "../../images/hero/finoSides.jpg";
import newItem from "../../images/hero/new.jpeg";
import periperichicken from "../../images/hero/periperichicken.jpeg";
import salads from "../../images/hero/salads.jpeg";
import sharing from "../../images/hero/sharing.jpeg";
import sides from "../../images/hero/sides.jpeg";

import "../../common/hero/hero.css";
import { categories } from "./categoryNavBar/categories";

interface CategoryViewProps {
  match: any;
}

export default class CategoryView extends Component<CategoryViewProps> {
  getImage = () => {
    switch (this.props.match.params.id) {
      case categories.appeteasers:
        return appeteasers;
      case categories.burgers:
        return burgers;
      case categories.dessert:
        return dessert;
      case categories.finoSides:
        return finoSides;
      case categories.newItem:
        return newItem;
      case categories.periperichicken:
        return periperichicken;
      case categories.salads:
        return salads;
      case categories.sharing:
        return sharing;
      case categories.sides:
        return sides;
      default:
        return periperichicken;
    }
  }

  render() {
    return (
      <div className="Category">
        <CategoryNavBar />
        <BestSellersBar />
        <img src={this.getImage()} alt={`${this.getImage()} hero`} className="img-fluid full-width top-hero-padding" />
        <CategoryGallery match={this.props.match} />
      </div>
    );
  }
}