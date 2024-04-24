import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { BiSolidCloudUpload } from 'react-icons/bi'; // Import necessary icons
import { FaFile } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
    axiosInstance,
    headersForJwt,
    headersForJwtWithJson
} from '../../util/axiosConfig'
const ImageUploadModal = ({ fetchImages, uploadModalVisible, setUploadModalVisible }) => {
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const filteredFiles = acceptedFiles.filter(file =>
                file.type === 'image/jpeg' || file.type === 'image/jpg'
            );
            setAcceptedFiles(filteredFiles);
        },
    });

    const handleUpload = () => {
        if (acceptedFiles.length === 0) {
            toast.error("No file chosen. Please select an image to upload.");
            return; // Exit the function if no file is chosen
        }
        const formData = new FormData();
        formData.append('userId', 1);

        let hasValidationError = false; // Flag to track validation error

        acceptedFiles.forEach((file, index) => {
            if (!file.type.includes('image') || file.name.toLowerCase().endsWith('.png')) {
                toast.error(`File ${file.name} is not a valid image.`);
                hasValidationError = true; // Set validation error flag to true
                return; // Skip this file and continue with the next one
            }
            formData.append(`file`, file);
        });

        if (hasValidationError) {
            // If there's a validation error, return without making the API call
            return;
        }

        // Display loading toast
        const loadingToastId = toast.loading('Loading...');

        axiosInstance
            .post("pdf/uploadImageGallery", formData, {
                headers: headersForJwt,
                responseType: "json", // Ensure the response is treated as a blob
            })
            .then((res) => {
                // Check if the response contains valid data
                if (res && res.data && res.data.status === 1) {
                    fetchImages();
                    toast.success("Image uploaded successfully");
                } else {
                    toast.error("Error uploading image");
                }
            })
            .catch((err) => {
                toast.error("Error uploading image");
            })
            .finally(() => {
                // Dismiss loading toast after API call completes
                toast.dismiss(loadingToastId);
                setUploadModalVisible(false);
            });
    };

    const files = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>

            {/* Upload image modal */}
            <Modal show={uploadModalVisible} onHide={() => setUploadModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps({ accept: '.jpg, .jpeg' })} name="imagegallery" />
                        <BiSolidCloudUpload className="fil-45" />
                        <p>
                            Drag 'n' drop image file here, or click to select
                            files
                        </p>
                        <p style={{ color: 'red', fontSize: '14px' }}>
                            Warning: Please choose only JPG and JPEG images.
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
                                Images
                            </h6>
                            <ul className="mb-0">{files}</ul>
                        </aside>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setUploadModalVisible(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpload}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ImageUploadModal;
