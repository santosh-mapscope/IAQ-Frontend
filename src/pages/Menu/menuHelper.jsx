/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import toast, { Toaster } from "react-hot-toast";

import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";

import Swal from "sweetalert2";
const userData = JSON.parse(localStorage.getItem('user'));


export const AddEditModal = (props) => {

  const [isJobInvoiced, setIsJobInvoiced] = useState(false); // Initialize the state for jobInvoiced
  const [isStatusCompleted, setIsStatusCompleted] = useState(false); // Initialize the state for StatusCompleted
  const [isEditMode, setIsEditMode] = useState(false); // State to determine if it's in edit mode

  const [parentMenu, setParentMenu] = useState([]);


  const {
    showAddModal,
    showEditModal,
    handleCloseAddEditModal,
    editData, // Data for editing, pass null for adding
  } = props;

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const [validated, setValidated] = useState(false);

  const onSubmit = (event) => {
    if (isEditMode) {
      // Perform update operation based on the data


      const data = {
        menuId: editData.id,
        name: event.menuName,
        module: event.module,
        userId: userData.userDetails.userId,
      };

      let formData = new FormData();

      formData.append("menuData", JSON.stringify(data));

      Swal.fire({
        title: "Please confirm",
        text: "Do you want to update this menu?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance
            .post("menu/editMenu", formData, { headers: headersForJwt })
            .then((res) => {
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Menu updated successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                reset();
                handleCloseAddEditModal();
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
                title: "Menu update failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });

    } else {
      const data = {
        name: event.menuName,
        module: event.module,
        parentId: event.parentMenu !== "" ? event.parentMenu : 0,
        userId: userData.userDetails.userId,
      };

      let formData = new FormData();

      formData.append("menuData", JSON.stringify(data));

      

      Swal.fire({
        title: "Please confirm",
        text: " Do you want to create this menu?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance
            .post("menu/addMenu", formData, { headers: headersForJwt })
            .then((res) => {
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Menu created successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                reset();
                handleCloseAddEditModal();
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
                title: "Menu creation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  }



  const getAllMenuDD = async () => {
    let formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    formData.append("isParent", true);
    axiosInstance
      .post("menu/getMenuDD", formData, { headers: headersForJwt })
      .then((res) => {
        setParentMenu(res.data.data.list);
        // const data = [
        //   { value: '', label: 'Select Menu Name' },
        //   ...res.data.data.list.map(item => ({
        //     value: item.id.toString(), // Convert id to string, if needed
        //     label: item.name,
        //   })),
        // ];
        // setParentMenu(data);
      })
      .catch((err) => {
      });
  };







  const resetData = async () => {
    await getAllMenuDD();
  }


  const initializeFields = async (editData) => {
    if (editData) {
      // const toastId = toast.loading("Loading...");
      setIsEditMode(true); // Set the edit mode

      // await resetData();
      reset({
        menuName: editData && editData.name ? editData.name : '',
        module: editData && editData.module ? editData.module : '',
        parentMenu: editData && editData.parentId ? editData.parentId : '',
      })
      toast.dismiss();
      // Initialize other fields...
    } else {
      reset({
        menuName: '',
        module: '',
        parentMenu: '',
      });

      setIsEditMode(false); // Set the Add mode
    }
  };

  // Call initializeFields in useEffect when editData is available
  useEffect(() => {
    reset({
      menuName: '',
      module: '',
      parentMenu: '',
    });
    resetData();
    initializeFields(props.editData);
  }, [props.editData]);


  return (
    <Modal centered show={showAddModal || showEditModal} onHide={handleCloseAddEditModal} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          {isEditMode ? "Edit Menu" : "Add Menu"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form noValidate validated={validated} onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">

            {/* Menu Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Menu Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="menuName"
                {...register("menuName", {
                  required: "Menu name required",
                })}
              />
              {errors.menuName && (
                <span className="text-danger">{errors.menuName.message}</span>
              )}
            </Col>

            {/* Menu Module  */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Module <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="module"
                {...register("module", {
                  required: "Module required",
                })}
              />
              {errors.module && (
                <span className="text-danger">{errors.module.message}</span>
              )}
            </Col>

            {/* Parent Menu */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Parent Menu
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="parentMenu"
                id="parentMenu"
                className="form-add-user newSize"
                {...register("parentMenu", {})}
                disabled={isEditMode} // Set readOnly based on the value of isEditMode
              >
                <option value="">Select Parent Menu</option>
                {parentMenu &&
                  parentMenu.length > 0 &&
                  parentMenu.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
              </Form.Select>

            </Col>

          </Row>

          {/* Submit Button */}
          <Button style={{ 'float': 'right' }} className="mt-3" type="submit">
            {isEditMode ? "Update Menu" : "Add Menu"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

