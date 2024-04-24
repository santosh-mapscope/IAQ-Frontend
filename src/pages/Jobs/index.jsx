/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useHistory } from 'react-router-dom';
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AddEditModal, UploadCSV, ViewJobModal } from "./JobHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { Form } from "react-bootstrap";
import {
  PiTrashBold,
  PiGearBold,
  PiPenBold,
  PiNotePencilBold,
  PiEyeBold,
  PiFileBold
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
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from 'recoil';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { format } from 'date-fns';
// import enIN from 'date-fns/locale/en-IN';
import { useNavigate, Link } from "react-router-dom";
import enCA from 'date-fns/locale/en-CA';
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// Register the locale
registerLocale('en-CA', enCA);

// Set the default locale
setDefaultLocale('en-CA');

function JobList(props) {
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
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
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);
  const [job, setJob] = useState([]);
  const [jobDetails, setJobDetails] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [province, setProvience] = useState([]);
  const [city, setCity] = useState([]);
  const [client, setClient] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryForAddJob, setCountryForAddJob] = useState("");

  const [building, setBuilding] = useState([]);

  const [filterProvince, setFilterProvince] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [resetFlag, setResetFlag] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [equipemnetDetails, setequipemnetDetails] = useState('');
  const [filterStartDate, filterEndDate] = dateRange;


  const [editData, setEditData] = useState("");
  const [viewData, setViewData] = useState("");
  const { register, handleSubmit, control, reset, setValue } = useForm();


  const fetchJobs = async (
    page = globalPage.current,
    size = globalPerPage.current,
    startDate = filterStartDate,
    endDate = filterEndDate
  ) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    // if (countryId !== "") formData.append("countryId", countryId);
    // if (provinceId !== "") formData.append("provinceId", provinceId);
    // if (cityId !== "") formData.append("cityId", cityId);
    // if (startDate !== null) formData.append("startDate", format(startDate, 'yyyy-MM-dd', { locale: enCA }));
    // if (endDate !== null) formData.append("endDate", format(endDate, 'yyyy-MM-dd', { locale: enCA }));

    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }

    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
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
    if (globalFilters.current.jobId) {
      formData.append("jobId", globalFilters.current.jobId);
    }
    if (startDate !== null) formData.append("startDate", format(startDate, 'yyyy-MM-dd', { locale: enCA }));
    if (endDate !== null) formData.append("endDate", format(endDate, 'yyyy-MM-dd', { locale: enCA }));
    if (globalFilters.current.status != null) {
      formData.append("status", globalFilters.current.status);
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

    if (data.jobId && data.jobId.value !== "") {
      filters.jobId = data.jobId.value;
    }

    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }
    globalFilters.current = filters;
    // Reset page to 1 and fetch data
    globalPage.current = 1;
    setCurrentPage(1);
    fetchJobs(1);
  };

  const getJob1 = () => {
    const formData = new FormData();
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    axiosInstance
      .post("client/getAllJobDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setJob([]);
        if (res && res.data.status === 1) {
          setJob(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
       
      });

  };

  const getAllCountryDD = async () => {
    let formData = new FormData();

    // if (filterProvince !== "") {
    //   formData.append("provinceId", filterProvince);
    // }
    // if (filterCity != "") {
    //   formData.append("cityId", filterCity);
    // }
    // if (filterClient != "") {
    //   formData.append("clientId", filterClient);
    // }
    // if (filterBuilding != "") {
    //   formData.append("buildingId", filterBuilding);
    // }
    if (globalFilters.current && globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    axiosInstance
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
        setCountryForAddJob(res.data.data.list)

      })
      .catch((err) => { });
  };

  const getAllProvinceDD = async () => {
    let formData = new FormData();
    // if (filterCountry != "") {
    //   formData.append("countryId", filterCountry);
    // }
    // if (filterCity != "") {
    //   formData.append("cityId", filterCity);
    // }
    // if (filterClient != "") {
    //   formData.append("clientId", filterClient);
    // }
    // if (filterBuilding != "") {
    //   formData.append("buildingId", filterBuilding);
    // }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setProvience(data);
        // if (data && (data.length > 0 && data.length < 3)) {
        //   reset({
        //     filterProvince: data[1] // Add another field with its default value
        //   });
        // }
        // else {
        //   reset({
        //     filterProvince: "" // Add another field with its default value
        //   });
        // }
      })
      .catch((err) => { });
  };

  const getAllCityDD = async () => {
    let formData = new FormData();
    // if (filterCountry != "") {
    //   formData.append("countryId", filterCountry);
    // }
    // if (filterProvince != "") {
    //   formData.append("provinceId", filterProvince);
    // }

    // if (filterClient != "") {
    //   formData.append("clientId", filterClient);
    // }
    // if (filterBuilding != "") {
    //   formData.append("buildingId", filterBuilding);
    // }
    // formData.append("clientId", globalFilters.current?.clientId ?? "");
    // if (globalFilters.current.countryId) {
    //   formData.append("countryId", globalFilters.current.countryId);
    // }
    if (globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    // if (globalFilters.current.cityId) {
    //   formData.append("cityId", globalFilters.current.cityId);
    // }
    if (globalFilters.current.provinceId) {
      formData.append("provinceId", globalFilters.current.provinceId);
    }

    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        setCity("");
        const data = [
          { value: "", label: "Select City ", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName,
          })),
        ];
        setCity(data);
        // if (data && (data.length > 0 && data.length < 3)) {
        //   reset({
        //     filterCity: data[1] // Add another field with its default value
        //   });
        // }
        // else {
        //   reset({
        //     filterCity: "" // Add another field with its default value
        //   });
        // }
      })
      .catch((err) => { });
  };

  const getAllClientDD = async () => {
    let formData = new FormData();

    // if (clickedClientId) {
    //   formData.append("clientId", clickedClientId);
    // }
    // if (filterCountry != "") {
    //   formData.append("countryId", filterCountry);
    // }
    // if (filterProvince != "") {
    //   formData.append("provinceId", filterProvince);
    // }
    // if (filterCity != "") {
    //   formData.append("cityId", filterCity);
    // }
    // if (filterClient != '') {
    //   formData.append("clientId", filterClient);
    // }
    // if (filterBuilding != "") {
    //   formData.append("buildingId", filterBuilding);
    // }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
     
    }

    // else if (globalFilters.current.clientId) {
    //   formData.append("clientId", globalFilters.current.clientId);
    // }
    // if (globalFilters.current.cityId) {
    //   formData.append("cityId", globalFilters.current.cityId);
    // }
    // if (globalFilters.current.provinceId) {
    //   formData.append("provinceId", globalFilters.current.provinceId);
    // }
    // if (globalFilters.current.countryId) {
    //   formData.append("countryId", globalFilters.current.countryId);
    // }





    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClient(data);
        // if (data && (data.length > 0 && data.length < 3)) {
        //   reset({
        //     filterClient: data[1] // Add another field with its default value
        //   });
        // }
        // else {
        //   reset({
        //     filterClient: "" // Add another field with its default value
        //   });
        // }
      })
      .catch((err) => { });
  };

  const getAllBuildingDD = async () => {
    let formData = new FormData();
    // if (filterCountry != "") {
    //   formData.append("countryId", filterCountry);
    // }
    // if (filterProvince != "") {
    //   formData.append("provinceId", filterProvince);
    // }
    // if (filterCity != "") {
    //   formData.append("cityId", filterCity);
    // }
    // if (filterClient != "") {
    //   formData.append("clientId", filterClient);
    // }

    // if (globalFilters.current.countryId) {
    //   formData.append("countryId", globalFilters.current.countryId);
    // }
    if (globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    // if (globalFilters.current.cityId) {
    //   formData.append("cityId", globalFilters.current.cityId);
    // }
    // if (globalFilters.current.provinceId) {
    //   formData.append("provinceId", globalFilters.current.provinceId);
    // }


    // formData.append("clientId", globalFilters.current?.clientId ?? "");
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuilding(data);
        // if (data && (data.length > 0 && data.length < 3)) {
        //   reset({
        //     filterBuilding: data[1] // Add another field with its default value
        //   });
        // }
        // else {
        //   reset({
        //     filterBuilding: "" // Add another field with its default value
        //   });
        // }
      })
      .catch((err) => { });
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
    getAllCountryDD();
    // getAllProvinceDD();
    // getAllCityDD();
    getAllClientDD();
    // getAllBuildingDD();
    getJob1();
    fetchJobs(1);
  }, []);


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
      jobId: ""
      // Add other fields you want to reset here
    };
    setCountry([]);
    setProvience([]);
    setCity([]);
    setBuilding([]);
    setDateRange([null, null]);

    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };
    getJob1();
    fetchJobs(1);
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


  const columns = useMemo(
    () => [
      {
        name: "Sl no",
        width: "8%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.slNo}`}>{row.slNo}</Tooltip>}
          >
            <span className="mg-b-0">{row.slNo}</span>
          </OverlayTrigger>
        ),
        sortable: true,
      },
      {
        name: "Project Number",
        width: "15%",
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
        name: "Client Name",
        selector: (row) => row.clientName,
        sortable: true,
        // cell: (row) => row.clientName,
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
      //   selector: (row) => row.buildingName,
      //   sortable: true,
      //   // cell: (row) => row.buildingName,
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
        selector: (row) => row.buildingName,
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.buildingName}`}>
              {row.buildingName} at {`${row.address2 ? row.address1 + ',' + row.address2 : row.address1}`}
            </Tooltip>}
          >
            <span className="mg-b-0">{row.buildingName}</span>
          </OverlayTrigger>
        ),
      },

      {
        name: "City Name",
        selector: (row) => row.cityName,
        sortable: true,
        // cell: (row) => row.cityName,
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
        name: "Province Name",
        selector: (row) => row.provinceName,
        sortable: true,
        // cell: (row) => row.provinceName,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.provinceName}`}>{row.provinceName}</Tooltip>}
          >
            <span className="mg-b-0">{row.provinceName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Job Date",
        selector: (row) => row.dateAssignedChar,
        sortable: true,
        // cell: (row) => row.dateAssignedChar,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.dateAssignedChar}`}>{row.dateAssignedChar}</Tooltip>}
          >
            <span className="mg-b-0">{row.dateAssignedChar}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.isActive,
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
              {row.isActive ? (
                userData.access.isEdit ? (
                  <Dropdown.Item onClick={() => onEdit(row.jobId)} className="fz-2">
                    <PiNotePencilBold className="user-icon " />
                    Edit Job
                  </Dropdown.Item>
                ) : ""
              ) : null}
              {row.isActive ? (
                userData.access.isAdd ? (
                  <Dropdown.Item
                    onClick={() => onUpload(row.jobId)}
                    className="fz-2"
                  >
                    <PiNotePencilBold className="user-icon " />
                    Upload CSV
                  </Dropdown.Item>
                ) : ""
              ) : null}
              {row.isActive ? (
                userData.access.isView ? (
                  <Dropdown.Item onClick={() => onView(row.jobId)} className="fz-2">
                    <PiEyeBold className="user-icon" /> View job
                  </Dropdown.Item>
                ) : ""
              ) : null}
              {row.isActive ? (
                <Dropdown.Item onClick={() => generateReportPage(row.jobId)} className="fz-2">
                  <PiFileBold className="user-icon" />Generate Report
                </Dropdown.Item>

              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );
  const getStatusText = (row) => {
    return row.isActive ? "Active" : "Inactive";
  };
  const handlePageChange = (page) => {
    // alert(page)
    // fetchJobs(page);
    // setCurrentPage(page);
    // submitButtonRef.current.click();
    globalPage.current = page;
    setCurrentPage(page);
    fetchJobs(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchJobs(page, newPerPage);
    // submitButtonRef.current.click();

  };
  const handleClientChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterBuilding", "");
    setValue("jobId", "");
    setDateRange([null, null]);
    setFilterClient(data); // Update the ClientId when the select input changes
    getAllCountryDD();
    getAllBuildingDD();
    getJob1();
  };
  const handleCountryChange = (data) => {
    setFilterCountry(data); // Update the CountryId when the select input changes
    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.value
    };

    getAllProvinceDD();
  };
  const handleProvinceChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.value
    };

    setFilterProvince(data); // Update the ProvienceId when the select input changes
    getAllCityDD();
  };
  const handleCityChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.value
    };
    setFilterCity(data); // Update the CityId when the select input changes
    getAllBuildingDD();
  };
  const handleBuildingChange = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      buildingId: data.value
    };
    setDateRange([null, null]);
    // setValue("jobId", "");
    setFilterBuilding(data); // Update the BuildingId when the select input changes
  };
  const handleCloseJobModal = () => {
    setEditData("");
    setShowAddJobModal(false);
    fetchJobs(currentPage);
  };
  const closeViewModal = () => {
    setShowJobViewModal(false);
    fetchJobs(currentPage);
  };

  const handleCloseUploadCSVModal = () => {
    setShowUploadCSVModal(false);
    fetchJobs(currentPage);
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
              title: "Already uploaded",
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
        
          setViewData(res.data.data.list);
          setShowJobViewModal(true)
          setequipemnetDetails(res.data.data.clientJobDeviceMapDtos)
        }
      })
  }
  const generateReportPage = async (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("jobId", id);
    await axiosInstance
      .post("job/getJobById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          setClickedJobId(id);
          toast.dismiss();
         
          setReportDetails(res.data.data.list);
          const propsToPass = {
            nameofClient: res.data.data.list.clientName,
            clientnameid: res.data.data.list.clientId,
            // nameofBuilding: res.data.data.list.buildingName +" "+ "at "+res.data.data.list.address1,
            nameofBuilding: res.data.data.list.buildingName + (res.data.data.list.address1 ? " at " + res.data.data.list.address1 : ""),
            buildingnmaeid: res.data.data.list.buildingId,
            nameofJob: res.data.data.list.projectNumber,
            jobnameid: res.data.data.list.jobId
          };
          navigate('/manageReports/generate-report', { state: propsToPass });
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
    handleCloseJobModal,
    countryForAddJob,
    editData,
    setFullPageLoading
  };

  const editJobProps = {
    showJobEditModal,
    handleCloseJobModal,
    countryForAddJob,
    editData,
    setFullPageLoading
  };
  const viewJobProps = {
    equipemnetDetails,
    viewData,
    showJobViewModal,
    closeViewModal,
    clickedJobId,
    setFullPageLoading
    // roles,
  };

  const uploadCsvProps = {
    showUploadCSVModal,
    handleCloseUploadCSVModal,
    jobDetails,
    setFullPageLoading
  };
  const generateReport = {
    showUploadCSVModal,
    handleCloseUploadCSVModal,
    jobDetails,
    setFullPageLoading
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
  const optionsForStatus = [
    { value: '', label: 'Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];
  const handelJobChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      jobId: data.target.value.value,
    };
  }
  return (
    <>

      {!clickedBuildingId ? <Helmet title={"Upload CSV Management | IAQ Reporting System"} /> : null}
      {isFullPageLoading && <CircularLoader />}
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
                <Form className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >

                  <div className="user-info-90 row">
                    {/* client */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Client</h6>
                      <Controller
                        control={control}
                        name="filterClient"
                        {...register("filterClient")}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            placeholder="Client"
                            name="filterClient"
                            onChange={(e) => {
                              field.onChange(e);
                              handleClientChange(e);
                            }}
                            clearButton

                          />
                        )}
                      />
                    </div>
                    {/* country */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Country</h6>
                      <Controller
                        control={control}
                        name="filterCountry"
                        {...register("filterCountry")}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={country}
                            placeholder="Country"
                            name="filterCountry"
                            onChange={(e) => {
                              field.onChange(e);
                              handleCountryChange(e);
                            }}
                            clearButton

                          />
                        )}
                      />
                    </div>
                    {/* province */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Province</h6>
                      <Controller
                        control={control}
                        name="filterProvince"
                        {...register("filterProvince")}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={province}
                            placeholder="Province"
                            name="filterProvince"
                            onChange={(e) => {
                              field.onChange(e); // Update the form state
                              handleProvinceChange(e); // Call handleProvinceChange
                            }}
                            clearButton

                          />
                        )}
                      />
                    </div>
                    {/* city */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select City</h6>
                      <Controller
                        control={control}
                        name="filterCity"
                        {...register("filterCity")}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={city}
                            placeholder="City"
                            name="filterCity"
                            onChange={(e) => {
                              field.onChange(e);
                              handleCityChange(e);
                            }}
                            clearButton

                          />
                        )}
                      />
                    </div>
                    {/* building */}
                    <div className="col-sm-3 col-12 mt-4">
                      <h6 className="label-search">Select Building</h6>
                      <Controller
                        control={control}
                        name="filterBuilding"
                        {...register("filterBuilding")}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={building}
                            placeholder="Building"
                            name="filterBuilding"
                            onChange={(e) => {
                              field.onChange(e);
                              handleBuildingChange(e);
                            }}
                            clearButton

                          />
                        )}
                      />
                    </div>
                    {/* date */}
                    <div className="col-sm-2 col-12 mt-4">
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
                    {/* job */}
                    <div className="col-sm-2 col-12 mt-4">
                      <h6 className="label-search">Select job</h6>
                      <Controller
                        control={control}
                        name="jobId"
                        {...register("jobId", {
                          onChange: (data) => handelJobChange(data)
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Job", isDisabled: true }, // Add a default option
                              ...job.map((cntr) => ({
                                value: cntr.id,
                                label: cntr.projectNumber,
                              })),
                            ]}
                            placeholder="Job"
                            name="jobId"
                          // components={{
                          //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                          // }}
                          />
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
                    <div className="col-sm-2 col-12 mt-4">
                      <h6 className="label-search">Search/Reset</h6>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        {/* <button
                        type="button"
                        ref={submitButtonRef}
                        onClick={() => handleSubmit(searchSubmit)}
                        className="btn btn-white"
                      >
                        <RxMagnifyingGlass />
                      </button> */}
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
        <UploadCSV
          {...uploadCsvProps}
          onHide={() => setShowUploadCSVModal(false)}
        />


      </div>
    </>
  );
}
export default JobList;