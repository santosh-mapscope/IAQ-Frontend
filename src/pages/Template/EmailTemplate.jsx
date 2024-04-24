/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useRef, useState } from 'react'


import { Helmet } from 'react-helmet'
import { CKEditor } from 'ckeditor4-react'

import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import { FaFile, FaFileCsv } from 'react-icons/fa'
import { CiImageOn } from "react-icons/ci";
import { BiSolidCloudUpload } from 'react-icons/bi'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import DatePicker from 'react-datepicker'
import Row from 'react-bootstrap/Row'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

import {
    axiosInstance,
    headersForJwt,
    headersForJwtWithJson
} from '../../util/axiosConfig'
import Modal from 'react-bootstrap/Modal'
import { useDropzone } from "react-dropzone";

import { userAtom } from '../../Atom/CommonAtom'
import { useRecoilState } from 'recoil'
import { Link, useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

import toast, { Toaster } from "react-hot-toast";
import {
    ErrorToastWithToastId,
    SuccessToastWithToastId,
    ErrorToast,
    SuccessToast,
} from "../../util/customToast";
import { PreviewPdf } from '../../services/TemplateService'
import CircularLoader from '../../util/SuspenseFallback/circularLoader'
import { Card, Form, Image } from 'react-bootstrap'
import ImageUploadModal from '../../components/editorImageUpload/ImageUploadModal'

function EmailTemplate() {
    const navigate = useNavigate()
    // const defaultText = 'Default Text';
    const [isFullPageLoading, setFullPageLoading] = useState(false); // State for loading

    const [emailTemplateId, setEmailTemplateId] = useState();
    const [templateBody, setTemplateBody] = useState('')

    const [buildingField, setBuildingField] = useState([])
    const [clientField, setClientField] = useState([])
    const [emailTemplateDD, setEmailTemplateDD] = useState([])

    const [userData, setUserData] = useRecoilState(userAtom)


    const emailTemplateBodyEditorRef = useRef(null);

    const [isSectionVisible, setIsSectionVisible] = useState(true) // State to control section visibility


    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty }
    } = useForm()

    const onSubmit = data => {
        Swal.fire({
            title: 'Please confirm',
            text: ' Do you want to save this email template?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Save it!'
        }).then(result => {
            if (result.isConfirmed) {
                setFullPageLoading(true);
                // const { templateDate } = data;
                const requestData = {
                    emailTempId: emailTemplateId,
                    templateBody: templateBody,
                }
                let formData = new FormData()
                formData.append('emailTempId', emailTemplateId)
                formData.append('templateBody', templateBody)
                formData.append('userId', userData.userDetails.userId)
                axiosInstance
                    .post('emailTemplate/editEmailTemplate', formData, {
                        headers: headersForJwt
                    })
                    .then(res => {
                        setFullPageLoading(false);
                        if (res && res.data.status === 1) {
                            // setFullPageLoading(false);  
                            Swal.fire('Updated!', 'Email template updated successfully!', 'success')
                            handleReset()
                        } else {
                            // setFullPageLoading(false);  
                            Swal.fire({
                                icon: 'warning',
                                title: 'Oops...',
                                text: 'Template updation failed!'
                            })
                        }
                        // setFullPageLoading(false);  
                        return false;
                    })
                    .catch(err => {
                        setFullPageLoading(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        })
                    })
            }
        })
    }

    // Function to handle form reset
    const handleReset = () => {
        // Reset the form using react-hook-form's reset method
        reset();
        // Reset the CKEditor content
        emailTemplateBodyEditorRef.current.insertHtml(null);
        setTemplateBody('')
    }



    // Event handlers for dropdown changes

    const handleOptionChange1 = (event) => {
        const selectedValue = event.value;
        const editor = emailTemplateBodyEditorRef.current;

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
                    console.error('The CKEditor instance does not support insertHtml or insertText method.');
                }
            }
        }
    };

    const handleEmailTemplateChange = (event) => {
        setEmailTemplateId(event.value);
        const selectedValue = event.value;
        const editor = emailTemplateBodyEditorRef.current;

        let formData = new FormData()
        if (userData !== '')
            formData.append('userId', userData.userDetails.userId)
        formData.append('ReportTemplateId', selectedValue)
        axiosInstance
            .post('/emailTemplate/getAllEmailTemplateById', formData, {
                headers: headersForJwt
            })
            .then(response => {
                if (response.data.status === 1) {
                    if (editor && selectedValue) {
                        editor.setData(response.data.data.list[0].templateBody);
                    }
                } else {
                    console.error('Invalid or empty data received from the server')
                }
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error fetching data:', error)
            })


        if (editor && selectedValue) {
            editor.setData(selectedValue);
        }
    };

    const handleEditorReady = (editorName, event) => {
        emailTemplateBodyEditorRef.current = event.editor

        // switch (editorName) {
        //     case 'emailTemplateBody':
        //         emailTemplateBodyEditorRef.current = event.editor;
        //         console.log(emailTemplateBodyEditorRef.current)
        //         break;

        //     default:
        //         break;
        // }
    };




    const openFileBrowser = () => {
        // Open a new window to your file browser URL
        const fileBrowserWindow = window.open(
            'File Browser',
            'width=800,height=600'
        )

        // When the file browser window is closed, retrieve the selected image URL
        window.addEventListener('message', event => {
            if (
                event.origin !== 'https://localhost/siaq' ||
                !event.data ||
                !event.data.imageURL
            ) {
                return
            }

            // Insert the selected image into CKEditor 5
            const imageUrl = event.data.imageURL
            const editor = document.querySelector('.ck-editor__editable')
            editor.innerHTML += `<img src="${imageUrl}" alt="Selected Image">`
        })
    }
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

    // const handleSelectChange = (event) => {
    //   const selectedValue = event.target.value;

    //   if (editorRef.current && selectedValue) {
    //     const currentContent = editorRef.current.getData();
    //     editorRef.current.setData(currentContent + selectedValue);
    //   }
    // };


    useEffect(() => {
        let formData = new FormData()
        if (userData !== '') formData.append('userId', userData.userDetails.userId)

        axiosInstance
            .post('building/getBuildingColumnHeaderDD', formData, {
                headers: headersForJwt
            })
            .then(response => {
                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.BuildingColumnHeaders &&
                    Array.isArray(response.data.data.BuildingColumnHeaders)
                ) {
                    const buildingColumnHeaders = response.data.data.BuildingColumnHeaders

                    // Transform the data to match the expected options structure
                    const formattedOptions = buildingColumnHeaders.map(header => ({
                        value: `[[${header.displayName}]]`,
                        label: header.displayName.toUpperCase() // Capitalize and add space
                    }))

                    // Set the options in the state, including a default option
                    const options = [
                        { value: '', label: 'Select Building Field' },
                        ...formattedOptions
                    ]

                    // Assuming setBuildingField is a state updater function
                    setBuildingField(options)
                } else {
                    console.error('Invalid or empty data received from the server')
                }
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error fetching data:', error)
            })
        axiosInstance
            .post('client/getClientColumnHeaderDD', formData, {
                headers: headersForJwt
            })
            .then(response => {
                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.ClientColumnHeaders &&
                    Array.isArray(response.data.data.ClientColumnHeaders)
                ) {
                    const clientColumnHeaders = response.data.data.ClientColumnHeaders

                    // Transform the data to match the expected options structure
                    const formattedOptions = clientColumnHeaders.map(header => ({
                        value: `[[${header.displayName}]]`,
                        label: header.displayName.toUpperCase() // Capitalize and add space
                    }))

                    // Set the options in the state, including a default option
                    const options = [
                        { value: '', label: 'Select Client Field' },
                        ...formattedOptions
                    ]

                    // Assuming setClientField is a state updater function
                    setClientField(options)
                } else {
                    console.error('Invalid or empty data received from the server')
                }
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error fetching data:', error)
            })


        axiosInstance
            .post('emailTemplate/getEmailTemplateNameDD', formData, {
                headers: headersForJwt
            })
            .then(response => {
                if (response.data && response.data.data && response.data.data.list) {

                    // Transform the data to match the expected options structure
                    const templateDD = response.data.data.list.map(item => ({
                        value: item.id,
                        label: item.templateName
                    }))

                    // Set the options in the state
                    setEmailTemplateDD([
                        { value: '', label: 'Select Email Template' },
                        ...templateDD
                    ])
                }
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error fetching data:', error)
            })
    }, []) // This effect runs once on component mount



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

        const editor = emailTemplateBodyEditorRef.current;
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
            <Helmet title={'Edit Template | IAQ Reporting System'} />
            {isFullPageLoading && <CircularLoader />}
            <Toaster position="top-center" className="toster" reverseOrder={false} />
            <div className='content-wrapper'>
                <div className='content-header'>
                    <div className='container-fluid'>
                        <div className='row mt-2'>
                            <div className='col-sm-9 pd-l-0'>
                                <h5 className='m-0 mt-3 mb-2'>Email Template</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: '#ECF1F6',
                        padding: '1%'
                    }}
                >

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Section 2 */}
                        <section className='mt-5'>
                            <section className='mt-5'>
                                <div className='Client-Statistical-Data'>
                                    <h6>
                                        <strong>Email Template Name</strong>
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
                            {true && (
                                <div
                                    className={
                                        isSectionVisible
                                            ? 'Client-Statistical-Data section'
                                            : 'Client-Statistical-Data section section-hidden'
                                    }
                                >
                                    <Row>
                                        <Col md={3}>
                                            <h6 className='label-search'>Select Email Template</h6>
                                            <Select
                                                onChange={handleEmailTemplateChange}
                                                placeholder='Select Email Template'
                                                options={emailTemplateDD}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <h6 className='label-search'>Select Client Field</h6>
                                            <Select
                                                onChange={handleOptionChange1}
                                                placeholder='Select Client Field'
                                                options={clientField}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <h6 className='label-search'>Select Building Field</h6>
                                            <Select
                                                onChange={handleOptionChange1}
                                                placeholder='Select Building Field'
                                                options={buildingField}
                                            />
                                        </Col>
                                    </Row>
                                    <br></br> {/* <div style={{ height: '500px' }}> */}
                                    <CKEditor
                                        // data={templateCoverPage}
                                        data='' // Initial empty data
                                        ref={emailTemplateBodyEditorRef}
                                        onChange={(event) => {
                                            const data = event.editor.getData()
                                            setTemplateBody(data)
                                        }}
                                        config={{
                                            language: 'en',
                                            height: 800,

                                            on: {
                                                instanceReady: (event) => {
                                                    // Call handleEditorReady and pass the editor instance
                                                    handleEditorReady('emailTemplateBody', event);
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

                        <section className='mt-5'>
                            <div className='Client-Statistical-Data'>
                                <button
                                    style={{ padding: '10px 20px', marginRight: '10px' }}
                                    className='btn btn-primary'
                                    type='submit'
                                // disabled={!isDirty} // Disable Save button if form is not modified
                                >
                                    Save
                                </button>
                                {/* <button
                                    style={{ padding: '10px 20px', marginRight: '10px' }}
                                    className='btn btn-secondary'
                                    type='button'
                                    onClick={handleReset}
                                // disabled={!isDirty} // Disable Reset button if form is not modified
                                >
                                    Reset
                                </button> */}
                            </div>
                        </section>
                    </form>
                </div>
            </div>

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
    )
}

export default EmailTemplate
