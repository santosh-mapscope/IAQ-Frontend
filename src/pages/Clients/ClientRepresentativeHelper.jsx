import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";

import { Col, Row, Modal, Form } from "react-bootstrap";

import ReactDOM from "react-dom";
import { Controller, useForm } from "react-hook-form";
// import { userAtom } from "../../Atom/CommonAtom";
// import { useRecoilState } from "recoil";
// // import { right } from "@popperjs/core";
// import Profileicon from "../../assets/images/user2-160x160.jpg";
// import SuspenseFallback from "../../util/SuspenseFallback";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Select from "react-select";
import noImage from "../../assets/dist/img/no-img.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {
  HighChart,
  HighChartBarChart,
  HighChartComponent,
  HighChartPieChart,
} from "../../components/Charts/Charts";
import toast, { Toaster } from "react-hot-toast";
import { ErrorToastWithToastId } from "../../util/customToast";

export const AddClientRepresentative = (props) => {
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const { control } = useForm();
  const [validated, setValidated] = useState(false);
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [clientName, setClientName] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [buldingList, setBuldingList] = useState([]);
  const [address1, setAddress1] = useState([]);
  const [address2, setAddress2] = useState([]);
  const [email, setEmail] = useState([]);
  const [postalCode, setPostalCode] = useState([]);
  // const [phoneNumber, setPhoneNumber] = useState([]);
  // const [countryCode, setCountryCode] = useState("1");
  const [rolesForSeachDD, setRolesForSeachDD] = useState("");
  const { showUserModal, handleCloseUserModal, CountryAll, setFullPageLoading } = props;

  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const JobPieData = [];
  useEffect(() => {
    // getAllDesignationDD();
    getAllRoleDD();
  }, []);

  const handleHide = () => {
    handleCloseUserModal();
    reset({
      firstName: "",
      middleName: "",
      lastName: "",
      Country: "",
      Province: "",
      City: "",
      client: "",
      buildingList: "",
      Address1: "",
      Address2: "",
      Email: "",
      CountryCode: "1",
      phoneNumber: "",
      PostalCode: "",
      password: "",
      cPassword: "",
      userName: "",
      roleId: "",
      designationId: "",
    });
  };
  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      if (e.target.value.length <= 10) {
        setPhoneNumber(e.target.value);
      }
    }
  };
  const onSubmit = (data) => {
    console.log(data);
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to add this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        let userid = JSON.parse(localStorage.getItem("user"));

        let final_data = {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          address1: data.Address1,
          address2: data.Address2,
          email: data.Email,
          phone: phoneNumber,
          postalCode: data.PostalCode,
          clientId: data.client,
          cityId: data.City,
          createdBy: userid.userDetails.userId,
          buildingId: buldingList,
          password: data.password,
          userName: data.userName,
          roleId: data.roleId,
          countryCode: data.CountryCode,
          designationId: null,
        };
        console.log(final_data);
        let formData = new FormData();
        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];

        formData.append("clientRepData", JSON.stringify(final_data));

        axiosInstance
          .post("clientRep/addClientRep", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false);
              Swal.fire(
                "Created!",
                "Client representative created successfully.",
                "success"
              );
              reset();
              handleCloseUserModal();
              handleHide();
            } else {
              setFullPageLoading(false);
              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Client representative creation failed",
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
    });
  };

  const getProviance = (e) => {
    setProvince("");
    setCity("");
    setClientName("");
    setBuildingName([]);
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
    ;

    setBuildingName([]);
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
  const getClientName = (e) => {

    setBuildingName([]);
    let formData = new FormData();
    // formData.append("cityId", Number(e.target.value));
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        // const data = [
        //   { value: "", label: "Select Client Name" },
        //   ...res.data.data.list.map((item) => ({
        //     value: item.clientId.toString(), // Convert id to string, if needed
        //     label: item.clientName,
        //   })),
        // ];
        if (res && res.data.status === 1) {

          setClientName(res.data.data.list);
        }
        return false;
      })
      .catch((err) => { });
  };
  const getBuildingList = async (e) => {
    getAllDesignationDD(e.target.value);
    setBuildingName([]);
    let formData = new FormData();
    formData.append("clientId", Number(e.target.value));
    await axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "select building", isDisabled: true },
          // { value: "all", label: "Select All" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];

        setBuildingName(data);
      })
      .catch((err) => { });

    setAddress1("");
    setAddress2("");
    setEmail("");
    setPostalCode("");
    setPhoneNumber("");
    setCountryCode("");
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        setAddress1(res?.data?.data?.list?.address1);
        setAddress2(res?.data?.data?.list?.address2);
        setEmail(res?.data?.data?.list?.clientEmail);
        setPostalCode(res?.data?.data?.list?.postalCode);
        setPhoneNumber(res?.data?.data?.list?.phone);
        setCountryCode(res?.data?.data?.list?.countryCode);
      });
  };
  const getAllRoleDD = async () => {
    let formData = new FormData();
    formData.append("isClient", true);
    axiosInstance
      .post("master/getAllRoleDD", formData, { headers: headersForJwt })

      .then((res) => {
        const data = [
          { value: "", label: "Select role name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setRolesForSeachDD(data);

        setRoles(res.data.data.list);
      })
      .catch((err) => {
      });
  };
  const getAllDesignationDD = async (e) => {
    let formData = new FormData();
    formData.append("clientId", Number(e));
    formData.append("isClient", "true");
    let userid = JSON.parse(localStorage.getItem("user"));

    formData.append("userId", userid.userDetails.userId);
    axiosInstance
      .post("master/getAllDesignationDD", formData, { headers: headersForJwt })
      .then((res) => {

        setDesignations(res.data.data.list);
      })
      .catch((err) => {

      });
  };
  const handelBuildingChange = async (data) => {
    const selectedValueArray = [];
    data.forEach((element) => {
      selectedValueArray.push(element.value);
    });
    setBuldingList(selectedValueArray);

  };
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
      className="client-represenative"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Add Client Representative
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            {/* first name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="firstName"
                {...register("firstName", {
                  required: "First name required",
                })}
              />
              {errors.firstName && (
                <span className="text-danger">{errors.firstName.message}</span>
              )}
            </Col>
            {/* middle name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Middle Name</Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="middleName"
                {...register("middleName", {})}
              />
              {errors.middleName && (
                <span className="text-danger">{errors.middleName.message}</span>
              )}
            </Col>
            {/* lastname */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="lastName"
                {...register("lastName", {
                  required: "Last name required",
                })}
              />
              {errors.lastName && (
                <span className="text-danger">{errors.lastName.message}</span>
              )}
            </Col>
            {/* Country */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="md"
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
                size="md"
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
                size="md"
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
            {/* client */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="client"
                id="client"
                className="form-add-user newSize"
                {...register("client", {
                  onChange: (e) => {
                    getBuildingList(e);
                  },
                  required: " Client required",
                })}
              >
                <option value="">Select Client</option>
                {clientName &&
                  clientName.length > 0 &&
                  clientName.map((cli) => {
                    return (
                      <option value={cli.clientId} key={cli.clientId}>
                        {cli.clientName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.client && (
                <span className="text-danger">{errors.client.message}</span>
              )}
            </Col>
            {/* building */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <div className="user-info-inner">
                <Form.Label className="newSize">
                  Select Building
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                {/* <h6 className="label-search">Select Building<span className="text-danger" >*</span></h6> */}
                <Controller
                  control={control}
                  name="buildingList"
                  {...register("buildingList", {
                    // required: " Building Required",
                  })}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        size="sm"
                        options={buildingName}
                        isMulti
                        placeholder="Building"
                        // name="building"
                        id="build"
                        onChange={(e) => {
                          handelBuildingChange(e);
                        }}
                      />
                    </>
                  )}
                />
                {/* {errors.buildingList && (
                <span className="text-danger">{errors.buildingList.message}</span>
              )} */}
              </div>
            </Col>
            {/* Address1 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Address 1</Form.Label>
              <Form.Control
                size="md"
                type="email"
                name="Address1"
                defaultValue={address1}
                className="newSize"
                {...register("Address1", {})}
              />
            </Col>
            {/* Address2 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Address 2</Form.Label>
              <Form.Control
                size="md"
                type="text"
                name="Address2"
                defaultValue={address2}
                className="newSize"
                {...register("Address2", {})}
              />
              {/* {errors.Address2 && (
                <span className="text-danger">{errors.Address2.message}</span>
              )} */}
            </Col>
            {/* Email */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="Email"
                defaultValue={email}
                {...register("Email", {
                  // required: "Email required",
                  required: email ? false : "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.Email && (
                <span className="text-danger">{errors.Email.message}</span>
              )}
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Phone No.</Form.Label>
              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="md"
                  name="CountryCode"
                  defaultValue={countryCode}
                  id="CountryCode"
                  className="form-add-user newSize country-num"
                  onChange={(e) => setCountryCode(e.target.value)}
                  {...register("CountryCode", {
                    valueAsNumber: true,
                  })}
                >
                  <option value="1">+1</option>
                </Form.Control>
                <Form.Control
                  type="number"
                  size="md"
                  className="form-control-add-user newSize"
                  name="phoneNumber"
                  defaultValue={phoneNumber}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    if (e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
                      setPhoneNumber(e.target.value);
                    }
                  }}
                  />
              </div>
            </Col> */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Phone No.</Form.Label>
              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="md"
                  name="CountryCode"
                  value={countryCode}
                  id="CountryCode"
                  className="form-add-user newSize country-num"
                  onChange={handleCountryCodeChange}
                >
                  <option value="1">+1</option>
                  {/* <option value="91">+91</option> */}
                </Form.Control>
                <Form.Control
                  type="text"
                  size="md"
                  className="form-control-add-user newSize"
                  name="phoneNumber"
                  value={phoneNumber}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key)) || phoneNumber.length >= 10) {
                      e.preventDefault();
                    }
                  }}
                  onChange={handlePhoneNumberChange}
                // {...register("phoneNumber", {
                // })}
                />
              </div>
            </Col>

            {/* Postal Code */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Postal Code <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="PostalCode"
                defaultValue={postalCode}
                {...register("PostalCode", {
                  required: postalCode ? false : "Postal code required",
                })}

              />
              {errors.PostalCode && (
                <span className="text-danger">{errors.PostalCode.message}</span>
              )}
            </Col>
            {/* username */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="userName"
                {...register("userName", {
                  required: "Username required",
                })}
              />
              {errors.userName && (
                <span className="text-danger">{errors.userName.message}</span>
              )}
            </Col>
            {/* password */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Password <span className="text-danger">*</span>
                <span></span>
                <span
                  className="eye-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </Form.Label>

              <Form.Control
                size="md"
                className="form-control-add-user newSize"
                name="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password required",
                  // pattern: {
                  //   value:
                  //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                  //   message:
                  //     "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
                  // },
                })}
              />

              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
              {/* {passwordMatchError && (
                <span className="text-danger">
                  Password should meet the criteria
                </span>
              )} */}
            </Col>
            {/* cpassword */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Confirm Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="cPassword"
                {...register("cPassword", {
                  required: true,
                  validate: (val) => {
                    if (watch("password") != val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
              />
              {errors.cPassword && (
                <span className="text-danger">{errors.cPassword.message}</span>
              )}
            </Col>
            {/* ROle */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Role <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="roleId"
                id="roleId"
                className="form-add-user newSize"
                {...register("roleId", {
                  required: "Role required",
                  // required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Select Role</option>
                {roles &&
                  roles.length > 0 &&
                  roles.map((role) => {
                    return (
                      <option value={role.id} key={role.id}>
                        {role.name}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.roleId && (
                <span className="text-danger">{errors.roleId.message}</span>
              )}
            </Col>
            {/* Designation */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Designation</Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="designationId"
                id="designationId"
                className="form-add-user newSize"
                {...register("designationId", {
                  // valueAsNumber: true,
                })}
              >
                <option value={0}>Select Designation</option>
                {designations &&
                  designations.length > 0 &&
                  designations.map((designation) => {
                    return (
                      <option value={designation.id} key={designation.id}>
                        {designation.name}
                      </option>
                    );
                  })}
              </Form.Select>

            </Col>
            {/* Image */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>
              <Form.Control
                type="file"
                size="md"
                className="form-control-add-user newSize"
                name="image"
                {...register("image", {
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
          </Row>
          <Button className="mt-3 float-right" type="submit">
            Create Client Representative
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const EditClientRepresentative = (props) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [clientName, setClientName] = useState("");
  const [buildingName, setBuildingName] = useState([]);
  const [buldingList, setBuldingList] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const { control } = useForm();
  const [loading, setLoading] = useState(false);
  const [address1, setAddress1] = useState([]);
  const [address2, setAddress2] = useState([]);
  const [email, setEmail] = useState([]);
  const [postalCode, setPostalCode] = useState([]);
  // const [phoneNumber, setPhoneNumber] = useState([]);
  // const [countryCode, setCountryCode] = useState([]);
  const [rolesForSeachDD, setRolesForSeachDD] = useState("");
  const [defaultBuildingList, setDefaultBuildingList] = useState([]);
  const [countryCode, setCountryCode] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");


  const {
    buildingId,
    showClientEditModal,
    handleCloseUserEditModal,
    editRepData,
    CountryAll,
    setFullPageLoading
  } = props;

  const [validated, setValidated] = useState(false);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();




  useEffect(() => {
    setDefaultBuildingList([]);
    if (editRepData) {
      getAllDesignationDD();
      getAllRoleDD();
      getProvianceByCountryId(editRepData.countryId);
      // getBuildingListBYClientId(editRepData.clientId);
      setTimeout(async () => {

        const defaultValues = [
          ...editRepData.buildingDetails.map((item) => ({
            value: item.buildingId.toString(), // Convert id to string, if needed
            label: item.buildingName,
          })),
        ];
        setDefaultBuildingList(defaultValues);
        const selectedValueArray = [];
        editRepData.buildingDetails.forEach((element) => {
          selectedValueArray.push(element.buildingId.toString());
        });
        setBuldingList(selectedValueArray);
        reset({
          firstName: editRepData.firstName,
          middleName: editRepData.middleName,
          lastName: editRepData.lastName,
          Address1: editRepData.address1,
          Address2: editRepData.address2,
          CountryCode: editRepData.countryId,
          phoneNumber: editRepData.phone,
          Email: editRepData.email,
          user: editRepData.userName,
          Country:
            editRepData && editRepData.countryId ?
              editRepData.countryId
              : "",
          Province:
            editRepData && editRepData.provinceId ?
              editRepData.provinceId
              : "",
          City: editRepData && editRepData.cityId ? editRepData.cityId : "",
          client: editRepData && editRepData.clientId ? editRepData.clientId : "",
          // buildingList1: defaultValues,

          PostalCode: editRepData.postalCode,
          roleId: editRepData && editRepData.roleId ? editRepData.roleId : "",
          designationId: editRepData && editRepData.designationId ? editRepData.designationId : "",
        });
        // setValue('buildingList',defaultValues)
        // Your logic to set default values
        //  const optionsArray = Array.isArray(buildingName) ? buildingName : [];

        // Set default values based on buildingId
        //  const defaultValues = optionsArray.filter(option => buildingId.includes(option.value));

        // Set the default values using setValue

      }, 2000);
    }
  }, [editRepData]);


  const getProvianceByCountryId = (id) => {
    setProvince("");
    let formData = new FormData();
    formData.append("countryId", Number(id));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        getCityByProvianceId(editRepData.provinceId);
        // setLoading(true)
        setProvince("");

        if (res && res.data.status === 1) {

          setProvince(res.data.data.list);
          reset({
            Province:
              editRepData && editRepData.provinceId ?
                editRepData.provinceId
                : "",
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
          getClientNameByCityId(editRepData.cityId)
          reset({
            City: editRepData && editRepData.cityId ? editRepData.cityId : "",
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
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const getClientNameByCityId = (id) => {
    // console.log(id);
    setClientName("");
    // setBuildingName("");
    let formData = new FormData();
    // formData.append("cityId", Number(id));
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        // const data = [
        //   { value: "", label: "Select Client Name" },
        //   ...res.data.data.list.map((item) => ({
        //     value: item.clientId.toString(), // Convert id to string, if needed
        //     label: item.clientName,
        //   })),
        // ];
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setClientName(res.data.data.list);
          getBuildingListBYClientId(editRepData.clientId);
          reset({
            client: editRepData && editRepData.clientId ? editRepData.clientId : "",
          });
        }
        return false;
      })
      .catch((err) => { });
  };

  const getClientName = (e) => {
    // console.log(e);
    setClientName("");
    // setBuildingName("");
    let formData = new FormData();
    // formData.append("cityId", Number(e.target.value));
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        // const data = [
        //   { value: "", label: "Select Client Name" },
        //   ...res.data.data.list.map((item) => ({
        //     value: item.clientId.toString(), // Convert id to string, if needed
        //     label: item.clientName,
        //   })),
        // ];
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setClientName(res.data.data.list);
        }
        return false;
      })
      .catch((err) => { });
  };
  const getBuildingListBYClientId = (id) => {
    // console.log("getBuildingListBYClientId", editRepData.buildingDetails);
    setBuildingName("");
    let formData = new FormData();
    formData.append("clientId", Number(id));
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {

        const data = [
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);

      })
      .catch((err) => { });

    setAddress1("");
    setAddress2("");
    setEmail("");
    setPostalCode("");
    setPhoneNumber("");
    setCountryCode("");
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log("--->", res.data.data.list.address1);
        setAddress1(res?.data?.data?.list?.address1);
        setAddress2(res?.data?.data?.list?.address2);
        setEmail(res?.data?.data?.list?.clientEmail);
        setPostalCode(res?.data?.data?.list?.postalCode);
        setPhoneNumber(res?.data?.data?.list?.phone);
        setCountryCode(res?.data?.data?.list?.countryCode);
      });
    // console.log("---->", e.target.value);
  };

  const getBuildingList = (e) => {
    // setBuildingName("");
    let formData = new FormData();
    formData.append("clientId", Number(e.target.value));
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: " " },
          // { value: "all", label: "Select All" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);
      })
      .catch((err) => { });

    setAddress1("");
    setAddress2("");
    setEmail("");
    setPostalCode("");
    setPhoneNumber("");
    setCountryCode("");
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log("--->", res.data.data.list.address1);
        setAddress1(res?.data?.data?.list?.address1);
        setAddress2(res?.data?.data?.list?.address2);
        setEmail(res?.data?.data?.list?.clientEmail);
        setPostalCode(res?.data?.data?.list?.postalCode);
        setPhoneNumber(res?.data?.data?.list?.phone);
        setCountryCode(res?.data?.data?.list?.countryCode);
      });
    // console.log("---->", e.target.value);
  };
  const getAllRoleDD = async () => {
    let formData = new FormData();
    formData.append("isClient", true);
    axiosInstance
      .post("master/getAllRoleDD", formData, { headers: headersForJwt })

      .then((res) => {
        const data = [
          { value: "", label: "Select role name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setRolesForSeachDD(data);

        setRoles(res.data.data.list);
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const getAllDesignationDD = async () => {
    axiosInstance
      .post("master/getAllDesignationDD", [], { headers: headersForJwt })
      .then((res) => {
        setDesignations(res.data.data.list);
      })
      .catch((err) => {
      });
  };

  const handelBuildingChange = async (data) => {
    const selectedValueArray = [];
    data.forEach((element) => {
      selectedValueArray.push(element.value);
    });
    await setBuldingList(selectedValueArray);

  };
  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      if (e.target.value.length <= 10) {
        setPhoneNumber(e.target.value);
      }
    }
  };
  const onSubmit = (data) => {
    // if (buldingList.length == 0) {
    //   ErrorToastWithToastId("Select building.");
    //   return false;
    // }
    let userid = JSON.parse(localStorage.getItem("user"));
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
        setFullPageLoading(true)
        let editData = {
          id: editRepData.clientRepId,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          address1: data.Address1,
          address2: data.Address2,
          email: data.Email,
          phone: phoneNumber,
          postalCode: data.PostalCode,
          clientId: data.client,
          cityId: data.City,
          userId: userid.userDetails.userId,
          buildingId: buldingList,
          password: "",
          // userName: "",
          userName: data.user,
          roleId: data.roleId,
          countryCode: data.CountryCode,
          designationId: data.designationId
        };
        let formData = new FormData();
        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];

        formData.append("clientRepData", JSON.stringify(editData));

        axiosInstance
          .post("clientRep/updateClientRep", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false)
              Swal.fire("Updated!", "Client representative updated successfully!", "Success");
              reset();
              handleCloseUserEditModal();
            } else {
              setFullPageLoading(false)
              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Client representative update failed!",
              });
            }
            return false;
          })
          .catch((err) => {
            setFullPageLoading(false)
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
    handleCloseUserEditModal();
  };

  // useEffect(() => {
  //   setBuldingList([]);
  //   if (editRepData ?? editRepData.buildingDetails.length > 0) {
  //     setBuldingList(editRepData.buildingDetails.map(option => option.value));
  //   }
  // }, [editRepData]);

 

  return (<>
    <Toaster position="top-center" className="toster" reverseOrder={false} />
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
          Edit Client Representative
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">

            {/* first name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="firstName"
                {...register("firstName", {
                  required: "First name required",
                })}
              />
              {errors.firstName && (
                <span className="text-danger">{errors.firstName.message}</span>
              )}
            </Col>
            {/* middle name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Middle Name</Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="middleName"
                {...register("middleName", {})}
              />
              {errors.middleName && (
                <span className="text-danger">{errors.middleName.message}</span>
              )}
            </Col>
            {/* lastname */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Last Name
                {/* <span className="text-danger">*</span> */}
              </Form.Label>
              <Form.Control
                type="text"
                size="md"
                className="form-control-add-user newSize"
                name="lastName"
                {...register("lastName", {
                  // required: "Last name required",
                })}
              />
              {/* {errors.lastName && (
                <span className="text-danger">{errors.lastName.message}</span>
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
                  // onChange: (e) => {
                  //   getClientName(e);
                  // },
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
                Client <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="client"
                id="client"
                className="form-add-user newSize"
                {...register("client", {
                  onChange: (e) => {
                    getBuildingList(e);
                  },
                  required: " Client required",
                })}
              >
                <option value="">Select Client</option>
                {clientName &&
                  clientName.length > 0 &&
                  clientName.map((cli) => {
                    return (
                      <option value={cli.clientId} key={cli.clientId}>
                        {cli.clientName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.client && (
                <span className="text-danger">{errors.client.message}</span>
              )}
            </Col>
            {/* building */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <div className="user-info-inner">
                <Form.Label className="newSize">
                  Select Building
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                <Controller
                  control={control}
                  id="buildingList1"
                  name="buildingList1"
                  {...register("buildingList1", {
                    // required: " Building Required",
                  })}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        size="sm"
                        name="buildingList1"
                        id="buildingList1"
                        options={buildingName}
                        isMulti
                        placeholder="Building"
                        value={defaultBuildingList}
                        onChange={(selectedOptions) => {
                          setDefaultBuildingList(selectedOptions)
                          handelBuildingChange(selectedOptions)
                        }}
                      />

                    </>
                  )}
                />
                {/* {errors.buildingList1 && (
                  <span className="text-danger">{errors.buildingList1.message}</span>
                )} */}
              </div>
            </Col>
            {/* Address1 */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 1
                {/* <span className="text-danger">*</span> */}
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="Address1"
                className="newSize"
                {...register("Address1", {
                  // required: "Address one required",
                })}
              />

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

            </Col>
            {/* Postal Code */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Postal Code
                {/* <span className="text-danger">*</span> */}
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="PostalCode"
                {...register("PostalCode", {
                  // required: "Postal code required",
                })}
              />

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
                  onChange={handleCountryCodeChange}
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
                  pattern="[0-9]{10}"
                  {...register("phoneNumber", {
                    // required: "Postal code required",
                  })}
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key)) || phoneNumber.length >= 10) {
                      e.preventDefault();
                    }
                  }}
                  onChange={handlePhoneNumberChange}
                />
              </div>

            </Col>
            {/* Email */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email
                <span className="text-danger">*</span>
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
            {/* Email */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Username
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="user"
                {...register("user", {
                  required: "Username required",

                })}
              />
              {errors.user && (
                <span className="text-danger">{errors.user.message}</span>
              )}
            </Col>
            {/* ROle */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Role <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="roleId"
                id="roleId"
                className="form-add-user newSize"
                {...register("roleId", {
                  required: "Role required",
                  // required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Select Role</option>
                {roles &&
                  roles.length > 0 &&
                  roles.map((role) => {
                    return (
                      <option value={role.id} key={role.id}>
                        {role.name}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.roleId && (
                <span className="text-danger">{errors.roleId.message}</span>
              )}
            </Col>
            {/* Designation */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Designation</Form.Label>
              <Form.Select
                as="select"
                size="md"
                name="designationId"
                id="designationId"
                className="form-add-user newSize"
                {...register("designationId", {
                  // valueAsNumber: true,
                })}
              >
                <option value="">Select Designation</option>
                {designations &&
                  designations.length > 0 &&
                  designations.map((designation) => {
                    return (
                      <option value={designation.id} key={designation.id}>
                        {designation.name}
                      </option>
                    );
                  })}
              </Form.Select>
              {/* {errors.designationId && (
                <span className="text-danger">
                  {errors.designationId.message}
                </span>
              )} */}
            </Col>
            {/* Image */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Representative Image
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                className="form-control-add-user newSize"
                name="image"
                {...register("image", {
                  validate: (value) => {
                    const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif',];

                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    if (fileExtension && !acceptedFormats.includes(fileExtension)) {
                      return 'Invalid file format. Only jpg, jpeg, png, gif files are allowed.';
                    }
                    return true;
                  },
                })}
              />
              {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>

              <br></br>
              {editRepData.profileImage ?
                <img
                  className="img-circle"
                  // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : noImage}
                  src={editRepData?.profileImage}
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
          <Button className="mt-3" type="submit">
            Update Representative
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  </>

  );
};
