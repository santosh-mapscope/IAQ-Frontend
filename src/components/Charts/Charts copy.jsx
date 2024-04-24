import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import DataTable from "react-data-table-component";
import { Helmet } from "react-helmet";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import  "./charts.css";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);



function Charts() {
  const [modalShow, setModalShow] = useState(false);


  const optionnal = {
    
    chart: {
      type: 'column'
  },
  title: {
   
      text: 'Corn vs wheat estimated production for 2020',
      align: 'left',
      y: 20,
      x: 20,
      margin:50
  },
 
  xAxis: {
      categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
      crosshair: true,
      accessibility: {
          description: 'Countries'
      }
  },
  yAxis: {
      min: 0,
      title: {
          text: 'CO',
      },
      labels: {
        style: {
            color:'#8B8282'
        }
      }
  },
  tooltip: {
      valueSuffix: '(1000 MT)'
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [
      {
          name: 'Corn',
          data: [406292, 260000, 107000, 68300, 27500, 14500]
      },
      {
          name: 'Wheat',
          data: [51086, 136000, 5500, 141000, 107180, 77000]
      }
  ]
  };


  const optionnal1 = {
    
    chart: {
      type: 'pie'
  },
  title: {
      text: 'Egg Yolk Composition',align: 'left', 
      y: 20,
      x: 5,
      margin:50
  },
  tooltip: {
      valueSuffix: '%'
  },
  
  plotOptions: {
      series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
              enabled: true,
              distance: 20
          }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                  fontSize: '0.8em',
                  textOutline: 'none',
                  opacity: 0.7
              },
              filter: {
                  operator: '>',
                  property: 'percentage',
                  value: 10
              }
          }]
      }
  },
  series: [
      {
          name: 'Percentage',
          colorByPoint: true,
          data: ""
      }
  ]
  };

  return (
    <>
    

        <section>
      
            
              <Row>
              <Col lg="8">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal} />
                </div>
              </Col>
              <Col lg="4">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal1} />
                </div>
              </Col>
              </Row>
              
            
          
        </section>
      
    </>
  );
}
export default Charts;

export const HighChartPieChart = (props)=>{

    const {
        title,
        name,
        data 
        } = props;  


      const optionnal1 = {
    
        chart: {
          type: 'pie'
      },
      title: {
        text: title?title:'',align: 'left', 
          y: 20,
          x: 5,
          margin:50
      },
      tooltip: {
          valueSuffix: '%'
      },
      
      plotOptions: {
          series: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [{
                  enabled: true,
                  distance: 20
              }, {
                  enabled: true,
                  distance: -40,
                  format: '{point.percentage:.1f}%',
                  style: {
                      fontSize: '0.8em',
                      textOutline: 'none',
                      opacity: 0.7
                  },
                  filter: {
                      operator: '>',
                      property: 'percentage',
                      value: 10
                  }
              }]
          }
      },
      series: [
          {
            name: name,
              colorByPoint: true,
              data: data
          }
      ]
      };
    
    return(
      
        <section>
      
            
              <Row>
              {/* <Col lg="8">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal} />
                </div>
              </Col> */}
              <Col lg="4">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal1} />
                </div>
              </Col>
              </Row>
              
            
          
        </section>
      
    )

}

export const HighChartBarChart = (props)=>{

    const {
        title,
        name,
        data 
        } = props;  


      const optionnal1 = {
    
        chart: {
          type: 'pie'
      },
      title: {
        text: title?title:'',align: 'left', 
          y: 20,
          x: 5,
          margin:50
      },
      tooltip: {
          valueSuffix: '%'
      },
      
      plotOptions: {
          series: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [{
                  enabled: true,
                  distance: 20
              }, {
                  enabled: true,
                  distance: -40,
                  format: '{point.percentage:.1f}%',
                  style: {
                      fontSize: '0.8em',
                      textOutline: 'none',
                      opacity: 0.7
                  },
                  filter: {
                      operator: '>',
                      property: 'percentage',
                      value: 10
                  }
              }]
          }
      },
      series: [
          {
            name: name,
              colorByPoint: true,
              data: data
          }
      ]
      };
    
    return(
      
        <section>
      
            
              <Row>
              {/* <Col lg="8">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal} />
                </div>
              </Col> */}
              <Col lg="4">
                <div className="chart-container">
                <HighchartsReact highcharts={Highcharts} options={optionnal1} />
                </div>
              </Col>
              </Row>
              
            
          
        </section>
      
    )

}
 
