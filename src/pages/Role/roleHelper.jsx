/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState } from "react";

import DataTable from "react-data-table-component";

import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";

import Swal from "sweetalert2";
const userData = JSON.parse(localStorage.getItem('user'));


export const AddRole = (props) => {
  const {
    showRoleModal,
    handleCloseRoleModal,
    handlePageChange
  } = props;

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(true);
      const data = {
        name: event.target.roleName.value,
        isAdd: event.target.canAdd.checked,
        isView: event.target.canView.checked,
        isEdit: event.target.canEdit.checked,
        isDelete: event.target.canDelete.checked,
        isDownload: event.target.canDownload.checked,
        userId: userData.userDetails.userId
      };
      Swal.fire({
        title: "Please confirm",
        text: " Do you want to create this role?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance
            .post("master/addRole", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Role created successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                handleCloseRoleModal();
                handlePageChange(1);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: "Role creation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  };

  return (
    <Modal
      show={showRoleModal}
      onHide={() => {
        handleCloseRoleModal();
      }}
      size="md"
      // dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section" >
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Add Role</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="roleName">
              <Form.Label>Role Name<span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="roleName"
                placeholder="Role Name"
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Role name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="canAdd">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Add?"
                className='me-3'
                type='checkbox'
                placeholder='canAdd'
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canView">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can View?"
                className='me-3'
                type='checkbox'
                placeholder='canView'
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canEdit">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Edit?"
                className='me-3'
                type='checkbox'
                placeholder='canEdit'
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canDelete">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Delete?"
                className='me-3'
                type='checkbox'
                placeholder='canDelete'
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="canDownload">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Download?"
                className='me-3'
                type='checkbox'
                placeholder='canDownload'
              />
            </Form.Group>

          </Row>
          <Button className="mt-3" type="submit">Create Role</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const EditRole = (props) => {
  const {
    showRoleEditModal,
    handleCloseRoleEditModal,
    roleDetails,
    handlePageChange
  } = props;


  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(true);
      const data = {
        id: roleDetails.id,
        name: event.target.roleName.value,
        isAdd: event.target.canAdd.checked,
        isView: event.target.canView.checked,
        isEdit: event.target.canEdit.checked,
        isDelete: event.target.canDelete.checked,
        isDownload: event.target.canDownload.checked,
        userId: userData.userDetails.userId
      };
      Swal.fire({
        title: "Please confirm",
        text: "Do you want to update this role?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance
            .post("master/editRole", JSON.stringify(data), { headers: headersForJwtWithJson })
            .then((res) => {
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Role updated successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                handleCloseRoleEditModal();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: "Role updation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  };

  return (
    <Modal
      show={showRoleEditModal}
      onHide={() => {
        handleCloseRoleEditModal();
      }}
      size="md"
      // dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"

    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-5">Update Role</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}  controlId="roleName">
              <Form.Label>Role Name<span className="text-danger">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="roleName"
                placeholder="Role Name"
                defaultValue={roleDetails.name}
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Role name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="canAdd">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Add?"
                className='me-3'
                type='checkbox'
                placeholder='canAdd'
                defaultChecked={roleDetails.isAdd}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canView">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can View?"
                className='me-3'
                type='checkbox'
                placeholder='canView'
                defaultChecked={roleDetails.isView}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canEdit">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Edit?"
                className='me-3'
                type='checkbox'
                placeholder='canEdit'
                defaultChecked={roleDetails.isEdit}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="canDelete">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Delete?"
                className='me-3'
                type='checkbox'
                placeholder='canDelete'
                defaultChecked={roleDetails.isDelete}
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="canDownload">
              <Form.Label></Form.Label>
              <Form.Check
                label="Can Download?"
                className='me-3'
                type='checkbox'
                placeholder='canDownload'
                defaultChecked={roleDetails.isDownload}
              />
            </Form.Group>
          </Row>
          <Button className="mt-3" type="submit">Save Role</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};