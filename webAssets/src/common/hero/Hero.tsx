import React from "react";

import image from "../../images/hero/brazil.jpg";
import "./hero.css";

export class Hero extends React.Component {
  render() {
    return (
      <img src={image} className="img-fluid full-width" alt="Comer Sem Risco" />
    );
  }
}
  
export default Hero;