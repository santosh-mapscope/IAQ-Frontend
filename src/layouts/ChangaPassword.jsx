/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../Redux/Userslice";
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import { axiosInstance, headersForJwt } from "../util/axiosConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const MyChangePassword = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const {
        modalShow,
        handleCloseChangePasswordModal
    } = props;

    const dispatch = useDispatch();

    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const {
        register,
        getValues,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // console.log(data);
        Swal.fire({
            title: "Please confirm",
            text: "Do you want to change the password?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Change it!",
        }).then((result) => {
            // console.log("-->", result);
            if (result.isConfirmed) {
                let user = JSON.parse(localStorage.getItem("user"));
                // console.log(user);
                // console.log(user.userDetails.email);
                let final_data = {
                    oldPassword: data.CurrentPassword,
                    password: data.password,
                    id: user.userDetails.userId
                };

                axiosInstance
                    .post("users/resetOnlyPassword", final_data, {
                        headers: headersForJwt,
                    })
                    .then((res) => {
                        // console.log(res);
                        if (res && res.data.status === 1) {
                            Swal.fire("Updated!", "Password Update successfully!", "success");
                            reset();
                            dispatch(logout());
                            handleCloseChangePasswordModal();
                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: res.data.message,
                                text: "Password Updation Failed!",
                            });

                            // handleCloseTenantModal();
                        }
                        return false;
                    }).catch((err) => {
                        // setErrorMessage('Something Went Wrong ..!');
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    });
            }
        });
    }

    return (
        <Modal
            show={modalShow}
            onHide={() => {
                reset();
                handleCloseChangePasswordModal();
            }}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="modal-header-section">
                <Modal.Title id="contained-modal-title-vcenter">
                    <h6>Change Password</h6>
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="grid-example inside-padding user-modal">

                    <FloatingLabel controlId="currentPassword" label="Current Password" className="mb-4">
                        <Form.Control type="password" placeholder="Current Password" name="CurrentPassword"
                            {...register("CurrentPassword", {
                                required: "Current password required",
                            })} />
                        {errors.CurrentPassword && (
                            <span className="text-danger">{errors.CurrentPassword.message}</span>
                        )}
                    </FloatingLabel>

                    <FloatingLabel controlId="newPassword" label="New Password" className="mb-4">
                        <span className="eye-password-change" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        <Form.Control
                            placeholder="New Password"
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
                        {errors.password && (
                            <span className="text-danger">{errors.password.message}</span>
                        )}
                        {passwordMatchError && (
                            <span className="text-danger">
                                Password should meet the criteria
                            </span>
                        )}


                    </FloatingLabel>

                    <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-4">
                        <Form.Control type="text" placeholder="Confirm Password"
                            name="cPassword"
                            {...register("cPassword", {
                                required: true,
                                validate: (val) => {
                                    if (watch("password") != val) {
                                        return "Password doesn't match";
                                    }
                                },
                            })} />
                        {errors.cPassword && (
                            <span className="text-danger">{errors.cPassword.message}</span>
                        )}
                    </FloatingLabel>
                    {/* <Button variant="primary" className="disply-end">Submit</Button> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal >
    );
}