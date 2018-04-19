import React from "react";
import { Tips } from "./Utils";
import {Line, Bar} from 'react-chartjs-2';
import { FormControl, FormGroup, Button, Navbar, Col, Row, Glyphicon, Modal } from 'react-bootstrap'

//import "./App.css";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      show_tt: false,
      show_rd: false,
      show_rm: false,
      show_rs: false,
      data_tt: {},
      data_rd: {
        labels: [],
        datasets: []
      },
      data_rm: {
        labels: [],
        datasets: []
      },
      data_rs: {
        labels: [],
        datasets: []
      },
      date_end: '',
      date_start: '',
    }
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.reqPerMachine = this.reqPerMachine.bind(this);
    this.reqPerStatus = this.reqPerStatus.bind(this);
    this.reqPerTime = this.reqPerTime.bind(this);
    this.reqPerTimeDay = this.reqPerTimeDay.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.data_request = this.data_request.bind(this);
    this.getdata = this.getdata.bind(this);
    
  }

  reqPerMachine() {
    let req = new Map()
    for (let d = 0; d < this.state.data.length; d++) {
      if (req.has(this.state.data[d].cd_machine)) {
        let valor = req.get(this.state.data[d].cd_machine) + 1
        req.set(this.state.data[d].cd_machine, valor)
      } else {
        req.set(this.state.data[d].cd_machine, 1)
      }
    }

    this.setState({ 
      show_rm: true,
      data_rm: {
        labels: Array.from(req.keys()),
        datasets: [
          {
            label: 'Requests per Machine',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,1)',
            hoverBorderColor: 'rgba(220,220,220,1)',
            data: [...Array.from(req.values()).slice(0)]
          }
        ]
      }
     })
  }

  reqPerStatus() {
    let req = new Map()
    for (let d = 0; d < this.state.data.length; d++) {
      if (req.has(this.state.data[d].ds_compl_status_returned)) {
        let valor = req.get(this.state.data[d].ds_compl_status_returned) + 1
        req.set(this.state.data[d].ds_compl_status_returned, valor)
      } else {
        req.set(this.state.data[d].ds_compl_status_returned, 1)
      }
    }
    
    this.setState({
      show_rs: true,
      data_req: {
        labels: Array.from(req.keys()),
        datasets: [
          {
            label: 'Requests per Compliance Status',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [...Array.from(req.values()).slice(0)]
          }
        ]
      }
    })

  }

  reqPerTime() {
    let sum_time = 0.0
    let dif = 0.0
    for (let d = 0; d < this.state.data.length; d++) {
      dif = new Date(this.state.data[d].dt_end_log).getTime() - new Date(this.state.data[d].dt_Start_Log).getTime()
      sum_time += dif / 1000
      console.log(this.state.data[d].dt_end_log+"++"+this.state.data[d].dt_Start_Log +"- "+ dif/1000)
    }
    this.setState({ show: true })

  }

  reqPerTimeDay() {
    let req = new Map()
    let req_co = new Map()
    let tot_dia = []

    for (let d = 0; d < this.state.data.length; d++) {
      let dateEnd = new Date(this.state.data[d].dt_end_log)
      let dateStart = new Date(this.state.data[d].dt_Start_Log)
      let key = `${dateStart.getDate()} ${dateStart.getMonth()} ${dateStart.getFullYear()}`
      let dif = dateEnd.getTime() - dateStart.getTime()

      if (req.has(key)) {
        let valor = req.get(key) + (dif / 1000)
        req.set(key, valor)
        valor = req_co.get(key) + 1
        req_co.set(key, valor)
      } else {
        req.set(key, dif / 1000)
        req_co.set(key, 1)
      }
    }

    req.forEach(function(valor, clave){
      tot_dia.push(valor/req_co.get(clave))
    })
    this.setState({ 
      show_rd: true,
      data_rd: {
        labels: Array.from(req.keys()),
        datasets: [
          {
            label: 'Average response per Day',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,1)',
            hoverBorderColor: 'rgba(220,220,220,1)',
            data: tot_dia
          }
        ]
      } 
    });
  }

  componentWillMount() {
    let day = new Date()
    let cadena = `${day.getMonth()+1}/${day.getDate()-1}/${day.getFullYear()}`
    console.log(cadena)
    fetch(`https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData?startdate=${cadena}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.setState({ data: data })
      console.log(data.length)
    })
  }

  handleHide() {
    this.setState({ 
      show_rd: false,
      show_rm: false,
      show_rs: false,
    });
  }
   getdata(date){
     return `${date.split('-')[1]}/${date.split('-')[2]}/${date.split('-')[0]}`
   }
  handleChange1(e) {
    this.setState({ date_end: e.target.value });
}
  
  handleChange2(e) {
     this.setState({ date_start: e.target.value });
   }
  data_request(){
    this.setState({
      data: []
    })
    console.log("entro boton")
    fetch(`https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData?startdate=${this.getdata(this.state.date_start)}&enddate=${this.getdata(this.state.date_end)}`)
      .then((response) => {
        return response.json() 
        
      })
      .then((data) => {
        this.setState({ data: data })
        console.log(data.length)
        console.log("termino")
      })
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
                    type="date"
                    label="Text"
                    value = {this.state.date_start}
                    onChange={this.handleChange2}
                    placeholder="Enter date initial"
                  />
                </Col>
                <Col sm={4}>
                  <FormControl
                    id="formControlsEmail"
                    type="date"
                    label="Email address"
                    value = {this.state.date_end}
                    onChange={this.handleChange1}
                    placeholder="Enter date end"
                  />
                </Col>
              </FormGroup>
              <Col sm={3}>
                  <Button bsStyle="danger"  onClick = {this.data_request}> filter Records</Button>
                </Col>
            </form>

          </div >
          <br /><br />
          <Row>
            <Col smOffset={2} sm={2}>
              <Button bsStyle="primary" onClick={this.reqPerTime} disabled = {(this.state.data.length === 0)}>
                <Glyphicon glyph="stats" />  Avg Response Time
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary" onClick={this.reqPerTimeDay} disabled = {(this.state.data.length === 0)}>
                <Glyphicon glyph="stats" />  Avg Response Day
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary" onClick = {this.reqPerMachine} disabled = {(this.state.data.length === 0)}>
                <Glyphicon glyph="stats" />  Request per Machine
              </Button>
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary" onClick={this.reqPerStatus} disabled = {(this.state.data.length === 0)}>
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

          <Modal show={this.state.show_rs} onHide={this.handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>Average Response Time per Day </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Line data={this.state.data_req} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleHide}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.show_rm} onHide={this.handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>Total Requests per Machine </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Bar
                  data={this.state.data_rm}
                  width={100}
                  height={50}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleHide}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.show_rd} onHide={this.handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>Average Response Time per Day </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>
                <Bar
                  data={this.state.data_rd}
                  width={100}
                  height={50}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleHide}>Close</Button>
            </Modal.Footer>
          </Modal>

          <br />
          <Tips />
          <br />
        </div>
      </div>
    );
  }


}
export default App;
