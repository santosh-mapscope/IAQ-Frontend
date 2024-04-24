import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import {
  PiTrashBold,
  PiGearBold,
  PiNotePencilBold,
  PiEyeBold,
} from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import { useForm, Controller } from "react-hook-form";
import { InputGroup, Col, Button, Row, Form, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { AddTenant, EditTenant } from "./TenantsHelper";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import Select from "react-select";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function TenantsList(props) {
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
  const submitButtonRef = useRef(null);
  const { type, clickedClientId, viewType, parentName, clickedBuildingId } =
    props;
  const [userData, setUserData] = useRecoilState(userAtom);
  const [allBulidingList, setAllBulidingList] = useState("");
  // const [buildingName, setBuildingName] = useState("");
  const [CountryAll, setCountryAll] = useState("");
  const [clientName, setClientName] = useState("");
  const [Country, setCountry] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setCity] = useState([]);
  const [BuildingName, setBuildingName] = useState([]);
  const { register, handleSubmit, control, reset, setValue } = useForm();
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [alltenantList, setAlltenantList] = useState([]);
  const [email, setEmail] = useState("");
  const [showTenantEditModal, setShowTenantEditModal] = useState(false);
  // const [showEditModal, setShowUserEditModal] = useState(false);
  const [editTenantData, setEditTenantData] = useState("");

  const [showClientViewModal, setShowClientViewModal] = useState(false);
  const [clientViewData, setClientViewData] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [tentantId, setTentantId] = useState("");
  const [clientId, setClientId] = useState("");
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);

  const fetchTenant = async (page, size = perPage) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }

    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }


    if (globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    if (globalFilters.current.buildingId) {
      formData.append("buildingId", globalFilters.current.buildingId);
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
    if (globalFilters.current.tenantId) {
      formData.append("tenantId", globalFilters.current.tenantId);
    }
    if (globalFilters.current.status != null) {
      formData.append("status", globalFilters.current.status);
    }



    axiosInstance
      .post("tenant/getTenantList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };
  const searchSubmit = (data) => {
    // console.log("------>", data);
    setLoading(true);
    const filters = {};
    let formData = new FormData();

    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }

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
    if (data.filterBuilding && data.filterBuilding.value !== "") {
      filters.buildingId = data.filterBuilding.value;
    }
    if (data.filterBuilding && data.filterTenant.value !== "") {
      filters.tenantId = data.filterTenant.value;
    }
    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }
    globalFilters.current = filters;
    // Reset page to 1 and fetch data
    globalPage.current = 1;
    setCurrentPage(1);
    fetchTenant(1);
  };

  const resetFilter = () => {
    const fieldsToReset = {
      status: "",
      buildingId: "",
      cityId: "",
      clientId: "",
      countryId: "",
      provinceId: "",
      tenantId: "",
      filterClient: "",
      filterBuilding: "",
      filterCity: "",
      filterCountry: "",
      filterProvince: "",
      filterTenant: ""
      // Add other fields you want to reset here
    };

    setCountry([]);
    setProvience([]);
    setCity([]);
    setBuildingName([]);
    setAlltenantList([]);
    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };

    fetchTenant(1);
  };

  useEffect(() => {
    getClientName();
    // getBuildingList();
    fetchTenant(1);
    getAllCountry();
    // getCountry();

  }, []);

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
  const handelClientName = (data) => {
    console.log(data);
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterBuilding", "");
    setValue("filterTenant", "");
    getCountry();
    getBuilding();
  }
  const handelCountryChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.target.value.value
    };
    getProvienced();
  }
  const handelProvienceChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.target.value.value
    };
    getCity();
  }
  const handelCityName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    // setCityId(data.target.value.value);
    setClientId("");
  }
  const handelBuildingChange = (data) => {
    // console.log(data.target.value.value);
    globalFilters.current = {
      ...globalFilters.current,
      buildingId: data.target.value.value
    };
    getTenantsListByBuildingId()
    // buildingId(data.target.value.value);

  }
  const handelTenatName = (data) => {
    console.log(data.target.value.value);
    globalFilters.current = {
      ...globalFilters.current,
      tenantId: data.target.value.value
    };
  }
  const getAllCountry = () => {
    // setLoading(true);
    let formData = new FormData();

    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    axiosInstance
      .post("client/getAllCountryDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res);
        if (res && res.data.status === 1) {
          console.log(res.data.data.list);
          setCountryAll(res.data.data.list);
          setLoading(false);
        }

        return false;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCountry = async () => {
    let formData = new FormData();
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
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
        // console.log(data1);
      })
      .catch((err) => { });
  };
  const getProvienced = async (value) => {
    let formData = new FormData();
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    formData.append("countryId", globalFilters.current?.countryId ?? "");
    await axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
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
  const getCity = async () => {
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    formData.append("countryId", globalFilters.current?.countryId ?? "");
    formData.append("provinceId", globalFilters.current?.provinceId ?? "");
    await axiosInstance.post(`client/getAllCityDD`, formData, {
      headers: headersForJwt,
    })
      .then((res) => {
        const data = [
          { value: "", label: "City name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName
          })),
        ];
        setCity(data)
        return false;
      })
      .catch((err) => {
      });
  };
  const getClientName = () => {
    setClientName("");
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
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
  const getBuilding = async () => {
    let formData = new FormData();
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    formData.append("clientId", globalFilters.current?.clientId ?? "");

    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);
      })
      .catch((err) => { });
  };
  // const getBuildingList = (e) => {
  //   setBuildingName("");
  //   let formData = new FormData();
  //   formData.append("clientId", Number(e.target.value));
  //   if (clickedBuildingId) {
  //     formData.append("buildingId", clickedBuildingId);
  //   }
  //   axiosInstance
  //     .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       if (res && res.data.status === 1) {
  //         // console.log(res.data.data.list);
  //         setBuildingName(res.data.data.list)
  //         // setCountry(res.data.data.list);
  //       }
  //       return false;

  //     })
  //     .catch((err) => { });

  // };
  const getTenantsListByBuildingId = () => {
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    formData.append("buildingId", globalFilters.current?.buildingId ?? "");
    setLoading(true);
    axiosInstance
      .post("tenant/getTenantDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res);
        const data = [
          { value: "", label: " Tenant name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.tenantId.toString(), // Convert id to string, if needed
            label: item.tenantName
          })),
        ];
        setAlltenantList(data);
        return false;
      })
      .catch((err) => {
        console.log(err);
      });

  };
  const getTenantId = (e) => {
    if (e.target.value !== "0") {
      setTentantId(e.target.value);
    }
  };
  const onEdit = (tenanttId) => {
    setShowTenantEditModal(true);
    // setEditUserData(rowData)
    const formData = new FormData();
    formData.append("tenantId", tenanttId);
    axiosInstance
      .post("tenant/getTenantById", formData, { headers: headersForJwt })
      .then((res) => {
        console.log(res.data.data.list);
        setEditTenantData([]);
        setEditTenantData(res.data.data.list);
        setShowTenantEditModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };
  const onView = (id) => {
    const formData = new FormData();
    formData.append("clientId", id);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        setClientViewData(res.data.data.list);
        setShowClientViewModal(true);
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
        name: "Tenant Name",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.tenantName}`}>{row.tenantName}</Tooltip>}
          >
            <span className="mg-b-0">{row.tenantName}</span>
          </OverlayTrigger>
        ),

      },
      {
        name: "Client Name",
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
        name: "Building Name",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.buildingName}`}>{row.buildingName}</Tooltip>}
          >
            <span className="mg-b-0">{row.buildingName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Floor , Module",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-floor-module-${row.id}`}>{getFullFloorModule(row)}</Tooltip>}
          >
            <div>
              <p>{getShortenedFloorModule(row)}</p>
            </div>
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
                {/* {userData.access.isView ? (
                  <Dropdown.Item
                    onClick={() => onView(row.clientId)}
                    className="fz-2"
                  >
                    <PiEyeBold className="user-icon" /> View Tenant
                  </Dropdown.Item>
                ) : ""} */}
                {row.isActive ? (
                  userData.access.isEdit ? (
                    <Dropdown.Item
                      onClick={() => onEdit(row.tenantId)}
                      className="fz-2"
                    >
                      <PiNotePencilBold className="user-icon " />
                      Edit
                    </Dropdown.Item>
                  ) : ""
                ) : null}
                {userData.access.isDelete ? (
                  <Dropdown.Item
                    onClick={() => onDelete(row.tenantId, row.isActive)}
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
  // Function to get the full text of "Floor, Module"
  const getFullFloorModule = (row) => {
    return `${row.floorNo}  ${row.suiteNo}`;
  };
  // Function to get a shortened version of "Floor, Module" for display
  const getShortenedFloorModule = (row) => {
    const fullText = getFullFloorModule(row);
    return fullText.length > 20 ? `${fullText.slice(0, 20)}...` : fullText;
  };
  const getStatusText = (row) => {
    return row.isActive ? "Active" : "Inactive";
  };
  const onDelete = (id, active) => {
    console.log(id);
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
        formData.append("tenantId", id);
        axiosInstance
          .post("tenant/deactivateTenant", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchTenant();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const handlePageChange = (page) => {
    fetchTenant(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchTenant(page, newPerPage);
    setPerPage(newPerPage);
  };
  const handleCloseTenantModal = () => {
    fetchTenant(currentPage);
    setShowTenantModal(false);
  };
  const handleCloseTenantEditModal = () => {
    setShowTenantEditModal(false);
    fetchTenant(1);
  };
  const addTenantProps = {
    clickedBuildingId,
    showTenantModal,
    handleCloseTenantModal,
    CountryAll,
    setFullPageLoading
  };
  const editTenantProps = {
    showTenantEditModal,
    handleCloseTenantEditModal,
    editTenantData,
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
  const options = [
    {
      value: "soubhagyapradhan.sparc@gmail.com",
      label: "soubhagyapradhan.sparc@gmail.com",
    },
    { value: "Email", label: "Email" },
    // Add other search options if needed
  ];

  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectOptions = filteredOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const optionsForStatus = [
    { value: '', label: 'Select Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];


  return (
    <>
     {!clickedBuildingId ? <Helmet title={"Upload CSV Management | IAQ Reporting System"} /> : null}
      {/* <Helmet title={"Tenants | IAQ Reporting System"} /> */}
      {isFullPageLoading && <CircularLoader />}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-4">
              <div className="col-sm-9">
                {/* <p>Hi, Welcome to User Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Tenants</h5>
              </div>
              {/* {viewType !== "ViewById" ? (   */}
              {userData.access.isAdd ? (
                <div className="col-sm-3">
                  <button
                    onClick={() => setShowTenantModal(true)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add Tenants
                  </button>
                </div>
              ) : ""}
              {/* ) : ""
              } */}
              <div className="col-lg-12 pd-0">
                <Form
                  className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <div className="user-info-90 row">
                    {/* client */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Client Name</h6>
                      <Controller
                        control={control}
                        name="filterClient"
                        {...register("filterClient", {
                          onChange: (data) => handelClientName(data)
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={clientName}
                              placeholder="Client Name"
                              name="filterClient"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* country */}
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
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* province */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Province</h6>
                      <Controller
                        control={control}
                        name="filterProvince"
                        {...register("filterProvince", {
                          onChange: (data) => handelProvienceChange(data)
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
                    {/* city */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select City</h6>
                      <Controller
                        control={control}
                        name="filterCity"
                        {...register("filterCity", {
                          onChange: (data) => handelCityName(data)
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={city}
                              placeholder="City Name"
                              name="filterCity"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* building */}
                    <div className="col-sm-3 col-12 mt-4">
                      <h6 className="label-search">Select Building Name</h6>
                      <Controller
                        control={control}
                        name="filterBuilding"
                        {...register("filterBuilding", {
                          onChange: (data) => handelBuildingChange(data)

                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={BuildingName}
                              placeholder="Building Name"
                              name="filterBuilding"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* tenant */}
                    <div className="col-sm-3 col-12 mt-4">
                      <h6 className="label-search">Select Tenant Name</h6>
                      <Controller
                        control={control}
                        name="filterTenant"
                        {...register("filterTenant", {
                          onChange: (data) => handelTenatName(data)
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={alltenantList}
                              placeholder="Tenant name"
                              name="filterTenant"
                              clearButton
                            />
                          </>
                        )}
                      />
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
                          type="submit"
                          ref={submitButtonRef}
                          onClick={() => handleSubmit(searchSubmit)}
                          className="btn btn-white "
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
        <AddTenant
          {...addTenantProps}
          onHide={() => setShowTenantModal(false)}
        />
        <EditTenant
          {...editTenantProps}
          onHide={() => setShowTenantEditModal(false)}
        />
        {/* <AddUser {...addUserProps} onHide={() => setShowUserModal(false)} />
        <EditUser {...editUserProps} />*/}
        {/* <ViewClient {...viewClientProps} />  */}
      </div>
    </>
  );
}
export default TenantsList;
