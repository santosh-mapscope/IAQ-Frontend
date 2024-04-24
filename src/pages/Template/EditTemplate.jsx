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
import Modal from "react-bootstrap/Modal";

import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { CiImageOn } from "react-icons/ci";
import ImageUploadModal from "../../components/editorImageUpload/ImageUploadModal";
import { Card, Image } from "react-bootstrap";

function EditTemplate() {
  const { id } = useParams(); // Get the 'id' parameter from the URL

  const navigate = useNavigate();
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for loading
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

  const coverEditorRef = useRef(null);
  const headerEditorRef = useRef(null);
  const bodyEditorRef = useRef(null);
  const footerEditorRef = useRef(null);
  const [buttonText, setButtonText] = useState("Preview"); // State for button text
  const [isPreviewing, setIsPreviewing] = useState(false); // State for preview status

  const [isSectionVisible, setIsSectionVisible] = useState(true); // State to control section visibility

  // const handleButtonClick = () => {
  //   setIsSectionVisible(!isSectionVisible); // Toggle section visibility on button click
  // };

  const handleClose = () => setPdfModalOpen(false);
  const [templateName, setTemplateName] = useState("");
  // const handlePreview = async () => {
  //   setButtonText("Please Wait..."); // Change button text to "Please Wait"
  //   setIsPreviewing(true); // Set previewing state to true
  //   const toastId = toast.loading("Loading in...");
  //   let formData = new FormData();
  //   formData.append("userId", userData.userDetails.userId);
  //   formData.append("templateName", "template");
  //   formData.append("templateHeader", `${validateAndFixHTML(templateHeader)}`);
  //   formData.append("templateBody", `${validateAndFixHTML(templateBody)}`);
  //   formData.append("templateFooter", `${validateAndFixHTML(templateFooter)}`);
  //   if (isSectionVisible) {
  //     formData.append("coverPage", `${validateAndFixHTML(templateCoverPage)}`);
  //   }

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
  //           toast.success("PDF preview open successfully!");
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

  const handlePreview = async () => {
    setButtonText("Please Wait..."); // Change button text to "Please Wait"
    setIsPreviewing(true); // Set previewing state to true
    const toastId = toast.loading("Loading in...");
    let formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("templateName", "template");
    formData.append("templateHeader", `${validateAndFixHTML(templateHeader)}`);
    formData.append("templateBody", templateBody !="" ? `${validateAndFixHTML(templateBody)}`:"");
    formData.append("templateFooter", `${validateAndFixHTML(templateFooter)}`);
    if (isSectionVisible) {
      formData.append("coverPage", `${validateAndFixHTML(templateCoverPage)}`);
    }
  
    axiosInstance
      .post("pdf/exportPdfTemplate", formData, {
        headers: headersForJwt,
        responseType: "blob",
      })
      .then((response) => {
        if (response) {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
  
          // Open PDF preview in a new tab
          const newTab = window.open(fileURL, "_blank");
          if (newTab) {
            newTab.focus();
          } else {
            toast.error("Error opening preview in a new tab.");
          }
  
          setTimeout(() => {
            toast.dismiss(toastId);
            toast.success("PDF preview open successfully!");
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
  };
  
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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
    // console.log("huuu");
    // console.log(validateAndFixHTML(templateHeader));
    Swal.fire({
      title: "Please confirm",
      text: "Do you want to update this template?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);
        // const { templateDate } = data;

        const requestData = {
          // ...data,
          templateName: data.templateName,
          isOtherTemplate: data.isOtherTemplate.value,
          templateHeader: templateHeader,
          templateBody: templateBody,
          templateFooter: templateFooter,
          templateCoverPage: templateCoverPage,
          templateId: originalId,
        };
        let formData = new FormData();
        formData.append("data", JSON.stringify(requestData));
        console.log(formData);
        axiosInstance
          .post("template/editTemplate", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            setFullPageLoading(false)
            if (res && res.data.status === 1) {
              Swal.fire(
                "Updated!",
                "Template updated successfully!",
                "success"
              );
              handleReset();
              navigate("/reportTemplates");
            } else {
              setFullPageLoading(false)
              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Template updation failed!",
              });
            }
            return false;
          })

          .catch((err) => {
            setFullPageLoading(false)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };

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

  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const handleStausOptionChange = (selectedOption) => {
    setValue("status", selectedOption?.value || ""); // Set the value to the selected option's value

    // setSelectedStatusOption(event.target.value);
    // Additional logic you want to perform when an option is selected
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
        fetchDataFromApi(id, headerEditorRef, "templateHeader");
        break;

      case "bodyEditor":
        bodyEditorRef.current = event.editor;
        fetchDataFromApi(id, bodyEditorRef, "templateBody");
        break;

      case "footerEditor":
        footerEditorRef.current = event.editor;
        fetchDataFromApi(id, footerEditorRef, "templateFooter");
        break;

      case "coverEditor":
        coverEditorRef.current = event.editor;
        fetchDataFromApi(id, coverEditorRef, "templateCoverPage");
        break;

      default:
        break;
    }
  };

  const fetchDataFromApi = async (id, editorRef, templateDataKey) => {
    try {
      if (id) {
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        if (!isNaN(originalId)) {
          const formData = new FormData();
          formData.append("userId", userData.userDetails.userId);
          formData.append("templateId", originalId);
          const res = await axiosInstance.post(
            "template/getTemplateById",
            formData,
            {
              headers: headersForJwt,
            }
          );

          setTemplateName(res.data.data.list.templateName ?? "");
          reset({
            templateName: res.data.data.list.templateName ?? "",
            isOtherTemplate: res.data.data.list.isOtherTemplate ? { value: true, label: 'Other Template' } : { value: false, label: 'IAQ Template' }
          });
          // console.log(getValues('isOtherTemplate')); // or console.log(watch());
          if (editorRef.current) {
            editorRef.current.setData(
              res.data.data.list[templateDataKey] ?? ""
            );
          }
        } else {
          navigate("/reportTemplates");
        }
      } else {
        throw new Error("No decodedId available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
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
      window.CKEDITOR.config.autoParagraph= false;
      // Disable auto-correction of empty spaces
      window.CKEDITOR.config.autoParagraph= false;
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

          const formData = new FormData();
          formData.append("userId", userData.userDetails.userId);
          formData.append("templateId", originalId);
          axiosInstance
            .post("template/getTemplateById", formData, {
              headers: headersForJwt,
            })
            .then((res) => {
              setTemplateName(res.data.data.list.templateName ?? "");
              reset({
                templateName: res.data.data.list.templateName ?? "",
                isOtherTemplate: res.data.data.list.isOtherTemplate ? { value: true, label: 'Other Template' } : { value: false, label: 'IAQ Template' }
              });
              // console.log(headerEditorRef.current);
              if (headerEditorRef.current) {
                headerEditorRef.current.setData(
                  res.data.data.list.templateHeader ?? ""
                );
              }

              // setTemplateHeader(res.data.data.list.templateHeader ?? "");
              // setTemplateBody(res.data.data.list.templateBody ?? "");
              // setTemplateFooter(res.data.data.list.templateFooter ?? "");
              // setTemplateCoverPage(res.data.data.list?.templateCoverPage ?? "");
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              throw error; // Throw the error to be caught by the component
            });
        } else {
          navigate("/reportTemplates"); // This will navigate back to the previous URL
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

  const templateType = [
    { value: '', isDisabled: true, label: 'Select Template Type' },
    { value: false, label: 'IAQ Template' },
    { value: true, label: 'Other Template' }
  ]



  // Image gallery code
  
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
      <Helmet title={"Edit Template | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Edit Template</h5>
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
            padding: "1%",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="mt-5">
              {/* <div className="Client-Statistical-Data">
                <h6>
                  {" "}
                  <strong>Template Name</strong>{" "}
                  <span className="text-danger">*</span>
                  <br />
                  <span>
                  </span>
                </h6>
                <Col md={3}>
                  <input
                    type="text"
                    {...register("templateName", { required: true })}
                    className={`form-control ${
                      errors.templateName ? "is-invalid" : ""
                    }`}
                  />
                  {errors.templateName && (
                    <span className="text-danger">This field is required</span>
                  )}
                </Col>
              </div> */}
              <div className="user-info-3 Client-Statistical-Data"
                style={{
                  justifyContent: "flex-start",
                  // gap: '2.8em',
                  important: "true",
                }}>
                <div className=' col-lg-3 col-md-12'>
                  <h6>  {' '}
                    <strong>Template Name</strong>{' '}
                    <span className='text-danger'>*</span>
                    <br />
                    <span>
                    </span>
                  </h6>
                  <input
                    type='text'
                    {...register('templateName', { required: true })}
                    className={`form-control ${errors.templateName ? 'is-invalid' : ''
                      }`}
                  />
                  {errors.templateName && (
                    <span className='text-danger'>This field is required</span>
                  )}
                </div>
                <div className=' col-lg-3 col-md-12'>
                  <h6>  {' '}
                    <strong>Template Type</strong>{' '}
                    <span className='text-danger'>*</span>
                    <br />
                    <span>
                    </span>
                  </h6>
                  <Controller
                    control={control}
                    className="isOtherTemplate"
                    {...register("isOtherTemplate", {
                      required: "This field is require",
                    })}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="sm"
                        options={templateType}
                        placeholder="Template Type"
                        clearButton
                      />
                    )}
                  />
                  {/* <Controller
                    control={control}
                    name="isOtherTemplate"
                    defaultValue="false" // Set the default value using only the value property
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="sm"
                        options={templateType}
                        placeholder="Template Type"
                        className="isOtherTemplate"
                        onChange={(e) => field.onChange(e.target.value)} // Ensure field value is updated
                        clearButton
                      />
                    )}
                  /> */}

                  {errors.isOtherTemplate && (
                    <span className='text-danger'>{errors.isOtherTemplate.message}</span>
                  )}
                </div>

              </div>
            </section>
            {/* cover 2 */}
            <section className="mt-5">
              <section className="mt-5">
                <div className="Client-Statistical-Data">
                  <h6>
                    <strong>Template Cover Page</strong>
                  </h6>
                  {/* <button
                    className='btn btn-primary'
                    type='button'
                    onClick={handleButtonClick}
                  >
                    {isSectionVisible ? 'Hide Cover Page' : 'Show Cover Page'}
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
                    <Col >
                      <h6 className="label-search">Select Cover Page</h6>
                      <Select
                        onChange={handleCoverPageChange}
                        placeholder="Select Cover Page"
                        options={coverPageOptions}
                      />
                    </Col>
                    <Col>
                    <h6 className="label-search">Select Client Field</h6>
                    <Select
                      onChange={handleOptionChange1}
                      placeholder="Select Client Field"
                      options={clientField}
                    />
                  </Col>
                  <Col>
                    <h6 className="label-search">Select Building Field</h6>
                    <Select
                      onChange={handleOptionChange1}
                      placeholder="Select Building Field"
                      options={buildingField}
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
                    <h6 className="label-search">Select Client Field</h6>
                    <Select
                      onChange={handleOptionChange1}
                      placeholder="Select Client Field"
                      options={clientField}
                    />
                  </Col>
                  <Col>
                    <h6 className="label-search">Select Building Field</h6>
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
                    <h6 className="label-search">Select Client Field</h6>
                    <Select
                      onChange={handleOptionChange3}
                      placeholder="Select Client Field"
                      options={clientField}
                    />
                  </Col>
                  <Col>
                    <h6 className="label-search">Select Building Field</h6>
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
                    <h6 className="label-search">Select Client Field</h6>
                    <Select
                      onChange={handleOptionChange2}
                      placeholder="Select Client Field"
                      options={clientField}
                    />
                  </Col>
                  <Col>
                    <h6 className="label-search">Select Building Field</h6>
                    <Select
                      onChange={handleOptionChange2}
                      placeholder="Select Building Field"
                      options={buildingField}
                    />
                  </Col>
                  <Col style={{ marginTop: '18px' }}>
                    <Button onClick={openModal} ><CiImageOn fontSize={24} className='mr-2' />Choose Image</Button>

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

            {/* <section className="mt-5">
              <div className="Client-Statistical-Data">
                <>
                  <Row>
                    <Col md={2}>
                      <h6 className="label-search">Select Status</h6>
                      <Select
                        placeholder="Select Status"
                        options={statusOptions}
                        {...register("status", { required: true })}
                        onChange={handleStausOptionChange}
                        isClearable
                      ></Select>
                      {errors.status && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </Col>
                    <Col md={2}>
                      <h6 className="label-search">Template Date</h6>
                      <Controller
                        control={control}
                        name="templateDate"
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select Date"
                            selected={field.value}
                            dateFormat="yyyy-MM-dd"
                            onChange={field.onChange}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            closeOnScroll={true}
                            onBlur={field.onBlur}
                            disabledKeyboardNavigation
                            isClearable
                          />
                        )}
                      />
                      {errors.templateDate && (
                        <p className="text-danger">
                          {errors.templateDate.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                </>
              </div>
            </section> */}
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
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleReset}
                // disabled={!isDirty} // Disable Reset button if form is not modified
                >
                  Reset
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

export default EditTemplate;
