import React, { useEffect, useState } from "react";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";
// import { userAtom } from "../../Atom/CommonAtom";
// import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { axiosInstance, headersForJwt } from "../util/axiosConfig";
import { right } from "@popperjs/core";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";



export const ManageSurveyThreshold = (props) => {
    const { showManageSurveyThresholdModal, handleCloseManageSurveyThresholdModal } = props;

    // const [userData, userName] = useRecoilState(userAtom);
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [createBuildingOperatorData, setCreateBuildingOperatorData] = useState("");
    const [city, setCity] = useState("");
    const [cityId, setCityId] = useState("");

    const {
        register,
        getValues,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();

    // const getAllCity = () => {
    //     // setCity("");
    //     let userid = JSON.parse(localStorage.getItem("user"));
    //     let formData = new FormData();
    //     formData.append("userId", JSON.parse(userid.userDetails.userId));

    //     axiosInstance
    //         .post(`shortcode/getCityDD`, formData, {
    //             headers: headersForJwt,
    //         })
    //         .then((res) => {
    //             // setCity("");
    //             console.log(res);
    //             if (res && res.data.status === 1) {
    //                 // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", res.data.data.list);
    //                 setCity(res.data.data.list);
    //                 // setCountry(res.data.data.list);
    //             }
    //             return false;
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const onSurveyThresholdSubmit = (data) => {
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
                let updateData = {
                    carbonMonoxideMin: data.carbonMonoxideMin,
                    carbonMonoxideMax: data.carbonMonoxideMax,
                    orCarbonMonoxideMax: data.orCarbonMonoxideMax,
                    carbonDioxideMin: data.carbonDioxideMin,
                    carbonDioxideMax: data.carbonDioxideMax, 
                    orCarbonDioxideMax: data.orCarbonDioxideMax,
                    temperatureMin: data.temperatureMin,
                    temperatureMax: data.temperatureMax,
                    relativeHumidityMin: data.relativeHumidityMin,
                    relativeHumidityMax: data.relativeHumidityMax,
                    particulate25min: data.particulate25Min,
                    particulate25max: data.particulate25Max,
                    particulateMin: data.particulateMin,
                    particulateMax: data.particulateMax,
                    tvocMin: data.tvocMin,
                    tvocMax: data.tvocMax,
                    cityId: cityId,
                };
                // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^", updateData);
                let formData = new FormData();
                formData.append("data", JSON.stringify(updateData));

                axiosInstance
                    .post("shortcode/saveThresholdData", formData, {
                        headers: headersForJwt,
                    })
                    .then((res) => {
                        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$", res);
                        if (res && res.data.status === 1) {
                            // console.log("Hiiiiiiiiiiiiiiiiiiiiiiiii");
                            Swal.fire("Updated!", "Survey Threshold Updated successfully!", "success");
                            setCity("");
                            reset({
                                carbonMonoxideMin: "",
                                carbonMonoxideMax: "",
                                orCarbonMonoxideMax: "",
                                carbonDioxideMin: "",
                                carbonDioxideMax: "",
                                orCarbonDioxideMax: "",
                                temperatureMin: "",
                                temperatureMax: "",
                                relativeHumidityMin: "",
                                relativeHumidityMax: "",
                                particulate25Min: "",
                                particulate25Max: "",
                                particulateMin: "",
                                particulateMax: "",
                                tvocMin: "",
                                tvocMax: "",
                            })
                            // getAllCity();
                            handleCloseManageSurveyThresholdModal();
                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: "Oops...",
                                text: "User update failed!",
                            });
                        }
                        return false;
                    })
                    .catch((err) => {
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


    const handleHide = () => {
        handleCloseManageSurveyThresholdModal();
        setCity("");
        reset({
            carbonMonoxideMin: "",
            carbonMonoxideMax: "",
            orCarbonMonoxideMax: "",
            carbonDioxideMin: "",
            carbonDioxideMax: "",
            orCarbonDioxideMax: "",
            temperatureMin: "",
            temperatureMax: "",
            relativeHumidityMin: "",
            relativeHumidityMax: "",
            particulate25Min: "",
            particulate25Max: "",
            particulateMin: "",
            particulateMax: "",
            tvocMin: "",
            tvocMax: "",
        })
        // getAllCity();
    };

    const getCity = () => {
        // console.log("(((((((((((((((((((((((((((((((((( Hello");
        setCityId(-1);
        reset({
            carbonMonoxideMin: "",
            carbonMonoxideMax: "",
            orCarbonMonoxideMax: "",
            carbonDioxideMin: "",
            carbonDioxideMax: "",
            orCarbonDioxideMax: "",
            temperatureMin: "",
            temperatureMax: "",
            relativeHumidityMin: "",
            relativeHumidityMax: "",
            particulate25Min: "",
            particulate25Max: "",
            particulateMin: "",
            particulateMax: "",
            tvocMin: "",
            tvocMax: "",
        })
        let userid = JSON.parse(localStorage.getItem("user"));
        let formData = new FormData();
        formData.append("userId", JSON.parse(userid.userDetails.userId));
        formData.append("cityId", -1);

        axiosInstance
            .post(`shortcode/getThresholdByCityId`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                // console.log("))))))))))))))))))))))))))))))))))))))", res);
                if (res && res.data.status === 1) {
                    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", res.data.data.list);
                    reset({
                        carbonMonoxideMin: res.data.data.list.carbonMonoxideMin,
                        carbonMonoxideMax: res.data.data.list.carbonMonoxideMax,
                        orCarbonMonoxideMax: res.data.data.list.orCarbonMonoxideMax,
                        carbonDioxideMin: res.data.data.list.carbonDioxideMin,
                        carbonDioxideMax: res.data.data.list.carbonDioxideMax,
                        orCarbonDioxideMax: res.data.data.list.orCarbonDioxideMax,
                        temperatureMin: res.data.data.list.temperatureMin,
                        temperatureMax: res.data.data.list.temperatureMax,
                        relativeHumidityMin: res.data.data.list.relativeHumidityMin,
                        relativeHumidityMax: res.data.data.list.relativeHumidityMax,
                        particulateMin: res.data.data.list.particulateMin,
                        particulateMax: res.data.data.list.particulateMax,
                        particulate25Min: res.data.data.list.particulate25min,
                        particulate25Max: res.data.data.list.particulate25max,
                        tvocMin: res.data.data.list.tvocMin,
                        tvocMax: res.data.data.list.tvocMax,
                    })
                }
                return false;
            })
            .catch((err) => {
                // console.log(err);
            });
    }

    useEffect(() => {
        // getAllCity();
        getCity();
    }, [showManageSurveyThresholdModal]);

    return (
        <>
            {/* showManageSurveyThresholdModal Modal */}
            <Modal
                show={showManageSurveyThresholdModal}
                onHide={() => {
                    handleHide();
                }}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton className="modal-header-section">
                    <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
                        Manage Survey Threshold
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example inside-padding user-modal ">
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit(onSurveyThresholdSubmit)}
                    >
                        {/* <div className="col-lg-6 mb-1">
                            <Form.Label className="newSize">
                                City <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                as="select"
                                size="sm"
                                name="city"
                                id="city"
                                className="form-add-user newSize height-sm"
                                {...register("city", {
                                    onChange: (e) => {
                                        getCity(e);
                                    },
                                    required: "Select City",
                                })}
                            >
                                <option value="">Select City</option>
                                {city &&
                                    city.length > 0 &&
                                    city.map((city) => {
                                        return (
                                            <option value={city.id} key={city.id}>
                                                {city.name}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            {errors.city && (
                                <span className="text-danger">{errors.city.message}</span>
                            )}
                        </div> */}

                        <Row className="mb-3">

                            {/* Carbon Monoxide Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Carbon Monoxide Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="carbonMonoxideMin"
                                    {...register("carbonMonoxideMin", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.carbonMonoxideMin && (
                                    <span className="text-danger">{errors.carbonMonoxideMin.message}</span>
                                )} */}
                            </Col>

                            {/* Carbon Monoxide Max */}
                            <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize"> Carbon Monoxide Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="carbonMonoxideMax"
                                    {...register("carbonMonoxideMax", {})}
                                />
                                {/* {errors.carbonMonoxideMax && (
                    <span className="text-danger">{errors.carbonMonoxideMax.message}</span>
                  )} */}
                            </Col>
                            {/* or Carbon Monoxide Max */}
                            <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize"> Or Carbon Monoxide Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="orCarbonMonoxideMax"
                                    {...register("orCarbonMonoxideMax", {})}
                                /> + above average outdoors
                            </Col>
                            {/* <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize"></Form.Label><br></br>OR 2 ppm above average outdoors

                            </Col> */}

                            {/* Carbon Dioxide Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Carbon Dioxide Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="carbonDioxideMin"
                                    {...register("carbonDioxideMin", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.carbonDioxideMin && (
                                    <span className="text-danger">{errors.carbonDioxideMin.message}</span>
                                )} */}
                            </Col>

                            {/* Carbon Dioxide Max */}
                            <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize">Carbon Dioxide Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="carbonDioxideMax"
                                    {...register("carbonDioxideMax", {})}
                                />
                                {/* {errors.carbonDioxideMax && (
                    <span className="text-danger">{errors.carbonDioxideMax.message}</span>
                  )} */}

                            </Col>
                            {/* or Carbon Dioxide Max */}
                            <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize">Or Carbon Dioxide Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="orCarbonDioxideMax"
                                    {...register("orCarbonDioxideMax", {})}
                                />
                                + Outdoor of that day
                                {/* {errors.carbonDioxideMax && (
                    <span className="text-danger">{errors.carbonDioxideMax.message}</span>
                  )} */}
                            </Col>


                            {/* <Col lg={3} md={3} xs={12} className="mb-3">
                                <Form.Label className="newSize"></Form.Label><br></br>OR 650 + Outdoor of that day
                               
                            </Col> */}

                            {/* Temperature Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Temperature Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="temperatureMin"
                                    {...register("temperatureMin", {
                                        // required: " required",
                                    })}
                                />
                                {/* {errors.temperatureMin && (
                                    <span className="text-danger">{errors.temperatureMin.message}</span>
                                )} */}
                            </Col>

                            {/* Temperature Max */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">Temperature Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="temperatureMax"
                                    {...register("temperatureMax", {})}
                                />
                                {/* {errors.temperatureMax && (
                    <span className="text-danger">{errors.temperatureMax.message}</span>
                  )} */}
                            </Col>

                            {/*  Relative Humidity Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Relative Humidity Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="relativeHumidityMin"
                                    {...register("relativeHumidityMin", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.relativeHumidityMin && (
                                    <span className="text-danger">{errors.relativeHumidityMin.message}</span>
                                )} */}
                            </Col>

                            {/* Relative Humidity Max */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">Relative Humidity Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="relativeHumidityMax"
                                    {...register("relativeHumidityMax", {})}
                                />
                                {/* {errors.relativeHumidityMax && (
                    <span className="text-danger">{errors.relativeHumidityMax.message}</span>
                  )} */}
                            </Col>
                            {/* Particulate25 Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Particulate(PM 2.5) Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="particulate25Min"
                                    {...register("particulate25Min", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.particulateMin && (
                                    <span className="text-danger">{errors.particulateMin.message}</span>
                                )} */}
                            </Col>

                            {/* Particulate25 Max */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">Particulate(PM 2.5) Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="particulate25Max"
                                    {...register("particulate25Max", {})}
                                />
                                {/* {errors.particulateMax && (
                    <span className="text-danger">{errors.particulateMax.message}</span>
                  )} */}
                            </Col>

                            {/* Particulate Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Particulate Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="particulateMin"
                                    {...register("particulateMin", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.particulateMin && (
                                    <span className="text-danger">{errors.particulateMin.message}</span>
                                )} */}
                            </Col>

                            {/* Particulate Max */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">Particulate Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="particulateMax"
                                    {...register("particulateMax", {})}
                                />
                                {/* {errors.particulateMax && (
                    <span className="text-danger">{errors.particulateMax.message}</span>
                  )} */}
                            </Col>

                            {/* Tvoc Min */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">
                                    Tvoc Min
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="tvocMin"
                                    {...register("tvocMin", {
                                        // required: "First Name required",
                                    })}
                                />
                                {/* {errors.tvocMin && (
                                    <span className="text-danger">{errors.tvocMin.message}</span>
                                )} */}
                            </Col>

                            {/* Tvoc Max */}
                            <Col lg={6} md={6} xs={12} className="mb-3">
                                <Form.Label className="newSize">Tvoc Max</Form.Label>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="tvocMax"
                                    {...register("tvocMax", {})}
                                />
                                {/* {errors.tvocMax && (
                    <span className="text-danger">{errors.tvocMax.message}</span>
                  )} */}
                            </Col>
                        </Row>

                        <Button style={{ 'float': right }} className="mt-3" type="submit">
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};