/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";

import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddEditModal, UploadCSVModal } from "./UploadCSVHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { useNavigate } from "react-router-dom";
import {
    PiTrashBold,
    PiGearBold,
    PiPenBold,
    PiNotePencilBold,
    PiEyeBold,
} from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { Dropdown } from "react-bootstrap";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import {
    ErrorToastWithToastId,
    SuccessToastWithToastId,
} from "../../util/customToast/index";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import enIN from 'date-fns/locale/en-IN';
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function CsvList(props) {
    const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
    const submitButtonRef = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useRecoilState(userAtom);


    // const [dateRange, setDateRange] = useState([null, null]);
    // const [startDate, endDate] = dateRange;
    // const userData = JSON.parse(localStorage.getItem("user"));
    const { type, clickedClientId, viewType, parentName, clickedBuildingId, clickedJobId } =
        props;


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);
    // const [status, setStatus] = useState('');
    const [projectNumber, setProjectNumber] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [filterStartDate, filterEndDate] = dateRange;
    const [filterCountry, setFilterCountry] = useState("");
    const [filterProvince, setFilterProvince] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterClient, setFilterClient] = useState("");
    const [filterProjectNumber, setFilterProjectNumber] = useState("");
    const [resetFlag, setResetFlag] = useState(false);

    const [Country, setCountry] = useState([]);
    const [CountryAll, setCountryAll] = useState("");
    const [Provience, setProvience] = useState([]);
    const [city, setcity] = useState([]);
    const [ClientName, setClientName] = useState([]);
    const [editData, setEditData] = useState("");

    const globalFilters = useRef({});
    const globalPage = useRef(1);
    const globalPerPage = useRef(perPage);
    const [countryId, setCountryId] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [clientId, setClientId] = useState("");



    const { register, handleSubmit, control, reset, getValues, setValue } =
        useForm();

    const fetchCsvList = async (page = globalPage.current, size = globalPerPage.current, jobId = filterProjectNumber, startDate = filterStartDate, endDate = filterEndDate) => {

        setLoading(true);
        let formData = new FormData();
        formData.append("page", page - 1);
        formData.append("size", size);
        formData.append("sortBy", "id");
        formData.append("sortOrder", "DESC");
        // if (jobId !== "") formData.append("jobId", jobId);

        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        // if (getValues('filterProjectNumber').value) formData.append("shortCodeId", getValues('filterProjectNumber').value);
        // if (getValues('filterStatus')) formData.append("status", getValues('filterStatus').value);
        if (userData !== "") formData.append("userId", userData.userDetails.userId);
        // if (clientId !== "") {
        //     formData.append("clientId", clientId);
        // }
        // if (cityId !== "") {
        //     formData.append("cityId", cityId);
        // }
        // if (provinceId !== "") {
        //     formData.append("provinceId", provinceId);
        // }
        // if (countryId !== "") {
        //     formData.append("provinceId", countryId);
        // }
        if (globalFilters.current.clientId) {
            formData.append("clientId", globalFilters.current.clientId);
        }

        if (globalFilters.current.cityId) {
            formData.append("cityId", globalFilters.current.cityId);
        }
        if (globalFilters.current.provinceId) {
            formData.append("provinceId", globalFilters.current.provinceId);
        }
        if (globalFilters.current.countryId) {
            formData.append("countryId", globalFilters.current.countryId);
        }
        if (globalFilters.current.jobId) {
            formData.append("jobId", globalFilters.current.jobId);
        }

        if (startDate !== null) formData.append("startDate", format(startDate, 'yyyy-MM-dd', { locale: enIN }));
        if (endDate !== null) formData.append("endDate", format(endDate, 'yyyy-MM-dd', { locale: enIN }));

        if (globalFilters.current.status != null) {
            formData.append("status", globalFilters.current.status);
        }
        axiosInstance
            .post("csv/getCsvList", formData, { headers: headersForJwt })
            .then((res) => {
                console.log("csv list is ->", res.data.data.list);
                setData(res.data.data.list);
                setTotalRows(res.data.data.totalItems);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(true);
            });
    };
    const searchSubmit = async (data) => {
        console.log(data);
        setLoading(true);
        const filters = {};

        if (data.filterCountry && data.filterCountry.value !== "") {
            filters.countryId = data.filterCountry.value;
        }
        if (data.filterProvince && data.filterProvince.value !== "") {
            filters.provinceId = data.filterProvince.value;
        }
        if (data.filterCity && data.filterCity.value !== "") {
            filters.cityId = data.filterCity.value;
        }

        if (data.filterClient && data.filterClient.value !== "") {
            filters.clientId = data.filterClient.value;
        }

        if (data.filterProjectNumber && data.filterProjectNumber.value !== "") {
            filters.jobId = data.filterProjectNumber.value;
        }
        if (data.status && data?.status?.value !== "") {
            filters.status = data.status.value;
        }
        globalFilters.current = filters;
        // Reset page to 1 and fetch data
        globalPage.current = 1;
        setCurrentPage(1);
        fetchCsvList(1);
    };

    const resetFilter = () => {
        const fieldsToReset = {
            status: "",
            countryId: "",
            provinceId: "",
            cityId: "",
            clientId: "",
            jobId: "",
            filterCountry: "",
            filterProvince: "",
            filterCity: "",
            filterClient: "",
            filterProjectNumber: "",
            // Add other fields you want to reset here
        }
        setCountry([]);
        setProvience([]);
        setcity([]);
        setProjectNumber([]);
        setDateRange([null, null]);

        reset(fieldsToReset);

        globalFilters.current = { ...fieldsToReset };
        getAllProjectNumberDD();
        fetchCsvList(1);
    };
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

    useEffect(() => {
        getClientName();
        getAllProjectNumberDD();
        if (clickedJobId) {
            getAllProjectNumberDD();
        }
        // getAllProjectNumberDD();
        fetchCsvList(1);
        // fetchCsvList(1, 10, "");
        // getCountry();
    }, []);



    const columns = useMemo(
        () => [
            {
                name: "Sl no",
                width: "8%",
                selector: (row) => row.slNo,
                sortable: true,
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
                name: "Client Name",
                selector: (row) => row.clientName,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.clientName}`}>{row.clientName}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.clientName}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "CSV Name",
                minWidth: "30%",
                selector: (row) => row.uploadedFilename ? row.uploadedFilename : "N/A",
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-csv-${row.id}`}>{getCSVName(row)}</Tooltip>}
                    >
                        <div>{getShortenedCSVName(row)}</div>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Job Project Number",
                minWidth: "10%",
                selector: (row) => row.projectNumber,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.projectNumber}`}>{row.projectNumber}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.projectNumber}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Last Test Date",
                selector: (row) => row.testDateChar,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.testDateChar}`}>{row.testDateChar}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.testDateChar}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Status",
                selector: "isActive",
                filter: 'text',
                // minWidth: "20%",
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
                width: "6%",
                // eslint-disable-next-line react/button-has-type
                cell: (row) => (
                    <Dropdown >
                        <Dropdown.Toggle
                            as="a"
                            variant="success"
                            id="dropdown-basic"
                            className="setting-box"
                        >
                            <PiGearBold size={16} />
                        </Dropdown.Toggle>
                        {row.isActive && (
                            <Dropdown.Menu className="custom-dropdown-menu-position">
                                {userData.access.isDelete ? (

                                    <Dropdown.Item
                                        onClick={() => onDelete(row.jobId)}
                                        className="fz-2"
                                    >
                                        <div>
                                            <LiaUserSlashSolid color="red" className="user-icon" />
                                            <span style={{ color: "red" }}>Inactivate</span>
                                        </div>

                                    </Dropdown.Item>

                                ) : ""}




                                {/* {userData.access.isEdit ? (
                                  <Dropdown.Item onClick={() => onEdit(row.id)} className="fz-2">
                                 <PiNotePencilBold className="user-icon " />
                                       Edit User
                               </Dropdown.Item>
                                   ):""} */}
                                {/* {userData.access.isView ? (
                               <Dropdown.Item onClick={() => onView(row.id)} className="fz-2">
                                <PiEyeBold className="user-icon" /> View User
                              </Dropdown.Item>
                                              ):""} */}
                            </Dropdown.Menu>
                        )}
                    </Dropdown>
                ),
            },

        ],
        []
    );
    // Function to get the full CSV name
    const getCSVName = (row) => {
        return row.uploadedFilename || "N/A";
    };
    // Function to get a shortened version of the CSV name for display
    const getShortenedCSVName = (row) => {
        const csvName = getCSVName(row);
        return csvName.length > 20 ? `${csvName.slice(0, 20)}...` : csvName;
    };
    const getStatusText = (row) => {
        return row.isActive ? "Active" : "Inactive";
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
        globalPage.current = page;
        fetchCsvList(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        globalPage.current = page;
        globalPerPage.current = newPerPage;
        fetchCsvList(page, newPerPage);
    };


    const handleCloseShortcodeModal = () => {
        setEditData("");
        // setShowAddShortcodeModal(false);
        // setShowShortcodeEditModal(false);
        fetchCsvList(1);
    };



    const getCountry = async () => {
        let formData = new FormData();
        if (clickedClientId) {
            formData.append("clientId", clickedClientId);
        }
        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        if (globalFilters.current && globalFilters.current.clientId) {
            formData.append("clientId", globalFilters.current.clientId);
        }
        await axiosInstance
            .post("client/getAllCountryDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data1 = [
                    { value: "", label: "Select Country", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.countryId.toString(), // Convert id to string, if needed
                        label: item.countryName,
                    })),
                ];
                setCountry(data1);
                // console.log(data1);
            })
            .catch((err) => { });
    };

    const getProvienced = async (value) => {
        // console.log(value);
        let formData = new FormData();
        // if (value !== null) {
        //     formData.append("countryId", value);
        // }
        if (value !== null) {
            formData.append("countryId", value);
        }
        if (clickedClientId) {
            formData.append("clientId", clickedClientId);
        }
        if (globalFilters.current.clientId) {
            formData.append("clientId", globalFilters.current.clientId);
        }
        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        formData.append("clientId", globalFilters.current?.clientId ?? "");
        await axiosInstance
            .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: " Province", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.provinceId.toString(), // Convert id to string, if needed
                        label: item.provinceName,
                    })),
                ];
                setProvience(data);
            })
            .catch((err) => { });
    };

    const getCity = async (value) => {
        let formData = new FormData();
        if (value !== null) {
            formData.append("provinceId", value);
        }
        if (globalFilters.current.clientId) {
            formData.append("clientId", globalFilters.current.clientId);
        }
        if (clickedClientId) {
            formData.append("clientId", clickedClientId);
        }
        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        formData.append("clientId", globalFilters.current?.clientId ?? "");
        await axiosInstance
            .post("client/getAllCityDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select City", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.cityId.toString(), // Convert id to string, if needed
                        label: item.cityName,
                    })),
                ];
                setcity(data);
            })
            .catch((err) => { });
    };

    const getClientName = async (value) => {
        let formData = new FormData();
        if (clickedClientId) {
            formData.append("clientId", clickedClientId);
        }
        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        await axiosInstance
            .post("client/getAllClientDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Client", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.clientId.toString(), // Convert id to string, if needed
                        label: item.clientName,
                    })),
                ];

                setClientName(data);
            })
            .catch((err) => { });
    };

    const getAllProjectNumberDD = async () => {
        let formData = new FormData();

        formData.append('userId', Number(userData.userDetails.userId));
        formData.append('isCsvUploaded', true);
        if (clickedJobId) {
            formData.append("jobId", clickedJobId);
        }
        else {
            formData.append("jobId", -1);
        }
        formData.append("clientId", globalFilters.current?.clientId ?? "");
        axiosInstance
            .post("client/getAllJobDD", formData, { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Project", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.id.toString(), // Convert id to string, if needed
                        label: item.projectNumber,
                    })),
                ];
                setProjectNumber(data);
            })
            .catch((err) => { });
    };

    const onDelete = (id) => {
        Swal.fire({
            title: "Please confirm",
            text: " Do you want to inactive this record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Inactivate",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                let formData = new FormData();
                formData.append("jobId", id);
                formData.append("userId", userData.userDetails.userId);
                axiosInstance
                    .post("csv/deactiveCSV", formData, { headers: headersForJwt })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title: "CSV deactivated successfully",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        fetchCsvList();
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title: "CSV deactivation failed",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };


    const handelCountryChange = (data) => {
        globalFilters.current = {
            ...globalFilters.current,
            countryId: data.target.value.value
        };
        setCountryId(data.target.value.value);
        getProvienced(data.target.value.value)
    }
    const handelProvienceChange = (data) => {
        globalFilters.current = {
            ...globalFilters.current,
            provinceId: data.target.value.value
        };
        setProvinceId(data.target.value.value);
        getCity(data.target.value.value);
    }
    const handelCityName = (data) => {
        globalFilters.current = {
            ...globalFilters.current,
            cityId: data.target.value.value
        };
        setCityId(data.target.value.value);
        setClientId("");
        setValue("filterProjectNumber", "");
        getAllProjectNumberDD();
    }
    const handelClientName = (data) => {
        console.log(data);
        globalFilters.current = {
            ...globalFilters.current,
            clientId: data.target.value.value,
        };
        setValue("filterCountry", "");
        setValue("filterProvince", "");
        setValue("filterCity", "");
        setValue("filterProjectNumber", "");
        setDateRange([null, null]);
        setFilterClient(data); // Update the ClientId when the select input changes
        getCountry()
        setClientId(data.target.value.value);

    }
    const handleProjectNumberChange = (data) => {
        console.log(data);
        globalFilters.current = {
            ...globalFilters.current,
            jobId: data.value
        };
        setFilterProjectNumber(data); // Update the ClientId when the select input changes
        // const dd=getValues('filterProjectNumber');
    };
    const resetDD = async () => {
        getAllProjectNumberDD();
    };

    const addShortcodeProps = {
        // showAddShortcodeModal,
        // showEditJobModal,
        // handleCloseShortcodeModal,
        editData,
    };

    const editShortcodeProps = {
        // showAddShortcodeModal,
        // showShortcodeEditModal,
        // handleCloseShortcodeModal,
        editData,
    };

    const csvListProps = {
        data,
        columns,
        loading,
        totalRows,
        currentPage,
        handlePerRowsChange,
        handlePageChange,

        // perPage
    };
    const handleCloseCsvUploadModal = () => {
        setShowCsvUploadModal(false);
    };
    // const uploadCSVModalprops = {  
    //     showCsvUploadModal,
    //     handleCloseCsvUploadModal,

    // };

    const optionsForStatus = [
        { value: '', label: 'Select Status', isDisabled: true },
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' },
    ];

    return (
        <>
        
            {!clickedJobId ? <Helmet title={"Upload CSV Management | IAQ Reporting System"} /> : null}
            <Toaster position="top-center" reverseOrder={false} />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mt-2">
                            <div className="col-sm-9 pd-l-0">
                                {/* <p>Hi, Welcome to Shortcode Panel</p> */}
                                <h5 className="m-0 mt-3 mb-2">Uploaded CSV List</h5>
                            </div>
                            {viewType !== "ViewById" && userData.access.isAdd ? (
                                <div className="col-sm-3 pd-r-0">
                                    <button
                                        onClick={() => navigate("/uploadCSV/uploadcsvhelper")}
                                        className="btn btn-primary fz-14 float-end"
                                    >Upload CSV
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="col-lg-12 pd-0">
                                <Form className="mt-4 mb-4"
                                    onSubmit={handleSubmit(searchSubmit)}
                                >
                                    <div className="user-info-90 row">

                                        {clickedJobId ? null : (
                                            <>
                                                <div className="col-sm-3 col-12">
                                                    <h6 className="label-search">Select Client</h6>
                                                    <Controller
                                                        control={control}
                                                        name="filterClient"
                                                        {...register("filterClient", {
                                                            onChange: (data) => handelClientName(data)
                                                        })}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                size="sm"
                                                                options={ClientName}
                                                                placeholder="Client"
                                                                name="filterClient"
                                                                clearButton
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-sm-3 col-12">
                                                    <h6 className="label-search">Select Country</h6>
                                                    <Controller
                                                        control={control}
                                                        name="filterCountry"
                                                        {...register("filterCountry", {
                                                            onChange: (data) => handelCountryChange(data)
                                                        })}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                size="sm"
                                                                options={Country}
                                                                placeholder="Country"
                                                                name="filterCountry"
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-sm-3 col-12">
                                                    <h6 className="label-search">Select Province</h6>
                                                    <Controller
                                                        control={control}
                                                        name="filterProvince"
                                                        {...register("filterProvince", {
                                                            onChange: (data) => handelProvienceChange(data)
                                                        })}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                size="sm"
                                                                options={Provience}
                                                                placeholder="Province"
                                                                name="filterProvince"
                                                                clearButton
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-sm-3 col-12">
                                                    <h6 className="label-search">Select City</h6>
                                                    <Controller
                                                        control={control}
                                                        name="filterCity"
                                                        {...register("filterCity", {
                                                            onChange: (data) => handelCityName(data)
                                                        })}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                size="sm"
                                                                options={city}
                                                                placeholder="City Name"
                                                                name="filterCity"
                                                                clearButton
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* projectNumber */}
                                        <div className="col-sm-3 col-12 mt-4">
                                            <h6 className="label-search">Select Project Number</h6>
                                            <Controller
                                                control={control}
                                                name="filterProjectNumber"
                                                {...register("filterProjectNumber")}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={projectNumber}
                                                        placeholder="Project Number"
                                                        name="filterProjectNumber"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleProjectNumberChange(e.value);
                                                        }}
                                                        clearButton
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* date */}
                                        <div className="col-sm-3 col-12 mt-4">
                                            <div className="user-info-inner-1 w-100">
                                                <h6 className="label-search">Select Start-End Date</h6>
                                                <DatePicker
                                                    showIcon
                                                    selectsRange={true}
                                                    startDate={filterStartDate}
                                                    endDate={filterEndDate}
                                                    range
                                                    onChange={(update) => {
                                                        setDateRange(update);
                                                    }}
                                                    isClearable={true}
                                                    dateFormat="yyyy/MM/dd"
                                                    className="w-100"
                                                    placeholderText="Select Date"
                                                    locale="en-IN" // Set the locale to 'en-IN'
                                                />
                                            </div>
                                        </div>
                                        {/* status */}
                                        <div className="col-sm-3 col-12 mt-4">
                                            <h6 className="label-search">Select Status</h6>
                                            <Controller
                                                control={control}
                                                name="status"
                                                {...register("status")}
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

                                        <div className="col-sm-3 col-12 mt-4">
                                            <h6 className="label-search">Search/Reset</h6>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={renderTooltip}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleSubmit(searchSubmit)();
                                                    }}
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
                                        </div>

                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>

                <CommonDataTable {...csvListProps} />
                {/* <UploadCSVModal {...uploadCSVModalprops} /> */}

            </div>
        </>
    );
}
export default CsvList;
