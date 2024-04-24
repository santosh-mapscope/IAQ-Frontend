/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useState } from "react";

import { axiosInstance, headersForJwt } from "../../util/axiosConfig";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { right } from "@popperjs/core";
import Profileicon from "../../assets/images/user2-160x160.jpg";

export const AddUser = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    showUserModal,
    handleCloseUserModal,
    designations,
    roles,
    setFullPageLoading,
  } = props;

  const [validated] = useState(false);
  const [passwordMatchError] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to save this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);

        delete data["cPassword"];
        data.designationId = data.designationId === 0 ? "" : data.designationId;

        let formData = new FormData();
        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];
        formData.append("userData", JSON.stringify(data));
        console.log(formData);
        axiosInstance
          .post("users/addUser", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              Swal.fire("Created!", "User created successfully!", "success");
              setFullPageLoading(false); // Hide loading indicator after receiving response

              reset();

              handleCloseUserModal();
            } else {
              setFullPageLoading(false); // Hide loading indicator after receiving response

              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "User creation failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            setFullPageLoading(false); // Hide loading indicator after receiving response

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
    handleCloseUserModal();
    reset({
      designationId: 0,
      roleId: 0,
    });
  };

  return (
    <Modal
      centered
      show={showUserModal}
      onHide={() => {
        handleHide();
      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Add User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Middle Name</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="middleName"
                {...register("middleName", {})}
              />
              {errors.middleName && (
                <span className="text-danger">{errors.middleName.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="email"
                className="newSize"
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Col>
            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Mobile No.
              </Form.Label>
              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="sm"
                  name="countryCode"
                  id="countryCode"
                  className="form-add-user newSize country-num"
                  {...register("countryCode", {
                    // valueAsNumber: true,
                  })}
                >
                  <option value="1">+1</option>
                  {/* <option value="91">+91</option> */}
                </Form.Control>

                <Form.Control
                  size="sm"
                  type="number"
                  name="phoneNumber"
                  className="form-control-add-user newSize"
                  // {...register("phoneNumber", {
                  //   valueAsNumber: true,
                  //   required: "Phone number required",
                  //   validate: (value) =>
                  //     getValues("phoneNumber").toString().length === 10,
                  // })}
                  {...register("phoneNumber", {
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value && value.toString().length !== 10) {
                        return "Mobile number must be 10 digits long";
                      }
                      return true; // Valid if empty or 10 digits
                    },
                  })}
                />
              </div>

              {errors.phoneNumber && (
                <span className="text-danger">Invalid mobile number</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address 
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="address"
                {...register("address", {
                  // required: "Address required",
                })}
              />
              {errors.address && (
                <span className="text-danger">{errors.address.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
            <Col lg={4} md={6} xs={12} className="mb-3">
              <div className="password-set">
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
                  size="sm"
                  className="form-control-add-user newSize"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                      message:
                        "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
                    },
                  })}
                />
              </div>

              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
              {passwordMatchError && (
                <span className="text-danger">
                  Password should meet the criteria
                </span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Confirm Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
                size="sm"
                name="roleId"
                id="roleId"
                className="form-add-user newSize"
                {...register("roleId", {
                  required: "Role required",
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
                size="sm"
                name="designationId"
                id="designationId"
                className="form-add-user newSize"
                {...register("designationId", {
                  valueAsNumber: true,
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
              {errors.designationId && (
                <span className="text-danger">
                  {errors.designationId.message}
                </span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>
              <Form.Control
                type="file"
                size="sm"
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
              {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )}
            </Col>
          </Row>
          <Button style={{ float: right }} className="mt-3" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const EditUser = (props) => {
  const {
    showUserEditModal,
    handleCloseUserEditModal,
    designations,
    roles,
    editUserData,
    setFullPageLoading,
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
    reset({
      firstName: editUserData.firstName,
      middleName: editUserData.middleName,
      lastName: editUserData.lastName,
      email: editUserData.email,
      phoneNumber: editUserData.phoneNumber,
      address: editUserData.address,
      userName: editUserData.userName,
      roleId: editUserData && editUserData.roleId ? editUserData.roleId.id : "",
      designationId:
        editUserData && editUserData.designationId
          ? editUserData.designationId.id
          : "",

      // designationId:editUserData.designationId.id
    });
  }, [editUserData]);

  const onSubmit = (data) => {
    Swal.fire({
      title: "Please confirm",
      text: " Do you want to update this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true); // Hide loading indicator after receiving response

        delete data["cPassword"];
        console.log(data);
        data.id = editUserData.id;
        let formData = new FormData();
        if (data.image.length > 0) {
          formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
        }
        delete data["image"];
        // delete data["email"];
        delete data["password"];
        delete data["userName"];

        formData.append("userData", JSON.stringify(data));
        axiosInstance
          .post("users/updateUser", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false); // Hide loading indicator after receiving response

              Swal.fire("Updated!", "User updated successfully!", "success");
              reset();
              handleCloseUserEditModal();
            } else {
              setFullPageLoading(false); // Hide loading indicator after receiving response

              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "User update failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            setFullPageLoading(false); // Hide loading indicator after receiving response

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

  return (
    <Modal
      centered
      show={showUserEditModal}
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
          Edit User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Middle Name</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="middleName"
                {...register("middleName", {})}
              />
              {errors.middleName && (
                <span className="text-danger">{errors.middleName.message}</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
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
            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="email"
                className="newSize"
                //  readOnly
                {...register("email", {
                  // required: "Email required",
                  // pattern: {
                  //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  //   message: "invalid email address",
                  // },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Col>
            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Mobile No
              </Form.Label>
              <div className="phone-container">
                <Form.Control
                  as="select"
                  size="sm"
                  name="countryCode"
                  id="countryCode"
                  className="form-add-user newSize country-num"
                  {...register("countryCode", {
                    // valueAsNumber: true,
                  })}
                >
                  <option value="1">+1</option>
                  {/* <option value="91">+91</option> */}
                </Form.Control>
                {/* <Form.Control
                  size="sm"
                  type="number"
                  name="phoneNumber"
                  className="newSize"
                  {...register("phoneNumber", {
                    valueAsNumber: true,
                    if (value) {
                      return value.toString().length === 10;
                    }
                    // validate: (value) =>
                    //   getValues("phoneNumber").toString().length === 10,
                  })}
                /> */}
                <Form.Control
                  size="sm"
                  type="number"
                  name="phoneNumber"
                  className="newSize"
                  {...register("phoneNumber", {
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value && value.toString().length !== 10) {
                        return "Mobile number must be 10 digits long";
                      }
                      return true; // Valid if empty or 10 digits
                    },
                  })}
                />
              </div>

              {errors.phoneNumber && (
                <span className="text-danger">Invalid Mobile Number</span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Address
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="address"
                {...register("address", {
                  // required: "Address required",
                })}
              />
              {/* {errors.address && (
                <span className="text-danger">{errors.address.message}</span>
              )} */}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                readOnly
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
            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Password
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="password"
                {...register("password", {
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                    message:
                      "Password must contain at least 8 characters, one lowercase, one uppercase, one number, and one special character.",
                  },
                })}
              />
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
              {passwordMatchError && (
                <span className="text-danger">
                  Password should meet the criteria
                </span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Confirm Password
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="cPassword"
                {...register("cPassword", {
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
              />
              {errors.cPassword && (
                <span className="text-danger">{errors.cPassword.message}</span>
              )}
            </Col> */}
            {/* ROle */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Role <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="roleId"
                id="roleId"
                className="form-add-user newSize"
                {...register("roleId", {
                  required: "Role required",
                  valueAsNumber: true,
                })}
              >
                <option value="" selected>
                  Select Role
                </option>
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
                size="sm"
                name="designationId"
                id="designationId"
                className="form-add-user newSize"
                {...register("designationId", {
                  valueAsNumber: true,
                })}
              >
                <option value="" selected>
                  Select Designation
                </option>
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
              {errors.designationId && (
                <span className="text-danger">
                  {errors.designationId.message}
                </span>
              )}
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Image</Form.Label>
              <br />

              {editUserData.profileImage ? (
                <img
                  className="img-circle"
                  // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : Profileicon}
                  src={editUserData.profileImage}
                  alt="user pic"
                  style={{
                    border: "1px solid #ddd",
                    "border-radius": "4px",
                    padding: "1px",
                    width: "12%",
                  }}
                  width="20px"
                />
              ) : (
                <img
                  className="img-circle"
                  src={Profileicon}
                  style={{
                    border: "1px solid #ddd",
                    "border-radius": "4px",
                    padding: "1px",
                    width: "12%",
                  }}
                  alt="user pic"
                  width="20px"
                />
              )}

              <Form.Control
                type="file"
                size="sm"
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
                style={{
                  width: "85%",
                  float: "right",
                }}
              />
              {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )}
            </Col>
          </Row>
          <Button className="mt-3" style={{ float: right }} type="submit">
            Update User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const ViewUser = (props) => {
  const {
    showUserViewModal,
    setShowUserViewModal,
    designations,
    roles,
    editUserData,
  } = props;
  console.log(editUserData);

  const [userData, userName] = useRecoilState(userAtom);
  const [validated, setValidated] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    reset({
      firstName: editUserData.firstName,
      middleName: editUserData.middleName,
      lastName: editUserData.lastName,
      email: editUserData.email,
      phoneNumber: editUserData.phoneNumber,
      address: editUserData.address,
      userName: editUserData.userName,
      roleId:
        editUserData && editUserData.roleId ? editUserData.roleId.name : "",
      designationId:
        editUserData && editUserData.designationId
          ? editUserData.designationId.name
          : "",
      // designationId:editUserData.designationId.id
    });
  }, [editUserData]);

  const handleHide = () => {
    setShowUserViewModal(false);
  };

  return (
    <Modal
      centered
      show={showUserViewModal}
      onHide={() => {
        // handleCloseUserEditModal();
        // reset();
        handleHide();
      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      className="user-view"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          User Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal user-view-container">
        <div className="Container">
          <Row className="mb-3 gx-2">
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                {/* <Form.Label className="newSize">
                First Name 
              </Form.Label> */}
                <h6 className="newSize ">First Name </h6>
                {/* <Form.Control
                type="text"
                size="sm"
                readOnly
                className="form-control-add-user newSize"
                name="firstName"
                {...register("firstName", {
                  required: "First Name required",
                })}
              /> */}
                <div>
                  <p>{editUserData.firstName}</p>
                </div>
                {/* {errors.firstName && (
                <span className="text-danger">{errors.firstName.message}</span>
              )} */}
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Middle Name </h6>
                <div>
                  <p>{editUserData.middleName}</p>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Last Name </h6>
                <div>
                  <p>{editUserData.lastName}</p>
                </div>
              </div>
            </Col>
            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Email</h6>
                <div>
                  <p>{editUserData.email}</p>
                </div>
              </div>
            </Col>

            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Mobile No.</h6>
                <div>
                  <p>{editUserData.phoneNumber}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Address</h6>
                <div>
                  <p>{editUserData.address}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Username</h6>
                <div>
                  <p>{editUserData.userName}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Role</h6>
                <div>
                  <p>
                    {editUserData && editUserData.roleId
                      ? editUserData.roleId.name
                      : ""}
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Designation</h6>
                <div>
                  <p>
                    {editUserData && editUserData.designationId
                      ? editUserData.designationId.name
                      : ""}

                    {/* {...register("designationId", {
                })} */}
                  </p>
                </div>
              </div>
            </Col>

            {/* ROle */}

            <Col lg={4} md={6} xs={12} className="mb-3">
              <h6 className="newSize">Image</h6>

              {editUserData.profileImage ? (
                <img
                  className="img-circle"
                  // src={CheckImage(`http://`+row.profileImage) ? row.profileImage : Profileicon}
                  src={editUserData.profileImage}
                  alt="user pic"
                  style={{
                    border: "1px solid #ddd",
                    "border-radius": "4px",
                    "margin-right": "10px",
                    width: "100px",
                  }}
                  width="20px"
                />
              ) : (
                <img
                  className="img-circle"
                  src={Profileicon}
                  style={{
                    border: "1px solid #ddd",
                    "border-radius": "4px",
                    "padding-right": "10px",
                    width: "100px",
                  }}
                  alt="user pic"
                  width="20px"
                />
              )}
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};
