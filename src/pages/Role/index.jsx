/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo } from "react";

import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddRole, EditRole } from "./roleHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { PiGearBold, PiNotePencilBold } from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { Dropdown } from "react-bootstrap";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
} from "../../util/customToast/index";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';

function RoleList() {
  const [userData, setUserData] = useRecoilState(userAtom);
  const { register, handleSubmit, control, reset } = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRoleEditModal, setShowRoleEditModal] = useState(false);
  const [status, setStatus] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roleDetails, setRoleDetails] = useState('');



  const getAllRoleDD = async () => {
    axiosInstance
      .post("master/getAllRoleDD", [], { headers: headersForJwt })
      .then((res) => {
        // setRoles(res.data.data.list);
        const data = [
          { value: '', label: 'Select Role Name' },
          ...res.data.data.list.map(item => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setRoles(data);
      })
      .catch((err) => {
      });
  };

  const fetchRoles = async (page, size = perPage, statu = status, role = roleId) => {
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    if (statu != '')
      formData.append("status", statu);
    if (role != '')
      formData.append("roleId", role);
    axiosInstance
      .post("master/getAllRoleList", formData, { headers: headersForJwt })
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
    getAllRoleDD();
    fetchRoles(1);
  }, []);


  const columns = useMemo(
    () => [
      {
        name: "Sl no",
        width: "8%",
        selector: row => row.slNo,
        sortable: true,
      },
      {
        name: "Role Name",
        width: "15%",
        selector: row => row.name,
        sortable: true,
        // sortFunction: (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }),
      },
      {
        name: "Can View?",
        selector: row => row.isView,
        sortable: true,
        cell: (row) => (row.isView ? "Yes" : "No")
      },
      {
        name: "Can Add?",
        selector: row => row.isAdd,
        sortable: true,
        cell: (row) => (row.isAdd ? "Yes" : "No")
      },
      {
        name: "Can Edit?",
        selector: row => row.isEdit,
        sortable: true,
        cell: (row) => (row.isEdit ? "Yes" : "No")
      },
      {
        name: "Can Download?",
        selector: row => row.isDownload,
        sortable: true,
        cell: (row) => (row.isDownload ? "Yes" : "No")
      },
      {
        name: "Can Delete?",
        selector: row => row.isDelete,
        sortable: true,
        cell: (row) => (row.isDelete ? "Yes" : "No")
      },
      {
        name: "Status",
        selector: row => row.isActive,
        sortable: true,
        cell: (row) => (
          <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
            {row.isActive  ? "Active" : "Inactive"}
          </div>

        ),
      },
      {
        name: "Action",
        width: "5%",
        // eslint-disable-next-line react/button-has-type
        cell: (row) => <>
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
            ):""}
            {userData.access.isEdit ? (
              <Dropdown.Item onClick={() => onEdit(row.id)} className="fz-2">
                <PiNotePencilBold className="user-icon " />
                Edit Role
              </Dropdown.Item>
            ):""}
              {/* <Dropdown.Item onClick={() => onView(row.id)} className="fz-2">
                  <PiEyeBold className="user-icon" /> View User
                </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </>,
      },
    ],
    []
  );

  const handlePageChange = (page) => {
    fetchRoles(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchRoles(page, newPerPage);
    setPerPage(newPerPage);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status when the select input changes
  };

  const handleRoleChange = (data) => {
    setRoleId(data); // Update the RoleId when the select input changes
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    fetchRoles(1);
  };

  const handleCloseRoleEditModal = () => {
    setShowRoleEditModal(false);
    fetchRoles(currentPage);
  };

  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text: " Do you want to " + (active ? "inactivate" : "activate") + " this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: (active ? "Inactive" : "Active"),
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        let formData = new FormData();
        formData.append("id", id);
        axiosInstance
          .post("master/activateAndDeactivateRole", formData, { headers: headersForJwt })
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: "Role successfully " + (active ? "Inactivated" : "Activated"),
              showConfirmButton: false,
              timer: 2000
            });
            fetchRoles(currentPage);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            Swal.fire({
              icon: 'error',
              title: "Role " + (active ? "Inactivated" : "Activated") + " failed",
              showConfirmButton: false,
              timer: 2000
            })
          });
      }
    });
  };

  const onEdit = (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("roleId", id);
    axiosInstance
      .post("master/getRoleById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          toast.dismiss();
          setRoleDetails(res.data.data.list);
          setShowRoleEditModal(true);
        } else {
          ErrorToastWithToastId("Action Failed..", toastId);
        }
      })
      .catch((err) => {
        ErrorToastWithToastId("Action Failed..", toastId);
      });
  };

 

  const resetFilter = () => {
    setRoleId("");
    setStatus("");
    reset({ roleId, status });
    setTimeout(() => {
      fetchRoles(1, 10, '', '');
    }, 1000);


  }


  const addRoleProps = {
    showRoleModal,
    handleCloseRoleModal,
    roles,
    handlePageChange
  };

  const editRoleProps = {
    showRoleEditModal,
    handleCloseRoleEditModal,
    roleDetails,
    handlePageChange,
  };


  const RoleListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange
  };

  return (
    <>
      <Helmet title={"Role | IAQ Reporting System"} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-3 pd-l-0">
                {/* <p>Hi, Welcome  to Role Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Role Management</h5>
              </div>
              <div className="col-sm-9 pd-r-0">
                {/* <Form  
                  className="mt-4 mb-4"
                  // onSubmit={handleSubmit(searchSubmit)}
                > */}
                <div className="user-info mb-4">
                  <div className="user-info-inner col-lg-4 col-md-12 pd-0">
                    <h6 className="label-search">Select Role Name</h6>
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
                            onChange={(e) => {
                              field.onChange(e);
                              handleRoleChange(e.value);
                            }}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="user-info-inner-1 col-lg-2 col-md-12 pd-0">
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
                  </div>
                  <button className="btn btn-white" onClick={() => fetchRoles(1)}>
                    <RxMagnifyingGlass />
                  </button>
                  <button className="btn btn-white" onClick={() => resetFilter()}>

                    <RxReset />
                  </button>
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
                    onClick={() => setShowRoleModal(true)}
                    className="btn btn-primary fz-14"
                  >
                    Add Role
                  </button>
                  ):""}
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
        <AddRole {...addRoleProps} onHide={() => setShowRoleModal(false)} />
        <EditRole {...editRoleProps} onHide={() => setShowRoleEditModal(false)} />
      </div>
    </>
  );
}
export default RoleList;
