/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo } from "react";

import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddRole, EditRole , AddEditModal} from "./menuHelper";
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

function MenuList() {
  const [userData, setUserData] = useRecoilState(userAtom);
  const { register, handleSubmit, control, reset } = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [Menus, setMenus] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [status, setStatus] = useState('');
  const [menuId, setMenuId] = useState('');
  const [menuDetails, setMenuDetails] = useState('');
  const [editData, setEditData] = useState("");



  const getAllMenuDD = async () => {
    let formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("isParent", false);
    axiosInstance
      .post("menu/getMenuDD", formData, { headers: headersForJwt })
      .then((res) => {
        // setMenus(res.data.data.list);
        const data = [
          { value: '', label: 'Select Menu Name' },
          ...res.data.data.list.map(item => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setMenus(data);
      })
      .catch((err) => {
      });
  };

  const fectchMenus = async (page, size = perPage, isActive = status, menu = menuId) => {
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    formData.append("userId", userData.userDetails.userId);
    // formData.append("roleId", userData.userDetails.roleId);
    if(menu !== ''){
      formData.append("menuId", menu);
    }
    
    if (isActive != '')
      formData.append("status", isActive);
    axiosInstance
      .post("menu/getMenuList", formData, { headers: headersForJwt })
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
    getAllMenuDD();
    fectchMenus(1);
  }, []);


  const columns = useMemo(
    () => [
      {
        name: "Sl no",
        // width: "8%",
        selector: row => row.slNo,
        sortable: true,
      },
      {
        name: "Menu Name",
        // width: "15%",
        selector: row => row.name,
        sortable: true,
        // sortFunction: (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }),
      },
      {
        name: "Module",
        // width: "15%",
        selector: row => row.module,
        sortable: true,
        // sortFunction: (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }),
      },
      {
        name: "Parent Menu Name",
        // width: "15%",
        selector: row => row.parentName,
        sortable: true,
        // sortFunction: (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }),
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
              <Dropdown.Item onClick={() => getMenuById(row.id)} className="fz-2">
                <PiNotePencilBold className="user-icon " />
                Edit Menu
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
    fectchMenus(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fectchMenus(page, newPerPage);
    setPerPage(newPerPage);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status when the select input changes
  };

  const handleMenuChange = (data) => {
    setMenuId(data); // Update the RoleId when the select input changes
  };

  const handleCloseAddEditModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    fectchMenus(currentPage);
    setEditData("");
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
        formData.append("menuId", id);
        formData.append("userId", userData.userDetails.userId);
        axiosInstance
          .post("menu/deactivateMenu", formData, { headers: headersForJwt })
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: "Menu successfully " + (active ? "Inactivate" : "Activate"),
              showConfirmButton: false,
              timer: 2000
            });
            fectchMenus(currentPage);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            Swal.fire({
              icon: 'error',
              title: "Menu " + (active ? "Inactivate" : "Activate") + " Failed",
              showConfirmButton: false,
              timer: 2000
            })
          });
      }
    });
  };

  const getMenuById = (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("menuId", id);
    formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("menu/getMenuById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          toast.dismiss();
          setEditData(res.data.data.list);
          setShowEditModal(true);
        } else {
          ErrorToastWithToastId("Action Failed..", toastId);
        }
      })
      .catch((err) => {
        ErrorToastWithToastId("Action Failed..", toastId);
     
      });
  };

 

  const resetFilter = () => {
    setMenuId("");
    setStatus("");
    reset({ menuId, status });
    setTimeout(() => {
      fectchMenus(1, 10, '', '');
    }, 1000);
  }


  const addMenuProps = {
    showAddModal,
    handleCloseAddEditModal,
    editData
  };

  const editMenuProps = {
    showEditModal,
    handleCloseAddEditModal,
    editData
  };


  const MenuListProps = {
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
      <Helmet title={"Menu | IAQ Reporting System"} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-3 pd-l-0">
                {/* <p>Hi, Welcome  to Role Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Menu Management</h5>
              </div>
              <div className="col-sm-9 pd-r-0">
                {/* <Form  
                  className="mt-4 mb-4"
                  // onSubmit={handleSubmit(searchSubmit)}
                > */}
                <div className="user-info mb-4">
                  <div className="user-info-inner col-lg-4 col-md-12 pd-0">
                    <h6 className="label-search">Select Menu Name</h6>
                    <Controller
                      control={control}
                      name="menuId"
                      {...register("menuId")}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={Menus}
                            placeholder="Select Menu Name"
                            name="menuId"
                            onChange={(e) => {
                              field.onChange(e);
                              handleMenuChange(e.value);
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
                  <button className="btn btn-white" onClick={() => fectchMenus(1)}>
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
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary fz-14"
                  >
                    Add Menu
                  </button>
                  ):""}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommonDataTable {...MenuListProps} />

        <AddEditModal
          {...addMenuProps}
          onHide={() => setShowAddModal(false)}
        />
        <AddEditModal
          {...editMenuProps}
          onHide={() => setShowEditModal(false)}
        />
      </div>
    </>
  );
}
export default MenuList;
