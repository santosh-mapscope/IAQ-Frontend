
import React, { useEffect, useState } from "react";
import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";
import Accordion from "react-bootstrap/Accordion";
import DataTable from "react-data-table-component";
import { Helmet } from "react-helmet";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import "./charts.css";
import { render } from "react-dom";
import Highcharts, { chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SuspenseFallback from "../../util/SuspenseFallback/index";
require("highcharts/modules/exporting")(Highcharts);

function Charts() {
  // const [modalShow, setModalShow] = useState(false);

  const optionnal = {
    chart: {
      type: "column",
      events: {
        load() {
          this.showLoading();
          setTimeout(this.hideLoading.bind(this), 3000);
        }
      },
    },
    title: {
      text: 'Major trophies for some English teams',
      align: 'left'
    },
    xAxis: {
      categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count trophies'
      },
      stackLabels: {
        enabled: true
      }
    },
    legend: {
      align: 'left',
      x: 70,
      verticalAlign: 'top',
      y: 70,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'BPL',
      data: [3, 5, 1, 13]
    }, {
      name: 'FA Cup',
      data: [14, 8, 8, 12]
    }, {
      name: 'CL',
      data: [0, 2, 6, 3]
    }],
  };

  const optionnal1 = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Egg Yolk Composition",
      align: "left",
      y: 20,
      x: 5,
      margin: 50,
    },
    tooltip: {
      valueSuffix: "%",
    },

    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "0.8em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
    },
    series: [
      {
        name: "Percentage",
        colorByPoint: true,
        data: "",
      },
    ],
  };

  return (
    <>
      <section>
        <div className="chart-container">
          <Row></Row>

          <Row>
            <Col lg="8">
              <div className="select-container-box">
                <Col lg="3">
                  <Form.Select aria-label="Default select example" size="sm">
                    <option>Building</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Col>

                <Col lg="3">
                  <Form.Select aria-label="Default select example" size="sm">
                    <option>Year</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Col>
                <Col lg="3">
                  <Form.Select aria-label="Default select example" size="sm">
                    <option>Environment</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Col>
                <Col lg="3">
                  <Form.Select aria-label="Default select example" size="sm">
                    <option>Parameter</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Col>
              </div>

              <HighchartsReact highcharts={Highcharts} options={optionnal} />
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}
export default Charts;


export const HighChartPieChart = (props) => {
  const { title, name, data } = props;

  const optionnal1 = {
    chart: {
      type: "pie",
      events: {
        load() {
          this.showLoading();
          setTimeout(this.hideLoading.bind(this), 3000);
        }
      },
    },
    title: {
      text: title ? title : "",
      align: "left",
      y: 20,
      x: 5,
      margin: 50,
    },
    tooltip: {
      valueSuffix: "%",
    },

    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "0.8em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
    },
    series: [
      {
        name: name,
        colorByPoint: true,
        data: data,
      },
    ],
  };
 
  return (
    <section>
      {/* <Col lg="8">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal} />
                </div>
              </Col> */}

      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={optionnal1} />
      </div>
    </section>
  );
};


