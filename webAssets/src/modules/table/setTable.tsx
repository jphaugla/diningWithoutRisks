import React from "react";
import { API } from 'aws-amplify';
import { Redirect } from 'react-router';
import { FormGroup, FormControl, ControlLabel, Button, Glyphicon } from "react-bootstrap";
import "./setTable.css";


interface SetTableProps {
  variant?: string;
}

interface SetTableState {
  loading: boolean;
  redirect: boolean;
  tableId: string;
  tableValid: "success" | "error" | "warning" | undefined;
}

export default class SetTable extends React.Component<SetTableProps, SetTableState> {
  constructor(props: SetTableProps) {
    super(props);

    this.state = {
      loading: false,
      redirect: false,
      tableId: "",
      tableValid: undefined,
    };
  }

  onTableChange = (event: React.FormEvent<FormControl>) => {
    const target = event.target as HTMLInputElement;
    this.setState({
      tableId: target.value,
      tableValid: target.value.length < 2 ? 'error' : 'success',
      redirect: false
    });
  }
  onOK = () => {
	const tableId = this.state.tableId;
	API.post("table", "/table", {
	      body: {
	        tableId: tableId
	      }
	    }).then(() => this.setState({	      
	    redirect: true
	    }));
  }
  
  getVariant = () => {
    let style = "btn btn-black"
    return this.props.variant && this.props.variant === "center" ? style + ` btn-black-center` : style + ` pull-right`;
  }
  
  render() {
    if (this.state.redirect) return <Redirect to='/' />
    
    return (
      <div className="SetTable">
          <FormGroup controlId="tableID" validationState={this.state.tableValid}>
            <ControlLabel>Table</ControlLabel>
            <FormControl
              name="table"
              type="string"
              bsSize="large"
              value={this.state.tableId}
              onChange={this.onTableChange} />
            <FormControl.Feedback />
          </FormGroup>
          <Button
            className={this.getVariant()}
            disabled={this.state.tableValid !== 'success' }
            type="button"
            onClick={this.onOK}>
            {this.state.loading && <Glyphicon glyph="refresh" className="spinning" />}
            {this.props.variant === "OK" ? `Table reset`: `Set Table`}
          </Button>
      </div>
    );
  }
}