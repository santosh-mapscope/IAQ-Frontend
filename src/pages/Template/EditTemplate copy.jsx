/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from "react";
 

import { Helmet } from "react-helmet";
import { CKEditor } from "@ckeditor/ckeditor5-react"; 
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
import { Link, useParams,useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; 
import Swal from "sweetalert2";

function EditTemplate() {
  const { id } = useParams(); // Get the 'id' parameter from the URL

  
  // State variables for editor content
  const navigate = useNavigate();

  const [templateHeader, setTemplateHeader] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateFooter, setTemplateFooter] = useState("");
  const [templateCoverPage, setTemplateCoverPage] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [buildingField, setBuildingField] = useState([]);
  const [clientField, setClientField] = useState([]);
  const [shortcodeOptions, setShortcodeOptions] = useState([]);
  const [coverPageOptions, setCoverPageOptions] = useState([]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  // const initialFormData = {}; // Define initial form data
  const [userData, setUserData] = useRecoilState(userAtom);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [pdfContent, setPdfContent] = useState("");
  const [pdfSrc, setPdfSrc] = useState('');

 
  

  const handleClose = () => setPdfModalOpen(false);

  const [templateName, setTemplateName] = useState('');

 
  
  

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
    const doc = parser.parseFromString(htmlContent, 'text/html');
  
    // Serialize the document back to a string, fixing any issues
    const fixedHTML = new XMLSerializer().serializeToString(doc);
  
    return fixedHTML;
  }
  


  const onSubmit = (data) => {
    Swal.fire({
      title: 'Please confirm',
      text: " Do you want to update this template?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) { 
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);
           // const { templateDate } = data;
 
           const requestData = {
            ...data,
            templateHeader: `${validateAndFixHTML(templateHeader)}`,
            templateBody: `${validateAndFixHTML(templateBody)}`,
            templateFooter: `${validateAndFixHTML(templateFooter)}`,
            templateCoverPage: `${validateAndFixHTML(templateCoverPage)}`,
            templateId: originalId,
          };
          
   
    let formData=new FormData(); 
    formData.append("data", JSON.stringify(requestData)); 
        axiosInstance
          .post("template/editTemplate", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              Swal.fire("Updated!", "Template Updated successfully!", "success");
              handleReset();
              navigate('/reportTemplates'); 
            } else {
              Swal.fire({
                icon: "warning",
                title: res.data.message,
                text: "Template updation failed!",
              });
            }
            return false;
          })

          .catch((err) => {

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });


      }
    })
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
    setTemplateHeader((prevContent) => prevContent + selectedValue);
  };

  const handleOptionChange2 = (event) => {
    const selectedValue = event.value;
    setTemplateBody((prevContent) => prevContent + selectedValue);
  };

  const handleOptionChange3 = (event) => {
    const selectedValue = event.value;
    setTemplateFooter((prevContent) => prevContent + selectedValue);
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


  // const fetchDataById = async (id) => {
  //   alert("jkhuih");
  //   const formData = new FormData();
  //   formData.append("userId", userData.userData.userDetails.userId);
  //   formData.append("templateId", id);
  //   return   axiosInstance
  //     .post("templates/getTemplateById", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       return res.data.data.list; // Return the fetched data
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     throw error; // Throw the error to be caught by the component
  //     });
   
  
  // }


  useEffect(() => {
 
    

    try {
      if (id) {
        const decodedValue = atob(id);
        const originalId = parseInt(decodedValue, 10);

        if (!isNaN(originalId)) {
           
        // alert(originalId)

        const formData = new FormData();
        formData.append("userId", userData.userDetails.userId);
        formData.append("templateId", originalId);
        axiosInstance
        .post("template/getTemplateById", formData, { headers: headersForJwt })
        .then((res) => {  
            setTemplateName(res.data.data.list.templateName);
            reset({
              templateName: res.data.data.list.templateName, 
            })
            setTemplateHeader(res.data.data.list.templateHeader);
            setTemplateBody(res.data.data.list.templateBody);
            setTemplateFooter(res.data.data.list.templateFooter);
            setTemplateCoverPage(res.data.data.list.templateCoverPage);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          throw error; // Throw the error to be caught by the component
          });
    
        } else {
          navigate('/reportTemplates'); // This will navigate back to the previous URL
        }


      } else {
        throw new Error('No decodedId available');
      }
    } catch (error) {
      console.error('Error decoding:', error);
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
  const handleCoverPageChange = (event) => {
    const selectedValue = event.value;

    setTemplateCoverPage((prevContent) => prevContent + selectedValue);
  };
  const editorConfiguration = { 
    toolbar: {
      items: [
        "heading",
        "GeneralHtmlSupport",
        "htmlEmbed",
        "|",
        "alignment",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockquote",
        "|",
        "insertTable",
        "mediaEmbed",
        "|",
        "link",
        "unlink",
        "|",
        "imageUpload",
        "imageInsert",
        "imageResize",
        "pageBreak",
        "alignment",
        "wordCount",
        "underline",
        "highlight", // Add the 'highlight' button to the toolbar
        "findAndReplace", // Add the 'findAndReplace' button to the toolbar
        "fontBackgroundColor", // Add the 'fontBackgroundColor' button to the toolbar
        "fontColor",
        "fontFamily", // Add the 'fontFamily' button to the toolbar
        "fontSize",
        "styles", // Add the 'styles' button to the toolbar
        "specialCharacters", // Add the 'specialCharacters' button to the toolbar
        "sourceEditing", // Add the 'sourceEditing' button to the toolbar
        "showBlocks", // Add the 'showBlocks' button to the toolbar
        "selectAll", // Add the 'selectAll' button to the toolbar

        "autoformat", // Add the 'autoformat' button to the toolbar
        "|",
        "insertCodeBlock",
        "codeBlock",
        "|",
        "horizontalLine",
        "specialCharacters",
        "|",
        "removeFormat",
        "|",
        "undo",
        "redo",
        // Add or remove items as needed based on your requirement
      ],
      shouldNotGroupWhenFull: true, // This prevents items from grouping when the toolbar is too narrow
    },
    fontFamily: {
      options: [
        "default",
        "Arial, sans-serif",
        "Arial Black, sans-serif",
        "Bookman, serif",
        "Comic Sans MS, cursive",
        "Courier, monospace",
        "Georgia, serif",
        "Helvetica, sans-serif",
        "Impact, sans-serif",
        "Palatino, serif",
        "Tahoma, sans-serif",
        "Times New Roman, serif",
        "Trebuchet MS, sans-serif",
        "Verdana, sans-serif",
        "Lucida Console, monospace",
        "Lucida Sans Unicode, sans-serif",
        "MS Sans Serif, sans-serif",
        "MS Serif, serif",
        "Garamond, serif",
        "Roboto, sans-serif",
        // Add more font family options as needed
      ],
    },
    // Other configurations as needed
  };

 

  return (
    <>
      <Helmet title={"Add Report | IAQ Reporting System"} />

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Create Template</h5>
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
              <div className="Client-Statistical-Data">
                <h6>
                  {" "}
                  <strong>Template Name</strong>{" "}
                  <span className="text-danger">*</span>
                  <br />
                  <span>
                    {" "}
                    <small className="text-danger">
                      should be unique<span>*</span>
                    </small>
                  </span>
                </h6>
                <Col md={3}>
                <input
                  type="text"
                  // defaultValue={templateName}
                  {...register("templateName", { required: true })}
                  className={`form-control ${
                    errors.templateName ? "is-invalid" : ""
                  }`}
                />
                {errors.templateName && (
                  <span className="text-danger">This field is required</span>
                )}
                  </Col>
             
              </div>
            </section>

            <section className="mt-5">
              <section className="mt-5">
                <div className="Client-Statistical-Data">
                  <h6>
                    <strong>Template Cover Page</strong>
                  </h6>
                </div>
              </section>
              <div className="Client-Statistical-Data"> 
              <Row>
                  <Col   md={3}>
                    <h6 className="label-search">Select Cover Page</h6>
                    <Select
                      onChange={handleCoverPageChange}
                      placeholder="Select Cover Page"
                      options={coverPageOptions}
                    />
                  </Col>
                </Row>
                <br></br> {/* <div style={{ height: '500px' }}> */}
                <CKEditor
                  editor={ClassicEditor}
                  data={templateCoverPage}
                  config={editorConfiguration} 
                  onChange={(event, editor) => {
                    const data = editor.getData(); 
                    setTemplateCoverPage(data);
                  }}
                  
                />
                {/* </div> */}
                {/* </Container> */}
              </div>
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
                  <Col>
                    <h6 className="label-search">Select Short Code</h6>
                    <Select
                      onChange={handleOptionChange1}
                      placeholder="Select Short Code"
                      options={shortcodeOptions}
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
                  editor={ClassicEditor}
                  data={templateHeader}
                  config={editorConfiguration} 
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                    setTemplateHeader(data);
                  }}
                  
                />
                {/* </div> */}
                {/* </Container> */}
              </div>
              {/* <button onClick={convertToPDF}>Download as PDF</button> */}
              
    

            </section>
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
                </Row>
                <br></br> {/* <div style={{ height: '500px' }}> */}
                <CKEditor
                  editor={ClassicEditor}
                  data={templateBody}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setTemplateBody(data);
                  }}
                />
                {/* </div> */}
                {/* </Container> */}
              </div>
            </section>

            {/* Section 3 */}
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
                  <Col>
                    <h6 className="label-search">Select Short Code</h6>
                    <Select
                      onChange={handleOptionChange3}
                      placeholder="Select Short Code"
                      options={shortcodeOptions}
                    />
                  </Col>
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
                  editor={ClassicEditor}
                  data={templateFooter}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setTemplateFooter(data);
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
                >
                  Save
                </button>
                <button
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleReset}
              
                >
                  Reset
                </button>
                <button
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-primary"
                  type="button"
                 
                 
                >
                  Preview
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
        dialogClassName="modal-lg"
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
                style={{ height: "100%", width: "100%", frameborder:"0" }}
              />
            )} 
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPdfModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setPdfModalOpen(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditTemplate;