export const HighChartBarChart = (props) => {
  const { title, yAxis, dataForBar, categories, param } = props;

  const optionnal = {
    chart: {
      type: "column",
      events: {
        load() {
          this.showLoading();
          setTimeout(this.hideLoading.bind(this), 3000);
        }
      },
    },
    title: {
      text: title ? title : "",
      align: "left",
      y: 20,
      x: 20,
      margin: 50,
    },

    xAxis: {
      categories: categories,
      crosshair: true,
      accessibility: {
        description: "Countries",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxis ? yAxis : "",
      },
      labels: {
        style: {
          color: "#8B8282",
        },
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: dataForBar,
    // [
    //   {
    //     name: "BUilding1",
    //     data: [100, 200,100,'',599],
    //   },
    //   {
    //     name: "BUilding12",
    //     data: [100, 200,100,'',599],
    //   },
    //   {
    //     name: "BUilding12",
    //     data: [100, 200,100,'',599],
    //   },
    // ],
  };

  return (
    <section>
      {/* <Col lg="8">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal} />
                </div>
              </Col> */}

      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={optionnal} />
      </div>
    </section>
  );
};


export const HighChartAreaChart = (props) => {
  const { chartType, chartTitle, yAxisTitle, xAxisCategories, xAxisTitle, tooltip, series } = props;
  const areachart = {
    chart: {
      type: chartType,
    },

    title: {
      text: chartTitle,

      align: "left",
      y: 12,
      x: 20,
    },
    xAxis: {
      categories: xAxisCategories,
      // categories: ['2020', '2021', '2022', '2023', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: xAxisTitle,
      },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
    },
    tooltip: {
      // pointFormat: tooltip
      // pointFormat: '{series.name} had a value of {yAxis}  abc <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    // series: [{
    //   name: 'Series 1',
    //   data: [29.9, 71.5, 106.4, 129.2],
    // },{
    //     name: 'Series 1',
    //     data: [29.9, 71.5, 106.4, 129.2],
    //   }]
    // series: [{
    //   name: 'Series 1',
    //   data: [29.9, 71.5, 106.4, 129.2],
    // }]
    series: series

  };
  const loadingStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999, // Ensure the loading message appears on top
  };
  return (
    <section>
      <div className="chart-container" style={{ position: 'relative' }}>
        {/* {loading && (
          <div style={loadingStyle}>
            Loading...
          </div>
        )} */}
        <HighchartsReact highcharts={Highcharts} options={areachart} />
      </div>
    </section>
  );
};

export const HighChartStackChart = (props) => {
  const { chartType, chartTitle, yAxisTitle, xAxisCategories, xAxisTitle, tooltip, series } = props;
  // console.log("series");
  // console.log(series);
  const areachart = {
    chart: {
      type: chartType,
      events: {
        load() {
          this.showLoading();
          setTimeout(this.hideLoading.bind(this), 3000);
        }
      },
    },

    title: {
      text: chartTitle,
      align: "left",
      y: 12,
      x: 20,
    },
    xAxis: {
      categories: xAxisCategories,
      // categories: ['2020', '2021', '2022', '2023', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: xAxisTitle,
      },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      stackLabels: {
        enabled: true
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },

    tooltip: {
      pointFormat: tooltip
      // pointFormat: '{series.name} had a value of {yAxis}  abc <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },

    // series: [{
    //   name: 'Series 1',
    //   data: [29.9, 71.5, 106.4, 129.2],
    // }]
    series: series

  };
  return (
    <section>
      <div className="chart-container">

        <HighchartsReact highcharts={Highcharts} options={areachart} />
      </div>
    </section>

  );
};

export const ClientStatisticsChart = (props) => {
  // const { countryForStatistics, provienceForStatistics, cityForStatistics, clientIdForStatistics, groupByForStatistics, environmentForStatistics, yearForStatistics } = props;

  const { ChartData, clientNameforStaticks, groupByForStatistics, yearForStatistics, environmentForStatistics, loading } = props;

  // const [ChartData, setChartData] = useState();

  const bgColors = {
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



  return (
    <section className="mt-4">
      {loading && <SuspenseFallback />}

      {ChartData ? (
        Object.entries(ChartData).map(([key, values]) => (
          <div className="Client-Statistical-Data-one" key={key}>
            {values && Object.entries(values).map(([key1, values1]) => (
              <div className="col-lg-12 pd-0" key={key1}>
                <div className="st-container-box mt-4 mb-1">
                  <Col><h6>Client Name : <span className="sp-st">  {clientNameforStaticks.charAt(0).toUpperCase() + clientNameforStaticks.substring(1)}</span></h6></Col>
                  <Col><h6>City : <span className="sp-st">{key1.charAt(0).toUpperCase() + key1.slice(1)}</span></h6></Col>
                  <Col><h6>Year : <span className="sp-st">{yearForStatistics}</span></h6></Col>
                  <Col><h6>Group By : <span className="sp-st">{groupByForStatistics.charAt(0).toUpperCase() + groupByForStatistics.slice(1)}</span></h6></Col>
                  <Col><h6>Environment :     {environmentForStatistics === 'true' && <span className="sp-st">Indoor</span>}
                    {environmentForStatistics === 'false' && <span className="sp-st">Outdoor</span>}
                    {environmentForStatistics === 'All' && <span className="sp-st">All</span>}</h6></Col>                </div>

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
                  {/* <tbody>
                    {values1 && Object.entries(values1).map(([key2, values2]) => {
                      // Modify key2 format
                      const modifiedKey2 = key2.replace(/ - /g, "(").replace(/\)$/g, ")");

                      return (
                        <tr key={key2}>
                          <th scope="row" style={{ backgroundColor: bgColors.co2 }}>
                            {modifiedKey2}
                          </th>
                          {values2 && Object.entries(values2).map(([key3, values3]) => (
                            <td key={key3}>{values3}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody> */}

                  {/* <tbody>
                    {values1 && Object.entries(values1).map(([key2, values2]) => (
                      <tr key={key2}>
                        <th scope="row" style={{ backgroundColor: bgColors.co2 }}>
                          {key2}
                        </th>
                        {values2 && Object.entries(values2).map(([key3, values3]) => (
                          <td key={key3}>{values3}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody> */}
                  <tbody>
                    {values1 && Object.entries(values1).map(([key2, values2]) => (
                      <tr key={key2}>
                        <th scope="row" style={{ backgroundColor: bgColors.co2 }}>
                          <div dangerouslySetInnerHTML={{ __html: key2 }} />
                        </th>
                        {values2 && Object.entries(values2).map(([key3, values3]) => (
                          <td key={key3}>{values3}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </div>
        ))
      ) : (
        // Render default table design with "N/A" values
        <div className="default-table-design">
          <Table striped className="stastic-table">
            <thead>
              <tr>
                <th style={{ backgroundColor: bgColors.statistic }}>Statistic</th>
                <th style={{ backgroundColor: bgColors.min }}>Min</th>
                <th style={{ backgroundColor: bgColors.max }}>Max</th>
                {/* <th style={{ backgroundColor: bgColors.sd }}>Standard Deviation</th>
                <th style={{ backgroundColor: bgColors.variance }}>Variance</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ backgroundColor: bgColors.statistic }}>Carbon Dioxide (ppm)</th>
                <td></td><td></td><td></td><td></td>
              </tr>
              <tr>
                <th style={{ backgroundColor: bgColors.statistic }}>Carbon Monoxide (ppm)</th>
                <td></td><td></td><td></td><td></td>
              </tr>
              <tr>
                <th style={{ backgroundColor: bgColors.statistic }}>Temperature (°C)</th><td></td><td></td><td></td><td></td>
              </tr>
              <tr><th style={{ backgroundColor: bgColors.statistic }}>Relative Humidity (%)</th><td></td><td></td><td></td><td></td></tr>
              <tr><th style={{ backgroundColor: bgColors.statistic }}>Particulate Matter (PM<sub>2.5</sub>)(µg/m<sup>3</sup>)</th><td></td><td></td><td></td><td></td></tr>
              <tr><th style={{ backgroundColor: bgColors.statistic }}>Particulate Matter (PM<sub>10</sub>)(µg/m<sup>3</sup>)</th><td></td><td></td><td></td><td></td></tr>
              <tr><th style={{ backgroundColor: bgColors.statistic }}>Total Volatile Organic Compounds (ppb)</th><td></td><td></td><td></td><td></td></tr>
            </tbody>
          </Table>
        </div>
      )}
    </section>
  );

};
