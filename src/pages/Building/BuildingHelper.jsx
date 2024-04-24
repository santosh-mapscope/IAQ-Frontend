import React, { useEffect, useState } from "react";

import { Col, Button, Row, Form, Modal, Card } from "react-bootstrap";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import Accordion from "react-bootstrap/Accordion";
import { useForm, Controller } from "react-hook-form";
import Container from "react-bootstrap/Container";
import {
  HighChartPieChart,
  HighChartAreaChart,
} from "../../components/Charts/Charts";
import JobList from "../Jobs";
import Report from "../Report"
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { right } from "@popperjs/core";
import TenantsList from "../Tenants/Tenants";
import noImage from "../../assets/dist/img/no-img.png";
import LightboxComponent from '../../components/Lightbox';


// ADD BUILDING
export const AddBuilding = (props) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [Client, setClient] = useState("");
  const [showAddBuildingOperatorModal, setshowAddBuildingOperatorModal] = useState(false);
  // const [ClientRepresentative, setClientRepresentative] = useState("");
  const { showBuildingModal, handleCloseAddBuildingModal, CountryAll, setFullPageLoading } = props;

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const [userData, userName] = useRecoilState(userAtom);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [createBuildingOperatorData, setCreateBuildingOperatorData] = useState("");

  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
    reset: reset1,
    formState: { errors: errors2 },
  } = useForm();

  const onBuildingOperatorSubmit = (data) => {
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
        setCreateBuildingOperatorData(data);
        handleAddBuildingOperatorHide();
      }
    })

  }

  const removeBuildingOperator = () => {
    setCreateBuildingOperatorData("");
  }

  const onSubmit = (data) => {
    // console.log(createBuildingOperatorData);
    // console.log(createBuildingOperatorData.firstName);
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
        setFullPageLoading(true);
        let formData = new FormData();
        let userid = JSON.parse(localStorage.getItem("user"));
        let final_data = {
          name: data.buildingName,
          nameDisplayed: data.displayName,
          address1: data.buildingAddress1 === '' ? address1 : data.buildingAddress1,
          address2: data.buildingAddress2 === '' ? address2 : data.buildingAddress2,
          cityId: data.City,
          postalCode: data.postalCode === '' ? postalCode : data.postalCode,
          phone: data.phoneNumber === '' ? phoneNumber : data.phoneNumber,
          email: data.email === '' ? email : data.email,
          contact: "",
          contactAddress1: "",
          contactAddress2: "",
          contactCityId: "",
          contactPostalCode: "",
          projectNumber: "",
          whereFrom: "",
          budget: "",
          primaryContactId: data.clentRepresentative,
          userId: userid.userDetails.userId,
          countryCode: data.CountryCode === '' ? countryCode : data.CountryCode,
          clientId: data.ClientName,

        };
        if (createBuildingOperatorData) {
          final_data.userMasterDto = {
            userName: createBuildingOperatorData.userName,
            phoneNumber: createBuildingOperatorData.phoneNumber,
            email: createBuildingOperatorData.email,
            password: createBuildingOperatorData.password,
            firstName: createBuildingOperatorData.firstName,
            middleName: createBuildingOperatorData.middleName,
            lastName: createBuildingOperatorData.lastName,
          }
        }

        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];

        formData.append("buildingData", JSON.stringify(final_data));


        axiosInstance
          .post("building/createBuilding", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            // console.log(res); 
            if (res && res.data.status === 1) {
              setFullPageLoading(false);
              Swal.fire("Created!", "Building added successfully!", "success");
              reset();
              reset1();
              handleCloseAddBuildingModal();
              removeBuildingOperator();
              setAddress1("");
              setAddress2("");
              setEmail("");
              setPostalCode("");
              setPhoneNumber("");
              setCountryCode("");
              setProvince("");
              setCity("");
              setClient("");
            } else {
              setFullPageLoading(false);
              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Building creation failed!",
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
    });
  };


  const handleHide = () => {
    handleCloseAddBuildingModal();
    removeBuildingOperator();
    reset({
      buildingName: "",
      buildingAddress1: "",
      buildingAddress2: "",
      displayName: "",
      Country: "",
      Province: "",
      City: "",
      ClientName: "",
      clentRepresentative: "",
      postalCode: "",
      phoneNumber: "",
      CountryCode: 1,
      email: "",
    });
    reset1({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      // Country: "",
      phoneNumber: "",
      userName: "",
      password: "",
      cPassword: ""
    });
    setAddress1("");
    setAddress2("");
    setEmail("");
    setPostalCode("");
    setPhoneNumber("");
    setCountryCode("");
  };
  const handleAddBuildingOperatorHide = () => {
    setshowAddBuildingOperatorModal(false);
    // reset1({
    //   firstName: "",
    //   middleName: "",
    //   lastName: "",
    //   email: "",
    //   // Country: "",
    //   phoneNumber: "",
    //   userName: "",
    //   password: "",
    //   clentRepresentative: "",
    //   postalCode: "",
    //   phoneNumber: "",
    //   CountryCode: 1,
    //   email: "",
    // });
  };

  const getProviance = (e) => {
    // console.log(e.target.value);
    setProvince("");
    setCity("");
    setClient("");
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setLoading(true)
        setProvince("");
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setProvince(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getCity = (e) => {
    // console.log(e.target.value);
    setCity("");
    setClient("");
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setCity("");
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCity(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getClientName = (e) => {
    // console.log(e.target.value);
    setClient("");
    let formData = new FormData();
    // formData.append("cityId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllClientDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setClient(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const fetchData = (e) => {
    setAddress1("");
    setAddress2("");
    setEmail("");
    setPostalCode("");
    setPhoneNumber("");
    setCountryCode("");
    let formData = new FormData();
    formData.append("clientId", Number(e.target.value));
    axiosInstance.post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {

        setAddress1(res.data.data.list ? res.data.data.list.address1 : '');
        setAddress2(res.data.data.list ? res.data.data.list.address2 : '');
        setEmail(res.data.data.list ? res.data.data.list.clientEmail : '');
        setPostalCode(res.data.data.list ? res.data.data.list.postalCode : '');
        setPhoneNumber(res.data.data.list ? res.data.data.list.phone : '');
        setCountryCode(res.data.data.list ? res.data.data.list.countryCode : '');


      })
  }
  const AddressSetFor1 = (e) => {
    setAddress1(e.target.value);
  }
  const AddressSetFor2 = (e) => {
    setAddress2(e.target.value);
  }
  const postalCodeSet = (e) => {
    setPostalCode(e.target.value);
  }
  const PhoneNoSet = (e) => {
    setPhoneNumber(e.target.value);
  }
  const EmailSet = (e) => {
    setEmail(e.target.value);
  }




  return (
    <>
      <Modal
        centered
        show={showBuildingModal}
        onHide={() => {
          handleHide();
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="modal-header-section">
          <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
            Add Building
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example inside-padding user-modal">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row className="mb-3">
              {/* Building Name */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Building Name
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="buildingName"
                  {...register("buildingName", {
                    // required: "Building Name required",
                  })}
                />
                {/* {errors.buildingName && (
                <span className="text-danger">
                  {errors.buildingName.message}
                </span>
              )} */}
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
                  className="form-add-user newSize"
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
                  className="form-add-user newSize"
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
                  className="form-add-user newSize"
                  {...register("City", {
                    onChange: (e) => {
                      getClientName(e);
                    },
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

              {/* Client Name */}
              <Col lg={4} md={6} xs={12} className="mb-3">
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
                      fetchData(e);
                    },
                    required: "Client name required",
                  })}
                >
                  <option value="">Select client name</option>
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
                {errors.ClientName && (
                  <span className="text-danger">{errors.ClientName.message}</span>
                )}
              </Col>

              {/* Building Address 1 */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Building Address 1
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="buildingAddress1"
                  // defaultValue={address1}
                  value={address1}
                  {...register("buildingAddress1", {
                    onChange: (e) => {
                      AddressSetFor1(e);
                    },
                    // required: "Building Address required",
                  })}
                />
                {/* {errors.buildingAddress1 && (
                  <span className="text-danger">
                    {errors.buildingAddress1.message}
                  </span>
                )} */}
              </Col>

              {/* Building Address 2 */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">Building Address 2</Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="buildingAddress2"
                  // defaultValue={address2}
                  value={address2}
                  {...register("buildingAddress2", {
                    // required: "Building Address required"
                    onChange: (e) => {
                      AddressSetFor2(e);
                    },
                  })}
                />
                {/* {errors.buildingAddress2 && (
                  <span className="text-danger">
                    {errors.buildingAddress2.message}
                  </span>
                )} */}
              </Col>

              {/* Display Name */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">Display Name</Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="displayName"
                  {...register("displayName", {
                    // required: "Display Name required",
                  })}
                />
                {/* {errors.displayName && (
                  <span className="text-danger">
                    {errors.displayName.message}
                  </span>
                )} */}
              </Col>

              {/* Client Reprasentative Name */}
              {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Reprasentative Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="clentRepresentative"
                id="clentRepresentative"
                option
                className="form-add-user newSize"
                {...register("clentRepresentative", {
                  required: "Clent Representative Name Required",
                })}
              >
                <option value="">Select ClentRepresentative Name</option>
                {ClientRepresentative &&
                  ClientRepresentative.length > 0 &&
                  ClientRepresentative.map((city) => {
                    return (
                      <option value={city.id} key={city.id}>
                        {city.userName}
                      </option>
                    );
                  })}
              </Form.Control>
              {errors.clentRepresentative && (
                <span className="text-danger">{errors.clentRepresentative.message}</span>
              )}
            </Col> */}

              {/* Postal Code */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Postal Code
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="postalCode"
                  value={postalCode}
                  {...register("postalCode", {
                    // required: "Postal Code required",
                    onChange: (e) => {
                      postalCodeSet(e);
                    },
                  })}
                />
                {/* {errors.postalCode && (
                  <span className="text-danger">{errors.postalCode.message}</span>
                )} */}
              </Col>

              {/* Mobile Number */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Phone No
                </Form.Label>

                <div className="phone-container">
                  <Form.Control
                    as="select"
                    size="sm"
                    name="CountryCode"
                    id="CountryCode"
                    value={countryCode}
                    className="form-add-user newSize country-num"
                    {...register("CountryCode", {
                      valueAsNumber: true,
                    })}
                  >
                    <option value="1">+1</option>
                  </Form.Control>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="phoneNumber"
                    className="form-control-add-user newSize"
                    maxlength="10"
                    pattern="\d{10}"
                    value={phoneNumber}
                    {...register("phoneNumber", {
                      //  required: "phoneNumber required",
                      pattern: {
                        value: /\d{10}/,
                        message: "Invalid phone number",
                      },
                      onChange: (e) => {
                        PhoneNoSet(e);
                      },
                    })}
                  />
                </div>

                {errors.phoneNumber && (
                  <span className="text-danger">Invalid mobile number</span>
                )}
                {/* {errors.phoneNumber && (
                  <span className="text-danger">{errors.phoneNumber.message}</span>
                )} */}
              </Col>

              {/* Email id */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Email
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  name="email"
                  className="newSize"
                  value={email}
                  {...register("email", {
                    //  required: "Email required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                    onChange: (e) => {
                      EmailSet(e);
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </Col>

              {/* Image */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">Image</Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="image"
                  {...register("image", {
                    // required: "Image required",
                    validate: (value) => {
                      const acceptedFormats = ["jpg", "jpeg", "png", "gif"];

                      const fileExtension = value[0]?.name
                        .split(".")
                        .pop()
                        .toLowerCase();
                      if (
                        fileExtension &&
                        !acceptedFormats.includes(fileExtension)
                      ) {
                        return "Invalid file format. Only jpg, jpeg, png, gif files are allowed.";
                      }
                      return true;
                    },
                  })}
                />
                {/* {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )} */}
              </Col>
              <hr className="mt-3" />
              {createBuildingOperatorData && (
                <Card className="mt-3">
                  <Card.Body>
                    <h5>Building Operator Details:</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone number</th>
                            <th></th>
                          </tr>
                          <tr>
                            <td>{`${createBuildingOperatorData.firstName} ${createBuildingOperatorData.middleName} ${createBuildingOperatorData.lastName}`}</td>
                            <td>{createBuildingOperatorData.email}</td>
                            <td>{createBuildingOperatorData.phoneNumber}</td>
                            <td>
                              <Button variant="info" size="sm" onClick={() => setshowAddBuildingOperatorModal(true)}>  Edit </Button>
                              <Button variant="danger" size="sm" onClick={removeBuildingOperator}>  Remove </Button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {/* Add building operator */}
              {!createBuildingOperatorData ? (
                <Col lg={6} md={6} xs={12} className="mt-3 mb-3">
                  <Button onClick={() => setshowAddBuildingOperatorModal(true)}>
                    Add Building Operator
                  </Button>
                </Col>
              ) : (
                <Col lg={6} md={6} xs={12} className="mt-3 mb-3"></Col>
              )}
              <Col lg={6} md={6} xs={12} className="mt-3 mb-3">
                <Button style={{ 'float': right }} className="" type="submit">
                  Add Building
                </Button>
              </Col>

            </Row>


          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Building Operator Modal */}
      <Modal
        centered
        show={showAddBuildingOperatorModal}
        onHide={() => {
          handleAddBuildingOperatorHide();
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="modal-header-section">
          <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
            Add Building Operator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example inside-padding user-modal inside-modal-build">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit1(onBuildingOperatorSubmit)}
          >
            <Row className="mb-3">
              {/* First Name */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  First Name <span className="text-danger" >*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="firstName"
                  {...register1("firstName", {
                    required: "First name required",
                  })}
                />
                {errors2.firstName && (
                  <span className="text-danger">{errors2.firstName.message}</span>
                )}
              </Col>

              {/* Middle Name */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="middleName"
                  {...register1("middleName", {})}
                />
                {/* {errors.middleName && (
                  <span className="text-danger">{errors.middleName.message}</span>
                )} */}
              </Col>

              {/* Last Name */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Last Name <span className="text-danger" >*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="lastName"
                  {...register1("lastName", {
                    required: "Last name required",
                  })}
                />
                {errors2.lastName && (
                  <span className="text-danger">{errors2.lastName.message}</span>
                )}
              </Col>

              {/* Email id */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  name="email"
                  className="newSize"
                  {...register1("email", {
                    required: "Email required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                {errors2.email && (
                  <span className="text-danger">{errors2.email.message}</span>
                )}
              </Col>

              {/* Mobile Number */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Phone No.<span className="text-danger">*</span>
                </Form.Label>

                <div className="phone-container">
                  <Form.Control
                    as="select"
                    size="sm"
                    name="CountryCode"
                    id="CountryCode"
                    defaultValue={countryCode}
                    className="form-add-user newSize country-num"
                    {...register("CountryCode", {
                      valueAsNumber: true,
                    })}
                  >
                    <option value="1">+1</option>
                  </Form.Control>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="phoneNumber"
                    className="form-control-add-user newSize"
                    maxlength="10"
                    pattern="\d{10}"
                    // defaultValue={phoneNumber}
                    {...register1("phoneNumber", {
                      pattern: {
                        value: /\d{10}/,
                        message: "Invalid Phonne Number",
                      },
                    })}
                  />
                  {errors2.phoneNumber && (
                    <span className="text-danger">Invalid mobile number</span>
                  )}
                </div>


              </Col>

              {/* Username */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="userName"
                  {...register1("userName", {
                    required: "Username required",
                  })}
                />
                {errors2.userName && (
                  <span className="text-danger">{errors2.userName.message}</span>
                )}
              </Col>

              {/* Password */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Password <span className="text-danger">*</span>
                  <span></span>
                  <span className="eye-password" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Label>

                <Form.Control
                  size="sm"
                  className="form-control-add-user newSize"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...register1("password", {
                    required: "Password required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                      message:
                        "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
                    },
                  })}

                />

                {errors2.password && (
                  <span className="text-danger">{errors2.password.message}</span>
                )}
                {passwordMatchError && (
                  <span className="text-danger">
                    Password should meet the criteria
                  </span>
                )}
              </Col>

              {/* Confirm Password */}
              <Col lg={6} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Confirm Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="cPassword"
                  {...register1("cPassword", {
                    required: true,
                    validate: (val) => {
                      if (watch1("password") != val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                {errors2.cPassword && (
                  <span className="text-danger">{errors2.cPassword.message}</span>
                )}
              </Col>
            </Row>

            <Button style={{ 'float': right }} className="mt-3" type="submit">
              Create Building Operator
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
// EDIT BUILDING
export const EditBuilding = (props) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [Client, setClient] = useState("");
  const [ClientRepresentative, setClientRepresentative] = useState("");
  const {
    showBuildingEditModal,
    handleCloseBuildingEditModal,
    editBuildingData,
    CountryAll,
    setFullPageLoading
    // data
  } = props;

  // console.log("==", editBuildingData);

  const [validated, setValidated] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editBuildingData) {
      getProvianceByCountryId(editBuildingData?.countryId);

      reset({
        buildingName: editBuildingData?.buildingName,
        buildingAddress1: editBuildingData?.address1,
        buildingAddress2: editBuildingData?.address2,
        displayName: editBuildingData?.nameDisplayed,
        Country:
          editBuildingData && editBuildingData?.countryId
            ? editBuildingData?.countryId
            : "",
        Province:
          editBuildingData && editBuildingData?.provinceId
            ? editBuildingData?.provinceId
            : "",
        City:
          editBuildingData && editBuildingData?.cityId
            ? editBuildingData?.cityId
            : "",
        ClientName:
          editBuildingData && editBuildingData?.clientId
            ? editBuildingData?.clientId
            : "",
        clentRepresentative:
          editBuildingData && editBuildingData?.primaryContactId
            ? editBuildingData?.primaryContactId
            : "",
        postalCode: editBuildingData?.postalCode,
        phoneNumber: editBuildingData?.phone,
        email: editBuildingData?.email,
        image: editBuildingData?.photo,
      });
    }

  }, [editBuildingData]);

  const getProvianceByCountryId = (id) => {

    let formData = new FormData();
    formData.append("countryId", Number(id));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        getCityByProvianceId(editBuildingData.provinceId);
        // setLoading(true)
        // setProvince("");
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setProvince(res.data.data.list);
          reset({
            Province:
              editBuildingData && editBuildingData.provinceId
                ? editBuildingData.provinceId
                : "",
          });
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getCityByProvianceId = (id) => {
    // setCity("");
    // setClient("");
    setClientRepresentative("");
    let formData = new FormData();
    formData.append("provinceId", Number(id));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setCity("");
        getClientByCityId(editBuildingData.cityId);
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCity(res.data.data.list);
          // setCountry(res.data.data.list);
          reset({
            City:
              editBuildingData && editBuildingData.cityId
                ? editBuildingData.cityId
                : "",
          });
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getClientByCityId = (id) => {
    // console.log(e.target.value);
    // setClient("");
    // setClientRepresentative("");
    let formData = new FormData();
    // formData.append("cityId", Number(id));

    axiosInstance
      .post(`client/getAllClientDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setClient("");
        getClientRepresentativeByClientId(editBuildingData.clientId);
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setClient(res.data.data.list);
          // setCountry(res.data.data.list);
          reset({
            ClientName:
              editBuildingData && editBuildingData.clientId
                ? editBuildingData.clientId
                : "",
          });
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClientRepresentativeByClientId = (id) => {
    // console.log(e.target.value);
    // setClientRepresentative("");
    let formData = new FormData();
    formData.append("clientId", Number(id));

    axiosInstance
      .post(`users/getUserNameDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setClientRepresentative(res.data.data.list);
          // setCountry(res.data.data.list);
          reset({
            clentRepresentative:
              editBuildingData && editBuildingData.primaryContactId
                ? editBuildingData.primaryContactId
                : "",
          });
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getProviance = (e) => {
    // console.log(e.target.value);
    setProvince("");
    setCity("");
    setClient("");
    setClientRepresentative("");
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    // axiosInstance
    //   .post(`client/getAllProvinceByCountryId`, formData, {
    //     headers: headersForJwt,
    //   })
    //   .then((res) => {  
    //     setProvince("");
    //     if (res && res.data.status === 1) {
    //       // console.log(res.data.data.list);
    //       setProvince(res.data.data.list);
    //     }

    //     return false;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const getCity = (e) => {
    // console.log(e.target.value);
    setCity("");
    setClient("");
    setClientRepresentative("");
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setCity("");
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCity(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getClientName = (e) => {
    // console.log(e.target.value);
    setClient("");
    setClientRepresentative("");
    let formData = new FormData();
    formData.append("cityId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllClientDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setClient("");
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setClient(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getClientRepresentative = (e) => {
    // console.log(e.target.value);
    setClientRepresentative("");
    let formData = new FormData();
    formData.append("clientId", Number(e.target.value));

    axiosInstance
      .post(`users/getUserNameDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {

        if (res && res.data.status === 1) {
          setClientRepresentative(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
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
        // console.log("++", data);
        let userid = JSON.parse(localStorage.getItem("user"));
        let editData = {
          id: editBuildingData.buildingId,
          name: data.buildingName,
          nameDisplayed: data.displayName,
          address1: data.buildingAddress1,
          address2: data.buildingAddress2,
          cityId: data.City,
          postalCode: data.postalCode,
          phone: data.phoneNumber,
          email: data.email,
          contact: "",
          contactAddress1: "",
          contactAddress2: "",
          contactCityId: "",
          contactPostalCode: "",
          projectNumber: "",
          whereFrom: "",
          budget: "",
          primaryContactId: data.clentRepresentative,
          createdBy: userid.userDetails.userId,
          countryCode: data.CountryCode,
          clientId: data.ClientName,
          updatedBy: userid.userDetails.userId,
        };

        let formData = new FormData();
        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];
        // delete data["email"];
        // delete data["password"];
        // delete data["userName"];

        formData.append("buildingData", JSON.stringify(editData));
        axiosInstance
          .post("building/editBuilding", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false);
              Swal.fire(
                "Updated!",
                "Building updated successfully!",
                "Success"
              );
              reset();
              handleCloseBuildingEditModal();
            } else {
              setFullPageLoading(false);
              Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Building updation failed!",
              });
            }
            return false;
          })
          .catch((err) => {
            setFullPageLoading(false);
            // setErrorMessage('Something Went Wrong ..!');
            Swal.fire({
              icon: "error",
              title: "Oops j...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };

  const handleHide = () => {
    handleCloseBuildingEditModal();
  };

  return (
    <Modal
      centered
      show={showBuildingEditModal}
      onHide={() => {
        handleHide();
      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Edit Building
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            {/* Building Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Name
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingName"
                {...register("buildingName", {
                  // required: "Building Name required",
                })}
              />
              {/* {errors.buildingName && (
                <span className="text-danger">{errors.buildingName.message}</span>
              )} */}
            </Col>

            {/* Building Address 1 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Address 1 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingAddress1"
                {...register("buildingAddress1", {
                  required: "Building address required",
                })}
              />
              {errors.buildingAddress1 && (
                <span className="text-danger">
                  {errors.buildingAddress1.message}
                </span>
              )}
            </Col>

            {/* Building Address 2 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Building Address 2</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingAddress2"
                {...register("buildingAddress2", {})}
              />
              {/* {errors.buildingAddress2 && (
                <span className="text-danger">{errors.buildingAddress2.message}</span>
              )} */}
            </Col>

            {/* Display Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Display Name</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="displayName"
                {...register("displayName", {})}
              />
              {/* {errors.displayName && (
                <span className="text-danger">{errors.displayName.message}</span>
              )} */}
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
                className="form-add-user newSize"
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
                className="form-add-user newSize"
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
                className="form-add-user newSize"
                {...register("City", {
                  onChange: (e) => {
                    getClientName(e);
                  },
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

            {/* Client Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
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
                    getClientRepresentative(e);
                  },
                  required: "Client name required",
                })}

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
              {errors.ClientName && (
                <span className="text-danger">{errors.ClientName.message}</span>
              )}
            </Col>

            {/* Client Reprasentative Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Representative Name
              </Form.Label>

              <Form.Select
                as="select"
                size="sm"
                name="clentRepresentative"
                id="clentRepresentative"
                option
                className="form-add-user newSize"
                {...register("clentRepresentative", {
                  // required: "ClentRepresentative Name Required",
                })}
              >
                <option value="">Select client representative name</option>
                {ClientRepresentative &&
                  ClientRepresentative.length > 0 &&
                  ClientRepresentative.map((city) => {
                    return (
                      <option value={city.id} key={city.id}>
                        {city.userName}
                      </option>
                    );
                  })}
              </Form.Select>
              {/* {errors.clentRepresentative && (
                <span className="text-danger">{errors.clentRepresentative.message}</span>
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
                name="postalCode"
                {...register("postalCode", {
                  required: "Postal code required",
                })}
              />
              {errors.postalCode && (
                <span className="text-danger">{errors.postalCode.message}</span>
              )}
            </Col>

            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Phone No
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
                  {/* <option value="91">+91</option> */}
                  <option value="1">+1</option>
                </Form.Control>
                <Form.Control
                  size="sm"
                  type="text"
                  name="phoneNumber"
                  className="form-control-add-user newSize"
                  maxlength="10"
                  pattern="\d{10}"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /\d{10}/,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>

              {errors.phoneNumber && (
                <span className="text-danger">Invalid mobile number</span>
              )}
            </Col>

            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="email"
                className="newSize"
                {...register("email", {
                  // required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
              />
              {/* {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )} */}
            </Col>

            {/* Image */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>
              {/* <br />

              {editBuildingData.photo ?
                <img
                  className="img-circle"
                  // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : noImage}
                  src={`http://` + editBuildingData.photo}
                  alt="Building pic"
                  style={{
                    'border': '1px solid #ddd',
                    'border-radius': '4px',
                    'padding': '1px',
                    'width': '12%',
                  }}
                  width="20px"
                />
                :
                <img
                  className="img-circle"
                  src={noImage}
                  style={{
                    'border': '1px solid #ddd',
                    'border-radius': '4px',
                    'padding': '1px',
                    'width': '12%',
                  }}
                  alt="user pic"
                  width="20px"
                />
              } */}

              <Form.Control
                type="file"
                size="sm"
                className="form-control-add-user newSize"
                name="image"
                {...register("image", {
                  // required: "Image required",
                  validate: (value) => {
                    const acceptedFormats = ["jpg", "jpeg", "png", "gif"];

                    const fileExtension = value[0]?.name
                      .split(".")
                      .pop()
                      .toLowerCase();
                    if (
                      fileExtension &&
                      !acceptedFormats.includes(fileExtension)
                    ) {
                      return "Invalid file format. Only jpg, jpeg, png, gif files are allowed.";
                    }
                    return true;
                  },
                })}
              />
              {/* {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )} */}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>

              <br></br>
              {editBuildingData.photo ?
                <img
                  className="img-circle"
                  // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : noImage}
                  src={editBuildingData?.photo}
                  alt="Building pic"
                  style={{
                    'border': '1px solid #ddd',
                    'border-radius': '4px',
                    'padding': '1px',
                    // 'width': '12%',
                  }}
                  width="100px"
                />
                :
                <img
                  className="img-circle"
                  src={noImage}
                  style={{
                    'border': '1px solid #ddd',
                    'border-radius': '4px',
                    'padding': '1px',
                    // 'width': '12%',
                  }}
                  alt="user pic"
                  width="100px"
                />
              }



            </Col>
          </Row>
          <Button className="" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
// VIEW BUILDING
export const ViewBuilding = (props) => {

  const {
    buildingViewData,
    showBuildingViewModal,
    setShowBuildingViewModal,
    clickedBuildingId,
    CountryAll,
    setFullPageLoading,
    clickedClientId = buildingViewData?.clientDetails?.clientId
  } = props;
  const [JobYear, setJobYear] = useState([]);
  const [dataForArea, setDataForArea] = useState("");
  const { register, handleSubmit, control, reset } = useForm();
  const [xAxisCategoriesArea, setXAxisCategoriesArea] = useState("");

  // 
  const [jobPie, setJobPie] = useState([]);
  const [xAxis, setXAxis] = useState([]);
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
  const [ParameterForBar, setParameterForBar] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [param, setParam] = useState("");
  const [isYearVisibleClient, setIsYearVisibleClient] = useState(false);
  const [selectedGroupByClient, setselectedGroupByClient] = useState([]);
  // const [yearBar, setYearBar] = useState(null); // State for yearBar

  const JobPieData = [];
  const getMonthWiseJobStatus = async (Year) => {
    const formData = new FormData();
    formData.append("buildingId", clickedBuildingId);

    if (Year > 0) {
      formData.append("year", Year);
    }
    else {
      formData.append("year", 0);
    }

    await axiosInstance
      .post("building/getMonthWiseJobStatus", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          // console.log("Inside APi");
          const J = res.data.data.jobStatus;
          let dataJob = {};
          // dataJob["name"] = "Completed Job";
          // dataJob["y"] = J[0]?.value;
          // dataJob["completed"] = J[2]?.value;
          // JobPieData.push(dataJob);

          // let dataJob2 = {};
          // dataJob2["name"] = "Pending Job";
          // dataJob2["y"] = J[1]?.value;
          // dataJob2["incompleted"] = J[3]?.value;
          // JobPieData.push(dataJob2);
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
    formData.append("buildingId", clickedBuildingId);

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
              // label: item.buildingName,
              label: item.buildingName + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
            })),
          ];
          // console.log(data);

          setBuildingsDD(data)
        } else {
          setBuildingsDD("")
        }
      });
  };
  const getYearForJob = async () => {
    const formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("buildingId", clickedBuildingId);
    // formData.append("clientId", clickedClientId);
    await axiosInstance
      .post("dashboard/getYearDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        const data = [
          { value: "", label: "Select year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        setJobYear(data);

      })
  };

  // building parameter graph year 
  const getBuildingCompGraphYearDD = async () => {
    const formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("buildingId", clickedBuildingId);

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

  const getBuildingCompGraphParamDD = async () => {
    // const formData = new FormData();
    // formData.append("buildingId", clickedbuildingId); 

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
  // 

  const getBuildingComparisonGraph = async (buildingIds, groupBy, year, environment, parameter) => {
    const formData = new FormData();
    const buildingList = [];
    buildingList.push(clickedBuildingId);
    formData.append("buildingIds", buildingList);
    formData.append("clientId", clickedClientId);
    if (year > 0 && groupBy === 'month') {
      formData.append("year", year);
    }
    if (environment && environment !== '') {
      formData.append("environment", environment);
    } else {
      return false;
    }
    if (groupBy && groupBy !== '') {
      formData.append("flag", groupBy)
    } else {
      return false;
    }


    if (parameter && parameter !== '') {
      formData.append("parameter", parameter);
    } else {
      return false;
    }
    // else {
    //   formData.append("parameter", "carbon_diaoxide");
    // }

    await axiosInstance
      .post("dashboard/getBuildingCompGraphForDashboard", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const response = res.data.data.graph;
          setXAxisCategoriesArea(res.data.data.monthName);
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
          setDataForArea(numericArrrr);
          // setXAxisCategoriesArea(dummy1)
        } else {
          setDataForArea([]);
        }
      });
  };

  const getYearWiseJobStatusDD = async () => {
    const formData = new FormData();
    formData.append("buildingId", clickedBuildingId);
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
        // console.log(err);
      });
  };


  useEffect(() => {
    setSelectedParameterBar(null);
    setSelectedEnvironmentBar(null);
    setSelectedYearForBar(null);

    if (showBuildingViewModal) {

      getYearForJob();
      getMonthWiseJobStatus();
      // getBuildingComparisonGraph();
      getBuildingCompGraphBuildingDD();
      getYearWiseJobStatusDD();
      getBuildingCompGraphYearDD();
      getBuildingCompGraphParamDD();
    }
  }, [showBuildingViewModal]);


  const handleHide = () => {
    setShowBuildingViewModal(false);
    setDataForArea("");
    reset(
      {
        buildings: "",
        yearBar: "0",
        environmentBar: "0",
        groupByBar: "0",
        parameterBar: "0",
      });
  };

  const propsForCallOtherComponents = {
    type: "View in Client",
    clickedClientId,
    viewType: "ViewById",
    parentName: `(${buildingViewData?.list?.name} Tank-${buildingViewData?.list?.id})`,
    clickedBuildingId,
  };

  const PropsForPie = {
    title: "Job Status",
    name: "Job Status",
    data: jobPie,
  };
  const propsForArea = {
    chartType: "area",
    chartTitle: "Building Parameter Graph",
    yAxisTitle: param,
    xAxisCategories: xAxisCategoriesArea,
    xAxisTitle: "Months",
    tooltip: "{series.name} had a value of {yAxisTitle}   <b>{point.y:,.1f}</b><br/> {point.xAxisCategories}",
    series: dataForArea
  };

  const hadlePieChange = (e) => {

    getMonthWiseJobStatus(e.target.value, selectedYear)
    setSelectedMonth(e.target.value)
  };

  const hadlePieYearChange = (e) => {
    getMonthWiseJobStatus(selectedMonth, e.target.value)
    setSelectedYear(e.target.value)
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


  // building parameter graph



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
      // setYearBar(""); // Set yearBar value to null
    } else {
      setIsYearVisibleClient(true);
    }
    getBuildingComparisonGraph(selectedBuildingsBar, e.target.value, "", selectedEnvironmentBar, selectedParameterBar);
    getBuildingComparisonGraph(selectedBuildingsBar, e.target.value, "", selectedEnvironmentBar, selectedParameterBar);
    setselectedGroupByClient(e.target.value);
  }
  const handleYearChange = (e) => {

    getBuildingComparisonGraph(selectedBuildingsBar, selectedGroupByClient, e.target.value, selectedEnvironmentBar, selectedParameterBar);
    setSelectedYearForBar(e.target.value);
  }
  // --------------------------------
  const handleImageError = (event) => {
    event.target.src = noImage; // Set the default image when an error occurs
  };
  const handlePieYearChange = (e) => {
    getMonthWiseJobStatus(e)
    setSelectedYear(e)
  };

  return (
    <Modal
      show={showBuildingViewModal}
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
          Building View
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example user-view-container">
        <Container fluid>
          <Row className="mb-3 gx-2">
            <Col lg={12} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes-1">
                <h6 className="newSize ">Building Name</h6>
                <div>
                  <p>{buildingViewData?.list?.buildingName}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Address</h6>
                <div>
                  <p>{buildingViewData?.list?.address1}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Address 2</h6>
                <div>
                  <p>{buildingViewData?.list?.address2}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Name Displayed</h6>
                <div>
                  <p>{buildingViewData?.list?.nameDisplayed}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Client</h6>
                <div><p>{buildingViewData?.list?.clientName}</p></div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building City</h6>
                <div>
                  <p>{buildingViewData?.list?.cityName}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Province</h6>
                <div>
                  <p>{buildingViewData?.list?.provinceName}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Postal Code</h6>
                <div>
                  <p>{buildingViewData?.list?.postalCode}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Country</h6>
                <div>
                  <p>{buildingViewData?.list?.countryName}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Phone</h6>
                <div>
                  <p>{buildingViewData?.list?.phone}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Email</h6>
                <div>
                  <p>{buildingViewData?.list?.email}</p>
                </div>
              </div>
            </Col>


            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <Row>
                  <Col> <h6 className="newSize ">Building Image</h6></Col>
                  <Col><div>
                    {buildingViewData?.list?.photo ?
                      <img
                        className="img-circle"
                        // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : noImage}
                        src={buildingViewData.list.photo}
                        alt="building img"
                        onError={handleImageError}
                        style={{
                          'border': '1px solid #ddd',
                          'border-radius': '4px',
                          'padding': '1px',
                          'height': '68px',
                        }}
                      // width="72px"
                      />
                      :
                      <img
                        className="img-circle"
                        src={noImage}
                        style={{
                          'border': '1px solid #ddd',
                          'border-radius': '4px',
                          'padding': '1px',
                          'height': '68px',
                        }}
                        alt="Building"
                      // height="68px"
                      />
                    }
                  </div></Col>
                </Row>



              </div>
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Operator Username</h6>
                <div>
                  <p>{buildingViewData?.list?.buildingOperatorUserName}</p>
                </div>
              </div>
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Last Test Date</h6>
                <div>
                  <p>{buildingViewData?.list?.lastTestDate}</p>
                </div>
              </div>
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Last Measurement Date</h6>
                <div>
                  <p>{buildingViewData?.list?.lastTestDate}</p>
                </div>
              </div>
            </Col> */}

            {/* <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Next Test Date</h6>
                <div>
                  <p>{buildingViewData?.list?.lastTestDate}</p>
                </div>
              </div>
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
            </Col>



            <Col lg={8} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="select-container-box">
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
                {/* <Col lg="2">
                  <Form.Select
                    name="parameterBar"
                    {...register("parameterBar", {
                      onChange: (e) => { paramChangeHandle(e) }
                    })

                    }
                    aria-label="Default select example" size="sm" className="incsize">
                    <option value="0" selected disabled>Select Parameter</option>
                    {ParameterForBar &&
                      ParameterForBar.length > 0 &&
                      ParameterForBar.map((param) => {
                        return (

                          <option value={param.columnName} key={param.columnName}>
                            {param.htmlDisplayName}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Col> */}
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
                      ParameterForBar.map((param) => (
                        <option value={param.columnName} key={param.columnName}>
                          {new DOMParser().parseFromString(param.htmlDisplayName, "text/html").documentElement.textContent}
                        </option>
                      ))}
                  </Form.Select>
                </Col>

              </div>
              <HighChartAreaChart {...propsForArea} />
            </Col>
            {/* 
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="content-view-jobs">
                <Col lg="2">
                  <Form.Select
                    onChange={hadlePieYearChange}
                    aria-label="Default select example"
                    size="sm"
                    className="incsize"

                  >
                    <option value="-1">Year</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
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
                </Col>
                
                <Col lg="7">
                  <div class="bd-highlight">
                    <h6 className="p-2">Completed: <span className="color-1">{jobPie[0]?.completed}</span></h6>
                    <h6 className="p-2">Pending: <span className="color-2">{jobPie[1]?.incompleted}</span></h6>
                  </div>
                </Col>
              </div>
              <HighChartPieChart {...PropsForPie} />

            </Col> */}
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

                <Col lg="6">
                  <div class="bd-highlight">
                    <h6 className="p-2">Completed: <span className="color-1">{jobPie[0]?.completed}</span></h6>
                    <h6 className="p-2">Pending: <span className="color-2">{jobPie[1]?.incompleted}</span></h6>
                  </div>
                </Col>
              </div>
              <HighChartPieChart {...PropsForPie} />

            </div>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o"></Col>
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Client view</Accordion.Header>

                <Accordion.Body className="user-view-container">
                  <Row className="gx-2">
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Client Name</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.clientName}</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Address 1</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.address1}</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Address 2</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.address2}</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">City</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.cityName}</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Province</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.provinceName}</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Postal Code</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.postalCode}</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Country</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.clientName}</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Phone</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.phone}</p>
                        </div>
                      </div>
                    </Col>
                    {/* <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize ">Contact</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.clientName}</p>
                        </div>
                      </div>
                    </Col> */}
                    <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
                      <div className="back-boxes">
                        <h6 className="newSize "> Email</h6>
                        <div>
                          <p>{buildingViewData?.clientDetails?.clientEmail}</p>
                        </div>
                      </div>
                    </Col>

                  </Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Tenants</Accordion.Header>
                <Accordion.Body>
                  <TenantsList {...propsForCallOtherComponents} />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Jobs</Accordion.Header>
                <Accordion.Body>
                  <JobList {...propsForCallOtherComponents} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Reports</Accordion.Header>
                <Accordion.Body>
                  <Report {...propsForCallOtherComponents} />
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
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

// export const AddBuildingOperator = (props) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const {
//     showAddBuildingOperatorModal,
//     handleCloseAddBuildingOperatorModal,
//     // designations,
//     // roles,
//   } = props;

//   const [validated, setValidated] = useState(false);
//   const [passwordMatchError, setPasswordMatchError] = useState(false);
//   const {
//     register,
//     getValues,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You Want To Save This Record!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, Save it!'
//     }).then((result) => {
//       if (result.isConfirmed) {

//         delete data["cPassword"];
//         data.designationId = data.designationId === 0 ? '' : data.designationId;

//         let formData = new FormData();
//         if (data.image.length > 0) {
//           formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
//         }
//         delete data["image"];
//         formData.append("userData", JSON.stringify(data));
//         console.log(formData)
//         // axiosInstance
//         //   .post("users/addUser", formData, {
//         //     headers: headersForJwt,
//         //   })
//         //   .then((res) => {
//         //     if (res && res.data.status === 1) {
//         //       Swal.fire("Created!", "User Created successfully!", "success");
//         //       reset();
//         //       handleCloseUserModal();
//         //     } else {
//         //       Swal.fire({
//         //         icon: "warning",
//         //         title: res.data.message,
//         //         text: "User creation failed!",
//         //       });
//         //     }
//         //     return false;
//         //   })

//         //   .catch((err) => {

//         //     Swal.fire({
//         //       icon: "error",
//         //       title: "Oops...",
//         //       text: "Something went wrong!",
//         //     });
//         //   });


//       }
//     })





//   };
//   const handleHide = () => {

//     handleCloseAddBuildingOperatorModal();
//     reset({
//       // designationId: 0,
//       // roleId: 0
//     })
//   }

//   return (
//     <Modal
//       centered
//       show={showAddBuildingOperatorModal}
//       onHide={() => {
//         handleHide();
//       }}
//       dialogClassName="modal-90w"
//       aria-labelledby="example-custom-modal-styling-title"
//     >
//       <Modal.Header closeButton className="modal-header-section">
//         <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
//           Add User
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="grid-example inside-padding user-modal">
//         <Form
//           noValidate
//           validated={validated}
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           <Row className="mb-3">
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 First Name <span className="text-danger" >*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="firstName"
//                 {...register("firstName", {
//                   required: "First Name required",
//                 })}
//               />
//               {errors.firstName && (
//                 <span className="text-danger">{errors.firstName.message}</span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">Middle Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="middleName"
//                 {...register("middleName", {})}
//               />
//               {errors.middleName && (
//                 <span className="text-danger">{errors.middleName.message}</span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Last Name <span className="text-danger" >*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="lastName"
//                 {...register("lastName", {
//                   required: "Last Name required",
//                 })}
//               />
//               {errors.lastName && (
//                 <span className="text-danger">{errors.lastName.message}</span>
//               )}
//             </Col>
//             {/* Email id */}
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Email <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 size="sm"
//                 type="email"
//                 name="email"
//                 className="newSize"
//                 {...register("email", {
//                   required: "Email required",
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "invalid email address",
//                   },
//                 })}
//               />
//               {errors.email && (
//                 <span className="text-danger">{errors.email.message}</span>
//               )}
//             </Col>
//             {/* Mobile Number */}
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Mobile No.<span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 size="sm"
//                 type="number"
//                 name="phoneNumber"
//                 className="newSize"
//                 {...register("phoneNumber", {
//                   valueAsNumber: true,
//                   required: "Phone Number required",
//                   validate: (value) =>
//                     getValues("phoneNumber").toString().length === 10,
//                 })}
//               />
//               {errors.phoneNumber && (
//                 <span className="text-danger">Invalid Mobile Number</span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Address <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="address"
//                 {...register("address", {
//                   required: "Address required",
//                 })}
//               />
//               {errors.address && (
//                 <span className="text-danger">{errors.address.message}</span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Username <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="userName"
//                 {...register("userName", {
//                   required: "Username required",
//                 })}
//               />
//               {errors.userName && (
//                 <span className="text-danger">{errors.userName.message}</span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Password <span className="text-danger">*</span>
//                 <span></span>
//                 <span className="eye-password" onClick={togglePasswordVisibility}>
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </Form.Label>

//               <Form.Control
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 {...register("password", {
//                   required: "Password required",
//                   pattern: {
//                     value:
//                       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
//                     message:
//                       "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
//                   },
//                 })}

//               />

//               {errors.password && (
//                 <span className="text-danger">{errors.password.message}</span>
//               )}
//               {passwordMatchError && (
//                 <span className="text-danger">
//                   Password should meet the criteria
//                 </span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Confirm Password <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="cPassword"
//                 {...register("cPassword", {
//                   required: true,
//                   // validate: (val: string) => {
//                   //   if (watch("password") != val) {
//                   //     return "Your passwords do no match";
//                   //   }
//                   // },
//                 })}
//               />
//               {errors.cPassword && (
//                 <span className="text-danger">{errors.cPassword.message}</span>
//               )}
//             </Col>
//             {/* ROle */}
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Role <span className="text-danger">*</span>
//               </Form.Label>
//               <Form.Control
//                 as="select"
//                 size="sm"
//                 name="roleId"
//                 id="roleId"
//                 className="form-add-user newSize"
//                 {...register("roleId", {
//                   required: "Role Required",
//                   valueAsNumber: true,
//                 })}
//               >
//                 <option value="" >
//                   Select Role
//                 </option>
//                 {/* {roles &&
//                   roles.length > 0 &&
//                   roles.map((role) => {
//                     return (
//                       <option value={role.id} key={role.id}>
//                         {role.name}
//                       </option>
//                     );
//                   })} */}
//               </Form.Control>
//               {errors.roleId && (
//                 <span className="text-danger">{errors.roleId.message}</span>
//               )}
//             </Col>
//             {/* Designation */}
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">Designation</Form.Label>
//               <Form.Control
//                 as="select"
//                 size="sm"
//                 name="designationId"
//                 id="designationId"
//                 className="form-add-user newSize"
//                 {...register("designationId", {
//                   valueAsNumber: true,
//                 })}
//               >
//                 <option value={0} >
//                   Select Designation
//                 </option>
//                 {/* {designations &&
//                   designations.length > 0 &&
//                   designations.map((designation) => {
//                     return (
//                       <option value={designation.id} key={designation.id}>
//                         {designation.name}
//                       </option>
//                     );
//                   })} */}
//               </Form.Control>
//               {errors.designationId && (
//                 <span className="text-danger">
//                   {errors.designationId.message}
//                 </span>
//               )}
//             </Col>
//             <Col lg={4} md={6} xs={12} className="mb-3">
//               <Form.Label className="newSize">
//                 Image
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 size="sm"
//                 className="form-control-add-user newSize"
//                 name="image"
//                 {...register("image", {
//                   validate: (value) => {
//                     const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif',];

//                     const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
//                     if (fileExtension && !acceptedFormats.includes(fileExtension)) {
//                       return 'Invalid file format. Only jpg, jpeg, png, gif files are allowed.';
//                     }
//                     return true;
//                   },
//                 })}
//               />
//               {errors.image && (
//                 <span className="text-danger">{errors.image.message}</span>
//               )}
//             </Col>
//           </Row>
//           <Button style={{ 'float': right }} className="mt-3" type="submit">
//             Create User
//           </Button>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };
