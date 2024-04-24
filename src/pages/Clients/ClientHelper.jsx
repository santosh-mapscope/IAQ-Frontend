/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  axiosInstance,
  headersForJwt,
} from "../../util/axiosConfig";

import { Col, Row, Modal, Form } from "react-bootstrap";


import Accordion from "react-bootstrap/Accordion";


import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {
  HighChartBarChart,
  HighChartPieChart,
} from "../../components/Charts/Charts";
import JobList from "../Jobs";
import BuildingList from "../Building/BuildingList";

import Select from "react-select";
import ClientRepresentative from "./ClientRepresentative";

export const AddClient = (props) => {
  const [validated, setValidated] = useState(false);
  // const [address2, setAddress2] = useState(null);
  // const [addClientData, setAddClientData] = useState("");
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const { showUserModal, handleCloseUserModal, handleCloseClientModalCross, CountryAll, getClientName, setFullPageLoading } = props;
  const [isCSVCheckboxChecked, setCSVCheckboxChecked] = useState(false);
  const [checkboxtrue, setCheckboxtrue] = useState(false)
  // useEffect(() => {
  //     getAllCountry();
  // },[])

  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const JobPieData = [];
  useEffect(() => { }, []);

  const handleHide = () => {
    handleCloseClientModalCross();
    reset({
      ClientName: "",
      Address1: "",
      Address2: "",
      CountryCode: 1,
      phoneNumber: "",
      Email: "",
      Country: "",
      Province: "",
      City: "",
      PostalCode: "",

    });
  };

  const onSubmit = (data) => {
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to save this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading
          (true);
        let userid = JSON.parse(localStorage.getItem("user"));
        if (data.Address2 !== "") {
          let final_data = {
            name: data.ClientName,
            address1: data.Address1,
            address2: data.Address2,
            cityId: data.City,
            phone: data.phoneNumber,
            postalCode: data.PostalCode,
            clientEmail: data.Email,
            isEmailNotification: data.notification,
            // isActive: "true",
            createdBy: userid.userDetails.userId,
            countryCode: data.CountryCode,
          };
          let formData = new FormData();
          formData.append("userData", JSON.stringify(final_data));

          axiosInstance
            .post("client/addClient", final_data, {
              headers: headersForJwt,
            })
            .then((res) => {
              if (res && res.data.status === 1) {
                setFullPageLoading(false);
                Swal.fire("Created!", "Client created successfully!", "Success");
                getClientName();
                reset();
                handleCloseUserModal();
              } else {
                setFullPageLoading(false);
                Swal.fire({
                  icon: "warning",
                  title: res.data.message,
                  text: "Client creation failed!"
                });
                // --------------
                // handleCloseUserModal();
                // --------
              }
              return false;
            })

            .catch((err) => {
              setFullPageLoading(false);
              // setErrorMessage('Something Went Wrong ..!');
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            });
        } else {
          if (data.Address2 === "" || data.phoneNumber === "") {
            let final_data = {
              name: data.ClientName,
              address1: data.Address1,
              address2: null,
              cityId: data.City,
              phone: null,
              postalCode: data.PostalCode,
              clientEmail: data.Email,
              isEmailNotification: data.notification,
              // isActive: "true",
              createdBy: userid.userDetails.userId,
              countryCode: data.CountryCode,
            };
            let formData = new FormData();
            formData.append("userData", JSON.stringify(final_data));

            axiosInstance
              .post("client/addClient", final_data, {
                headers: headersForJwt,
              })
              .then((res) => {
                if (res && res.data.status === 1) {
                  setFullPageLoading(false);
                  Swal.fire("Created!", "Client created successfully!", "Success");
                  reset({
                    ClientName: "",
                    Address1: "",
                    Address2: "",
                    CountryCode: 1,
                    phoneNumber: "",
                    Email: "",
                    Country: "",
                    Province: "",
                    City: "",
                    PostalCode: "",
                  });
                  handleCloseUserModal();
                  getClientName();
                } else {
                  setFullPageLoading(false);
                  Swal.fire({
                    icon: "warning",
                    title: res.data.message,
                    text: "Client creation failed!",
                  });
                  // handleCloseUserModal();
                }
                return false;
              })

              .catch((err) => {
                setFullPageLoading(false);
                // setErrorMessage('Something Went Wrong ..!');
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              });
          }
        }
      }
    });
  };

  const getProviance = (e) => {
    setProvince("");
    setCity("");
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setLoading(true);
        setProvince("");
        if (res && res.data.status === 1) {
          setProvince(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const getCity = (e) => {
    setCity("");
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCity(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };
  const handleCSVCheckboxChange = (event) => {
    setCSVCheckboxChecked(event.target.checked);
    if (event.target.checked === true) {
      setCheckboxtrue(true)
    }
    else {
      setCheckboxtrue(true)
    }
  }
  return (
    <Modal
      centered
      show={showUserModal}
      onHide={() => {
        // handleCloseUserEditModal();
        // reset();
        handleHide();
      }}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Add Client
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            {/* Client Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="ClientName"
                {...register("ClientName", {
                  required: "Client name required",
                })}
              />
              {errors.ClientName && (
                <span className="text-danger">{errors.ClientName.message}</span>
              )}
            </Col>
            {/* Address1 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 1 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="Address1"
                className="newSize"
                {...register("Address1", {
                  required: "Address 1 required",
                })}
              />
              {errors.Address1 && (
                <span className="text-danger">{errors.Address1.message}</span>
              )}
            </Col>
            {/* Address2 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 2
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                name="Address2"
                className="newSize"
                {...register("Address2", {
                  // required: "Address Two required",
                })}
              />
              {/* {errors.Address2 && (
                <span className="text-danger">{errors.Address2.message}</span>
              )} */}
            </Col>
            {/* Postal Code */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Postal Code <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="PostalCode"
                {...register("PostalCode", {
                  required: "Postal code required",
                })}
              />
              {errors.PostalCode && (
                <span className="text-danger">{errors.PostalCode.message}</span>
              )}
            </Col>
            {/* Country */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                as="select"
                size="sm"
                name="Country"
                id="Country"
                className="form-add-user newSize height-sm"
                {...register("Country", {
                  onChange: (e) => {
                    getProviance(e);
                  },
                  required: "Country required",
                })}
              >
                <option value="">Select Country</option>
                {CountryAll &&
                  CountryAll.length > 0 &&
                  CountryAll.map((cntr) => {
                    return (
                      <option value={cntr.countryId} key={cntr.countryId}>
                        {cntr.countryName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.Country && (
                <span className="text-danger">{errors.Country.message}</span>
              )}
            </Col>
            {/* Province */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Province <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="Province"
                id="Province"
                className="form-add-user newSize height-sm"
                {...register("Province", {
                  onChange: (e) => {
                    getCity(e);
                  },
                  required: "Province required",
                })}
              >
                <option value="">Select Province</option>
                {province &&
                  province.length > 0 &&
                  province.map((prov) => {
                    return (
                      <option value={prov.id} key={prov.id}>
                        {prov.name}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.Province && (
                <span className="text-danger">{errors.Province.message}</span>
              )}
            </Col>
            {/* City */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                City <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="City"
                id="City"
                className="form-add-user newSize height-sm"
                {...register("City", {
                  required: "City required",
                })}
              >
                <option value="">Select City</option>
                {city &&
                  city.length > 0 &&
                  city.map((city) => {
                    return (
                      <option value={city.cityId} key={city.cityId}>
                        {city.cityName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.City && (
                <span className="text-danger">{errors.City.message}</span>
              )}
            </Col>
            {/* Phone No. */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Phone No.
              </Form.Label>

              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="sm"
                  name="CountryCode"
                  id="CountryCode"
                  className="form-add-user newSize country-num"
                  {...register("CountryCode", {
                    valueAsNumber: true,
                  })}
                >
                  <option value="1">+1</option>
                  {/* <option value="91">+91</option> */}
                </Form.Control>

                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="phoneNumber"
                  maxlength="10"
                  pattern="\d{10}"
                  {...register("phoneNumber", {
                    //  valueAsNumber: true,
                    // required: "Phone Number required",
                    // validate: (value) =>
                    //   getValues("phoneNumber").toString().length === 10,
                  })}
                />
              </div>

              {/* {errors.phoneNumber && (
                <span className="text-danger">Invalid Mobile Number</span>
              )} */}
            </Col>
            {/* Email */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="Email"
                {...register("Email", {
                  required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid Email address",
                  },
                })}
              />
              {errors.Email && (
                <span className="text-danger">{errors.Email.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Check // prettier-ignore
                label={`Email notification`}
                className='me-3'
                type='checkbox'
                {...register("notification", {
                  // required: "Address Two required",
                })}
                checked={isCSVCheckboxChecked}
                onChange={handleCSVCheckboxChange}
              />
            </Col>
          </Row>
          <Button className="mt-3 float-right" type="submit">
            Create Client
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export const EditClient = (props) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [checkboxtrue, setCheckboxtrue] = useState(false)
  // useEffect(() => {
  const {
    showClientEditModal,
    handleCloseUserEditModal,
    editUserData,
    CountryAll,
    setFullPageLoading
  } = props;



  const [validated, setValidated] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editUserData) {
      getProvianceByCountryId(editUserData.cityId?.parentId.parentId.id);
      getCityByProvianceId(editUserData.cityId?.parentId.id);
      reset({
        ClientName: editUserData.name,
        Address1: editUserData.address1,
        Address2: editUserData.address2,
        CountryCode: editUserData.countryCode,
        phoneNumber: editUserData.phone,
        Email: editUserData.clientEmail,
        Country:
          editUserData && editUserData.cityId?.parentId.parentId
            ? editUserData.cityId?.parentId.parentId.id
            : "",
        Province:
          editUserData && editUserData.cityId?.parentId
            ? editUserData.cityId?.parentId.id
            : "",
        City: editUserData && editUserData.cityId ? editUserData.cityId?.id : "",
        PostalCode: editUserData.postalCode,
        notification: editUserData.isEmailNotification,
      });
    }

  }, [editUserData]);

  const getProvianceByCountryId = (id) => {
    setProvince("");
    let formData = new FormData();
    formData.append("countryId", Number(id));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setLoading(true)
        setProvince("");
        if (res && res.data.status === 1) {
          setProvince(res.data.data.list);
          reset({
            ClientName: editUserData.name,
            Address1: editUserData.address1,
            Address2: editUserData.address2,
            phoneNumber: editUserData.phone,
            Email: editUserData.clientEmail,
            Country:
              editUserData && editUserData.cityId?.parentId.parentId
                ? editUserData.cityId?.parentId.parentId.id
                : "",
            Province:
              editUserData && editUserData.cityId?.parentId
                ? editUserData.cityId?.parentId.id
                : "",
            City:
              editUserData && editUserData.cityId
                ? editUserData.cityId?.id
                : "",
            PostalCode: editUserData.postalCode,

          });
        }
        return false;
      })
      .catch((err) => {
      });
  };
  const getCityByProvianceId = (id) => {
    setCity("");
    let formData = new FormData();
    formData.append("provinceId", Number(id));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCity(res.data.data.list);
          reset({
            ClientName: editUserData.name,
            Address1: editUserData.address1,
            Address2: editUserData.address2,
            phoneNumber: editUserData.phone,
            Email: editUserData.clientEmail,
            Country:
              editUserData && editUserData.cityId?.parentId.parentId
                ? editUserData.cityId?.parentId.parentId.id
                : "",
            Province:
              editUserData && editUserData.cityId?.parentId
                ? editUserData.cityId?.parentId.id
                : "",
            City:
              editUserData && editUserData.cityId
                ? editUserData.cityId?.id
                : "",
            PostalCode: editUserData.postalCode,

          });
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const getProviance = (e) => {
    setProvince("");
    setCity("");
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setLoading(true)
        setProvince("");
        if (res && res.data.status === 1) {
          setProvince(res.data.data.list);
        }
        // else {
        //     Swal.fire({
        //         icon: "warning",
        //         title: res.data.message,
        //         text: "User creation failed!",
        //     });

        //     // handleCloseUserModal();
        // }
        return false;
      })
      .catch((err) => {
      });
  };

  const getCity = (e) => {
    setCity("");
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCity(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const onSubmit = (data) => {
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to update this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        // let editData = {
        //   id: editUserData.id,
        //   name: data.ClientName,
        //   address1: data.Address1,
        //   address2: address2,
        //   cityId: data.City,
        //   phone: data.phoneNumber,
        //   postalCode: data.PostalCode,
        //   clientEmail: data.Email,
        //   isActive: editUserData.isActive,
        //   createdBy: editUserData.createdBy,
        //   countryCode: data.CountryCode,
        // };

        if (data.Address2 !== "") {
          let editData = {
            id: editUserData.id,
            name: data.ClientName,
            address1: data.Address1,
            address2: data.Address2,
            cityId: data.City,
            phone: data.phoneNumber,
            postalCode: data.PostalCode,
            clientEmail: data.Email,
            isEmailNotification: data.notification,
            // isActive: editUserData.isActive,
            createdBy: editUserData.createdBy,
            countryCode: data.CountryCode,
          };
          axiosInstance
            .post("client/editClient", editData, {
              headers: headersForJwt,
            })
            .then((res) => {
              setFullPageLoading(false);
              if (res && res.data.status === 1) {
                Swal.fire("Updated!", "Client updated successfully!", "Success");
                reset();
                handleCloseUserEditModal();
              } else {
                setFullPageLoading(false);
                Swal.fire({
                  icon: "warning",
                  title: "Oops...",
                  text: "Client update failed!",
                });
              }
              return false;
            })
            .catch((err) => {
              setFullPageLoading(false);
              // setErrorMessage('Something Went Wrong ..!');
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            });
        } else {
          if (data.Address2 === "") {
            let editData = {
              id: editUserData.id,
              name: data.ClientName,
              address1: data.Address1,
              address2: null,
              cityId: data.City,
              phone: data.phoneNumber,
              postalCode: data.PostalCode,
              clientEmail: data.Email,
              isEmailNotification: data.notification,
              // isActive: editUserData.isActive,
              createdBy: editUserData.createdBy,
              countryCode: data.CountryCode,
            };
            axiosInstance
              .post("client/editClient", editData, {
                headers: headersForJwt,
              })
              .then((res) => {
                if (res && res.data.status === 1) {
                  setFullPageLoading(false);
                  Swal.fire("Updated!", "Client updated successfully!", "Success");
                  reset();
                  handleCloseUserEditModal();
                } else {
                  setFullPageLoading(false);
                  Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Client update failed!",
                  });
                }
                return false;
              })
              .catch((err) => {
                setFullPageLoading(false);
                // setErrorMessage('Something Went Wrong ..!');
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              });
          }
        }
        // axiosInstance
        //   .post("client/editClient", editData, {
        //     headers: headersForJwt,
        //   })
        //   .then((res) => {
        //     if (res && res.data.status === 1) {
        //       Swal.fire("Updated!", "Client Updated successfully!", "success");
        //       reset();
        //       handleCloseUserEditModal();
        //     } else {
        //       Swal.fire({
        //         icon: "warning",
        //         title: "Oops...",
        //         text: "User Update failed!",
        //       });
        //     }
        //     return false;
        //   })
        //   .catch((err) => {
        //     // setErrorMessage('Something Went Wrong ..!');
        //     Swal.fire({
        //       icon: "error",
        //       title: "Oops...",
        //       text: "Something went wrong!",
        //     });
        //   });
      }
    });
  };
  const handleHide = () => {
    handleCloseUserEditModal();
  };
  const handleCSVCheckboxChange = (event) => {
    // setCSVCheckboxChecked(event.target.checked);

    if (event.target.checked === true) {
      setCheckboxtrue(true)
    }
    else {
      setCheckboxtrue(false)
    }
  }
  return (
    <Modal
      centered
      show={showClientEditModal}
      onHide={() => {
        // handleCloseUserEditModal();
        // reset();
        handleHide();
      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Edit Client
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            {/* Client Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="ClientName"
                {...register("ClientName", {
                  required: "Client name required",
                })}
              />
              {errors.ClientName && (
                <span className="text-danger">{errors.ClientName.message}</span>
              )}
            </Col>
            {/* Address1 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 1 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="Address1"
                className="newSize"
                {...register("Address1", {
                  required: "Address one required",
                })}
              />
              {errors.Address1 && (
                <span className="text-danger">{errors.Address1.message}</span>
              )}
            </Col>
            {/* Address2 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 2
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                name="Address2"
                className="newSize"
                {...register("Address2", {
                  // required: "Address Two required",
                })}
              />
              {/* {errors.Address2 && (
                <span className="text-danger">{errors.Address2.message}</span>
              )} */}
            </Col>
            {/* Postal Code */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Postal Code <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="PostalCode"
                {...register("PostalCode", {
                  required: "Postal code required",
                })}
              />
              {errors.PostalCode && (
                <span className="text-danger">{errors.PostalCode.message}</span>
              )}
            </Col>
            {/* Country */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="Country"
                id="Country"
                className="form-add-user newSize height-sm"
                {...register("Country", {
                  onChange: (e) => {
                    getProviance(e);
                  },
                  required: "Country required",
                })}
              >
                <option value="">Select Country</option>
                {CountryAll &&
                  CountryAll.length > 0 &&
                  CountryAll.map((cntr) => {
                    return (
                      <option value={cntr.countryId} key={cntr.countryId}>
                        {cntr.countryName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.Country && (
                <span className="text-danger">{errors.Country.message}</span>
              )}
            </Col>
            {/* Province */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Province <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="Province"
                id="Province"
                className="form-add-user newSize height-sm"
                {...register("Province", {
                  onChange: (e) => {
                    getCity(e);
                  },
                  required: "Province required",
                })}
              >
                <option value="">Select Province</option>
                {province &&
                  province.length > 0 &&
                  province.map((prov) => {
                    return (
                      <option value={prov.id} key={prov.id}>
                        {prov.name}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.Province && (
                <span className="text-danger">{errors.Province.message}</span>
              )}
            </Col>
            {/* City */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                City <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="City"
                id="City"
                className="form-add-user newSize height-sm"
                {...register("City", {
                  required: "City required",
                })}
              >
                <option value="">Select City</option>
                {city &&
                  city.length > 0 &&
                  city.map((city) => {
                    return (
                      <option value={city.cityId} key={city.cityId}>
                        {city.cityName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.City && (
                <span className="text-danger">{errors.City.message}</span>
              )}
            </Col>
            {/* Phone No. */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Phone No.
              </Form.Label>
              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="sm"
                  name="CountryCode"
                  id="CountryCode"
                  className="form-add-user newSize country-num"
                  {...register("CountryCode", {
                    // valueAsNumber: true,
                  })}
                >
                  <option value="1">+1</option>
                  {/* <option value="91">+91</option> */}
                </Form.Control>
                <Form.Control
                  type="tel"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="phoneNumber"
                  maxlength="10"
                  pattern="[0-9]{10}"
                  {...register("phoneNumber", {
                    // valueAsNumber: true,
                    // required: "Phone Number required",
                    // validate: (value) =>
                    //   getValues("phoneNumber").toString().length === 10,
                  })}
                />
              </div>
              {/* {errors.phoneNumber && (
                <span className="text-danger">Invalid Mobile Number</span>
              )} */}
            </Col>
            {/* Email */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email
                {/* <span className="text-danger">*</span> */}
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="Email"
                {...register("Email", {
                  // required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid Email address",
                  },
                })}
              />
              {errors.Email && (
                <span className="text-danger">{errors.Email.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Check // prettier-ignore
                label={`Email notification`}
                className='me-3'
                type='checkbox'
                {...register("notification", {
                  // required: "Address Two required",
                })}
                // checked={isCSVCheckboxChecked}
                onChange={handleCSVCheckboxChange}
              />
            </Col>
          </Row>
          <Button className="mt-3" type="submit">
            Update Client
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export const ViewClient = (props) => {
  const {
    clientViewData,
    showClientViewModal,
    setShowClientViewModal,
    clickedClientId,
    setFullPageLoading
  } = props;
  const { register, handleSubmit, control, reset } = useForm();

  const [jobPie, setJobPie] = useState([]);
  const [jobPieValues, setJobPieValues] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [dataForBar, setDataForBar] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [buildingsDD, setBuildingsDD] = useState([]);
  const [yearForJobPie, setYearForJobPie] = useState("");
  const [selectedBuildingsBar, setSelectedBuildingsBar] = useState([]);
  const [selectedYearBar, setSelectedYearBar] = useState("");
  const [selectedParameterBar, setSelectedParameterBar] = useState("0");
  const [selectedEnvironmentBar, setSelectedEnvironmentBar] = useState("0");
  const [selectedYearForBar, setSelectedYearForBar] = useState("0");
  const [YearForBar, setYearForBar] = useState([]);
  const [JobYear, setJobYear] = useState([]);
  const [ParameterForBar, setParameterForBar] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedGroupByClient, setselectedGroupByClient] = useState([]);
  const [isYearVisibleClient, setIsYearVisibleClient] = useState(false);
  const [param, setParam] = useState("");


  const JobPieData = [];
  const getMonthWiseJobStatus = async (Year) => {
    const formData = new FormData();
    formData.append("clientId", clickedClientId);

    if (Year > 0) {
      formData.append("year", Year);
    }
    else {
      formData.append("year", 0);
    }
    const dataFromAxios = await axiosInstance
      .post("building/getMonthWiseJobStatus", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setJobPieValues(res.data.data.jobStatus)
          const J = res.data.data.jobStatus;
          let dataJob = {};
          // dataJob["name"] = "Completed Job";
          // dataJob["y"] = J[0]?.completedJobPercentage;
          // JobPieData.push(dataJob);

          // let dataJob2 = {};
          // dataJob2["name"] = "Pending Job";
          // dataJob2["y"] = J[1]?.inCompletedJobPercentage;
          // JobPieData.push(dataJob2);
          // setJobPie(JobPieData);
          dataJob["name"] = "Completed Job";
          dataJob["y"] = J[0]?.completedJobPercentage;
          dataJob["completed"] = J[0]?.totalCompletedJobs;
          JobPieData.push(dataJob);

          let dataJob2 = {};
          dataJob2["name"] = "Pending Job";
          dataJob2["y"] = J[0]?.inCompletedJobPercentage;
          dataJob2["incompleted"] = J[0]?.totalIncompletedJobs;
          JobPieData.push(dataJob2);
          setJobPie(JobPieData);
        } else {
          setJobPie([]);
        }
      });
  };
  const getBuildingCompGraphBuildingDD = async () => {
    const formData = new FormData();
    formData.append("clientId", clickedClientId);

    const dataFromAxios = await axiosInstance
      .post("client/getBuildingCompGraphBuildingDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const data = [
            { value: "-1", label: "Select Building", isDisabled: true },
            ...res.data.data.buildingDD.map((item) => ({
              value: item.buildingId.toString(), // Convert id to string, if needed
              label: item.buildingName + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
            })),
          ];

          setBuildingsDD(data)
        } else {
          setBuildingsDD([])
        }
      });
  };
  const getBuildingCompGraphYearDD = async () => {
    const formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", clickedClientId);

    await axiosInstance
      .post("dashboard/getYearDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setYearForBar(res.data.data.list)
        } else {
          setYearForBar("")
        }
      });
  };
  const getYearForJob = async () => {
    const formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", clickedClientId);
    await axiosInstance
      .post("client/getBuildingCompGraphYearDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.yearDD.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        setJobYear(data);

      })
  };
  //  year DD
  const getBuildingCompGraphParamDD = async () => {
    // const formData = new FormData();
    // formData.append("clientId", clickedClientId); 

    const dataFromAxios = await axiosInstance
      .post("client/getBuildingCompGraphParamDD", [], {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          setParameterForBar(res.data.data.paramDD)
        } else {
          setParameterForBar("")
        }
      });
  };
  const getBuildingComparisonGraph = async (buildingIds, groupBy, year, environment, parameter) => {
    const formData = new FormData();
    formData.append("clientId", clickedClientId);
    if (buildingIds && buildingIds.length > 0) {
      formData.append("buildingIds", buildingIds);
    } else {
      return false;
    }
    if (year > 0 && groupBy === 'month') {
      formData.append("year", year);
    }
    // else {
    //   formData.append("year", 0);

    // }
    if (groupBy && groupBy !== '') {
      formData.append("flag", groupBy)
    } else {
      return false;
    }

    if (environment && environment !== '') {
      formData.append("environment", environment);
    } else {
      return false;
    }
    // else {
    //   formData.append("environment", true);

    // }
    if (parameter && parameter !== '') {
      formData.append("parameter", parameter);
    } else {
      return false;
    }
    // else {
    //   formData.append("parameter", "carbon_diaoxide");
    // }

    const dataFromAxios = await axiosInstance
      .post("dashboard/getBuildingCompGraphForDashboard", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // if (res.data.status === 1) {
        const response = res.data.data.graph;

        setCategories(res.data.data.monthName);
        setParam(res.data.data.param);
        const mainArr1 = [];
        Object.keys(response).forEach(function (key, value) {
          let dataBuilding1 = {};
          dataBuilding1["name"] = key;
          dataBuilding1["data"] = [];
          Object.keys(response[key]).forEach(function (k, value) {
            dataBuilding1["data"].push(response[key][k]["value"]);
          });
          mainArr1.push(dataBuilding1);
        });

        var numericArrrr = mainArr1.map(function (obj) {
          return {
            name: obj.name,
            data: obj.data.map(function (value) {
              return parseFloat(value);
            }),
          };
        });
        setDataForBar(numericArrrr);
        // } else {
        //   setDataForBar([]);
        // }
      });
  };

  // const getBuildingToBuildingcompGraph = async (buldingList, groupBy, year, environment, parameter) => {
  //   // setBuildingLoader(true)
  //   const formData = new FormData();
  //   formData.append("clientId", clickedClientId);
  //   if (buldingList != '') {
  //     formData.append("buildingIds", buldingList);
  //   } else {
  //     // formData.append("buildingIds", -1);
  //   }
  //   if (groupBy && groupBy !== '') {
  //     formData.append("flag", groupBy)
  //   }
  //   //  else {
  //   //   formData.append("flag", "month")
  //   // }
  //   if (year > 0) {
  //     formData.append("year", year);
  //   }
  //   // else {
  //   //   formData.append("year", 0);

  //   // }

  //   if (environment && environment !== '') {
  //     formData.append("environment", environment);
  //   }
  //   else {
  //     // formData.append("environment", true);

  //   }
  //   if (parameter && parameter !== '') {
  //     formData.append("parameter", parameter);
  //   }
  //   // else {
  //   //   formData.append("parameter", "carbon_dioxide");
  //   // }

  //   await axiosInstance
  //     .post("dashboard/getBuildingCompGraphForDashboard", formData, {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         const response = res.data.data.graph;
  //         setXAxisCategoriesArea(res.data.data.monthName);
  //         setParamForBuilding(res.data.data.param);
  //         const mainArr1 = [];
  //         Object.keys(response).forEach(function (key, value) {
  //           let dataBuilding1 = {};
  //           dataBuilding1["name"] = key;
  //           dataBuilding1["data"] = [];
  //           Object.keys(response[key]).forEach(function (k, value) {
  //             dataBuilding1["data"].push(response[key][k]["value"]);
  //           });
  //           mainArr1.push(dataBuilding1);
  //         });


  //         var numericArrrr = mainArr1.map(function (obj) {
  //           return {
  //             name: obj.name,
  //             data: obj.data.map(function (value) {
  //               return parseFloat(value);
  //             }),
  //           };
  //         });
  //         setDataForBuilding(numericArrrr);
  //         // setBuildingLoader(false)
  //         // setXAxisCategoriesArea(dummy1)
  //       } else {
  //         // setSurveyStaticsLoader(false)
  //         setDataForBuilding([]);

  //       }
  //     });
  // };

  const getYearWiseJobStatusDD = async () => {
    const formData = new FormData();
    formData.append("clientId", clickedClientId);
    axiosInstance
      .post("client/getYearWiseJobStatusDD", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          setYearForJobPie(res.data.data.yearDD);
        } else {
          setYearForJobPie('');
        }


      })
      .catch((err) => {
      });
  };
  useEffect(() => {
    setSelectedParameterBar(null);
    setSelectedEnvironmentBar(null);
    setSelectedYearForBar(null);
    if (showClientViewModal) {
      setSelectedOptions([]);
      getYearForJob();
      getYearForJob();
      getMonthWiseJobStatus();
      // getBuildingComparisonGraph();
      getBuildingCompGraphBuildingDD();
      getYearWiseJobStatusDD();
      getBuildingCompGraphYearDD();
      getBuildingCompGraphParamDD();
    }
  }, [showClientViewModal]);

  const PropsForPie = {
    title: "Job Status",
    name: "Job Status",
    data: jobPie,
  };
  const PropsForBar = {
    title: "Job Building Parameter",
    yAxis: param,
    xAxis: xAxis,
    dataForBar: dataForBar,
    categories: categories
  };

  // const PropsForJobList = {
  //   type: "ViewJob in Client",
  //   clickedClientId,
  //   viewType: "ViewById",
  //   parentName: `(${clientViewData?.name} Tank-${clientViewData?.id})`,
  // };

  // const PropsForBuildingList = {
  //   type: "ViewBuilding in Client",
  //   clickedClientId,
  //   viewType: "ViewById",
  //   parentName: `(${clientViewData?.name} Tank-${clientViewData?.id})`,
  // };
  const propsForCallOtherComponents = {
    type: "View in Client",
    clickedClientId,
    viewType: "ViewById",
    parentName: `(${clientViewData?.name} Tank-${clientViewData?.id})`,
  };


  const handleHide = () => {
    setShowClientViewModal(false);
    setDataForBar([]);
    reset({ buildings: "0", groupByBar: "0", yearBar: "0", environmentBar: "0", parameterBar: "0" });

  };

  const handlePieYearChange = (e) => {
    getMonthWiseJobStatus(e)
    setSelectedYear(e)
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedValuesArray = [];
    if (selectedOptions.target.value.length <= 3) {
      selectedOptions.target.value.forEach((option) => {
        selectedValuesArray.push(option.value);
      });
      getBuildingComparisonGraph(selectedValuesArray, selectedGroupByClient, selectedYearForBar, selectedEnvironmentBar, selectedParameterBar);
      setSelectedBuildingsBar(selectedValuesArray);
      setSelectedOptions(selectedOptions.target.value);

    }
    else {
      return false;
    }

  };

  const paramChangeHandle = (e) => {
    getBuildingComparisonGraph(selectedBuildingsBar, selectedGroupByClient, selectedYearForBar, selectedEnvironmentBar, e.target.value);
    setSelectedParameterBar(e.target.value);

  };
  const handleEnvironmentChange = (e) => {

    getBuildingComparisonGraph(selectedBuildingsBar, selectedGroupByClient, selectedYearForBar, e.target.value, selectedParameterBar);
    setSelectedEnvironmentBar(e.target.value);

  };

  const handleGroupByChangeForBuilding = (e) => {
    reset({ yearBar: 0 });
    setSelectedYearForBar(0);
    const selectedValue = e ? e.target.value : '';
    if (selectedValue === 'year') {
      setIsYearVisibleClient(false);
    } else {
      setIsYearVisibleClient(true);
    }
    getBuildingComparisonGraph(selectedBuildingsBar, e.target.value, "", selectedEnvironmentBar, selectedParameterBar);
    setselectedGroupByClient(e.target.value);
  }

  const handleYearChange = (e) => {
    getBuildingComparisonGraph(selectedBuildingsBar, selectedGroupByClient, e.target.value, selectedEnvironmentBar, selectedParameterBar);
    setSelectedYearForBar(e.target.value);
  }


  return (
    <Modal
      show={showClientViewModal}
      onHide={() => {
        // handleCloseUserEditModal();
        // reset();
        handleHide();
      }}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-60w"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Client View
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example user-view-container">
        <Container fluid>
          <Row className="mb-3 gx-2">
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Client Name</h6>
                <div>
                  <p>{clientViewData.name}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Email</h6>
                <div>
                  <p>{clientViewData.clientEmail}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Phone</h6>
                <div>
                  <p>{clientViewData.phone}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Country</h6>
                <div>
                  <p>{clientViewData.cityId?.parentId?.parentId?.name}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Province</h6>
                <div>
                  <p>{clientViewData.cityId?.parentId?.name}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">City</h6>
                <div>
                  <p>{clientViewData.cityId?.name}</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Address 1</h6>
                <div>
                  <p>{clientViewData.address1}</p>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Address 2</h6>
                <div>
                  <p>{clientViewData.address2}</p>
                </div>
              </div>
            </Col>



            <Col lg={3} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Postal Code</h6>
                <div>
                  <p>{clientViewData.postalCode}</p>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize">Email Notification</h6>
                <div>
                  <p>{clientViewData.isEmailNotification ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </Col>

            {/* ------------------------------------------------------------------- */}
            <Col lg={8} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="select-container-box">
                <Col lg="3">
                  <Controller
                    control={control}
                    name="buildings"
                    {...register("buildings", {
                      onChange: (e) => { handleSelectChange(e) }
                    })
                    }
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={buildingsDD ?? []}
                          isMulti
                          isSearchable
                          value={selectedOptions}
                          className="select-bar-filed"
                        />
                      </>
                    )}
                  />
                </Col>
                {/* groupBy */}
                <Col lg="2">
                  <Form.Select
                    name="groupBy"
                    {...register("groupByBar", {
                      onChange: (e) => handleGroupByChangeForBuilding(e)

                    })}
                    aria-label="Default select example" size="sm" className="incsize">
                    <option value="0" selected disabled>Select group by</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>

                  </Form.Select>

                </Col>
                {isYearVisibleClient === true ? (
                  <Col lg="2">
                    <Form.Select
                      name="yearBar"
                      {...register("yearBar", {
                        onChange: (e) => { handleYearChange(e) }
                      })
                      }
                      aria-label="Default select example" size="sm" className="incsize">
                      <option value="0" selected disabled>Select Year</option>

                      {YearForBar &&
                        YearForBar.length > 0 &&
                        YearForBar.map((yearBar) => {
                          return (
                            <option value={yearBar.year} key={yearBar.year}>
                              {yearBar.year}
                            </option>
                          );
                        })}

                    </Form.Select>
                  </Col>) : null}
                <Col lg="2">
                  <Form.Select
                    name="environmentBar"
                    {...register("environmentBar", {
                      onChange: (e) => { handleEnvironmentChange(e) }
                    })
                    }
                    aria-label="Default select example" size="sm" className="incsize">
                    <option value="0" selected disabled>Select Environment</option>
                    <option value="true">Indoor</option>
                    <option value="false">Outdoor</option>

                  </Form.Select>
                </Col>
                <Col lg="2">
                  <Form.Select
                    name="parameterBar"
                    {...register("parameterBar", {
                      onChange: (e) => { paramChangeHandle(e) }
                    })}
                    aria-label="Default select example" size="sm" className="incsize"
                  >
                    <option value="0" selected disabled>Select Parameter</option>
                    {ParameterForBar &&
                      ParameterForBar.length > 0 &&
                      ParameterForBar.map((param) => {
                        // Create a temporary element to extract text content
                        const tempElement = document.createElement("div");
                        tempElement.innerHTML = param.htmlDisplayName;
                        const textContent = tempElement.innerText;

                        return (
                          <option value={param.columnName} key={param.columnName}>
                            {textContent}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Col>

              </div>
              <HighChartBarChart {...PropsForBar} />
            </Col>
            {/* -------------------------------------------------------------- */}
            <div className="col-lg-4">
              <div className="content-view-jobs">
                <Col lg="4">
                  <Controller
                    control={control}
                    name="jobyear"
                    {...register("jobyear", {
                      onChange: (e) => { handlePieYearChange(e.target.value.value) } // Corrected function name
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={JobYear}
                          placeholder="Year"
                          clearButton
                        />
                      </>
                    )}
                  />
                </Col>


                {/* <Col lg="2">
                  <Form.Select
                    onChange={hadlePieYearChange}
                    aria-label="Default select example"
                    size="sm"
                    className="incsize"

                  >
                   
                    {yearForJobPie &&
                      yearForJobPie.length > 0 &&
                      yearForJobPie.map((yearPie) => {

                        return (
                          <option value={yearPie.year} key={yearPie.year}>
                            {yearPie.year}
                          </option>
                        );
                      })}


                  </Form.Select>
                </Col> */}
                {/* <Col lg="3">
                  <Form.Select
                    className="incsize"
                    onChange={hadlePieChange}
                    aria-label="Default select example"
                    size="sm"
                  >

                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Form.Select>
                </Col> */}
                <Col lg="6">
                  <div class="bd-highlight">
                    <h6 className="p-2">Completed: <span className="color-1">{jobPie[0]?.completed}</span></h6>
                    <h6 className="p-2">Pending: <span className="color-2">{jobPie[1]?.incompleted}</span></h6>
                  </div>
                </Col>
              </div>
              <HighChartPieChart {...PropsForPie} />

            </div>

            <Accordion defaultActiveKey="">
              {/* <Accordion.Item eventKey="0">
                <Accordion.Header>Client Representative </Accordion.Header>
                <Accordion.Body>

                  <ClientRepresentative {...propsForCallOtherComponents} />

                </Accordion.Body>
              </Accordion.Item> */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>Buildings</Accordion.Header>
                <Accordion.Body>

                  <BuildingList {...propsForCallOtherComponents} />

                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Jobs</Accordion.Header>
                <Accordion.Body>
                  <JobList  {...propsForCallOtherComponents} />

                </Accordion.Body>
              </Accordion.Item>


            </Accordion>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
        <Button
          onClick={() => {
            // handleCloseUserEditModal();
            // reset();
            handleHide();
          }}
        >Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
