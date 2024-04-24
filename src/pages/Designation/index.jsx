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
import { AddDesignation, EditDesignation } from "./designationHelper";
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
    const [clientId, setClientId] = useState("");
    const [DesignationDetails, setDesignationDetails] = useState("");
    const [ClientName, setClientName] = useState("");
    const submitButtonRef = useRef(null);
    const getAllDesignationDD = async () => {
        axiosInstance
            .post("master/getAllDesignationDD", [], { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Designation Name", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.id.toString(), // Convert id to string, if needed
                        label: item.name,
                    })),
                ];
                setDesignation(data);
            })
            .catch((err) => {
            });
    };

    const getClientName = async (value) => {
        await axiosInstance
            .post("client/getAllClientDD", [], { headers: headersForJwt })
            .then((res) => {
                const data = [
                    { value: "", label: "Select Client Name", isDisabled: true },
                    ...res.data.data.list.map((item) => ({
                        value: item.clientId.toString(), // Convert id to string, if needed
                        label: item.clientName,
                    })),
                ];
                setClientName(data);
            })
            .catch((err) => { });
    };

    const fetchDesignation = async (
        page,
        size = perPage,
        statu = status,
        designation = designationId,
        client = clientId
    ) => {
        let formData = new FormData();
        formData.append("page", page - 1);
        formData.append("size", size);
        formData.append("sortBy", "id");
        formData.append("sortOrder", "DESC");
        let userid = JSON.parse(localStorage.getItem("user"));
        formData.append("userId", userid.userDetails.userId);

        if (statu != null) formData.append("status", statu);
        if (designation != "") formData.append("designationId", designationId);
        if (client != "") formData.append("clientId", clientId);

        axiosInstance
            .post("master/getAllDesignationList", formData, {
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
        getClientName();
        getAllDesignationDD();
        fetchDesignation(1);
    }, []);

    const columns = useMemo(
        () => [
            {
                name: "Sl no",
                width: "15%",
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
                name: "Designation Name",
                width: "25%",
                selector: (row) => row.name,
                sortable: false,
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-top-${row.name}`}>{row.name}</Tooltip>}
                    >
                        <span className="mg-b-0">{row.name}</span>
                    </OverlayTrigger>
                ),
            },
            // {
            //     name: "Is Client",
            //     width: "25%",
            //     cell: (row) => (row.clientId ? "True" : "False"),
            //     sortable: false,

            // },
            {
                name: "Client Name",
                width: "20%",
                cell: (row) => (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-client-name-${row.id}`}>{getClientName1(row)}</Tooltip>}
                    >
                        <div>{getShortenedClientName(row)}</div>
                    </OverlayTrigger>
                ),
                sortable: false,
            },

            {
                name: "Status",
                selector: (row) => row.isActive,
                width: "20%",
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
                                        onClick={() => onDelete(row.id, row.isActive)}
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
                                            onClick={() => onEdit(row.id)}
                                            className="fz-2"
                                        >
                                            <PiNotePencilBold className="user-icon " />
                                            Edit Designation
                                        </Dropdown.Item>
                                    ) : ""
                                ) : null}
                                {/* <Dropdown.Item onClick={() => onView(row.id)} className="fz-2">
                  <PiEyeBold className="user-icon" /> View User
                </Dropdown.Item> */}
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
    const handelClientName = (data) => {
        setClientId(data.target.value.value);
    };
    const handlePageChange = (page) => {
        fetchDesignation(page);
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        fetchDesignation(page, newPerPage);
        setPerPage(newPerPage);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value.value); // Update the status when the select input changes
    };

    const handleDesignationId = (data) => {
        setDesignationId(data); // Update the RoleId when the select input changes
    };

    const handleCloseRoleModal = () => {
        setShowaDesignationModal(false);
        fetchDesignation(1);
    };

    const handleCloseDesignationEditModal = () => {
        setShowdesignationEditModal(false);
        fetchDesignation(currentPage);
    };

    const onDelete = (id, active) => {
        Swal.fire({
            title: "Please confirm",
            text:
                " Do you want to " +
                (active ? "inactivate" : "activate") +
                " this record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: active ? "Inactivate" : "Activate",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                let formData = new FormData();
                formData.append("id", id);
                axiosInstance
                    .post("master/activeAndDeactivateDesignation", formData, {
                        headers: headersForJwt,
                    })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title:
                                "Designation successfully " +
                                (active ? "Inactivate" : "Activate"),
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        fetchDesignation(currentPage);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title:
                                "Designation " +
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
        formData.append("id", id);
        axiosInstance
            .post("master/getDesignationById", formData, { headers: headersForJwt })
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
        setStatus([]);
        reset({ designationId, clientId, status });
        setTimeout(() => {
            fetchDesignation(1, 10, "", "");
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
                                <h5 className="m-0 mt-3 mb-4">Designation Management</h5>
                            </div>
                            <div className="col-sm-12 mt-2 pd-r-0">
                                {/* <Form  
                  className="mt-4 mb-4"
                  // onSubmit={handleSubmit(searchSubmit)}
                > */}
                                <div className="user-info mb-4">
                                    <div className="user-info-inner col-lg-3 col-md-12 pd-0">
                                        <h6 className="label-search">Select Designation</h6>
                                        <Controller
                                            control={control}
                                            name="designationId"
                                            {...register("designationId")}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={designation}
                                                        placeholder="Designation"
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
                                    <div className="user-info-inner col-lg-3 col-md-12 pd-0">
                                        <h6 className="label-search">Select Client Name</h6>
                                        <Controller
                                            control={control}
                                            name="clientId"
                                            {...register("clientId", {
                                                onChange: (data) => handelClientName(data),
                                            })}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        size="sm"
                                                        options={ClientName}
                                                        placeholder="Client Name"
                                                        name="clientId"
                                                        // value={selectedClient}
                                                        clearButton
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                    {/* <div className="user-info-inner col-lg-3 col-md-12 pd-0">
                                        <h6 className="label-search">Select Status</h6>
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            name="status"
                                            id="status"
                                            value={status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value={''}>Status</option>
                                            <option value={true}>Activate</option>
                                            <option value={false}>Inactivate</option>
                                        </select>

                                    </div> */}

                                    <div className="user-info-inner col-lg-3 col-md-12 pd-0">
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
                                            onClick={() => fetchDesignation(1)}
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
                                            Add Designation
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
                <AddDesignation
                    {...addDesignation}
                    onHide={() => setShowaDesignationModal(false)}
                />
                <EditDesignation
                    {...editDesigantaionProps}
                    onHide={() => setShowdesignationEditModal(false)}
                />
            </div>
        </>
    );
}
export default DesignationList;
