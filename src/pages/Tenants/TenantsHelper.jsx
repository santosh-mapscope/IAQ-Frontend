import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {
    axiosInstance,
    headersForJwt,
    headersForJwtWithJson,
} from "../../util/axiosConfig";
import { Col, Row, Modal, Form } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export const AddTenant = (props) => {
    const [validated, setValidated] = useState(false);
    const [province, setProvince] = useState("");
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [client, setClient] = useState("");
    const [building, setBuilding] = useState("");
    const { clickedBuildingId, showTenantModal, handleCloseTenantModal, CountryAll,setFullPageLoading } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    const handleHide = () => {
        handleCloseTenantModal();
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
        // console.log("uyuyuyuu", data);
        Swal.fire({
            title: "Please confirm",
            text: "Do you want to save this record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Save it!",
        }).then((result) => {
            // console.log("-->", result);
            if (result.isConfirmed) {
                setFullPageLoading(true)
                // console.log(data);
                let userid = JSON.parse(localStorage.getItem("user"));
                // console.log("++", data);
                let final_data = {
                    name: data.TenantName,
                    buildingId: data.Building,
                    suiteNo: data.Module,
                    phone: data.phoneNumber,
                    email: data.Email,
                    rent: null,
                    floorNo: Number(data.Floor),
                    primaryContactId: null,
                    createdBy: userid.userDetails.userId,
                    countryCode: data.CountryCode,
                    password: data.password,
                    address: null,
                    userName: data.UserName,
                };
                console.log(final_data);
                let formData = new FormData();
                if (data.image.length > 0) {
                    formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
                }
                delete data["image"];
                formData.append("tenantData", JSON.stringify(final_data));

                axiosInstance
                    .post("tenant/addTenant", formData, {
                        headers: headersForJwt,
                    }).then((res) => {
                        console.log(res);
                        if (res && res.data.status === 1) {
                            setFullPageLoading(false)
                            Swal.fire("Created!", "Tenant created successfully!", "success");
                            reset();
                            handleCloseTenantModal();

                        } else {
                            setFullPageLoading(false)
                            Swal.fire({
                                icon: "warning",
                                title: res.data.message,
                                text: "Tenant creation failed!",
                            });

                            // handleCloseTenantModal();
                        }
                        return false;
                    }).catch((err) => {
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

    const getProviance = (e) => {
        console.log(e.target.value);
        setProvince("");
        setCity("");
        setClient("");
        setBuilding("");
        let formData = new FormData();
        formData.append("countryId", Number(e.target.value));
        axiosInstance
            .post(`client/getAllProvinceByCountryId`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                setLoading(true);
                setProvince("");
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
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
                console.log(err);
            });
    };

    const getCity = (e) => {
        console.log(e.target.value);
        setCity("");
        setClient("");
        setBuilding("");
        let formData = new FormData();
        formData.append("provinceId", Number(e.target.value));

        axiosInstance
            .post(`client/getAllCityDD`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setCity(res.data.data.list);
                    // setCountry(res.data.data.list);
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
                console.log(err);
            });
    };
    const getClientByCityId = (e) => {
        console.log(e.target.value);
        setClient("");
        setBuilding("");
        let formData = new FormData();
        formData.append("cityId", Number(e.target.value));

        axiosInstance
            .post(`client/getAllClientDD`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setClient(res.data.data.list);
                    // setCountry(res.data.data.list);
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
                console.log(err);
            });
    };
    const getBuildingByClientId = (e) => {
        console.log(e.target.value);
        setBuilding("");
        let formData = new FormData();
        formData.append("clientId", Number(e.target.value));

        axiosInstance
            .post(`building/getAllBuildingByClientId`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setBuilding(res.data.data.list);
                    // setCountry(res.data.data.list);
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
                console.log(err);
            });
    };

    return (
        <Modal
            show={showTenantModal}
            onHide={() => {
                // reset();
                handleHide();
            }}
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="modal-60w"
        >
            <Modal.Header closeButton className="modal-header-section">
                <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
                    Add Tenant
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example inside-padding user-modal">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Row className="mb-3">

                        {/* Country */}
                        {clickedBuildingId ? (
                            < Col lg={4} md={6} xs={12} className="mb-3">
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
                        ) : (
                            <Col lg={4} md={6} xs={12} className="mb-3"></Col>
                        )}
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
                                    onChange: (e) => {
                                        getClientByCityId(e);
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
                        {/* Client */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Client Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                as="select"
                                size="sm"
                                name="Client"
                                id="Client"
                                className="form-add-user newSize height-sm"
                                {...register("Client", {
                                    onChange: (e) => {
                                        getBuildingByClientId(e);
                                    },
                                    required: "Client required",
                                })}
                            >
                                <option value="">Select Client</option>
                                {client &&
                                    client.length > 0 &&
                                    client.map((client) => {
                                        return (
                                            <option value={client.clientId} key={client.clientId}>
                                                {client.clientName}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            {errors.Client && (
                                <span className="text-danger">{errors.Client.message}</span>
                            )}
                        </Col>
                        {/* Building */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Building Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                as="select"
                                size="sm"
                                name="Building"
                                id="Building"
                                className="form-add-user newSize height-sm"
                                {...register("Building", {
                                    required: "Building required",
                                })}
                            >
                                <option value="">Select Building</option>
                                {building &&
                                    building.length > 0 &&
                                    building.map((building) => {
                                        return (
                                            <option value={building.buildingId} key={building.buildingId}>
                                                {building.buildingName}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            {errors.Building && (
                                <span className="text-danger">{errors.Building.message}</span>
                            )}
                        </Col>
                        {/* Tenant Name */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Tenant Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="TenantName"
                                placeholder="Enter Tenat Name"
                                {...register("TenantName", {
                                    required: "Client Name required",
                                })}
                            />
                            {errors.TenantName && (
                                <span className="text-danger">{errors.TenantName.message}</span>
                            )}
                        </Col>
                        {/* Floor */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Floor No. <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                name="Floor"
                                className="newSize"
                                {...register("Floor", {
                                    required: "Floor required",
                                })}
                            />
                            {errors.Floor && (
                                <span className="text-danger">{errors.Floor.message}</span>
                            )}
                        </Col>
                        {/* Module */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Module
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="Module"
                                {...register("Module", {
                                })}
                            />
                        </Col>
                        {/* Email */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Email
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="Email"
                                placeholder="Enter Email"
                                {...register("Email",
                                    {
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
                                    type="tel"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="phoneNumber"
                                    maxlength="10"
                                    pattern="\d{10}"
                                    {...register("phoneNumber", {
                                        pattern: {
                                            value: /\d{10}/,
                                            message: "Invalid Phone Number",
                                        },
                                    })}
                                />
                            </div>

                            {errors.phoneNumber && (
                                <span className="text-danger">Invalid Mobile Number</span>
                            )}
                        </Col>
                        {/* User Name */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                User Name <span className="text-danger" >*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="UserName"
                                {...register("UserName", {
                                    required: "Username required",
                                })}
                            />
                            {errors.UserName && (
                                <span className="text-danger">{errors.UserName.message}</span>
                            )}
                        </Col>
                        {/* Password */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
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
                        </Col>
                        {/* Confirm Password */}
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
                                            return "Passwords doesn't match";
                                        }
                                    },
                                })}
                            />
                            {errors.cPassword && (
                                <span className="text-danger">{errors.cPassword.message}</span>
                            )}
                        </Col>
                        {/* Image */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Image
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
                    </Row>
                    <Button className="mt-3 float-right" type="submit">
                        Create Tenant
                    </Button>
                </Form>
            </Modal.Body>
        </Modal >
    );
};

export const EditTenant = (props) => {
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [client, setClient] = useState("");
    const [building, setBuilding] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const {
        showTenantEditModal,
        handleCloseTenantEditModal,
        editTenantData,
        CountryAll,
        setFullPageLoading
    } = props;

    console.log("==", editTenantData);
    // console.log("===", editUserData.cityId?.parentId.id);
    // console.log("===", editUserData.cityId?.parentId.parentId.id);
    // let data=JSON.stringify(editUserData.cityId)
    // console.log(editUserData.cityId.parentId.id);
    // console.log(editUserData.cityId.parentId.parentId.id);

    const [validated, setValidated] = useState(false);
    const {
        register,
        getValues,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (editTenantData) {
            getProvianceByCountryId(editTenantData.countryId);
            reset({
                Country: editTenantData && editTenantData.countryId ? editTenantData.countryId : "",
                Province: editTenantData && editTenantData.provinceId ? editTenantData.provinceId : "",
                City: editTenantData && editTenantData.cityId ? editTenantData.cityId : "",
                Client: editTenantData && editTenantData.clientId ? editTenantData.clientId : "",
                Building: editTenantData && editTenantData.buildingId ? editTenantData.buildingId : "",
                TenantName: editTenantData.tenantName,
                Floor: editTenantData.floorNo,
                Module: editTenantData.suiteNo,
                Email: editTenantData.email,
                CountryCode: editTenantData.countryId,
                phoneNumber: editTenantData.phone,
                // UserName: editTenantData.userName,
            });
        }
        // console.log("&&&&&",editTenantData.tenantId);

    }, [editTenantData]);

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
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setProvince(res.data.data.list);
                    getCityByProvianceId(editTenantData.provinceId);
                    reset({
                        Province: editTenantData && editTenantData.provinceId ? editTenantData.provinceId : "",
                    });
                }
                return false;
            })
            .catch((err) => {
                console.log(err);
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
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setCity(res.data.data.list);
                    getClientListByCityId(editTenantData.cityId);
                    reset({
                        City: editTenantData && editTenantData.cityId ? editTenantData.cityId : "",
                    });
                }
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getClientListByCityId = (id) => {
        setClient("");
        let formData = new FormData();
        formData.append("cityId", Number(id));
        axiosInstance
            .post(`client/getAllClientDD`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setClient(res.data.data.list);
                    getBuildingListByClientId(editTenantData.clientId);
                    reset({
                        Client: editTenantData && editTenantData.clientId ? editTenantData.clientId : "",
                    });
                }
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getBuildingListByClientId = (id) => {
        setBuilding("");
        let formData = new FormData();
        formData.append("clientId", Number(id));

        axiosInstance
            .post(`building/getAllBuildingByClientId`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setBuilding(res.data.data.list);
                    reset({
                        Building: editTenantData && editTenantData.buildingId ? editTenantData.buildingId : "",
                    });
                }
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getProviance = (e) => {
        console.log(e.target.value);
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
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
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
                console.log(err);
            });
    };

    const getCity = (e) => {
        console.log(e.target.value);
        setCity("");
        let formData = new FormData();
        formData.append("provinceId", Number(e.target.value));

        axiosInstance
            .post(`client/getAllCityDD`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setCity(res.data.data.list);
                    // setCountry(res.data.data.list);
                }
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const getClientByCityId = (e) => {
        console.log(e.target.value);
        setCity("");
        let formData = new FormData();
        formData.append("cityId", Number(e.target.value));

        axiosInstance
            .post(`client/getAllClientDD`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setClient(res.data.data.list);
                    // setCountry(res.data.data.list);
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
                console.log(err);
            });
    };
    const getBuildingByClientId = (e) => {
        console.log(e.target.value);
        setCity("");
        let formData = new FormData();
        formData.append("clientId", Number(e.target.value));

        axiosInstance
            .post(`building/getAllBuildingByClientId`, formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                console.log(res);
                if (res && res.data.status === 1) {
                    console.log(res.data.data.list);
                    setBuilding(res.data.data.list);
                    // setCountry(res.data.data.list);
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
                console.log(err);
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
                setFullPageLoading(true)
                let userid = JSON.parse(localStorage.getItem('user'));
                let tenantData = {
                    id: editTenantData.tenantId,
                    name: data.TenantName,
                    buildingId: data.Building,
                    suiteNo: "",
                    phone: data.phoneNumber,
                    email: data.Email,
                    rent: "",
                    floorNo: data.Floor,
                    primaryContactId: "",
                    userId: userid.userDetails.userId,
                    countryCode: data.CountryCode,
                    address: "",
                };
                console.log(tenantData);
                let formData = new FormData();
                if (data.image.length > 0) {
                    formData.append("image", data.image[0]); // Creating an empty Blob with a default type);
                }
                delete data["image"];

                formData.append("tenantData", JSON.stringify(tenantData))

                axiosInstance
                    .post("tenant/editTenant", formData, {
                        headers: headersForJwt,
                    })
                    .then((res) => {
                        if (res && res.data.status === 1) {
                            setFullPageLoading(false)
                            Swal.fire("Updated!", "Tenant updated successfully!", "success");
                            reset();
                            handleCloseTenantEditModal();
                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: res.data.message,
                                text: "Tenant update failed!",
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
        handleCloseTenantEditModal();
    };

    return (
        <Modal
            centered
            show={showTenantEditModal}
            onHide={() => {
                // handleCloseTenantEditModal();
                // reset();
                handleHide();
            }}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton className="modal-header-section">
                <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
                    Edit Tenant
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example inside-padding user-modal">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Row className="mb-3">
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
                                    required: "Province Required",
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
                                    onChange: (e) => {
                                        getClientByCityId(e);
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
                        {/* Client */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Client Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                as="select"
                                size="sm"
                                name="Client"
                                id="Client"
                                className="form-add-user newSize height-sm"
                                {...register("Client", {
                                    onChange: (e) => {
                                        getBuildingByClientId(e);
                                    },
                                    required: "Client required",
                                })}
                            >
                                <option value="">Select Client</option>
                                {client &&
                                    client.length > 0 &&
                                    client.map((client) => {
                                        return (
                                            <option value={client.clientId} key={client.clientId}>
                                                {client.clientName}
                                            </option>
                                        );
                                    })}
                            </Form.Select>
                            {errors.Client && (
                                <span className="text-danger">{errors.Client.message}</span>
                            )}
                        </Col>
                        {/* Building */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Building Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                as="select"
                                size="sm"
                                name="Building"
                                id="Building"
                                className="form-add-user newSize height-sm"
                                {...register("Building", {
                                    required: "Building required",
                                })}
                            >
                                <option value="">Select Building</option>
                                {building &&
                                    building.length > 0 &&
                                    building.map((building) => {
                                        return (
                                            // <option value={building.buildingId} key={building.buildingId}>
                                            //     {building.buildingName}
                                            // </option>
                                            <option value={building.buildingId} key={building.buildingId}>
                                            {building.address2 ? `${building.buildingName} at ${building.address1}, ${building.address2}` : `${building.buildingName} at ${building.address1}`}
                                          </option>
                                    
                                        );
                                    })}
                            </Form.Select>
                            {errors.Building && (
                                <span className="text-danger">{errors.Building.message}</span>
                            )}
                        </Col>
                        {/* Tenant Name */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Tenant Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="TenantName"
                                {...register("TenantName", {
                                    required: "Client Name required",
                                })}
                            />
                            {errors.TenantName && (
                                <span className="text-danger">{errors.TenantName.message}</span>
                            )}
                        </Col>
                        {/* Floor */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Floor No. <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                name="Floor"
                                className="newSize"
                                {...register("Floor", {
                                    required: "Floor required",
                                })}
                            />
                            {errors.Floor && (
                                <span className="text-danger">{errors.Floor.message}</span>
                            )}
                        </Col>
                        {/* Module */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Module
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="Module"
                                {...register("Module", {
                                })}
                            />
                        </Col>
                        {/* Email */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Email
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="form-control-add-user newSize"
                                name="Email"
                                {...register("Email",
                                    {
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
                                    type="tel"
                                    size="sm"
                                    className="form-control-add-user newSize"
                                    name="phoneNumber"
                                    maxlength="10"
                                    pattern="\d{10}"
                                    {...register("phoneNumber", {
                                        pattern: {
                                            value: /\d{10}/,
                                            message: "Invalid Phone Number",
                                        },
                                    })}
                                />
                            </div>

                            {errors.phoneNumber && (
                                <span className="text-danger">Invalid Mobile Number</span>
                            )}
                        </Col>
                        {/* User Name */}
                        {/* <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                User Name <span className="text-danger" >*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                readOnly
                                className="form-control-add-user newSize"
                                name="UserName"
                                {...register("UserName", {
                                    required: "User Name required",
                                })}
                            />
                            {errors.UserName && (
                                <span className="text-danger">{errors.UserName.message}</span>
                            )}
                        </Col> */}
                        {/* Password */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                New Password
                                <span> </span>
                                <span className="eye-password" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </Form.Label>

                            <Form.Control
                                size="sm"
                                className="form-control-add-user newSize"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    // required: "Password required",
                                    pattern: {
                                        value:
                                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                                        message:
                                            "Password must contain at least 8 characters(one lowercase, one uppercase, one number, and one special character.) ",
                                    },
                                })}

                            />

                            {/* {errors.password && (
                                <span className="text-danger">{errors.password.message}</span>
                            )} */}
                            {passwordMatchError && (
                                <span className="text-danger">
                                    Password should meet the criteria
                                </span>
                            )}
                        </Col>
                        {/* Confirm Password */}
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
                                    // required: true,
                                    validate: (val) => {
                                        if (watch("password") != val) {
                                            return "Passwords doesn't match";
                                        }
                                    },
                                })}
                            />
                            {/* {errors.cPassword && (
                                <span className="text-danger">{errors.cPassword.message}</span>
                            )} */}
                        </Col>
                        {/* Image */}
                        <Col lg={4} md={6} xs={12} className="mb-3">
                            <Form.Label className="newSize">
                                Image
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
                    </Row>
                    <Button className="mt-3" type="submit">
                        Update Tenant
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};