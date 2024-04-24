/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useState } from "react";
import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";
import { Col, Button, Row, Form, Modal, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaFileCsv, FaEye, FaEyeSlash } from "react-icons/fa";
import { BiSolidCloudUpload, BiPlus } from "react-icons/bi";
import { useDropzone } from 'react-dropzone';
import { AiOutlineClose } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import { format } from 'date-fns';
import { right } from "@popperjs/core";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import CsvList from "../UploadCSV";
import noImage from "../../assets/dist/img/no-img.png";
import toast, { Toaster } from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import {
  ErrorToastWithToastId,
  SuccessToastWithToastId,
  ErrorToast,
  SuccessToast,
} from "../../util/customToast/index";
const userData = JSON.parse(localStorage.getItem('user'));

export const UploadCSV = (props) => {
  const {
    showUploadCSVModal,
    handleCloseUploadCSVModal,
    jobDetails,
    setFullPageLoading
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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const [validated, setValidated] = useState(false);
  const [uploadedCSV, setUploadCSV] = useState([]);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [errorDataRecordCount, setErrorDataRecordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showUploadCSVDataModal, setShowUploadCSVDataModal] = useState(false);
  const [airQualityData, setAirQualityData] = useState([]);

  const [isCSVCheckboxChecked, setCSVCheckboxChecked] = useState(false);
  const [columnHeaderDD, setColumnHeaderDD] = useState([]);
  const [fiestCSVColumn, setFiestCSVColumn] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState({});

  const handleDropdownChange = (selectedValue, rowIndex) => {
    const modifiedColumnHeaderDD = columnHeaderDD.filter(item => item !== 'note');

    setSelectedColumn((prevSelectedColumns) => ({
      ...prevSelectedColumns,
      [rowIndex]: selectedValue,
    }));


  };
  const getColumnHeaderDD = async () => {
    await axiosInstance
      .post("csv/getColumnHeaderDD", [], { headers: headersForJwt })
      .then((res) => {
        setColumnHeaderDD(res.data.data.columnHeaders);
      })
      .catch((err) => { });
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


            const columnData = res.data.data['Column Data'];
            const tableRows = Object.keys(columnData).map((column, index) => {


              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{column}</td>
                  <td>{columnData[column]}</td>
                  <td>
                    <Form.Select as="select" size="sm"
                      defaultValue={selectedColumn[index] || ""}
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

  const onSubmit = async (event) => {
    if (jobDetails) {
      setSubmitting(true);
      let formData = new FormData();
      if (acceptedFiles) {
        formData.append("file", acceptedFiles[0]); // Creating an empty Blob with a default type);
      }
      // delete event["csvFile"];
      formData.append("jobId", jobDetails.jobId);
      formData.append("cityId", jobDetails.cityId);
      formData.append("testDate", event.testDate);
      if (isCSVCheckboxChecked === true) {
        const availableOptionsForRow = [];
        Object.keys(selectedColumn).forEach(rowIndex => {
          availableOptionsForRow.push(selectedColumn[rowIndex]);
        });
        if (availableOptionsForRow.length !== fiestCSVColumn.length) {
          ErrorToastWithToastId("Select All Column Heading");
          setSubmitting(false);
          return false;
        }
        formData.append("columnHeader", availableOptionsForRow);
      }

      Swal.fire({
        title: "Please confirm",
        text: " Do you want to upload CSV for this job?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setFullPageLoading(true)
          // const toastId = toast.loading("Loading...");
          axiosInstance
            .post("csv/uploadCsvFile", formData, { headers: headersForJwt })
            .then((res) => {
              if (res && res.data.status === 1) {
                // setFullPageLoading(false)
                // toast.dismiss(toastId);

                // Check if any object in storedDataDTO has outside value
                const hasInOutFalse = res.data.data.storedDataDTO.some(item => item.inOut === false);
                if (!hasInOutFalse) {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'error',
                    title: 'No outside data present in this CSV',
                    // showConfirmButton: true,
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
                    .catch((err) => { });

                  setFullPageLoading(false)
                  setSubmitting(false);
                  Swal.fire({
                    icon: 'success',
                    title: "CSV uploaded successfully",
                    showConfirmButton: false,
                    timer: 2000
                  });
                }


              } else {
                setFullPageLoading(false)
                setSubmitting(false);
                // toast.dismiss(toastId);
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              setFullPageLoading(false)
              setSubmitting(false);
              // toast.dismiss(toastId);
              Swal.fire({
                icon: 'error',
                title: "CSV upload failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        } else {
          setFullPageLoading(false)
          setSubmitting(false);
        }
      });
    }
  }

  useEffect(() => {
    getColumnHeaderDD();
  }, []); // This effect runs once on component mount



  useEffect(() => {
    if (jobDetails) {
      reset({
        buildingName: jobDetails.buildingName,
        clientName: jobDetails.clientName,
        jobNumber: jobDetails.projectNumber
      })
    }

  }, [props.jobDetails]);

  const handleCloseUploadCSVDataModal = () => {
    setShowUploadCSVDataModal(false);
  };


  const [csvData, setCsvData] = React.useState(uploadedCSV);

  useEffect(() => {
    setCsvData(uploadedCSV);
  }, [uploadedCSV]);

  const onChange = (e, id, property) => {
    const { value } = e.target;

    const csvAllData = uploadedCSV.map((item) =>
      item.id === id ? { ...item, [property]: { ...item[property], value } } : item
    );

    setCsvData(csvAllData);
  };





  const hendelsubmit = () => {

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
        setFullPageLoading(true)
        // const toastId = toast.loading("Loading...");
        axiosInstance
          .post("csv/saveUpdatedCsvData", csvData, { headers: headersForJwtWithJson })
          .then((res) => {
            if (res && res.data.status === 1) {
              setFullPageLoading(false)
              // toast.dismiss();
              Swal.fire({
                icon: 'success',
                title: "CSV uploaded successfully",
                showConfirmButton: false,
                timer: 2000
              });
              reset();
              handleCloseUploadCSVModal();
              handleCloseUploadCSVDataModal();
            } else {
              setFullPageLoading(false)
              // toast.dismiss();
              Swal.fire({
                icon: 'error',
                title: res.data.message,
                showConfirmButton: false,
                timer: 2000
              });
            }
          })
          .catch((err) => {
            setFullPageLoading(false)
            // toast.dismiss();
            Swal.fire({
              icon: 'error',
              title: "CSV upload failed. Try after some time",
              showConfirmButton: false,
              timer: 2000
            })
          });
      }
    });

  }

  return (
    <>
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <Modal
        show={showUploadCSVModal}
        onHide={() => {
          handleCloseUploadCSVModal();
        }}
        size="md"
        centered
        // dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="modal-header-section ">
          <Modal.Title id="contained-modal-title-vcenter" className="ml-5">
            Upload CSV
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example inside-padding user-modal ">
          {/* className="upload-csv-container" */}
          <Form validated={validated} onSubmit={handleSubmit(onSubmit)}>


            <div className="upload-csv-container">

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="white">Building Name</Form.Label>
                <Form.Control type="text" name="buildingName" placeholder="Building Name" {...register("buildingName")} readOnly />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Client Name</Form.Label>
                <Form.Control type="text" name="clientName" placeholder="Client Name" {...register("clientName")} readOnly />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Job Number</Form.Label>
                <Form.Control type="text" placeholder="Job Number"  {...register("jobNumber")} readOnly />
              </Form.Group>
              <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Test Date <span className="text-danger">*</span>
                  <br></br><span className="white">(Enter the test date equal/greater then assigned date {jobDetails.dateAssigned ? new Date(jobDetails.dateAssigned).toISOString().split('T')[0] : ''} {jobDetails.dateCompletion ? ' and equal/less then Completion Date on ' + new Date(jobDetails.dateCompletion).toISOString().split('T')[0] : ''})</span>
                </Form.Label>
                <Form.Control type="date" placeholder="Test Date"
                  {...register("testDate",
                    {
                      required: "Test date required",
                      validate: (value) =>
                        (value >= new Date(jobDetails.dateAssigned).toISOString().split('T')[0] && (jobDetails.dateCompletion !== null ? value <= new Date(jobDetails.dateCompletion).toISOString().split('T')[0] : value === value)) ||
                        'Test Date must fall within the period from Job Assigned on ' + new Date(jobDetails.dateAssigned).toISOString().split('T')[0] + (jobDetails.dateCompletion !== null ? ' to Completion Date on ' + new Date(jobDetails.dateCompletion).toISOString().split('T')[0] : ''),
                    })}
                  disabled={submitting}
                />
                {errors.testDate && (
                  <span className="text-danger-csv">{errors.testDate.message}</span>
                )}
              </Form.Group>

              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} name='csvFile' />
                <BiSolidCloudUpload className="fil-45" />
                <p>Drag 'n' drop CSV files here, or click to select files</p>
              </div>

              <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlTextarea1"
              >
                <aside className="file-na-container mt-4 mb-4">
                  <h6 className="f-s white">
                    {" "}
                    <FaFileCsv className="fil-size mr-2 white" />
                    Files
                  </h6>
                  <ul className="white mb-0">{files}</ul>
                </aside>
              </Form.Group>
              <div>
                <Form.Group className="mb-4" controlId="csvColumnChanged">
                  <div className="mb-3">
                    <Form.Check // prettier-ignore
                      label={`CSV Columns has changed? `}
                      className='me-3 text-white'
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


              <div className="button-container float-right">
                {/* <Button type="reset" className="btn-wt">
              Reset
            </Button> */}
                <Button type="submit" className="btn-wt" disabled={submitting}>
                  {submitting ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
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
                {/* <tr>
                  <td>{airQualityData.carbonDioxideMin} - {airQualityData.carbonDioxideMax}</td>
                  <td>{airQualityData.carbonMonoxideMin} - ({airQualityData.carbonMonoxideMax} or 2ppm above outdoors)</td>
                  <td>{airQualityData.temperatureMin} - {airQualityData.temperatureMax}</td>
                  <td>{airQualityData.relativeHumidityMin} - {airQualityData.relativeHumidityMax}</td>
                  <td>{airQualityData.particulate25min} - {airQualityData.particulate25max}</td>
                  <td>{airQualityData.particulateMin} - {airQualityData.particulateMax}</td>
                  <td>{airQualityData.tvocMin} - {airQualityData.tvocMax}</td>
                </tr> */}
                <tr>
                  <td className="text-center font-carbon">{airQualityData.carbonDioxideMin} - {airQualityData.carbonDioxideMax}</td>
                  <td className="text-center font-carbon">{airQualityData.carbonMonoxideMin} - {airQualityData.carbonMonoxideMax} (or 2 <br /> ppm above<br /> outdoors)</td>
                  <td className="text-center font-carbon">{airQualityData.temperatureMin} - {airQualityData.temperatureMax}</td>
                  <td className="text-center font-carbon">{airQualityData.relativeHumidityMin} - {airQualityData.relativeHumidityMax}</td>
                  {/* <td>{airQualityData.particulate25min} - {airQualityData.particulate25max}</td> */}
                  {/* <td className="text-center font-carbon">{airQualityData.particulateMin} - {airQualityData.particulateMax}(PM<sub>2.5</sub>)</td> */}
                  <td className="text-center font-carbon">
                    {airQualityData.particulate25min} - {airQualityData.particulate25max} (PM<sub>2.5</sub>)<br />
                    {airQualityData.particulateMin} - {airQualityData.particulateMax} (PM<sub>10</sub>)

                  </td>

                  <td className="text-center font-carbon">{airQualityData.tvocMin} - {airQualityData.tvocMax}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="upload-csv-table">
            <p style={{ float: 'right' }}>
              <span>Total Records : </span> <b>{totalRecordsCount}</b>
              <span>  Total Error : </span> <b>{errorDataRecordCount}</b>
            </p>
            <Table striped responsive='lg'>
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Site</th>
                  <th>Location</th>
                  <th>Carbon Dioxide(ppm)</th>
                  <th>Carbon Monoxide(ppm)</th>
                  <th>Temperature</th>
                  <th>Relative Humidity</th>
                  {/* {uploadedCSV && uploadedCSV['0'].particulate25 !== null ?  <th>Particulate(PM 2.5)</th> : null}
                  {uploadedCSV && uploadedCSV['0'].particulate !== null ?  <th>Particulate</th> : null} */}
                  {uploadedCSV && uploadedCSV.length > 0 && uploadedCSV[0]?.particulate25 !== null ? <th>Particulate(PM<sub>2.5</sub>)</th> : null}
                  {uploadedCSV && uploadedCSV.length > 0 && uploadedCSV[0]?.particulate !== null ? <th>Particulate(PM<sub>10</sub>)</th> : null}

                  <th>TVOC</th>
                  <th>AM/PM</th>
                  <th>In/Out</th>
                  <th>Note</th>
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
            <button className="btn btn-danger float-end" onClick={handleCloseUploadCSVDataModal}>Cancel</button>
            <button className="btn btn-primary float-end" onClick={hendelsubmit}>Continue and Submit</button>
          </div>

        </Modal.Body>
      </Modal>

    </>
  );
};

export const AddEditModal = (props) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [Client, setClient] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [userName, setUserName] = useState("");
  const [isJobInvoiced, setIsJobInvoiced] = useState(false); // Initialize the state for jobInvoiced
  const [isStatusCompleted, setIsStatusCompleted] = useState(false); // Initialize the state for StatusCompleted
  const [isEditMode, setIsEditMode] = useState(false); // State to determine if it's in edit mode
  const [isPm25, setIsPm25] = useState(false); // State to PM2.5 if it's in edit mode
  const [isPm10, setIsPm10] = useState(false); // State to PM10 if it's in edit mode
  const [isLeed, setIsLeed] = useState(false); // State to Attr if it's in edit mode

  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [equipmentRecords, setEquipmentRecords] = useState([]);
  const [isPmSelected, setIsPmSelected] = useState(false);
  const [isPmError, setIsPmError] = useState(false);



  const {
    showAddJobModal,
    showEditJobModal,
    handleCloseJobModal,
    countryForAddJob,
    editData,
    setFullPageLoading // Data for editing, pass null for adding
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
      if (event.isPm25 || event.isPm10 || isPm25 || isPm10) {
        // Perform update operation based on the data

        const data = {
          jobId: editData.list.jobId,
          clientId: Number(event.ClientName),
          inspectorId: event.jobInspectorId,
          projectNumber: event.projectNumber,
          dateAssigned: event.testDate,
          completionStatus: event.jobCompleted,
          dateCompletion: event.completionDate,
          whereFrom: event.whereFrom,
          cityId: Number(event.City),
          invoiceDate: event.invoicedDate,
          isInvoiced: event.jobInvoiced,
          commentsExecSummary: event.comments,
          discussionTitle: event.discussionTitle,
          discussionText: event.discussionText,
          buildingId: Number(event.BuildingName),
          userId: userData.userDetails.userId,
          clientJobDeviceMapDtos: [...equipmentRecords],
          isPm25: event.isPm25,
          isPm10: event.isPm10,
          isLeed: event.isLeed,
        };

        let formData = new FormData();
        if (event.image.length > 0) {
          formData.append("image", event.image[0]); // Creating an empty Blob with a default type);
        }
        delete event["image"];
        formData.append("jobData", JSON.stringify(data));
        // return false;

        Swal.fire({
          title: "Please confirm",
          text: "Do you want to update this job?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            setFullPageLoading(true)
            axiosInstance
              .post("job/editJob", formData, { headers: headersForJwt })
              .then((res) => {
                if (res && res.data.status === 1) {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'success',
                    title: "Job updated successfully",
                    showConfirmButton: false,
                    timer: 2000
                  });
                  reset();
                  setEquipmentRecords([]);
                  handleCloseJobModal();
                } else {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 2000
                  });
                }
              })
              .catch((err) => {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'error',
                  title: "Job update failed. Try after some time",
                  showConfirmButton: false,
                  timer: 2000
                })
              });
          }
        });
      } else {
        ErrorToastWithToastId("Please select at least one of Is PM 2.5 or Is PM 10");
      }

    } else {
      if (event.isPm25 || event.isPm10 || isPm25 || isPm10) {
        const data = {
          clientId: Number(event.ClientName),
          // jobTypeId: event.target.roleName.value,
          inspectorId: event.jobInspectorId,
          projectNumber: event.projectNumber,
          dateAssigned: event.testDate,
          completionStatus: event.jobCompleted,
          dateCompletion: event.completionDate,
          //  titlePhoto: event.target.roleName.value,
          whereFrom: event.whereFrom,
          cityId: Number(event.City),
          // templateId: event.target.roleName.value,
          invoiceDate: event.invoicedDate,
          //  reportGeneratedDate : event.target.roleName.value,
          isInvoiced: event.jobInvoiced,
          isPm25: isPm25 ? isPm25 : false,
          isPm10: isPm10 ? isPm10 : false,
          isLeed: event.isLeed ? event.isLeed : false,

          commentsExecSummary: event.comments,
          // discussionTitle: event.discussionTitle,
          // discussionText: event.discussionText,
          // isActive : true : event.target.roleName.value,
          // createdBy : event.target.roleName.value,
          //  createdOn : event.target.roleName.value,
          // updatedBy,
          //  updatedOn,
          // slNo,

          //  clientName,
          //  buildingName,
          //  cityName,
          //  provinceName,
          buildingId: Number(event.BuildingName),
          userId: userData.userDetails.userId,
          clientJobDeviceMapDtos: [...equipmentRecords]
        };

        let formData = new FormData();
        if (event.image.length > 0) {
          formData.append("image", event.image[0]); // Creating an empty Blob with a default type);
        }
        delete event["image"];
        formData.append("jobData", JSON.stringify(data));



        Swal.fire({
          title: "Please confirm",
          text: "Do you want to create this job?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            setFullPageLoading(true)
            axiosInstance
              .post("job/addJob", formData, { headers: headersForJwt })
              .then((res) => {
                if (res && res.data.status === 1) {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'success',
                    title: "Job created successfully",
                    showConfirmButton: false,
                    timer: 2000
                  });
                  reset();
                  setEquipmentRecords([]);
                  handleCloseJobModal();
                } else {
                  setFullPageLoading(false)
                  Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 2000
                  });
                }
              })
              .catch((err) => {
                setFullPageLoading(false)
                Swal.fire({
                  icon: 'error',
                  title: "Job creation failed. Try after some time",
                  showConfirmButton: false,
                  timer: 2000
                })
              });
          }
        });
      } else {
        ErrorToastWithToastId("Please select at least one of Is PM 2.5 or Is PM 10");
      }

    }
  }


  const getProviance = async (value) => {
    setProvince("");
    setCity("");
    let formData = new FormData();
    formData.append("countryId", Number(value));
    await axiosInstance
      .post(`client/getAllProvinceDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // setLoading(true)
        setProvince("");
        if (res && res.data.status === 1) {
          setProvince(res.data.data.list);
        }

        return false;
      })
      .catch((err) => {
      });
  };

  const getCity = async (value) => {
    setCity("");
    let formData = new FormData();
    formData.append("provinceId", Number(value));

    await axiosInstance
      .post(`client/getAllCityDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCity(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const getClientName = async (value) => {
    setClient("");
    let formData = new FormData();

    await axiosInstance
      .post(`client/getAllClientDD`, formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setClient(res.data.data.list);
          // setCountry(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  };

  const getBuilding = async (value) => {
    let formData = new FormData();
    formData.append("clientId", Number(value));
    setBuildingName("");
    await axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        setBuildingName(res.data.data.list);
      })
      .catch((err) => { });
  };

  const getUserName = async () => {
    setUserName("");
    await axiosInstance
      .post(`users/getUserNameDD`, [], {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res && res.data.status === 1) {
          setUserName(res.data.data.list);
        }
        return false;
      })
      .catch((err) => {
      });
  }// Function to set the initial state based on whether it's an edit operation



  // Function to handle adding more equipment records
  const addEquipmentRecord = () => {
    // Add a new empty equipment record to the state
    setEquipmentRecords([...equipmentRecords, { equipmentType: '', equipmentNumber: '' }]);
  };

  const removeEquipmentRecord = (index) => {
    // Remove the equipment record at the specified index
    const updatedRecords = [...equipmentRecords];
    updatedRecords.splice(index, 1);
    setEquipmentRecords(updatedRecords);
  };



  const resetData = async () => {
    await getProviance(-1);
    await getCity(-1);
    await getClientName(-1);
    await getBuilding(-1);
    await getUserName(-1);
    setEquipmentRecords([]);
  }


  const initializeFields = async (editData) => {
    if (editData) {
      // const toastId = toast.loading("Loading...");
      setIsEditMode(true); // Set the edit mode
      setEquipmentRecords([]);
      // Initialize state variables with editData values
      await resetData();
      setIsJobInvoiced(editData.list.isInvoiced);
      setIsStatusCompleted(editData.list.completionStatus);
      setIsPm25(editData && editData.list.isPm10 ? editData.list.isPm10 : false);
      setIsPm10(editData && editData.list.isPm25 ? editData.list.isPm25 : false);
      reset({
        Country: editData && editData.list.countryId ? editData.list.countryId : '',
        Province: editData && editData.list.provienceId ? editData.list.provienceId : '',
        City: editData && editData.list.cityId ? editData.list.cityId : '',
        ClientName: editData && editData.list.clientId ? editData.list.clientId : '',
        BuildingName: editData && editData.list.buildingId ? editData.list.buildingId : '',
        jobInspectorId: editData && editData.list.inspectorId ? editData.list.inspectorId : '',
        projectNumber: editData.list.projectNumber,
        testDate: new Date(editData.list.dateAssigned).toISOString().split('T')[0],
        jobCompleted: editData.list.completionStatus,
        completionDate: editData && editData.list.dateCompletion ? new Date(editData.list.dateCompletion).toISOString().split('T')[0] : '',
        jobInvoiced: editData.list.isInvoiced,
        invoicedDate: new Date(editData.list.invoiceDate).toISOString().split('T')[0],
        isPm25: editData && editData.list.isPm25 ? editData.list.isPm25 : false,
        isPm10: editData && editData.list.isPm10 ? editData.list.isPm10 : false,
        isLeed: editData && editData.list.isLeed ? editData.list.isLeed : false,

        // whereFrom: editData.list.whereFrom,
        // discussionTitle: editData.list.discussionTitle,
        // discussionText: editData.list.discussionText,
        comments: editData.list.commentsExecSummary,
      })
      if (editData.clientJobDeviceMapDtos && editData.clientJobDeviceMapDtos.length > 0) {
        setEquipmentRecords(editData.clientJobDeviceMapDtos);
      }
      toast.dismiss();
      // Initialize other fields...
    } else {
      reset({
        Country: '',
        Province: '',
        City: '',
        ClientName: '',
        BuildingName: '',
        jobInspectorId: '',
        projectNumber: '',
        testDate: '',
        completionDate: '',
        jobInvoiced: 'false',
        jobCompleted: 'false',
        invoicedDate: '',
        isPm25: false,
        isPm10: false,
        isLeed: 'false',
        whereFrom: '',
        discussionTitle: '',
        discussionText: '',
        comments: '',
        equipmentType: '', // Assuming you have a state for equipmentType
        equipmentNumber: '', // Assuming you have a state for equipmentNumber  
      });
      setIsEditMode(false); // Set the Add mode
      setEquipmentRecords([]);
    }
  };

  // Call initializeFields in useEffect when editData is available
  useEffect(() => {
    reset();
    getUserName();
    initializeFields(props.editData);
  }, [props.editData]);

  return (
    <Modal centered show={showAddJobModal || showEditJobModal} onHide={handleCloseJobModal} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          {isEditMode ? "Edit Job" : "Add Job"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form noValidate validated={validated} onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            {/* Country */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Country <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="Country"
                id="Country"
                className="form-add-user newSize"
                {...register("Country", {
                  onChange: (e) => {
                    getProviance(e.target.value);
                  },
                  required: "Country required",
                })}
              // options={countryForAddJob}
              >
                <option value="">Select Country</option>
                {countryForAddJob &&
                  countryForAddJob.length > 0 &&
                  countryForAddJob.map((countryOption) => (
                    <option key={countryOption.countryId} value={countryOption.countryId}>
                      {countryOption.countryName}
                    </option>
                  ))}
              </Form.Select>
              {errors.Country && (
                <span className="text-danger">{errors.Country.message}</span>
              )}
            </Col>

            {/* Province */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Province <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="Province"
                id="Province"
                className="form-add-user newSize"
                {...register("Province", {
                  onChange: (e) => {
                    getCity(e.target.value);
                  },
                  required: "Province required",
                })}
              >
                <option value="">Select Province</option>
                {province &&
                  province.length > 0 &&
                  province.map((prov) => {
                    return (
                      <option value={prov.provinceId} key={prov.provinceId}>
                        {prov.provinceName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.Province && (
                <span className="text-danger">{errors.Province.message}</span>
              )}
            </Col>

            {/* City */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                City <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="City"
                id="City"
                className="form-add-user newSize"
                {...register("City", {
                  onChange: (e) => {
                    getClientName(e.target.value);
                  },
                  required: "City required",
                })}
              >
                <option value="">Select City</option>
                {city &&
                  city.length > 0 &&
                  city.map((city) => {
                    return (
                      <option value={city.cityId} key={city.cityId}>
                        {city.cityName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.City && (
                <span className="text-danger">{errors.City.message}</span>
              )}
            </Col>

            {/* Client Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Client Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="ClientName"
                id="ClientName"
                className="form-add-user newSize"
                {...register("ClientName", {
                  onChange: (e) => {
                    getBuilding(e.target.value);
                  },
                  required: "Client name required",
                })}
              >
                <option value="">Select Client Name</option>
                {Client &&
                  Client.length > 0 &&
                  Client.map((prov) => {
                    return (
                      <option value={prov.clientId} key={prov.clientId}>
                        {prov.clientName}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.ClientName && (
                <span className="text-danger">{errors.ClientName.message}</span>
              )}
            </Col>

            {/* Building Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Building Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="BuildingName"
                id="BuildingName"
                className="form-add-user newSize"
                {...register("BuildingName", {
                  onChange: (e) => {
                    // getUserName();
                  },
                  required: "Building name required",
                })}
              >
                <option value="">Select building name</option>
                {buildingName &&
                  buildingName.length > 0 &&
                  buildingName.map((prov) => {
                    return (
                      <option value={prov.id} key={prov.id}>
                        {prov.address2 ? `${prov.name} at ${prov.address1}, ${prov.address2}` : `${prov.name} at ${prov.address1}`}
                      </option>
                    );
                  })}
              </Form.Select>
              {errors.BuildingName && (
                <span className="text-danger">{errors.BuildingName.message}</span>
              )}
            </Col>

            {/* Job Inspector Name */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Job Inspector Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="jobInspectorId"
                {...register("jobInspectorId", {
                  required: "Job Inspector name required",
                })}
              />
              {/* <Form.Select
                as="select"
                size="sm"
                name="jobInspectorId"
                id="jobInspectorId"
                className="form-add-user newSize "
                {...register("jobInspectorId", {
                  // onChange: (e) => {
                  //   getBuilding(e);
                  // },
                  required: "Job Inspector Name Required",
                })}
              >
                <option value="">Select Job Inspector Name</option>
                {userName &&
                  userName.length > 0 &&
                  userName.map((prov) => {
                    return (
                      <option value={prov.id} key={prov.id}>
                        {prov.userName}
                      </option>
                    );
                  })}
              </Form.Select> */}
              {errors.jobInspectorId && (
                <span className="text-danger">{errors.jobInspectorId.message}</span>
              )}
            </Col>

            {/* Job Project Number */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Job Project Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="projectNumber"
                {...register("projectNumber", {
                  required: "Job Project number required",
                })}
              />
              {errors.projectNumber && (
                <span className="text-danger">{errors.projectNumber.message}</span>
              )}
            </Col>

            {(editData && editData.list.titlePhoto) ?
              <img
                className="img-circle"
                src={editData.list.titlePhoto}
                alt="user pic"
                style={{
                  'border': '1px solid #ddd',
                  'border-radius': '4px',
                  'padding': '1px',
                  'width': '12%',
                }}
                width="20px"
              />
              : ""
            }
            {/* Job Title Image */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Job Title Image
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                className="form-control-add-user newSize"
                name="image"
                {...register("image", {
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

            {/* Test Date */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Test Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                size="sm"
                className="form-control-add-user newSize"
                name="testDate"
                {...register("testDate", {
                  required: "Test date required",
                })}
              />
              {errors.testDate && (
                <span className="text-danger">{errors.testDate.message}</span>
              )}
            </Col>

            {/* Is PM_2.5 */}
            {/* <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Is PM 2.5 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="isPm25"
                id="isPm25"
                className="form-add-user newSize"
                {...register("isPm25", {
                  required: "Select PM 2.5",
                })}
                onChange={(e) => {
                  setIsPm25(e.target.value === "true"); // Set the state based on the selected value
                }}
              >
                <option value="">Is PM 2.5</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Form.Select>
              {errors.isPm25 && (
                <span className="text-danger">{errors.isPm25.message}</span>
              )}
            </Col> */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Group controlId="isPm25">
                <Form.Label></Form.Label>
                <Form.Check
                  label="Is PM 2.5?"
                  className='me-3'
                  type='checkbox'
                  placeholder='Is PM 2.5?'
                  {...register("isPm25", {
                  })}
                  onChange={(e) => {
                    setIsPm25(!isPm25); // Set the state based on the selected value
                  }}
                // defaultChecked={roleDetails.isAdd}
                />
              </Form.Group>
            </Col>

            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Group controlId="isPm10">
                <Form.Label></Form.Label>
                <Form.Check
                  label="Is PM 10?"
                  className='me-3'
                  type='checkbox'
                  placeholder='Is PM 10?'
                  {...register("isPm10", {
                  })}
                  onChange={(e) => {
                    setIsPm10(!isPm10); // Set the state based on the selected value
                  }}
                // defaultChecked={roleDetails.isAdd}
                />
              </Form.Group>
            </Col>



            {/* Is Leed */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Is Leed
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="isLeed"
                id="isLeed"
                className="form-add-user newSize"
                {...register("isLeed", {
                  onChange: (e) => {
                    setIsLeed(e.target.value === "false")
                  },
                  // required: "Select Leed",
                })}
              >
                {/*  <option value="" key="" >Is Leed</option>  */}
                <option value="true" key="true">Yes</option>
                <option value="false" key="false">No</option>
              </Form.Select>
              {/* {errors.isLeed && (
                <span className="text-danger">{errors.isLeed.message}</span>
              )} */}
            </Col>

            {/* Is Completed Status */}
            <Col lg={4} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Job Status <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                as="select"
                size="sm"
                name="jobCompleted"
                id="jobCompleted"
                className="form-add-user newSize"
                {...register("jobCompleted", {
                  required: "Job Completed Status required",
                })}
                onChange={(e) => {
                  setIsStatusCompleted(e.target.value === "true"); // Set the state based on the selected value
                  reset({
                    completionDate: '',
                    jobInvoiced: 'false',
                    invoicedDate: ''
                  })
                }}
              >
                {/* <option value="" key="">Is Job Completed</option> */}
                <option value="true" key="true">Complete</option>
                <option value="false" key="false">Incomplete</option>
              </Form.Select>
              {errors.jobCompleted && (
                <span className="text-danger">{errors.jobCompleted.message}</span>
              )}
            </Col>

            {/* Completion Date */}
            {isStatusCompleted ? (
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Completion Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="completionDate"
                  {...register("completionDate", {
                    required: "Complition date required",
                    validate: (value) =>
                      (value !== null || value >= document.querySelector('[name="testDate"]').value) ||
                      'Completion Date must not be earlier than Test Date',
                  })}
                />
                {errors.completionDate && (
                  <span className="text-danger">{errors.completionDate.message}</span>
                )}
              </Col>
            ) : (
              <Col lg={4} md={6} xs={12} className="mb-3">
                {/* Empty column when Invoiced Date is read-only */}
              </Col>
            )}

            {/* Is Invoiced */}
            {isStatusCompleted ? (
              < Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Job Invoiced
                </Form.Label>
                <Form.Select
                  as="select"
                  size="sm"
                  name="jobInvoiced"
                  id="jobInvoiced"
                  className="form-add-user newSize"
                  {...register("jobInvoiced", {
                    // required: "Job Invoiced required",
                  })}
                  onChange={(e) => {
                    setIsJobInvoiced(e.target.value === "false"); // Set the state based on the selected value
                    reset({
                      invoicedDate: ''
                    })
                  }}
                >
                  {/* <option value="" key="">Is Job Invoiced</option> */}
                  <option value="true" key="true">Yes</option>
                  <option value="false" key="false">No</option>
                </Form.Select>
                {/* {errors.jobInvoiced && (
                  <span className="text-danger">{errors.jobInvoiced.message}</span>
                )} */}
              </Col>
            ) : (
              <Col lg={4} md={6} xs={12} className="mb-3">
                {/* Empty column when Invoiced Date is read-only */}
              </Col>
            )}



            {/* Invoiced Date (conditionally rendered based on isJobInvoiced state) */}
            {isJobInvoiced && isStatusCompleted ? (
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Invoiced Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  className="form-control-add-user newSize"
                  // readOnly={!isJobInvoiced} 
                  name="invoicedDate"
                  {...register("invoicedDate", {
                    required: "Invoiced date required",
                    validate: (value) =>
                      (value > document.querySelector('[name="testDate"]').value && value >= document.querySelector('[name="completionDate"]').value) ||
                      'Invoiced Date must not be earlier than Completion Date',
                  })}
                />
                {errors.invoicedDate && (
                  <span className="text-danger">{errors.invoicedDate.message}</span>
                )}
              </Col>
            ) : (
              <Col lg={4} md={6} xs={12} className="mb-3">
                {/* Empty column when Invoiced Date is read-only */}
              </Col>
            )}


            {/* Job Where From */}
            {/* <Col lg={6} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Job From Where
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name=" whereFrom"
                {...register("whereFrom", {
                  // required: "Job Where From required",
                })}
              />
              {errors.whereFrom && (
                <span className="text-danger">{errors.whereFrom.message}</span>
              )}
            </Col> */}

            {/* Discussion Title */}
            {/* <Col lg={6} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Discussion Title
              </Form.Label>
              <Form.Control
                type="text"
                size="sm"
                className="form-control-add-user newSize"
                name="discussionTitle"
                {...register("discussionTitle", {
                  // required: "Discussion Title required",
                })}
              />
              {errors.discussionTitle && (
                <span className="text-danger">{errors.discussionTitle.message}</span>
              )}
            </Col> */}

            {/* Discussion Text */}
            {/* <Col lg={6} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Discussion Text
              </Form.Label>
              <Form.Control
                as="textarea" // Use "as" prop to specify it's a textarea
                rows={3}       // Specify the number of visible rows
                size="sm"
                className="form-control-add-user newSize"
                name="discussionText"
                {...register("discussionText", {
                  // required: "Discussion Text required",
                })}
              />
              {errors.discussionText && (
                <span className="text-danger">{errors.discussionText.message}</span>
              )}
            </Col> */}

            {/* Equipment Records */}
            <Col lg={12} className="mb-3">
              <h6 className="mt-3 mb-3">
                Equipment Records
                <span className="add-equipment mx-3">
                  <Button className="btn-equpt" variant="secondary" size="sm" onClick={addEquipmentRecord}>
                    <BiPlus />
                  </Button>
                </span>
              </h6>
              {equipmentRecords.map((record, index) => (
                <Row key={index} className="mb-2">
                  <Col md={5} xs={12}>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Equipment Type"
                      value={record.equipmentType}
                      onChange={(e) => {
                        const updatedRecords = [...equipmentRecords];
                        updatedRecords[index].equipmentType = e.target.value;
                        setEquipmentRecords(updatedRecords);
                      }}
                    />
                  </Col>
                  <Col md={5} xs={12}>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Equipment Number"
                      value={record.equipmentNumber}
                      onChange={(e) => {
                        const updatedRecords = [...equipmentRecords];
                        updatedRecords[index].equipmentNumber = e.target.value;
                        setEquipmentRecords(updatedRecords);
                      }}
                    />
                  </Col>
                  <Col md={2} xs={12}>
                    <Button className="float-end" variant="danger" size="sm" onClick={() => removeEquipmentRecord(index)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              {/*  */}
            </Col>

            {/* Comments */}
            <Col lg={12} md={6} xs={12} className="mb-3">
              <Form.Label className="newSize">
                Comments
              </Form.Label>
              <Form.Control
                as="textarea" // Use "as" prop to specify it's a textarea
                rows={3}       // Specify the number of visible rows
                size="sm"
                className="form-control-add-user newSize"
                name="comments"
                {...register("comments", {
                  // required: "Comments required",
                })}
              />
              {errors.comments && (
                <span className="text-danger">{errors.comments.message}</span>
              )}
            </Col>

          </Row>

          {/* Submit Button */}
          <Button style={{ 'float': 'right' }} className="mt-3" type="submit">
            {isEditMode ? "Update Job" : "Create Job"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export const ViewJobModal = (props) => {
  // const[equipmentData,setEquipmentData]=useState('');
  const {
    equipemnetDetails,
    showJobViewModal,
    viewData,
    closeViewModal,
    clickedJobId,
    setFullPageLoading
  } = props;


  // const [userData, userName] = useRecoilState(userAtom);
  const [validated, setValidated] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState('');
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    reset({
      //  country:ViewData.cityId.name
      //  clientName: ViewData.,
      // middleName: ViewData.middleName,
      // lastName: ViewData.lastName,
      // email: ViewData.email,
      // phoneNumber: ViewData.phoneNumber,
      // address: ViewData.address,
      // userName: ViewData.userName,
      // roleId: ViewData && ViewData.roleId ? ViewData.roleId.name : '',
      // designationId: ViewData && ViewData.designationId ? ViewData.designationId.name : ''
      // designationId:ViewData.designationId.id

    })
    setData(equipemnetDetails ? equipemnetDetails : []);
  }, [viewData])



  const handleHide = () => {
    closeViewModal();
  }

  const columns = [

    {
      name: 'Sl no',
      width: "33%",
      selector: row => row.slNo,
      // sortable: true,
    },
    {
      name: 'Equipment Type',
      width: "33%",
      selector: row => row.equipmentType,
      // sortable: true,
    },
    {
      name: 'Equipment Number',
      selector: row => row.equipmentNumber,
      // sortable: true,
    },
  ];

  const viewJobProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    // handlePerRowsChange,
    // handlePageChange,
  };

  const viewCSVListProps = {
    viewType: "ViewById",
    clickedJobId
  };

  return (
    <Modal
      centered
      show={showJobViewModal}
      onHide={() => {
        // handleCloseUserEditModal();
        // reset();
        handleHide()

      }}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      className="user-view"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          Job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal user-view-container">

        <div className="Container">
          <Row className="mb-3 gx-2">
            {/* country */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Country</h6>
                <div><p>{viewData.countryName}</p></div>

              </div>
            </Col>
            {/* Provience */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Province</h6>
                <div><p>{viewData.provinceName}</p></div>
              </div>
            </Col>
            {/* city */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">City</h6>
                <div><p>{viewData.cityName}</p></div>
              </div>
            </Col>
            {/* Client Name */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Client Name</h6>
                <div><p>{viewData.clientName}</p></div>
              </div>
            </Col>
            {/* Building Name */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Building Name</h6>
                {/* <div><p>{viewData.buildingName + " "+ "at "+viewData?.address1}</p></div> */}
                <div>
                  <p>
                    {viewData.buildingName + (viewData.address1 ? " at " + viewData.address1 : "")}
                  </p>
                </div>
              </div>
            </Col>
            {/* job Inspector Name */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Job Inspector Name</h6>
                <div><p>{viewData.inspectorId}</p></div>
              </div>
            </Col>
            {/* testDate */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Test Date</h6>
                {/* <div><p>{viewData.dateAssigned}</p></div> */}
                <div><p>{viewData.dateAssigned ? format(new Date(viewData.dateAssigned), 'MMMM d, yyyy') : 'NA'}</p></div>
              </div>
            </Col>
            {/* completionStatus */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Completion Status</h6>
                <div><p>{viewData.completionStatus ? 'Completed' : 'Incompleted'}</p></div>
              </div>
            </Col>
            {/* completionDate */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Completion Date</h6>
                <div><p>{viewData.dateCompletion ? format(new Date(viewData.dateCompletion), 'MMMM d, yyyy') : 'NA'}</p></div>
              </div>
            </Col>
            {/* job Project Number */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Job Project Number</h6>
                <div><p>{viewData.projectNumber ? viewData.projectNumber : 'NA'}
                </p></div>
              </div>
            </Col>
            {/* image */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <Row>
                  <Col><h6 className="newSize">Job Title Image</h6></Col>
                  <Col>{viewData.titlePhoto ?
                    <img
                      className="img-circle"
                      src={viewData.titlePhoto}
                      style={{
                        'border': '1px solid #ddd',
                        'border-radius': '4px',
                        'margin-right': '10px',
                        'width': '73px',
                      }}
                      width="20px"
                    />
                    :
                    <img
                      className="img-circle"
                      src={noImage}
                      style={{
                        'border': '1px solid #ddd',
                        'border-radius': '4px',
                        'padding-right': '10px',
                        'width': '73px',
                      }}
                      width="20px"
                    />
                  }</Col>
                </Row>
              </div>
            </Col>
            {/* Job Invoiced */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Job Invoiced</h6>
                <div><p>{viewData.isInvoiced ? 'Yes' : "No"}
                </p></div>
              </div>
            </Col>
            {/*Invoice Date */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Invoice Date</h6>
                <div><p>{viewData.invoiceDate ? format(new Date(viewData.invoiceDate), 'MMMM d, yyyy') : 'NA'}</p></div>
              </div>
            </Col>

            {/*Is PM2.5 */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Is PM 2.5</h6>
                <div><p>{viewData.isPm25 ? 'True' : 'False'}</p></div>
              </div>
            </Col>
            {/*Is PM2.5 */}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Is PM 10</h6>
                <div><p>{viewData.isPm10 ? 'True' : 'False'}</p></div>
              </div>
            </Col>

            {/*Is Leed*/}
            <Col lg={4} md={6} xs={12} className="mb-3 pd-lr-o">
              <div className="back-boxes">
                <h6 className="newSize ">Is Leed</h6>
                <div><p>{viewData.isLeed ? 'True' : 'False'}</p></div>
              </div>
            </Col>

          </Row>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Job Equipments</Accordion.Header>
              <Accordion.Body className="user-view-container">
                <CommonDataTable {...viewJobProps} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>CSV</Accordion.Header>
              <Accordion.Body className="user-view-container">
                <CsvList {...viewCSVListProps} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>


        </div>
      </Modal.Body>
    </Modal>
  );
};