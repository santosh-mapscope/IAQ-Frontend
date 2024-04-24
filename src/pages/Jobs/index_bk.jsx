/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";

import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddEditModal, UploadCSV, ViewJobModal } from "./JobHelper";
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
import { Dropdown, Form } from "react-bootstrap";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
} from "../../util/customToast/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { format } from 'date-fns';
// import enIN from 'date-fns/locale/en-IN';
import { useNavigate } from "react-router-dom";
import enCA from 'date-fns/locale/en-CA';

// Register the locale
registerLocale('en-CA', enCA);

// Set the default locale
setDefaultLocale('en-CA');

function JobList(props) {
  const submitButtonRef = useRef(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userAtom);
  const { type, clickedClientId, viewType, parentName, clickedBuildingId } = props;
  const [clickedJobId, setClickedJobId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showJobEditModal, setShowJobEditModal] = useState(false);
  const [showUploadCSVModal, setShowUploadCSVModal] = useState(false);
  const [showJobViewModal, setShowJobViewModal] = useState(false);

  // const [status, setStatus] = useState('');
  const [roleId, setRoleId] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  // const [province, setProvience] = useState([]);
  // const [city, setCity] = useState([]);
  // const [client, setClient] = useState([]);
  // const [country, setcountry] = useState([]);
  // const [building, setBuilding] = useState([]);

  const [filterProvince, setFilterProvince] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [resetFlag, setResetFlag] = useState(false);
  // const [filterStartDate, setFilterStartDate] = useState(null);
  // const [filterEndDate, setFilterEndDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [equipemnetDetails, setequipemnetDetails] = useState('');
  const [filterStartDate, filterEndDate] = dateRange;

  // -------------------------------

  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [clientId, setClientId] = useState("");
  const [buildingId, setBuildingId] = useState("");


  const [Country, setcountry] = useState([]);
  const [CountryAll, setCountryAll] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setCity] = useState([]);
  const [ClientName, setClient] = useState([]);
  const [BuildingName, setBuilding] = useState([]);
  // const [editBuildingData, seteditBuildingData] = useState("");

  // ------------------------------




  const [editData, setEditData] = useState("");
  const [viewData, setViewData] = useState("");

  const { register, handleSubmit, control, reset, getValues, setValue } = useForm();

  const getAllCountryDD = async () => {
    let formData = new FormData();
    if (filterProvince !== "") {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != "") {
      formData.append("cityId", filterCity);
    }
    if (filterClient != "") {
      formData.append("clientId", filterClient);
    }
    if (filterBuilding != "") {
      formData.append("buildingId", filterBuilding);
    }
    axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Select Country" },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setcountry(data1);
      })
      .catch((err) => { });
  };

  const getAllProvinceDD = async (clientId = filterClient) => {
    let formData = new FormData();
    if (filterCountry != "") {
      formData.append("countryId", filterCountry);
    }
    // if (filterProvince != ''){
    //   formData.append("provinceId", filterProvince);}
    if (filterCity != "") {
      formData.append("cityId", filterCity);
    }
    if (filterClient != "") {
      formData.append("clientId", filterClient);
    }
    if (filterBuilding != "") {
      formData.append("buildingId", filterBuilding);
    }

    axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province" },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setProvience(data);
      })
      .catch((err) => { });
  };

  const getAllCityDD = async () => {
    let formData = new FormData();
    if (filterCountry != "") {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != "") {
      formData.append("provinceId", filterProvince);
    }
    // if (filterCity != ''){
    //   formData.append("cityId", filterCity);}
    if (filterClient != "") {
      formData.append("clientId", filterClient);
    }
    if (filterBuilding != "") {
      formData.append("buildingId", filterBuilding);
    }
    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        setCity("");
        const data = [
          { value: "", label: "Select City " },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName,
          })),
        ];
        setCity(data);
      })
      .catch((err) => { });
  };

  const getAllClientDD = async () => {
    let formData = new FormData();
    if (filterCountry != "") {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != "") {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != "") {
      formData.append("cityId", filterCity);
    }
    // if (filterClient != ''){
    //   formData.append("clientId", filterClient);}
    if (filterBuilding != "") {
      formData.append("buildingId", filterBuilding);
    }

    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client" },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClient(data);
      })
      .catch((err) => { });
  };

  const getAllBuildingDD = async () => {
    let formData = new FormData();
    if (filterCountry != "") {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != "") {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != "") {
      formData.append("cityId", filterCity);
    }
    if (filterClient != "") {
      formData.append("clientId", filterClient);
    }
    // if (filterBuilding != ''){
    //   formData.append("buildingId", filterBuilding);}

    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + item.address1 
          })),
        ];
        setBuilding(data);
      })
      .catch((err) => { });
  };

  const fetchJobs = async (
    page,
    size = perPage,
    countryId = filterCountry,
    provinceId = filterProvince,
    cityId = filterCity,
    clientId = filterClient,
    buiddingId = filterBuilding,
    startDate = filterStartDate,
    endDate = filterEndDate
  ) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    if (countryId !== "") formData.append("countryId", countryId);
    if (provinceId !== "") formData.append("provinceId", provinceId);
    if (cityId !== "") formData.append("cityId", cityId);
    if (startDate !== null) formData.append("startDate", format(startDate, 'yyyy-MM-dd', { locale: enCA }));
    if (endDate !== null) formData.append("endDate", format(endDate, 'yyyy-MM-dd', { locale: enCA }));

    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    } else if (clientId !== "")
      formData.append("clientId", clientId);
    else {
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    } else if (buiddingId !== "")
      formData.append("buildingId", buiddingId);
    else {
    }

    axiosInstance
      .post("job/getJobList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };

  // const fetchJobs = (data) => {
  //   setLoading(true);
  //   let formData = new FormData();
  //   formData.append("page", 0);
  //   formData.append("size", perPage);
  //   formData.append("sortBy", "id");
  //   formData.append("sortOrder", "DESC");
  //   if (data.filterCountry?.value && data.filterCountry?.value > 0)
  //     formData.append("countryId", data.filterCountry?.value);
  //   if (data.filterProvince?.value && data.filterProvince?.value > 0)
  //     formData.append("provinceId", data.filterProvince?.value);
  //   if (data.filterCity?.value && data.filterCity?.value > 0)
  //     formData.append("cityId", data.filterCity?.value);
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   else if (data.filterClient?.value && data.filterClient?.value > 0)
  //     formData.append("clientId", data.filterClient?.value);
  //   if (filterStartDate !== null) formData.append("startDate", format(filterStartDate, 'yyyy-MM-dd', { locale: enCA }));
  //   if (filterEndDate !== null) formData.append("endDate", format(filterEndDate, 'yyyy-MM-dd', { locale: enCA }));
  //   if (data.filterBuilding && data.filterBuilding?.value > 0)
  //     formData.append("buildingId", data.filterBuilding?.value);

  //   axiosInstance
  //     .post("job/getJobList", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       setData(res.data.data.list);
  //       setTotalRows(res.data.data.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(true);
  //     });
  // };
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
    getAllCountryDD();
    getAllProvinceDD();
    getAllCityDD();
    getAllClientDD();
    getAllBuildingDD();
    fetchJobs(1);

    // getCountry();
    // getProvienced();
    // getCity();
    // getClientName();
    // getBuilding();
    // getAllCountry();

  }, []);

  const resetFilter = async () => {
    setFilterCountry("");
    setFilterProvince("");
    setFilterCity("");
    setFilterClient("");
    setFilterBuilding("");
    setDateRange([null, null]);
    setResetFlag(true);
    // submitButtonRef.current.click();
  };

  useEffect(() => {
    if (resetFlag) {
      resetDD();
      reset({
        filterCountry,
        filterProvince,
        filterCity,
        filterClient,
        filterBuilding,
      });
      fetchJobs(1, 10, "", "", "", "", "");
      setResetFlag(false);
    }
  }, [resetFlag]);
  useEffect(() => {
    if (
      filterBuilding !== "" &&
      filterCountry == "" &&
      filterProvince == "" &&
      filterCity == "" &&
      filterClient == ""
    ) {
      getAllCountryDD();
      getAllProvinceDD();
      getAllCityDD();
      getAllClientDD();
    } else if (
      filterClient !== "" &&
      filterCountry == "" &&
      filterProvince == "" &&
      filterCity == "" &&
      filterBuilding == ""
    ) {
      getAllCountryDD();
      getAllProvinceDD();
      getAllCityDD();
      getAllBuildingDD();
    } else if (
      filterCountry !== "" &&
      filterProvince !== "" &&
      filterCity !== "" &&
      filterClient !== "" &&
      filterBuilding == ""
    ) {
      getAllBuildingDD();
    } else if (
      filterCountry !== "" &&
      filterProvince !== "" &&
      filterCity !== "" &&
      filterClient == "" &&
      filterBuilding == ""
    ) {
      getAllClientDD();
    } else if (
      filterCountry !== "" &&
      filterProvince !== "" &&
      filterCity == "" &&
      filterClient == "" &&
      filterBuilding == ""
    ) {
      getAllCityDD();
    } else if (
      filterCountry !== "" &&
      filterProvince == "" &&
      filterCity == "" &&
      filterClient == "" &&
      filterBuilding == ""
    ) {
      getAllProvinceDD();
    }
  }, [filterCountry, filterProvince, filterCity, filterClient, filterBuilding]);

  const columns = useMemo(
    () => [
      {
        name: "Sl no",
        width: "8%",
        selector: (row) => row.slNo,
        sortable: true,
      },
      {
        name: "Project Number",
        width: "15%",
        selector: (row) => row.projectNumber,
        sortable: true,
      },
      {
        name: "Client Name",
        selector: (row) => row.clientName,
        sortable: true,
        cell: (row) => row.clientName,
      },
      {
        name: "Building Name",
        selector: (row) => row.buildingName,
        sortable: true,
        cell: (row) => row.buildingName,
      },
      {
        name: "City Name",
        selector: (row) => row.cityName,
        sortable: true,
        cell: (row) => row.cityName,
      },
      {
        name: "Province Name",
        selector: (row) => row.provinceName,
        sortable: true,
        cell: (row) => row.provinceName,
      },
      {
        name: "Job Date",
        selector: (row) => row.dateAssignedChar,
        sortable: true,
        cell: (row) => row.dateAssignedChar,
      },
      {
        name: "Status",
        selector: (row) => row.isActive,
        cell: (row) => (
          <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
            {row.isActive ? "Active" : "Inactive"}
          </div>
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
              {userData.access.isDelete ? (
                <Dropdown.Item
                  onClick={() => onDelete(row.jobId, row.isActive)}
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
              ) : ""}
              {userData.access.isEdit ? (
                <Dropdown.Item onClick={() => onEdit(row.jobId)} className="fz-2">
                  <PiNotePencilBold className="user-icon " />
                  Edit Job
                </Dropdown.Item>
              ) : ""}
              {userData.access.isAdd ? (
                <Dropdown.Item
                  onClick={() => onUpload(row.jobId)}
                  className="fz-2"
                >
                  <PiNotePencilBold className="user-icon " />
                  Upload CSV
                </Dropdown.Item>
              ) : ""}
              {userData.access.isView ? (
                <Dropdown.Item onClick={() => onView(row.jobId)} className="fz-2">
                  <PiEyeBold className="user-icon" /> View job
                </Dropdown.Item>
              ) : ""}
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page) => {
    // alert(page);
    fetchJobs(page);
    setCurrentPage(page);
    // submitButtonRef.current.click();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    console.log(
      "handlePerRowsChange called with",
      newPerPage,
      "rows per page and",
      page,
      "page"
    );
    try {
      fetchJobs(page, newPerPage);
      setPerPage(newPerPage);
      // submitButtonRef.current.click();
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCountryChange = (data) => {
    setFilterCountry(data); // Update the CountryId when the select input changes
    setFilterProvince("");
    setFilterCity("");
    setFilterClient("");
    setFilterBuilding("");
    // setStatus("");
    reset({ filterProvince, filterCity, filterClient, filterBuilding });
    getAllProvinceDD();
  };
  const handleProvinceChange = (data) => {
    setFilterProvince(data); // Update the ProvienceId when the select input changes
    setFilterCity("");
    setFilterClient("");
    setFilterBuilding("");
    // setStatus("");
    reset({ filterCity, filterClient, filterBuilding });
    getAllCityDD();
  };
  const handleCityChange = (data) => {
    setFilterCity(data); // Update the CityId when the select input changes
    setFilterClient("");
    setFilterBuilding("");
    // setStatus("");
    reset({ filterClient, filterBuilding });
    getAllClientDD();
  };
  const handleClientChange = (data) => {
    setFilterClient(data); // Update the ClientId when the select input changes
    setFilterBuilding("");
    // setStatus("");
    reset({ filterBuilding });
    getAllCountryDD();
    getAllBuildingDD();
  };
  const handleBuildingChange = (data) => {
    // alert(getValues("filterBuilding").value);
    // setValue("filterCity", '')
    setFilterBuilding(data); // Update the BuildingId when the select input changes
  };

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value); // Update the status when the select input changes
  // };

  const handleCloseJobModal = () => {
    setEditData("");
    setShowAddJobModal(false);
    fetchJobs(1);
  };
  const closeViewModal = () => {
    setShowJobViewModal(false);
    fetchJobs(1);
  };

  const handleCloseUploadCSVModal = () => {
    setShowUploadCSVModal(false);
    fetchJobs(1);
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
        formData.append("jobId", id);
        axiosInstance
          .post("job/deactivateJob", formData, { headers: headersForJwt })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Job successfully " + (active ? "Inactivate" : "Activate"),
              showConfirmButton: false,
              timer: 2000,
            });
            fetchJobs(currentPage);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Job " + (active ? "Inactivate" : "Activate") + " failed",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    });
  };

  const onAdd = async () => {
    setShowAddJobModal(true);
    setEditData(null);
  };

  const onEdit = async (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("jobId", id);
    await axiosInstance
      .post("job/getJobById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          toast.dismiss(toastId);
          // setJobDetails(res.data.data.list);
          // setShowJobEditModal(true);
          setEditData(res.data.data);
          setShowAddJobModal(true);
         
        } else {
          ErrorToastWithToastId("Action Failed..", toastId);
        }
      })
      .catch((err) => {
        ErrorToastWithToastId("Action Failed..", toastId);
       
      });
  };

  const onUpload = async (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("jobId", id);
    await axiosInstance
      .post("job/getJobById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          toast.dismiss(toastId);
          if (res.data.data.list.testDateChar !== null) {
            Swal.fire({
              title: "Already Uploaded",
              text: "Would you like to deactivate the original CSV and upload a new CSV for this job?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Go To CSV List",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/uploadCSV");
              } else {
                return false;
              }
            });
          } else {
            setJobDetails(res.data.data.list);
            setShowUploadCSVModal(true);
          }

        } else {
          ErrorToastWithToastId("Action Failed..", toastId);
        }
      })
      .catch((err) => {
        ErrorToastWithToastId("Action Failed..", toastId);
       
      });

    // const toastId = toast.loading("Loading...");
    // let formData = new FormData();
    // formData.append("jobId", id);
    // axiosInstance
    //   .post("master/getJobById", formData, { headers: headersForJwt })
    //   .then((res) => {
    //     if (res.data.status === 1) {
    //       toast.dismiss();
    //       setJobDetails(res.data.data.list);
    //       setShowUploadCSVModal(true);
    //     } else {
    //       ErrorToastWithToastId("Action Failed..", toastId);
    //     }
    //   })
    //   .catch((err) => {
    //     ErrorToastWithToastId("Action Failed..", toastId);
    //  
    //   });
  };
  const onView = async (id) => {
   
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("jobId", id);
    await axiosInstance
      .post("job/getJobById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          setClickedJobId(id);
          toast.dismiss();
          // setJobDetails(res.data.data.list);
          // setShowJobEditModal(true);
          setViewData(res.data.data.list);
          setShowJobViewModal(true);

          setequipemnetDetails(res.data.data.clientJobDeviceMapDtos)
        
        }
      })
  }

  const resetDD = async () => {
    getAllCountryDD();
    getAllProvinceDD();
    getAllCityDD();
    getAllClientDD();
    getAllBuildingDD();
  };

  const addJobProps = {
    showAddJobModal,
    // showEditJobModal,
    handleCloseJobModal,
    CountryAll,
    editData,
  };

  const editJobProps = {
    // showAddJobModal,
    showJobEditModal,
    handleCloseJobModal,
    CountryAll,
    editData,
  };
  const viewJobProps = {
    // showAddJobModal,
    // showJobEditModal,
    // handleCloseJobModal,
    // country,
    equipemnetDetails,
    viewData,
    showJobViewModal,
    closeViewModal,
    clickedJobId
    // roles,
  };

  const uploadCsvProps = {
    showUploadCSVModal,
    handleCloseUploadCSVModal,
    jobDetails,
  };

  const JobListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
    // perPage
  };
  // -------------------------------------

  // const getAllCountry = () => {
  //   let formData = new FormData();
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   if (clickedBuildingId) {
  //     formData.append("buildingId", clickedBuildingId);
  //   }

  //   setLoading(true);
  //   axiosInstance
  //     .post("client/getAllCountryDD", formData, {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //      
  //       if (res && res.data.status === 1) {
  //       
  //         setCountryAll(res.data.data.list);
  //         setLoading(false);
  //       }

  //       return false;
  //     })
  //     .catch((err) => {
  //    
  //     });
  // };
  // const getProvienced = async (value) => {
  //   let formData = new FormData();
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   await axiosInstance
  //     .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Province Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.provinceId.toString(), // Convert id to string, if needed
  //           label: item.provinceName,
  //         })),
  //       ];
  //       setProvience(data);
  //     })
  //     .catch((err) => { });
  // };
  // const getCity = async (value = null) => {
  //   // alert(value)
  //   let formData = new FormData();
  //   if (value !== null) {
  //     formData.append("provinceId", value);
  //   }
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   await axiosInstance
  //     .post("client/getAllCityDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select City Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.cityId.toString(), // Convert id to string, if needed
  //           label: item.cityName,
  //         })),
  //       ];
  //       setCity(data);
  //     })
  //     .catch((err) => { });
  // };
  // const getClientName = async (value) => {
  //   let formData = new FormData();
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   await axiosInstance
  //     .post("client/getAllClientDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Client Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.clientId.toString(), // Convert id to string, if needed
  //           label: item.clientName,
  //         })),
  //       ];
  //       setClientName(data);
  //     })
  //     .catch((err) => { });
  // };

  // const getBuilding = async () => {
  //   let formData = new FormData();
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   // alert()
  //   axiosInstance
  //     .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Building Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.id.toString(), // Convert id to string, if needed
  //           label: item.name,
  //         })),
  //       ];
  //       setBuildingName(data);
  //     })
  //     .catch((err) => { });
  // };

  // const DependentDD = async (countryId, provinceId, CityId, ClientId, buildingId, is_country_select = false, is_province_select = false, is_city_select = false, is_client_select = false, is_building_select = false) => {

  //   let formData = new FormData();

  //   if (countryId !== '') {
  //     formData.append("countryId", countryId);
  //   }

  //   if (CityId !== '') {
  //     formData.append("cityId", CityId);
  //   }
  //   if (ClientId !== '') {
  //     formData.append("clientId", ClientId);
  //   }
  //   if (provinceId !== '') {
  //     formData.append("provinceId", provinceId);
  //   }
  //   if (buildingId !== '') {
  //     formData.append("buildingId", buildingId);
  //   }
  //   let defaultValues = {};
  //   await axiosInstance
  //     .post("client/getAllCountryDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data1 = [
  //         { value: "", label: "Select Country Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.countryId.toString(),
  //           label: item.countryName,
  //         })),
  //       ];
  //       setCountry(data1);

  //       if (data1 && (data1.length > 0 && data1.length < 3)) {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterCountry: data1[1], // Add another field with its default value
  //         };
  //       }
  //       else {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterCountry: "", // Add another field with its default value
  //         };
  //       }
  //     })
  //     .catch((err) => { });


  //   await axiosInstance
  //     .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Province Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.provinceId.toString(),
  //           label: item.provinceName,
  //         })),
  //       ];
  //       setProvience(data);

  //       if (data && (data.length > 0 && data.length < 3)) {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterProvince: data[1], // Add another field with its default value
  //           // Add more fields dynamically as needed
  //         };
  //       }
  //       else {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterProvince: "", // Add another field with its default value
  //         };
  //       }
  //     })
  //     .catch((err) => { });

  //   await axiosInstance
  //     .post("client/getAllCityDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select City Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.cityId.toString(),
  //           label: item.cityName,
  //         })),
  //       ];
  //       setCity(data);

  //       if (data.length > 0 && data.length < 3) {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterCity: data[1], // Add another field with its default value
  //           // Add more fields dynamically as needed
  //         };
  //       }
  //       else {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterCity: "", // Add another field with its default value
  //         };
  //       }
  //     })
  //     .catch((err) => { });

  //   await axiosInstance
  //     .post("client/getAllClientDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data = [
  //         { value: "", label: "Select Client Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.clientId.toString(),
  //           label: item.clientName,
  //         })),
  //       ];
  //       setClientName(data);

  //       if (data.length > 0 && data.length < 3) {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterClient: data[1],
  //         };
  //       }
  //       else {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterClient: "", // Add another field with its default value
  //         };
  //       }
  //     })
  //     .catch((err) => { });
  //   axiosInstance
  //     .post("building/getAllBuildingByClientId", formData, { headers: headersForJwt })
  //     .then((res) => {

  //       const data = [
  //         { value: "", label: "Select Building Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.buildingId.toString(), // Convert id to string, if needed
  //           label: item.buildingName,
  //         })),
  //       ];
  //       setBuildingName(data);
  //    
  //       if (data.length > 0 && data.length < 9) {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterBuilding: data[1],
  //         };
  //       }
  //       else {
  //         defaultValues = {
  //           ...defaultValues, // Spread the existing values
  //           filterBuilding: "", // Add another field with its default value
  //         };
  //       }
  //     })
  //     .catch((err) => { });
  //   reset(defaultValues);
  //   getCountry()
  // };
  // const getCountry = async () => {
  //   let formData = new FormData();
  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   if (clickedBuildingId) {
  //     formData.append("buildingId", clickedBuildingId);
  //   }
  //   await axiosInstance
  //     .post("client/getAllCountryDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       const data1 = [
  //         { value: "", label: "Select Country Name" },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.countryId.toString(), // Convert id to string, if needed
  //           label: item.countryName,
  //         })),
  //       ];
  //       setCountry(data1);
  //     
  //     })
  //     .catch((err) => { });
  // };
  // const handelClientName = (data) => {

  //   if (data.target.value.value === '') {
  //     DependentDD('', '', '', data.target.value.value, '', false, false, false, true, false);
  //   }
  //   else {
  //     DependentDD(countryId, provinceId, cityId, data.target.value.value, "", false, false, false, true, false);

  //   }
  //   setClientId(data.target.value.value);
  // }
  // const handelBuildingChange = (data) => {
  //   
  //   if (data.target.value.value === '') {
  //     DependentDD('', '', '', '', data.target.value.value, false, false, false, false, true);
  //   }
  //   else {
  //     DependentDD(countryId, provinceId, cityId, "", data.target.value.value, false, false, false, false, true);
  //   }

  //   // setBuildingId(data.target.value.value);
  //   setBuildingId(data.target.value.label === 'Select Building Name' ? "" : data.target.value.label);
  //   setClientId(data.target.value.value);

  // }
  // const handelCityName = (data) => {

  //   if (data.target.value.value === '') {
  //     DependentDD('', '', data.target.value.value, '', '', false, false, false, false, false);
  //   }
  //   else {
  //     DependentDD(countryId, provinceId, data.target.value.value, "", buildingId, false, false, true, false, false);

  //   }
  //   // alert()
  //   setCityId(data.target.value.value);
  //   setClientId("");

  // }
  // const handelProvienceChange = (data) => {
  //   if (data.target.value.value === '') {
  //     DependentDD('', data.target.value.value, '', '', '', false, false, false, false, false);
  //   }
  //   else {
  //     DependentDD(countryId, data.target.value.value, "", clientId, buildingId, false, true, false, false, false);

  //   }
  //   setProvinceId(data.target.value.value);
  // }
  // const handelCountryChange = (data) => {

  //   if (data.target.value.value === '') {
  //     DependentDD(data.target.value.value, '', '', '', '', false, false, false, false, false);
  //   }
  //   else {
  //     DependentDD(data.target.value.value, "", "", "", "", true, false, false, false, false);

  //   }
  //   setCountryId(data.target.value.value);

  // }
  return (
    <>
      <Helmet title={"Job Management | IAQ Reporting System"} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                {/* <p>Hi, Welcome to Job Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Jobs</h5>
              </div>
              {viewType !== "ViewById" && userData.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => onAdd()}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add Job
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="col-lg-12 pd-0">
                <Form className="user-info mt-4 mb-4"
                  onSubmit={handleSubmit(fetchJobs)}>
                  {/* client */}
                  <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                    <h6 className="label-search">Select Client Name</h6>
                    <Controller
                      control={control}
                      name="filterClient"
                      {...register("filterClient", {
                        onChange: (data) => handleClientChange(data.target.value.value)
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
                  <div className="user-info-inner col-lg-1 col-md-12 pd-0">
                    <h6 className="label-search">Select Country</h6>
                    <Controller
                      control={control}
                      name="filterCountry"
                      {...register("filterCountry", {
                        onChange: (data) => handleCountryChange(data.target.value.value),
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={Country}
                            placeholder="Country Name"
                            name="filterCountry"
                            // value={Country.length === 2 ? Country[1] : null}
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          // value={selectedCountry}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* province */}
                  <div className="user-info-inner col-lg-1 col-md-12 pd-0">
                    <h6 className="label-search">Select Province</h6>
                    <Controller
                      control={control}
                      name="filterProvince"
                      {...register("filterProvince", {
                        onChange: (data) => handleProvinceChange(data.target.value.value)
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
                  <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                    <h6 className="label-search">Select City</h6>
                    <Controller
                      control={control}
                      name="filterCity"
                      {...register("filterCity", {
                        onChange: (data) => handleCityChange(data.target.value.value)
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
                  <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                    <h6 className="label-search">Select Building Name</h6>
                    <Controller
                      control={control}
                      name="filterBuilding"
                      {...register("filterBuilding", {
                        onChange: (data) => handleBuildingChange(data.target.value.value)

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
                  {/* date */}
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

                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <button
                      type="button"
                      // ref={submitButtonRef}
                      onClick={() => handleSubmit(fetchJobs(1,10))}
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
                </Form>
              </div>
            </div>
          </div>
        </div>

        <CommonDataTable {...JobListProps} />
        <AddEditModal
          {...addJobProps}
          onHide={() => setShowAddJobModal(false)}
        />
        <AddEditModal
          {...editJobProps}
          onHide={() => setShowJobEditModal(false)}
        />
        <ViewJobModal
          {...viewJobProps}
          onHide={() => setShowJobViewModal(false)}
        />
        <UploadCSV
          {...uploadCsvProps}
          onHide={() => setShowUploadCSVModal(false)}
        />


      </div>
    </>
  );
}
export default JobList;
