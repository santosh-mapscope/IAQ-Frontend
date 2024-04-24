import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import { PiTrashBold, PiGearBold, PiNotePencilBold, PiEyeBold } from "react-icons/pi";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";

import { useForm, Controller } from "react-hook-form";
import { InputGroup, Col, Button, Row, Form, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import Swal from "sweetalert2";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { AddClient, EditClient } from "./ClientHelper";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { ViewClient } from "./ClientHelper";

function ClientList() {

  const [CountryAll, setCountryAll] = useState("");
  const { register, handleSubmit, control, reset } = useForm();
  const [showUserModal, setShowUserModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showClientEditModal, setShowClientEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState("");
  const [showClientViewModal, setShowClientViewModal] = useState(false);
  const [clientViewData, setClientViewData] = useState("");
  const [clickedClientId, setClickedClientId] = useState('');


  const [Country, setCountry] = useState("");
  const [Provience, setProvience] = useState("");
  const [city, setcity] = useState("");
  const [ClientName, setClientName] = useState("");
  const [email, setEmail] = useState("");

  const [filterCountry, setFilterCountry] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterEmailName, setFilterEmailName] = useState("");


  const fetchClient = async (page, size = perPage) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    if (filterCountry != '')
      formData.append("countryId", filterCountry);
    if (filterProvince != '')
      formData.append("provinceId", filterProvince);
    if (filterCity != '')
      formData.append("cityId", filterCity);
    if (filterClient != '')
      formData.append("clientId", filterClient);
    if (filterEmailName != '')
      formData.append("clientEmail", filterEmailName);
    // if (ClientName !== "" && ClientName !== "Select ClientName")
    //   formData.append("ClientName", ClientName);
    // if (email !== "" && email !== "Select Email")
    //   formData.append("email", email);


    axiosInstance
      .post("client/getClientList", formData, { headers: headersForJwt })
      .then((res) => {
        setData(res.data.data.list);
        setTotalRows(res.data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
      });
  };
  const getCountry = async () => {
    let formData = new FormData();
    // if (filterCountry != '') {
    //   formData.append("countryId", filterCountry);
    // }
    if (filterProvince != '') {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != '') {
      formData.append("cityId", filterCity);
    }
    if (filterClient != '') {
      formData.append("clientId", filterClient);
    }
    if (filterEmail != '') {
      formData.append("clientEmail", filterEmail);
    }
    axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Select Country Name" },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setCountry(data1);
      })
      .catch((err) => { });
  };

  const getProvienced = async (value) => {

    let formData = new FormData();
    if (filterCountry != '') {
      formData.append("countryId", filterCountry);
    }
    // if (filterProvince != '') {
    //   formData.append("provinceId", filterProvince);
    // }
    if (filterCity != '') {
      formData.append("cityId", filterCity);
    }
    if (filterClient != '') {
      formData.append("clientId", filterClient);
    }
    if (filterEmail != '') {
      formData.append("clientEmail", filterEmail);
    }
    formData.append("provinceId", -1);
    axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Province Name" },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setProvience(data);
      })
      .catch((err) => { });
  };
  const getCity = async (value) => {
    let formData = new FormData();
    if (filterCountry != '') {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != '') {
      formData.append("provinceId", filterProvince);
    }
    // if (filterCity != '') {
    //   formData.append("cityId", filterCity);
    // }
    if (filterClient != '') {
      formData.append("clientId", filterClient);
    }
    if (filterEmail != '') {
      formData.append("clientEmail", filterEmail);
    }
    axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select City Name" },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName,
          })),
        ];
        setcity(data);
      })
      .catch((err) => { });
  };
  const getClientName = async (value) => {
    let formData = new FormData();
    if (filterCountry != '') {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != '') {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != '') {
      formData.append("cityId", filterCity);
    }
    // if (filterClient != '') {
    //   formData.append("clientId", filterClient);
    // }
    if (filterEmail != '') {
      formData.append("clientEmail", filterEmail);
    }
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Client Name" },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClientName(data);
      })
      .catch((err) => { });
  };
  const getEmail = async (value) => {
    let formData = new FormData();
    if (filterCountry != '') {
      formData.append("countryId", filterCountry);
    }
    if (filterProvince != '') {
      formData.append("provinceId", filterProvince);
    }
    if (filterCity != '') {
      formData.append("cityId", filterCity);
    }
    if (filterClient != '') {
      formData.append("clientId", filterClient);
    }
    // if (filterEmail != '') {
    //   formData.append("clientEmail", filterEmail);
    // }
    axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Email" },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientEmail,
          })),
        ];
        setEmail(data);
      })
      .catch((err) => { });
  };


  const onView = (id) => {
    const formData = new FormData();
    formData.append("clientId", id);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        setClientViewData(res.data.data.list);
        setShowClientViewModal(true);
        setClickedClientId(id);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };
  useEffect(() => {
    getAllCountry();
    fetchClient(1);
    getCountry();
    getProvienced();
    getCity();
    getClientName();
    getEmail();
  }, []);

  useEffect(() => {

    if (filterEmail !== '' && (filterProvince == '' && filterCity == '' && filterClient == '')) {
      getCountry();
      getProvienced();
      getCity();
      getClientName();

    } else if (filterClient !== '' && (filterCity == '' && filterProvince == '')) {
      getCountry();
      getProvienced();
      getCity();
      getEmail();

    } else if (filterProvince !== '' && filterCity !== '' && filterClient !== '' && filterEmail == '') {
      getEmail();

    } else if (filterCountry !== '' && filterProvince !== '' && filterCity !== '' && filterClient == '' && filterEmail == '') {
      getClientName();

    } else if (filterCountry !== '' && filterProvince !== '' && filterCity == '' && filterClient == '' && filterEmail == '') {
      getCity();
    }
    else if (filterCountry !== '' && filterProvince == '' && filterCity == '' && filterClient == '' && filterEmail == '') {
      getProvienced();
    }
    // else{
    //   getCountry();
    //   getProvienced();
    //   getCity();
    //   getClientName();
    //   getEmail();
    // }
  }, [filterCountry, filterProvince, filterCity, filterClient, filterEmail]);

  const getAllCountry = () => {
    setLoading(true);
    axiosInstance.post("client/getAllCountryDD", "", {
      headers: headersForJwt,
    })
      .then((res) => {
        if (res && res.data.status === 1) {
          setCountryAll(res.data.data.list);
          setLoading(false);
        }

        return false;
      })
      .catch((err) => {
      });
  };
  const onEdit = (clientId) => {
    const formData = new FormData();
    formData.append("clientId", clientId);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => {
        setEditUserData([]);
        setEditUserData(res.data.data.list);
        setShowClientEditModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });
  };

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        sortable: true,
        width: "10%",
        cell: (row) => (
          <>
            <p className="mg-b-0">{row.slNo}</p>
          </>
        ),
      },
      {
        name: "Client Name",
        sortable: true,
        cell: (row) => (
          <>
            <p>{row.clientName}</p>
          </>
        ),
      },
      {
        name: "Address",
        sortable: true,
        minWidth: "20%",
        cell: (row) => (
          <>
            <p className="mg-b-0">{row.address1},{row.address2}</p>
          </>
        ),
      },
      {
        name: "Email",
        selector: "clientEmail",
        sortable: true,
        minWidth: "20%",
      },
      {
        name: "Status",
        selector: "isActive",
        minWidth: "20%",
        cell: (row) => (
          <div style={{ color: row.isActive ? "#0064FF" : "#F63F3F" }}>
            {row.isActive ? "Active" : "Inactive"}
          </div>
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

              <Dropdown.Menu>
                <Dropdown.Item>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onView(row.clientId)} className="fz-2">
                  <PiEyeBold className="user-icon" /> View
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onEdit(row.clientId)} className="fz-2">
                  <PiNotePencilBold className="user-icon " />
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDelete(row.clientId, row.isActive)} className="fz-2">
                  {/* <PiTrashBold className="user-icon " /> */}
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
              </Dropdown.Menu>
            </Dropdown>
          </>
        ),
      },
    ],
    []
  );
  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text: " Do you want to " + (active ? "inactivate" : "activate") + " this record ?",
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
        formData.append("id", id);
        axiosInstance
          .post("client/activateAndDeactivateClient", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchClient(1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const handlePageChange = (page) => {
    fetchClient(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchClient(page, newPerPage);
  };

  const handleClientNameChange = (event) => {
    setClientName(event.target.value); // Update the status when the select input changes
  };
  const handleCloseUserModal = () => {
    setShowUserModal(false);
    fetchClient(1);
  };
  const handleCloseClientModalCross = () => {
    setShowUserModal(false);
    fetchClient(currentPage);
  };
  const handleCloseUserEditModal = () => {
    setShowClientEditModal(false);
    fetchClient(currentPage);
  };
  const handelCountryChange = (data) => {
    setFilterCountry(data);// Update the country when the select input changes
    setFilterProvince("");
    setFilterCity("");
    setFilterClient("");
    setFilterEmail("");
    reset({ filterProvince, filterCity, filterClient, filterEmail });
    // reset({ provienceid: "", city: "", clientname: "", email: "" });
  }
  const handelProvienceChange = (data) => {
    setFilterProvince(data);
    setFilterCity("");
    setFilterClient("");
    setFilterEmail("");
    reset({ filterCity, filterClient, filterEmail });
    // reset({ city: "", clientname: "", email: "" });
  }
  const handelCityName = (data) => {
    setFilterCity(data);
    setFilterClient("");
    setFilterEmail("");
    reset({ filterClient, filterEmail });
  }
  const handelClientName = (data) => {
    setFilterClient(data.value);
    setFilterEmail("");
    reset({ filterEmail });
    // reset({email: "" });
  }

  const handelEmailChange = (data) => {
    setFilterEmail(data.value);
    setFilterEmailName(data.label);
  }

  const addClientProps = {
    showUserModal,
    handleCloseUserModal,
    handleCloseClientModalCross,
    CountryAll
  };
  const editClientProps = {
    showClientEditModal,
    handleCloseUserEditModal,
    editUserData,
    CountryAll
  };


  const UserListProps = {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  };
  const viewClientProps = {
    clientViewData,
    showClientViewModal,
    setShowClientViewModal,
    clickedClientId
  };




  const [selectedOption, setSelectedOption] = useState(null);
  const [searchValue, setSearchValue] = useState("");





  const resetFilter = () => {
    reset({ filterCountry: "", filterProvince: "", filterCity: "", filterClient: "", filterEmail: "" })
    setFilterCountry("");
    setFilterProvince("");
    setFilterCity("");
    setFilterClient("");
    setFilterEmail("");
    setFilterEmailName("");
    resetDD();

    fetchClient(1);
  };

  const resetDD = async () => {
    await getCountry();
    await getProvienced();
    await getCity();
    await getClientName();
    await getEmail();
  };



  const searchSubmit = (data) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", 0);
    formData.append("size", perPage);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    if (filterCountry != '')
      formData.append("countryId", filterCountry);
    if (filterProvince != '')
      formData.append("provinceId", filterProvince);
    if (filterCity != '')
      formData.append("cityId", filterCity);
    if (filterClient != '')
      formData.append("clientId", filterClient);
    if (filterEmailName != '')
      formData.append("clientEmail", filterEmailName);

    // if (data.filterCountry?.value && data.filterCountry?.value > 0)
    //   formData.append("countryId", data.filterCountry?.value);
    // if (data.filterProvince?.value && data.filterProvince?.value > 0)
    //   formData.append("provinceId", data.filterProvince?.value);
    // if (data.filterCity?.value && data.filterCity?.value > 0)
    //   formData.append("cityId", data.filterCity?.value);
    // if (data.filterClient?.label && data.filterClient?.label)
    //   formData.append("clientName", data.filterClient?.label);
    // if (data.filterEmail?.label && data.filterEmail?.label)
    //   formData.append("clientEmail", data.filterEmail?.label);

 
    axiosInstance
      .post("client/getClientList", formData, { headers: headersForJwt })
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
  return (
    <>
      <Helmet title={"Dashboard | IAQ Reporting System"} />

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-4">
              <div className="col-sm-9">
                {/* <p>Hi, Welcome to User Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Clients</h5>
              </div>
              <div className="col-sm-3">
                <button
                  onClick={() => setShowUserModal(true)}
                  className="btn btn-primary fz-14 float-end">
                  Add Clients
                </button>
              </div>
              <div className="col-lg-12 pd-0">
                <Form className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >

                  <div className="user-info">
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Country</h6>
                      <Controller
                        control={control}
                        name="filterCountry"
                        {...register("filterCountry")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Country}
                              placeholder="Country Name"
                              name="filterCountry"
                              onChange={(data) => handelCountryChange(data.value)}
                            // clearButton
                            // value={Country.length === 2 ? Country[1] : field.value}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Province</h6>
                      <Controller
                        control={control}
                        name="filterProvince"
                        {...register("filterProvince")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Provience}
                              placeholder="Province Name"
                              name="filterProvince"
                              onChange={(data) => handelProvienceChange(data.value)}
                              clearButton
                            // value={Provience.length === 2 ? Provience[1] : field.value}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select City</h6>
                      <Controller
                        control={control}
                        name="filterCity"
                        {...register("filterCity")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={city}
                              placeholder="City Name"
                              name="filterCity"
                              onChange={(data) => handelCityName(data.value)}
                              clearButton
                            // value={city.length === 2 ? city[1] : field.value}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Client Name</h6>
                      <Controller
                        control={control}
                        name="filterClient"
                        {...register("filterClient")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={ClientName}
                              placeholder="Client Name"
                              name="filterClient"
                              onChange={(data) => handelClientName(data)}
                              clearButton
                            // value={ClientName.length === 2 ? ClientName[1] : field.value}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="user-info-inner col-lg-2 col-md-12 pd-0">
                      <h6 className="label-search">Select Email</h6>
                      <Controller
                        control={control}
                        name="filterEmail"
                        {...register("filterEmail")}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={email}
                              placeholder="Select Email"
                              name="filterEmail"
                              onChange={(data) => handelEmailChange(data)}
                              clearButton
                              value={email.length === 2 ? email[1] : field.value}
                              isSearchable={true}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: "100%", // Adjust the width to your desired size
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  overflowX: "hidden", // Prevent horizontal scrolling
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  overflowX: "hidden", // Enable horizontal scrollbar if needed
                                }),
                              }}
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

                    <div className="user-info-inner-1">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(event) =>
                          handlePerRowsChange(event.target.value, 1)
                        }
                      >
                        <option value={10} selected>
                          10
                        </option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                  </div>

                </Form>
              </div>
            </div>
          </div>
        </div >

        <CommonDataTable {...UserListProps} />
        <AddClient {...addClientProps} onHide={() => setShowUserModal(false)} />
        <EditClient {...editClientProps} onHide={() => setShowClientEditModal(false)} />
        {/* <AddUser {...addUserProps} onHide={() => setShowUserModal(false)} />
        <EditUser {...editUserProps} />*/}
        <ViewClient {...viewClientProps} />
      </div >
    </>
  );
}
export default ClientList;
