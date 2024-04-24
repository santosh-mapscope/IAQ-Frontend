/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */
import React, { useState, useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';

import { Modal, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";

import Swal from "sweetalert2";

import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Userslice";
import { Link, useNavigate } from "react-router-dom";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import { FaUser, FaRedo, FaLock, FaEye, FaEyeSlash, FaThLarge, FaLinkedinIn, FaPhoneAlt, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import PasswordChecklist from "react-password-checklist";
import AzureMail from "../util/azureMail/azureMail";
import { TiVendorMicrosoft } from "react-icons/ti";
// import ExamplePage from "./MicrosoftOauth/login";
import MicrosoftLogin from "react-microsoft-login";

// Login CSS and JS
import "../assets/css/login-style.css";
//import "../assets/js/scripts";
// Images
import back1 from "../assets/images/back-1.jpg";
import back2 from "../assets/images/back-2.jpg";
import back3 from "../assets/images/back-3.jpg";
import logo400white from "../assets/images/logo-400-white.png";
import logoorign from "../assets/images/SIAQ-logo-95px.svg";
import background from "../assets/images/back-image.jpg";
// Swipper Module

import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { axiosInstance, headers, headersForJwt } from "../util/axiosConfig";
import { useRecoilState } from "recoil";
import { userAtom } from "../Atom/CommonAtom";
import toast, { Toaster } from "react-hot-toast";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../util/customToast/index";
import { Helmet } from "react-helmet";
import { Form } from "react-bootstrap";
//  Swipper End

import CircularLoader from "../util/SuspenseFallback/circularLoader";

const MicrosoftOauth = () => {
  const [msalInstance, onMsalInstanceChange] = useState();
  const [, setUserList] = useRecoilState(userAtom);

  const dispatch = useDispatch();

  function microsoftlogin(msal) {
    const toastId = toast.loading("Loading in...");
    // console.log(msal);
    const formData = new FormData();
    formData.append('accessToken', msal.idToken);
    formData.append('email', msal.account.username);
    setTimeout(() => {
      axiosInstance
        .post("auth/loginWithMicrosoft", formData, { headers: headersForJwt })
        .then((res) => {
          if (res.data.status === 1) {
            localStorage.setItem("user", res.data.data.list);
            dispatch(login(JSON.stringify(res.data.data.list)));
            setUserList(res.data.data.list);
            SuccessToastWithToastId("Successfully logged in!", toastId);
            window.location.reload();
          } else {
            ErrorToastWithToastId(res.data.message, toastId);
          }
          return false;
        })

        // Catch errors if any

        .catch((err) => {
          // setErrorMessage('Something Went Wrong ..!');
          ErrorToastWithToastId("Something went wrong ..!", toastId);
        });
    }, 1000);

  }
  const loginHandler = (err, data, msal) => {
    // console.log(err, data);
    // some actions
    if (!err && data) {
      onMsalInstanceChange(msal);
      microsoftlogin(data);
    }
  };

  const logoutHandler = () => {
    msalInstance.logout();
  };


  return (
    // <MicrosoftLogin clientId={"4a81ad52-2a3b-42f6-833d-a1f8d3136e1e"} authCallback={loginHandler} redirectUri="https://new.siaqreporting.com/" postLogoutRedirectUri="https://new.siaqreporting.com/" />
    <MicrosoftLogin clientId={"73bd097f-e258-4524-84a3-6cdd9a206d8a"} authCallback={loginHandler} redirectUri="https://new.siaqreporting.com/" postLogoutRedirectUri="https://new.siaqreporting.com/" />
  );
};



// export default MicrosoftOauth;

const MyHomeModal = (props) => {

  return (
    <div className="modal" style={{ display: "block", position: "initial" }}>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modalBodystyle"
      >
        <Modal.Header className="modal-header-section" style={{ background }}>
          <button className="custom-close-button" onClick={props.onHide}>
            <AiOutlineClose />
          </button>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="in-side-content">
            <div className="logo-cont">
              <img src={logo400white} width="100px" />
            </div>
            <h6 className="white text-center">
              Indoor air quality testing is our business, <br />
              let’s discuss how it affects your business or workplace.
            </h6>
            <Link to="https://www.sterlingiaqconsultants.com/" target="_blank">
              <Button>Get In Touch</Button>
            </Link>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
      </Modal>
    </div>
  );
};
const MyAboutModal = (props) => {
  return (
    <div className="modal" style={{ display: "block", position: "initial" }}>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modalBodystyle1"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="in-side-content-2">
              <div className="box-cont-er">
                <div className="logo-cont">
                  <img src={logo400white} width="60px" />
                </div>
              </div>
            </div>
            <button className="custom-close-button" onClick={props.onHide}>
              <AiOutlineClose />
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {/* */}
            <div className="col-lg-6">
              <p className="fnt-14">
                Sterling IAQ Consultants Ltd. (Sterling IAQ) is a
                multi-disciplinary consulting firm. We provide expertise in the
                areas of indoor air quality testing, mould, hazardous building
                materials (asbestos, lead paint, etc.), sustainability and
                occupational hygiene &amp; safety. We are located in Vancouver,
                BC. We provide indoor air quality testing and a variety of
                consulting services to clients across Canada. With roots dating
                back to 1973, Sterling IAQ has evolved into a consulting group
                that strategically positions itself to be a leader among its
                peers and rivals. We pride ourselves in the provision of
                PROFESSIONAL and PRACTICAL customer/client service and ensuring
                that your needs are met.
              </p>
            </div>
            <div className="col-lg-6">
              <p className="fnt-14">
                Sterling IAQ has taken our years of experience in the indoor air
                quality consulting business and combined it with our knowledge
                of how to integrate an online relational database into a
                sophisticated reporting system for our proactive indoor air
                quality testing clients. This professionally designed system
                enables Sterling IAQ to create customized reports for our
                clients and enables our clients to have access to their testing
                reports for all the various testing periods conducted in their
                buildings.
              </p>
            </div>
            <div className="col-lg-12">
              <div className="address-bar mt-4">
                <div className="phone">
                  <FaPhoneAlt />
                  <p>604-678-1284</p>
                </div>
                <div className="web">
                  <FaGlobe />
                  <p>
                    <Link
                      to="https://www.sterlingiaqconsultants.com/"
                      target="_blank"
                    >
                      www.sterlingiaqconsultants.com
                    </Link>
                  </p>
                </div>
                <div className="address">
                  <FaMapMarkerAlt />
                  <p>
                    #320 – 4400 Dominion Street
                    <br />
                    Burnaby, BC V5G 4G3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
      </Modal>
    </div>
  );
};


const MyContactModal = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const contactUs = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("msg", message);
    axiosInstance
      .post("users/contactUs", formdata)
      .then((res) => {
        if (res.data.status === 1) {
          SuccessToastWithToastId("Message Send Successfully!", toastId);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          ErrorToastWithToastId(res.data.message, toastId);
        }
        return false;
      })
      // Catch errors if any
      .catch((err) => {
        ErrorToastWithToastId(
          "Somthing Went Wrong Try After Some Time.!",
          toastId
        );
        // console.log(err);
        return false;
      });
  };

  return (
    <div className="modal" style={{ display: "block", position: "initial" }}>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modalBodystyle2"
      >
        <Modal.Header>
          <button className="custom-close-button" onClick={props.onHide}>
            <AiOutlineClose />
          </button>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="in-side-content-2">
              <div className="box-cont-er">
                <div className="logo-cont">
                  <img src={logo400white} width="60px" />
                  <br />
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form onSubmit={contactUs}>
              <Row>
                <Col>
                  <h5 className="white mt-3">Contact Us</h5>
                  <p className="fnt-14">
                    Are you an employee of one of our clients and require access
                    to your company reports?
                    <br />
                    Do you have any questions about our system? Please leave a
                    message below.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label htmlFor="contactName" className="white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    id="contactName"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
                <Col>
                  <label htmlFor="contactEmail" className="white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="mt-3">
                  <label htmlFor="inputAddress" className="white mb-2">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="inputAddress"
                    placeholder="Message"
                    defaultValue={""}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </Row>
            </form>
          </Container>

          {/* <div className="container">
          <div className="row">
            
            <div className="col-lg-12">
              <h5 className="white mt-3">Contact Us</h5>
              <p className="fnt-14">
                Are you an employee of one of our clients and require access to
                your company reports?
                <br />
                Do you have any questions about our system? Please leave a
                message below.
              </p>
            </div>
            
      
              <form onSubmit={contactUs}>
                
                  <div className="form-group col-md-6 mt-3">
                    <label htmlFor="contactName" className="white">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactName"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6 mt-3">
                    <label htmlFor="contactEmail" className="white">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="contactEmail"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                
                <div className="form-group">
                  <label htmlFor="inputAddress" className="white">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="inputAddress"
                    placeholder="Message"
                    defaultValue={""}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="text-center ">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div> */}
        </Modal.Body>
        {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
      </Modal>
    </div>
  );
};

const MyRegisterModal = (props) => {
  const { modalShow5, handleCloseUserModal } = props
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [CountryAll, setCountryAll] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const { control } = useForm();
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);
  const [isFullPageLoading, setFullPageLoading] = useState(false);
  const contactUs = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("msg", message);
    axiosInstance
      .post("users/contactUs", formdata)
      .then((res) => {
        if (res.data.status === 1) {
          SuccessToastWithToastId("Message Send Successfully!", toastId);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          ErrorToastWithToastId(res.data.message, toastId);
        }
        return false;
      })
      // Catch errors if any
      .catch((err) => {
        ErrorToastWithToastId(
          "Somthing Went Wrong Try After Some Time.!",
          toastId
        );
        // console.log(err);
        return false;
      });
  };


  const getCountryAll = async () => {
    // setLoading(true);
    axiosInstance
      .post("users/registerCountryDD", "")
      .then((res) => {
        if (res && res.data.status === 1) {
          // console.log(res);
          // console.log(res.data.data.list);
          setCountryAll(res.data.data.list);
          // setLoading(false);
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
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    axiosInstance.post(`users/registerProvinceDD`, formData)
      .then((res) => {
        // setLoading(true)
        setProvince("");
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setProvince(res.data.data.list)
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
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance.post(`users/registerCityDD`, formData
    )
      .then((res) => {
        // console.log(res);
        if (res && res.data.status === 1) {
          setCity(res.data.data.list)
        }
        return false;
      })
      .catch((err) => {
      });
  };
  // const getClientName = (e) => {
  //   console.log(e);
  //   setClientName("");
  //   // reset({buildingList: "" });
  //   let formData = new FormData();
  //   formData.append("cityId", Number(e.target.value));
  //   axiosInstance
  //     .post("users/registerClientDD", formData)
  //     .then((res) => {
  //       if (res && res.data.status === 1) {
  //         console.log(res.data.data.list);
  //         setClientName(res.data.data.list)
  //       }
  //       return false;
  //     })
  //     .catch((err) => { });
  // };
  // const getBuildingList = (e) => {
  //   setBuildingName("");
  //   let formData = new FormData();
  //   formData.append("clientId", Number(e.target.value));
  //   axiosInstance
  //     .post("users/registerBuildingDD", formData)
  //     .then((res) => {
  //       console.log(res);
  //       if (res && res.data.status === 1) {
  //         setBuildingName(res.data.data.list)
  //       }
  //       return false;
  //     })
  //     .catch((err) => {
  //     });
  // };


  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    getCountryAll()
  }, []);

  const checkEnvironment = async () => {

  }

  const onSubmit = async (data) => {
    const coun = document.getElementById("Country");
    const textcoun = coun.options[coun.selectedIndex].text;

    const prov = document.getElementById("Province");
    const textprov = prov.options[prov.selectedIndex].text;


    const city = document.getElementById("City");
    const textcity = city.options[city.selectedIndex].text;



    let formData = new FormData();
    if (data.Name !== "") {
      formData.append("name", data.Name);
    }
    if (data.message !== "") {
      formData.append("msg", data.message);
    }
    if (data.email !== "") {
      formData.append("email", data.email);
    }
    if (textcoun !== "") {
      formData.append("countryName", textcoun);
    }
    if (textprov !== "") {
      formData.append("provinceName", textprov);
    }
    if (textcity !== "") {
      formData.append("cityName", textcity);
    }
    if (data.ClientName !== "") {
      formData.append("clientName", data.ClientName);
    }
    if (data.phoneNumber !== "") {
      formData.append("phone", data.phoneNumber);
    }
    setFullPageLoading(true);
    // Your existing API call for local environment
    await axiosInstance.post("users/registerUser", formData).then((res) => {
      // handleApiResponse(res, toastId);
      // console.log(res.data.status);
      if (res.data.status == 1) {
        setFullPageLoading(false);
        // Swal.fire("Registered!","Registration successfully requested","success");
        Swal.fire({
          title: "Registration successfully requested",
          showConfirmButton: true,
          confirmButtonText: "OK"
        });
        setFullPageLoading(false);
        reset();
        handleCloseUserModal();
      }
    }).catch(async (err) => {
      console.error("Error in Axios request:", err); handleApiError();
    });

  }
  // else if (environment == "PRODUCTION") {
  //   // PRODUCTION

  //   let message = `
  //                 <p>Hello,</p>
  //                 <p>A new user has been registered with the following details:</p>
  //                 <ul>
  //                   <li><strong>Name:</strong> ${data.Name}</li>
  //                   <li><strong>Email:</strong> ${data.email}</li>
  //                   <li><strong>Message:</strong> ${data.message}</li>
  //                   <li><strong>Country:</strong> ${textcoun}</li>
  //                   <li><strong>Province:</strong> ${textprov}</li>
  //                   <li><strong>City:</strong> ${textcity}</li>
  //                   <li><strong>Client Name:</strong> ${data.ClientName}</li>
  //                 </ul>
  //                 <p>Thank you!</p>
  //               `;
  // const res1 = AzureMail({
  //   to: "monica@sterlingiaqconsultants.com", // Assuming email is the recipient
  //   subject: "New user registration: Welcome to our platform!",
  //   message: message,
  //   // cc : "krish@sparcglobal.ca"
  // });
  // if (res1 == 'true') {
  //   toast.dismiss(toastId);
  //   Swal.fire("Registered!", "Registration successfully!", "success");
  //   reset();
  //   handleCloseUserModal();
  // } else {
  //   console.log(message + "mail not Sent");
  // }
  // 


  // }
  // else {
  //   // Handle unknown environment
  //   toast.dismiss(toastId);
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "Unknown environment!",
  //   });
  // }
  // }


  // }).catch((err) => {
  //   console.error("Error in Axios request:", err); handleApiError();
  // });




  function handleApiResponse(res, toastId) {
    if (res) {
      toast.dismiss(toastId);
      Swal.fire("Registered!", "Registration successfully!", "success");
      reset();
      handleCloseUserModal();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Failed",
        text: "Registration failed!",
      });
      handleCloseUserModal();
    }
  }

  function handleApiError(err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }

  const handleHide = () => {
    handleCloseUserModal();
    reset();
  };

  return (

    <div className="modal" style={{ display: "block", position: "initial" }}>
      {isFullPageLoading && <CircularLoader />}
      <Modal
        show={modalShow5}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modalBodystyle2"
      //   onHide={() => {
      //     // reset();
      //     handleHide();
      // }}
      >
        <Modal.Header>
          <button className="custom-close-button" onClick={handleHide}>
            <AiOutlineClose />
          </button>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="in-side-content-2">
              <div className="box-cont-er">
                <div className="logo-cont">
                  <img src={logo400white} width="60px" />
                  <br />
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form
              noValidate validated={validated} onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col>
                  <h5 className="white mt-3">Register With Us</h5>
                  <p className="fnt-14">
                    Are you an employee of one of our clients and require access
                    to your company reports?
                    <br />
                    Do you want to register with us? Please leave a
                    message below.
                  </p>
                </Col>
              </Row>
              <Row>
                {/* name */}
                <Col className="white mb-2">
                  <h6 className="label-search white">Name<span className="text-danger"> *</span> </h6>
                  <Form.Control
                    type="text"
                    size="md"
                    className="form-control-add-user newSize"
                    name="Name"
                    placeholder="Name"
                    {...register("Name", {
                      required: "Name required",
                    })}
                  />
                  {errors.Name && (
                    <span className="text-danger">{errors.Name.message}</span>
                  )}
                </Col>
                {/* email */}
                <Col className="white mb-2">
                  <h6 className="label-search white">Email<span className="text-danger"> *</span> </h6>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email required",
                    })}

                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </Col>
              </Row>

              {/* message */}
              <Row>
                <Col className="mt-3">
                  <h6 className="label-search white">Message<span className="text-danger"> *</span> </h6>
                  <textarea
                    className="form-control"
                    id="inputAddress"
                    name="message"
                    placeholder="Message"
                    defaultValue={""}
                    {...register("message", {
                      required: "message required",
                    })}

                  />
                </Col>
                {errors.message && (
                  <span className="text-danger">{errors.message.message}</span>
                )}
              </Row>
              <Row className="mt-4">
                {/* Country */}
                <Col lg={4} md={6} xs={12} className="white mb-2">
                  <h6 className="label-search white">Country<span className="text-danger"> *</span> </h6>

                  <Form.Select
                    as="select"
                    size="md"
                    name="Country"
                    id="Country"
                    className="form-add-user newSize"
                    {...register("Country", {
                      onChange: (e) => { getProviance(e) },
                      required: "Country required",
                    })}
                  >
                    <option value="">
                      Select Country
                    </option>
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
                <Col lg={4} md={6} xs={12} className="white mb-2">
                  <h6 className="label-search white">Province<span className="text-danger"> *</span> </h6>
                  <Form.Select
                    as="select"
                    size="md"
                    name="Province"
                    id="Province"
                    className="form-add-user newSize"
                    {...register("Province", {
                      onChange: (e) => { getCity(e) },
                      required: "Province required",
                    })}>
                    <option value="">
                      Select Province
                    </option>
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
                  {errors.Province && (
                    <span className="text-danger">{errors.Province.message}</span>
                  )}
                </Col>
                {/* City */}
                <Col lg={4} md={6} xs={12} className="white mb-2">
                  <h6 className="label-search white">City<span className="text-danger"> *</span> </h6>
                  <Form.Select
                    as="select"
                    size="md"
                    name="City"
                    id="City"
                    className="form-add-user newSize"
                    {...register("City", {
                      // onChange: (e) => { getClientName(e) },
                      required: "City required",
                    })}
                  >
                    <option value="">
                      Select City
                    </option>
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
                <Col lg={6} md={6} xs={12} className="white mb-2">
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
                {/* Phone No. */}
                <Col lg={6} md={6} xs={12} className="white mb-2">
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

                {/* client */}
                {/* <Col lg={6} md={6} xs={12} className="white mb-2">
                  <h6 className="label-search white">Client<span className="text-danger"> *</span> </h6>
                  <Form.Select
                    as="select"
                    size="md"
                    name="client"
                    id="client"
                    className="form-add-user newSize"
                    {...register("client", {
                      onChange: (e) => { getBuildingList(e) },
                      required: " client Required",
                    })}>
                    <option value="">
                      Select Client
                    </option>
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
                </Col> */}
                {/* building */}
                {/* <Col lg={6} md={6} xs={12} className="white mb-2">
                  <h6 className="label-search white">Building </h6>
                  <Form.Select
                    as="select"
                    size="md"
                    name="buildingList"
                    id="buildingList"
                    className="form-add-user newSize"
                    {...register("buildingList", {
                    })}>
                    <option value="">
                      Select Building
                    </option>
                    {buildingName &&
                      buildingName.length > 0 &&
                      buildingName.map((buil) => {
                        return (
                          <option value={buil.id} key={buil.id}>
                            {buil.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Col> */}
              </Row>
              <Row>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </Row>
            </form>
          </Container>


        </Modal.Body>
        {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
      </Modal>

    </div>
  );
};


