import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Col, Card, Image } from 'react-bootstrap';
import {
    axiosInstance,
    headersForJwt,
    headersForJwtWithJson
} from '../../util/axiosConfig'
const ImageGalleryModal = ({ userId, fetchImages, handleImageSelection, modalVisible, setModalVisible }) => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const formData = new FormData();
        formData.append('userId', userId); // Use the userId prop passed to the component
        try {
            const response =  axiosInstance.post('pdf/getImageGallery', formData, {
                headers: headersForJwt()
            });
            setImageUrls(response.data.data.fileUrls);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [fetchImages]);

    

    return (
        <Modal show={modalVisible} onHide={() => setModalVisible(false)} dialogClassName='modal-lg'>
            <Modal.Header closeButton>
                <div>
                    <Modal.Title>Image Gallery</Modal.Title>
                    <p style={{ fontSize: '14px', color: '#888' }}>(Double click to select an image)</p>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Container className='mt-2'>
                    <div className='flex-row-left'>
                        {imageUrls.map((url, index) => (
                            <Col lg='3' className='p-1' key={index}>
                                <Card className='card-columns mb-2'>
                                    <Image src={url} alt={`Image ${index}`} onDoubleClick={() => handleImageSelection(url)} />
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: 12 }}>Image {index + 1}</Card.Title>
                                    </Card.Body>
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
    );
};


export default ImageGalleryModal;