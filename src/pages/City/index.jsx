/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { PiGearBold, PiNotePencilBold } from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { Dropdown } from "react-bootstrap";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
// import Tooltip from "react-bootstrap/Tooltip";

// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
    ErrorToastWithToastId,
    SuccessToastWithToastId,
} from "../../util/customToast/index";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { AddCity, EditCity } from "./cityhelper";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function DesignationList() {
    const [isFullPageLoading, setFullPageLoading] = useState(false);
    const [userData, setUserData] = useRecoilState(userAtom);
    const { register, handleSubmit, control, reset } = useForm();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [designation, setDesignation] = useState("");
    const [showDesignationModal, setShowaDesignationModal] = useState(false);
    const [showdesignationEditModal, setShowdesignationEditModal] =
        useState(false);
    const [status, setStatus] = useState("");
    const [roleId, setRoleId] = useState("");
    const [designationId, setDesignationId] = useState("");
    const [cityId, setCityId] = useState("");
    const [clientId, setClientId] = useState("");
    const [DesignationDetails, setDesignationDetails] = useState("");
    const [ClientName, setClientName] = useState("");
    const [CountryName, setCountryName] = useState([]);
    const [province, setprovince] = useState([]);
    const [cityname, setCityname] = useState([]);
    const submitButtonRef = useRef(null);



    const getCountryName = async (value) => {
        await axiosInstance
            .post("country/getCountryDD", [], { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Country", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.countryId.toString(), // Convert id to string, if needed
                        label: item.countryName,
                    })),
                ];
                setCountryName(data);
            })
            .catch((err) => { });
    };
    const getAllPRovinceDD = async (data) => {
        let formData = new FormData();
        formData.append("countryId", data);
        axiosInstance
            .post("province/getProvinceDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Province", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.provinceId.toString(), // Convert id to string, if needed
                        label: item.provinceName,
                    })),
                ];
                setprovince(data);
            })
            .catch((err) => {
               
            });
    };
    const getcityDD1 = async (data) => {
        
        axiosInstance
            .post("city/getCityDD", [] ,{ headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select City", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.cityId.toString(), // Convert id to string, if needed
                        label: item.cityName,
                    })),
                ];
                setCityname(data);
            })
            .catch((err) => {
            });
    };
    const getcityDD = async (data) => {
        let formData = new FormData();
        formData.append("provinceId", data);
        axiosInstance
            .post("city/getCityDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select City", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.cityId.toString(), // Convert id to string, if needed
                        label: item.cityName,
                    })),
                ];
                setCityname(data);
            })
            .catch((err) => {
            });
    };

    const fetchCity = async (
        page,
        size = perPage,
        statu = status,
        designation = designationId,
        client = clientId,
        city = cityId
    ) => {
        let formData = new FormData();
        formData.append("page", page - 1);
        formData.append("size", size);
        formData.append("sortBy", "id");
        formData.append("sortOrder", "DESC");
        let userid = JSON.parse(localStorage.getItem("user"));
        formData.append("userId", userid.userDetails.userId);

        if (statu != null) formData.append("status", statu);
        if (client != "") formData.append("countryId", clientId);
        if (designation != "") formData.append("provinceId", designationId);
        if (city != "") formData.append("cityId", cityId);

        axiosInstance
            .post("city/getCityList", formData, {
                headers: headersForJwt,
            })
            .then((res) => {
                setData(res.data.data.list);

                setTotalRows(res.data.data.totalItems);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(true);
            });
    };

    useEffect(() => {
        getCountryName();
        getcityDD1();
        fetchCity(1);
    }, []);

    const columns = useMemo(
        () => [
            {
                name: "Sl no",
                // width: "15%",
                selector: (row) => row.slNo,
                // sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.slNo}`}>{row.slNo}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.slNo}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Country Name",
                // width: "20%",
                selector: (row) => row.name,
                sortable: false,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.countryName}`}>{row.countryName}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.countryName}</span>
                    </OverlayTrigger>
                ),
            },

            {
                name: "Province Name",
                // width: "25%",
                selector: (row) => row.name,
                sortable: false,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.provinceName}`}>{row.provinceName}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.provinceName}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "City Name",
                // width: "25%",
                selector: (row) => row.name,
                sortable: false,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.cityName}`}>{row.cityName}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.cityName}</span>
                    </OverlayTrigger>
                ),
            },



            {
                name: "Status",
                selector: (row) => row.isActive,
                // width: "20%",
                // sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-status-${row.id}`}>{getStatusText(row)}</Tooltip>}
                    >
                        <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
                            {getStatusText(row)}
                        </div>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Action",
                width: "",
                // eslint-disable-next-line react/button-has-type
                cell: (row) => (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle
                                as="a"
                                variant="success"
                                id="dropdown-basic"
                                className="setting-box"
                            >
                                <PiGearBold size={16} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {userData.access.isDelete ? (
                                    <Dropdown.Item
                                        onClick={() => onDelete(row.cityId, row.isActive)}
                                        className="fz-2"
                                    >
                                        {row.isActive ? (
                                            <div>
                                                <LiaUserSlashSolid color="red" className="user-icon" />
                                                <span style={{ color: "red" }}>Inactivate</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <LiaUserSolid color="green" className="user-icon" />
                                                <span style={{ color: "green" }}>Activate</span>
                                            </div>
                                        )}
                                    </Dropdown.Item>
                                ) : (
                                    ""
                                )}
                                {row.isActive ? (
                                userData.access.isEdit ? (
                                    <Dropdown.Item
                                        onClick={() => onEdit(row.cityId)}
                                        className="fz-2"
                                    >
                                        <PiNotePencilBold className="user-icon " />
                                        Edit City
                                    </Dropdown.Item>
                                ) : ""
                                ) : null}

                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                ),
            },
        ],
        []
    );
    const getStatusText = (row) => {
        return row.isActive ? "Active" : "Inactive";
    };
    // Function to get the client name
    const getClientName1 = (row) => {
        return row.clientId ? row.clientName : "N/A";
    };
    // Function to get a shortened version of the client name for display
    const getShortenedClientName = (row) => {
        const clientName = getClientName1(row);
        return clientName.length > 20 ? `${clientName.slice(0, 20)}...` : clientName;
    };
    const handelCountryName = (data) => {
        setClientId(data.target.value.value);
        getAllPRovinceDD(data.target.value.value);

    };
    const handlePageChange = (page) => {
        fetchCity(page);
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        fetchCity(page, newPerPage);
        setPerPage(newPerPage);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value.value); // Update the status when the select input changes
    };

    const handleDesignationId = (data) => {
        setDesignationId(data);
        getcityDD(data)
    };
    const handlecity = (data) => {
        setCityId(data);
    };

    const handleCloseRoleModal = () => {
        setShowaDesignationModal(false);
        fetchCity(1);
    };

    const handleCloseDesignationEditModal = () => {
        setShowdesignationEditModal(false);
        fetchCity(currentPage);
    };

    const onDelete = (id, active) => {
        Swal.fire({
            title: "Please confirm",
            text:
                " Do you want to " +
                (active ? "inactivate" : "activate") +
                " this city?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: active ? "Inactivate" : "Activate",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                let formData = new FormData();
                formData.append("cityId", id);
                axiosInstance
                    .post("city/activeAndDeactivateCity", formData, {
                        headers: headersForJwt,
                    })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title:
                                "City successfully " +
                                (active ? "inactivate" : "activate"),
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        fetchCity(currentPage);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title:
                                "City " +
                                (active ? "Inactivate" : "Activate") +
                                " failed",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };

    const onEdit = (id) => {
        const toastId = toast.loading("Loading...");
        let formData = new FormData();
        formData.append("cityId", id);
        axiosInstance
            .post("city/getCityById", formData, { headers: headersForJwt })
            .then((res) => {
                if (res.data.status === 1) {
                    toast.dismiss();
                    setDesignationDetails(res.data.data.list);
                    setShowdesignationEditModal(true);
                } else {
                    ErrorToastWithToastId("Action Failed..", toastId);
                }
            })
            .catch((err) => {
                ErrorToastWithToastId("Action Failed..", toastId);
            });
    };

    const resetFilter = () => {
        setDesignationId([]);
        setClientId([]);
        setCityId([]);
        setStatus([]);
        reset({ designationId, clientId, cityId, status });
        getcityDD1();
        setTimeout(() => {
            fetchCity(1, 10, "", "");
        }, 1000);
    };

    const addDesignation = {
        showDesignationModal,
        handleCloseRoleModal,
        handlePageChange,
        setFullPageLoading,
    };

    const editDesigantaionProps = {
        showdesignationEditModal,
        handleCloseDesignationEditModal,
        DesignationDetails,
        handlePageChange,
        setFullPageLoading,
    };

    const RoleListProps = {
        data,
        columns,
        loading,
        totalRows,
        currentPage,
        handlePerRowsChange,
        handlePageChange,
    };
    const optionsForStatus = [
        { value: "", label: "Status", isDisabled: true },
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
    ];

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            search here
        </Tooltip>
    );
    const resetTooltip = (props) => (
        <Tooltip id="button-rest" {...props}>
            Reset
        </Tooltip>
    );

    return (
        <>
            <Helmet title={"Role | IAQ Reporting System"} />
            {isFullPageLoading && <CircularLoader />}
            <Toaster position="top-center" reverseOrder={false} />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mt-2">
                            <div className="col-sm-3 pd-l-0">
                                {/* <p>Hi, Welcome  to Role Panel</p> */}
                                <h5 className="m-0 mt-3 mb-4">City Management</h5>
                            </div>
                            <div className="col-sm-12 mt-2 pd-r-0">
                                {/* <Form  
                  className="mt-4 mb-4"
                  // onSubmit={handleSubmit(searchSubmit)}
                > */}
                                <div className="user-info mb-4">


                                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                                        <h6 className="label-search">Select Country</h6>
                                        <Controller
                                            control={control}
                                            name="clientId"
                                            {...register("clientId", {
                                                onChange: (data) => handelCountryName(data),
                                            })}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={CountryName}
                                                        placeholder="Country Name"
                                                        name="clientId"
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                                        <h6 className="label-search">Select Province</h6>
                                        <Controller
                                            control={control}
                                            name="designationId"
                                            {...register("designationId")}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={province}
                                                        placeholder="Province Name"
                                                        name="designationId"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleDesignationId(e.value);
                                                        }}
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                                        <h6 className="label-search">Select City</h6>
                                        <Controller
                                            control={control}
                                            name="cityId"
                                            {...register("cityId")}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={cityname}
                                                        placeholder="City Name"
                                                        name="cityId"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handlecity(e.value);
                                                        }}
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                                        <h6 className="label-search">Select Status</h6>
                                        <Controller
                                            control={control}
                                            name="status"
                                            {...register("status", {
                                                onChange: (data) => handleStatusChange(data),
                                            })}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={optionsForStatus}
                                                        placeholder="Status"
                                                        name="status"
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}
                                    >
                                        <button
                                            type="submit"
                                            ref={submitButtonRef}
                                            onClick={() => fetchCity(1)}
                                            className="btn btn-white"
                                        >
                                            <RxMagnifyingGlass />
                                        </button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={resetTooltip}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-white ms-2"
                                            onClick={() => resetFilter()}
                                        >
                                            <RxReset />
                                        </button>
                                    </OverlayTrigger>



                                    {/* <div className="user-info-inner-1 col-lg-2 col-md-12 pd-0">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(event) => handlePerRowsChange(event.target.value, 1)}
                    >
                      <option value={10} defaultValue={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div> */}
                                    {userData.access.isAdd ? (
                                        <button
                                            onClick={() => setShowaDesignationModal(true)}
                                            className="btn btn-primary fz-14"
                                        >
                                            Add City
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                {/* <div className="user-info">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      control={control}
                      name="roleId"
                      {...register("roleId")}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={roles}
                            placeholder="Select Role Name"
                            name="roleId"
                            clearButton
                          />
                        </>
                      )}

                    />
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[{ label: "Active", value: "active" }]}
                        />
  )}
                    />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={resetFilter}>Reset</button>
                  </form>
                </div> */}
                                {/* </Form> */}
                            </div>
                        </div>
                    </div>
                </div>

                <CommonDataTable {...RoleListProps} />
                <AddCity
                    {...addDesignation}
                    onHide={() => setShowaDesignationModal(false)}
                />
                <EditCity
                    {...editDesigantaionProps}
                    onHide={() => setShowdesignationEditModal(false)}
                />
            </div>
        </>
    );
}
export default DesignationList;
