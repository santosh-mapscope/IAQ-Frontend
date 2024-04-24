/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useRef, useState } from "react";

import { Helmet } from "react-helmet";
import { CKEditor } from "ckeditor4-react";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { FaFileCsv } from "react-icons/fa";
import { BiSolidCloudUpload } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import DatePicker from "react-datepicker";
import Row from "react-bootstrap/Row";
import { Controller, useForm } from "react-hook-form";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import {
  PiBackspaceFill

} from "react-icons/pi";
import Modal from "react-bootstrap/Modal";

import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../../util/customToast";
import BackButton from "../../components/BackButton";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";
import ImageUploadModal from "../../components/editorImageUpload/ImageUploadModal";
import { Card, Image } from "react-bootstrap";
import { CiImageOn } from "react-icons/ci";

function EditReport() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  // const { state } = useLocation();
  // const reportDetails = state?.reportDetails;
  // State variables for editor content
  const navigate = useNavigate();
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for loading
  const [reportHeader, setReportHeader] = useState("");
  const [reportBody, setReportBody] = useState("");
  const [reportFooter, setReportFooter] = useState("");
  const [reportCoverPage, setReportCoverPage] = useState("");

  const [buildingField, setBuildingField] = useState([]);
  const [clientField, setClientField] = useState([]);
  const [shortcodeOptions, setShortcodeOptions] = useState([]);
  const [coverPageOptions, setCoverPageOptions] = useState([]);

  const [userData, setUserData] = useRecoilState(userAtom);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const [pdfContent, setPdfContent] = useState("");
  const [detials, setDetails] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const radioValue = urlParams.get("radioValue") === "true";
  const coverEditorRef = useRef(null);
  const headerEditorRef = useRef(null);
  const bodyEditorRef = useRef(null);
  const footerEditorRef = useRef(null);
  const [buttonText, setButtonText] = useState("Preview"); // State for button text
  const [isPreviewing, setIsPreviewing] = useState(false); // State for preview status
  const reportDetails = useRef({
    clientName: "",
    buildingName: "",
    buildingId: "",
    templateName: "",
    projectNumber: "",
    jobId: "",
    radioValue: false,
    flag: ""
  });
  const [templateId, setTemplateId] = useState(""); // State for preview status

  const [roleId, setRoleId] = useState("")

  // const [isSectionVisible, setIsSectionVisible] = useState(false); // State to control section visibility

  // const handleButtonClick = () => {
  //   setIsSectionVisible(!isSectionVisible); // Toggle section visibility on button click
  // };

  const handleClose = () => setPdfModalOpen(false);
  // const handlePreview = async () => {
  //   setButtonText("Please Wait..."); // Change button text to "Please Wait"
  //   setIsPreviewing(true); // Set previewing state to true
  //   const toastId = toast.loading("Loading in...");
  //   let formData = new FormData();
  //   formData.append("userId", userData.userDetails.userId); 
  //   formData.append("templateHeader", `${validateAndFixHTML(reportHeader)}`);
  //   formData.append("templateBody", `${validateAndFixHTML(reportBody)}`);
  //   formData.append("templateFooter", `${validateAndFixHTML(reportFooter)}`);
  //   formData.append("coverPage", `${validateAndFixHTML(reportCoverPage)}`);

  //   axiosInstance
  //     .post("pdf/exportPdfTemplate", formData, {
  //       headers: headersForJwt,
  //       responseType: "blob",
  //     })
  //     .then((response) => {
  //       if (response) {
  //         const file = new Blob([response.data], { type: "application/pdf" });
  //         const fileURL = URL.createObjectURL(file);
  //         setPdfContent(fileURL);
  //         setTimeout(() => {
  //           setPdfModalOpen(true);
  //           toast.dismiss(toastId);
  //           toast.success("PDF Preview Open Successfully!");
  //           setButtonText("Preview"); // Revert button text after modal opens
  //           setIsPreviewing(false); // Set previewing state to false
  //         }, 1000);
  //       } else {
  //         toast.error("Error fetching data:");
  //         toast.dismiss(toastId);
  //         setButtonText("Preview"); // Revert button text if an error occurs
  //         setIsPreviewing(false); // Set previewing state to false
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       toast.error("Error fetching data:");
  //       toast.dismiss(toastId);
  //       setButtonText("Preview"); // Revert button text if an error occurs
  //       setIsPreviewing(false); // Set previewing state to false
  //     });

  //   // toast.dismiss();
  // };


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
      text: " Do you want to update this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        //  const toastId = toast.loading("Updating..."); 
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);
        //  const { templateDate } = data;

        // const requestData = {
        //   ...data,
        //   reportHeader: reportHeader,
        //   reportBody: reportBody,
        //   reportFooter: reportFooter,
        //   reportCoverPage: reportCoverPage,
        //   reportId: originalId,
        // };

        let formData = new FormData();
        formData.append("reportHeader", `${validateAndFixHTML(reportHeader)}`);

        formData.append("reportBody", reportBody != "" ? `${validateAndFixHTML(reportBody)}` : "");

        // formData.append("reportBody", `${validateAndFixHTML(reportBody)}`);
        formData.append("reportFooter", `${validateAndFixHTML(reportFooter)}`);
        formData.append("reportCoverPage", `${validateAndFixHTML(reportCoverPage)}`);
        formData.append("reportId", originalId);
        formData.append("userId", userData.userDetails.userId);
        axiosInstance
          .post("report/updateReport", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            setFullPageLoading(false);
            if (res && res.data.status === 1) {

              // toast.dismiss(toastId);
              // toast.success("Report Updated Successfully!");
              Swal.fire(
                "Updated!",
                "Report updated successfully!",
                "success"
              );
              // handleReset();
              //  navigate("/manageReports");
            } else {
              //  toast.dismiss(toastId);

              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Report updation failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            // toast.dismiss(toastId);
            setFullPageLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };
  const handlePreview = async () => {
    setButtonText("Please Wait..."); // Change button text to "Please Wait"
    setIsPreviewing(true); // Set previewing state to true
    const toastId = toast.loading("Loading in...");
    let formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("templateHeader", `${validateAndFixHTML(reportHeader)}`);

    formData.append("templateBody", reportBody != "" ? `${validateAndFixHTML(reportBody)}` : "");

    // formData.append("templateBody", `${validateAndFixHTML(reportBody)}`);
    formData.append("templateFooter", `${validateAndFixHTML(reportFooter)}`);
    formData.append("coverPage", `${validateAndFixHTML(reportCoverPage)}`);

    axiosInstance
      .post("pdf/exportPdfTemplate", formData, {
        headers: headersForJwt,
        responseType: "blob",
      })
      .then((response) => {
        if (response) {
          // const contentDisposition = response.headers['content-disposition'];
          // const filename = contentDisposition.split(';')[1].trim().split('=')[1].replace(/"/g, '');
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          setPdfContent(fileURL);
          setTimeout(() => {
            const newWindow = window.open(fileURL, '_blank');
            if (newWindow) {
              newWindow.document.title = 'PDF Preview';
            }
            toast.dismiss(toastId);
            toast.success("PDF Preview Opened Successfully!");
            setButtonText("Preview"); // Revert button text after modal opens
            setIsPreviewing(false); // Set previewing state to false
          }, 1000);
        } else {
          toast.error("Error fetching data:");
          toast.dismiss(toastId);
          setButtonText("Preview"); // Revert button text if an error occurs
          setIsPreviewing(false); // Set previewing state to false
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:");
        toast.dismiss(toastId);
        setButtonText("Preview"); // Revert button text if an error occurs
        setIsPreviewing(false); // Set previewing state to false
      });

    // toast.dismiss();
  };
  const saveReport = async () => {
    Swal.fire({
      title: "Please confirm",
      text: " Do you want to save this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {

        setFullPageLoading(true);
        //  const toastId = toast.loading("Updating..."); 
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        let formData = new FormData();
        formData.append("reportHeader", `${validateAndFixHTML(reportHeader)}`);

        formData.append("reportBody", reportBody != "" ? `${validateAndFixHTML(reportBody)}` : "");

        // formData.append("reportBody", `${validateAndFixHTML(reportBody)}`);
        formData.append("reportFooter", `${validateAndFixHTML(reportFooter)}`);
        formData.append("reportCoverPage", `${validateAndFixHTML(reportCoverPage)}`);
        formData.append("reportId", originalId);
        formData.append("userId", userData.userDetails.userId);

        formData.append("isSavedReport", "True");

        axiosInstance
          .post("report/updateReport", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            setFullPageLoading(false);
            if (res && res.data.status === 1) {
              sentMail(reportDetails.current);
              const formData = new FormData();
              formData.append("userId", userData.userDetails.userId);
              formData.append("reportId", originalId);

              axiosInstance
                .post("pdf/downloadPdf", formData, { headers: headersForJwt })
                .then((res) => {
                  const pdfUrl = res.data.data.list.fileName;


                  if (pdfUrl !== null) {
                    window.open(pdfUrl, "_blank");
                    navigate("/manageReports");
                    // toast.dismiss(toastId);
                    // toast.success("PDF Download Successfully!");
                  } else {

                  }
                })
                .catch((err) => {
                  Swal.fire(
                    "Updated!",
                    "Report updated but could not be downloaded!",

                  );
                });
              Swal.fire(
                "Report saved successfully!",
              );

            } else {
              //  toast.dismiss(toastId);

              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Report updation failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            // toast.dismiss(toastId);
            setFullPageLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });

    //  sentMail(reportDetails.current);


    //  navigate("/manageReports");

  }
  const saveReportOther = async () => {
    Swal.fire({
      title: "Please confirm",
      text: " Do you want to save this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {


        setFullPageLoading(true);
        //  const toastId = toast.loading("Updating..."); 
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        let formData = new FormData();
        formData.append("reportHeader", `${validateAndFixHTML(reportHeader)}`);

        formData.append("reportBody", reportBody != "" ? `${validateAndFixHTML(reportBody)}` : "");

        // formData.append("reportBody", `${validateAndFixHTML(reportBody)}`);
        formData.append("reportFooter", `${validateAndFixHTML(reportFooter)}`);
        formData.append("reportCoverPage", `${validateAndFixHTML(reportCoverPage)}`);
        formData.append("reportId", originalId);
        formData.append("userId", userData.userDetails.userId);
        axiosInstance
          .post("report/updateReport", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            setFullPageLoading(false);
            if (res && res.data.status === 1) {
              if (templateId == 15) {
                reportDetails.current.flag = 1;
              }
              if (templateId == 14) {
                reportDetails.current.flag = 2;
              }
              if (templateId == 16) {
                reportDetails.current.flag = 3;
              }
              sentMail2(reportDetails.current);
              const formData = new FormData();
              formData.append("userId", userData.userDetails.userId);
              formData.append("reportId", originalId);

              axiosInstance
                .post("pdf/downloadPdf", formData, { headers: headersForJwt })
                .then((res) => {
                  const pdfUrl = res.data.data.list.fileName;
                  // console.log(pdfUrl);

                  if (pdfUrl !== null) {
                    window.open(pdfUrl, "_blank");
                    navigate("/manageOtherReports");
                    // toast.dismiss(toastId);
                    // toast.success("PDF Download Successfully!");
                  } else {

                  }
                })
                .catch((err) => {
                  Swal.fire(
                    "Updated!",
                    "Report updated but could not be downloaded!",

                  );
                });
              Swal.fire(
                "Report saved successfully!",
              );

            } else {
              //  toast.dismiss(toastId);

              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Report updation failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            // toast.dismiss(toastId);
            setFullPageLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });

    //  sentMail(reportDetails.current);

    // console.log(reportDetails);
    //  navigate("/manageReports");

  }
  const sentMail = async (details) => {

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
          if (response.data.status == 1) {

          }
        })
        .catch((error) => {

        });
    }
  };
  const sentMail2 = async (details) => {

    if (details.radioValue) {
      const formData = new FormData();
      formData.append('clientName', details.clientName);
      formData.append('flag', details.flag);
      formData.append('buildingName', details.buildingName);
      formData.append('buildingId', details.buildingId);
      formData.append("jobId", details.jobId)
      axiosInstance
        .post("report/sendOtherReportNotification", formData, {
          headers: headersForJwt,
        })
        .then((response) => {

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
    }
  };

  const handleReset = () => {
    // Reset the form using react-hook-form's reset method
    reset();

    // Reset the CKEditor content
    setReportHeader("");
    setReportBody("");
    setReportFooter("");
    setReportCoverPage("");
  };

  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const handleStausOptionChange = (selectedOption) => {
    setValue("status", selectedOption?.value || ""); // Set the value to the selected option's value


  };

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
        fetchDataFromApi(id, headerEditorRef, "reportHeader");
        break;

      case "bodyEditor":
        bodyEditorRef.current = event.editor;
        fetchDataFromApi(id, bodyEditorRef, "reportBody");
        break;

      case "footerEditor":
        footerEditorRef.current = event.editor;
        fetchDataFromApi(id, footerEditorRef, "reportFooter");
        break;

      case "coverEditor":
        coverEditorRef.current = event.editor;
        fetchDataFromApi(id, coverEditorRef, "reportCoverPage");
        break;

      default:
        break;
    }
  };

  const fetchDataFromApi = async (id, editorRef, reportDataKey) => {
    try {
      if (id) {
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        if (!isNaN(originalId)) {
          const formData = new FormData();
          formData.append("userId", userData.userDetails.userId);
          formData.append("reportId", originalId);
          const res = await axiosInstance.post(
            "report/getReportById",
            formData,
            {
              headers: headersForJwt,
            }
          );

          if (res.data.data.list.templateId.id === 14 ||
            res.data.data.list.templateId.id === 15 ||
            res.data.data.list.templateId.id === 16) {
            setShowNotification(true);
          }

          setDetails(res.data.data.list);
          const reportData = res.data.data.list;

          // Update reportDetails with the data from API response
          reportDetails.current = {
            clientName: reportData.clientId.name,
            buildingName: reportData.buildingId.name,
            buildingId: reportData.buildingId.id,
            templateName: reportData.templateId.templateName,
            projectNumber: reportData.jobId.projectNumber,
            jobId: reportData.jobId.id,
            radioValue: reportData.isOtherReport,
            flag: reportData.templateId.id

          };


          if (editorRef.current) {
            editorRef.current.setData(
              res.data.data.list[reportDataKey] ?? ""
            );
          }
        } else {
          navigate("/manageReports");
        }
      } else {
        throw new Error("No decodedId available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
    }
  };

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
            "Redo"
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
        "1/1;" +
        "1.5/1.5;" +
        "2/2;" +
        "2.5/2.5;" +
        "3/3";
      window.CKEDITOR.config.line_height_defaultLabel = "1.5";

    }




  }, []);

  useEffect(() => {
    try {
      if (id) {
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        if (!isNaN(originalId)) {
          // alert(originalId)

          const formData = new FormData();
          formData.append("userId", userData.userDetails.userId);
          formData.append("reportId", originalId);
          axiosInstance
            .post("report/getReportById", formData, {
              headers: headersForJwt,
            })
            .then((res) => {
              setTemplateId(res.data.data.list.templateId.id);
              // console.log(res.data.data.list.templateId.id);
              // if (res.data.data.list.templateId.id == 16) {
              //   setViewtemplateBody(false);
              // }
              if (headerEditorRef.current) {
                headerEditorRef.current.setData(
                  res.data.data.list.reportHeader ?? ""
                );
              }

            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              throw error; // Throw the error to be caught by the component
            });
        } else {
          navigate("/manageReports"); // This will navigate back to the previous URL
        }
      } else {
        throw new Error("No decodedId available");
      }
    } catch (error) {
      console.error("Error decoding:", error);
      // If there's an error in decoding, navigate to the previous URL
      // navigate('/manageRepors'); // This will navigate back to the previous URL
    }
  }, [id]);

  useEffect(() => {
    setRoleId(userData.userDetails.roleId)

    let formData = new FormData();
    if (userData !== "") formData.append("userId", userData.userDetails.userId);


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
            { value: "", label: "Select Cover Page" },
            ...formattedOptions,
          ]);
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
      });
  }, []); // This effect runs once on component mount

  // image upload code
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
  // const [viewtemplateBody, setViewtemplateBody] = useState(true);
  return (
    <>
      <Helmet title={"Edit Report | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      {/* <Toaster
  toastOptions={{
    className: '',
    style: { 
      padding: '16px', 
    },
  }}
  containerStyle={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }}
  className="toster"
  reverseOrder={false}
/> */}
      <Toaster position="top-center" className="toster" reverseOrder={false} />

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Edit Report</h5>

              </div>
              <div className="col-sm-3">
                <div className="m-0 mt-3 mb-2" style={{ 'float': 'right' }}>   <BackButton />   </div>

              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#ECF1F6",
            padding: "1%",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* cover 2 */}
            <section className="mt-5">
              <section className="mt-5">
                <div className="Client-Statistical-Data">
                  <h6>
                    <strong>Report Cover Page</strong>
                  </h6>
                  {/* <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleButtonClick}
                  >
                    {isSectionVisible ? "Hide Cover Page" : "Show Cover Page"}
                  </button> */}
                </div>
              </section>
              {/* {isSectionVisible && ( */}
              <div
                className={
                  true
                    ? "Client-Statistical-Data section"
                    : "Client-Statistical-Data section section-hidden"
                }
              >
                <Row>
                  <Col md={3}>
                    <h6 className="label-search">Select Cover Page</h6>
                    <Select
                      onChange={handleCoverPageChange}
                      placeholder="Select Cover Page"
                      options={coverPageOptions}
                    />
                  </Col>
                </Row>
                <br></br>

                <CKEditor


                  data="" // Initial empty data
                  ref={coverEditorRef}
                  onChange={(event) => {
                    const data = event.editor.getData();
                    setReportCoverPage(data);
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
              {/* )} */}
              {/* <button onClick={convertToPDF}>Download as PDF</button> */}
            </section>

            <section className="mt-5">
              <section className="mt-5">
                <div className="Client-Statistical-Data">
                  <h6>
                    <strong>Report Header</strong>
                  </h6>
                </div>
              </section>
              <div className="Client-Statistical-Data">

                <br></br> {/* <div style={{ height: '500px' }}> */}
                <CKEditor
                  data="" // Initial empty data
                  ref={headerEditorRef} // Assign the reference to the header editor
                  onChange={(event) => {
                    const data = event.editor.getData();

                    setReportHeader(data);
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
                    <strong>Report Footer</strong>
                  </h6>
                </div>
              </section>
              <div className="Client-Statistical-Data">

                <br></br> {/* <div style={{ height: '500px' }}> */}
                <CKEditor
                  data="" // Initial empty data
                  ref={footerEditorRef} // Assign the reference to the footer editor
                  onChange={(event) => {
                    const data = event.editor.getData();
                    setReportFooter(data);
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
                    <strong>Report Body</strong>
                  </h6>
                </div>
              </section>
              <div className="Client-Statistical-Data">
                <Col>
                  <Button onClick={openModal} ><CiImageOn fontSize={24} className='mr-2' />Choose Image</Button>

                </Col>
                <br></br> {/* <div style={{ height: '500px' }}> */}
                <CKEditor
                  data="" // Initial empty data
                  ref={bodyEditorRef} // Assign the reference to the body editor
                  onChange={(event) => {
                    const data = event.editor.getData();
                    setReportBody(data);
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

            <section className="mt-5">
              <div className="Client-Statistical-Data">
                <button
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-primary"
                  type="submit"
                // disabled={!isDirty} // Disable Save button if form is not modified
                >
                  Update
                </button>

                <button
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={handlePreview}
                  disabled={isPreviewing} // Disable button when preview is loading
                >
                  {buttonText}
                </button>
                {!showNotification && (
                  <button
                    style={{ padding: "10px 20px", marginRight: "10px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={saveReport}
                  >
                    Save
                  </button>
                )}
                {showNotification && roleId !== 8 && (
                  <button
                    style={{ padding: "10px 20px", marginRight: "10px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={saveReportOther}
                  >
                    Save & notify
                  </button>
                )}
              </div>
            </section>
          </form>
        </div>
      </div>
      {/* Modal for PDF preview */}
      <Modal
        show={pdfModalOpen}
        onHide={() => setPdfModalOpen(false)}
        dialogClassName="modal-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          <div id="pdfModalContent" style={{ height: "100%", width: "100%" }}>
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
          <Button variant="secondary" onClick={() => setPdfModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* image gallery */}
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
                <Col lg={3} className='p-1'>


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
  );
}

export default EditReport;
