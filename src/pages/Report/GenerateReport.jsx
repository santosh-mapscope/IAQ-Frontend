/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';

import { Col, Button, Row, Form, Modal, Card, Image } from "react-bootstrap";

import { Helmet } from "react-helmet";
import { CKEditor } from "ckeditor4-react";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { FaFile } from "react-icons/fa";
import { BiSolidCloudUpload } from "react-icons/bi";

import Container from "react-bootstrap/Container";
import DatePicker from "react-datepicker";

import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";

import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { Link, useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../../util/customToast/index";

import toast, { Toaster } from "react-hot-toast";

import { PreviewPdf } from "../../services/TemplateService";
import { useDropzone } from "react-dropzone";
import BackButton from "../../components/BackButton";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import AzureMail from "../../util/azureMail/azureMail";
import { CiImageOn } from "react-icons/ci";
import ImageUploadModal from "../../components/editorImageUpload/ImageUploadModal";

function GenerateReport() {
  const { state } = useLocation();
  const { clientnameid, nameofClient, buildingnmaeid, nameofBuilding, jobnameid, nameofJob } = state || {};
 
  const navigate = useNavigate();
  // Get the URLSearchParams object
  const urlParams = new URLSearchParams(window.location.search);
  const radioValue = urlParams.get("radioValue") === "true";
 

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const [templateHeader, setTemplateHeader] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateFooter, setTemplateFooter] = useState("");
  const [templateCoverPage, setTemplateCoverPage] = useState("");

  const [buildingField, setBuildingField] = useState([]);
  const [clientField, setClientField] = useState([]);
  const [shortcodeOptions, setShortcodeOptions] = useState([]);
  const [coverPageOptions, setCoverPageOptions] = useState([]);

  const [userData, setUserData] = useRecoilState(userAtom);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const [pdfContent, setPdfContent] = useState("");

  const [isSectionVisible, setIsSectionVisible] = useState(true); // State to control section visibility
  const [CountryAll, setCountryAll] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [Client, setClient] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [job, setJob] = useState([]);
  const [templates, setTemplates] = useState([]);
  // const [templatebody, setTemplatebody] = useState(true);
  const coverEditorRef = useRef(null);
  const headerEditorRef = useRef(null);
  const bodyEditorRef = useRef(null);
  const footerEditorRef = useRef(null);

  const reportDetails = useRef({
    clientName: "",
    buildingName: "",
    buildingId: "",
    templateName: "",
    projectNumber: "",
    jobId: "",
    radioValue: radioValue,
  });

  const [buttonText, setButtonText] = useState("Generate"); // State for button text
  const [isPreviewing, setIsPreviewing] = useState(false); // State for preview status
  const [errorMessage, setErrorMessage] = useState("");

  const [isReportLoading, setReportLoading] = useState(false); // State for

  const [isTemplateFieldShown, setTemplateFieldShown] = useState(false);

  const [action, setAction] = useState("");

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  
  const handleClose = () => setPdfModalOpen(false);

  const getAllCountry = () => {
    let formData = new FormData();

    axiosInstance
      .post("client/getAllCountryDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
         
          setCountryAll(res.data.data.list);
        }

        return false;
      })
      .catch((err) => {
      });
  };
  const getProviance = (e) => {
    
    setProvince("");
    setCity("");
    setClient("");
    setBuildingName("");
    setJob("");
    let formData = new FormData();
    formData.append("countryId", Number(e.target.value));
    axiosInstance
      .post(`client/getAllProvinceByCountryId`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setLoading(true)
        setProvince("");
        
        if (res && res.data.status === 1) {
         
          setProvince(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
     
      });
  };

  const getCity = (e) => {
    setCity("");
    setClient("");
    setBuildingName("");
    setJob("");
    let formData = new FormData();
    formData.append("provinceId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        setCity("");
        
        if (res && res.data.status === 1) {
         
          setCity(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getClientName = (e) => {
    // console.log(e.target.value);
    setClient([]);
    setBuildingName([]);
    setJob([]);
    // setTemplates([]);
    // reset({
    //   buildingId: "",
    //   clientId: "",
    //   jobId: "",
    //   templateId: "",
    // });

    let formData = new FormData();
    // formData.append("cityId", Number(e.target.value));

    axiosInstance
      .post(`client/getAllClientDD`, formData, {
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
  };
  const getBuilding = async (selectedValue) => {
    setBuildingName([]);
    setValue("buildingId", "");
    setValue("jobId", "");
    if (selectedValue && selectedValue !== "") {
      let formData = new FormData();
      formData.append("clientId", Number(selectedValue?.value));
      await axiosInstance
        .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
        .then((res) => {
          setBuildingName(res.data.data.list);
        })
        .catch((err) => { });
    } else {
      setBuildingName([]);
      setJob([]);
    }
  };
  const getJob = (selectedValue) => {
    setJob([]);
    setValue("jobId", "");
    if (selectedValue && selectedValue !== null) {
      let formData = new FormData();
      formData.append("buildingId", Number(selectedValue.value));

      axiosInstance
        .post(`client/getAllJobDD`, formData, {
          headers: headersForJwt,
        })
        .then((res) => {
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
    } else {
      setJob([]);
      // setTemplates([]);
      // reset({
      //   jobId: "",
      //   // templateId: "",
      // });
    }
  };
  // const getTemplate = (e) => {
  //   let formData = new FormData();
  //   if (userData !== "") formData.append("userId", userData.userDetails.userId);
  //   axiosInstance
  //     .post(`template/getTemplateNameDD`, formData, {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //       setTemplates("");
  //       // console.log(res);
  //       if (res && res.data.status === 1) {
  //         // console.log(res.data.data.list);
  //         setTemplates(res.data.data.list);
  //         // setCountry(res.data.data.list);
  //       }
  //       return false;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const checkCsvAvailabilityByJobId = async (jobId) => {
    try {
      if (jobId && jobId !== "") {
        const formData = new FormData();
        if (
          userData &&
          userData.userDetails &&
          userData.userDetails.userId !== ""
        ) {
          formData.append("userId", userData.userDetails.userId);
        }
        formData.append("jobId", jobId);

        const res = await axiosInstance.post(
          "csv/isCsvAvailableByJobId",
          formData,
          {
            headers: headersForJwt,
          }
        );

        return res.data.status === 1 && res.data.data.isCsvAvailableByJobId;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Error checking CSV availability:", err);
      return false;
    }
  };

  const sentMail = async (details) => {
    // console.log();
    // console.log(details);
    // return false;
    if (!details.radioValue) {
      const formData = new FormData();
      formData.append('clientName', details.clientName);
      formData.append('templateName', details.templateName);
      formData.append('buildingName', details.buildingName);
      formData.append('buildingId', details.buildingId);
      formData.append("jobId", details.jobId)
      axiosInstance
        .post("report/sendReportNotification", formData, {
          headers: headersForJwt,
        })
        .then((response) => {
          // console.log(response.data.status == 1);
          if (response.data.status == 1) {
            Swal.fire({
              title: "Report generated successfully!",
              showConfirmButton: true,
              confirmButtonText: "OK"
            });

          }
        })
        .catch((error) => {

        });
      // const message = `
      //       <p>Dear <b>${details.clientName}</b>,</p>
      //       <p>A <b>${details.templateName
      //   }</b> report has been generated against your building <b>${details.buildingName
      //   }</b> on <b>${format(new Date(), "MMMM d, yyyy")}</b>.<br/>

      //       Please log in to siaqreporting.com with your credentials to download and check the report.<br/><br/>

      //       Regards<br/>

      //       Sterling IAQ Consultants</p>`;

      // const res1 = AzureMail({
      //   to: "monica@sterlingiaqconsultants.com", // Assuming email is the recipient
      //   subject: "Report Generated Successfully!",
      //   message: message,
      //   cc: "krish@sparcglobal.ca",
      // });
      // santoshparida.sparc@gmail.com  monica@sterlingiaqconsultants.com krish@sparcglobal.ca
      // if (res1 === "true") {
      //   console.log(message + "mail Sent");
      // } else {
      //   console.log(message + "mail not Sent");
      // }
    }
    //  else {
    //   let formData = new FormData();
    //   formData.append("jobId", details.jobId);
    //   await axiosInstance
    //     .post("job/getJobById", formData, { headers: headersForJwt })
    //     .then((res) => {
    //       if (res.data.status === 1) {
    //         if (res.data.data.list.testDateChar) {
    //           const message = `
    //           <p>Dear <b>${res.data.data.list.clientName}</b>,</p>
    //           <p>A report has been generated against your building <b>${res.data.data.list.buildingName
    //             }</b> for test date <b>${format(
    //               new Date(res.data.data.list.testDateChar),
    //               "MMMM d, yyyy"
    //             )}</b>.<br/>

    //           Please log in to <a href="https://siaqreporting.com" target="_blank">siaqreporting.com</a> with your credentials to download and check the report.<br/><br/>

    //           Regards<br/>

    //           Sterling IAQ Consultants</p>`;

    //           const res1 = AzureMail({
    //             to: "monica@sterlingiaqconsultants.com", // Assuming email is the recipient
    //             subject: "Report Generated Successfully!",
    //             message: message,
    //             cc: "krish@sparcglobal.ca",
    //           });
    //           // santoshparida.sparc@gmail.com  monica@sterlingiaqconsultants.com krish@sparcglobal.ca
    //           if (res1 === "true") {
    //             console.log(message + "mail Sent");
    //           } else {
    //             console.log(message + "mail not Sent");
    //           }
    //         }
    //       } else {
    //         // ErrorToastWithToastId("Action Failed..", toastId);
    //       }
    //     })
    //     .catch((err) => {
    //       // ErrorToastWithToastId("Action Failed..", toastId);
    //     });
    // }
  };

  const getTemplate = async (selectedOption) => {
    if (selectedOption) {
      // alert(selectedOption)
      try {
        const csvAvailable = await checkCsvAvailabilityByJobId(
          Number(selectedOption)
        );

        if (csvAvailable || radioValue) {
          setErrorMessage("");
          const formData = new FormData();
          if (
            userData &&
            userData.userDetails &&
            userData.userDetails.userId !== ""
          ) {
            formData.append("userId", userData.userDetails.userId);
          }
          formData.append("isOtherTemplate", radioValue);
          const res = await axiosInstance.post(
            "template/getTemplateNameDD",
            formData,
            {
              headers: headersForJwt,
            }
          );

          if (res.data.status === 1) {
            if (userData.access.id > 3) {
              const updatedTemplates = res.data.data.list.filter(template => template.id !== 16);
              setTemplates(updatedTemplates);
            } else {
              setTemplates(res.data.data.list);
            }

          } else {
            console.error("Error getting template:", res.data.message);
          }
        } else {
          setErrorMessage("Test data is not available for this job");

          // setTimeout(() => {
          //   setErrorMessage("");
          // }, 5000);
        }
      } catch (err) {
        console.error("Error in getTemplate:", err);
        setErrorMessage("An error occurred while fetching data");
        // setTimeout(() => {
        //   setErrorMessage("");
        // }, 5000);
      }
    } else {
      setErrorMessage("");
    }
  };

  const getTemplateById = (e) => {
    // console.log("=====", e);
    if (e !== "") {
      let formData = new FormData();
      if (e) {

        formData.append("userId", userData.userDetails.userId);
        formData.append("templateId", Number(e));
        axiosInstance
          .post("template/getTemplateById", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            setTemplateFieldShown(true);
            console.log(headerEditorRef.current);
            if (headerEditorRef.current) {
              headerEditorRef.current.setData(
                res.data.data.list?.templateHeader ?? ""
              );
            }

            if (bodyEditorRef.current) {
              bodyEditorRef.current.setData(
                res.data.data.list?.templateBody ?? ""
              );
            }

            if (footerEditorRef.current) {
              footerEditorRef.current.setData(
                res.data.data.list?.templateFooter ?? ""
              );
            }

            if (coverEditorRef.current) {
              coverEditorRef.current.setData(
                res.data.data.list?.templateCoverPage ?? ""
              );
            }

            setTemplateHeader(res.data.data.list.templateHeader ?? "");
            setTemplateBody(res.data.data.list.templateBody ?? "");
            setTemplateFooter(res.data.data.list.templateFooter ?? "");
            setTemplateCoverPage(res.data.data.list?.templateCoverPage ?? "");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            throw error; // Throw the error to be caught by the component
          });
      } else {
        setTemplateFieldShown(false);
        // alert("please select a template");
      }
    } else {
      setTemplateFieldShown(false);
    }
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm();

  function validateAndFixHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Serialize the document back to a string, fixing any issues
    const fixedHTML = new XMLSerializer().serializeToString(doc);

    return fixedHTML;
  }

  const onSubmit = (data) => {
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to generate this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Generate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setReportLoading(true);
        // const { templateDate } = data;
        setButtonText("Please Wait..."); // Change button text to "Please Wait"
        setIsPreviewing(true); // Set previewing state to true
        // const toastId = toast.loading("Generating...");

        const requestData = {
          ...data,
          templateHeader: `${validateAndFixHTML(templateHeader)}`,
          templateBody: `${validateAndFixHTML(templateBody)}`,
          templateFooter: `${validateAndFixHTML(templateFooter)}`,
          templateCoverPage: `${validateAndFixHTML(templateCoverPage)}`,
        };

        let formData = new FormData();

        formData.append("userId", userData.userDetails.userId);
        // formData.append("countryId", data.countryId);
        // formData.append("provinceId", data.provinceId);
        // formData.append("cityId", data.cityId);
        formData.append("clientId", data.clientId.value);
        formData.append("buildingId", data.buildingId.value);
        if (radioValue) {
          formData.append("jobId", data.jobId.value);
          formData.append("isOtherReport", true);
        } else {
          formData.append("jobId", data.jobId.value);
          formData.append("isOtherReport", false);
        }
        formData.append("templateId", data.templateId.value);
        formData.append("isComingFromJob", false);
        formData.append(
          "templateHeader",
          `${validateAndFixHTML(templateHeader)}`
        );
       
          formData.append("templateBody",templateBody!=""? `${validateAndFixHTML(templateBody)}`:"");
      
        //  formData.append("templateBody", `${validateAndFixHTML(templateBody)}`);
        formData.append(
          "templateFooter",
          `${validateAndFixHTML(templateFooter)}`
        );
        formData.append(
          "templateCoverPage",
          `${validateAndFixHTML(templateCoverPage)}`
        );
        // if (acceptedFiles) {
        //   formData.append("file", acceptedFiles[0]); // Creating an empty Blob with a default type);
        // }

        acceptedFiles.forEach((file, index) => {
          // formData.append(`file[${index}]`, file);
          formData.append(`externalDocs`, file);
        });
        axiosInstance
          .post("report/downloadReport", formData, {
            headers: headersForJwt,
            responseType: "json", // Ensure the response is treated as a blob
          })
          .then((res) => {
            // Check if the response contains valid data
            if (res && res.data && res.data.status == 1) {
              if (res.data.data.reportId !== "") {
                setReportLoading(false);
                setIsPreviewing(false);
                setButtonText("Generate");
                const encodedId = btoa(res.data.data.reportId.toString()); // Encoding the ID using base-64
                if (action === "saveAndEdit") {
                  navigate(`/manageReports/edit-report/${encodedId}`);
                } else {
                  // sentMail(reportDetails.current);
                  // download pdf code
                  if (
                    res.data.data.fileContent &&
                    res.data.data.fileContent != null
                  ) {
                    const byteCharacters = atob(res.data.data.fileContent);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new Blob([byteArray], {
                      type: "application/zip",
                    });

                    const fileURL = URL.createObjectURL(file);

                    const downloadLink = document.createElement("a");
                    downloadLink.href = fileURL;
                    downloadLink.setAttribute(
                      "download",
                      res.data.data.fileName
                    ); // Set filename

                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(fileURL);
                  }
                  toast.success("PDF Download Successfully!");
                  navigate("/manageReports");
                }
                setAction("");
              }
            } else {
              setReportLoading(false);
              setIsPreviewing(false);
              setButtonText("Generate");
              setAction("");
              Swal.fire({
                icon: "warning",
                title: "Report generation failed!",
                text: res.data.message,
              });
            }
          })
          .catch((err) => {
            setReportLoading(false);
            setAction("");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while generating the report!",
            });
            // toast.dismiss(toastId);
            setIsPreviewing(false);
            setButtonText("Generate");
          });
      }
    });
  };

  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const handleStausOptionChange = (selectedOption) => {
    setValue("status", selectedOption?.value || ""); // Set the value to the selected option's value

    // setSelectedStatusOption(event.target.value);
    // Additional logic you want to perform when an option is selected
  };

  // Event handlers for dropdown changes
  // Event handlers for dropdown changes
  const handleOptionChange1 = (event) => {
    const selectedValue = event.value;
    const editor = headerEditorRef.current;

    if (editor && selectedValue) {
      const selection = editor.getSelection();
      const selectedHtml = `<p>${selectedValue}</p>`; // Wrap the selected value in a span or any HTML tag

      if (selection) {
        if (editor.insertHtml) {
          editor.insertHtml(selectedHtml);
        } else if (editor.insertText) {
          // Fallback method for older CKEditor versions
          editor.insertText(selectedValue);
        } else {
          console.error(
            "The CKEditor instance does not support insertHtml or insertText method."
          );
        }
      }
    }
  };

  const handleOptionChange2 = (event) => {
    const selectedValue = event.value;
    const editor = bodyEditorRef.current;

    if (editor && selectedValue) {
      const selection = editor.getSelection();
      const selectedHtml = `<p>${selectedValue}</p>`; // Wrap the selected value in a span or any HTML tag

      if (selection) {
        if (editor.insertHtml) {
          editor.insertHtml(selectedHtml);
        } else if (editor.insertText) {
          // Fallback method for older CKEditor versions
          editor.insertText(selectedValue);
        } else {
          console.error(
            "The CKEditor instance does not support insertHtml or insertText method."
          );
        }
      }
    }
  };

  const handleOptionChange3 = (event) => {
    const selectedValue = event.value;
    const editor = footerEditorRef.current;

    if (editor && selectedValue) {
      const selection = editor.getSelection();
      const selectedHtml = `<p>${selectedValue}</p>`; // Wrap the selected value in a span or any HTML tag

      if (selection) {
        if (editor.insertHtml) {
          editor.insertHtml(selectedHtml);
        } else if (editor.insertText) {
          // Fallback method for older CKEditor versions
          editor.insertText(selectedValue);
        } else {
          console.error(
            "The CKEditor instance does not support insertHtml or insertText method."
          );
        }
      }
    }
  };

  const handleCoverPageChange = (event) => {
    const selectedValue = event.value;
    const editor = coverEditorRef.current;

    if (editor && selectedValue) {
      editor.setData(selectedValue);
    }
  };
  const handleEditorReady = (editorName, event) => {
    switch (editorName) {
      case "headerEditor":
        headerEditorRef.current = event.editor;
        headerEditorRef.current.setData(templateHeader ?? "");
        break;

      case "bodyEditor":
        bodyEditorRef.current = event.editor;
        bodyEditorRef.current.setData(templateBody ?? "");
        break;

      case "footerEditor":
        footerEditorRef.current = event.editor;
        footerEditorRef.current.setData(templateFooter ?? "");
        break;

      case "coverEditor":
        coverEditorRef.current = event.editor;
        coverEditorRef.current.setData(templateCoverPage ?? "");
        break;
      default:
        break;
    }
  };

  const statusOptions = [
    { value: "1", label: "Activate" },
    { value: "0", label: "Inactivate" },
  ];

  const openFileBrowser = () => {
    // Open a new window to your file browser URL
    const fileBrowserWindow = window.open(
      "File Browser",
      "width=800,height=600"
    );

    // When the file browser window is closed, retrieve the selected image URL
    window.addEventListener("message", (event) => {
      if (
        event.origin !== "https://localhost/siaq" ||
        !event.data ||
        !event.data.imageURL
      ) {
        return;
      }

      // Insert the selected image into CKEditor 5
      const imageUrl = event.data.imageURL;
      const editor = document.querySelector(".ck-editor__editable");
      editor.innerHTML += `<img src="${imageUrl}" alt="Selected Image">`;
    });
  };
  useEffect(() => {
    if (window.CKEDITOR) {
      // Modify CKEditor configuration here
      window.CKEDITOR.config.allowedContent = true; // Adjust CKEditor configuration as needed
      window.CKEDITOR.config.versionCheck = false;
      // Disable auto-paragraphing
      window.CKEDITOR.config.autoParagraph = false;
      // Disable auto-correction of empty spaces
      window.CKEDITOR.config.autoParagraph = false;
      window.CKEDITOR.config.toolbar = [
        {
          name: "document",
          items: [
            "Source",
            "-",
            "Save",
            "NewPage",
            "ExportPdf",
            "Preview",
            "Print",
            "-",
            "Templates",
          ],
        },
        {
          name: "clipboard",
          items: [
            "Cut",
            "Copy",
            "Paste",
            "PasteText",
            "PasteFromWord",
            "-",
            "Undo",
            "Redo",
          ],
        },
        {
          name: "editing",
          items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
        },
        {
          name: "forms",
          items: [
            "Form",
            "Checkbox",
            "Radio",
            "TextField",
            "Textarea",
            "Select",
            "Button",
            "ImageButton",
            "HiddenField",
          ],
        },
        "/",
        {
          name: "basicstyles",
          items: [
            "Bold",
            "Italic",
            "Underline",
            "Strike",
            "Subscript",
            "Superscript",
            "-",
            "CopyFormatting",
            "RemoveFormat",
          ],
        },
        {
          name: "paragraph",
          items: [
            "NumberedList",
            "BulletedList",
            "-",
            "Outdent",
            "Indent",
            "-",
            "Blockquote",
            "CreateDiv",
            "-",
            "JustifyLeft",
            "JustifyCenter",
            "JustifyRight",
            "JustifyBlock",
            "-",
            "BidiLtr",
            "BidiRtl",
            "Language",
          ],
        },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        {
          name: "insert",
          items: [
            "Image",
            "Table",
            "HorizontalRule",
            "Smiley",
            "SpecialChar",
            "PageBreak",
            "Iframe",
          ],
        },
        "/",
        { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
        { name: "Line Height", items: ["lineheight"] },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "tools", items: ["Maximize", "ShowBlocks"] },
        { name: "about", items: ["About"] },
      ];
      // Add more font names to the font dropdown
      window.CKEDITOR.config.font_names =
        "Arial/Arial, Helvetica, sans-serif;" +
        "Times New Roman/Times New Roman, Times, serif;" +
        "Verdana/Verdana, Geneva, sans-serif;" +
        "Century Gothic/Century Gothic, sans-serif;" +
        "Georgia/Georgia, serif;" +
        "Comic Sans MS/Comic Sans MS, cursive;" +
        "Trebuchet MS/Trebuchet MS, sans-serif;" +
        "Palatino Linotype/Palatino Linotype, Book Antiqua, Palatino, serif;" +
        "Arial Black/Arial Black, Gadget, sans-serif;" +
        "Tahoma/Tahoma, Geneva, sans-serif;" +
        "Courier New/Courier New, Courier, monospace;" +
        "Impact/Impact, Charcoal, sans-serif;" +
        "Lucida Console/Lucida Console, Monaco, monospace;";

      // You can continue to add more fonts in the same format

      // Optional: Set the default font
      // window.CKEDITOR.config.fontSize_defaultLabel = '14px';
      window.CKEDITOR.config.font_defaultLabel = "Arial";

      window.CKEDITOR.config.line_height =
        "1/1;" + "1.5/1.5;" + "2/2;" + "2.5/2.5;" + "3/3";
      window.CKEDITOR.config.line_height_defaultLabel = "1.5";
    }
  }, []);

  useEffect(() => {
    // console.log("====",userData.access.id)
    if (clientnameid != "") {
      reset({
        // buildingId: "",
        clientId: {
          value: clientnameid,
          label: nameofClient,
        },
        buildingId: {
          value: buildingnmaeid,
          label: nameofBuilding,
        },
        jobId: {
          value: jobnameid,
          label: nameofJob,
        },


      });
      getTemplate(jobnameid);
    }
    // jobId: "",
    // templateId: "",
    getClientName();
    if (radioValue) {
      getTemplate(-1);
    }
    // getTemplate(1);
    let formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);

    axiosInstance
      .post("building/getBuildingColumnHeaderDD", formData, {
        headers: headersForJwt,
      })
      .then((response) => {
        if (
          response.data &&
          response.data.data &&
          response.data.data.BuildingColumnHeaders &&
          Array.isArray(response.data.data.BuildingColumnHeaders)
        ) {
          const buildingColumnHeaders =
            response.data.data.BuildingColumnHeaders;

          // Transform the data to match the expected options structure
          const formattedOptions = buildingColumnHeaders.map((header) => ({
            value: `[[${header.displayName}]]`,
            label: header.displayName.toUpperCase(), // Capitalize and add space
          }));

          // Set the options in the state, including a default option
          const options = [
            { value: "", label: "Select Building Field" },
            ...formattedOptions,
          ];

          // Assuming setBuildingField is a state updater function
          setBuildingField(options);
        } else {
          console.error("Invalid or empty data received from the server");
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
      });
    axiosInstance
      .post("client/getClientColumnHeaderDD", formData, {
        headers: headersForJwt,
      })
      .then((response) => {
        if (
          response.data &&
          response.data.data &&
          response.data.data.ClientColumnHeaders &&
          Array.isArray(response.data.data.ClientColumnHeaders)
        ) {
          const clientColumnHeaders = response.data.data.ClientColumnHeaders;

          // Transform the data to match the expected options structure
          const formattedOptions = clientColumnHeaders.map((header) => ({
            value: `[[${header.displayName}]]`,
            label: header.displayName.toUpperCase(), // Capitalize and add space
          }));

          // Set the options in the state, including a default option
          const options = [
            { value: "", label: "Select Client Field" },
            ...formattedOptions,
          ];

          // Assuming setClientField is a state updater function
          setClientField(options);
        } else {
          console.error("Invalid or empty data received from the server");
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
      });

    axiosInstance
      .post("shortcode/getAllShortcodeDetails", formData, {
        headers: headersForJwt,
      })
      .then((response) => {
        if (response.data && response.data.data && response.data.data.list) {
          const shortcodeList = response.data.data.list;

          // Transform the data to match the expected options structure
          const formattedOptions = shortcodeList.map((shortcode) => ({
            value: `[[${shortcode.tag}]]`,
            label: shortcode.tag,
          }));

          // Set the options in the state
          setShortcodeOptions([
            { value: "", label: "Select Short Code" },
            ...formattedOptions,
          ]);
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
      });

    axiosInstance
      .post("template/getAllCoverPage", formData, {
        headers: headersForJwt,
      })
      .then((response) => {
        if (response.data && response.data.data && response.data.data.list) {
          const coverPageOptions = response.data.data.list;

          // Transform the data to match the expected options structure
          const formattedOptions = coverPageOptions.map((cover) => ({
            value: cover.coverPageTemplate,
            label: cover.name,
          }));

          // Set the options in the state
          setCoverPageOptions([
            { value: "", label: "Select cover Page" },
            ...formattedOptions,
          ]);
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
      });
    getAllCountry();
  }, []); // This effect runs once on component mount

  // Function to handle form reset
  const handleReset = () => {
    // Reset the form using react-hook-form's reset method
    reset();
    // Reset the CKEditor content
    setTemplateHeader("");
    setTemplateBody("");
    setTemplateFooter("");
    setTemplateCoverPage("");
  };

  const handleSaveAndEdit = () => {
    setAction("saveAndEdit");
  };


  // Image upload function
  const [imageUrls, setImageUrls] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const fetchImages = async () => {
    const formData = new FormData();
    formData.append('userId', 1);
    try {
      const response = await axiosInstance.post('pdf/getImageGallery', formData, {
        headers: headersForJwt
      });
      setImageUrls(response.data.data.fileUrls);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const openModal = () => {
    fetchImages();
    setModalVisible(true);
  };


  const handleImageSelection = (imageUrl) => {
    setModalVisible(false); // Close modal after selecting image

    const editor = bodyEditorRef.current;
    const selectedValue = imageUrl;
    if (editor && selectedValue) {
      const selection = editor.getSelection();
      const selectedHtml = `<img src="${imageUrl}" alt="Selected Image" />`;

      if (selection) {
        if (editor.insertHtml) {
          editor.insertHtml(selectedHtml);
        } else if (editor.insertText) {
          // Fallback method for older CKEditor versions
          editor.insertText(selectedValue);
        } else {
          console.error('The CKEditor instance does not support insertHtml or insertText method.');
        }
      }
    }
  };


  return (
    <>
      <Helmet title={"Generate Report | IAQ Reporting System"} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            padding: "16px",
          },
        }}
        containerStyle={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="toster"
        reverseOrder={false}
      />

      {isReportLoading && <CircularLoader />}

      {!isReportLoading && (
        <>
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mt-2">
                  <div className="col-sm-9 pd-l-0">
                    <h5 className="m-0 mt-3 mb-2">Generate Report</h5>
                  </div>
                  <div className="col-sm-3">
                    <div className="m-0 mt-3 mb-2" style={{ float: "right" }}>
                      {" "}
                      <BackButton />{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ECF1F6",
                padding: "0.2%",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <section className="mt-5 ">
                  <Row className="mb-3">
                    {/* Country */}
                    {/* <Col lg={{ span: 6, offset: 3 }} md={6} xs={12} className="mb-3">
                  <h6 className="label-search">Country <span className="text-danger">*</span></h6>
                  <Form.Select
                    as="select"
                    size="sm"
                    name="countryId"
                    id="countryId"
                    className="form-add-user newSize"
                    {...register("countryId", {
                      onChange: (e) => {
                        getProviance(e);
                      },
                      required: "Country Required",
                    })}
                  >
                    <option value="">Select Country</option>
                    {CountryAll &&
                      CountryAll.length > 0 &&
                      CountryAll.map((cntr) => {
                        return (
                          <option value={cntr.countryId} key={cntr.countryId}>
                            {cntr.countryName}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {errors.countryId && (
                    <span className="text-danger">
                      {errors.countryId.message}
                    </span>
                  )}
                </Col> 
                <Col lg={{ span: 6, offset: 3 }} md={6} xs={12} className="mb-3">

                  <h6 className="label-search">Province <span className="text-danger">*</span></h6>
                  <Form.Select
                    as="select"
                    size="sm"
                    name="provinceId"
                    id="provinceId"
                    className="form-add-user newSize"
                    {...register("provinceId", {
                      onChange: (e) => {
                        getCity(e);
                      },
                      required: "Province Required",
                    })}
                  >
                    <option value="">Select Province</option>
                    {province &&
                      province.length > 0 &&
                      province.map((prov) => {
                        return (
                          <option value={prov.id} key={prov.id}>
                            {prov.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {errors.provinceId && (
                    <span className="text-danger">
                      {errors.provinceId.message}
                    </span>
                  )}
                </Col>
 
                <Col lg={{ span: 6, offset: 3 }} md={6} xs={12} className="mb-3">

                  <h6 className="label-search">City <span className="text-danger">*</span></h6>
                  <Form.Select
                    as="select"
                    size="sm"
                    name="cityId"
                    id="cityId"
                    className="form-add-user newSize"
                    {...register("cityId", {
                      onChange: (e) => {
                        getClientName(e);
                      },
                      required: "City Required",
                    })}
                  >
                    <option value="">Select City</option>
                    {city &&
                      city.length > 0 &&
                      city.map((city) => {
                        return (
                          <option value={city.cityId} key={city.cityId}>
                            {city.cityName}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {errors.cityId && (
                    <span className="text-danger">{errors.cityId.message}</span>
                  )}
                </Col> */}

                    {/* Client Name */}
                    <Col
                      lg={{ span: 6, offset: 3 }}
                      md={6}
                      xs={12}
                      className="mb-3"
                    >
                      <h6 className="label-search">
                        {" "}
                        Client Name <span className="text-danger">*</span>
                      </h6>

                      <Controller
                        control={control}
                        name="clientId"
                        // rules={{
                        //   required: "Client Name Required",
                        //   validate: (value) => {
                        //     console.log("Validation value:", value.value);
                        //     return value.value === "" || value.value === null;
                        //   },
                        // }}
                        {...register("clientId", {
                          required: "Client name required",
                          validate: (value) => {
                            // Custom validation logic
                            // console.log("Validation value:", value);

                            // Check if the value is not null, undefined, an empty string, or the default option
                            return (
                              value &&
                              value.value !== "" &&
                              value.value !== "Select Client"
                            );
                          },
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              {
                                value: "",
                                label: "Select Client",
                                isDisabled: true,
                              },
                              ...Client.map((prov) => ({
                                value: prov.clientId,
                                label: prov.clientName,
                              })),
                            ]}
                            onChange={(event) => {
                              getBuilding(event);
                              field.onChange(event);
                              reportDetails.current = {
                                ...reportDetails.current,
                                clientName: event.label,
                              };
                            }}
                            placeholder="Client Name"
                            name="clientId"
                            components={{
                              IndicatorSeparator: () => null,
                            }}
                          />
                        )}
                      />

                      {errors.clientId && (
                        <span className="text-danger">
                          {errors.clientId.message}
                        </span>
                      )}
                    </Col>
                    {/* Building Name */}
                    <Col
                      lg={{ span: 6, offset: 3 }}
                      md={6}
                      xs={12}
                      className="mb-3"
                    >
                      <h6 className="label-search">
                        {" "}
                        Building Name <span className="text-danger">*</span>
                      </h6>

                      <Controller
                        control={control}
                        name="buildingId"
                        rules={{ required: "Building Name Required" }}
                        {...register("buildingId", {})}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              {
                                value: "",
                                label: "Select Building",
                                isDisabled: true,
                              }, // Add a default option
                              ...buildingName.map((prov) => ({
                                value: prov.id,
                                label:
                                  prov.name +
                                  " at " +
                                  (prov.address2
                                    ? prov.address1 + ", " + prov.address2
                                    : prov.address1),
                              })),
                            ]}
                            onChange={(event) => {
                              getJob(event);
                              field.onChange(event);
                              reportDetails.current = {
                                ...reportDetails.current,
                                buildingName: event.label,
                                buildingId: event.value
                              };
                            }}
                            placeholder="Building Name"
                            name="buildingId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                        )}
                      />

                      {errors.buildingId && (
                        <span className="text-danger">
                          {errors.buildingId.message}
                        </span>
                      )}
                    </Col>
                    {/* Job Name */}

                    {/* {!radioValue && ( */}

                    <Col
                      lg={{ span: 6, offset: 3 }}
                      md={6}
                      xs={12}
                      className="mb-3"
                    >
                      <h6 className="label-search">
                        {" "}
                        Job Name <span className="text-danger">*</span>
                      </h6>
                      <Controller
                        control={control}
                        name="jobId"
                        rules={{ required: "Job Name Required" }}
                        {...register("jobId", {
                          // onChange: (data) => getTemplate(data.target.value),
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isSearchable
                            size="sm"
                            options={[
                              {
                                value: "",
                                label: "Select Job",
                                isDisabled: true,
                              }, // Add a default option
                              ...job.map((prov) => ({
                                value: prov.id,
                                label: prov.projectNumber,
                              })),
                            ]}
                            onChange={(event) => {
                              getTemplate(event.value);
                              field.onChange(event);
                              reportDetails.current = {
                                ...reportDetails.current,
                                projectNumber: event.label,
                                jobId: event.value,
                              };
                            }}
                            placeholder="Job Name"
                            name="jobId"
                          />
                        )}
                      />
                      {errors.jobId && (
                        <span className="text-danger">
                          {errors.jobId.message}
                        </span>
                      )}
                      {errorMessage !== null && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </Col>
                    {/* )} */}
                    {/* Template Name */}
                    <Col
                      lg={{ span: 6, offset: 3 }}
                      md={6}
                      xs={12}
                      className="mb-3"
                    >
                      <h6 className="label-search">
                        {" "}
                        Template Name <span className="text-danger">*</span>
                      </h6>

                      <Controller
                        control={control}
                        name="templateId"
                        rules={{ required: "Template name required" }}
                        {...register("templateId", {
                          required: "Template name required",
                        })}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              {
                                value: "",
                                label: "Select Template",
                                isDisabled: true,
                              }, // Add a default option
                              ...templates.map((prov) => ({
                                value: prov.id,
                                label: prov.templateName,
                              })),
                            ]}
                            onChange={(event) => {
                              getTemplateById(event.value);
                              field.onChange(event);
                              reportDetails.current = {
                                ...reportDetails.current,
                                templateName: event.label,
                              };
                            }}
                            placeholder="Template Name"
                            name="templateId"
                            components={{
                              IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            }}
                          />
                          // <Select
                          //   {...field}
                          //   size="sm"
                          //   options={[
                          //     {
                          //       value: "",
                          //       label: "Select Template",
                          //       isDisabled: true,
                          //     }, // Add a default option
                          //     ...templates.map(prov => {
                          //       // Conditionally set the label based on userData.access.id
                          //       const label = (userData.access.id === 1 || userData.access.id === 2 || userData.access.id === 3)  ? "Tenant Report" : prov.templateName;

                          //       return {
                          //         value: prov.id,
                          //         label: label,
                          //       };
                          //     }),
                          //   ]}
                          //   onChange={(event) => {
                          //     getTemplateById(event.value);
                          //     field.onChange(event);
                          //     reportDetails.current = {
                          //       ...reportDetails.current,
                          //       templateName: event.label,
                          //     };
                          //   }}
                          //   placeholder="Template Name"
                          //   name="templateId"
                          //   components={{
                          //     IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                          //   }}
                          // />

                        )}
                      />

                      {errors.templateId && (
                        <span className="text-danger">
                          {errors.templateId.message}
                        </span>
                      )}
                    </Col>
                    <Col
                      lg={{ span: 6, offset: 3 }}
                      md={6}
                      xs={12}
                      className="mb-3"
                    >
                      <br />
                      <Form.Label className="newSize">
                        External Document /PDF
                      </Form.Label>
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} name="csvFile" />
                        <BiSolidCloudUpload className="fil-45" />
                        <p>
                          Drag 'n' drop Document file here, or click to select
                          files
                        </p>
                      </div>
                      <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <aside className="file-na-container mt-4 mb-4">
                          <h6 className="f-s">
                            {" "}
                            <FaFile className="fil-size mr-2" />
                            Files
                          </h6>
                          <ul className="mb-0">{files}</ul>
                        </aside>
                      </Form.Group>
                    </Col>
                  </Row>
                </section>
                {/* Section 2 */}

                {isTemplateFieldShown && (
                  <>
                    {/* cover 2 */}
                    <section className="mt-5">
                      <section className="mt-5">
                        <div className="Client-Statistical-Data">
                          <h6>
                            <strong>Template Cover Page</strong>
                          </h6>
                          {/* <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleButtonClick}
                      >
                        {isSectionVisible
                          ? "Hide Cover Page"
                          : "Show Cover Page"}
                      </button> */}
                        </div>
                      </section>
                      {isSectionVisible && (
                        <div
                          className={
                            isSectionVisible
                              ? "Client-Statistical-Data section"
                              : "Client-Statistical-Data section section-hidden"
                          }
                        >
                          <Row>
                            <Col md={3}>
                              <h6 className="label-search">
                                Select Cover Page
                              </h6>
                              <Select
                                onChange={handleCoverPageChange}
                                placeholder="Select Cover Page"
                                options={coverPageOptions}
                              />
                            </Col>
                          </Row>
                          <br></br> {/* <div style={{ height: '500px' }}> */}
                          <CKEditor
                            // data={templateCoverPage}
                            data="" // Initial empty data
                            ref={coverEditorRef}
                            onChange={(event) => {
                              const data = event.editor.getData();
                              setTemplateCoverPage(data);
                            }}
                            config={{
                              language: "en",
                              height: 800,
                              filebrowserImageBrowseUrl:
                                "http://siaqreporting.com/LiveEditor/assetmanager/asset.php", // Path to your PHP file browser script

                              on: {
                                instanceReady: (event) => {
                                  // Call handleEditorReady and pass the editor instance
                                  handleEditorReady("coverEditor", event);
                                  // Call the original on.instanceReady function if needed
                                  // ...
                                },
                              },
                              // Other configurations...
                            }}
                          />
                          {/* </div> */}
                          {/* </Container> */}
                        </div>
                      )}
                      {/* <button onClick={convertToPDF}>Download as PDF</button> */}
                    </section>

                    <section className="mt-5">
                      <section className="mt-5">
                        <div className="Client-Statistical-Data">
                          <h6>
                            <strong>Template Header</strong>
                          </h6>
                        </div>
                      </section>
                      <div className="Client-Statistical-Data">
                        {/* <Container> */}
                        <Row>
                          {/* <Col>
                            <h6 className="label-search">Select Short Code</h6>
                            <Select
                              onChange={handleOptionChange1}
                              placeholder="Select Short Code"
                              options={shortcodeOptions}
                            />
                          </Col> */}
                          <Col>
                            <h6 className="label-search">
                              Select Client Field
                            </h6>
                            <Select
                              onChange={handleOptionChange1}
                              placeholder="Select Client Field"
                              options={clientField}
                            />
                          </Col>
                          <Col>
                            <h6 className="label-search">
                              Select Building Field
                            </h6>
                            <Select
                              onChange={handleOptionChange1}
                              placeholder="Select Building Field"
                              options={buildingField}
                            />
                          </Col>
                        </Row>
                        <br></br> {/* <div style={{ height: '500px' }}> */}
                        <CKEditor
                          data="" // Initial empty data
                          ref={headerEditorRef} // Assign the reference to the header editor
                          onChange={(event) => {
                            const data = event.editor.getData();
                            // console.log(data);
                            setTemplateHeader(data);
                          }}
                          config={{
                            language: "en",
                            height: 130,
                            filebrowserImageBrowseUrl: "", // Path to your PHP file browser script

                            on: {
                              instanceReady: (event) => {
                                // Call handleEditorReady and pass the editor instance
                                handleEditorReady("headerEditor", event);
                                // Call the original on.instanceReady function if needed
                                // ...
                              },
                            },
                            // Other configurations...
                          }}
                        />
                        {/* </div> */}
                        {/* </Container> */}
                      </div>
                      {/* <button onClick={convertToPDF}>Download as PDF</button> */}
                    </section>
                    {/* Section 2 */}
                    <section className="mt-5">
                      <section className="mt-5">
                        <div className="Client-Statistical-Data">
                          <h6>
                            <strong>Template Footer</strong>
                          </h6>
                        </div>
                      </section>
                      <div className="Client-Statistical-Data">
                        {/* <Container> */}
                        <Row>
                          {/* <Col>
                            <h6 className="label-search">Select Short Code</h6>
                            <Select
                              onChange={handleOptionChange3}
                              placeholder="Select Short Code"
                              options={shortcodeOptions}
                            />
                          </Col> */}
                          <Col>
                            <h6 className="label-search">
                              Select Client Field
                            </h6>
                            <Select
                              onChange={handleOptionChange3}
                              placeholder="Select Client Field"
                              options={clientField}
                            />
                          </Col>
                          <Col>
                            <h6 className="label-search">
                              Select Building Field
                            </h6>
                            <Select
                              onChange={handleOptionChange3}
                              placeholder="Select Building Field"
                              options={buildingField}
                            />
                          </Col>
                        </Row>
                        <br></br> {/* <div style={{ height: '500px' }}> */}
                        <CKEditor
                          data="" // Initial empty data
                          ref={footerEditorRef} // Assign the reference to the footer editor
                          onChange={(event) => {
                            const data = event.editor.getData();
                            setTemplateFooter(data);
                          }}
                          config={{
                            language: "en",
                            height: 130,
                            filebrowserImageBrowseUrl: "", // Path to your PHP file browser script

                            on: {
                              instanceReady: (event) => {
                                handleEditorReady("footerEditor", event);
                                // Additional actions after instance ready if needed
                              },
                            },
                            // Other configurations...
                          }}
                        />
                        {/* </div> */}
                        {/* </Container> */}
                      </div>
                    </section>
                    {/* body 2 */}

                    <section className="mt-5">
                      <section className="mt-5">
                        <div className="Client-Statistical-Data">
                          <h6>
                            <strong>Template Body</strong>
                          </h6>
                        </div>
                      </section>
                      <div className="Client-Statistical-Data">
                        {/* <Container> */}
                        <Row>
                          <Col>
                            <h6 className="label-search">Select Short Code</h6>
                            <Select
                              onChange={handleOptionChange2}
                              placeholder="Select Short Code"
                              options={shortcodeOptions}
                            />
                          </Col>
                          <Col>
                            <h6 className="label-search">
                              Select Client Field
                            </h6>
                            <Select
                              onChange={handleOptionChange2}
                              placeholder="Select Client Field"
                              options={clientField}
                            />
                          </Col>
                          <Col>
                            <h6 className="label-search">
                              Select Building Field
                            </h6>
                            <Select
                              onChange={handleOptionChange2}
                              placeholder="Select Building Field"
                              options={buildingField}
                            />
                          </Col>
                          <Col style={{ marginTop: '18px' }}>
                            <Button onClick={openModal} ><CiImageOn fontSize={24} className='mr-2' />upload Image</Button>

                          </Col>
                        </Row>
                        <br></br> {/* <div style={{ height: '500px' }}> */}
                        <CKEditor
                          data="" // Initial empty data
                          ref={bodyEditorRef} // Assign the reference to the body editor
                          onChange={(event) => {
                            const data = event.editor.getData();
                            setTemplateBody(data);
                          }}
                          config={{
                            language: "en",
                            height: 1500,
                            filebrowserImageBrowseUrl:
                              "http://siaqreporting.com/LiveEditor/assetmanager/asset.php", // Path to your PHP file browser script
                            on: {
                              instanceReady: (event) => {
                                handleEditorReady("bodyEditor", event);
                                // Additional actions after instance ready if needed
                              },
                            },
                            // Other configurations...
                          }}
                        />
                        {/* </div> */}
                        {/* </Container> */}
                      </div>
                    </section>

                  </>
                )}

                <section className="mt-5">
                  <div
                    style={{ "text-align": "center" }}
                    className="Client-Statistical-Data"
                  >
                    {errorMessage === "" && (
                      <>
                        <button
                          style={{ padding: "10px 20px", marginRight: "10px" }}
                          className="btn btn-primary"
                          type="submit"
                          disabled={isPreviewing}
                        // disabled={!isDirty} // Disable Save button if form is not modified
                        >
                          {buttonText}
                        </button>
                        <button
                          style={{ padding: "10px 20px", marginRight: "10px" }}
                          className="btn btn-primary"
                          type="submit"
                          disabled={isPreviewing}
                          onClick={handleSaveAndEdit}
                        // disabled={!isDirty} // Disable Save button if form is not modified
                        >
                          Generate and Edit
                        </button>

                      </>
                    )}
                  </div>
                </section>
              </form>
            </div>
          </div>
          {/* Modal for PDF preview */}
          {/* Modal for PDF preview */}
          <Modal
            show={pdfModalOpen}
            onHide={() => setPdfModalOpen(false)}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Preview PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: "80vh" }}>
              <div
                id="pdfModalContent"
                style={{ height: "100%", width: "100%" }}
              >
                {/* Display the PDF content */}
                {pdfContent && (
                  <iframe
                    src={pdfContent}
                    title="Preview PDF"
                    style={{ height: "100%", width: "100%", frameborder: "0" }}
                  />
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setPdfModalOpen(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={modalVisible} onHide={() => setModalVisible(false)} dialogClassName='modal-lg'>
            <Modal.Header closeButton>
              <div>
                <Modal.Title>Image Gallery</Modal.Title>
                <p style={{ fontSize: '14px', color: '#888' }}>(Double click to select an image)</p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Button className='mx-2' variant="primary" onClick={() => setUploadModalVisible(true)}>Upload Image</Button>

              <Container className='mt-2'>

                <div className='flex-row-left'>
                  {imageUrls.map((url, index) => (
                    <Col lg='3' className='p-1'>


                      <Card key={index} className='card-columns mb-2'>
                        <Image src={url} alt={`Image ${index}`} onDoubleClick={() => handleImageSelection(url)} />
                        {/* <Card.Body>
                      <Card.Title style={{ fontSize: 12 }}>Image {index + 1}</Card.Title>
                    </Card.Body> */}
                      </Card>



                    </Col>
                  ))}

                </div>

              </Container>


            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => setModalVisible(false)}>Close</Button>
            </Modal.Footer>
          </Modal>

          {/* Upload image modal */}
          <ImageUploadModal fetchImages={fetchImages} uploadModalVisible={uploadModalVisible} setUploadModalVisible={setUploadModalVisible} />
        </>
      )}
    </>
  );
}

export default GenerateReport;
