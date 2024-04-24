/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, Component, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { Helmet } from "react-helmet";
import {
  PiGearBold,
  PiNotePencilBold,
  PiTrashBold,
  PiEyeBold,
} from "react-icons/pi";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import Swal from "sweetalert2";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enIN from "date-fns/locale/en-IN";
import { format } from "date-fns";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function Template() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [nameForSeachDD, setNameForSeachDD] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const [filterStartDate, filterEndDate] = dateRange;

  const {
    register,
    getValues,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const fetchTemplateList = async (page, size = perPage) => {
    setLoading(true);
    let formData = new FormData();

    formData.append("userId", userData.userDetails.userId);
    formData.append("page", 0);
    formData.append("size", 10);
    formData.append("sortOrder", "DESC");
    formData.append("sortBy", "id");
    axiosInstance
      .post("template/getTemplateList", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log(res.data.data.list);
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  //Show All Building List in Table Format
  const columns = useMemo(
    () => [
      {
        name: "Sl no",
        width: "8%",
        selector: (row) => row.slNo,
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.slNo}`}>{row.slNo}</Tooltip>}
          >
            <span className="mg-b-0">{row.slNo}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Title",
        selector: "templateName",
        sortable: true,
        minWidth: "2%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.templateName}`}>{row.templateName}</Tooltip>}
          >
            <span className="mg-b-0">{row.templateName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Created Date",
        minWidth: "15%",
        selector: "createdOnChar",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.templateName}`}>{row.templateName}</Tooltip>}
          >
            <span className="mg-b-0">{row.templateName}</span>
          </OverlayTrigger>
        ),
      },

      {
        name: "Status",
        selector: "isActive",
        minWidth: "10%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-status-${row.id}`}>{getStatusText(row)}</Tooltip>}
          >
            <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
              {getStatusText(row)}
            </div>
          </OverlayTrigger>
        ),
      },
      {
        name: "Action",
        width: "6%",
        // eslint-disable-next-line react/button-has-type
        cell: (row) => (
          <>
            <Dropdown>
              <Dropdown.Toggle
                as="a"
                variant="success"
                id="dropdown-basic"
                className="setting-box"
              >
                <PiGearBold size={16} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="custom-dropdown-menu-position">
                {userData.access.isDelete ? (
                  <Dropdown.Item
                    onClick={() => onDelete(row.id, row.isActive)}
                    className="fz-2"
                  >
                    {row.isActive ? (
                      <div>
                        <LiaUserSlashSolid color="red" className="user-icon" />
                        <span style={{ color: "red" }}>Inactivate</span>
                      </div>
                    ) : (
                      <div>
                        <LiaUserSolid color="green" className="user-icon" />
                        <span style={{ color: "green" }}>Activate</span>
                      </div>
                    )}
                  </Dropdown.Item>
                ) : (
                  ""
                )}
                {row.isActive ? (
                  userData.access.isEdit ? (
                    <Dropdown.Item
                      onClick={() => onEdit(row.id)}
                      className="fz-2"
                    >
                      <PiNotePencilBold className="user-icon " />
                      Edit Template
                    </Dropdown.Item>
                  ) : ""
                ) : null}
                {/* {userData.access.isView ? (
                  <Dropdown.Item
                    onClick={() => onView(row.id)}
                    className="fz-2"
                  >
                    <PiEyeBold className="user-icon" /> View Template
                  </Dropdown.Item>
                ) : (
                  ""
                )} */}
              </Dropdown.Menu>
            </Dropdown>
          </>
        ),
      },

      // {
      //   name: "Action",
      //   width: "6%",
      //   // eslint-disable-next-line react/button-has-type
      //   cell: (row) => (
      //     <>
      //       <Dropdown>
      //         <Dropdown.Toggle
      //           as="a"
      //           variant="success"
      //           id="dropdown-basic"
      //           className="setting-box"
      //         >
      //           <PiGearBold size={16} />
      //         </Dropdown.Toggle>

      //         <Dropdown.Menu>
      //           <Dropdown.Item className="fz-2"></Dropdown.Item>

      //           <Dropdown.Item
      //             onClick={() => onView(row.buildingId)}
      //             className="fz-2"
      //           >
      //             <PiEyeBold className="user-icon" /> View
      //           </Dropdown.Item>
      //           <Dropdown.Item
      //             className="fz-2"
      //             onClick={() => onEdit(row.buildingId)}
      //           >
      //             <PiNotePencilBold className="user-icon " />
      //             Edit Building
      //           </Dropdown.Item>
      //           <Dropdown.Item className="fz-2 logouticon"
      //             onClick={() => onDelete(row.buildingId)}>
      //             <PiTrashBold className="user-icon " />
      //             Delete
      //           </Dropdown.Item>
      //         </Dropdown.Menu>
      //       </Dropdown>
      //     </>
      //   ),
      // },
    ],
    []
  );
  const getStatusText = (row) => {
    return row.isActive ? "Active" : "Inactive";
  };
  const TemplateListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  };
  const getAllNameDD = async () => {
    const formData = new FormData();

    if (userData !== "") formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("template/getTemplateNameDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Template Name" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.templateName,
          })),
        ];
        setNameForSeachDD(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchTemplateList();
    getAllNameDD();
  }, []);

  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text:
        " Do you want to " + (active ? "inactivate" : "activate") + " this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        let formData = new FormData();
        formData.append("templateId", id);
        formData.append("userId", userData.userDetails.userId);

        axiosInstance
          .post("template/deactivateTemplate", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchTemplateList();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const onEdit = (id) => {
    const encodedId = btoa(id.toString()); // Encoding the ID using base-64

    navigate(`/reportTemplates/edit-template/${encodedId}`);
    // const formData = new FormData();
    // formData.append("userId", id);
    // axiosInstance
    //   .post("template/getTemplateById", formData, { headers: headersForJwt })
    //   .then((res) => {
    //     setEditUserData([]);
    //     setEditUserData(res.data.data.list);
    //     setShowUserEditModal(true);
    //   })
    //   .catch((err) => {
    //     // setLoading(true);
    //   });
  };
  const onView = (id) => {
    // const formData = new FormData();
    // formData.append("userId", id);
    // axiosInstance
    //   .post("users/getUserById", formData, { headers: headersForJwt })
    //   .then((res) => {
    //     setEditUserData([]);
    //     setEditUserData(res.data.data.list);
    //     setShowUserViewModal(true);
    //   })
    //   .catch((err) => {
    //     // setLoading(true);
    //   });
  };

  const resetFilter = () => {
    reset({ templateId: "", status: "" });
    setDateRange([null, null]);
    fetchTemplateList(1);
  };
  const searchSubmit = (data) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", 0);
    formData.append("size", 10);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");
    formData.append("userId", userData.userDetails.userId);

    if (filterStartDate !== null)
      formData.append(
        "startDate",
        format(filterStartDate, "yyyy-MM-dd", { locale: enIN })
      );
    if (filterEndDate !== null)
      formData.append(
        "endDate",
        format(filterEndDate, "yyyy-MM-dd", { locale: enIN })
      );

    if (data.status && data.status.value !== "")
      formData.append("status", data.status.value);
    if (data.templateId && data.templateId.value > 0)
      formData.append("templateId", data.templateId.value);
    axiosInstance
      .post("template/getTemplateList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      search here
    </Tooltip>
  );
  const resetTooltip = (props) => (
    <Tooltip id="button-rest" {...props}>
      Reset
    </Tooltip>
  );

  const optionsForStatus = [
    { value: "", label: "Select Status" },
    { value: true, label: "Activate" },
    { value: false, label: "Inactivate" },
  ];

  return (
    <>
      <Helmet title={"Template | IAQ Reporting System"} />

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                <h5 className="m-0 mt-3 mb-2">Templates</h5>
              </div>
              <div className="col-sm-3 pd-r-0">
                <button
                  onClick={() => navigate("/reportTemplates/addTemplate")}
                  className="btn btn-primary fz-14 float-end"
                >
                  Add Template
                </button>
              </div>
              <div className="col-lg-12 pd-0">
                <Form
                  className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <div
                    className="user-info"
                    style={{
                      justifyContent: "flex-start",
                      // gap: "2.8em",
                      important: "true",
                    }}
                  >
                    {/* <div className="user-info" > */}
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Template Name</h6>
                      <Controller
                        control={control}
                        name="templateId"
                        {...register("templateId")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={nameForSeachDD}
                              placeholder="Select Name"
                              name="templateId"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <div className="col-lg-2 col-md-12 pd-0">
                      <div className="user-info-inner-1 w-100">
                        <h6 className="label-search">Select Start-End Date</h6>
                        <DatePicker
                          showIcon
                          selectsRange={true}
                          startDate={filterStartDate}
                          endDate={filterEndDate}
                          range
                          onChange={(update) => {
                            setDateRange(update);
                          }}
                          isClearable={true}
                          dateFormat="yyyy/MM/dd"
                          className="w-100"
                          placeholderText="Select Date"
                          locale="en-IN" // Set the locale to 'en-IN'
                        />
                      </div>
                    </div>

                    <div className="user-info-inner-1 col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Status</h6>

                      <Controller
                        control={control}
                        name="status"
                        {...register("status")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={optionsForStatus}
                              placeholder="Select Status"
                              name="status"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <button
                        type="submit"
                        onClick={() => handleSubmit(searchSubmit)}
                        className="btn btn-white"
                      >
                        <RxMagnifyingGlass />
                      </button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={resetTooltip}
                    >
                      <button
                        type="button"
                        className="btn btn-white"
                        onClick={() => resetFilter()}
                      >
                        <RxReset />
                      </button>
                    </OverlayTrigger>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonDataTable {...TemplateListProps} />
    </>
  );
}
export default Template;
