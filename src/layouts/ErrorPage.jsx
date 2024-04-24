import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Logoicon from "../assets/images/SIAQ-logo-95px.svg";
import Errorimage from "../assets/images/error-image.svg";
import { Link } from "react-router-dom";

function ErrorPage(props) {
  const {
    errorType
  } = props;
  return (
    <>
      <Helmet title={"Dashboard | IAQ Reporting System"} />
      <div id="main">
        <div class="fof">
          <div className="logo-container">
            <img
              src={Logoicon}
              alt="SIAQ"
              style={{ opacity: 1 }}
              className="mb-4"
              width={150}
            />
          </div>
          <h1 className="mt-4">{errorType?? "Oops! Page not found"}</h1>
          <Link to={'/login'}><h6 className="mt-5"><button className="btn btn-primary">Back to Home</button></h6></Link>
        </div>
        <div className="side-image">
          <img
            src={Errorimage}
          />
        </div>
      </div>
    </>
  );
}
export default ErrorPage;
