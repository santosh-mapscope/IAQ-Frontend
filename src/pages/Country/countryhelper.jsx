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



export const AddProvince = (props) => {
    const [validated, setValidated] = useState(false);
    const { register, control, reset, formState: { errors }, } = useForm();
    const [countryname, setCountryname] = useState([]);
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
                countryName: event.target.countryName.value,
                userId: userData.userDetails.userId,

            };
         
            Swal.fire({
                title: "Please confirm",
                text: " Do you want to create this country?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.isConfirmed) {
                    setFullPageLoading(true)
                    axiosInstance
                        .post("country/addCountry", JSON.stringify(data), { headers: headersForJwtWithJson })
                        .then((res) => {
                            if (res && res.data.status === 1) {
                                setFullPageLoading(false)
                                Swal.fire({
                                    icon: 'success',
                                    title: "Country created successfully",
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
                                title: "Country creation failed. Try after some time",
                                showConfirmButton: false,
                                timer: 2000
                            })
                        });
                }
            });
        }
    };


    useEffect(() => {


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
                <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Add Country</Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example inside-padding user-modal">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="provinceName">
                            <Form.Label>Country Name<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="countryName"
                                placeholder="Country Name"
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter country name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Button className="mt-3" type="submit">Create Country</Button>
                </Form>
            </Modal.Body>
        </Modal >
    );
};

export const EditProvince = (props) => {
    const [data, setData] = useState([]);
    const { register, control, reset, formState: { errors }, } = useForm();
    const [countryname, setCountryname] = useState([]);
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

    const getCountryName = () => {
        axiosInstance
            .post(`country/getCountryDD`, [], {
                headers: headersForJwt,
            })
            .then((res) => {
                // console.log(res);
                if (res && res.data.status === 1) {
                    setCountryname(res.data.data.list);
                }
                return false;
            })
            .catch((err) => {
                // console.log(err);
            });
    };
    // const getCountryName = async (value) => {
    //     await axiosInstance
    //         .post("country/getCountryDD", [], { headers: headersForJwt })
    //         .then((res) => {
    //             const data = [
    //                 { value: "", label: "Select Country Name", isDisabled: true },
    //                 ...res.data.data.list.map((item) => ({
    //                     value: item.countryId.toString(), // Convert id to string, if needed
    //                     label: item.countryName,
    //                 })),
    //             ];
    //             setCountryname(data);
    //         })
    //         .catch((err) => { });
    // };
    const InitialValues = (DesignationDetails) => {
        reset({
            // provinceName: DesignationDetails.id,
            ClientName: DesignationDetails?.parentId?.id
        })
    }


    useEffect(() => {
        
        getCountryName()

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
                countryId: DesignationDetails.id,
                countryName: event.target.provinceName.value,
                userId: userData.userDetails.userId
            };

            Swal.fire({
                title: "Please confirm",
                text: " Do you want to update this country?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.isConfirmed) {
                    setFullPageLoading(true);
                    axiosInstance
                        .post("country/editCountry", JSON.stringify(data), { headers: headersForJwtWithJson })
                        .then((res) => {
                            if (res && res.data.status === 1) {
                                setFullPageLoading(false)
                                Swal.fire({
                                    icon: 'success',
                                    title: "Country updated successfully",
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
                                title: "Country updation failed. Try after some time",
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
                <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Update Country</Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example inside-padding user-modal">
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-1">
                        <Col lg={12} md={6} xs={12} className="mb-3">
                            <Form.Group as={Col} controlId="provinceName">
                                <Form.Label>Country Name<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="provinceName"
                                    id="provinceName"
                                    placeholder="Country Name"
                                    defaultValue={DesignationDetails.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter Country name.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                       
                    </Row>

                    <Button className="mt-3" type="submit">Update Country</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};