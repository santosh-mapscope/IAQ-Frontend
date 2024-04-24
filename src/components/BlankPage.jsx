import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import DataTable from "react-data-table-component";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import {
  PiUserCircleGearThin,
  PiBuildingsThin,
  PiSuitcaseThin,
  PiStairsThin,
  PiNotebookThin,
} from "react-icons/pi";
import { FaFileCsv } from "react-icons/fa";
import { BiSolidCloudUpload } from "react-icons/bi";

import { useDropzone } from "react-dropzone";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Select from 'react-select'

function MydModalWithGrid(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-60w"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Client View
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example user-view-container">
        {/* <Container>
          <Row>
            <Col xs={12} md={8}>
              .col-xs-12 .col-md-8
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>

          <Row>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>
        </Container> */}

        <Container>
          <Row className="mb-3 gx-2">
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Client Name</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Address 1</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Last Name </h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>
            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Address 2</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">City</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Province</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Postal Code</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Country</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Phone</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Contact</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Email</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Client Username</h6>
                <div>
                  <p>abc</p>
                </div>
              </div>
            </Col>

            <Col lg={12}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function BlankPage() {
  const [modalShow, setModalShow] = useState(false);

  // file upload start
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // file upload end

  var bgColors = {
    statistic: "#DBE9F6",
    co2: "#D0E1F0",
    co: "#C1D5E9",
    temp: "#B6CCE0",
    rh: "#A7C1D9",
    rsp: "#99B6D2",
    tvoc: "#85A4C1",
    min: "#FCEAB7",
    max: "#A2E6F4",
    sd: "#F5B6B3",
    variance: "#FFA375",
  };

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  


  return (
    <>
      <Helmet title={"Dashboard | IAQ Reporting System"} />
      <div className="content-wrapper ">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-4">
              <div className="col-sm-3">
                <p>Hi, Welcome Back..</p>
                <h5 className="m-0 mt-3 mb-2">Users</h5>
              </div>
            </div>
          </div>
        </div>

        <section className="content mt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="small-box bg-info-1">
                  <div className="inner">
                    {/* <img
                      src={Dashboardclienticon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                    <PiUserCircleGearThin className="dashboard-icon-size" />
                    <h3>72</h3>
                    <p>Clients</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-bag" />
                  </div>
                  {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                </div>
              </div>
              <div className="col">
                <div className="small-box bg-build">
                  <div className="inner">
                    <PiBuildingsThin className="dashboard-icon-size" />
                    {/* <img
                      src={Dashboardbuildingicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                    <h3>684</h3>
                    <p>Building</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-bag" />
                  </div>
                  {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                </div>
              </div>
              <div className="col">
                <div className="small-box bg-total">
                  <div className="inner">
                    <PiSuitcaseThin className="dashboard-icon-size" />
                    {/* <img
                      src={Dashboardjobicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                    <h3>3706</h3>
                    <p>Jobs</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-pie-graph" />
                  </div>
                  {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                </div>
              </div>
              <div className="col">
                <div className="small-box bg-survey">
                  <div className="inner">
                    <PiStairsThin className="dashboard-icon-size" />
                    {/* <img
                      src={Dashboardsurveyicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                    <h3>417058</h3>
                    <p>Survey Done</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-person-add" />
                  </div>
                  {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                </div>
              </div>
              <div className="col">
                <div className="small-box bg-report">
                  <div className="inner">
                    <PiNotebookThin className="dashboard-icon-size" />
                    {/* <img
                      src={Dashboardreportsicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                    <h3>3706</h3>
                    <p>Reports Generated</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-stats-bars" />
                  </div>
                  {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Launch modal with grid
          </Button>

          <MydModalWithGrid
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </section>

        {/* file uploader */}

        <section className="mt-4">
          <Container>
            <Row>
              <Col lg={6}>
                <div className="upload-csv-container">
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    size="sm"
                  >
                    <option>Building Owener</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    size="sm"
                  >
                    <option>Building Province</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    size="sm"
                  >
                    <option>Building City</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    size="sm"
                  >
                    <option>Select Tested Building</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    size="sm"
                  >
                    <option>Job Number</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>

                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <BiSolidCloudUpload className="fil-45" />
                    <p>
                      Drag 'n' drop CSV files here, or click to select files
                    </p>
                  </div>

                  <aside className="file-na-container mt-4 mb-4">
                    <h6 className="f-s white">
                      {" "}
                      <FaFileCsv className="fil-size mr-2 white" />
                      Files
                    </h6>
                    <ul className="white mb-0">{files}</ul>
                  </aside>

                  <div className="button-container float-right">
                    <Button className="btn-wt">Reset</Button>
                    <Button className="btn-wt">Submit</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* table list client statistics */}
        <section className="mt-5">
          <div className="Client-Statistical-Data">
            <Container>
              <Row>
                <Col>
                <h6 className="label-search">Select Client Name</h6>
                <Select options={options} />
                </Col>
                <Col>
                <h6 className="label-search">City</h6>
                <Select options={options} />
                </Col>
                <Col>
                <h6 className="label-search">Group By</h6>
                <Select options={options} />
                </Col>

                <Col>
                <h6 className="label-search">Environment</h6>
                <Select options={options} />
                </Col>
                <Col className="center-label-text">
                <h5 className="mt-4">Client Statistical Data</h5>
               
                </Col>
              </Row>

             
              <Row>
              <div className="st-container-box mt-4 mb-1">
                <Col  xs={6}>
                <h6>Client Name <span className="sp-st">555 West 12 Holding Limited Partnership</span></h6>
              
                </Col>
                <Col>
                <h6>City <span className="sp-st">vancouver</span></h6>
                
                </Col>

                <Col>
                <h6>Group By <span className="sp-st">City</span></h6>
                
                </Col>
                <Col>
                <h6>Environment <span className="sp-st">All</span></h6>
           
                </Col>

                </div>  
              </Row>
                  

            </Container>
            <Table striped className="stastic-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: bgColors.statistic }}>
                    Statistic
                  </th>
                  <th style={{ backgroundColor: bgColors.min }}>Min</th>
                  <th style={{ backgroundColor: bgColors.max }}>Max</th>
                  <th style={{ backgroundColor: bgColors.sd }}>
                    Standard Deviation
                  </th>
                  <th style={{ backgroundColor: bgColors.variance }}>
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.co2 }}>
                    CO<sub>2</sub>
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.co }}>
                    CO
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.temp }}>
                    Temp
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.rh }}>
                    RH
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.rsp }}>
                    RSP
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
                <tr>
                  <th scope="row" style={{ backgroundColor: bgColors.tvoc }}>
                    TVOC
                  </th>
                  <td>343</td>
                  <td>515</td>
                  <td>43.424</td>
                  <td>1885.702</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </section>
      </div>
    </>
  );
}
export default BlankPage;