const MyForgetPasswordModal = (props) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [apiResponse, setApiResponse] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const forgotPassword = (e) => {
    const toastId = toast.loading("Loading...");
    const formdata = new FormData();
    formdata.append("email", email);
    axiosInstance
      .post("users/sendOtpToUser", formdata)
      .then((res) => {
        if (res.data.status === 1) {
          SuccessToastWithToastId("Otp Send Successfully!", toastId);
          setApiResponse(1);
        } else {
          ErrorToastWithToastId(res.data.message, toastId);
        }
        // console.log(res);
        return false;
      })
      // Catch errors if any
      .catch((err) => {
        ErrorToastWithToastId(
          "Somthing Went Wrong Try After Some Time.!",
          toastId
        );
        // console.log(err);
        return false;
      });
  };

  const verifyOtp = (e) => {
    const toastId = toast.loading("Loading...");
    if (otp == "" || otp == null) {
      ErrorToastWithToastId("Enter Otp", toastId);
      return false;
    }
    // e.preventDefault();
    const data = { email: email, otp: otp };
    axiosInstance
      .post("users/verifyOtp", JSON.stringify(data), { headers: headers })
      .then((res) => {
        if (res.data.status === 1) {
          setApiResponse(2);
          SuccessToastWithToastId(res.data.message, toastId);
        } else {
          ErrorToastWithToastId(res.data.message, toastId);
        }
        // console.log(res);
        return false;
      })
      // Catch errors if any
      .catch((err) => {
        ErrorToastWithToastId(
          "Somthing Went Wrong Try After Some Time.!",
          toastId
        );
        // console.log(err);
        return false;
      });
  };

  const changePassword = (e) => {
    var lowerCase = /[a-z]/g;
    var upperCase = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if (newPassword != confirmPassword) {
      ErrorToastWithToastId("Confirm password should match!");
    } else if (!newPassword.match(lowerCase)) {
      ErrorToastWithToastId("Password should contains lowercase letters!");
    } else if (!newPassword.match(upperCase)) {
      ErrorToastWithToastId("Password should contain uppercase letters!");
    } else if (!newPassword.match(numbers)) {
      ErrorToastWithToastId("Password should contains numbers also!");
    } else if (newPassword.length < 8) {
      ErrorToastWithToastId("Password length should be more than 8.");
    } else {
      const toastId = toast.loading("Loading...");
      const data = {
        email: email,
        password: newPassword,
        confirmPassword: newPassword,
      };
      axiosInstance
        .post("users/resetPassword", JSON.stringify(data), {
          headers: headers,
        })
        .then((res) => {
          if (res.data.status === 1) {
            // console.log(res);
            SuccessToastWithToastId(res.data.message, toastId);
            setTimeout(() => {
              setApiResponse(0);
              window.location.reload();
            }, 1000);
          } else {
            ErrorToastWithToastId(res.data.message, toastId);
          }
          // console.log(res);
          return false;
        })
        // Catch errors if any
        .catch((err) => {
          ErrorToastWithToastId(
            "Somthing Went Wrong Try After Some Time.!",
            toastId
          );
          // console.log(err);
          return false;
        });
    }
  };

  return (
    <div className="modal" style={{ display: "block", position: "initial" }}>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modalBodystyle4"
      >
        <Modal.Header>
          <button className="custom-close-button" onClick={props.onHide}>
            <AiOutlineClose />
          </button>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="in-side-content-3 ">
            <div className="logo-cont">
              <img src={logo400white} width="100px" />
            </div>
            {/* <div className="form-row"> */}
            <div
              className={`form-group col-md-12 mt-3 text-center ${apiResponse === 2 ? "d-none" : ""
                }`}
              id="emailDiv"
            >
              <label htmlFor="inputEmail4" className="mb-3 white">
                Enter your registered email address
              </label>
              <input
                required
                type="email"
                className="form-control"
                id="inputEmail4"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                readOnly={apiResponse === 1 || apiResponse === 2} // Make the input read-only when apiResponse is 1
              />
            </div>
            <div className="text-center ">
              <button
                type="submit"
                className={`btn btn-primary ${apiResponse === 0 ? "" : "d-none"
                  }`}
                onClick={() => forgotPassword()}
              >
                Submit
              </button>
            </div>
            <div
              className={`form-group col-md-12  ${apiResponse === 1 ? "" : "d-none"
                }`}
              id="otpDiv"
            >
              <label htmlFor="inputEmail4" className="white mb-2">
                OTP
              </label>
              <input
                type="text"
                className="form-control"
                id="inputOtp"
                placeholder="OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {/* </div> */}

            <div className="text-center ">
              <button
                type="submit"
                className={`btn btn-primary ${apiResponse === 1 ? "" : "d-none"
                  }`}
                onClick={() => verifyOtp()}
              >
                Submit
              </button>
            </div>

            <div className={`row ${apiResponse === 2 ? "" : "d-none"}`}>
              <div className="form-row col-lg-12">
                <div className="form-group col-md-12 " id="emailDiv">
                  <PasswordChecklist
                    className="white mb-2 font-size-box"
                    rules={[
                      "minLength",
                      "specialChar",
                      "number",
                      "capital",
                      "lowercase",
                      "match",
                    ]}
                    minLength={8}
                    value={newPassword}
                    valueAgain={confirmPassword}
                    messages={{
                      minLength: "Password must have more than 8 characters.",
                      specialChar:
                        "Password must have at least one special character .",
                      number:
                        "Password must have at least one number('0'-'9').",
                      capital:
                        "Password must have at least one uppercase('A'-'Z').",
                      lowercase:
                        "Password must have at least one lowercase('a'-'z').",
                      match: "Password matches.",
                    }}
                  />
                  <label htmlFor="inputPassword" className="white">
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control mt-3"
                    id="inputPassword"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  // readOnly={apiResponse === 1} // Make the input read-only when apiResponse is 1
                  />
                </div>
                <div className="form-group col-md-12 mt-3" id="otpDiv">
                  <label htmlFor="confirmPassword" className="white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="col-lg-12 text-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => changePassword()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
      </Modal>
    </div>
  );
};



