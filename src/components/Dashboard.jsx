
/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  PiUserCircleGearThin,
  PiBuildingsThin,
  PiSuitcaseThin,
  PiStairsThin,
  PiNotebookThin,
} from "react-icons/pi";

import Charts, { HighChartPieChart, HighChartAreaChart, ClientStatisticsChart, HighChartStackChart } from "./Charts/Charts";
import { axiosInstance, headersForJwt } from "../util/axiosConfig";
import { userAtom } from "../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { Col, Button, Row, Form, Modal, Card } from "react-bootstrap";
// import { HighChartPieChart, HighChartAreaChart } from "../components/Charts/Charts";
import { useForm, Controller } from "react-hook-form";
import { Chart } from "highcharts";
import Select from 'react-select';
import toast, { Toaster } from "react-hot-toast";
import { ErrorToastWithToastId } from "../util/customToast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { MyChangePassword } from "../layouts/ChangaPassword";


function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [DashboardCounts, setDashboardCounts] = useState([]);


  const [jobPie, setJobPie] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [YearForBar, setYearForBar] = useState([]);
  const [client, setClient] = useState([]);
  const [buildingDD, setBuildingDD] = useState([]);
  const [buildingDDBuilding, setBuildingDDBuilding] = useState([]);
  const [buildingDDCity, setBuildingDDCity] = useState([]);
  const [ReportDD, setReportDD] = useState("");
  const [ParameterForBar, setParameterForBar] = useState("");
  const [param, setParam] = useState("");
  const [dataForArea, setDataForArea] = useState("");
  const { register, handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [yearForSurvey, SetYearForSurvey] = useState([]);
  const [yearForBuilding, SetYearForBuilding] = useState([]);
  const [yearForCity, SetYearForCity] = useState([]);
  const [yearForClientStatistics, SetYearForClientStatistics] = useState([]);
  // ----------------------------------------------------
  const [selectedClientForBar, setSelectedClientForBar] = useState([]);
  const [selectedBuildingsBar, setSelectedBuildingsBar] = useState([]);
  const [selectedGroupByBar, setselectedGroupByBar] = useState([]);
  const [selectedYearForBar, setSelectedYearForBar] = useState([]);
  const [selectedEnvironmentBar, setSelectedEnvironmentBar] = useState([]);
  const [selectedParameterBar, setSelectedParameterBar] = useState([]);
  // -------------------------------------------------------------
  const [selectedClientForBuilding, setSelectedClientForBuilding] = useState([]);
  // const [selectedBuildingsBuilding, setSelectedBuildingsBuilding] = useState(['122', '123']);
  const [selectedBuildingsBuilding, setSelectedBuildingsBuilding] = useState([[]]);
  const [selectedGroupByBuilding, setselectedGroupByBuilding] = useState([]);
  const [selectedYearForBuilding, setSelectedYearForBuilding] = useState([]);
  const [selectedEnvironmentBuilding, setSelectedEnvironmentBuilding] = useState([]);
  const [selectedParameterBuilding, setSelectedParameterBuilding] = useState([]);
  const [buldingList, setBuldingList] = useState([""]);
  const [dataForBuilding, setDataForBuilding] = useState("");
  const [paramForBuilding, setParamForBuilding] = useState("");
  // ----------------------------------------------------
  const [selectedParameterColumn, setSelectedParameterColumn] = useState();
  const [selectedEnvironmentColumn, setSelectedEnvironmentColumn] = useState();
  const [selectedBuildingsColumn, setSelectedBuildingsColumn] = useState();
  const [selectedGroupByColumn, setselectedGroupByColumn] = useState("");
  const [selectedYearForColumn, setSelectedYearForColumn] = useState();
  const [selectedClientForColumn, setSelectedClientForColumn] = useState();
  // -------------------------------------------------
  const [isYearVisible, setIsYearVisible] = useState(true);
  const [isYearVisibleBuilding, setIsYearVisibleBuilding] = useState(true);
  const [isYearVisibleCity, setIsYearVisibleCity] = useState(true);
  const [dataForAreaColumn, setDataForAreaColumn] = useState("");
  const [dataForAreaColumnStack, setdataForAreaColumnStack] = useState("");
  const [xAxisCategoriesArea, setXAxisCategoriesArea] = useState("");
  const [xAxisCategoriesAreaColumn, setXAxisCategoriesAreaColumn] = useState("");
  const [xAxisCategoriesAreaColumnStack, setXAxisCategoriesAreaColumnStack] = useState("")
  const [xAxisCategoriesAreaTitle, setXAxisCategoriesAreaTitle] = useState("");
  const [xAxisCategoriesAreaColumnTitle, setXAxisCategoriesAreaColumnTitle] = useState("");
  const [xAxisCategoriesAreaColumnStackTitle, setXAxisCategoriesAreaColumnStackTitle] = useState("")
  const [xAxisTitle, setxAxisTitle] = useState("");
  //
  const [paramColumn, setParamColumn] = useState("");


  const [selectedEnvironmentClient, setSelectedEnvironmentClient] = useState("");
  const [selectedYearForClient, setSelectedYearForClient] = useState("");
  const [selectedClientForClient, setSelectedClientForClient] = useState("");
  const [selectedGroupByForClient, setSelectedGroupBytForClient] = useState("");
  // const [dataForAreaClient, setDataForAreaColumn] = useState("");
  // const [xAxisCategoriesAreaColumn, setXAxisCategoriesAreaColumn] = useState("");
  // const [paramColumn, setParamColumn] = useState("");
  const [userData, setUserName] = useRecoilState(userAtom);
  const [countryForStatistics, setCountryForStatistics] = useState('');
  const [provinceForStatistics, setProvinceForStatistics] = useState('');
  const [cityForStatistics, setCityForStatistics] = useState('');
  const [clientIdForStatistics, setClientIdForStatistics] = useState('');
  const [groupByForStatistics, setGroupByForStatistics] = useState('');
  const [environmentForStatistics, setEnvironmentForStatistics] = useState('');
  const [yearForStatistics, setYearForStatistics] = useState('');

  const [templateidforMonth, setTemplateidforMonth] = useState('');
  const [clinetidforMonth, setClinetidforMonth] = useState('');
  const [yearforMonth, setYearforMonth] = useState('');
  const [columnLoader, setColumnLoader] = useState(true);
  const [surveyStaticsLoader, setSurveyStaticsLoader] = useState(true);
  const [buildingLoader, setBuildingLoader] = useState(false)

  const [RoleId, setRoleId] = useState("");
  const [clientNameforStaticks, setClientNameforStaticks] = useState("Canderel");



  // year DD
  const getBuildingCompGraphYearDD = async () => {
    await axiosInstance
      .post("client/getBuildingCompGraphYearDD", [], {
        headers: headersForJwt,
      })
      .then((res) => {
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.yearDD.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        setYearForBar(data);

      })
  };
  // Parameter DD
  // const getBuildingCompGraphParamDD = async () => {
  //   await axiosInstance
  //     .post("client/getBuildingCompGraphParamDD", [], {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //       console.log(res.data.data);
  //       const data = [
  //         { value: "", label: "Select Parameter", isDisabled: true },
  //         ...res.data.data.paramDD.map((item) => ({
  //           value: item.columnName.toString(), // Convert id to string, if needed
  //           label: item.htmlDisplayName,
  //         })),
  //       ];
  //       setParameterForBar(data);

  //     })
  // };
  const getBuildingCompGraphParamDD = async () => {
    await axiosInstance
      .post("client/getBuildingCompGraphParamDD", [], {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res.data.data);
        const data = [
          { value: "", label: "Select Parameter", isDisabled: true },
          ...res.data.data.paramDD.map((item) => {
            // Extract text content and original HTML string
            const value = item.htmlDisplayName.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
            // const value = item.htmlDisplayName.replace(/<[^>]+>/g, '').replace(/\(|\)/g, ''); // Remove HTML tags and parentheses

            return {
              value: item.columnName.toString(), // Convert id to string, if needed
              label: value.trim(), // Trim leading and trailing whitespace
              html: item.htmlDisplayName // Retain original HTML string
            };
          }),
        ];
        setParameterForBar(data);
      });
  };

  const getAllClientDD = async () => {
    axiosInstance
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
  const getReportDD = async () => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    axiosInstance
      .post("template/getTemplateNameDD", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log("----<", res);
        const data = [
          { value: "", label: "Select Template", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.templateName,
          })),
        ];
        setReportDD(data);
      })
      .catch((err) => { });
  };

  const getBuildingForBuilding = async (value) => {
    let formData = new FormData();
    formData.append("clientId", Number(value));
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Building Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)

          })),
        ];
        setBuildingDDBuilding(data);
      })
      .catch((err) => { });
  };

  const getBuildingForCity = async (value) => {
    let formData = new FormData();
    formData.append("clientId", Number(value));
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Building Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingDDCity(data);
      })
      .catch((err) => { });
  };
  const getBuilding = async (value) => {
    let formData = new FormData();
    formData.append("clientId", Number(value));
    axiosInstance
      .post("client/getAllBuildingDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Building Name", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name + " at " + (item.address2 ? item.address1 + ", " + item.address2 : item.address1)
          })),
        ];
        setBuildingDD(data);
      })
      .catch((err) => { });
  };
  // survey Statistics Function
  const getYearForSurveyStatistics = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", value);
    // formData.append("buildingId", value);

    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForSurvey(data);
      })
      .catch((err) => { });
  };
  const getYearForbuildingchange = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    // formData.append("clientId", value);
    formData.append("clientId", selectedClientForBar);
    formData.append("buildingId", value);

    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForSurvey(data);
      })
      .catch((err) => { });
  };
  const getBuildingComparisonGraph = async (clientId, buildingIds, groupBy, year, environment, parameter) => {

    // setSurveyStaticsLoader(true);
    const formData = new FormData();
    if (clientId && clientId !== '') {
      formData.append("clientId", clientId);
    } else {
      // formData.append("clientId", -1);
    }
    if (buildingIds > 0) {
      formData.append("buildingIds", buildingIds);
    } else {
      // formData.append("buildingIds", -1);
    }
    if (groupBy && groupBy !== '') {
      formData.append("flag", groupBy)
    }
    // else {
    //   formData.append("flag", "month")
    // }
    if (year > 0 && groupBy === 'month') {
      formData.append("year", year);
    }
    // else {
    //   formData.append("year", 0);

    // }

    if (environment && environment !== '') {
      formData.append("environment", environment);
    }
    else {
      // formData.append("environment", true);

    }
    if (parameter && parameter !== '') {
      formData.append("parameter", parameter);
    }
    // else {
    //   formData.append("parameter", "carbon_dioxide");
    // }

    await axiosInstance
      .post("dashboard/getBuildingCompGraphForDashboard", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res.data.data.param);
        if (res.data.status === 1) {

          const response = res.data.data.graph;
          setXAxisCategoriesArea(res.data.data.monthName);
          if (groupBy === 'month')
            setXAxisCategoriesAreaTitle("Month");
          else
            setXAxisCategoriesAreaTitle("Year");
          setParam(res.data.data.param);
          const mainArr1 = [];
          Object.keys(response).forEach(function (key, value) {
            let dataBuilding1 = {};
            dataBuilding1["name"] = key;
            dataBuilding1["data"] = [];
            Object.keys(response[key]).forEach(function (k, value) {
              dataBuilding1["data"].push(response[key][k]["value"]);
            });

            mainArr1.push(dataBuilding1);
          });

          var numericArrrr = mainArr1.map(function (obj) {
            return {
              name: obj.name,
              data: obj.data.map(function (value) {
                return parseFloat(value);
              }),
            };
          });

          setDataForArea(numericArrrr);
          setSurveyStaticsLoader(false)

        } else {
          // setSurveyStaticsLoader(false)
          setDataForArea([]);

        }
      });
  };

  // buildingToBuildingcomparison
  const getYearForBuilding = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", value);
    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log("----<", res);
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForBuilding(data);
      })
      .catch((err) => { });
  };
  // const getYearForBuildingchange = async (value) => {
  //   let formData = new FormData();
  //   let userid = JSON.parse(localStorage.getItem("user"));
  //   formData.append("userId", userid.userDetails.userId);
  //   formData.append("clientId", selectedClientForBuilding);
  //   formData.append("buildingId", value);

  //   axiosInstance
  //     .post("dashboard/getYearDD", formData, { headers: headersForJwt })
  //     .then((res) => {
  //       // console.log("----<", res);
  //       const data = [
  //         { value: "", label: "Select Year", isDisabled: true },
  //         ...res.data.data.list.map((item) => ({
  //           value: item.year.toString(), // Convert id to string, if needed
  //           label: item.year,
  //         })),
  //       ];
  //       SetYearForBuilding(data);
  //     })
  //     .catch((err) => { });
  // };

  const getBuildingToBuildingcompGraph = async (clientId, buldingList, groupBy, year, environment, parameter) => {
    setBuildingLoader(true)
    const formData = new FormData();
    if (clientId && clientId !== '') {
      formData.append("clientId", clientId);
    } else {
      // formData.append("clientId", -1);
    }
    if (buldingList != '') {
      formData.append("buildingIds", buldingList);
    } else {
      // formData.append("buildingIds", -1);
    }
    if (groupBy && groupBy !== '') {
      formData.append("flag", groupBy)
    }
    //  else {
    //   formData.append("flag", "month")
    // }
    if (year > 0 && groupBy === 'month') {
      formData.append("year", year);
    }
    // else {
    //   formData.append("year", 0);

    // }

    if (environment && environment !== '') {
      formData.append("environment", environment);
    }
    else {
      // formData.append("environment", true);

    }
    if (parameter && parameter !== '') {
      formData.append("parameter", parameter);
    }
    // else {
    //   formData.append("parameter", "carbon_dioxide");
    // }

    await axiosInstance
      .post("dashboard/getBuildingCompGraphForDashboard", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const response = res.data.data.graph;
          setXAxisCategoriesArea(res.data.data.monthName);
          setParamForBuilding(res.data.data.param);
          if (groupBy === 'month')
            setXAxisCategoriesAreaTitle("Month");
          else
            setXAxisCategoriesAreaTitle("Year");
          const mainArr1 = [];
          Object.keys(response).forEach(function (key, value) {
            let dataBuilding1 = {};
            dataBuilding1["name"] = key;
            dataBuilding1["data"] = [];
            Object.keys(response[key]).forEach(function (k, value) {
              dataBuilding1["data"].push(response[key][k]["value"]);
            });
            mainArr1.push(dataBuilding1);
          });


          var numericArrrr = mainArr1.map(function (obj) {
            return {
              name: obj.name,
              data: obj.data.map(function (value) {
                return parseFloat(value);
              }),
            };
          });
          setDataForBuilding(numericArrrr);
          setBuildingLoader(false)
          // setXAxisCategoriesArea(dummy1)
        } else {
          // setSurveyStaticsLoader(false)
          setDataForBuilding([]);

        }
      });
  };


  // Citycomparison Function
  const getYearForCity = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", value);
    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {

        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForCity(data);
      })
      .catch((err) => { });
  };
  const getYearForCityinbuildingchange = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", selectedClientForColumn);
    formData.append("buildingId", value);

    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {

        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForCity(data);
      })
      .catch((err) => { });
  };
  const getCityComparisonGraph = async (clientId, buildingIds, groupBy, year, environment, parameter) => {
    setColumnLoader(true);
    const formData = new FormData();
    if (clientId && clientId !== '') {
      formData.append("clientId", clientId);
    } else { return false; }
    if (buildingIds > 0) {
      formData.append("buildingIds", buildingIds);
    } else { return false; }
    if (groupBy && groupBy !== '') {
      formData.append("flag", groupBy)
    } else { return false; }
    // else {
    //   formData.append("flag", "month")
    // }
    if (year > 0) {
      formData.append("year", year);
    }
    if (environment && environment !== '' && environment !== null) {
      formData.append("environment", environment);
    } else { return false; }
    if (parameter && parameter !== '') {
      formData.append("parameter", parameter);
    } else { return false; }
    // else {
    //   formData.append("parameter", "carbon_dioxide");
    // }
    await axiosInstance
      .post("dashboard/getAllCityComparisonGraph", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          // console.log(res.data.data.monthName);
          const response = res.data.data.graph;
          // setXAxisCategoriesAreaColumn("");
          // setParamColumn("");
          // setDataForAreaColumn([])
          setXAxisCategoriesAreaColumn(res.data.data.monthName);
          if (groupBy === 'month')
            setXAxisCategoriesAreaColumnTitle("Month");
          else
            setXAxisCategoriesAreaColumnTitle("Year");
          setParamColumn(res.data.data.param);
          const mainArr1 = [];
          Object.keys(response).forEach(function (key, value) {
            let dataBuilding1 = {};
            dataBuilding1["name"] = key;
            dataBuilding1["data"] = [];
            Object.keys(response[key]).forEach(function (k, value) {
              dataBuilding1["data"].push(response[key][k]["value"]);
            });
            mainArr1.push(dataBuilding1);
          });

          var numericArrrr = mainArr1.map(function (obj) {
            return {
              name: obj.name,
              data: obj.data.map(function (value) {
                return parseFloat(value);
              }),
            };
          });
          setDataForAreaColumn(numericArrrr);
          setColumnLoader(false);
          // setXAxisCategoriesArea(dummy1)
        } else {
          // const toastId = toast.loading("Loading...");
          // ErrorToastWithToastId("Select One Role Name..", toastId);
          ErrorToastWithToastId(res.data.message);
          setColumnLoader(false);
          setDataForAreaColumn([]);
        }
      });
  };


  const [ChartData, setChartData] = useState();
  //stackchart Function

  // const getMonthWisereport = async (templateId, clientId, year) => {
  //   const formData = new FormData();
  //   if (templateId > 0) {
  //     formData.append("templateId", templateId);
  //   }
  //   if (clientId && clientId !== '') {
  //     formData.append("clientId", clientId);
  //   }
  //   if (year > 0) {
  //     formData.append("year", year);
  //   }
  //   else {
  //     formData.append("year", 0);

  //   }
  //   await axiosInstance
  //     .post("dashboard/monthWiseReportGenerationGraph", formData, {
  //       headers: headersForJwt,
  //     })
  //     .then((res) => {
  //       if (res.data.status === 1) {
  //         const response = res.data.data.graph;
  //         setXAxisCategoriesAreaColumnStack(res.data.data.monthName);
  //         const mainArr1 = [];

  //         Object.keys(response).forEach(function (key, value) {
  //           let ReportData = {};
  //           ReportData["name"] = key;
  //           ReportData["data"] = [];
  //           Object.keys(response[key]).forEach(function (k, value) {
  //             ReportData["data"].push(response[key][k]["value"]);
  //           });
  //           mainArr1.push(ReportData);
  //         });

  //         setdataForAreaColumnStack(mainArr1);
  //         // setXAxisCategoriesArea(dummy1)
  //       } else {
  //         setdataForAreaColumnStack([]);
  //       }
  //     });
  // }

  const getClientStatisticsGraph = async (clientIdForStatistics, groupByForStatistics, environmentForStatistics, yearForStatistics) => {
    setLoading(true);
    let formData = new FormData();
    if (clientIdForStatistics) {
      formData.append("clientId", clientIdForStatistics);
    }
    if (groupByForStatistics !== "") {
      formData.append("flag", groupByForStatistics);
    }

    if (environmentForStatistics !== "")
      formData.append("environment", environmentForStatistics);

    if (yearForStatistics > 0) {
      formData.append("year", yearForStatistics);
    }

    axiosInstance
      .post("client/getAllClientStatisticsList", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        // console.log(res.data.data);
        setChartData(res.data.data.list);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const [modalShow, setModalShow] = React.useState(false);
  const handleCloseChangePasswordModal = () => {
    setModalShow(false);
  };

  const changePasswordProps = {
    modalShow,
    handleCloseChangePasswordModal
  }
  const isPasswordChange = () => {
    if (userData.userDetails.isPasswordChange === false) {
      Swal.fire({
        title: "Welcome to SIAQ",
        text: "We require all users to change their password after their first login.",
        icon: "warning",
        // showCancelButton: true,
        confirmButtonColor: "#3085d6",
        // cancelButtonColor: "#d33",
        confirmButtonText: "Change Password",
        // cancelButtonText: "Maybe Later",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalShow(true);
        }
      });
    }
  }

  const getAllCountDashBoardDetails = async () => {
    let formData = new FormData();
    formData.append('userId', Number(userData.userDetails.userId))
    await axiosInstance
      .post("dashboard/getAllCountDashBoardDetails  ", formData, { headers: headersForJwt })
      .then((res) => {
        if (res.data.status === 1) {
          setDashboardCounts(res.data.data.list);
        }
      })
      .catch((err) => { });
  };

  const JobPieData = [];
  const getMonthWiseJobStatus = async (Year) => {
    const formData = new FormData();
    // formData.append("buildingId", clickedBuildingId);

    if (Year > 0) {
      formData.append("year", Year);
    }
    else {
      formData.append("year", 0);
    }


    await axiosInstance
      .post("building/getMonthWiseJobStatus", formData, {
        headers: headersForJwt,
      })
      .then((res) => {
        if (res.data.status === 1) {
          // console.log("Inside APi");
          const J = res.data.data.jobStatus;
          // console.log("--------------???????", res.data.data.jobStatus);
          let dataJob = {};
          // dataJob["name"] = "Completed Job";
          // dataJob["y"] = J[0]?.value;
          // dataJob["completed"] = J[2]?.value;
          // JobPieData.push(dataJob);

          // let dataJob2 = {};
          // dataJob2["name"] = "Pending Job";
          // dataJob2["y"] = J[1]?.value;
          // dataJob2["incompleted"] = J[3]?.value;
          // JobPieData.push(dataJob2);
          dataJob["name"] = "Completed Job";
          dataJob["y"] = J[0]?.completedJobPercentage;
          dataJob["completed"] = J[0]?.totalCompletedJobs;
          JobPieData.push(dataJob);

          let dataJob2 = {};
          dataJob2["name"] = "Pending Job";
          dataJob2["y"] = J[0]?.inCompletedJobPercentage;
          dataJob2["incompleted"] = J[0]?.totalIncompletedJobs;
          JobPieData.push(dataJob2);
          setJobPie(JobPieData);
        } else {
          setJobPie([]);
        }
      });
  };

  // Pichart
  const hadlePieYearChange = (e) => {
    getMonthWiseJobStatus(e)
    setSelectedYear(e)
  };

  const hadlePieChange = (e) => {
    getMonthWiseJobStatus(e.target.value, selectedYear)
    setSelectedMonth(e.target.value)

  };


  // Survey Statics Graph
  const handleClientChange = (e) => {
    // getBuildingComparisonGraph(e.target.value, selectedBuildingsBar,setselectedGroupByBar, selectedYearForBar, selectedEnvironmentBar, selectedParameterBar);
    setSelectedClientForBar(e.target.value.value);
    setBuildingDD([]);
    reset({ buildingBar: 0 })
    getBuilding(e.target.value.value);
    getYearForSurveyStatistics(e.target.value.value)
  }
  const handleBuildingChange = (e) => {
    if (e.target.value.value != "") {
      getBuildingComparisonGraph(selectedClientForBar, e.target.value.value, selectedGroupByBar, selectedYearForBar, selectedEnvironmentBar, selectedParameterBar);
      setSelectedBuildingsBar(e.target.value.value);
      getYearForbuildingchange(e.target.value.value)
    }
  }
  const handleGroupByChange = (e) => {
    reset({ yearBar: 0 });
    setSelectedYearForBar(0);
    const selectedValue = e ? e.value : '';
    if (selectedValue === 'year') {
      setIsYearVisible(false);
    } else {
      setIsYearVisible(true);
    }
    if (selectedBuildingsBar > 0) {
      getBuildingComparisonGraph(selectedClientForBar, selectedBuildingsBar, e.value, "", selectedEnvironmentBar, selectedParameterBar);
    }
    setselectedGroupByBar(e.value);
  };

  const handelYearChnage = (e) => {
    if (selectedBuildingsBar > 0) {
      getBuildingComparisonGraph(selectedClientForBar, selectedBuildingsBar, selectedGroupByBar, e.target.value.value, selectedEnvironmentBar, selectedParameterBar);
    }
    setSelectedYearForBar(e.target.value.value);
  };
  const handleEnvironmentChange = (e) => {
    if (selectedBuildingsBar > 0) {
      getBuildingComparisonGraph(selectedClientForBar, selectedBuildingsBar, selectedGroupByBar, selectedYearForBar, e.target.value.value, selectedParameterBar);
    }
    setSelectedEnvironmentBar(e.target.value.value);
  };
  const handleParameterChange = (e) => {
    if (selectedBuildingsBar != '') {
      setSelectedBuildingsBar(selectedBuildingsBar);
      getBuildingComparisonGraph(selectedClientForBar, selectedBuildingsBar, selectedGroupByBar, selectedYearForBar, selectedEnvironmentBar, e.target.value.value);
    }
    setSelectedParameterBar(e.target.value.value);
  };


  //  Building to building Graph
  const handleClientChangeForBuilding = (e) => {
    // getBuildingToBuildingcompGraph(e.target.value.value, selectedBuildingsColumn, selectedGroupByColumn, selectedYearForColumn, selectedEnvironmentColumn, selectedParameterColumn);
    setSelectedClientForBuilding(e.target.value.value);
    setBuildingDDBuilding([]);
    setSelectedBuildingsBuilding([])
    reset({ buildingBuilding: "" })
    getBuildingForBuilding(e.target.value.value);
    getYearForBuilding(e.target.value.value);

  }
  const handleBuildingChangeForBuilding = (e) => {
    if (e.target.value != "") {
      const selectedValueArray = [];
      e.target.value.forEach((element) => {
        selectedValueArray.push(element.value);
      });

      setBuldingList(selectedValueArray);
      getBuildingToBuildingcompGraph(selectedClientForBuilding, selectedValueArray, selectedGroupByBuilding, selectedYearForBuilding, selectedEnvironmentBuilding, selectedParameterBuilding);
      setSelectedBuildingsBuilding(selectedValueArray);
      // getYearForBuildingchange(e.target.value.value)
    }
  }
  const handleGroupByChangeForBuilding = (e) => {
    const selectedValue = e ? e.target.value : '';
    if (selectedValue.value === 'year') {
      setIsYearVisibleBuilding(false);
    } else {
      setIsYearVisibleBuilding(true);
    }
    reset({ yearBuilding: 0 });
    setSelectedYearForBuilding(0);
    let lengthValue = selectedBuildingsBuilding.length;
    // console.log(lengthValue);
    if (lengthValue > 0) {
      getBuildingToBuildingcompGraph(selectedClientForBuilding, selectedBuildingsBuilding, e.target.value.value, "", selectedEnvironmentBuilding, selectedParameterBuilding);
    }
    setselectedGroupByBuilding(e.target.value.value);
  }
  const handleYearChangeForBuilding = (e) => {
    let lengthValue1 = selectedBuildingsBuilding.length;
    // console.log(lengthValue1);
    if (lengthValue1 > 0) {
      getBuildingToBuildingcompGraph(selectedClientForBuilding, selectedBuildingsBuilding, selectedGroupByBuilding, e.target.value.value, selectedEnvironmentBuilding, selectedParameterBuilding);
    }
    setSelectedYearForBuilding(e.target.value.value);
  }
  const handleEnvironmentChangeForBuilding = (e) => {
    let lengthValue2 = selectedBuildingsBuilding.length;
    // console.log(lengthValue2);
    if (lengthValue2 > 0) {
      getBuildingToBuildingcompGraph(selectedClientForBuilding, selectedBuildingsBuilding, selectedGroupByBuilding, selectedYearForBuilding, e.target.value.value, selectedParameterBuilding);
    }
    setSelectedEnvironmentBuilding(e.target.value.value);
  }
  const paramChangeHandleForBuilding = (e) => {
    let lengthValue3 = selectedBuildingsBuilding.length;
    // console.log(lengthValue3);
    if (lengthValue3 != "") {
      setSelectedBuildingsBuilding(selectedBuildingsBuilding);
      getBuildingToBuildingcompGraph(selectedClientForBuilding, selectedBuildingsBuilding, selectedGroupByBuilding, selectedYearForBuilding, selectedEnvironmentBuilding, e.target.value.value);
    }
    setSelectedParameterBuilding(e.target.value.value);
  }
  // Get City Comparision Graph
  const handleClientChangeForCity = (e) => {
    // getCityComparisonGraph(e.target.value.value, selectedBuildingsColumn, selectedGroupByColumn, selectedYearForColumn, selectedEnvironmentColumn, selectedParameterColumn);
    setSelectedClientForColumn(e.target.value.value);
    setBuildingDD([]);
    reset({ buildingColumn: 0 })
    getBuildingForCity(e.target.value.value);
    getYearForCity(e.target.value.value);
  }
  const handleBuildingChangeForCity = (e) => {
    if (e.target.value.value != "") {
      getCityComparisonGraph(selectedClientForColumn, e.target.value.value, selectedGroupByColumn, selectedYearForColumn, selectedEnvironmentColumn, selectedParameterColumn);
      setSelectedBuildingsColumn(e.target.value.value);
      getYearForCityinbuildingchange(e.target.value.value)
    }
  }
  const handleGroupByChangeForCity = (e) => {
    reset({ yearColumn: 0 });
    setselectedGroupByColumn(0);
    const selectedValue = e ? e.target.value : '';

    if (selectedValue.value === 'year') {
      setIsYearVisibleCity(false);
    } else {
      setIsYearVisibleCity(true);
    }

    if (selectedBuildingsColumn > 0) {
      getCityComparisonGraph(selectedClientForColumn, selectedBuildingsColumn, e.target.value.value, "", selectedEnvironmentColumn, selectedParameterColumn);
    }
    setselectedGroupByColumn(e.target.value.value);

  }
  const handleYearChangeForCity = (e) => {
    if (selectedBuildingsColumn > 0) {
      getCityComparisonGraph(selectedClientForColumn, selectedBuildingsColumn, selectedGroupByColumn, e.target.value.value, selectedEnvironmentColumn, selectedParameterColumn);
    }
    setSelectedYearForColumn(e.target.value.value);
  }
  const handleEnvironmentChangeForCity = (e) => {
    if (selectedBuildingsColumn > 0) {
      getCityComparisonGraph(selectedClientForColumn, selectedBuildingsColumn, selectedGroupByColumn, selectedYearForColumn, e.target.value.value, selectedParameterColumn);
    }
    setSelectedEnvironmentColumn(e.target.value.value);

  };
  const paramChangeHandleForCity = (e) => {
    if (selectedBuildingsColumn != '') {
      setSelectedBuildingsColumn(selectedBuildingsColumn);
      getCityComparisonGraph(selectedClientForColumn, selectedBuildingsColumn, selectedGroupByColumn, selectedYearForColumn, selectedEnvironmentColumn, e.target.value.value);
    }
    setSelectedParameterColumn(e.target.value.value);
  };
  // get month wise report
  const handletemplatechangeforReport = (e) => {
    setTemplateidforMonth(e.target.value)
    // getMonthWisereport(e.target.value, clinetidforMonth, yearforMonth)
  }
  const handleClientChangeForReport = (e) => {
    setClinetidforMonth(e.target.value)
    // getMonthWisereport(templateidforMonth, e.target.value, yearforMonth)
  }
  const handleYearChangeForReport = (e) => {
    setYearforMonth(e.target.value)
    // getMonthWisereport(templateidforMonth, clinetidforMonth, e.target.value)
  }
  // get Client Statistics Graph
  const getYearForStatistics = async (value) => {
    let formData = new FormData();
    let userid = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", userid.userDetails.userId);
    formData.append("clientId", value);
    axiosInstance
      .post("dashboard/getYearDD", formData, { headers: headersForJwt })
      .then((res) => {
        // console.log("----<", res);
        const data = [
          { value: "", label: "Select Year", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.year.toString(), // Convert id to string, if needed
            label: item.year,
          })),
        ];
        SetYearForClientStatistics(data);
      })
      .catch((err) => { });
  };
  const handleEnvironmentChangeForClient = (e) => {
    getClientStatisticsGraph(clientIdForStatistics, groupByForStatistics, e.target.value.value, yearForStatistics)
    setEnvironmentForStatistics(e.target.value.value);
  };
  const handleYearChangeForClient = (e) => {
    reset({ environmentClient: "" })
    setEnvironmentForStatistics("All");
    getClientStatisticsGraph(clientIdForStatistics, groupByForStatistics, environmentForStatistics, e.target.value.value)
    setYearForStatistics(e.target.value.value);
  }
  const handleGroupByChangeForClient = (e) => {
    setYearForStatistics("");
    reset({ yearClient: "", environmentClient: "" })
    // getClientStatisticsGraph(clientIdForStatistics, e.target.value.value, environmentForStatistics, yearForStatistics)
    setGroupByForStatistics(e.target.value.value);

  }
  const handleClientChangeForClient = (e) => {
    setChartData("");
    setGroupByForStatistics("");
    reset({ groupByClient: "", yearClient: "", environmentClient: "" })
    // getClientStatisticsGraph(e.target.value.value, groupByForStatistics, environmentForStatistics, yearForStatistics)
    setClientNameforStaticks(e.target.value.label);
    setClientIdForStatistics(e.target.value.value);
    getBuilding(e.target.value.value);
    getYearForStatistics(e.target.value.value);
  }


  useEffect(() => {
    isPasswordChange();
    setRoleId(Number(userData.userDetails.roleId))
    getReportDD();
    getBuildingCompGraphYearDD();
    getAllClientDD();
    // getBuilding(-1);
    getBuildingCompGraphParamDD();
    getAllCountDashBoardDetails();
    // getMonthWiseJobStatus();
    setSelectedBuildingsBar(122)
    // getBuildingComparisonGraph('', 122, 'month', '', '', 'carbon_dioxide');
    // getBuildingComparisonGraph();
    // getBuildingToBuildingcompGraph('', [122, 123], 'month', '', '', 'carbon_dioxide');
    // getBuildingToBuildingcompGraph();
    setSelectedBuildingsColumn(122)
    // getCityComparisonGraph('', 122, 'month', '', '', 'carbon_dioxide');
    // getCityComparisonGraph();
    // getClientStatisticsGraph(192, 'city', '', '');
    // getClientStatisticsGraph("", '', '', '');
    // getClientStatisticsGraph();
    // getMonthWisereport(-1, -1, 2023);
  }, [])
  // const extractTextFromHTML = (htmlString) => {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(htmlString, 'text/html');
  //   return doc.body.textContent || "";
  // };

  const PropsForPie = {
    title: "Job Status",
    name: "Job Status",
    data: jobPie,
  };

  const propsForArea = {
    chartType: "area",
    chartTitle: "Survey Statistics",
    yAxisTitle: param,
    xAxisCategories: xAxisCategoriesArea,
    xAxisTitle: xAxisCategoriesAreaTitle,
    tooltip: "{series.name} had a value of {yAxisTitle} <b>{point.y}</b><br/> {point.xAxisCategories}",
    series: dataForArea,
    // loading: surveyStaticsLoader
  };


  const propsForColumnStack = {
    chartType: "column",
    chartTitle: "Month wise Report Generate",
    yAxisTitle: "",
    xAxisCategories: xAxisCategoriesAreaColumnStack,
    xAxisTitle: xAxisCategoriesAreaColumnStackTitle,
    tooltip: "{series.name} had a value of {yAxisTitle}   <b>{point.y:,.0f}</b><br/> {point.xAxisCategories}",
    series: dataForAreaColumnStack
  };


  const propsForColumn = {
    chartType: "column",
    chartTitle: "City Comparison Graph",
    yAxisTitle: paramColumn,
    xAxisCategories: xAxisCategoriesAreaColumn,
    xAxisTitle: xAxisCategoriesAreaColumnTitle,
    tooltip: "{series.name} had a value of {yAxisTitle}  <b>{point.y}</b><br/> {point.xAxisCategories}",
    series: dataForAreaColumn,
    // loading: columnLoader
  };

  const propsForBuilding = {
    chartType: "column",
    chartTitle: "Building Comparison Graph",
    yAxisTitle: paramForBuilding,
    xAxisCategories: xAxisCategoriesArea,
    xAxisTitle: xAxisCategoriesAreaTitle,
    tooltip: "{series.name} had a value of {yAxisTitle}   <b>{point.y:,.f}</b><br/> {point.xAxisCategories}",
    series: dataForBuilding,
    loading: buildingLoader
  };

  // const PropsForClientStatistics = { countryForStatistics, provinceForStatistics, cityForStatistics, clientIdForStatistics, groupByForStatistics, environmentForStatistics, yearForStatistics };
  const PropsForClientStatistics = { ChartData, clientNameforStaticks, groupByForStatistics, yearForStatistics, environmentForStatistics, loading }

  return (
    <>
      <Helmet title={"Dashboard | IAQ Reporting System"} />
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper">

        <div className="content-header">
          <div className="container-fluid">
            <div className="row mt-2">
              <div className="col-sm-3">
                <p>Hi, Welcome Back..</p>
                {/* <h5 className="m-0 mt-3 mb-2">Dashboard</h5> */}
              </div>
            </div>
          </div>
        </div>
        {/* {console.log('RoleId:', RoleId)} */}
        {RoleId === 23 ? "" : (
          < section className="content mt-3">
            <div className="container-fluid">
              <div className="row mob-box">
                <div className="col">
                  <div className="small-box bg-info-1">
                    <div className="inner">
                      {/* <img
                      src={Dashboardclienticon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                      <PiUserCircleGearThin className="dashboard-icon-size" />
                      <h3>{DashboardCounts.totalClient}</h3>
                      <p>Clients</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-bag" />
                    </div>
                    {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                  </div>
                </div>
                <div className="col">
                  <div className="small-box bg-build">
                    <div className="inner">
                      <PiBuildingsThin className="dashboard-icon-size" />
                      {/* <img
                      src={Dashboardbuildingicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                      <h3>{DashboardCounts.totalBuilding}</h3>
                      <p>Buildings</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-bag" />
                    </div>
                    {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                  </div>
                </div>
                <div className="col">
                  <div className="small-box bg-total">
                    <div className="inner">
                      <PiSuitcaseThin className="dashboard-icon-size" />
                      {/* <img
                      src={Dashboardjobicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                      <h3>{DashboardCounts.totalJobs}</h3>
                      <p>Jobs</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph" />
                    </div>
                    {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                  </div>
                </div>
                <div className="col">
                  <div className="small-box bg-survey">
                    <div className="inner">
                      <PiStairsThin className="dashboard-icon-size" />
                      {/* <img
                      src={Dashboardsurveyicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                      <h3>{DashboardCounts.totalSurveyDone}</h3>
                      <p>Surveys Completed</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" />
                    </div>
                    {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                  </div>
                </div>
                <div className="col">
                  <div className="small-box bg-report">
                    <div className="inner">
                      <PiNotebookThin className="dashboard-icon-size" />
                      {/* <img
                      src={Dashboardreportsicon}
                      alt="SIAQ"
                      className="dashboard-card-image"
                    /> */}
                      <h3>{DashboardCounts.totalReportGenerated}</h3>
                      <p>Reports Generated</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
                    </div>
                    {/*<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>*/}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
        }

        {/* ------------------------------------------- */}
        {/* survey statctics */}
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8">
                <div className="select-container-box box-1-com">
                  {/* client */}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="clientBar"
                      {...register("clientBar", {
                        onChange: (data) => handleClientChange(data)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            placeholder={<>{'Client '}<span className="text-danger">*</span></>}
                            name="clientBar"
                            clearButton
                          // defaultValue={{ label: "Canderel", value: "192" }}

                          />
                        </>
                      )}
                    />
                  </div>
                  {/* building */}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="buildingBar"
                      {...register("buildingBar", {
                        onChange: (e) => handleBuildingChange(e)

                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={buildingDD}
                            // placeholder="Building"
                            placeholder={<>{'Building '}<span className="text-danger">*</span></>}
                            name="buildingBar"
                            clearButton
                          // defaultValue={{ label: "Constitution Square Tower i", value: "122" }}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* GroupBy */}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="groupBy"
                      {...register("groupBy", {
                        // onChange: (e) => handleGroupByChange(e)

                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: '0', label: 'Select...', isDisabled: true },
                              { value: 'month', label: 'Month' },
                              { value: 'year', label: 'Year' },
                            ]}
                            // placeholder="Group By"
                            placeholder={<>{'Group By '}<span className="text-danger">*</span></>} name="groupBy"
                            clearButton
                            // defaultValue={{ label: "Month", value: "month" }}
                            onChange={(e) => handleGroupByChange(e)}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* year */}
                  {isYearVisible && (
                    <div className="col-2">
                      <Controller
                        control={control}
                        name="yearBar"
                        {...register("year", {
                          onChange: (e) => handelYearChnage(e)
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={yearForSurvey}
                              // placeholder="Year"
                              placeholder={<>{'Year'}<span className="text-danger">*</span></>}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                  )}
                  {/* Environment */}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="environmentBar"
                      {...register("environmentBar", {
                        onChange: (e) => handleEnvironmentChange(e)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: 0, label: 'Select...', isDisabled: true },
                              { value: 'true', label: 'Indoor' },
                              { value: 'false', label: 'Outdoor' },
                            ]}
                            // placeholder="Environment"
                            placeholder={<>{'Environment'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* parameter*/}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="parameterBar"
                      {...register("parameterBar", {
                        onChange: (e) => handleParameterChange(e)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={ParameterForBar}
                            // placeholder="Parameter"
                            placeholder={<>{'Parameter '}<span className="text-danger">*</span></>}
                            clearButton
                          // defaultValue={{ label: "Carbon Dioxide", value: "carbon_dioxide" }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <HighChartAreaChart {...propsForArea} />
                {/* </Col> */}
              </div>
              <div className="col-lg-4">
                <div className="content-view-jobs box-1-com">
                  {/* year */}
                  <Col lg="4">
                    <Controller
                      control={control}
                      name="yearBar"
                      {...register("yearBar", {
                        onChange: (e) => { hadlePieYearChange(e.target.value.value) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={YearForBar}
                            placeholder={<>{'Year'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* Month */}
                  {/* <div className="col-lg-3">
                    <Controller
                      control={control}
                      name="Month"
                      {...register("Month", {
                        onChange: (e) => { hadlePieChange(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            aria-label="Default select example"
                            size="sm"
                            options={[
                              { value: 0, label: 'Select...' },
                              { value: '01', label: 'January' },
                              { value: '02', label: 'February' },
                              { value: '03', label: 'March' },
                              { value: '04', label: 'April' },
                              { value: '05', label: 'May' },
                              { value: '06', label: 'June' },
                              { value: '07', label: 'July' },
                              { value: '08', label: 'August' },
                              { value: '09', label: 'September' },
                              { value: '10', label: 'October' },
                              { value: '11', label: 'November' },
                              { value: '12', label: 'December' },
                            ]}
                            placeholder="Month"
                            clearButton
                          // defaultValue={{ label: "Carbon Dioxide", value: "carbon_dioxide" }}
                          />
                        </>
                      )}
                    />
                  </div> */}
                  <Col lg="7">
                    <div class="bd-highlight">

                      <h6 className="p-2">Completed: <span className="color-1">{jobPie[0]?.completed}</span></h6>
                      <h6 className="p-2">Pending: <span className="color-2">{jobPie[1]?.incompleted}</span></h6>
                    </div>
                  </Col>
                </div>
                <HighChartPieChart {...PropsForPie} />

                {/* </Col> */}
              </div>
            </div>
          </div>
        </section>
        {/* --------------------------------------------- */}
        {/* building comparisoon Garph */}
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="select-container-box box-1-com">
                  {/* client */}
                  <Col  >
                    <Controller
                      control={control}
                      name="clientColumn"
                      {...register("clientBuilding", {
                        onChange: (e) => {
                          handleClientChangeForBuilding(e);
                        }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            // placeholder="Client Name"
                            placeholder={<>{'Client '}<span className="text-danger">*</span></>}
                            name="clientColumn"
                            clearButton
                          // defaultValue={{ label: "Canderel", value: "192" }}
                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* building */}
                  <Col  >
                    <Controller
                      control={control}
                      name="buildingColumn"
                      {...register("buildingBuilding", {
                        onChange: (e) => handleBuildingChangeForBuilding(e)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={buildingDDBuilding}
                            // placeholder="Building"
                            placeholder={<>{'Building'}<span className="text-danger">*</span></>}
                            isMulti
                            name="buildingColumn"
                            clearButton
                          // defaultValue={[
                          //   { label: "Constitution Square Tower i", value: "122" },
                          //   { label: "Constitution Square Tower ii", value: "123" },
                          // ]}

                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* groupBy */}
                  <Col lg="2">
                    <Controller
                      control={control}
                      name="groupBy"
                      {...register("groupByBuilding", {
                        onChange: (e) => handleGroupByChangeForBuilding(e)

                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: '0', label: 'Select...', isDisabled: true },
                              { value: 'month', label: 'Month' },
                              { value: 'year', label: 'Year' },
                            ]}
                            // placeholder="Group By"
                            placeholder={<>{'Group By'}<span className="text-danger">*</span></>}
                            name="groupBy"
                            clearButton
                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* year */}
                  {isYearVisibleBuilding && (
                    <div className="col-lg-1">
                      <Controller
                        control={control}
                        name="yearColumn"
                        {...register("yearBuilding", {
                          onChange: (e) => handleYearChangeForBuilding(e)
                        })}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              size="sm"
                              options={yearForBuilding}
                              // placeholder="Year"
                              placeholder={<>{'Year'}<span className="text-danger">*</span></>}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                  )}
                  {/* Environment */}
                  <div  >
                    <Controller
                      control={control}
                      name="environmentColumn"
                      {...register("environmentBuilding", {
                        onChange: (e) => { handleEnvironmentChangeForBuilding(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: 0, label: 'Select...', isDisabled: true },
                              { value: 'true', label: 'Indoor' },
                              { value: 'false', label: 'Outdoor' },
                            ]}
                            // placeholder="Environment"
                            placeholder={<>{'Environment'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* parameter */}
                  <div  >
                    <Controller
                      control={control}
                      name="ParameterForBar"
                      {...register("ParameterBuilding", {
                        onChange: (e) => { paramChangeHandleForBuilding(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={ParameterForBar}
                            // placeholder="Parameter"
                            placeholder={<>{'Parameter'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <HighChartAreaChart {...propsForBuilding} />
              </div>
            </div>
          </div>
        </section>
        {/* city comparison graph */}
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="select-container-box p-4  box-1-com">
                  {/* client */}
                  <Col lg="2">
                    <Controller
                      control={control}
                      name="clientColumn"
                      {...register("client", {
                        onChange: (e) => {
                          handleClientChangeForCity(e);
                        }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            // placeholder="Client Name"
                            placeholder={<>{'Client '}<span className="text-danger">*</span></>}
                            name="clientColumn"
                            clearButton
                          // defaultValue={{ label: "Canderel", value: "192" }}
                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* building */}
                  <Col lg="2">
                    <Controller
                      control={control}
                      name="buildingColumn"
                      {...register("buildingColumn", {
                        onChange: (e) => handleBuildingChangeForCity(e)

                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={buildingDDCity}
                            // placeholder="Building"
                            placeholder={<>{'Building '}<span className="text-danger">*</span></>}
                            name="buildingColumn"
                            clearButton
                          // defaultValue={{ label: "Constitution Square Tower i", value: "122" }}

                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* GroupBy */}
                  <Col lg="2">
                    <Controller
                      control={control}
                      name="groupBy"
                      {...register("groupBy", {
                        onChange: (e) => handleGroupByChangeForCity(e)

                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: '0', label: 'Select...', isDisabled: true },
                              { value: 'month', label: 'Month' },
                              { value: 'year', label: 'Year' },
                            ]}
                            // placeholder="Group By"
                            placeholder={<>{'Group By'}<span className="text-danger">*</span></>}
                            name="groupBy"
                            clearButton
                          // defaultValue={{ label: "Month", value: "month" }}
                          />
                        </>
                      )}
                    />
                  </Col>
                  {/* year */}
                  {isYearVisibleCity && (
                    <div className="col-lg-1">
                      {/* <h6 className="label-search">Year</h6> */}
                      <Controller
                        control={control}
                        name="yearColumn"
                        {...register("yearColumn", {
                          onChange: (e) => handleYearChangeForCity(e)
                        })}
                        render={({ field }) => (
                          <>

                            <Select
                              {...field}
                              size="sm"
                              options={yearForCity}
                              // placeholder="Year"
                              placeholder={<>{'Year'}<span className="text-danger">*</span></>}
                              clearButton
                            />
                          </>
                        )}
                      />
                    </div>
                  )}
                  {/* Environment */}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="environmentColumn"
                      {...register("environmentColumn", {
                        onChange: (e) => { handleEnvironmentChangeForCity(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: 0, label: 'Select...', isDisabled: true },
                              { value: 'true', label: 'Indoor' },
                              { value: 'false', label: 'Outdoor' },
                            ]}
                            // placeholder="Environment"
                            placeholder={<>{'Environment'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* parameter*/}
                  <div className="col-2">
                    <Controller
                      control={control}
                      name="ParameterForBar"
                      {...register("param", {
                        onChange: (e) => { paramChangeHandleForCity(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={ParameterForBar}
                            // placeholder="Parameter"
                            placeholder={<>{'Parameter'}<span className="text-danger">*</span></>}
                            clearButton
                          // defaultValue={{ label: "Carbon Dioxide", value: "carbon_dioxide" }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <HighChartAreaChart {...propsForColumn} />
              </div>
            </div>
          </div>
        </section>
        {/* --------------------------------------------- */}
        {/* no of Report Generated month wise */}
        {/* <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="select-container-box  box-1-com">

                  <Col lg="4">
                    <Controller
                      control={control}
                      name="report"
                      {...register("report", {
                        onChange: (data) => handletemplatechangeforReport(data)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={ReportDD}
                            placeholder="Template"
                            name="report"

                            clearButton
                          />
                        </>
                      )}
                    />
                  </Col>
                  <Col lg="4">
                    <Controller
                      control={control}
                      name="clientColumn"
                      {...register("clientColumn", {
                        onChange: (data) => handleClientChangeForReport(data)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            placeholder="Client Name"
                            name="clientColumn"
                            clearButton
                          />
                        </>
                      )}
                    />
                  </Col>
                  <div className="col-lg-4">
                    <Controller
                      control={control}
                      name="yearColumn"
                      {...register("yearColumn", {
                        onChange: (e) => handleYearChangeForReport(e)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={YearForBar}
                            placeholder="Year"
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <HighChartStackChart {...propsForColumnStack} />
              </div>
            </div>
          </div>
        </section> */}
        {/* -------------------------------------------------- */}
        {/* client stasticks */}
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="select-container-box  box-1-com">

                  {/* client */}
                  <div className="col-lg-3">
                    <Controller
                      control={control}
                      name="clientClient"
                      {...register("clientClient", {
                        onChange: (e) => {
                          handleClientChangeForClient(e);
                        }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={client}
                            // placeholder="Client Name"
                            placeholder={<>{'Client'}<span className="text-danger">*</span></>}
                            name="clientClient"
                            clearButton
                          // defaultValue={{ label: "Canderel", value: "192" }}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* groupby */}
                  <div className="col-lg-3">
                    <Controller
                      control={control}
                      name="groupByClient"
                      {...register("groupByClient", {
                        onChange: (e) => { handleGroupByChangeForClient(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: 0, label: 'Select...', isDisabled: true },
                              { value: 'city', label: 'City' },
                              { value: 'province', label: 'Province' },
                            ]}
                            // placeholder="Group By"
                            placeholder={<>{'Group By'}<span className="text-danger">*</span></>}
                            clearButton
                          // defaultValue={{ label: "City", value: "city" }}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* year */}
                  <div className="col-lg-3">
                    {/* <h6 className="label-search">Year</h6> */}
                    <Controller
                      control={control}
                      name="yearClient"
                      {...register("yearClient", {
                        onChange: (e) => handleYearChangeForClient(e)
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={yearForClientStatistics}
                            // placeholder="Year"
                            placeholder={<>{'Year'}<span className="text-danger">*</span></>}
                            clearButton

                          />
                        </>
                      )}
                    />
                  </div>
                  {/* Environment */}
                  <div className="col-lg-3">
                    <Controller
                      control={control}
                      name="environmentClient"
                      {...register("environmentClient", {
                        onChange: (e) => { handleEnvironmentChangeForClient(e) }
                      })}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            size="sm"
                            options={[
                              { value: 0, label: 'All', isDisabled: true },
                              { value: 'true', label: 'Indoor' },
                              { value: 'false', label: 'Outdoor' },
                            ]}
                            // placeholder="Environment"
                            placeholder={<>{'Environment'}<span className="text-danger">*</span></>}
                            clearButton
                          />
                        </>
                      )}
                    />
                  </div>

                </div>
                <h6 className="pt-4">Client Statistics</h6>
                <ClientStatisticsChart {...PropsForClientStatistics} />
              </div>
            </div>
          </div>
        </section>
        {/* --------------------------------------------------- */}
        {/* <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mt-4">
                <ClientStatisticsChart {...PropsForClientStatistics} />
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <MyChangePassword
        {...changePasswordProps}
      />
    </>
  );
}
export default Dashboard;