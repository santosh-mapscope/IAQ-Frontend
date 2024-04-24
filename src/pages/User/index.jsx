/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import { AddUser, EditUser, ViewUser } from "../User/userHelper";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { PiGearBold, PiNotePencilBold, PiEyeBold } from "react-icons/pi";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";

import { Form } from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";

import Select from "react-select";

import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import Profileicon from "../../assets/images/user2-160x160.jpg";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
function UserIndex() {
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for

  const [userData, setUserData] = useRecoilState(userAtom);
  const { register, handleSubmit, control, reset } = useForm();
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserViewModal, setShowUserViewModal] = useState(false);
  const [data, setData] = useState([]);
  const [editUserData, setEditUserData] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [emailForDD, setEmailForDD] = useState([]);
  const [phoneNumberForDD, setPhoneNumberForDD] = useState([]);
  const [userNameForDD, setUserNameForDD] = useState([]);
  const [rolesForSeachDD, setRolesForSeachDD] = useState([]);

  const [userName, setUserName] = useState("");

  const [showUserEditModal, setShowUserEditModal] = useState(false);

  // const fetchUsers = async (
  //   page = globalPage.current,
  //   size = globalPerPage.current
  // ) => {
  //   setLoading(true);
  //   let formData = new FormData();
  //   formData.append("page", page - 1);
  //   formData.append("size", size);
  //   formData.append("sortBy", "id");
  //   formData.append("sortOrder", "DESC");

  //   axiosInstance
  //     .post("users/getUserList1", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       setData(res.data.data.list);
  //       setTotalRows(res.data.data.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(true);
  //     });
  // };


  const getUserNameDD = async () => {
    let formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("users/getUserNameDDForUser", formData, { headers: headersForJwt })
      .then((res) => {
        const dataForUseName = [
          { value: "", label: "Select Username", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.userName,
          })),
        ];
        console.log(dataForUseName);
        setUserNameForDD(dataForUseName);
        // setEmailForDD(data);
        console.log(data);
      })
      .catch((err) => { });
  };
  const getEmailDD = async () => {
    let formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("users/getEmailDDForUser", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Email", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.email,
          })),
        ];
        setEmailForDD(data);
        // console.log(data)
      })
      .catch((err) => { });
  };
  const getPhoneDD = async () => {
    let formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("users/getPhoneDDForUser", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Phone Number", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.phoneNumber,
          })),
        ];
        setPhoneNumberForDD(data);
        // console.log(data)
      })
      .catch((err) => { });
  };

  useEffect(() => {
    fetchUsers(1);
    getUserNameDD();
    getEmailDD();
    getPhoneDD();
  }, []);
  const handleImageError = (event) => {
    event.target.src = Profileicon; // Set the default image when an error occurs
  };
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
        name: "Username",
        selector: "userName",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-username-${row.id}`}>{row.userName}</Tooltip>}
          >
            <div className="d-flex">
              {row.profileImage ? (
                <>
                  {" "}
                  <img

                    className="img-circle"
                    src={row.profileImage}
                    onError={handleImageError}
                    alt="user pic"
                    width="20px"
                  />
                </>
              ) : (
                <img

                  className="img-circle"
                  src={Profileicon}
                  alt="user pic"
                  width="20px"
                />
              )}

              <span className="ms-2">
                {row.userName}
              </span>
            </div>
          </OverlayTrigger>
        ),
      },
      {
        name: "Full Name",
        selector: (row) =>
          [row.firstName, row.middleName, row.lastName]
            .filter(Boolean)
            .join(" "),
        sortable: true,
        minWidth: "10%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-full-name-${row.id}`}>{getFullName(row)}</Tooltip>}
          >
            <div>{getShortenedFullName(row)}</div>
          </OverlayTrigger>
        ),
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        minWidth: "30%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.email}`}>{row.email}</Tooltip>}
          >
            <span className="mg-b-0">{row.email}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Status",
        selector: "isActive",
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
        name: "Role",
        minWidth: "10%",
        selector: "roleName",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.roleName}`}>{row.roleName}</Tooltip>}
          >
            <span className="mg-b-0">{row.roleName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Action",
        width: "6%",
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
                      Edit User
                    </Dropdown.Item>
                  ) : ""

                ) : null}
                {row.isActive ? (
                  userData.access.isView ? (
                    <Dropdown.Item
                      onClick={() => onView(row.id)}
                      className="fz-2"
                    >
                      <PiEyeBold className="user-icon" /> View User
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
  // Function to get the full name
  const getFullName = (row) => {
    return [row.firstName, row.middleName, row.lastName]
      .filter(Boolean)
      .join(" ");
  };
  // Function to get a shortened version of the full name for display
  const getShortenedFullName = (row) => {
    const fullName = getFullName(row);
    return fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;
  };
  const handlePageChange = (page) => {
    globalPage.current = page;
    setCurrentPage(page);
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchUsers(page, newPerPage);
  };

  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text:
        "Do you want to " +
        (active ? "inactivate" : "activate") +
        " this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        let formData = new FormData();
        formData.append("id", id);
        axiosInstance
          .post("users/activateDeactivateUser", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchUsers();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const onEdit = (id) => {
    const formData = new FormData();
    formData.append("userId", id);
    axiosInstance
      .post("users/getUserById", formData, { headers: headersForJwt })
      .then((res) => {
        setEditUserData([]);
        setEditUserData(res.data.data.list);
        setShowUserEditModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };
  const onView = (id) => {
    const formData = new FormData();
    formData.append("userId", id);
    axiosInstance
      .post("users/getUserById", formData, { headers: headersForJwt })
      .then((res) => {
        setEditUserData([]);
        setEditUserData(res.data.data.list);
        setShowUserViewModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };

  const getAllRoleDD = async () => {
    const formData = new FormData();

    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("users/getAllRoleDDForUser", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Role Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setRolesForSeachDD(data);
        setRoles(res.data.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
    // axiosInstance
    // .post("master/getAllRoleDD", [], { headers: headersForJwt })
    // .then((res) => {

    //   setRoles(res.data.data.list);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  };
  const getAllDesignationDD = async () => {
    let formData = new FormData();
    formData.append("isClient", "false");
    axiosInstance
      .post("master/getAllDesignationDD", formData, { headers: headersForJwt })
      .then((res) => {
        setDesignations(res.data.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllDesignationDD();
    getAllRoleDD();
  }, []);

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    fetchUsers(1);
  };
  const handleCloseUserEditModal = () => {
    setShowUserEditModal(false);
    fetchUsers(1);
  };

  const addUserProps = {
    showUserModal,
    handleCloseUserModal,
    designations,
    roles,
    setFullPageLoading,
  };
  const editUserProps = {
    showUserEditModal,
    handleCloseUserEditModal,
    designations,
    roles,
    editUserData,
    setFullPageLoading,
  };
  const viewUserProps = {
    showUserViewModal,
    setShowUserViewModal,
    designations,
    roles,
    editUserData,
  };
  const UserListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  };

  const options = [
    {
      value: "soubhagyapradhan.sparc@gmail.com",
      label: "soubhagyapradhan.sparc@gmail.com",
    },
    { value: "Email", label: "Email" },
    // Add other search options if needed
  ];


  const resetFilter = () => {
    const fieldsToReset = {
     
      userName: "",
      roleId: "",
      email: "",
      phoneNumber: "",
      status: ""

      // Add other fields you want to reset here
    };


    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };

    fetchUsers(1);
  };

  const fetchUsers = async (
    page = globalPage.current,
    size = globalPerPage.current
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("page", page - 1); // Adjust page index if needed
      formData.append("size", size);
      formData.append("sortBy", "id");
      formData.append("sortOrder", "DESC");
      
      if (globalFilters.current.status != null) {
        formData.append("status", globalFilters.current.status);
      }
      if (globalFilters.current.userName) {
        formData.append("userName", globalFilters.current.userName);
      }
      if (globalFilters.current.email) {
        formData.append("email", globalFilters.current.email);
      }
      if (globalFilters.current.phoneNumber) {
        formData.append("phoneNumber", globalFilters.current.phoneNumber);
      }
      if (globalFilters.current.roleId) {
        formData.append("roleId", globalFilters.current.roleId);
      }


      const response = await axiosInstance.post(
        "users/getUserList1",
        formData,
        { headers: headersForJwt }
      );

      setData(response.data.data.list);
      setTotalRows(response.data.data.totalItems);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  // const searchSubmit = (data) => {
  //   console.log(data);
  //   setLoading(true);
  //   let formData = new FormData();
  //   formData.append("page", 0);
  //   formData.append("size", 10);
  //   formData.append("sortBy", "id");
  //   formData.append("sortOrder", "DESC");
  //   if (data.userName && data.userName.value > 0)
  //     formData.append("userName", data.userName.label);
  //   if (data.status && data.status.value !== "")
  //     formData.append("status", data.status.value);
  //   if (data.email && data.email.value > 0)
  //     formData.append("email", data.email.label);
  //   if (data.phoneNumber && data.phoneNumber.value > 0)
  //     formData.append("phoneNumber", data.phoneNumber.label);
  //   if (data.roleId && data.roleId.value > 0)
  //     formData.append("roleId", data.roleId.value);

  //   axiosInstance
  //     .post("users/getUserList1", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       setData(res.data.data.list);
  //       setTotalRows(res.data.data.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(true);
  //     });
  // };
  const searchSubmit = async (data) => {
    setLoading(true);
    const filters = {};
    if (data.userName && data.userName.value > 0)
      filters.userName = data.userName.label;

    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }
    if (data.email && data.email.value > 0)
      filters.email = data.email.label;

    if (data.phoneNumber && data.phoneNumber.value > 0)
      filters.phoneNumber = data.phoneNumber.label;

    if (data.roleId && data.roleId.value > 0)
      filters.roleId = data.roleId.value;


    globalFilters.current = filters;
    globalPage.current = 1;
    fetchUsers(1);
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
  const optionsForStatus = [
    { value: '', label: 'Select Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];
  return (
    <>
      <Helmet title={"Users | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <p>Hi, Welcome to User Panel</p>
                <h5 className="m-0 mt-3 mb-2">Users</h5>
              </div>
              {userData.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add User
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="col-lg-12 pd-0">
                <Form
                  className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <div className="user-info-90 row">
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Role</h6>
                      <Controller
                        control={control}
                        name="roleId"
                        {...register("roleId")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={rolesForSeachDD}
                              placeholder="Role"
                              name="roleId"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Phone</h6>
                      <Controller
                        control={control}
                        name="phoneNumber"
                        {...register("phoneNumber")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={phoneNumberForDD ?? []}
                              placeholder="Select Phone"
                              name="phoneNumber"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Username</h6>
                      <Controller
                        control={control}
                        name="userName"
                        {...register("userName")}
                        render={({ field }) => (
                          <>
                            <Select
                              // defaultValue={{ value: -1, label: "Select Username" }}
                              {...field}
                              size="sm"
                              options={userNameForDD ?? []}
                              placeholder="Username"
                              name="userName"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Email</h6>
                      <Controller
                        control={control}
                        name="email"
                        {...register("email")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={emailForDD}
                              placeholder="Select Email"
                              name="email"
                              clearButton
                              isSearchable={true}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: "100%", // Adjust the width to your desired size
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  overflowX: "hidden", // Prevent horizontal scrolling
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  overflowX: "hidden", // Enable horizontal scrollbar if needed
                                }),
                              }}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="user-info-90 mt-4 row">
                    <div className="col-sm-3 col-12">
                      <label className="label-search mb-2">Select Status</label>
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
                              placeholder="Select Status"
                              name="status"
                              clearButton
                            />
                          </>
                        )}
                      />
                      {/* <Select
      {...register('status')}
      options={optionsForStatus}
      defaultValue={optionsForStatus[0]} // Set default value (Status) when nothing is selected
    /> */}
                    </div>

                    <div className=" col-sm-3 col-12 mt-4">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <button
                          type="submit"
                          onClick={() => handleSubmit(searchSubmit)}
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

                  {/* <div className="user-info-inner-1">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(event) =>
                          handlePerRowsChange(event.target.value, 1)
                        }
                      >
                        <option value={10} selected>
                          10
                        </option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div> */}
                </Form>
              </div>
            </div>
          </div>
        </div>

        <CommonDataTable {...UserListProps} />
        <AddUser {...addUserProps} onHide={() => setShowUserModal(false)} />
        <EditUser {...editUserProps} />
        <ViewUser {...viewUserProps} />
      </div>
    </>
  );
}
export default UserIndex;
