import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import "./App.css";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = { data: [] }
     
  }

  
  componentWillMount() {
    fetch("https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData?startdate=04/16/2018")
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ data: data })
      })
  }

  render() {
    const { data } = this.state.data;
    return (
      <div className="App-intro">
        <Tips className="App-header"/>
        <Logo /> 
        <ReactTable className = "App"
          data={data}
          filterable
          columns={[ 
            {
              Header: "State Code",
              accessor: "cd_cebroker_state",

              filterMethod: (filter, row) => {
                if (filter.value === "all") {
                  return true;
                }
                if (filter.value === "FL") {
                  return row[filter.id] = "FL";
                }
                if (filter.value === "OH") {
                  return row[filter.id] = "OH";
                }
                if (filter.value === "GA") {
                  return row[filter.id] = "GA";
                }
                if (filter.value === "LA") {
                  return row[filter.id] = "LA";
                }
                
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: "100%" }}
                  value={filter ? filter.value : "all"}
                >
                  <option value="all">Listar Todos</option>
                  <option value="FL">FL</option>
                  <option value="OH">OH</option>
                  <option value="GA">GA</option>
                  <option value="LA">LA</option>
                </select>
            },
            {
              Header: "Pro Code",
              accessor: "pro_cde"
            },
            {
              Header: "Profession",
              accessor: "cd_profession"
            },
            {
              Header: "License ID",
              accessor: "id_license"
            },
            {
              Header: "Cycle End Date",
              accessor: "dt_end"
            }, 
            {
              Header: "Compliance Status",
              accessor: "ds_compl_status_returned"
            },
            {
              Header: "Client ID",
              accessor: "id_client_nbr"
            },
            {
              Header: "Start Log Date",
              accessor: "dt_Start_Log"
            },
            {
              Header: "End Log Date",
              accessor: "dt_end_log"
            },
            {
              Header: "Environment",
              accessor: "cd_environment"
            },
            {
              Header: "Machine",
              accessor: "cd_machine"
            }
          ]}
          defaultSorted={[
            {
              id: "dt_Start_Log",
              desc: true
            }
          ]}
          defaultPageSize={20}
          className="-striped -highlight"
        />
        <br />
        
      </div>
    );
  }
  
}
export default App;
