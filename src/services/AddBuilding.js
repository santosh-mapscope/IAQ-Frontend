import React, { useEffect, useState } from "react";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { userAtom } from "../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import DataTable from "react-data-table-component";
import SuspenseFallback from "../util/SuspenseFallback";
import Swal from "sweetalert2";

export const AddBuilding = (props) => {

  const {
    showBuildingModal,
    handleCloseAddBuildingModal
  } = props;
  const [userData, userName] = useRecoilState(userAtom);
  const [validated, setValidated] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: 'Please confirm',
      text: "Do you want to save this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {

        console.log(data);
        // delete data["cPassword"];
        // data.designationId = data.designationId === 0? '' :data.designationId;
        // // console.log(data)
        // console.log(data.image[0]);
        // let formData = new FormData();
        // let formData2 = new FormData();
        // if (data.image.length > 0) {
        //   formData2.append("image", data.image[0]); // Creating an empty Blob with a default type);
        // }
        // delete data["image"];
        // formData.append("userData", JSON.stringify(data));
        // formData.append("image", data.image.length > 0 ? data.image[0] : new Blob([], { type: 'application/octet-stream' })); // Creating an empty Blob with a default type);
        // delete data["image"];
        // formData.append("buildingData", JSON.stringify(data));
        // formData2.append("image", JSON.stringify(data));
        // console.log(formData)

        // axiosInstance
        //   .post("building/addBuilding", formData,formData2, {
        //     headers: headersForJwt,
        //   })
        //   .then((res) => {
        //     if (res && res.data.status === 1) {
        //       Swal.fire("Created!", "User Created successfully!", "success");
        //       reset();
        //       handleCloseUserModal();
        //     } else {
        //       Swal.fire({
        //         icon: "warning",
        //         title: res.data.message,
        //         text: "User creation failed!",
        //       });

        //       // handleCloseUserModal();
        //     }
        //     return false;
        //   })

        //   .catch((err) => {
        //     // setErrorMessage('Something Went Wrong ..!');
        //     Swal.fire({
        //       icon: "error",
        //       title: "Oops...",
        //       text: "Something went wrong!",
        //     });
        //   });


      }
    })





  };
  const handleHide = () => {
    handleCloseAddBuildingModal();
    reset({
      buildingName: "",
      buildingAddress: "",
      displayName: "",
      primeryClient: "",
      country: "",
      province: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      email: "",
    })
  }

  return (
    <Modal
      centered
      show={showBuildingModal}
      onHide={() => {
        handleHide();
      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Add Building
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">

        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row className="mb-3">
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Name <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingName"
                {...register("buildingName", {
                  required: "Building name required",
                })}
              />
              {errors.buildingName && (
                <span className="text-danger">{errors.buildingName.message}</span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Address 1 <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingAddress1"
                {...register("buildingAddress1", {
                  required: "Building Address required"
                })}
              />
              {errors.buildingAddress1 && (
                <span className="text-danger">{errors.buildingAddress1.message}</span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Address 2 <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="buildingAddress2"
                {...register("buildingAddress2", {
                  required: "Building Address required"
                })}
              />
              {errors.buildingAddress2 && (
                <span className="text-danger">{errors.buildingAddress2.message}</span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Display Name <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="displayName"
                {...register("displayName", {
                  required: "Display Name required",
                })}
              />
              {errors.displayName && (
                <span className="text-danger">{errors.displayName.message}</span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Country</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="country"
                id="country"
                className="form-add-user newSize"
                {...register("country", {
                  valueAsNumber: true,
                  required: "Select Country",

                })}
              >
                <option value="">
                  Select country
                </option>
                {/* {country &&
                  country.length > 0 &&
                  country.map((country) => {
                    return (
                      <option value={country.id} key={country.id}>
                        {country.name}
                      </option>
                    );
                  })} */}
              </Form.Control>
              {errors.country && (
                <span className="text-danger">
                  {errors.country.message}
                </span>
              )}
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="country"
                {...register("country", {
                  required: "Country required",
                })}
              />
              {errors.country && (
                <span className="text-danger">{errors.country.message}</span>
              )}
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Province</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="province"
                id="province"
                className="form-add-user newSize"
                {...register("province", {
                  valueAsNumber: true,
                  required: "Select province",

                })}
              >
                <option value="" >
                  Select province
                </option>
                {/* {province &&
                  province.length > 0 &&
                  province.map((province) => {
                    return (
                      <option value={province.id} key={province.id}>
                        {province.name}
                      </option>
                    );
                  })} */}
              </Form.Control>
              {errors.province && (
                <span className="text-danger">
                  {errors.province.message}
                </span>
              )}
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Province <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="province"
                {...register("province", {
                  required: "Province required",
                })}
              />
              {errors.province && (
                <span className="text-danger">{errors.province.message}</span>
              )}
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">City</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="city"
                id="city"
                className="form-add-user newSize"
                {...register("city", {
                  valueAsNumber: true,
                  required: "Select City",

                })}
              >
                <option value="" >
                  Select City
                </option>
                {/* {city &&
                  city.length > 0 &&
                  city.map((city) => {
                    return (
                      <option value={city.id} key={city.id}>
                        {city.name}
                      </option>
                    );
                  })} */}
              </Form.Control>
              {errors.city && (
                <span className="text-danger">
                  {errors.city.message}
                </span>
              )}
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                City <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="city"
                {...register("city", {
                  required: "City required",
                })}
              />
              {errors.city && (
                <span className="text-danger">{errors.city.message}</span>
              )}
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Client Name</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="clientName"
                id="clientName"
                className="form-add-user newSize"
                {...register("clientName", {
                  valueAsNumber: true,
                  required: "Select client Name",

                })}
              >
                <option value="" >
                  Select Client Name
                </option>
                {/* {clientName &&
                  clientName.length > 0 &&
                  clientName.map((clientName) => {
                    return (
                      <option value={clientName.id} key={clientName.id}>
                        {clientName.name}
                      </option>
                    );
                  })} */}
              </Form.Control>
              {errors.clientName && (
                <span className="text-danger">
                  {errors.clientName.message}
                </span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">Client Reprasentative Name</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                name="clentRepresentative"
                id="clentRepresentative"
                className="form-add-user newSize"
                {...register("clentRepresentative", {
                  valueAsNumber: true,
                  required: "Select client Reprasentative Name",

                })}
              >
                <option value="" >
                  Select Client Reprasentative Name
                </option>
                {/* {clentRepresentative &&
                  clentRepresentative.length > 0 &&
                  clentRepresentative.map((clentRepresentative) => {
                    return (
                      <option value={clentRepresentative.id} key={clentRepresentative.id}>
                        {clentRepresentative.name}
                      </option>
                    );
                  })} */}
              </Form.Control>
              {errors.clentRepresentative && (
                <span className="text-danger">
                  {errors.clentRepresentative.message}
                </span>
              )}
            </Col>

            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Primery Client <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="clientName"
                {...register("clientName", {
                  required: "Client Name required",
                })}
              />
              {errors.clientName && (
                <span className="text-danger">{errors.clientName.message}</span>
              )}
            </Col> */}

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Postal Code <span className="text-danger" >*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="postalCode"
                {...register("postalCode", {
                  required: "Postal Code required",
                })}
              />
              {errors.postalCode && (
                <span className="text-danger">{errors.postalCode.message}</span>
              )}
            </Col>

            {/* Mobile Number */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Mobile No.<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="number"
                name="phoneNumber"
                className="newSize"
                {...register("phoneNumber", {
                  valueAsNumber: true,
                  required: "Phone Number required",
                  validate: (value) =>
                    getValues("phoneNumber").toString().length === 10,
                })}
              />
              {errors.phoneNumber && (
                <span className="text-danger">Invalid Mobile Number</span>
              )}
            </Col>

            {/* Email id */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="email"
                name="email"
                className="newSize"
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Image
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                className="form-control-add-user newSize"
                name="image"
                {...register("image", {
                  required: "Image required",
                  validate: (value) => {
                    const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif',];

                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    if (fileExtension && !acceptedFormats.includes(fileExtension)) {
                      return 'Invalid file format. Only jpg, jpeg, png, gif files are allowed.';
                    }
                    return true;
                  },
                })}
              />
              {errors.image && (
                <span className="text-danger">{errors.image.message}</span>
              )}
            </Col>
          </Row>
          <Button className="" type="submit">
            Add Building
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const BuildingListTable = (props) => {
  const {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  } = props;

  const customStyles = {
    headRow: {
      style: {
        color: "#939597",
        backgroundColor: "#fff",
        paddingLeft: '1%',
      },
    },

    headCells: {
      style: {
        color: "#98989C",
        paddingLeft: "2px",
      },
    },

    rows: {
      style: {
        minHeight: "50px",
        background: "#fff",
        fontSize: "12px",
      },
      stripedStyle: {
        color: "#404D61",
        backgroundColor: "#ECF1F6",
      },
    },

    cells: {
      style: {
        paddingLeft: "1em",
        paddingRight: "1em",
      },
    },
  };
  const paginationOptions = {
    rowsPerPageText: '',
    showPaginationBottom: false,
  };

  return (
    <div>
      <DataTable
        columns={columns}
        bootstrap4
        data={data}
        progressPending={loading}
        progressComponent={<SuspenseFallback />}
        pagination
        paginationTotalRows={totalRows}
        paginationDefaultPage={currentPage}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationServer
        striped
        highlightOnHover
        customStyles={customStyles}
        paginationPerPageOptions={[]}
        // paginationRowsPerPageOptions={[]}
        paginationComponentOptions={paginationOptions}
      />
    </div>
  );
};
