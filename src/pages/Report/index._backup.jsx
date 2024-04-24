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
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
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

function Report() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [nameForSeachDD, setNameForSeachDD] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const [CountryAll, setCountryAll] = useState([]);
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [Client, setClient] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [job, setJob] = useState([]);
  const [templates, setTemplates] = useState([]);

  //Report
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [showIAQModal, setShowIAQModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [filterStartDate, filterEndDate] = dateRange;

  const {
    register,
    getValues,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const getAllCountry = () => {
    const formData = new FormData();

    axiosInstance
      .post("client/getAllCountryDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log("----<", res);
        if (res && res.data.status === 1) {
          // console.log(res.data.data.list);
          setCountryAll(res.data.data.list);
        }

        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const getProviance = (e) => {
    reset({
      countryId: e,
      provinceId: "",
      cityId: "",
      clientId: "",
      buildingId: "",
      jobId: "",
    });
    if (e.value !== "") {
      const formData = new FormData();
      formData.append("countryId", Number(e.value));
      axiosInstance
        .post("client/getAllProvinceByCountryId", formData, {
          headers: headersForJwt,
        })
        .then((res) => {
          // setLoading(true)
          setProvince([]);
          // console.log(res);
          if (res && res.data.status === 1) {
            // console.log(res.data.data.list);
            setProvince(res.data.data.list);
          }
          return false;
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };

  const getCity = (e) => {
    // console.log(e.target.value);
    reset({
      provinceId: e,
      cityId: "", // Reset provinceId field
      clientId: "", // Reset provinceId field
      buildingId: "", // Reset provinceId field
      jobId: "", // Reset provinceId field
    });
    if (e.value !== "") {
      const formData = new FormData();
      formData.append("provinceId", Number(e.value));

      axiosInstance
        .post("client/getAllCityDD", formData, {
          headers: headersForJwt,
        })
        .then((res) => {
          setCity([]);
          // console.log(res);
          if (res && res.data.status === 1) {
            // console.log(res.data.data.list);
            setCity(res.data.data.list);
            // setCountry(res.data.data.list);
          }
          return false;
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };

  const getClientName = (e) => {
    // console.log(e.target.value);
    reset({
      cityId: e,
      clientId: "", // Reset provinceId field
      buildingId: "", // Reset provinceId field
      jobId: "", // Reset provinceId field
    });

    if (e.value !== "") {
      const formData = new FormData();
      formData.append("cityId", Number(e.value));
      axiosInstance
        .post("client/getAllClientDD", formData, {
          headers: headersForJwt,
        })
        .then((res) => {
          // console.log(res);
          if (res && res.data.status === 1) {
            // console.log(res.data.data.list);
            setClient(res.data.data.list);
            // setCountry(res.data.data.list);
          }
          return false;
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };
  const getBuilding = async (e) => {
    reset({
      clientId: e,
      buildingId: "", // Reset provinceId field
      jobId: "", // Reset provinceId field
    });
    if (e.value !== "") {
      const formData = new FormData();
      formData.append("clientId", Number(e.value));
      setBuildingName([]);
      await axiosInstance
        .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
        .then((res) => {
          setBuildingName(res.data.data.list);
        })
        .catch((err) => {});
    }
  };

  const getJob = (e) => {
    reset({
      buildingId: e,
      jobId: "", // Reset provinceId field
    });
    if (e.value !== "") {
      const formData = new FormData();

      formData.append("buildingId", Number(e.value));

      axiosInstance
        .post("client/getAllJobDD", formData, {
          headers: headersForJwt,
        })
        .then((res) => {
          setJob([]);
          // console.log(res);
          if (res && res.data.status === 1) {
            // console.log(res.data.data.list);
            setJob(res.data.data.list);
            // setCountry(res.data.data.list);
          }
          return false;
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };
  const getTemplate = (e) => {
    const formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);
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

  const fetchReportList = async (page, size = perPage) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);

    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    axiosInstance
      .post("report/getReportList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };

  const handlePageChange = (page) => {
    
    setCurrentPage(page);
    fetchReportList(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    
    setPerPage(newPerPage);
    fetchReportList(page, newPerPage);
  };

  // Show All Building List in Table Format
  const columns = useMemo(
    () => [
      {
        name: "Job No",
        selector: "projectNumber",
        sortable: true,
        minWidth: "2%",
      },
      {
        name: "Client",
        selector: "clientName",
        sortable: true,
        minWidth: "2%",
      },
      {
        name: "City",
        selector: "cityName",
        sortable: true,
        minWidth: "2%",
      },
      {
        name: "Province",
        selector: "provinceName",
        sortable: true,
        minWidth: "2%",
      },
      {
        name: "Building",
        selector: "buildingName",
        sortable: true,
        minWidth: "2%",
      },
      // {
      //   name: "Status",
      //   selector: "isActive",
      //   minWidth: "10%",
      //   cell: (row) => (
      //     <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
      //       {row.isActive ? "Active" : "Inactive"}
      //     </div>
      //   ),
      // },
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
              {/* {userData.access.isDelete ? (
                <Dropdown.Item
                  onClick={() => onDelete(row.id, row.isActive)}
                  className="fz-2"
                />
              ) : (
                ""
              )} */}
              {userData.access.isDownload ? (
                <>   
                <Dropdown.Item
                        onClick={() => downloadReportPdf(row.id)}
                        className="fz-2"
                      >
                        <PiDownloadSimpleBold className="user-icon " />
                        Download Report PDF
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => downloadExternalDocuments(row.id)}
                        className="fz-2"
                      >
                        <PiDownloadSimpleBold className="user-icon " />
                        Download External Documents
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          downloadExternalDocumentsAndReport(row.id)
                        }
                        className="fz-2"
                      >
                        <PiDownloadSimpleBold className="user-icon " />
                        Download All(PDF & External Documents)
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => uploadExternalDoc(row.id)}
                        className="fz-2"
                      >
                        <PiUploadSimpleBold className="user-icon " />
                        Upload External Documents
                      </Dropdown.Item>
                  {!row.isOldReport ? (
                    <>
                      <Dropdown.Item
                        onClick={() => onEdit(row.id)}
                        className="fz-2"
                      >
                        <PiNotePencilBold className="user-icon " />
                        Edit Report
                      </Dropdown.Item>
                   

                     
                      {/* <Dropdown.Item
                        onClick={() => uploadIaqDoc1(row.id)}
                        className="fz-2"
                      >
                        <PiUploadSimpleBold className="user-icon " />
                        Upload IAQ Documents
                      </Dropdown.Item> */}
                    </>
                  ) : (
                    <>
                      {/* <Dropdown.Item
                        onClick={() => downloadOldReportPdf(row.id)}
                        className="fz-2"
                      >
                        <PiDownloadSimpleBold className="user-icon " />
                        Download Report PDF
                      </Dropdown.Item> */}
                    </>
                  )}
                </>
              ) : (
                ""
              )}
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const ReportListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  };
  
  useEffect(() => {
    fetchReportList(1);
    getAllCountry();
    getTemplate();
  }, []);

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
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const formData = new FormData();
        formData.append("templateId", id);
        formData.append("userId", userData.userDetails.userId);

        axiosInstance
          .post("template/deactivateTemplate", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchReportList(currentPage);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const onEdit = (id) => {
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
          const link = document.createElement("a");
          link.href = pdfUrl;
          // link.download = "report.pdf";
          link.click();
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
  const downloadOldReportPdf = (id) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("reportId", id);

    axiosInstance
    .post("pdf/downloadOldPdf", formData, {
      headers: headersForJwt,
      responseType: 'blob' // Ensure the response is treated as a blob
    })
    .then((res) => {
      // Check if the response contains valid data
      if (res && res.data) {
        const file = new Blob([res.data], { type: 'application/pdf' }); // Assuming the response is a PDF file
  
        const fileURL = URL.createObjectURL(file);
  
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.setAttribute('download', 'report.pdf');
  
        document.body.appendChild(downloadLink);
        downloadLink.click();
  
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileURL);
  
        toast.dismiss(toastId);
        toast.success("PDF Download Successfully!"); 
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
        text: "Something went wrong while generating the report!",
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

  const downloadExternalDocumentsAndReport = (id) => {
    const toastId = toast.loading("Downloading...");

    const formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("reportId", id);

    axiosInstance
      .post("pdf/downloadAllFilesZip", formData, {
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
          // Handle download failure
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

  const resetFilter = () => {
    reset({
      templateId: "", // Reset templateId field
      status: "", // Reset status field
      buildingId: "", // Reset buildingId field
      cityId: "", // Reset cityId field
      clientId: "", // Reset clientId field
      countryId: "", // Reset countryId field
      jobId: "", // Reset jobId field
      provinceId: "", // Reset provinceId field
      // Add other fields you want to reset here
    });
    fetchReportList(1);
  };
  const searchSubmit = (data) => {
    // console.log(data);
    setLoading(true);
    const formData = new FormData();
    formData.append("page", 0);
    formData.append("size", 10);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    formData.append("userId", userData.userDetails.userId);

    if (data?.buildingId && data?.buildingId?.value !== "") {
      formData.append("buildingId", data.buildingId.value);
    }

    if (data?.cityId && data?.cityId?.value !== "") {
      formData.append("cityId", data.cityId.value);
    }

    if (data?.clientId && data?.clientId.value !== "") {
      formData.append("clientId", data.clientId.value);
    }

    if (data?.countryId && data?.countryId !== "") {
      formData.append("countryId", data.countryId.value);
    }

    if (data?.jobId && data?.jobId.value !== "") {
      formData.append("jobId", data.jobId.value);
    }

    if (data?.provinceId && data?.provinceId.value !== "") {
      formData.append("provinceId", data.provinceId.value);
    }

    if (data?.templateId && data?.templateId.value !== "") {
      formData.append("templateId", data.templateId.value);
    }

    if (data.status && data.status.value !== "") {
      formData.append("status", data.status.value);
    }

    axiosInstance
      .post("report/getReportList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
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
    { value: "", label: "Select Status" },
    { value: true, label: "Activate" },
    { value: false, label: "Inactivate" },
  ];

  return (
    <>
      <Helmet title="Report  | IAQ Reporting System" />
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Manage Reports</h5>
              </div>
              {userData.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => navigate("/manageReports/generate-report")}
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
                  <div
                    className="user-info"
                    style={{
                      justifyContent: 'flex-start',
                      // gap: '2.8em',
                      important: 'true',
                    }}
                  >
                    {/* <div className="user-info" > */}

                    {/* Country */}
                    <div className="user-info-inner col-lg-1 col-md-12 pd-0">
                      <h6 className="label-search">Country</h6>

                      <Controller
                        control={control}
                        name="countryId"
                        {...register("countryId", {
                          onChange: (data) => getProviance(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Country Name" }, // Add a default option
                              ...CountryAll.map((cntr) => ({
                                value: cntr.countryId,
                                label: cntr.countryName,
                              })),
                            ]}
                            placeholder="Country"
                            name="countryId"
                            // value={Country.length === 2 ? Country[1] : null}
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Province */}
                    <div className="user-info-inner col-lg-1 col-md-12 pd-0">
                      <h6 className="label-search">Province</h6>
                      <Controller
                        control={control}
                        name="provinceId"
                        {...register("provinceId", {
                          onChange: (data) => getCity(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Province" }, // Add a default option
                              ...province.map((cntr) => ({
                                value: cntr.id,
                                label: cntr.name,
                              })),
                            ]}
                            placeholder="Province"
                            name="provinceId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* City */}
                    <div className="user-info-inner col-lg-1 col-md-12 pd-0">
                      <h6 className="label-search">City</h6>

                      <Controller
                        control={control}
                        name="cityId"
                        {...register("cityId", {
                          onChange: (data) => getClientName(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select City" }, // Add a default option
                              ...city.map((cntr) => ({
                                value: cntr.cityId,
                                label: cntr.cityName,
                              })),
                            ]}
                            placeholder="City Name"
                            name="cityId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>
                    <br />
                    {/* Client Name */}
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Client</h6>

                      <Controller
                        control={control}
                        name="clientId"
                        {...register("clientId", {
                          onChange: (data) => getBuilding(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Client" }, // Add a default option
                              ...Client.map((cntr) => ({
                                value: cntr.clientId,
                                label: cntr.clientName,
                              })),
                            ]}
                            placeholder="Client Name"
                            name="clientId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>
                    {/* Building Name */}
                    <div className="user-info-inner col-lg-2  col-md-12 pd-0">
                      <h6 className="label-search">Building</h6>
                      <Controller
                        control={control}
                        name="buildingId"
                        {...register("buildingId", {
                          onChange: (data) => getJob(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Building" }, // Add a default option
                              ...buildingName.map((cntr) => ({
                                value: cntr.id,
                                // label: cntr.name,
                                label: cntr.name + " at " + cntr.address1 
                              })),
                            ]}
                            placeholder="Building Name"
                            name="buildingId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>
                    {/* Job Name */}
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Job</h6>

                      <Controller
                        control={control}
                        name="jobId"
                        {...register("jobId", {
                          onChange: (data) => getTemplate(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: "", label: "Select Job" }, // Add a default option
                              ...job.map((cntr) => ({
                                value: cntr.id,
                                label: cntr.projectNumber,
                              })),
                            ]}
                            placeholder="Job Name"
                            name="jobId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />
                    </div>
                    {/* Template Name */}
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
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
                              { value: "", label: "Select Template" }, // Add a default option
                              ...templates.map((cntr) => ({
                                value: cntr.id,
                                label: cntr.templateName,
                              })),
                            ]}
                            placeholder="Template Name"
                            name="templateId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
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
                        className="btn btn-white"
                        onClick={() => resetFilter()}
                      >
                        <RxReset />
                      </button>
                    </OverlayTrigger>
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
