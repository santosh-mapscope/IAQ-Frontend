/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";


import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddEditModal } from "./ShortcodesHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
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
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function ShortcodeList(props) {
    const [userData, setUserData] = useRecoilState(userAtom);
    // const [dateRange, setDateRange] = useState([null, null]);
    // const [startDate, endDate] = dateRange;
    // const userData = JSON.parse(localStorage.getItem("user"));
    const { type, clickedClientId, viewType, parentName, clickedBuildingId } =
        props;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const globalFilters = useRef({});
    const globalPage = useRef(1);
    const globalPerPage = useRef(perPage);
    const [roles, setRoles] = useState([]);
    const [showAddShortcodeModal, setShowAddShortcodeModal] = useState(false);
    const [showShortcodeEditModal, setShowShortcodeEditModal] = useState(false);
    const [showUploadCSVModal, setShowUploadCSVModal] = useState(false);
    const [status, setStatus] = useState('');
    const [shortcode, setShortcode] = useState([]);
    const [shortcodeDetails, setShortcodeDetails] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [filterStartDate, filterEndDate] = dateRange;

    const [filterShortcode, setFilterShortcode] = useState("");
    const [resetFlag, setResetFlag] = useState(false);

    const [editData, setEditData] = useState("");

    const { register, handleSubmit, control, reset, getValues, setValue } =
        useForm();


    const getAllShortcodeDD = async () => {
        axiosInstance
            .post("master/getShortcodeDD", [], { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Shortcode" },
                    ...res.data.data.list.map((item) => ({
                        value: item.id.toString(), // Convert id to string, if needed
                        label: item.name,
                    })),
                ];
                setShortcode(data);
            })
            .catch((err) => { });
    };


    const fetchShortcodes = async (page, size = perPage, shortCodeId = filterShortcode, active = status, startDate = filterStartDate, endDate = filterEndDate) => {
        setLoading(true);
        let formData = new FormData();
        formData.append("page", page - 1);
        formData.append("size", size);
        formData.append("sortBy", "id");
        formData.append("sortOrder", "DESC");
        if (shortCodeId !== "") formData.append("shortCodeId", shortCodeId);
        // if (getValues('filterShortcode').value) formData.append("shortCodeId", getValues('filterShortcode').value);
        if (getValues('filterStatus')) formData.append("status", getValues('filterStatus').value);
        if (userData !== "") formData.append("userId", userData.userDetails.userId);
        if (startDate !== null) formData.append("startDate", format(startDate, 'yyyy-MM-dd', { locale: enIN }));
        if (endDate !== null) formData.append("endDate", format(endDate, 'yyyy-MM-dd', { locale: enIN }));


        axiosInstance
            .post("shortcode/getShortcodeList", formData, { headers: headersForJwt })
            .then((res) => {
                setData(res.data.data.list);
                setTotalRows(res.data.data.totalItems);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(true);
            });
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
        getAllShortcodeDD();
        fetchShortcodes(1);
    }, []);

    const resetFilter = async () => {
        setFilterShortcode("");
        setValue('filterShortcode', '')
        setValue('filterStatus', '')
        setDateRange([null, null]);
        setResetFlag(true);
        resetDD();

    };

    useEffect(() => {
        if (resetFlag) {
            resetDD();
            fetchShortcodes(1, 10, "", "");
            setResetFlag(false);
        }
    }, [resetFlag]);


    const columns = useMemo(
        () => [
            {
                name: "Sl no",
                width: "6%",
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
                name: "id",
                width: "6%",
                selector: (row) => row.shortCodeId,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.shortCodeId}`}>{row.shortCodeId}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.shortCodeId}</span>
                    </OverlayTrigger>
                ),
            },
            // {
            //     name: "Shortcode Name",
            //     width: "8%",
            //     selector: (row) => row.shortCodeName,
            //     sortable: true,
            // },
            {
                name: "Shortcode Tag",
                width: "60%",
                selector: (row) => row.shortCodeTag,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.shortCodeTag}`}>{row.shortCodeTag}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.shortCodeTag}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Created Date",
                width: "8%",
                selector: (row) => row.createdOnChar,
                sortable: true,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.createdOnChar}`}>{row.createdOnChar}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.createdOnChar}</span>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Status",
                width: "8%",
                selector: (row) => row.status,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-status-${row.id}`}>{getStatusText(row)}</Tooltip>}
                    >
                        <div style={{ color: row.status ? "#0064FF" : "#F63F3F" }}>
                            {getStatusText(row)}
                        </div>
                    </OverlayTrigger>
                ),
            },
            {
                name: "Action",
                width: "5%",
                // eslint-disable-next-line react/button-has-type
                cell: (row) => (
                    <Dropdown>
                        <Dropdown.Toggle
                            as="a"
                            variant="success"
                            id="dropdown-basic"
                            className="setting-box"
                        >
                            <PiGearBold size={16} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="custom-dropdown-menu-position">
                            <Dropdown.Item
                                onClick={() => onDelete(row.shortCodeId, row.status)}
                                className="fz-2"
                            >
                                {row.status ? (
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
                            {row.status ? (
                                <Dropdown.Item onClick={() => onEdit(row.shortCodeId)} className="fz-2">
                                    <PiNotePencilBold className="user-icon " />
                                    Edit Shortcode
                                </Dropdown.Item>
                            ) : null}
                            {/* <Dropdown.Item onClick={() => onView(row.shortCodeId)} className="fz-2">
                  <PiEyeBold className="user-icon" /> View User
                </Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>
                ),
            },
        ],
        []
    );
    const getStatusText = (row) => {
        return row.status ? "Active" : "Inactive";
    };
   
    const handlePageChange = (page) => {
        // submitButtonRef.current.click();
        globalPage.current = page;
        setCurrentPage(page);
        fetchShortcodes(page);
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        // globalPerPage.current = newPerPage;
        setPerPage(newPerPage);
        globalPage.current = page;
        globalPerPage.current = newPerPage;
        fetchShortcodes(page, newPerPage);
    };
   
    const handleShortcodeChange = (data) => {
        setFilterShortcode(data); // Update the ClientId when the select input changes
        // const dd=getValues('filterShortcode');
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value); // Update the status when the select input changes
        // const dd = getValues('filterStatus').value
    };

    const handleCloseShortcodeModal = () => {
        setEditData("");
        setShowAddShortcodeModal(false);
        setShowShortcodeEditModal(false);
        fetchShortcodes(1);
    };


    const onDelete = (id, active) => {
        Swal.fire({
            title: "Please confirm",
            text: " Do you want to " + (active ? "inactivate" : "activate") + " this record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: active ? "Inactive" : "Active",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                let formData = new FormData();
                formData.append("shortcodeId", id);
                axiosInstance
                    .post("shortcode/deactivateShortcode", formData, { headers: headersForJwt })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title: "Shortcode successfully " + (active ? "Inactivate" : "Activate"),
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        fetchShortcodes();
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title: "Shortcode " + (active ? "Inactivate" : "Activate") + " failed",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };

    const onAdd = async () => {
        setShowAddShortcodeModal(true);
        setEditData(null);
    };

    const onEdit = async (id) => {
        const currentPage = globalPage.current;
        const toastId = toast.loading("Loading...");
        let formData = new FormData();
        formData.append("shortcodeId", id);
        formData.append("userId", userData.userDetails.userId);
        await axiosInstance
            .post("shortcode/getShortcodeById", formData, { headers: headersForJwt })
            .then((res) => {
                if (res.data.status === 1) {
                    toast.dismiss();
                    setEditData(res.data.data.list);
                    setShowShortcodeEditModal(true);
                } else {
                    ErrorToastWithToastId("Action Failed..", toastId);
                }
            })
            .catch((err) => {
                ErrorToastWithToastId("Action Failed..", toastId);
            });
    };

    const resetDD = async () => {
        getAllShortcodeDD();
    };

    const addShortcodeProps = {
        showAddShortcodeModal,
        // showEditJobModal,
        handleCloseShortcodeModal,
        editData,
    };

    const editShortcodeProps = {
        // showAddShortcodeModal,
        showShortcodeEditModal,
        handleCloseShortcodeModal,
        editData,
        currentPage,
    };

    const ShortcodeListProps = {
        data,
        columns,
        loading,
        totalRows,
        currentPage,
        handlePerRowsChange,
        handlePageChange,
        // perPage
    };
    const optionsForStatus = [
        { value: '', label: 'Select Status' },
        { value: true, label: 'Activate' },
        { value: false, label: 'Inactivate' },
    ];

    return (
        <>
            <Helmet title={"Shortcode Management | IAQ Reporting System"} />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mt-2">
                            <div className="col-sm-9 pd-l-0">
                                {/* <p>Hi, Welcome to Shortcode Panel</p> */}
                                <h5 className="m-0 mt-3 mb-2">Shortcodes</h5>
                            </div>
                            {viewType !== "ViewById" && userData.access.isAdd ? (
                                <div className="col-sm-3 pd-r-0">
                                    <button
                                        onClick={() => onAdd()}
                                        className="btn btn-primary fz-14 float-end"
                                    >Add Shortcodes
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="col-lg-12 pd-0">
                                <div className="user-info mt-4 mb-4">
                                    <div className="user-info-inner col-lg-7 col-md-12 pd-0">
                                        <h6 className="label-search">Select Shortcode</h6>
                                        <Controller
                                            control={control}
                                            name="filterShortcode"
                                            {...register("filterShortcode")}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    size="sm"
                                                    options={shortcode}
                                                    placeholder="Shortcode"
                                                    name="filterShortcode"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handleShortcodeChange(e.value);
                                                    }}
                                                    clearButton
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-12 pd-0">
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
                                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                                        <h6 className="label-search">Select Status</h6>
                                        <Controller
                                            control={control}
                                            name="filterStatus"
                                            {...register("filterStatus")}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={optionsForStatus}
                                                        placeholder="Select Status"
                                                        name="status"
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                        {/* <select
                                            {...register("filterStatus")}
                                            className="form-select"
                                            aria-label="Default select example"
                                            name="filterStatus"
                                        >
                                            <option value={""}>Status</option>
                                            <option value={true}>Active</option>
                                            <option value={false}>Inactive</option>
                                        </select> */}
                                    </div>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}
                                    >
                                        <button
                                            type="submit"
                                            onClick={() => fetchShortcodes(1)}
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
                                            className="btn btn-white"
                                            onClick={() => resetFilter()}
                                        >
                                            <RxReset />
                                        </button>
                                    </OverlayTrigger>

                                    {/* <div className="user-info-inner-1 ">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(event) =>
                          handlePerRowsChange(event.target.value, 1)
                        }
                      >
                        <option value={10} defaultValue={10}>
                          10
                        </option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CommonDataTable {...ShortcodeListProps} />
                <AddEditModal
                    {...addShortcodeProps}
                    onHide={() => setShowAddShortcodeModal(false)}
                />
                <AddEditModal
                    {...editShortcodeProps}
                    currentPage={currentPage}
                    onHide={() => setShowShortcodeEditModal(false)}
                />
            </div>
        </>
    );
}
export default ShortcodeList;
