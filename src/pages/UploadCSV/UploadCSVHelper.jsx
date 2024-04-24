/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from "react";
import { Col, Button, Row, Form, Modal } from "react-bootstrap";

import { Helmet } from "react-helmet";
import "react-datepicker/dist/react-datepicker.css";
import { FaFileCsv } from "react-icons/fa";
import { BiSolidCloudUpload } from "react-icons/bi";

import { useForm, Controller } from "react-hook-form";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import BackButton from "../../components/BackButton";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";

import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";

import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../../util/customToast/index";
import { useDropzone } from "react-dropzone";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";

function UploadCSVModal() {
  const navigate = useNavigate();
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone();
  const [jobDetails, setJobDetails] = useState("");
  const [uploadedCSV, setUploadCSV] = useState([]);

  const [isCSVCheckboxChecked, setCSVCheckboxChecked] = useState(false);
  const [columnHeaderDD, setColumnHeaderDD] = useState([]);
  const [fiestCSVColumn, setFiestCSVColumn] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState({});

  const handleDropdownChange = (selectedValue, rowIndex) => {
    // console.log('Selected value for row', rowIndex + 1, ':', selectedColumn);
    // const modifiedColumnHeaderDD = columnHeaderDD.filter(item => item !== selectedValue);
    // console.log(modifiedColumnHeaderDD);

    setSelectedColumn((prevSelectedColumns) => ({
      ...prevSelectedColumns,
      [rowIndex]: selectedValue,
    }));
  };


  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [errorDataRecordCount, setErrorDataRecordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showUploadCSVDataModal, setShowUploadCSVDataModal] = useState(false);
  const [airQualityData, setAirQualityData] = useState([]);

  const [userData, setUserData] = useRecoilState(userAtom);

  const [CountryAll, setCountryAll] = useState([]);
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [Client, setClient] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [job, setJob] = useState([]);

  const [CountryId, setCountryId] = useState("");
  const [ProvienceId, setProvienceId] = useState("");
  const [CityId, setCityId] = useState("");
  const [ClientId, setClientId] = useState("");
  const [BuildingId, setBuildingId] = useState("");


  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleCloseUploadCSVDataModal = () => {
    setShowUploadCSVDataModal(false);
  };

  const DependentDD = async (
    countryId,
    provinceId,
    CityId,
    ClientId
  ) => {
    let formData = new FormData();
    if (countryId !== "") {
      formData.append("countryId", countryId);
    }
    if (provinceId !== "") {
      formData.append("provinceId", provinceId);
    }
    if (CityId !== "") {
      formData.append("cityId", CityId);
    }
    if (ClientId !== "") {
      formData.append("clientId", ClientId.value);
    }

    let defaultValues = {};
    await axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Select Country", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(),
            label: item.countryName,
          })),
        ];
        setCountryAll(data1);

        if (data1 && (data1.length > 0 && data1.length < 3)) {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            countryId: data1[1], // Add another field with its default value
          };
        }
        else {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            countryId: "", // Add another field with its default value
          };
        }
      })
      .catch((err) => { });

    await axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(),
            label: item.provinceName,
          })),
        ];
        setProvince(data);

        if (data && (data.length > 0 && data.length < 3)) {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            provinceId: data[1], // Add another field with its default value
            // Add more fields dynamically as needed
          };
        }
        else {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            provinceId: "", // Add another field with its default value
          };
        }
      })
      .catch((err) => { });

    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select City", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(),
            label: item.cityName,
          })),
        ];
        setCity(data);

        if (data.length > 0 && data.length < 3) {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            cityId: data[1], // Add another field with its default value
            // Add more fields dynamically as needed
          };
        }
        else {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            cityId: "", // Add another field with its default value
          };
        }
      })
      .catch((err) => { });

    axiosInstance
      .post("building/getAllBuildingByClientId", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.buildingId.toString(), // Convert id to string, if needed
            label: item.buildingName + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingName(data);

        if (data.length > 0 && data.length < 3) {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            buildindIds: data[1], // Add another field with its default value
            // Add more fields dynamically as needed
          };
        }
        else {
          defaultValues = {
            ...defaultValues, // Spread the existing values
            buildindIds: "", // Add another field with its default value
          };
        }
      })
      .catch((err) => { });

    defaultValues = {
      ...defaultValues, // Spread the existing values
      clientId: ClientId, // Add another field with its default value
      // Add more fields dynamically as needed
    }
    reset(defaultValues);
  };



  const handelClientChange = (data) => {
    DependentDD(
      CountryId,
      ProvienceId,
      CityId,
      data.target.value
    );
    setClientId(data.target.value.value);
  };
  const handelprovince = (data) => {
    let formData = new FormData();

    if (ClientId !== "") {
      formData.append("clientId", ClientId);
    }

    if (data.target.value.value !== "") {
      formData.append("provinceId", Number(data.target.value.value));
    }
    axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select City", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(),
            label: item.cityName,
          })),
        ];
        setCity(data);
      })
      .catch((err) => { });
  };




  const handelBuildingChange = (data) => {
    setBuildingId(data.target.value.value);
    let formData = new FormData();
    if (data.target.value.value !== "") {
      formData.append("buildingId", Number(data.target.value.value));
    }

    axiosInstance
      .post("client/getAllJobDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Job", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.projectNumber,
          })),
        ];
        setJob(data);
      })
      .catch((err) => { });
  };

  const getClientName = async () => {
    await axiosInstance
      .post("client/getAllClientDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClient(data);
      })
      .catch((err) => { });
  };

  const getColumnHeaderDD = async () => {
    await axiosInstance
      .post("csv/getColumnHeaderDD", [], { headers: headersForJwt })
      .then((res) => {
        setColumnHeaderDD(res.data.data.columnHeaders);
      })
      .catch((err) => { });
  };

  const getJobById = async (id) => {
    const toastId = toast.loading("Loading...");
    let formData = new FormData();
    formData.append("jobId", id);
    await axiosInstance
      .post("job/getJobById", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          toast.dismiss(toastId);
          if (res.data.data.list.testDateChar !== null) {
            Swal.fire({
              title: "Already uploaded",
              text: "Would you like to deactivate the original CSV and upload a new CSV for this job?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Go To CSV List",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/uploadCSV");
              } else {
                reset();
                setJobDetails("");
              }
            });
          }

          setJobDetails(res.data.data.list);
        } else {
          setJobDetails("");
          ErrorToastWithToastId("Action Failed..", toastId);
        }
      })
      .catch((err) => {
        ErrorToastWithToastId("Action Failed..", toastId);
        console.log(err);
      });
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (event) => {
    if (jobDetails) {

      // setSubmitting(true);
      setSubmitting(false);
      let formData = new FormData();
      if (acceptedFiles) {
        formData.append("file", acceptedFiles[0]); // Creating an empty Blob with a default type);
      }
      // delete event["csvFile"];
      formData.append("jobId", event.jobId.value);
      formData.append("cityId", event.cityId.value);
      formData.append("testDate", event.testDate);

      if (isCSVCheckboxChecked === true) {
        const availableOptionsForRow = [];

        Object.keys(selectedColumn).forEach(rowIndex => {
          console.log(selectedColumn[rowIndex]);
          availableOptionsForRow.push(selectedColumn[rowIndex]);
        });
        if (availableOptionsForRow.length !== fiestCSVColumn.length) {
          ErrorToastWithToastId("Select All Column Heading");
          return false;
        }
        formData.append("columnHeader", availableOptionsForRow);
      }



      Swal.fire({
        title: "Please confirm",
        text: "Do you want to upload CSV for this job?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true);
          axiosInstance
            .post("csv/uploadCsvFile", formData, { headers: headersForJwt })
            .then((res) => {
              if (res && res.data.status === 1) {

                // Check if any object in storedDataDTO has outside value
                const hasInOutFalse = res.data.data.storedDataDTO.some(item => item.inOut === false);
                if (!hasInOutFalse) {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'error',
                    title: 'No outside data present in this CSV',
                    // showConfirmButton: false,
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Upload again",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setFullPageLoading(false)
                      setSubmitting(false);
                    }
                  })
                } else {
                  setUploadCSV(res.data.data.storedDataDTO);
                  setShowUploadCSVDataModal(true);
                  setTotalRecordsCount(res.data.data.totalRecordsCount);
                  setErrorDataRecordCount(res.data.data.errorDataRecordCount);

                  let formData = new FormData();
                  formData.append('userId', Number(userData.userDetails.userId));
                  formData.append("cityId", -1);
                  axiosInstance
                    .post("shortcode/getThresholdByCityId", formData, { headers: headersForJwt })
                    .then((res) => {
                      if (res.data.status === 1) {
                        setAirQualityData(res.data.data.list);
                      }
                    })
                    .catch((err) => { setFullPageLoading(false); });

                  setFullPageLoading(false);
                  setSubmitting(false);
                  Swal.fire({
                    icon: "success",
                    title: "CSV uploaded successfully",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }




                // setUploadCSV(res.data.data.storedDataDTO);
                // setShowUploadCSVDataModal(true);
                // setTotalRecordsCount(res.data.data.totalRecordsCount);
                // setErrorDataRecordCount(res.data.data.errorDataRecordCount);

                // let formData = new FormData();
                // formData.append("userId", Number(userData.userDetails.userId));
                // formData.append("cityId", -1);
                // axiosInstance
                //   .post("shortcode/getThresholdByCityId", formData, {
                //     headers: headersForJwt,
                //   })
                //   .then((res) => {
                //     if (res.data.status === 1) {
                //       setAirQualityData(res.data.data.list);
                //     }
                //   })
                //   .catch((err) => {
                //     setFullPageLoading(false);
                //   });
              } else {
                setSubmitting(false);
                setFullPageLoading(false);
                Swal.fire({
                  icon: "error",
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            })
            .catch((err) => {
              setSubmitting(false);
              setFullPageLoading(false);
              Swal.fire({
                icon: "error",
                title: "CSV upload failed. Try after some time",
                showConfirmButton: false,
                timer: 2000,
              });
            });
        } else {
          setSubmitting(false);
          setUploadCSV([]);
        }
      });
    }
  };

  const [csvData, setCsvData] = React.useState(uploadedCSV);

  useEffect(() => {
    setCsvData(uploadedCSV);
  }, [uploadedCSV]);

  const onChange = (e, id, property) => {
    const { value } = e.target;

    const csvAllData = uploadedCSV.map((item) =>
      item.id === id
        ? { ...item, [property]: { ...item[property], value } }
        : item
    );

    setCsvData(csvAllData);
  };

  const hendelsubmit = () => {
    // console.log("Modified Data:", csvData);

    Swal.fire({
      title: "Please confirm",
      text: "Are all the records correct?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        // const toastId = toast.loading("Loading...");
        axiosInstance
          .post("csv/saveUpdatedCsvData", csvData, {
            headers: headersForJwtWithJson,
          })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false)
              // toast.dismiss();
              Swal.fire({
                icon: "success",
                title: "CSV uploaded successfully",
                showConfirmButton: false,
                timer: 2000,
              });
              const defaultValues = {
                clientId: "",
                countryId: "",
                provinceId: "",
                cityId: "",
                buildindIds: "",
                jobId: ""
              };
              reset(defaultValues);
              handleCloseUploadCSVDataModal();
            } else {
              setFullPageLoading(false);
              // toast.dismiss();
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 2000,
              });
            }
          })
          .catch((err) => {
            setFullPageLoading(false)
            // toast.dismiss();
            Swal.fire({
              icon: "error",
              title: "CSV upload failed. Try after some time",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    });
  };


  const handleCSVCheckboxChange = (event) => {
    setCSVCheckboxChecked(event.target.checked);
    setSelectedColumn({});
    if (event.target.checked === true) {
      if (acceptedFiles[0]) {
        let formData = new FormData();
        formData.append("file", acceptedFiles[0]); // Creating an empty Blob with a default type);
        axiosInstance
          .post("csv/processCSV", formData, { headers: headersForJwt })
          .then((res) => {
            console.log(res.data.data['Column Data']);

            const columnData = res.data.data['Column Data'];
            const tableRows = Object.keys(columnData).map((column, index) => {


              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{column}</td>
                  <td>{columnData[column]}</td>
                  <td>
                    <Form.Select as="select" size="sm"
                      defaultValue={selectedColumn[index] || ''}
                      name={`columnHeading${index}`}
                      required
                      id={`columnHeading${index}`}
                      className="form-add-user newSize"
                      {...register(`columnHeading${index}`, {
                        onChange: (e) => {
                          handleDropdownChange(e.target.value, index);
                        },
                        required: "Heading name required",
                      })}
                    >
                      <option value="" disabled>Select a column</option>
                      {/* {columnHeaderDD &&
                        columnHeaderDD.length > 0 &&
                        columnHeaderDD.map((option, optionIndex) => {
                          return (
                            <option value={optionIndex} key={option}>
                              {option}
                            </option>
                          );
                        })} */}
                      {columnHeaderDD.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                    {errors[`columnHeading${index}`] && (
                      <span className="text-danger">{errors[`columnHeading${index}`].message}</span>
                    )}

                  </td>
                </tr>
              );
            });
            setFiestCSVColumn(tableRows);
          })
          .catch((err) => { });
      } else {
        ErrorToastWithToastId("Choose CSV");
      }
    }
  };







  useEffect(() => {
    getClientName();
    getColumnHeaderDD();
  }, []); // This effect runs once on component mount

  return (
    <>
      <Helmet title={"UploadCSVHelper | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">CSV Upload</h5>
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
            padding: "0.2%",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="mt-5 ">
              <Row className="mb-3">
                {/* Client Name */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search"> {" "} Client Name <span className="text-danger">*</span> </h6>
                  <Controller
                    control={control}
                    name="clientId"
                    {...register("clientId", {
                      onChange: (e) => {
                        handelClientChange(e);
                      },
                      required: "Client required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={Client}
                          placeholder="Client Name"
                          name="clientId"
                          clearButton
                        />
                        {errors.clientId && (
                          <span className="text-danger">
                            {errors.clientId.message}
                          </span>
                        )}
                      </>
                    )}
                  />

                </Col>

                {/* Country */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    Country <span className="text-danger">*</span>
                  </h6>
                  <Controller
                    control={control}
                    name="countryId"
                    {...register("countryId", {
                      // onChange: (e) => getProviance(e),
                      required: "Country required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={CountryAll}
                          // options={[
                          //   ...(CountryAll.length > 0
                          //     ? CountryAll.map((prov) => ({
                          //       value: prov.countryId,
                          //       label: prov.countryName
                          //     }))
                          //     : [])
                          // ]}
                          placeholder="Country Name"
                          name="countryId"
                          clearButton
                        // defaultValue={field.value || (CountryAll.length === 1 ? CountryAll[0].countryId : undefined)}
                        />
                        {errors.countryId && (
                          <span className="text-danger">
                            {errors.countryId.message}
                          </span>
                        )}
                      </>
                    )}
                  />

                  {/* <Form.Select
                    as="select"
                    size="sm"
                    name="countryId"
                    id="countryId"
                    className="form-add-user newSize"
                    {...register("countryId", {
                      onChange: (e) => {
                        getProviance(e);
                      },
                      required: "Country Required",
                    })}
                  >
                    <option value="">Select Country</option>
                    {CountryAll &&
                      CountryAll.length > 0 &&
                      CountryAll.map((cntr) => {
                        return (
                          <option value={cntr.countryId} key={cntr.countryId}>
                            {cntr.countryName}
                          </option>
                        );
                      })}
                  </Form.Select> */}
                  {errors.countryId && (
                    <span className="text-danger">
                      {errors.countryId.message}
                    </span>
                  )}
                </Col>

                {/* Province */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    Province <span className="text-danger">*</span>
                  </h6>
                  <Controller
                    control={control}
                    name="provinceId"
                    {...register("provinceId", {
                      onChange: (e) => handelprovince(e),
                      required: "Province required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={province}
                          placeholder="Province Name"
                          name="provinceId"
                          clearButton
                        // onChange={(id) => {
                        //   handelprovince(id)

                        // }}
                        />
                        {errors.provinceId && (
                          <span className="text-danger">
                            {errors.provinceId.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                {/* City */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    City <span className="text-danger">*</span>
                  </h6>
                  <Controller
                    control={control}
                    name="cityId"
                    {...register("cityId", {
                      // onChange: (e) => getProviance(e),
                      required: "City required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={city}
                          placeholder="City Name"
                          name="cityId"
                          clearButton
                        />
                        {errors.cityId && (
                          <span className="text-danger">
                            {errors.cityId.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                {/* Building Name */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    {" "}
                    Building Name <span className="text-danger">*</span>
                  </h6>
                  <Controller
                    control={control}
                    name="buildindIds"
                    {...register("buildindIds", {
                      onChange: (e) => handelBuildingChange(e),
                      required: "Building name required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={buildingName}
                          placeholder="Building Name"
                          name="buildindIds"
                          clearButton
                        />
                        {errors.buildindIds && (
                          <span className="text-danger">
                            {errors.buildindIds.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                {/* Job Name */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    {" "}
                    Job Name <span className="text-danger">*</span>
                  </h6>
                  <Controller
                    control={control}
                    name="jobId"
                    {...register("jobId", {
                      onChange: (e) => getJobById(e.target.value.value),
                      required: "Job name required",
                    })}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          size="sm"
                          options={job}
                          placeholder="Job Name"
                          name="jobId"
                          clearButton
                        />
                        {errors.jobId && (
                          <span className="text-danger">
                            {errors.jobId.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                {/* Test Date */}
                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <h6 className="label-search">
                    {" "}
                    Test Date <span className="text-danger">*</span>
                  </h6>
                  {jobDetails.dateAssigned ? (
                    <span>
                      (Enter the test date equal/greater then assigned date{" "}
                      {jobDetails.dateAssigned
                        ? new Date(jobDetails.dateAssigned)
                          .toISOString()
                          .split("T")[0]
                        : ""}{" "}
                      {jobDetails.dateCompletion
                        ? " and equal/less then Completion Date on " +
                        new Date(jobDetails.dateCompletion)
                          .toISOString()
                          .split("T")[0]
                        : ""}
                      )
                    </span>
                  ) : (
                    ""
                  )}
                  <Form.Control
                    type="date"
                    placeholder="Test Date"
                    {...register("testDate", {
                      required: "Test Date required",
                      validate: (value) =>
                        (value >=
                          new Date(jobDetails.dateAssigned)
                            .toISOString()
                            .split("T")[0] &&
                          (jobDetails.dateCompletion !== null
                            ? value <=
                            new Date(jobDetails.dateCompletion)
                              .toISOString()
                              .split("T")[0]
                            : value === value)) ||
                        "Test Date must fall within the period from Job Assigned on " +
                        new Date(jobDetails.dateAssigned)
                          .toISOString()
                          .split("T")[0] +
                        (jobDetails.dateCompletion !== null
                          ? " to Completion Date on " +
                          new Date(jobDetails.dateCompletion)
                            .toISOString()
                            .split("T")[0]
                          : ""),
                    })}
                    disabled={submitting}
                  />
                  {errors.testDate && (
                    <span className="text-danger-csv">
                      {errors.testDate.message}
                    </span>
                  )}
                </Col>

                <Col
                  lg={{ span: 6, offset: 3 }}
                  md={6}
                  xs={12}
                  className="mb-3"
                >
                  <br />
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} name="csvFile" />
                    <BiSolidCloudUpload className="fil-45" />
                    <p>
                      Drag 'n' drop CSV files here, or click to select files
                    </p>
                  </div>
                  <Form.Group
                    className="mb-4"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <aside className="file-na-container mt-4 mb-4">
                      <h6 className="f-s">
                        {" "}
                        <FaFileCsv className="fil-size mr-2" />
                        Files
                      </h6>
                      <ul className="mb-0">{files}</ul>
                    </aside>
                  </Form.Group>

                  <div>
                    <Form.Group className="mb-4" controlId="csvColumnChanged">
                      <div className="mb-3">
                        <Form.Check // prettier-ignore
                          label={`CSV Columns has changed? `}
                          className='me-3'
                          type='checkbox'
                          checked={isCSVCheckboxChecked}
                          onChange={handleCSVCheckboxChange}
                        />
                      </div>
                    </Form.Group>
                  </div>
                  {isCSVCheckboxChecked && acceptedFiles[0] ? (<div >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>CSV Field</th>
                          <th>First Row Value</th>
                          <th>Table Column</th>
                        </tr>
                      </thead>
                      <tbody>{fiestCSVColumn}</tbody>
                    </Table>
                  </div>) : null}

                </Col>
              </Row>
            </section>
            {/* Section 2 */}

            <section className="mt-5">
              <div className="Client-Statistical-Data">
                <Button
                  type="submit"
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Loading..." : "Submit"}
                </Button>
                <button
                  style={{ padding: "10px 20px", marginRight: "10px" }}
                  className="btn btn-secondary"
                  type="reset"
                >
                  Reset
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
      {/* Modal for CSV preview */}
      <Modal
        show={showUploadCSVDataModal}
        onHide={() => {
          handleCloseUploadCSVDataModal();
        }}
        backdrop={false} // Set backdrop to false
        dialogClassName="modal-60w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="modal-header-section ">
          <Modal.Title id="contained-modal-title-vcenter" className="ml-5">
            CSV Data
          </Modal.Title>
          <div className=" float-end">

            <button
              className="btn btn-primary me-2"
              onClick={hendelsubmit}
            >
              Continue and Submit
            </button>
            <button
              className="btn btn-danger "
              onClick={handleCloseUploadCSVDataModal}
            >
              Cancel
            </button>
          </div>

        </Modal.Header>
        <Modal.Body className="grid-example user-modal ">
          <div>
            {/* <table className="table table-bordered stastic-table">
              <thead>
                <tr>
                  <th className=" text-center " colSpan={9}>
                    <b>
                      The air quality Threshold for the current environment{" "}
                    </b>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Carbon Monoxide</b>
                  </td>
                  <td>{airQualityData.carbonMonoxideMin}(Min)</td>
                  <td>{airQualityData.carbonMonoxideMax}(Max)</td>
                  <td>
                    <b>Carbon Dioxide</b>
                  </td>
                  <td>{airQualityData.carbonDioxideMin}(Min)</td>
                  <td>{airQualityData.carbonDioxideMax}(Max)</td>
                  <td>
                    <b>Temperature</b>
                  </td>
                  <td>{airQualityData.temperatureMin}(Min)</td>
                  <td>{airQualityData.temperatureMax}(Max)</td>
                </tr>

                <tr>
                  <td>
                    <b>Relative Humidity</b>
                  </td>
                  <td>{airQualityData.relativeHumidityMin}(Min)</td>
                  <td>{airQualityData.relativeHumidityMax}(Max)</td>
                  <td>
                    <b>Particulate Levels</b>
                  </td>
                  <td>{airQualityData.particulateMin}(Min)</td>
                  <td>{airQualityData.particulateMax}(Max)</td>
                  <td>
                    <b>TVOC Levels</b>
                  </td>
                  <td>{airQualityData.tvocMin}(Min)</td>
                  <td>{airQualityData.tvocMax}(Max)</td>
                </tr>
              </tbody>
            </table> */}

          </div>

          <div className="col-lg-5 " style={{ marginLeft: '28em' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className=" text-center " colSpan={7}>
                    <b>
                      Air Quality Guidelines{" "}
                    </b>
                  </th>
                </tr>
                <tr>
                  <th className=" text-center font-carbon">Carbon  <br />Dioxide<br /> (ppm)</th>
                  <th className=" text-center font-carbon">Carbon <br /> Monoxide <br />(ppm)</th>
                  <th className=" text-center font-carbon">Temperature <br />(°C)</th>
                  <th className=" text-center font-carbon">Relative <br />Humidity <br />(%)</th>
                  {/* <th className=" text-center">Particulate Matter (PM<sub>2.5</sub>) (µg/m<sup>3</sup>)</th> */}
                  <th className=" text-center font-carbon">Particulate<br /> Matter <br />(µg/m<sup>3</sup>)</th>
                  <th className=" text-center font-carbon">TVOC (ppb)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center font-carbon">{airQualityData.carbonDioxideMin} - {airQualityData.carbonDioxideMax}</td>
                  <td className="text-center font-carbon">{airQualityData.carbonMonoxideMin} - {airQualityData.carbonMonoxideMax} (or 2 <br /> ppm above<br /> outdoors)</td>
                  <td className="text-center font-carbon">{airQualityData.temperatureMin} - {airQualityData.temperatureMax}</td>
                  <td className="text-center font-carbon">{airQualityData.relativeHumidityMin} - {airQualityData.relativeHumidityMax}</td>
                  {/* <td>{airQualityData.particulate25min} - {airQualityData.particulate25max}</td> */}
                  {/* <td className="text-center font-carbon">{airQualityData.particulateMin} - {airQualityData.particulateMax}(PM<sub>2.5</sub>)</td> */}
                  <td className="text-center font-carbon">
                    {airQualityData.particulate25min} - {airQualityData.particulate25max}  (PM<sub>2.5</sub>)<br />
                    {airQualityData.particulateMin} - {airQualityData.particulateMax}  (PM<sub>10</sub>)

                  </td>

                  <td className="text-center font-carbon">{airQualityData.tvocMin} - {airQualityData.tvocMax}</td>
                </tr>
              </tbody>
            </table>

          </div>

          <div className="upload-csv-table">
            <p style={{ float: "right" }}>
              <span>Total Records : </span> <b>{totalRecordsCount}</b>
              <span> Total Error : </span> <b>{errorDataRecordCount}</b>
            </p>
            <Table striped responsive='lg'>
              <thead>
                <tr>
                  <th className="font-carbon">Sl. No</th>
                  <th className="font-carbon">Site</th>
                  <th className="font-carbon">Location</th>
                  <th className="font-carbon">Carbon Dioxide (ppm)</th>
                  <th className="font-carbon">Carbon Monoxide (ppm)</th>
                  <th className="font-carbon">Temperature (°C)</th>
                  <th className="font-carbon">Relative Humidity (%)</th>
                  {/* {uploadedCSV && uploadedCSV['0'].particulate25 !== null ?  <th>Particulate(PM 2.5)</th> : null}
                  {uploadedCSV && uploadedCSV['0'].particulate !== null ?  <th>Particulate</th> : null} */}
                  {uploadedCSV && uploadedCSV.length > 0 && uploadedCSV[0]?.particulate25 !== null ? <th>Particulate (PM<sub>2.5</sub>)</th> : null}
                  {uploadedCSV && uploadedCSV.length > 0 && uploadedCSV[0]?.particulate !== null ? <th>Particulate (PM<sub>10</sub>)</th> : null}

                  <th className="font-carbon">TVOC (ppb)</th>
                  <th className="font-carbon">AM/PM</th>
                  <th className="font-carbon">In/Out</th>
                  <th className="font-carbon">Note</th>
                </tr>
              </thead>
              <tbody>
                {uploadedCSV.map(({ id, site, location, carbonDioxide, carbonMonoxide, temperature, relativeHumidity, particulate25, particulate, tvoc, note, amPm, inOut }, index) => (
                  <tr key={id}>
                    <td> <input
                      name="site"
                      value={index + 1}
                      type="text"
                      disabled
                    /></td>
                    <td>
                      <input
                        name="site"
                        value={site}
                        type="text"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        name="location"
                        value={location}
                        type="text"
                        disabled
                      // onChange={(e) => onChange(e, id, 'location')}
                      />
                    </td>
                    <td>
                      <input
                        name="carbonDioxide"
                        defaultValue={carbonDioxide.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'carbonDioxide')}
                        className={!carbonDioxide.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={carbonDioxide.isCorrect}
                      />
                    </td>
                    <td>
                      <input
                        name="carbonMonoxide"
                        defaultValue={carbonMonoxide.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'carbonMonoxide')}
                        className={!carbonMonoxide.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={carbonMonoxide.isCorrect}
                      />
                    </td>
                    <td>
                      <input
                        name="temperature"
                        defaultValue={temperature.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'temperature')}
                        className={!temperature.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={temperature.isCorrect}
                      />
                    </td>
                    <td>
                      <input
                        name="relativeHumidity"
                        defaultValue={relativeHumidity.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'relativeHumidity')}
                        className={!relativeHumidity.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={relativeHumidity.isCorrect}
                      />
                    </td>
                    {particulate25 !== null ? (<td>
                      <input
                        name="particulate25"
                        defaultValue={particulate25.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'particulate25')}
                        className={!particulate25.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={particulate25.isCorrect}
                      />
                    </td>) : null}
                    {particulate !== null ? (<td>
                      <input
                        name="particulate"
                        defaultValue={particulate.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'particulate')}
                        className={!particulate.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={particulate.isCorrect}
                      />
                    </td>) : null}

                    <td>
                      <input
                        name="tvoc"
                        defaultValue={tvoc.value}
                        type="number"
                        onChange={(e) => onChange(e, id, 'tvoc')}
                        className={!tvoc.isCorrect ? 'bg-danger text-white text-center' : 'text-center'}
                        disabled={tvoc.isCorrect}
                      />
                    </td>
                    <td>
                      <input
                        name="amPm"
                        value={amPm ? 'AM' : 'PM'}
                        className='text-center'
                        type="text"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        name="inOut"
                        value={inOut ? 'In' : 'Out'}
                        className='text-center'
                        type="text"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        name="note"
                        value={note}
                        className='text-center'
                        type="text"
                        onChange={(e) => onChange(e, id, 'note')}
                      />
                    </td>
                    {/* Repeat this pattern for other properties */}
                  </tr>
                ))}
              </tbody>
            </Table>
            <button
              className="btn btn-danger float-end"
              onClick={handleCloseUploadCSVDataModal}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary float-end me-2"
              onClick={hendelsubmit}
            >
              Continue and Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UploadCSVModal;
