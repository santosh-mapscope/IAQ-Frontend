/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";



export const AddDesignation = (props) => {
  const [validated, setValidated] = useState(false);
  const { register, control, reset, formState: { errors }, } = useForm();
  const [ClientName, setClientName] = useState("");
  const [clientId, setClientId] = useState('');
  const {
    showDesignationModal,
    handleCloseRoleModal,
    handlePageChange,
    setFullPageLoading
  } = props;

  const userData = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(true);

      const data = {
        name: event.target.designationName.value,
        userId: userData.userDetails.userId,
        clientId: event.target.clientId.value

      };
      Swal.fire({
        title: "Please confirm",
        text: " Do you want to create this designation?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true)
          axiosInstance
            .post("master/addDesignation", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'success',
                  title: "Designation created successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                handleCloseRoleModal();
                handlePageChange(1);
              } else {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              setFullPageLoading(false)
              Swal.fire({
                icon: 'error',
                title: "Designation creation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  };
  const getClientName = async (value) => {
    await axiosInstance
      .post("client/getAllClientDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client Name",isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClientName(data);
      })
      .catch((err) => { });
  };



  const handelClientName = (data) => {
    // console.log("-------------------", data.target.value.value);
    setClientId(data.target.value.value)
  }

  useEffect(() => {
     getClientName()

  }, []);
  return (
    <Modal
      show={showDesignationModal}
      onHide={() => {
        handleCloseRoleModal();
      }}
      size="md"
      // dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section" >
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Add Designation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="designationName">
              <Form.Label>Designation Name<span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="designationName"
                placeholder="Designation Name"
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Designation name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="isClient">
              <Form.Label></Form.Label>
              <Form.Check
                label="isClient ?"
                className='me-3'
                type='checkbox'
                placeholder='isClient'
              />
            </Form.Group>

          </Row> */}

          <div className="user-info-inner col-lg-12 col-md-12 pd-0">
            <h6 className="label-search">Select Client Name</h6>
            <Controller
              control={control}
              name="clientId"
              {...register("clientId", {
                onChange: (data) => handelClientName(data),
                // required: "Client Name required",
              })}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    size="sm"
                    options={ClientName}
                    placeholder="Client Name"
                    name="clientId"
                    // value={selectedClient}
                    clearButton
                  />
                  {/* {errors.clientId && (
                    <span className="text-danger">{errors.clientId.message}</span>
                  )} */}

                </>
              )}
            />
          </div>


          <Button className="mt-3" type="submit">Create Designation</Button>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export const EditDesignation = (props) => {
  const [data, setData] = useState([]);
  const { register, control, reset, formState: { errors }, } = useForm();
  const [ClientName, setClientName] = useState("");
  const [clientId, setClientId] = useState('');
  const {
    showdesignationEditModal,
    handleCloseDesignationEditModal,
    DesignationDetails,
    handlePageChange,
    setFullPageLoading
  } = props;
  const [Client, setClient] = useState("");
  // console.log(roleDetails);

  const [validated, setValidated] = useState(false);



  const handelClientName = (data) => {
    setClientId(data.target.value.value)
  }
  
  const getClientName = () => {
    axiosInstance
      .post(`client/getAllClientDD`, [], {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res);
        if (res && res.data.status === 1) {
          setClient(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const InitialValues = (DesignationDetails) => {
    reset({
      // designationName: DesignationDetails.id,
      ClientName: DesignationDetails?.clientId?.id
    })
  }


  useEffect(() => {
    getClientName()
    
    InitialValues(props.DesignationDetails)
  }, [props.DesignationDetails]);



  const userData = JSON.parse(localStorage.getItem('user'));
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(true);
      const data = {
        id: DesignationDetails.id,
        name: event.target.designationName.value,
        clientId:event.target.ClientName.value,
        userId: userData.userDetails.userId
      };
     
      Swal.fire({
        title: "Please confirm",
        text: " Do you want to update this designation?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true);
          axiosInstance
            .post("master/editDesignation", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'success',
                  title: "Designation updated successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                handleCloseDesignationEditModal();
              } else {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              setFullPageLoading(false)
              Swal.fire({
                icon: 'error',
                title: "Designation updation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  };

  return (
    <Modal
      show={showdesignationEditModal}
      onHide={() => {
        handleCloseDesignationEditModal();
      }}
      size="md"
      // dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"

    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Update Designation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-1">
          <Col lg={12} md={6} xs={12} className="mb-3">
            <Form.Group as={Col} controlId="designationName">
              <Form.Label>Designation Name<span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="designationName"
                id="designationName"
                placeholder="Designation Name"
              defaultValue={DesignationDetails.name}
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Designation name.
              </Form.Control.Feedback>
            </Form.Group>
</Col>

            <Col lg={12} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="ClientName"
                id="ClientName"
                className="form-add-user newSize"
                {...register("ClientName", {
                  onChange: (e) => {
                    handelClientName(e);
                  },
                  required: "Client name required",
                })}
                defaultValue={DesignationDetails?.clientId?.id}
              >
                <option value="">Select Client Name</option>
                {Client &&
                  Client.length > 0 &&
                  Client.map((prov) => {
                    return (
                      <option value={prov.clientId} key={prov.clientId}>
                        {prov.clientName}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
          </Row>

          <Button className="mt-3" type="submit">Save Designation</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};