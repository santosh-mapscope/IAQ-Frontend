/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, Component, useEffect, useRef, useMemo } from "react";
import { Col, Button, Row, Form, Modal } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { Helmet } from "react-helmet";
import {
  PiGearBold,
  PiNotePencilBold,
  PiDownloadSimpleBold,
  PiUploadSimpleBold,
  PiTrashBold,
  PiEyeBold,
} from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import Swal from "sweetalert2";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../../util/customToast/index";

import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enIN from "date-fns/locale/en-IN";
import { format } from "date-fns";
import ExternalDocumentModal from "./ExternalDocumentModal";
import IAQDocumentModal from "./IAQDocumentModal";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


import { OverlayTrigger, Tooltip } from "react-bootstrap";
function Report(props) {

  const navigate = useNavigate();
  const { type, clickedClientId, viewType, parentName, clickedBuildingId } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [nameForSeachDD, setNameForSeachDD] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);


  // const [CountryAll, setCountryAll] = useState([]);
  const [province, setProvince] = useState([]);
  // const [city, setCity] = useState([]);
  const [Client, setClient] = useState([]);
  // const [buildingName, setBuildingName] = useState([]);
  const [job, setJob] = useState([]);
  const [templates, setTemplates] = useState([]);

  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);
  //Report
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [showIAQModal, setShowIAQModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [filterStartDate, filterEndDate] = dateRange;

  // -------------------------------

  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [clientId, setClientId] = useState("");
  const [buildingId, setBuildingId] = useState("");


  const [Country, setCountry] = useState([]);
  const [CountryAll, setCountryAll] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setCity] = useState([]);
  const [ClientName, setClientName] = useState([]);
  const [BuildingName, setBuildingName] = useState([]);
  const [editBuildingData, seteditBuildingData] = useState("");

  // ------------------------------


  const {
    register,
    getValues,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [radioValue, setRadioValue] = useState('false');
  // console.log('radioValue:', radioValue);
  const radios = [
    { name: 'IAQ Report', value: 'false' },
    { name: 'Other Report', value: 'true' }
  ];



  const resetFilter = () => {
    const fieldsToReset = {
      templateId: "",
      status: "",
      buildingId: "",
      cityId: "",
      clientId: "",
      countryId: "",
      jobId: "",
      templateId: "",
      provinceId: "",
      filterClient: "",
      filterBuilding: "",
      filterCity: "",
      filterCountry: "",
      filterProvince: "",
      templateId: ""
      // Add other fields you want to reset here
    };

    setCountry([]);
    setProvience([]);
    setCity([]);
    setJob([]);
    setBuildingName([]);
    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };
    getJob();
    fetchReportList(1);
  };

  const fetchReportList = async (

    page = globalPage.current,
    size = globalPerPage.current
  ) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    // console.log(globalFilters.current);
    if (radioValue) {
      formData.append("isOtherReport", false);
    }

    // if (userData.userDetails.roleId == 22) {
    //   formData.append("isSavedReport", "True");
    // }

    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    if (globalFilters.current.countryId) {
      formData.append("countryId", globalFilters.current.countryId);
    }
    if (globalFilters.current.provinceId) {
      formData.append("provinceId", globalFilters.current.provinceId);
    }

    if (globalFilters.current.cityId) {
      formData.append("cityId", globalFilters.current.cityId);
    }
    if (globalFilters.current.buildingId) {
      formData.append("buildingId", globalFilters.current.buildingId);
    }
    if (globalFilters.current.jobId) {
      formData.append("jobId", globalFilters.current.jobId);
    }
    if (globalFilters.current.templateId) {
      formData.append("templateId", globalFilters.current.templateId);
    }


    // try {
    //   const res = await axiosInstance.post("report/getReportList", formData, {
    //     headers: headersForJwt,
    //   });
    //   setData(res.data.data.list);
    //   setTotalRows(res.data.data.totalItems);
    //   setLoading(false);
    // } catch (err) {
    //   setLoading(false);
    //   console.error("Error fetching report list:", err);
    // }
    try {
      let apiUrl = "report/getReportList"; // Default API URL
      if (userData.userDetails.roleId === 22) {
        apiUrl = "report/getReportListForClientLogIn"; // API URL for roleId 22
      
      }

      const res = await axiosInstance.post(apiUrl, formData, {
        headers: headersForJwt,
      });
      setData(res.data.data.list);
      setTotalRows(res.data.data.totalItems);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching report list:", err);
    }

  };

  const searchSubmit = (data) => {
    setLoading(true);
    const filters = {};

    // Update filters based on form data
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

    if (data.templateId && data.templateId.value !== "") {
      filters.templateId = data.templateId.value;
    }

    // Update global filters with the collected filters
    globalFilters.current = filters;

    // Reset page to 1 and fetch data
    globalPage.current = 1;
    setCurrentPage(1);
    fetchReportList(1);

  };

  const handlePageChange = (page) => {
    globalPage.current = page;
    setCurrentPage(page);
    fetchReportList(page)
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchReportList(page, newPerPage);
  };


  useEffect(() => {
    fetchReportList(1);
    // getCountry();
    // getProvienced();
    // getCity();
    getClientName();
    // getBuilding();
    getAllCountry();
    getTemplate();
    getJob();
  }, [radioValue]);

  // Show All Building List in Table Format
  // const columns = useMemo(
  //   () => [
  //     {
  //       name: "Sl no",
  //       width: "8%",
  //       selector: (row) => row.slNo,
  //       sortable: true,
  //     },
  //     {
  //       name: "Job No",
  //       selector: "projectNumber",
  //       sortable: true,
  //       minWidth: "2%",
  //       hide: true,
  //       // ...(radioValue === 'true' ? { hide: true } : {}),
  //     },
  //     {
  //       name: "Client",
  //       selector: "clientName",
  //       sortable: true,
  //       minWidth: "2%",
  //     },
  //     {
  //       name: "City",
  //       selector: "cityName",
  //       sortable: true,
  //       minWidth: "2%",
  //     },
  //     {
  //       name: "Province",
  //       selector: "provinceName",
  //       sortable: true,
  //       minWidth: "2%",
  //     },
  //     {
  //       name: "Building",
  //       selector: "buildingName",
  //       sortable: true,
  //       minWidth: "2%",
  //     },
  //     {
  //       name: "Template Name",
  //       selector: "templateName",
  //       sortable: true,
  //       minWidth: "2%",
  //     },
  //     // {
  //     //   name: "Status",
  //     //   selector: "isActive",
  //     //   minWidth: "10%",
  //     //   cell: (row) => (
  //     //     <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
  //     //       {row.isActive ? "Active" : "Inactive"}
  //     //     </div>
  //     //   ),
  //     // },
  //     {
  //       name: "Action",
  //       width: "6%",
  //       // eslint-disable-next-line react/button-has-type
  //       cell: (row) => (
  //         <Dropdown>
  //           <Dropdown.Toggle
  //             as="a"
  //             variant="success"
  //             id="dropdown-basic"
  //             className="setting-box"
  //           >
  //             <PiGearBold size={16} />
  //           </Dropdown.Toggle>

  //           <Dropdown.Menu className="custom-dropdown-menu-position">
  //             {/* {userData.access.isDelete ? (
  //                 <Dropdown.Item
  //                   onClick={() => onDelete(row.id, row.isActive)}
  //                   className="fz-2"
  //                 />
  //               ) : (
  //                 ""
  //               )} */}
  //             {/* {userData.access<=3 ? ( */}
  //             <>
  //               <Dropdown.Item
  //                 onClick={() => downloadReportPdf(row.id)}
  //                 className="fz-2"
  //               >
  //                 <PiDownloadSimpleBold className="user-icon " />
  //                 Download Report PDF
  //               </Dropdown.Item>
  //               <Dropdown.Item
  //                 onClick={() => downloadExternalDocuments(row.id)}
  //                 className="fz-2"
  //               >
  //                 <PiDownloadSimpleBold className="user-icon " />
  //                 Download External Documents
  //               </Dropdown.Item>
  //               <Dropdown.Item
  //                 onClick={() => downloadExternalDocumentsAndReport(row.id)}
  //                 className="fz-2"
  //               >
  //                 <PiDownloadSimpleBold className="user-icon " />
  //                 Download All(PDF & External Documents)
  //               </Dropdown.Item>
  //               {userData.access.id <= 3 ? (
  //                 <>
  //                   <Dropdown.Item
  //                     onClick={() => uploadExternalDoc(row.id)}
  //                     className="fz-2"
  //                   >
  //                     <PiUploadSimpleBold className="user-icon " />
  //                     Upload External Documents
  //                   </Dropdown.Item>
  //                   {!row.isOldReport ? (
  //                     <>
  //                       <Dropdown.Item
  //                         onClick={() => onEdit(row.id)}
  //                         className="fz-2"
  //                       >
  //                         <PiNotePencilBold className="user-icon " />
  //                         Edit Report
  //                       </Dropdown.Item>
  //                     </>
  //                   ) : (
  //                     ""
  //                   )}
  //                 </>
  //               ) : (
  //                 ""
  //               )}
  //             </>
  //             {/* ) : (
  //                 ""
  //               )} */}
  //           </Dropdown.Menu>
  //         </Dropdown>
  //       ),
  //     },
  //   ],
  //    []
  // );

  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: "Sl no",
        width: "8%",

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
        name: "Job No",
        // selector: "projectNumber",
        sortable: true,
        minWidth: "2%",
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
        name: "Client",
        // selector: "clientName",
        sortable: true,
        minWidth: "2%",
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
        name: "City",
        // selector: "cityName",
        sortable: true,
        minWidth: "2%",
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
        // selector: "provinceName",
        sortable: true,
        minWidth: "2%",
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
      //   name: "Building",
      //   // selector: "buildingName",
      //   sortable: true,
      //   minWidth: "2%",
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
        name: "Building",
        sortable: true,
        minWidth: "2%",
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
        name: "Template Name",
        // selector: "templateName",
        sortable: true,
        minWidth: "2%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.templateName}`}>{row.templateName}</Tooltip>}
          >
            <span className="mg-b-0">{row.templateName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Report Generation Date",
        // selector: "createdOnChar",
        sortable: true,
        minWidth: "15%",
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
        selector: "isActive",
        minWidth: "1%",
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
              <>
                {userData.access.isDelete ? (

                  <Dropdown.Item onClick={() => onDelete(row.id, row.isActive)} className="fz-2">
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
                ) : (
                  ""
                )}
                {row.isActive ? (
                  <Dropdown.Item
                    onClick={() => downloadReportPdf(row.id)}
                    className="fz-2"
                  >

                    <PiDownloadSimpleBold className="user-icon " />
                    Download Report PDF
                  </Dropdown.Item>
                ) : null}
                {row.isActive ? (
                  radioValue === 'false' && <>
                    <Dropdown.Item
                      onClick={() => downloadExternalDocuments(row.id)}
                      className="fz-2"
                    >
                      <PiDownloadSimpleBold className="user-icon " />
                      Download External Documents
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => downloadExternalDocumentsAndReport(row.id, row.jobId)}
                      className="fz-2"
                    >
                      <PiDownloadSimpleBold className="user-icon " />
                      Download All (PDF & External Documents)
                    </Dropdown.Item></>
                ) : null}
                {row.isActive ? (
                  userData.access.id <= 3 && (
                    <>
                      {radioValue === 'false' && (
                        <Dropdown.Item
                          onClick={() => uploadExternalDoc(row.id)}
                          className="fz-2"
                        >
                          <PiUploadSimpleBold className="user-icon " />
                          Upload External Documents
                        </Dropdown.Item>)}

                      {!row.isOldReport && (
                        <Dropdown.Item
                          onClick={() => onEdit(row.id, row)}
                          className="fz-2"
                        >
                          <PiNotePencilBold className="user-icon " />
                          Edit Report
                        </Dropdown.Item>
                      )}
                    </>
                  )
                ) : null}
              </>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ];
    const getStatusText = (row) => {
      return row.isActive ? "Active" : "Inactive";
    };
    // Conditionally hide "Job No" column based on radioValue
    const updatedColumns = radioValue === 'false' ? baseColumns : baseColumns.filter(column => column.name !== '');

    return updatedColumns;
  }, [radioValue]);

  const ReportListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  };

  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text: ` Do you want to ${active ? "inactivate" : "activate"} this record?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Loading...");
        setLoading(true);
        const formData = new FormData();
        formData.append("reportId", id);
        formData.append("userId", userData.userDetails.userId);

        axiosInstance
          .post("report/activateAndDeactivateReport", formData, {
            headers: headersForJwt,
          })
          .then(async (res) => {

            await fetchReportList();
            setLoading(false);
            toast.dismiss();
          })
          .catch((err) => {
            toast.dismiss();
            setLoading(false);
          });
      }
    });
  };



  const onEdit = (id, AllDetails) => {
    // console.log("----------------->", AllDetails);
    const reportDetails = {
      clientName: AllDetails.clientName,
      buildingName: AllDetails.buildingName,
      buildingId: AllDetails.buildingId,
      templateName: AllDetails.templateName,
      projectNumber: AllDetails.projectNumber,
      jobId: AllDetails.jobId,
      radioValue: AllDetails.isOtherReport,
    };
    // console.log("----------------->", reportDetails);


    // console.log("---->", AllDetails);
    const encodedId = btoa(id.toString()); // Encoding the ID using base-64

    navigate(`/manageReports/edit-report/${encodedId}`);

    // const formData = new FormData();
    // formData.append("userId", id);
    // axiosInstance
    //   .post("template/getTemplateById", formData, { headers: headersForJwt })
    //   .then((res) => {
    //     setEditUserData([]);
    //     setEditUserData(res.data.data.list);
    //     setShowUserEditModal(true);
    //   })
    //   .catch((err) => {
    //     // setLoading(true);
    //   });
  };

  const downloadReportPdf = (id) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("reportId", id);

    axiosInstance
      .post("pdf/downloadPdf", formData, { headers: headersForJwt })
      .then((res) => {
        const pdfUrl = res.data.data.list.fileName;
        // console.log(pdfUrl);
        if (pdfUrl !== null) {
          window.open(pdfUrl, "_blank");
          toast.dismiss(toastId);
          toast.success("PDF Download Successfully!");
        } else {
          toast.dismiss(toastId);
          toast.error("File not found!");
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err.message);
      });
  };

  //   const downloadReportPdf = (id) => {
  //     const toastId = toast.loading("Downloading...");

  //     const formData = new FormData();
  //     formData.append("userId", userData.userDetails.userId);
  //     formData.append("reportId", id);

  //     axiosInstance
  //       .post("pdf/downloadPdf", formData, {
  //         headers: headersForJwt,
  //         responseType: "blob" // Specify the response type as blob
  //       })
  //       .then((response) => {
  //         const file = new Blob([response.data], { type: "application/pdf" });
  //         const fileURL = URL.createObjectURL(file);
  //         const newWindow = window.open(fileURL, "_blank");

  //         if (newWindow) {
  //           newWindow.document.title = "Report PDF";
  //           toast.dismiss(toastId);
  //           toast.success("PDF Downloaded Successfully!");
  //         } else {
  //           console.error("Failed to open new window");
  //           toast.dismiss(toastId);
  //           toast.error("Failed to open PDF in new tab.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error downloading PDF:", error);
  //         toast.dismiss(toastId);
  //         toast.error("Error downloading PDF. Please try again.");
  //       });
  // };

  const downloadOldReportPdf = (id) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("reportId", id);

    axiosInstance
      .post("pdf/downloadOldPdf", formData, {
        headers: headersForJwt,
        responseType: "blob", // Ensure the response is treated as a blob
      })
      .then((res) => {
        // Check if the response contains valid data
        if (res && res.data) {
          const file = new Blob([res.data], { type: "application/pdf" }); // Assuming the response is a PDF file

          const fileURL = URL.createObjectURL(file);

          const downloadLink = document.createElement("a");
          downloadLink.href = fileURL;
          downloadLink.setAttribute("download", "report.pdf");

          document.body.appendChild(downloadLink);
          downloadLink.click();

          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(fileURL);

          toast.dismiss(toastId);
          toast.success("PDF download successfully!");
        } else {
          Swal.fire({
            icon: "warning",
            title: "File download failed!",
            text: "Failed to download the report.",
          });
          toast.dismiss(toastId);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while Generating the report!",
        });
        toast.dismiss(toastId);
      });
  };

  const downloadExternalDocuments = (id) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("reportId", id);

    axiosInstance
      .post("pdf/downloadExternalDocFilesZip", formData, {
        headers: headersForJwt,
        responseType: "json", // Set the expected response type to JSON
      })
      .then((res) => {
        if (res && res.data && res.data.fileContent) {
          // Decode Base64 file content to a Blob
          const byteCharacters = atob(res.data.fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new Blob([byteArray], { type: "application/zip" });

          // Create a download link and trigger download
          const fileURL = URL.createObjectURL(file);
          const downloadLink = document.createElement("a");
          downloadLink.href = fileURL;
          downloadLink.setAttribute("download", res.data.fileName); // Set filename

          document.body.appendChild(downloadLink);
          downloadLink.click();

          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(fileURL);

          // Handle success toast
          toast.dismiss(toastId);
          toast.success("Zip File Downloaded Successfully!");
        } else {
          toast.dismiss(toastId);
          // Handle download failure
          Swal.fire({
            icon: "warning",
            title: "File download failed!",
            text: "Failed to download Zip file.",
          });
        }
      })
      .catch((err) => {
        // Handle error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while downloading the Zip file!",
        });
        toast.dismiss(toastId);
      });
  };

  const downloadExternalDocumentsAndReport = (id, jobid) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("jobId", jobid);

    axiosInstance
      .post("pdf/downloadPdfByJobId", formData, {
        headers: headersForJwt,
        responseType: "json", // Set the expected response type to JSON
      })
      .then((res) => {
        if (res && res.data && res.data.fileContent) {
          // Decode Base64 file content to a Blob
          const byteCharacters = atob(res.data.fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new Blob([byteArray], { type: "application/zip" });

          // Create a download link and trigger download
          const fileURL = URL.createObjectURL(file);
          const downloadLink = document.createElement("a");
          downloadLink.href = fileURL;
          downloadLink.setAttribute("download", res.data.fileName); // Set filename

          document.body.appendChild(downloadLink);
          downloadLink.click();

          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(fileURL);

          // Handle success toast
          toast.dismiss(toastId);
          toast.success("Zip file downloaded successfully!");
        } else {
          // Handle download failure
          toast.dismiss(toastId);
          Swal.fire({
            icon: "warning",
            title: "File download failed!",
            text: "Failed to download Zip file.",
          });
          toast.dismiss(toastId);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while downloading the Zip file!",
        });
        toast.dismiss(toastId);
      });
  };

  const openExternalModal = (reportId) => {
    setSelectedReportId(reportId);
    setShowExternalModal(true);
  };

  const openIAQModal = (reportId) => {
    setSelectedReportId(reportId);
    setShowIAQModal(true);
  };

  const closeExternalModal = () => {
    setShowExternalModal(false);
  };

  const closeIAQModal = () => {
    setShowIAQModal(false);
  };

  const uploadExternalDoc = (reportId) => {
    openExternalModal(reportId);
  };

  const uploadIaqDoc1 = (reportId) => {
    openIAQModal(reportId);
  };

  const handleExternalDocumentUpload = (formData) => {
    // Make AJAX call to upload external document
    // Use formData to send files and reportId
    // Handle the upload response or errors
    // console.log("Uploading external document...", formData);
  };

  const handleIAQDocumentUpload = (formData) => {
    // Make AJAX call to upload IAQ document
    // Use formData to send files and reportId
    // Handle the upload response or errors
    // console.log("Uploading IAQ document...", formData);
  };

  const onView = (id) => {
    // const formData = new FormData();
    // formData.append("userId", id);
    // axiosInstance
    //   .post("users/getUserById", formData, { headers: headersForJwt })
    //   .then((res) => {
    //     setEditUserData([]);
    //     setEditUserData(res.data.data.list);
    //     setShowUserViewModal(true);
    //   })
    //   .catch((err) => {
    //     // setLoading(true);
    //   });
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
    { value: "", label: "Select Status", isDisabled: true },
    { value: true, label: "Activate" },
    { value: false, label: "Inactivate" },
  ];

  const getJob = () => {
    const formData = new FormData();

    formData.append("buildingId", globalFilters.current?.buildingId ?? "");
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
        // console.log(err);
      });

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
        // console.log(err);
      });

  };
  const getAllCountry = () => {
    let formData = new FormData();
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }

    setLoading(true);
    axiosInstance
      .post("client/getAllCountryDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log("----<", res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCountryAll(res.data.data.list);
          setLoading(false);
        }

        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
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
          { value: "", label: "Select Province", isDisabled: true },
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
          { value: "", label: "Select City", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName,
          })),
        ];
        setCity(data);
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
          { value: "", label: "Select Client", isDisabled: true },
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
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building ", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);
      })
      .catch((err) => { });
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
          { value: "", label: "Select Country", isDisabled: true },
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
  const getTemplate = (e) => {
    const formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    if (radioValue) {
      formData.append("isOtherTemplate", radioValue);
    }
    axiosInstance
      .post("template/getTemplateNameDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setTemplates([]);
        // console.log(res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setTemplates(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const handelClientName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterBuilding", "");
    setValue("jobId", "");
    setValue("templateId", "");

    setClientId(data.target.value.value);
    getCountry();
    getBuilding();
    getJob1();
  }

  const handelCountryChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.target.value.value
    };
    getProvienced();
    setCountryId(data.target.value.value);
  }

  const handelProvienceChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.target.value.value
    };
    getCity(data.target.value.value);
    setProvinceId(data.target.value.value);
  }

  const handelCityName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    setCityId(data.target.value.value);
    setClientId("");
    // getBuilding()
  }

  const handelBuildingChange = (data) => {

    if (data.target.value.value !== '') {
      globalFilters.current = {
        ...globalFilters.current,
        buildingId: data.target.value.value,
      };
      getJob();
      setBuildingId(data.target.value.value);
      setValue("jobId", "");
      setValue("templateId", "");
    }
    else {
      setJob([]);
      setValue("jobId", "");
    }


  }

  const handelJobChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      jobId: data.target.value.value,
    };
    setValue("templateId", "");
  }

  return (
    <>
      {!clickedBuildingId ? <Helmet title={"Report Management | IAQ Reporting System"} /> : null}
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-4">Manage IAQ Reports</h5>
                {/* <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      // variant={idx % 2 ? 'outline-success' : 'outline-primary'}
                      variant={'outline-primary'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup> */}
              </div>
              {userData.access.id <= 3 ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => navigate("/manageReports/generate-report?radioValue=" + radioValue)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Generate Report
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
                    {/* <div className="user-info" > */}
                    {/* Client Name */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Client</h6>
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
                              placeholder="Client"
                              name="filterClient"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* Country */}
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
                              placeholder="Country"
                              name="filterCountry"
                            // value={Country.length === 2 ? Country[1] : null}
                            // components={{
                            //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            // }}
                            // value={selectedCountry}
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* Province */}
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
                              placeholder="Province"
                              name="filterProvince"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                    {/* City */}
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
                              placeholder="City"
                              name="filterCity"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                  </div>

                  <div className="user-info-90 row mt-3">
                    {/* <div className="user-info" > */}

                    {/* Building Name */}
                    <div className="col-sm-3 col-12">
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
                              placeholder="Building"
                              name="filterBuilding"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    {/* Job Name */}
                    {/* {radioValue === 'false' ? ( */}

                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Job</h6>
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
                    {/* ) : null} */}



                    {/* Template Name */}
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Template</h6>

                      <Controller
                        control={control}
                        name="templateId"
                        {...register("templateId", {
                          // onChange: (data) =>
                          // getTemplate(data.target.value.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Template", isDisabled: true }, // Add a default option
                              ...templates.map((cntr) => ({
                                value: cntr.id,
                                label: cntr.templateName,
                              })),
                            ]}
                            placeholder="Template"
                            name="templateId"
                          // components={{
                          //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                          // }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Search/Reset</h6>
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

                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonDataTable {...ReportListProps} />

      {/* Modals */}
      {showExternalModal && (
        <ExternalDocumentModal
          reportId={selectedReportId}
          closeModal={closeExternalModal}
          uploadDocument={handleExternalDocumentUpload}
          showExternalModal={showExternalModal}
        />
      )}

      {showIAQModal && (
        <IAQDocumentModal
          reportId={selectedReportId}
          closeModal={closeIAQModal}
          uploadDocument={handleIAQDocumentUpload}
          showIAQModal={showIAQModal}
        />
      )}
    </>
  );
}
export default Report;
