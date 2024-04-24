import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import {
  PiTrashBold,
  PiGearBold,
  PiNotePencilBold,
  PiEyeBold,
} from "react-icons/pi";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import { useForm, Controller } from "react-hook-form";
import { InputGroup, Col, Button, Row, Form, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import Swal from "sweetalert2";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import { AddClient, EditClient } from "./ClientHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { ViewClient } from "./ClientHelper";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function ClientList() {
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
  const [userData, setUserData] = useRecoilState(userAtom);
  const [CountryAll, setCountryAll] = useState("");
  const { register, handleSubmit, control, reset, setValue } = useForm();
  const [showUserModal, setShowUserModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);
  const [currentPage, setCurrentPage] = useState(1);

  const [showClientEditModal, setShowClientEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState("");
  const [showClientViewModal, setShowClientViewModal] = useState(false);
  const [clientViewData, setClientViewData] = useState("");
  const [clickedClientId, setClickedClientId] = useState("");

  const [Country, setCountry] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setcity] = useState([]);
  const [ClientName, setClientName] = useState([]);
  const [email, setEmail] = useState([]);
  const submitButtonRef = useRef(null);


  // SP
  // const [countryId, setCountryId] = useState("");
  // const [provinceId, setProvinceId] = useState("");
  // const [cityId, setCityId] = useState("");
  // const [clientId, setClientId] = useState("");
  // const [emailId, setEmailId] = useState("");




  const fetchClient = async (
    page = globalPage.current,
    size = globalPerPage.current,
  ) => {

    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");


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
    if (globalFilters.current.emailId) {
      formData.append("clientEmail", globalFilters.current.emailId);
    }
    if (globalFilters.current.status != null) {
      formData.append("status", globalFilters.current.status);
    }

    axiosInstance
      .post("client/getClientList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };
  const searchSubmit = async (data) => {

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
    if (data.filterEmail && data.filterEmail.label !== "") {
      filters.emailId = data.filterEmail.label;
    }
    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }
    globalFilters.current = filters;
    // Reset page to 1 and fetch data
    globalPage.current = 1;
    setCurrentPage(1);
    fetchClient(1);
  };

  const resetFilter = () => {
    const fieldsToReset = {
      status: "",
      emailId: "",
      cityId: "",
      clientId: "",
      countryId: "",
      provinceId: "",
      filterClient: "",
      filterEmail: "",
      filterCity: "",
      filterCountry: "",
      filterProvince: ""

      // Add other fields you want to reset here
    };

    setCountry([]);
    setProvience([]);
    setcity([]);
    setEmail([]);
    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };

    fetchClient(1);
  };

  const getCountry = async () => {
    let formData = new FormData();
    if (globalFilters.current && globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    await axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Select Country Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setCountry(data1);
      })
      .catch((err) => { });
    await axiosInstance
      .post("client/getAllCountryDD", [], { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Select Country Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setCountry(data1);
      })
      .catch((err) => { });
  };
  const getProvienced = async (value = null) => {
    let formData = new FormData();

    formData.append("clientId", globalFilters.current?.clientId ?? "");

    formData.append("countryId", globalFilters.current?.countryId ?? "");
    await axiosInstance
      .post("client/getProvinceDdForClient", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setProvience(data);
      })
      .catch((err) => { });
  };
  // const getProviencedForClient = async (value = null) => {
  //   let formData = new FormData();

  //   formData.append("clientId", globalFilters.current?.clientId ?? "");
  //   formData.append("countryId", globalFilters.current?.countryId ?? "");
  //   formData.append("provinceId", globalFilters.current?.provinceId ?? "");
  //   await axiosInstance
  //     .post("client/getCityDdForClient", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Province", isDisabled: true },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.provinceId.toString(), // Convert id to string, if needed
  //           label: item.provinceName,
  //         })),
  //       ];
  //       setProvience(data);
  //     })
  //     .catch((err) => { });
  // };
  const getCity = async () => {
    let formData = new FormData();
    // if (value !== null) {
    //   formData.append("provinceId", value);
    // }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    formData.append("countryId", globalFilters.current?.countryId ?? "");
    formData.append("provinceId", globalFilters.current?.provinceId ?? "");
    await axiosInstance
      .post("client/getCityDdForClient", formData, { headers: headersForJwt })
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
  const getEmail = async (value) => {
    let formData = new FormData();
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    await axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Email", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientEmail,
          })),
        ];
        setEmail(data);
      })
      .catch((err) => { });
  };

  const onView = (id) => {
    const formData = new FormData();
    formData.append("clientId", id);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log(res.data.data.list);
        setClientViewData(res.data.data.list);
        setShowClientViewModal(true);
        setClickedClientId(id);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };
  useEffect(() => {
    getAllCountry();
    fetchClient(1);
    // getCountry();
    // getProvienced();
    // getCity();
    getClientName();
    // getEmail();
  }, []);

  const getAllCountry = () => {
    setLoading(true);
    axiosInstance
      .post("client/getAllCountryDD", "", {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCountryAll(res.data.data.list);
          setLoading(false);
        }

        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const onEdit = (clientId) => {
    // setEditUserData(rowData)
    const formData = new FormData();
    formData.append("clientId", clientId);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        setEditUserData([]);
        setEditUserData(res.data.data.list);
        setShowClientEditModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        sortable: true,
        width: "10%",
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
        // selector: "clientName",
        filter: 'text',
        sortable: true,
        minWidth: "10%",
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

        name: "Address",
        selector: "address1",
        sortable: true,
        filter: 'text',
        minWidth: "20%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-address-${row.id}`}>{getFullAddress(row)}</Tooltip>}
          >
            <span className="mg-b-0">{getShortenedAddress(row)}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Email",
        selector: "clientEmail",
        sortable: true,
        filter: 'text',
        minWidth: "20%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.clientEmail}`}>{row.clientEmail}</Tooltip>}
          >
            <span className="mg-b-0">{row.clientEmail}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Status",
        selector: "isActive",
        filter: 'text',
        minWidth: "20%",
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
                <Dropdown.Item></Dropdown.Item>
                {row.isActive ? (
                  userData.access.isView ? (
                    <Dropdown.Item
                      onClick={() => onView(row.clientId)}
                      className="fz-2"
                    >
                      <PiEyeBold className="user-icon" /> View
                    </Dropdown.Item>
                  ) : ""
                ) : null}
                {/* {row.isActive ? (
                  userData.access.isEdit ? (
                    <Dropdown.Item
                      onClick={() => onEdit(row.clientId)}
                      className="fz-2"
                    >
                      <PiNotePencilBold className="user-icon " />
                      Edit
                    </Dropdown.Item>
                  ) : ""
                ) : null} */}

                {row.isActive && userData.userDetails.roleId !== 8 ? (
                  userData.access.isEdit ? (
                    <Dropdown.Item
                      onClick={() => onEdit(row.clientId)}
                      className="fz-2"
                    >
                      <PiNotePencilBold className="user-icon" />
                      Edit
                    </Dropdown.Item>
                  ) : null
                ) : null}

                {userData.access.isDelete ? (
                  <Dropdown.Item
                    onClick={() => onDelete(row.clientId, row.isActive)}
                    className="fz-2"
                  >
                    {/* <PiTrashBold className="user-icon " /> */}
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
                ) : ""}
              </Dropdown.Menu>
            </Dropdown>
          </>
        ),
      },
    ],
    []
  );
  // Function to get the full address
  const getFullAddress = (row) => {
    if (row.address1 || row.address2) {
      if (row.address2) {
        return `${row.address1 || ""} ${row.address2}`;
      } else {
        return `${row.address1 || ""}`;
      }
    } else {
      return " ";
    }
  };
  // Function to get a shortened version of the address for display
  const getShortenedAddress = (row) => {
    if (row.address1 || row.address2) {
      return `${row.address1 || row.address2}`;
    } else {
      return " ";
    }
  };
  const getStatusText = (row) => {
    return row.isActive ? "Active" : "Inactive";
  };
  const onDelete = (id, active) => {

    Swal.fire({
      title: "Please confirm",
      text:
        "Do you want to " + (active ? "inactivate" : "activate") + " this record?",
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
          .post("client/activateAndDeactivateClient", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchClient();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const handlePageChange = (page) => {
    // submitButtonRef.current.click();
    globalPage.current = page;
    setCurrentPage(page);
    fetchClient(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // globalPerPage.current = newPerPage;
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchClient(page, newPerPage);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    fetchClient(1);
  };
  const handleCloseClientModalCross = () => {
    setShowUserModal(false);
    fetchClient(currentPage);
  };
  const handleCloseUserEditModal = () => {
    setShowClientEditModal(false);
    fetchClient(currentPage);
  };
  const handelCountryChange = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.target.value.value
    };
    getProvienced()
  };
  const handelProvienceChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.target.value.value
    };
    getCity();
  };
  const handelCityName = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    getEmail();
  };
  const handelClientName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterEmail", "");
    getCountry();
    getEmail();
  };
  const handelEmailChange = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      emailId: data.target.value.label
    };
  };

  const addClientProps = {
    showUserModal,
    handleCloseUserModal,
    handleCloseClientModalCross,
    CountryAll,
    getClientName,
    setFullPageLoading
  };
  const editClientProps = {
    showClientEditModal,
    handleCloseUserEditModal,
    editUserData,
    CountryAll,
    setFullPageLoading
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
  const viewClientProps = {
    clientViewData,
    showClientViewModal,
    setShowClientViewModal,
    clickedClientId,
    setFullPageLoading
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
    { value: '', label: 'Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];
  return (
    <>
      <div>
        {/* Your table component */}
        {/* <CommonDataTable
        onPageChange={handlePageChange}
        onPerRowsChange={handlePerRowsChange}
        onSort={handleSort}
      /> */}
      </div>
      <Helmet title={"Client | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                {/* <p>Hi, Welcome to User Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Clients</h5>
              </div>
              {userData.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add Clients
                  </button>
                </div>
              ) : ""}
              <div className="col-lg-12 pd-0">
                <Form
                  className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <div className="user-info-90 row">
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Client Name</h6>
                      <Controller
                        control={control}
                        name="filterClient"
                        {...register("filterClient", {
                          onChange: (data) => handelClientName(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={ClientName}
                              placeholder="Client Name"
                              name="filterClient"
                              // value={selectedClient}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Country</h6>
                      <Controller
                        control={control}
                        name="filterCountry"
                        {...register("filterCountry", {
                          onChange: (data) => handelCountryChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Country}
                              placeholder="Country Name"
                              name="filterCountry"
                            // components={{
                            //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            // }}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Province</h6>
                      <Controller
                        control={control}
                        name="filterProvince"
                        {...register("filterProvince", {
                          onChange: (data) => handelProvienceChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Provience}
                              placeholder="Province Name"
                              name="filterProvince"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select City</h6>
                      <Controller
                        control={control}
                        name="filterCity"
                        {...register("filterCity", {
                          onChange: (data) => handelCityName(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={city}
                              placeholder="City Name"
                              name="filterCity"
                              // value={selectedCity}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12 mt-4">
                      <h6 className="label-search">Select Email</h6>
                      <Controller
                        control={control}
                        name="filterEmail"
                        {...register("filterEmail", {
                          onChange: (data) => handelEmailChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={email}
                              placeholder="Select Email"
                              name="filterEmail"
                              // value={selectedEmail}

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

                    <div className=" col-sm-3 col-12  mt-4">
                      <h6 className="label-search">Search/Reset</h6>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <button
                          type="submit"
                          ref={submitButtonRef}
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
                </Form>
              </div>
            </div>
          </div>
        </div>

        <CommonDataTable {...UserListProps} />
        <AddClient {...addClientProps} onHide={() => setShowUserModal(false)} />
        <EditClient
          {...editClientProps}
          onHide={() => setShowClientEditModal(false)}
        />
        <ViewClient {...viewClientProps} />
      </div>
    </>
  );
}
export default ClientList;
