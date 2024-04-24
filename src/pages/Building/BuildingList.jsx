import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import {
  PiGearBold,
  PiNotePencilBold,
  PiTrashBold,
  PiEyeBold,
} from "react-icons/pi";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Alert, Form } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import {
  AddBuilding,
  EditBuilding,
  ViewBuilding,
  AddBuildingOperator
} from "./BuildingHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import Swal from "sweetalert2";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function BuildingList(props) {
  const submitButtonRef = useRef(null);
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
  const { clickedClientId, viewType, Countryid } = props;

  const { register, handleSubmit, control, reset, setValue } = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);

  const [currentPage, setCurrentPage] = useState(1);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showBuildingEditModal, setshowBuildingEditModal] = useState(false);

  const [Country, setCountry] = useState([]);
  const [CountryAll, setCountryAll] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setcity] = useState([]);
  const [ClientName, setClientName] = useState([]);
  const [BuildingName, setBuildingName] = useState([]);
  const [editBuildingData, seteditBuildingData] = useState("");

  //Soubhagya
  const [showBuildingViewModal, setShowBuildingViewModal] = useState(false);
  const [buildingViewData, setBuildingViewData] = useState("");
  const [clickedBuildingId, setClickedBuildingId] = useState("");

  // SP
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [clientId, setClientId] = useState("");
  const [buildingId, setBuildingId] = useState("");

  const [showOption, setShowOption] = useRecoilState(userAtom);





  const fetchBuildingList = async (

    page = globalPage.current,
    size = globalPerPage.current) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (clickedBuildingId) {
      formData.append("BuildingId", clickedBuildingId);
    }
    // Object.keys(globalFilters.current).forEach((key) => {
    //   if (globalFilters.current[key] !== "") {
    //     formData.append(key, globalFilters.current[key]);
    //   }
    // });
    // console.log(globalFilters.current);
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
    if (globalFilters.current.status != null) {
      formData.append("status", globalFilters.current.status);
    }

    try {
      const res = await axiosInstance.post("building/getAllBuildingList", formData, {
        headers: headersForJwt,
      });
      // console.log(res.data.data.list);
      setData(res.data.data.list);
      setTotalRows(res.data.data.totalItems);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching Building list:", err);
    }
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

    if (data.filterBuilding && data.filterBuilding.value !== "") {
      filters.buildingId = data.filterBuilding.value;
    }
    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }

    globalFilters.current = filters;
    // Reset page to 1 and fetch data
    globalPage.current = 1;
    setCurrentPage(1);
    fetchBuildingList(1);
  };
  // Building Helper
  const getAllCountry = () => {

    let formData = new FormData();
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    // setLoading(true);
    axiosInstance
      .post("client/getAllCountryDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log("----<", res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCountryAll(res.data.data.list);
          // setLoading(false);
        }

        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  //For Search

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
          { value: "", label: "Select country name", isDisabled: true },
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
    await axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select province name", isDisabled: true },
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
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select city name", isDisabled: true },
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
    await axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client name", isDisabled: true },
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
          { value: "", label: "Select building name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            // label: item.name + " at " + item.address1 + "," + item.address2
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);
      })
      .catch((err) => { });
  };

  const onEdit = (buildingId, clientBuildingMapId) => {
    // console.log(buildingId);
    // console.log(clientBuildingMapId);
    const formData = new FormData();
    formData.append("buildingId", buildingId);
    formData.append("clientBuildingMapId", clientBuildingMapId);
    axiosInstance
      .post("building/getAllBuildingDetailsById1", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        seteditBuildingData([]);
        //  console.log("-----------------edit-----------------------------???",res.data.data.list);
        seteditBuildingData(res.data.data.list);
        setshowBuildingEditModal(true);
        // console.log(res.data.data.list);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };

  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to " + (active ? "inactivate" : "activate") + " this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        // setLoading(true);
        let formData = new FormData();
        formData.append("buildingId", id);
        axiosInstance
          .post("building/deactivateBuilding", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchBuildingList();
            // setLoading(false);
          })
          .catch((err) => {
            // setLoading(false);
          });
      }
    });
  };

  const onView = (id, clientBuildingMapId) => {
    // console.log(id);
    // console.log(clientBuildingMapId);
    const formData = new FormData();
    formData.append("buildingId", id);
    formData.append("clientBuildingMapId", clientBuildingMapId);
    axiosInstance
      .post("building/getAllBuildingDetailsById1", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.status === 1) {
          // console.log("----------view---------",res.data.data);
          setBuildingViewData(res.data.data);
          setShowBuildingViewModal(true);
          setClickedBuildingId(id);
        }

      })
      .catch((err) => {
        // setLoading(true);
      });
  };

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
    getCity(data.target.value.value);
  }
  const handelCityName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    // setCityId(data.target.value.value);
    setClientId("");
  }
  const handelClientName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterBuilding", "");
    getCountry();
    getBuilding();
  }
  const handelBuildingChange = (data) => {
    setBuildingId(data.target.value.value);
  }

  const resetFilter = () => {
    const fieldsToReset = {
      status: "",
      buildingId: "",
      cityId: "",
      clientId: "",
      countryId: "",
      provinceId: "",
      filterClient: "",
      filterBuilding: "",
      filterCity: "",
      filterCountry: "",
      filterProvince: "",
     
      // Add other fields you want to reset here
    };

    setCountry([]);
    setProvience([]);
    setcity([]);
    setBuildingName([]);
    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };
    getBuilding();
    fetchBuildingList(1);
  };
  useEffect(() => {
    fetchBuildingList(1);
    getClientName();
   getBuilding();
    getAllCountry();


  }, []);


  //Show All Building List in Table Format
  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        selector: "slNo",
        sortable: true,
        minWidth: "2%",
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
        minWidth: "15%",
        selector: "clientName",
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
      // {
      //   name: "Building Name",
      //   selector: "buildingName",
      //   sortable: true,
      //   minWidth: "15%",
      //   cell: (row) => (
      //     <OverlayTrigger
      //       placement="top"
      //       overlay={<Tooltip id={`tooltip-top-${row.buildingName}`}>{row.buildingName}</Tooltip>}
      //     >
      //       <span className="mg-b-0">{row.buildingName}</span>
      //     </OverlayTrigger>
      //   ),
      // },
      {
        name: "Building Name",
        selector: "buildingName",
        sortable: true,
        minWidth: "15%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.buildingName}`}>
              {row.buildingName} at {`${row.address2 ? row.address1 + ', ' + row.address2 : row.address1}`}
            </Tooltip>}
          >
            <span className="mg-b-0">{row.buildingName}</span>
          </OverlayTrigger>
        ),
      },

      {
        name: "Address",
        selector: "address1",
        sortable: true,
        minWidth: "15%",
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
        name: "City",
        selector: "cityName",
        sortable: true,
        minWidth: "10%",
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
        name: "Province",
        minWidth: "10%",
        selector: "provinceName",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.provinceName}`}>{row.provinceName}</Tooltip>}
          >
            <span className="mg-b-0">{row.provinceName}</span>
          </OverlayTrigger>
        ),
      },
      // {
      //   name: "Last Test Date",
      //   minWidth: "10%",
      //   selector: "lastTestDate",
      //   sortable: true,
      //   cell: (row) => (
      //     <>

      //       {row.lastTestDate === null ? 'NA' : row.lastTestDate}

      //     </>
      //   ),
      // },
      {
        name: "Status",
        selector: "isActive",
        minWidth: "10%",
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
      }, {
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
                {row.isActive ? (
                  showOption.access.isView &&
                  <Dropdown.Item
                    onClick={() => onView(row.buildingId, row.clientBuildingMapId)}
                    className="fz-2"
                  >
                    <PiEyeBold className="user-icon" /> View
                  </Dropdown.Item>
                ) : ""}
                {row.isActive ? (
                  showOption.access.isEdit &&
                  <Dropdown.Item
                    className="fz-2"
                    onClick={() => onEdit(row.buildingId, row.clientBuildingMapId)}
                  >
                    <PiNotePencilBold className="user-icon " />
                    Edit Building
                  </Dropdown.Item>

                ) : ""}
                {showOption.access.isDelete &&
                  <Dropdown.Item onClick={() => onDelete(row.buildingId, row.isActive)} className="fz-2">
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
                }
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
  // Function to get the full address
  const getFullAddress = (row) => {
    if (row.address1 || row.address2) {
      return `${row.address1 || ""} ${row.address2 || ""}`;
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
  const handlePageChange = (page) => {
    globalPage.current = page;
    setCurrentPage(page);
    fetchBuildingList(page);
    // submitButtonRef.current.click();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchBuildingList(page, newPerPage);
    // submitButtonRef.current.click();

  };

  const handleCloseAddBuildingModal = () => {
    setShowBuildingModal(false);
    fetchBuildingList(1)
    // fetchUsers(1);
  };

  const addBuildingProps = {
    showBuildingModal,
    handleCloseAddBuildingModal,
    CountryAll,
    setFullPageLoading
  };

  const handleCloseBuildingEditModal = () => {
    setshowBuildingEditModal(false);
    fetchBuildingList(currentPage)
    // fetchUsers(1);
  };

  const editBuildingProps = {
    showBuildingEditModal,
    handleCloseBuildingEditModal,
    editBuildingData,
    CountryAll,
    setFullPageLoading
  };

  const AddBuildingListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
    setFullPageLoading
  };

  const viewBuildingProps = {
    buildingViewData,
    showBuildingViewModal,
    setShowBuildingViewModal,
    clickedBuildingId,
    CountryAll,
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
    { value: '', label: 'Select Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  return (
    <>
      <Helmet title={"Building | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Buildings</h5>
              </div>
              {viewType !== "ViewById" && showOption.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => setShowBuildingModal(true)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add Buildings
                  </button>
                </div>
              ) : ""
              }
              <div className="col-lg-12 pd-0">
                <Form className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >

                  <div className="user-info-90 row">
                    {/* client */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select client name</h6>
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
                              options={ClientName}
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
                            // components={{
                            //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            // }}
                            // value={selectedCountry}
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
                      <h6 className="label-search">Select building name</h6>
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

        <CommonDataTable {...AddBuildingListProps} />
        <AddBuilding
          {...addBuildingProps}
          onHide={() => setShowBuildingModal(false)}
        />


        <EditBuilding
          {...editBuildingProps}
          onHide={() => setshowBuildingEditModal(false)}
        />

        <ViewBuilding {...viewBuildingProps} />
      </div>
    </>
  );
}
export default BuildingList;
