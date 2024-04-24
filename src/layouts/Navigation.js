/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Profileicon from "../assets/dist/img/user2-160x160.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../Redux/Userslice";
import Swal from 'sweetalert2'
import { ErrorToast, SuccessToast } from "../util/customToast/index";
import { userAtom } from "../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import SidebarButton from "./SidebarButton";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useMediaQuery } from "react-responsive";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import { axiosInstance, headersForJwt } from "../util/axiosConfig";
import { AiOutlinePoweroff, AiOutlineLock } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import noImage from "./../assets/dist/img/no-img.png";
import noImage from "../assets/images/user2-160x160.jpg";
// import { noImage } from "./../assets/dist/img/no-img.png";
import { MyChangePassword } from "./ChangaPassword";

// export const MyChangePassword=(props) =>{
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };


//   const {
//     modalShow,
//     handleCloseChangePasswordModal
//   } = props;

//   const dispatch = useDispatch();

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
//     // console.log(data);
//     Swal.fire({
//       title: "Please confirm",
//       text: "Do you want to change the password?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Change it!",
//     }).then((result) => {
//       // console.log("-->", result);
//       if (result.isConfirmed) {
//         let user = JSON.parse(localStorage.getItem("user"));
//         // console.log(user);
//         // console.log(user.userDetails.email);
//         let final_data = {
//           oldPassword: data.CurrentPassword,
//           password: data.password,
//           id: user.userDetails.userId
//         };

//         axiosInstance
//           .post("users/resetOnlyPassword", final_data, {
//             headers: headersForJwt,
//           })
//           .then((res) => {
//             // console.log(res);
//             if (res && res.data.status === 1) {
//               Swal.fire("Updated!", "Password Update successfully!", "success");
//               reset();
//               dispatch(logout());
//               handleCloseChangePasswordModal();
//             } else {
//               Swal.fire({
//                 icon: "warning",
//                 title: res.data.message,
//                 text: "Password Updation Failed!",
//               });

//               // handleCloseTenantModal();
//             }
//             return false;
//           }).catch((err) => {
//             // setErrorMessage('Something Went Wrong ..!');
//             Swal.fire({
//               icon: "error",
//               title: "Oops...",
//               text: "Something went wrong!",
//             });
//           });
//       }
//     });
//   }

//   return (
//     <Modal
//       show={modalShow}
//       onHide={() => {
//         reset();
//         handleCloseChangePasswordModal();
//       }}
//       size="md"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton className="modal-header-section">
//         <Modal.Title id="contained-modal-title-vcenter">
//           <h6>Change Password</h6>
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Modal.Body className="grid-example inside-padding user-modal">

//           <FloatingLabel controlId="currentPassword" label="Current Password" className="mb-4">
//             <Form.Control type="password" placeholder="Current Password" name="CurrentPassword"
//               {...register("CurrentPassword", {
//                 required: "Current password required",
//               })} />
//             {errors.CurrentPassword && (
//               <span className="text-danger">{errors.CurrentPassword.message}</span>
//             )}
//           </FloatingLabel>

//           <FloatingLabel controlId="newPassword" label="New Password" className="mb-4">
//             <span className="eye-password-change" onClick={togglePasswordVisibility}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//             <Form.Control
//               placeholder="New Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               {...register("password", {
//                 required: "Password required",
//                 pattern: {
//                   value:
//                     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
//                   message:
//                     "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
//                 },
//               })}

//             />
//             {errors.password && (
//               <span className="text-danger">{errors.password.message}</span>
//             )}
//             {passwordMatchError && (
//               <span className="text-danger">
//                 Password should meet the criteria
//               </span>
//             )}


//           </FloatingLabel>

//           <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-4">
//             <Form.Control type="password" placeholder="Confirm Password"
//               name="cPassword"
//               {...register("cPassword", {
//                 required: true,
//                 validate: (val) => {
//                   if (watch("password") != val) {
//                     return "Password doesn't match";
//                   }
//                 },
//               })} />
//             {errors.cPassword && (
//               <span className="text-danger">{errors.cPassword.message}</span>
//             )}
//           </FloatingLabel>
//           {/* <Button variant="primary" className="disply-end">Submit</Button> */}

//         </Modal.Body>
//         <Modal.Footer>
//           <Button type="submit">Submit</Button>
//         </Modal.Footer>
//       </Form>
//     </Modal >
//   );
// }


const Navigation = (props) => {

  const [modalShow, setModalShow] = React.useState(false);
  const {
    collapsed,
    toggled,
    setCollapsed,
    setToggled
  } = props;
  // const [collapsed, setCollapsed] = useState(false);
  // const [toggled, setToggled] = useState(false);
  // const isMobile = useMediaQuery({ maxWidth: 768 });
  // const [collapsed, setCollapsed] = useState(isMobile);



  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
    setToggled(!toggled);
  };



  const handleToggleSidebar = (value) => {
    setToggled(value);
  };


  const [userData, setUserName] = useRecoilState(userAtom);
  // console.log("userData")

  // console.log(userData)
  let image = JSON.parse(localStorage.getItem("user"));
  // console.log("image is ",image.userDetails.profileImage);
  const user = useSelector(selectUser);
  // console.log(user.user.firstName)

  const dispatch = useDispatch();
  const handleLogout = (e) => {
    // SuccessToast("Successfully logged out!!");
    e.preventDefault();
    Swal.fire({
      title: 'Please confirm',
      text: "Do you want to logout this session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        SuccessToast("Successfully logged out!!");
        dispatch(logout());
        // SuccessToast("Successfully logged out!!");
      }
    })
    // dispatch(logout());
  };

  const handleCloseChangePasswordModal = () => {
    setModalShow(false);
  };

  const changePasswordProps = {
    modalShow,
    handleCloseChangePasswordModal
  }

  const handleImageError = (event) => {
    event.target.src = Profileicon; // Set the default image when an error occurs
  };
  return (
    <>

      <nav className="main-header navbar navbar-expand navbar-white navbar-light float-right">
        <SidebarButton
          collapsed={collapsed} // Pass the collapsed state to SidebarButton
          handleCollapsedChange={handleCollapsedChange}
          handleToggleSidebar={handleToggleSidebar}
        />

        <ul className="navbar-nav ml-auto float-right">
          <li className="nav-item float-right">
            <Dropdown>
              <Dropdown.Toggle variant="none" id="dropdown-basic" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}>
                <h6 className="user-name-style">{userData.userDetails.userName}</h6>

                {image.userDetails.profileImage ?
                  <img
                    className="img-circle"
                    src={image.userDetails.profileImage}
                    onError={handleImageError}
                    width="20px"
                  />
                  :
                  <img
                    className="img-circle"
                    src={noImage}
                    alt="user pic"
                    width="20px"
                  />
                }
              </Dropdown.Toggle>
              <div className="dropdown-box">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setModalShow(true)}><AiOutlineLock /> <span className="changepass">Change Password</span></Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleLogout(e)}><AiOutlinePoweroff className="logouticon" /> <span className="logout">Logout</span></Dropdown.Item>
                </Dropdown.Menu>
              </div>
            </Dropdown>

          </li>
        </ul>
      </nav>



      <MyChangePassword
        {...changePasswordProps}
        onHide={() => setModalShow(false)}
      />

    </>
  )
}
export default Navigation