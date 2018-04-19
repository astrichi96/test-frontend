import React from "react";
import { Tips } from "./Utils";

import { FormControl, FormGroup, Button, Navbar, Col, Row, Glyphicon } from 'react-bootstrap'

//import "./App.css";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      avgTime: false,
      avgDay: false,
      reqMac: false,
      reqStat: false,
    }
    this.handleShowAvgTime = this.handleShowAvgTime.bind(this);
    this.handleShowAvgDay = this.handleShowAvgDay.bind(this);
    this.handleShowReqMac = this.handleShowReqMac.bind(this);
    this.handleShowReqStat = this.handleShowReqStat.bind(this);

    this.reqPerMachine = this.reqPerMachine.bind(this);
    this.reqPerMachineStatus = this.reqPerMachineStatus.bind(this);
    this.reqPerMachineTime = this.reqPerMachineTime.bind(this);
    this.reqPerMachineTimeDay = this.reqPerMachineTimeDay.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  reqPerMachine() {
    let req = new Map()
    //req.set(this.data[0].cd_machine,1)

    for (let d = 0; d < this.state.data.length; d++) {
      if (req.has(this.state.data[d].cd_machine)) { 
        let valor = req.get(this.state.data[d].cd_machine) + 1
        req.set(this.state.data[d].cd_machine, valor)
      } else {
        req.set(this.state.data[d].cd_machine, 1)
      }
    }

    req.forEach(function(valor, clave){
      console.log(clave + ' ' + valor);
    })
  }

  reqPerMachineStatus() {
    let req = new Map()
    //req.set(this.data[0].cd_machine,1)

    for (let d = 0; d < this.state.data.length; d++) {
      if (req.has(this.state.data[d].ds_compl_status_returned)) { 
        let valor = req.get(this.state.data[d].ds_compl_status_returned) + 1
        req.set(this.state.data[d].ds_compl_status_returned, valor)
      } else {
        req.set(this.state.data[d].ds_compl_status_returned, 1)
      }
    }

    req.forEach(function(valor, clave){
      console.log(clave + ' ' + valor);
    })
  }

  reqPerMachineTime() {
   let sum_time = 0.0
   let dif = 0.0  
    for (let d = 0; d < this.state.data.length; d++) {
      dif = new Date(this.state.data[d].dt_end_log).getTime() - new Date(this.state.data[d].dt_Start_Log).getTime()
      sum_time += dif/1000
      //console.log(this.state.data[d].dt_end_log+"++"+this.state.data[d].dt_Start_Log +"- "+ dif/1000)
    }
    console.log(sum_time)
    console.log(sum_time/this.state.data.length)
    
  }

  reqPerMachineTimeDay() {
    let req = new Map()
    let req_co = new Map()

    for (let d = 0; d < this.state.data.length; d++) {
      let dateEnd = new Date(this.state.data[d].dt_end_log)
      let dateStart = new Date(this.state.data[d].dt_Start_Log)
      let key = `${dateStart.getDate()} ${dateStart.getMonth()} ${dateStart.getFullYear()}`
      let dif = dateEnd.getTime() - dateStart.getTime()
     
      if (req.has(key)) { 
        let valor = req.get(key) + (dif/1000)
        req.set(key, valor)
        valor = req_co.get(key) + 1
        req_co.set(key, valor)
      } else {
        req.set(key,dif/1000)
        req_co.set(key,1)     
      }
    } 

    req.forEach(function(valor, clave){
      console.log(clave + ' ' + (valor/req_co.get(clave)));
    })
  }

  componentWillMount() {
    fetch("https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData?startdate=04/16/2018")
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ data: data })
        console.log(data.length)
      })
  }

  handleShowAvgTime() {
    this.setState({ avgTime: true });
  }
  handleShowAvgDay() {
    this.setState({ avgDay: true });
  }
  handleShowReqMac() {
    this.setState({ reqMac: true });
  }
  handleShowReqStat() {
    this.setState({ reqStat: true });
  }

  handleHide() {
    this.setState({ show: false });
  }

  render() {
    const { data } = this.state;
    return (

      <div className="container"><br />
        <Navbar>
          <Navbar.Header bsStyle="inverse">
            <Navbar.Brand>
              <a href="#home">Pagina Principal</a>

            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Text pullRight>The compliance status for licensees of some states in the US.</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <br />
        <div className="row">
          <div className="row ">
            <br />
            <form>
              <FormGroup>
                <Col smOffset={1} sm={4}>
                  <FormControl
                    id="formControlsText"
                    type="text"
                    label="Text"
                    placeholder="Enter date initial"
                  />
                </Col>
                <Col sm={4}>
                  <FormControl
                    id="formControlsEmail"
                    type="email"
                    label="Email address"
                    placeholder="Enter date end"
                  />
                </Col>
                <Col sm={3}>
                  <Button bsStyle="danger" type="submit"> filter Records</Button>
                </Col>
              </FormGroup>
            </form>

          </div >
          <br /><br />
          <Row>
            <Col smOffset={2} sm={2}>
              <Button bsStyle="primary" onClick={this.reqPerMachineTimeDay  }>
                <Glyphicon glyph="stats" />  Avg Response Time
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary">
                <Glyphicon glyph="stats" />  Avg Response Day
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary">
                <Glyphicon glyph="stats" />  Request per Machine
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary">
                <Glyphicon glyph="stats" />  Request per Status
              </Button>
            </Col>
          </Row>

          <br /><br />

          <ReactTable
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
                    <option value="all">Show All</option>
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
          <Tips />
          <br />
        </div>
      </div>
    );
  }


}
export default App;
