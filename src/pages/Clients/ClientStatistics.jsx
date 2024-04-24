import React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form";

import { Form } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { RxReset, RxMagnifyingGlass } from "react-icons/rx";
import { ClientStatisticsChart } from "../../components/Charts/Charts"
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
function ClientStatistics() {

  const [stsData, setStsData] = useState();
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const { register, handleSubmit, control, reset, getValues, setValue } = useForm();
  const [Country, setCountry] = useState([]);
  const [Province, setProvince] = useState([]);
  const [city, setcity] = useState([]);
  const [ClientName, setClientName] = useState([]);
  const [year, setYear] = useState([])
  const [Gpvalue, setGpvalue] = useState([]);
  const [Environment, setEnvironment] = useState([])

  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [clientId, setClientId] = useState("");

  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [clientNameforGraph, setClientNameforGraph] = useState();
  const [environmentForGraph, setEnvironmentForGraph] = useState();
  const submitButtonRef = useRef(null);
  const globalFilters = useRef({});


  var bgColors = {
    statistic: "#DBE9F6",
    co2: "#D0E1F0",
    co: "#C1D5E9",
    temp: "#B6CCE0",
    rh: "#A7C1D9",
    rsp: "#99B6D2",
    tvoc: "#85A4C1",
    min: "#FCEAB7",
    max: "#A2E6F4",
    sd: "#F5B6B3",
    variance: "#FFA375",
  };
  const resetFilter = () => {
    const fieldsToReset = {
      status: "",
      cityId: "",
      clientId: "",
      countryId: "",
      provinceId: "",
      groupId: "",
      envId: "",
      yearid: "",

      filterClient: "",
      filteryear: "",
      filterCity: "",
      filterCountry: "",
      filterProvince: "",
      groupBy: "",
      environment: "",
      // Add other fields you want to reset here

    };
    setCountry([]);
    setProvince([]);
    setcity([]);
    setYear([]);
    reset(fieldsToReset);
    setStsData([]);
    globalFilters.current = { ...fieldsToReset };
  };

  const getCountry = async () => {
    let formData = new FormData();
    if (globalFilters.current && globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }

    await axiosInstance
      .post("client/getAllCountryDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data1 = [
          { value: "", label: "Country Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.countryId.toString(), // Convert id to string, if needed
            label: item.countryName,
          })),
        ];
        setCountry(data1);
        // console.log(data1);
      })
      .catch((err) => { });
  };
  const getProvienced = async (value) => {
    let formData = new FormData();
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    await axiosInstance
      .post("client/getAllProvinceDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Province Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.provinceId.toString(), // Convert id to string, if needed
            label: item.provinceName,
          })),
        ];
        setProvince(data);
      })
      .catch((err) => { });
  };
  const getCity = async (value) => {
    let formData = new FormData();
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    await axiosInstance
      .post("client/getAllCityDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "City Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.cityId.toString(), // Convert id to string, if needed
            label: item.cityName,
          })),
        ];
        setcity(data);
      })
      .catch((err) => { });
  };
  const getYear = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", globalFilters.current?.clientId ?? "");
    await axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        setYear(data);
      })
      .catch((err) => { });
  };
  const getClientName = async (value) => {
    let formData = new FormData();
    await axiosInstance
      .post("client/getAllClientDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Client Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.clientId.toString(), // Convert id to string, if needed
            label: item.clientName,
          })),
        ];
        setClientName(data);
      })
      .catch((err) => { });
  };

  // ********************************

  const handelCountryChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      countryId: data.target.value.value
    };

    getProvienced()
  };
  const handelProvienceChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      provinceId: data.target.value.value
    };
    getCity(data.target.value.value);
  };
  const handelCityName = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      cityId: data.target.value.value
    };
    getYear();
    setClientId("");
  };
  const handelGroupBy = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      groupId: data.target.value.value,
    };
  }
  const handelEnvironment = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      envId: data.target.value.value,

    };
    setEnvironmentForGraph(data.target.value.label)
  }
  const handelYearChange = (data) => {
    globalFilters.current = {
      ...globalFilters.current,
      yearid: data.target.value.value,
    };
  }
  const handelClientName = (data) => {

    globalFilters.current = {
      ...globalFilters.current,
      clientId: data.target.value.value,
    };
    setValue("filterCountry", "");
    setValue("filterProvince", "");
    setValue("filterCity", "");
    setValue("filterBuilding", "");
    setValue("groupBy", "");
    setValue("environment", "");
    setValue("filteryear", "");
    getCountry();
    getYear();
    // setClientId(Number(data.target.value.value));
    setClientNameforGraph(data.target.value.label)
  };
  // ********************

  useEffect(() => {
    // getCountry();
    // getProvienced();
    // getCity();
    getClientName();
    // getYear();
    // searchSubmit()

  }, []);


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


  const searchSubmit = (data) => {
    setLoading(true);
    let formData = new FormData();

    if (globalFilters.current.clientId) {
      formData.append("clientId", globalFilters.current.clientId);
    }
    if (globalFilters.current.groupId) {
      formData.append("flag", globalFilters.current.groupId);
    }
    if (globalFilters.current.envId) {
      formData.append("environment", globalFilters.current.envId);
    }
    if (globalFilters.current.yearid) {
      formData.append("year", globalFilters.current.yearid);
    }

    axiosInstance
      .post("client/getAllClientStatisticsList", formData, {
        headers: headersForJwt,
      })

      .then((res) => {

        // console.log("resulet is", res.data.data.list);
        setStsData(res.data.data.list);

        setLoading(false);
      })
      .catch((err) => {
        // setStsData("#NA");
        setLoading(false);
      });
  };

  const ClientStatisticsProps = {
    stsData
  };

  return (
    <>
      <Helmet title={"Client Statistics | IAQ Reporting System"} />
      <div className="content-wrapper ">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-3 pd-l-0">
                <h5 className="m-0">Client Statistics</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 pd-0" >
          <Form
            className="mt-4 mb-4"
            onSubmit={handleSubmit(searchSubmit)}
          >
            <div className="user-info-90 row">

              {/* client */}
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
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              {/* country */}
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
                      />
                    </>
                  )}
                />
              </div>
              {/* province */}
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
                        options={Province}
                        placeholder="Province"
                        name="filterProvince"
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              {/* city */}
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
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              {/* groupBy */}
              <div className="col-sm-3 col-12 mt-4">
                <h6 className="label-search">Group By</h6>
                <Controller
                  control={control}
                  name="groupBy"
                  {...register("groupBy", {
                    onChange: (data) => handelGroupBy(data),
                  })}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        size="sm"
                        options={[
                          { value: 0, label: 'Select.', isDisabled: true },
                          { value: 'city', label: 'City' },
                          { value: 'province', label: 'Province' },
                        ]}
                        placeholder="Group By"
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              {/* environment */}
              <div className="col-sm-3 col-12 mt-4">
                <h6 className="label-search">Environment</h6>
                <Controller
                  control={control}
                  name="environment"
                  {...register("environment", {
                    onChange: (data) => handelEnvironment(data),
                  })}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        size="sm"
                        options={[
                          { value: 0, label: 'Select.', isDisabled: true },
                          { value: 'true', label: 'Indoor' },
                          { value: 'false', label: 'Outdoor' },
                        ]}
                        placeholder="Environment"
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              {/* year */}
              <div className="col-sm-3 col-12 mt-4">
                <h6 className="label-search">Year</h6>
                <Controller
                  control={control}
                  name="filteryear"
                  {...register("filteryear", {
                    onChange: (data) => handelYearChange(data),
                  })}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        size="sm"
                        options={year}
                        placeholder="Year"
                        clearButton
                      />
                    </>
                  )}
                />
              </div>
              <div className="col-sm-3 col-12 mt-4">  
              <h6 className="label-search">Serach / Reset</h6>
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
                  className="btn btn-white ms-2"
                  onClick={() => resetFilter()}
                >
                  <RxReset />
                </button>
              </OverlayTrigger>
              </div>    
            </div>
          </Form>
        </div>
        {/* table list client statistics */}
        {stsData ? (Object.entries(stsData).map(([key, values]) => (
          <section className="mt-4">
            <div className="Client-Statistical-Data-one">
              {values && Object.entries(values).map(([key1, values1]) => (
                <div className="col-lg-12 pd-0">
                  <div className="st-container-box mt-4 mb-1">
                    <Col xs={4}>
                      <h6 style={{ color: "blue" }}>Client Name :
                        <span className="sp-st">
                          {/* {globalFilters.current.ClientName} */}
                          {clientNameforGraph}
                        </span>
                      </h6>
                    </Col>
                    <Col xs={4}>
                      <h6 style={{ color: "blue" }}>City :
                        <span className="sp-st">
                          {key1}
                        </span>
                      </h6>
                    </Col>
                    <Col xs={2}>
                      <h6 style={{ color: "blue" }}>Gpvalue :
                        <span className="sp-st">
                          {globalFilters.current.groupId}
                        </span>
                      </h6>
                    </Col>
                    <Col xs={2}>
                      <h6 style={{ color: "blue" }}>Environment :
                        <span className="sp-st">
                          {environmentForGraph}
                        </span>
                      </h6>
                    </Col>
                  </div>

                  <Table striped className="stastic-table">
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: bgColors.statistic }}>
                          Statistic
                        </th>
                        <th style={{ backgroundColor: bgColors.min }}>Min</th>
                        <th style={{ backgroundColor: bgColors.max }}>Max</th>
                        {/* <th style={{ backgroundColor: bgColors.sd }}>
                          Standard Deviation
                        </th>
                        <th style={{ backgroundColor: bgColors.variance }}>
                          Variance
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>

                      {values1 && Object.entries(values1).map(([key2, values2]) => (
                        // console.log(values1),
                        <tr key={key2}>
                          <th scope="row" style={{ backgroundColor: bgColors.co2 }}>
                          <div dangerouslySetInnerHTML={{ __html: key2 }} />
                          </th>
                          {values2 && Object.entries(values2).map(([key3, values3]) => (
                            <td>{values3}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>

                  </Table>
                </div>
              ))}
            </div>
          </section>
        )))
          : (

            <div className="default-table-design">
              <Table striped className="stastic-table">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: bgColors.statistic }}>Statistics</th>
                    <th style={{ backgroundColor: bgColors.min }}>Min</th>
                    <th style={{ backgroundColor: bgColors.max }}>Max</th>
                    {/* <th style={{ backgroundColor: bgColors.sd }}>Standard Deviation</th>
                    <th style={{ backgroundColor: bgColors.variance }}>Variance</th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5">N/A</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        {/* <ClientStatisticsChart {...ClientStatisticsProps} /> */}
      </div>


    </>
  );
}
export default ClientStatistics;
