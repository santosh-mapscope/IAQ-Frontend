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



export const AddCity = (props) => {
  const [validated, setValidated] = useState(false);
  const { register, control, reset, formState: { errors }, } = useForm();
  const [ClientName, setClientName] = useState("");
  const [clientId, setClientId] = useState('');
  const [ProvinceId, setProvinceId] = useState('');
  const [CountryName, setCountryName] = useState([]);
  const [province, setprovince] = useState([]);
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
        cityName: event.target.designationName.value,
        userId: userData.userDetails.userId,
        provinceId: event.target.provinceId.value

      };
      Swal.fire({
        title: "Please confirm",
        text: " Do you want to create this city?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true)
          axiosInstance
            .post("city/addCity", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'success',
                  title: "City created successfully",
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
                title: "City creation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  };


  const getCountryName = async (value) => {
    await axiosInstance
      .post("country/getCountryDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Country", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setCountryName(data);
      })
      .catch((err) => { });
  };
  const getAllPRovinceDD = async (data) => {
    let formData = new FormData();
    formData.append("countryId", data);
    axiosInstance
      .post("province/getProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setprovince(data);
      })
      .catch((err) => {
      });
  };

  const handelClientName = (data) => {
    setClientId(data.target.value.value)
    getAllPRovinceDD(data.target.value.value)
  }
  const handelprovincename = (data) => {
    setProvinceId(data.target.value.value)
  }

  useEffect(() => {
    getCountryName()

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
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Add City</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          <div className="user-info-inner col-lg-12 col-md-12 pd-0">
            <h6 className="label-search">Select Country Name</h6>
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
                    options={CountryName}
                    placeholder="Country Name"
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
          <div className="user-info-inner col-lg-12 col-md-12 pd-0 mt-2">
            <h6 className="label-search">Select Province Name</h6>
            <Controller
              control={control}
              name="provinceId"
              {...register("provinceId", {
                onChange: (data) => handelprovincename(data),
                // required: "Client Name required",
              })}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    size="sm"
                    options={province}
                    placeholder="Province Name"
                    name="provinceId"
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
          <Row className="mb-3">
            <Form.Group as={Col} controlId="designationName">
              <Form.Label>City Name<span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="designationName"
                placeholder="City Name"
              />
              <Form.Control.Feedback type="invalid">
                Please Enter City name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button className="mt-3" type="submit">Create City</Button>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export const EditCity = (props) => {
  const [data, setData] = useState([]);
  const { register, control, reset, formState: { errors }, } = useForm();
  const [ClientName, setClientName] = useState("");
  const [clientId, setClientId] = useState('');
  const [CountryName, setCountryName] = useState([]);
  const [province, setprovince] = useState([]);
  const {
    showdesignationEditModal,
    handleCloseDesignationEditModal,
    DesignationDetails,
    handlePageChange,
    setFullPageLoading
  } = props;
  const [Client, setClient] = useState("");

  const [validated, setValidated] = useState(false);



  const handelClientName = (data) => {
    setClientId(data.target.value.value);
  }

  // const getClientName = () => {
  //   axiosInstance
  //     .post(`client/getAllClientDD`, [], {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //       if (res && res.data.status === 1) {
  //         setClient(res.data.data.list);
  //       }
  //       return false;
  //     })
  //     .catch((err) => {
  //     });
  // };
  const getCountryName = () => {
    axiosInstance
      .post(`country/getCountryDD`, [], {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCountryName(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };
  const getProvinceName = () => {
    axiosInstance
      .post(`province/getProvinceDD`, [], {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setprovince(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };
  const InitialValues = (DesignationDetails) => {
    reset({
      // designationName: DesignationDetails.id,
      ClientName: DesignationDetails?.clientId?.id
    })
  }


  useEffect(() => {
    getCountryName()
    getProvinceName()
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
        cityId: DesignationDetails.cityId,
        cityName: event.target.designationName.value,
        // clientId: event.target.ClientName.value,
        userId: userData.userDetails.userId
      };
      Swal.fire({
        title: "Please confirm",
        text: " Do you want to update this City?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true);
          axiosInstance
            .post("city/editCity", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'success',
                  title: "City updated successfully",
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
                title: "City updation failed. Try after some time",
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
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Update City</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-1">
            <Col lg={12} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="countryName"
                id="countryName"
                className="form-add-user newSize"
                {...register("countryName", {
                  onChange: (e) => {
                    handelClientName(e);
                  },
                  required: "Country Name required",
                })}
                defaultValue={DesignationDetails && DesignationDetails.countryId ? DesignationDetails.countryId : ""}
              >
                <option value="">Select country </option>
                {CountryName &&
                  CountryName.length > 0 &&
                  CountryName.map((prov) => {
                    return (
                      <option value={prov.countryId} key={prov.countryId}>
                        {prov.countryName}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
            <Col lg={12} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Province Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="ProvinceName"
                id="ProvinceName"
                className="form-add-user newSize"
                {...register("ProvinceName", {
                  onChange: (e) => {
                    handelClientName(e);
                  },
                  required: "Province name required",
                })}
                defaultValue={DesignationDetails && DesignationDetails.provinceId ? DesignationDetails.provinceId : ""}
               
              >
                <option value="">Select province</option>
                {province &&
                  province.length > 0 &&
                  province.map((prov) => {
                    return (
                      <option value={prov.provinceId} key={prov.provinceId}>
                        {prov.provinceName}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
            <Col lg={12} md={6} xs={12} className="mb-3">
              <Form.Group as={Col} controlId="designationName">
                <Form.Label>City Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="designationName"
                  id="designationName"
                  placeholder="Designation Name"
                  defaultValue={DesignationDetails.cityName}
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Province name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>


          </Row>

          <Button className="mt-3" type="submit">Update City</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};