const AuthLayout = () => {
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modalShow3, setModalShow3] = React.useState(false);
  const [modalShow4, setModalShow4] = React.useState(false);
  const [modalShow5, setModalShow5] = React.useState(false);
  // const [sendMail, setSendMail] = React.useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [, setUserList] = useRecoilState(userAtom);

  const [captchaReload, setCaptchaReload] = useState(0);
  const [displayCaptcha, setDisplayCaptcha] = useState(true); // Add this line

  const reloadCaptcha = () => {
    loadCaptchaEnginge(6, "#e9e9ed", "#454545");
    // Clear the input field
    document.getElementById("user_captcha_input").value = "";
  };

  // Auth
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [unsuccessfulLoginAttempts, setUnsuccessfulLoginAttempts] = useState(parseInt(localStorage.getItem('unsuccessfulLoginAttempts')) || 0);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading in...");

    let isValidatedCaptcha = true;
    if (unsuccessfulLoginAttempts < 3) {
      isValidatedCaptcha = true;
    }
    else {
      const user_captcha = document.getElementById("user_captcha_input").value;
      isValidatedCaptcha = validateCaptcha(user_captcha);
    }


    if (isValidatedCaptcha) {
      if (unsuccessfulLoginAttempts < 3) {
        isValidatedCaptcha = true;
      }
      else {
        loadCaptchaEnginge(6, "#e9e9ed", "#454545");
        document.getElementById("user_captcha_input").value = "";
      }



      const user = { userName, password };
      setTimeout(() => {
        axiosInstance
          .post("auth/login", JSON.stringify(user), { headers: headers })
          .then((res) => {
            if (res.data.status === 1) {
              localStorage.removeItem('unsuccessfulLoginAttempts');
              localStorage.setItem("user", res.data.data.list);
              dispatch(login(JSON.stringify(res.data.data.list)));
              setUserList(res.data.data.list);
              SuccessToastWithToastId("Successfully logged in!", toastId);
              window.location.reload();
              // navigate('/dashboard');
            } else {
              ErrorToastWithToastId(res.data.message, toastId);

              const unsuccessfulLoginAttempts = parseInt(localStorage.getItem('unsuccessfulLoginAttempts')) || 0;
              localStorage.setItem('unsuccessfulLoginAttempts', unsuccessfulLoginAttempts + 1);

              if (unsuccessfulLoginAttempts + 1 >= 3) {
                if (unsuccessfulLoginAttempts + 1 === 3) {
                  window.location.reload();
                }

                // setDisplayCaptcha(true);
                // loadCaptchaEnginge(6, "#e9e9ed", "#454545");
              }



              // setErrorMessage(res.data.message);
            }
            // console.log(res);
            return false;
          })

          // Catch errors if any

          .catch((err) => {
            // setErrorMessage('Something Went Wrong ..!');
            ErrorToastWithToastId("Something Went Wrong ..!", toastId);
            toast.dismiss(toastId);
          });
      }, 1000);
    } else {
      // alert('Captcha Does Not Match');
      // setErrorMessage('Captcha Does Not Match...');
      ErrorToastWithToastId("Captcha verification failed!", toastId);
      document.getElementById("user_captcha_input").value = "";
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };


  const handleCloseUserModal = () => {
    setModalShow5(false);
  };

  const register = { modalShow5, handleCloseUserModal };

  setTimeout(function () {
    setErrorMessage("");
  }, 5000);
  const authHandler = (err, data) => {
    // console.log(err, data);
  };



  useEffect(() => {
    if (unsuccessfulLoginAttempts < 3) {
      setDisplayCaptcha(false);
    }
    else {
      setDisplayCaptcha(true);
      loadCaptchaEnginge(6, "#e9e9ed", "#454545");
    }
  }, []);



  return (
    <>
      <Helmet title={"Login | IAQ Reporting System"} />

      <Toaster position="top-center" className="toster" reverseOrder={false} />

      <div className="body-wrap">
        <div className="login-container">
          <div className="onboarding">
            <div className="home-tab-section">
              <div className="tab-box">
                <h6>
                  <Link onClick={() => setModalShow1(true)}>Home</Link>
                </h6>
                <h6>
                  <Link onClick={() => setModalShow2(true)}>About</Link>
                </h6>
                <h6>
                  <Link onClick={() => setModalShow3(true)}>Contact</Link>
                </h6>
              </div>
            </div>
            <div className="home-social-media">
              {/* <Link
                to="https://www.facebook.com/people/Sterling-IAQ-Consultants-Ltd/100063664795254/"
                target="_blank"
              >
                <i className="fab fa-facebook-f" />
              </Link> */}
              {/* <Link href="#">
                <i className="fab fa-instagram" />
              </Link> */}
              <div className="linkedin-soci">
                <Link
                  to="https://www.linkedin.com/company/sterling-iaq-consultants-ltd/about/"
                  target="_blank"

                >
                  <FaLinkedinIn />
                </Link>
              </div>
            </div>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                // onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log("slide change")}
                >
                  <SwiperSlide key={123}>
                    <div className="swiper-slide-content">
                      <div className="swip-con">
                        <img src={logo400white} alt="logo" />
                        <p className="mt-4 font-swip">
                          Proactive Indoor Air Quality <br />
                          Reporting System
                        </p>
                      </div>

                      <img
                        src={back1}
                        alt="back1"
                        className="back-image-slide"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide key={124}>
                    <div className="swiper-slide-content">
                      <div className="swip-con">
                        <img src={logo400white} alt="logo" />
                        <p className="mt-4 font-swip">
                          Proactive Indoor Air Quality <br />
                          Reporting System
                        </p>
                      </div>
                      <img
                        src={back2}
                        alt="back2"
                        className="back-image-slide"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide key={125}>
                    <div className="swiper-slide-content">
                      <div className="swip-con">
                        <img src={logo400white} alt="logo" />
                        <p className="mt-4 font-swip">
                          Proactive Indoor Air Quality <br />
                          Reporting System
                        </p>
                      </div>
                      <img
                        src={back3}
                        alt="back3"
                        className="back-image-slide"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              {/* Add Pagination */}
              <div className="swiper-pagination" />
            </div>
          </div>
          <div className="login-form">
            <div className="login-form-inner">
              <h2 className="mb-4">Login
                <div className="float-end">
                  <Link
                    onClick={() => setModalShow5(true)}
                    //  onClick={() => setModalRegister(true)}
                    className="link-1"
                  >
                    New User|Register
                  </Link>
                </div>
              </h2>
              <div>
                {/* <MicrosoftLogin clientId={"4a81ad52-2a3b-42f6-833d-a1f8d3136e1e"} authCallback={authHandler} /> */}
              </div>

              <div className="sign-in-seperator">
                <span>Please fill out the information below</span>
                {errorMessage && (
                  <p className="text-danger"> {errorMessage} </p>
                )}
              </div>
              <form onSubmit={submitForm}>
                <div className="login-form-group mb-4">
                  <div className="icons">
                    <FaUser />
                  </div>
                  {/*<label for="email">Email <span class="required-star">*</span></label>*/}
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    id="emailInput"
                    required
                    className="myInput"
                  />
                  <div className="labelline ">User Id</div>
                  {/*<input type="text" placeholder="email@website.com" id="email">*/}
                </div>
                <div className="login-form-group mb-4">
                  <div className="icons">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
                    onChange={(e) => setPassword(e.target.value)}
                    id="fullNameInput"
                    className="myInput"
                    required
                  />
                  <div className="labelline">Password</div>
                  <span className="eye" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* <div className="login-form-group">
                  <div className="icons">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    id="fullNameInput"
                    className="myInput"
                    required
                  />
                  <div className="labelline">Password</div>
                  <span className="eye"><FaEye /></span>
                  {/*<label for="pwd">Password <span class="required-star">*</span></label>
                  <input autocomplete="off" type="text" placeholder="Minimum 8 characters" id="pwd">
    
                </div> */}

                {displayCaptcha &&
                  <>
                    <div className="custom-captcha-container ">
                      <LoadCanvasTemplateNoReload reload={captchaReload} />
                      <Link
                        className="captcha-reload-button reload-btn"
                        onClick={reloadCaptcha}
                      >
                        <FaRedo />
                      </Link>
                    </div>

                    <div className="login-form-group">
                      <div className="icons">
                        <FaThLarge />
                      </div>

                      <input
                        type="text"
                        id="user_captcha_input"
                        name="user_captcha_input"
                        className="myInput"
                        required
                      />
                      <div className="labelline">Enter Captcha Value</div>
                    </div>
                  </>
                }


                {/* <div>
                  <input className="myInput" placeholder="Enter Captcha Value" id="user_captcha_input" name="user_captcha_input" type="text"></input>
                  </div> */}
                <button className="rounded-button login-cta" type="submit">
                  Login
                </button>
                {/* <div><button class="btn btn-primary" onClick={() => this.doSubmit()}>Submit</button></div> */}

                <hr />
                <div className="login-form-group single-row">

                  {/* <div className="custom-check">
                    
                    <input
                      autoComplete="off"
                      type="checkbox"
                      defaultChecked={false}
                      id="remember"
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div> */}
                  <div className="forget-pass">
                    <Link
                      onClick={() => setModalShow4(true)}
                      className="link forgot-link text-left"
                    >
                      Forgot Password?
                    </Link>

                  </div>


                  {/* <div className="microsoft-box">
                    <TiVendorMicrosoft /><h6>login with Microsoft</h6>
                  </div> */}
                  <MicrosoftOauth />

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <MyHomeModal show={modalShow1} onHide={() => setModalShow1(false)} />
      <MyAboutModal show={modalShow2} onHide={() => setModalShow2(false)} />
      <MyContactModal show={modalShow3} onHide={() => setModalShow3(false)} />
      <MyRegisterModal {...register} onHide={() => setModalShow5(false)} />
      <MyForgetPasswordModal
        show={modalShow4}
        onHide={() => {
          setModalShow4(false);
          window.location.reload();
        }}
      />


    </>
  );
};

export default AuthLayout;
