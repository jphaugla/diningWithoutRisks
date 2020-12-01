import React from 'react';
import { API } from 'aws-amplify';
import { Redirect } from 'react-router';
import { Glyphicon } from 'react-bootstrap';

interface UpdateTableProps {
  tableId: string;
  variant?: string;
}

interface UpdateTableState {
  loading: boolean;
  toTable: boolean;
}

class UpdateTable extends React.Component<UpdateTableProps, UpdateTableState> {
  constructor(props: UpdateTableProps) {
    super(props);

    this.state = {
      loading: false,
      toTable: false
    };
  }

  onUpdateTable = async () => {
    this.setState({ loading: true });

    // if the book already exists in the cart, increase the quantity
   
    API.put("table", "/table", {
        body: {
          tableId: this.props.tableId
        }
      }).then(() => this.setState({
        toTable: true
      }));
  }

  getVariant = () => {
    let style = "btn btn-black"
    return this.props.variant && this.props.variant === "center" ? style + ` btn-black-center` : style + ` pull-right`;
  }

  render() {
    if (this.state.toTable) return <Redirect to='/table' />
    
    return (
      <button 
        className={this.getVariant()} 
        disabled={this.state.loading}
        type="button" 
        onClick={this.onUpdateTable}>
        {this.state.loading && <Glyphicon glyph="refresh" className="spinning" />}
        {this.props.variant === "buyAgain" ? `Change Table` : `Set Table`}
      </button>
    );
  }
}

export default UpdateTable;