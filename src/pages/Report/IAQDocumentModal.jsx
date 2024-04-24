import React, { useState } from "react";
import { Button, Col, Form, Modal, Toast } from "react-bootstrap";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { BiSolidCloudUpload } from "react-icons/bi";
import { FaFile } from "react-icons/fa";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import toast, { Toaster } from 'react-hot-toast';

import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
const ExternalDocumentModal = ({ reportId, closeModal, showIAQModal }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userData, setUserData] = useRecoilState(userAtom);
  const onDrop = (acceptedFiles) => {
    // Handle when files are dropped
    setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (reportId && uploadedFiles.length > 0 && !isUploading) {
      const formData = new FormData();
  
      // uploadedFiles.forEach((file, index) => {
      //   formData.append(`externalDocs[${index}]`, file);
      // });

      if (uploadedFiles) {
        formData.append("iaqDoc", uploadedFiles[0]); // Creating an empty Blob with a default type);
      }
  
      formData.append("reportId", reportId);
      formData.append("userId", userData.userDetails.userId);
  
      Swal.fire({
        title: "Please confirm",
        text: "Do you want to upload IAQ documents for this report?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const toastId = toast.loading("uploading...");
          setIsUploading(true);
          axiosInstance
            .post("pdf/uploadIAQDoc", formData, { headers: headersForJwt })
            .then((res) => {
              if (res && res.data.status === 1) {
                toast.success('Upload Successful!');
                toast.dismiss(toastId);
                setUploadedFiles([]); // Clear uploaded files
                setIsUploading(false);
                closeModal(); // Close modal after successful upload
              } else {
                toast.error('Error uploading files');
                toast.dismiss(toastId);
                setIsUploading(false);
              }
            })
            .catch((err) => { 
              toast.dismiss(toastId);
              console.error("Error uploading files:", err);
              toast.error('Error uploading files');
              setIsUploading(false);
            });
        } else {
          setIsUploading(false);
        }
      });
    } else {
      alert("Please select files and provide a report ID.");
    }
  };
  

  const files = uploadedFiles.map((file, index) => (
    <li style={{"font-size": "14px"}} key={index}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <>

      <Modal
        centered
        show={showIAQModal}
        onHide={closeModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton className="modal-header-section ">
          <Modal.Title id="contained-modal-title-vcenter" className="ml-5">
            Upload IAQ Documents
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example inside-padding user-modal ">
          <div className="upload-csv-container">
            <Col lg={{ span: 12}} md={6} xs={12} className="mb-3">
              <br />
              <Form.Label className="newSize">
              IAQ Document /PDF
              </Form.Label>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} name="csvFile" />
                <BiSolidCloudUpload className="fil-45" />
                <p>
                  Drag 'n' drop External files here, or click to select files
                </p>
              </div>
              <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlTextarea1"
              >
                <aside className="file-na-container mt-4 mb-4">
                  <h6 className="f-s white">
                    <FaFile className="fil-size mr-2 white" />
                    Files
                  </h6>
                  <ul className="white mb-0">{files}</ul>
                </aside>
              </Form.Group>

              <div className="button-container float-right">
                <Button
                  onClick={handleUpload}
                  className="btn-wt"
                  disabled={isUploading}
                >
                  Upload
                </Button>
              </div>
            </Col>
          </div>
        </Modal.Body>
      </Modal>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default ExternalDocumentModal;
