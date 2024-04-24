import React, { useState, useEffect, useMemo, useRef } from "react";

import { Helmet } from "react-helmet";
import {
  PiTrashBold,
  PiGearBold,
  PiNotePencilBold,
  PiEyeBold,

} from "react-icons/pi";
import { AiOutlinePoweroff, AiOutlineLock } from "react-icons/ai";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { LiaUserSlashSolid, LiaUserSolid } from "react-icons/lia";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import { userAtom } from "../../Atom/CommonAtom";
import { useForm, Controller } from "react-hook-form";
import { InputGroup, Col, Button, Row, Form, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import Swal from "sweetalert2";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import { CommonDataTable } from "../../components/CommonDataTable/CommonDataTable";
import { AddClientRepresentative } from "./ClientRepresentativeHelper";
import { useRecoilState } from "recoil";
import { EditClientRepresentative } from "./ClientRepresentativeHelper";
import CircularLoader from "../../util/SuspenseFallback/circularLoader";


import { OverlayTrigger, Tooltip } from "react-bootstrap";

function ClientRepresentative(props) {
  const submitButtonRef = useRef(null);
  const [isFullPageLoading, setFullPageLoading] = useState(false); // State for
  const [userData, setUserData] = useRecoilState(userAtom);
  const { clickedClientId, viewType, clickedBuildingId } = props;
  const { register, handleSubmit, control, reset, setValue } = useForm();
  const [showUserModal, setShowUserModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const globalFilters = useRef({});
  const globalPage = useRef(1);
  const globalPerPage = useRef(perPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [CountryAll, setCountryAll] = useState("");
  const [showClientEditModal, setShowClientEditModal] = useState(false);
  const [editRepData, setEditRepData] = useState("");

  const [Country, setCountry] = useState([]);
  const [Provience, setProvience] = useState([]);
  const [city, setcity] = useState([]);
  const [ClientName, setClientName] = useState([]);
  const [ClientRepresentativeName, setClientRepresentativeName] = useState([]);
  const [email, setEmail] = useState([]);

  // SP
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [clientId, setClientId] = useState("");
  const [representativeId, setRepresentativeId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [buildingId, setBuildingId] = useState([]);


  const searchSubmit = (data) => {
    setLoading(true);
    const filters = {};

    // Update filters based on form data
    if (data.filterCountry && data.filterCountry.value !== "") {
      filters.countryId = data.filterCountry.value;
    }

    if (data.filterProvince && data.filterProvince.value !== "") {
      filters.provinceId = data.filterProvince.value;
    }

    if (data.filterCity && data.filterCity.value !== "") {
      filters.cityId = data.filterCity.value;
    }

    if (data.filterClient && data.filterClient.value !== "") {
      filters.clientId = data.filterClient.value;
    }
    if (data.filterRepresentative && data.filterRepresentative.value !== "") {
      filters.clientRepId = data.filterRepresentative.value;
    }

    if (data.filterEmail && data.filterEmail.label !== "") {
      filters.email = data.filterEmail.label;
    }
    if (data.status && data?.status?.value !== "") {
      filters.status = data.status.value;
    }

    // Update global filters with the collected filters
    globalFilters.current = filters;

    // Reset page to 1 and fetch data
    globalPage.current = 1;
    // globalPerPage.current = 10;
    setCurrentPage(1);
    fetchClientRep(1);
  };

  // const fetchClientRep = async (page = globalPage.current, size = globalPerPage.current) => {
  //   setLoading(true);
  //   let formData = new FormData();
  //   formData.append("page", page - 1);
  //   formData.append("size", size);
  //   formData.append("sortBy", "id");
  //   formData.append("sortOrder", "DESC");

  //   if (clickedClientId) {
  //     formData.append("clientId", clickedClientId);
  //   }
  //   if (clickedBuildingId) {
  //     formData.append("buildingId", clickedBuildingId);
  //   }
  //   if (globalFilters.current.clientId) {
  //     formData.append("clientId", globalFilters.current.clientId);
  //   }
  //   if (globalFilters.current.clientRepId) {
  //     formData.append("clientRepId", globalFilters.current.clientRepId);
  //   }
  //   if (globalFilters.current.email) {
  //     formData.append("email", globalFilters.current.email);
  //   }
  //   if (globalFilters.current.cityId) {
  //     formData.append("cityId", globalFilters.current.cityId);
  //   }
  //   if (globalFilters.current.provinceId) {
  //     formData.append("provinceId", globalFilters.current.provinceId);
  //   }
  //   if (globalFilters.current.countryId) {
  //     formData.append("countryId", globalFilters.current.countryId);
  //   }
  //   if (globalFilters.current.status != null) {
  //     formData.append("status", globalFilters.current.status);
  //   }

  //   try {
  //     const res = await axiosInstance.post("clientRep/getAllClientRepList", formData, {
  //       headers: headersForJwt,
  //     });
  //     setData(res.data.data.list);
  //     setTotalRows(res.data.data.totalItems);
  //     setLoading(false);
  //   } catch (err) {
  //     setLoading(false);
  //     console.error("Error fetching Representative list:", err);
  //   }
  // };

  const fetchClientRep = async (page = globalPage.current, size = globalPerPage.current) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("page", page - 1);
    formData.append("size", size);
    formData.append("sortBy", "id");
    formData.append("sortOrder", "DESC");

    // Check if both clientRepId and email exist
    const { clientRepId, email } = globalFilters.current;
    if (clientRepId) {
      formData.append("clientRepId", clientRepId);
      if (email) {
        formData.append("email", email);
      }
    } else {
      // Append other filters if clientRepId doesn't exist
      if (clickedClientId) {
        formData.append("clientId", clickedClientId);
      }
      if (clickedBuildingId) {
        formData.append("buildingId", clickedBuildingId);
      }
      if (globalFilters.current.clientId) {
        formData.append("clientId", globalFilters.current.clientId);
      }
      if (globalFilters.current.email) {
        formData.append("email", globalFilters.current.email);
      }
      if (globalFilters.current.cityId) {
        formData.append("cityId", globalFilters.current.cityId);
      }
      if (globalFilters.current.provinceId) {
        formData.append("provinceId", globalFilters.current.provinceId);
      }
      if (globalFilters.current.countryId) {
        formData.append("countryId", globalFilters.current.countryId);
      }
      if (globalFilters.current.status != null) {
        formData.append("status", globalFilters.current.status);
      }
    }

    try {
      const res = await axiosInstance.post("clientRep/getAllClientRepList", formData, {
        headers: headersForJwt,
      });
      setData(res.data.data.list);
      setTotalRows(res.data.data.totalItems);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching Representative list:", err);
    }
  };

  const resetFilter = () => {
    const fieldsToReset = {
      countryId: "",
      provinceId: "",
      cityId: "",
      clientId: "",
      clientRepId: "",
      email: "",
      status: "",
      filterCountry: "",
      filterProvince: "",
      filterCity: "",
      filterClient: "",
      filterRepresentative: "",
      filterEmail: "",
      status: ""
      // Add other fields you want to reset here
    }
    setCountry([]);
    setProvience([]);
    setcity([]);
    setClientRepresentativeName([]);
    setEmail([]);
    reset(fieldsToReset);

    globalFilters.current = { ...fieldsToReset };
    getRepresentativeName();
    fetchClientRep(1);
  };


  const getCountry = async () => {
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    if (globalFilters.current && globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    await axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Country name", isDisabled: true },
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
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }

    // formData.append("countryId", globalFilters.current?.countryId ?? "");
    formData.append("clientId", globalFilters.current?.clientId ?? "");

    await axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Province name", isDisabled: true },
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
    if (value !== null) {
      formData.append("provinceId", value);
    }
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    // formData.append("countryId", globalFilters.current?.countryId ?? "");
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    // formData.append("provinceId", globalFilters.current?.provinceId ?? "");

    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "City name", isDisabled: true },
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
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }
    await axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Client name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClientName(data);
      })
      .catch((err) => { });
  };
  const getRepresentativeName = async (value) => {
    let formData = new FormData();

    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }

    formData.append("clientId", globalFilters.current?.clientId ?? "");

    axiosInstance
      .post("clientRep/getAllClientRepNameDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        const data = [
          { value: "", label: "Representative name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientRepId.toString(),
            label: item.clientRepName,
          })),
        ];
        setClientRepresentativeName(data);
      })
      .catch((err) => { });
  };
  const getEmail = async (value) => {
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }

    formData.append("clientRepId", globalFilters.current?.clientRepId ?? "");
    await axiosInstance
      .post("clientRep/getAllClientRepNameDD", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        const data = [
          { value: "0", label: " email", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.email,
          })),
        ];
        setEmail(data);
      })
      .catch((err) => { });
  };
  const getCountryAll = async () => {
    let formData = new FormData();
    if (clickedBuildingId) {
      formData.append("buildingId", clickedBuildingId);
    }
    if (clickedClientId) {
      formData.append("clientId", clickedClientId);
    }

    setLoading(true);
    axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
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
  const onView = (id) => {
    const formData = new FormData();
    formData.append("clientId", id);
    axiosInstance
      .post("client/getClientById", formData, { headers: headersForJwt })
      .then((res) => { })
      .catch((err) => {
        // setLoading(true);
      });
  };


  const onDelete = (id, active) => {
    Swal.fire({
      title: "Please confirm",
      text:
        "Do you want to " + (active ? "inactivate" : "activate") + " this record?",
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
        formData.append("clientRepId", id);
        axiosInstance
          .post("clientRep/activeAndDeactiveStatus", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            fetchClientRep(1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const ChangePassword = (id) => {
    Swal.fire({
      title: "Please confirm",
      text:
        "Do you want to reset password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const formData = new FormData();
        let userid = JSON.parse(localStorage.getItem("user"));
        formData.append("clientRepId", id);
        formData.append("userId", userid.userDetails.userId);
        axiosInstance
          .post("users/resetToDefaultPassword", formData, {
            headers: headersForJwt,
          })
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: "Password reset successfully",
              showConfirmButton: false,
              timer: 2000
            });
            fetchClientRep(1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };



  const handleCloseUserEditModal = () => {
    setShowClientEditModal(false);
    fetchClientRep(currentPage);
  };

  const editClientProps = {
    buildingId,
    showClientEditModal,
    handleCloseUserEditModal,
    editRepData,
    CountryAll,
    setFullPageLoading
  };

  useEffect(() => {
    fetchClientRep(1);
    getClientName();
    getRepresentativeName();
    getCountryAll();
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        sortable: true,
        width: "10%",
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
        name: "Representative Name",
        selector: "clientRepName",
        sortable: true,
        width: "20%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top-${row.clientRepName}`}>
                {row.lastName ? `${row.clientRepName} ${row.lastName}` : row.clientRepName}
              </Tooltip>
            }
          >
            <span className="mg-b-0">
              {row.lastName ? `${row.clientRepName} ${row.lastName}` : row.clientRepName}
            </span>
          </OverlayTrigger>
        ),
      },

      {
        name: "Client Name",
        selector: "clientName",
        sortable: true,
        minWidth: "10%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.clientName}`}>{row.clientName}</Tooltip>}
          >
            <span className="mg-b-0">{row.clientName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Username",
        selector: "userName",
        minWidth: "10%",
        sortable: true,
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top-${row.userName}`}>{row.userName}</Tooltip>}
          >
            <span className="mg-b-0">{row.userName}</span>
          </OverlayTrigger>
        ),
      },
      {
        name: "Address",
        selector: "address1",
        sortable: true,
        minWidth: "15%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-address-${row.id}`}>{getFullAddress(row)}</Tooltip>}
          >
            <span className="mg-b-0">{getShortenedAddress(row)}</span>
          </OverlayTrigger>
        ),
      },

      {
        name: "Status",
        selector: "status",
        minWidth: "10%",
        cell: (row) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-status-${row.id}`}>{getStatusText(row)}</Tooltip>}
          >
            <div style={{ color: row.status ? "#0064FF" : "#F63F3F" }}>
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
                <Dropdown.Item></Dropdown.Item>
                {/* <Dropdown.Item
                  onClick={() => onView(row.clientId)}
                  className="fz-2"
                >
                  <PiEyeBold className="user-icon" /> View
                </Dropdown.Item> */}
                {row.status && userData.userDetails.roleId !== 8 ? (

                  row.status ? (
                    userData.access.isEdit ? (
                      <Dropdown.Item className="fz-2" onClick={() => onEdit(row.clientRepId)}>
                        <PiNotePencilBold className="user-icon" />
                        Edit
                      </Dropdown.Item>
                    ) : ""
                  ) : null

                ) : null}
                {userData.access.isDelete ? (
                  <Dropdown.Item
                    onClick={() => onDelete(row.clientRepId, row.status)}
                    className="fz-2"
                  >
                    {/* <PiTrashBold className="user-icon " /> */}
                    {row.status ? (
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
                ) : ""}
                {userData.userDetails.roleId === 1 || userData.userDetails.roleId === 2 ? (
                  <Dropdown.Item onClick={() => ChangePassword(row.clientRepId)} className="fz-2">
                    <div>
                      <AiOutlineLock />&nbsp;{/* Non-breaking space */}
                      Reset Password
                    </div>
                  </Dropdown.Item>
                ) : null}


              </Dropdown.Menu>
            </Dropdown>
          </>
        ),
      },
    ],
    []
  );
  // Function to get the full address
  const getFullAddress = (row) => {
    if (row.address1 || row.address2) {
      return `${row.address1 || ""} ${row.address2 || ""}`;
    } else {
      return " ";
    }
  };
  // Function to get a shortened version of the address for display
  const getShortenedAddress = (row) => {
    if (row.address1 || row.address2) {
      return `${row.address1 || row.address2}`;
    } else {
      return " ";
    }
  };
  const getStatusText = (row) => {
    return row.status ? "Active" : "Inactive";
  };
  const handlePageChange = async (page) => {
    globalPage.current = page;
    setCurrentPage(page);
    fetchClientRep(page);
    // submitButtonRef.current.click();

  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    globalPage.current = page;
    globalPerPage.current = newPerPage;
    fetchClientRep(page, newPerPage);
    // submitButtonRef.current.click();
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    fetchClientRep(currentPage);
  };
  const handleCloseClientModalCross = () => {
    setShowUserModal(false);
    fetchClientRep(currentPage);
  };
  // const handleCloseUserEditModal = () => {
  //   setShowClientEditModal(false);
  //   fetchClientRep(currentPage);
  // };

  const onEdit = (clientId) => {
    setShowClientEditModal(true);

    const formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("clientRepId", clientId);
    formData.append("userId", userid.userDetails.userId);
    axiosInstance
      .post("clientRep/viewClientRepresenttative", formData, { headers: headersForJwt })
      .then((res) => {
        setEditRepData([]);
        setEditRepData(res.data.data.list);
        GetBuildingId(res.data.data.list.buildingDetails);
        setShowClientEditModal(true);
      })
      .catch((err) => {
        // setLoading(true);
      });

  };
  const GetBuildingId = (data) => {
    setBuildingId([]);
    const data1 = [
      ...data.map((item) => ({
        value: item.buildingId.toString(), // Convert id to string, if needed
        label: item.buildingName,
      })),
    ];
    setBuildingId(data);
  }
  const handelClientName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };

    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterRepresentative", "");
    setValue("filterEmail", "");
    getCountry();
    getRepresentativeName();

  };
  const handelCountryChange = (data) => {
    //  setCountryId(data.target.value.value);

    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.target.value.value
    };
    // reset({
    //   filterProvince: "",
    //   filterCity: "",
    //   filterRepresentative: "",
    //   filterEmail: ""
    //   // Add other fields you want to reset here
    // });

    getProvienced(countryId)
  };
  const handelProvienceChange = (data) => {
    // setProvinceId(data.target.value.value);
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.target.value.value
    };
    // reset({
    //   filterCity: "",
    //   filterRepresentative: "",
    //   filterEmail: ""
    //   // Add other fields you want to reset here
    // });
    getCity(data.target.value.value);
  };
  const handelCityName = (data) => {
    // setCityId(data.target.value.value);
    // setClientId("");
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    // reset({
    //   filterRepresentative: "",
    //   filterEmail: ""
    //   // Add other fields you want to reset here
    // });
    getRepresentativeName();
  };
  const handelRepresentativeName = (data) => {
    // setRepresentativeId(data.target.value.value);
    globalFilters.current = {
      ...globalFilters.current,
      clientRepId: data.target.value.value
    };
    // reset({
    //   filterEmail: ""
    //   // Add other fields you want to reset here
    // });
    setValue("filterEmail", "");
    getEmail();
  };
  const handelEmailChange = (data) => {
    // setRepresentativeId(data.target.value.value);
    globalFilters.current = {
      ...globalFilters.current,
      email: data.target.value.value
    };
  };

  const UserListProps = {
    data,
    columns,
    loading,
    totalRows,
    "currentPage": globalPage.current,
    handlePerRowsChange,
    handlePageChange,
  };


  const addClientRepresentativeProps = {
    showUserModal,
    handleCloseUserModal,
    CountryAll,
    setFullPageLoading
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
    { value: '', label: 'Select Status', isDisabled: true },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];


  return (
    <>
      <Helmet title={"Client Representative | IAQ Reporting System"} />
      {isFullPageLoading && <CircularLoader />}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-9 pd-l-0">
                {/* <p>Hi, Welcome to User Panel</p> */}
                <h5 className="m-0 mt-3 mb-2">Client Representative</h5>
              </div>

              {userData.access.isAdd ? (
                <div className="col-sm-3 pd-r-0">
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="btn btn-primary fz-14 float-end"
                  >
                    Add Client Representative
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="col-lg-12 pd-0">
                <Form
                  className="mt-4 mb-4"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <div className="user-info-90 row">
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Client Name</h6>
                      <Controller
                        control={control}
                        name="filterClient"
                        {...register("filterClient", {
                          onChange: (data) => handelClientName(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={ClientName}
                              placeholder="Client Name"
                              name="filterClient"
                              // value={selectedClient}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Country</h6>
                      <Controller
                        control={control}
                        name="filterCountry"
                        {...register("filterCountry", {
                          onChange: (data) => handelCountryChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Country}
                              placeholder="Country"
                              name="filterCountry"
                            // components={{
                            //   IndicatorSeparator: () => null, // Hide the indicator separator for a cleaner UI
                            // }}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select Province</h6>
                      <Controller
                        control={control}
                        name="filterProvince"
                        {...register("filterProvince", {
                          onChange: (data) => handelProvienceChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={Provience}
                              placeholder="Province"
                              name="filterProvince"
                              // value={selectedProvince}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <div className="col-sm-3 col-12">
                      <h6 className="label-search">Select City</h6>
                      <Controller
                        control={control}
                        name="filterCity"
                        {...register("filterCity", {
                          onChange: (data) => handelCityName(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={city}
                              placeholder="City"
                              name="filterCity"
                              // value={selectedCity}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <div className="col-sm-3 col-12  mt-4">
                      <h6 className="label-search">
                        Select Representative Name
                      </h6>

                      <Controller
                        control={control}
                        name="filterRepresentative"
                        {...register("filterRepresentative", {
                          onChange: (data) => handelRepresentativeName(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={ClientRepresentativeName}
                              placeholder="Representative"
                              name="filterRepresentative"
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>

                    <div className="col-sm-3 col-12  mt-4">
                      <h6 className="label-search">Select Email</h6>
                      <Controller
                        control={control}
                        name="filterEmail"
                        {...register("filterEmail", {
                          onChange: (data) => handelEmailChange(data),
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={email}
                              placeholder="Email"
                              name="filterEmail"
                              // value={selectedEmail}

                              clearButton
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

                    <div className="col-sm-3 col-12  mt-4">
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
                    <div className="col-sm-3 col-12  mt-4">
                      <h6 className="label-search">Search/Reset</h6>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <button
                          type="submit"
                          ref={submitButtonRef}
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
                          className="btn btn-white ms-2"
                          onClick={() => resetFilter()}
                        >
                          <RxReset />
                        </button>
                      </OverlayTrigger>
                    </div>
                    {/* <div className="user-info-inner-1">
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
                    </div> */}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <CommonDataTable {...UserListProps} />
        <AddClientRepresentative
          {...addClientRepresentativeProps}
          onHide={() => setShowUserModal(false)}
        />
        <EditClientRepresentative
          {...editClientProps}
          onHide={() => setShowClientEditModal(false)}
        />
      </div>
    </>
  );
}
export default ClientRepresentative;
