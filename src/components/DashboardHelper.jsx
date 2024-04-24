dashboard/getAllCountDashBoardDetails
import React, { useEffect, useState } from "react";

import { Col, Button, Row, Form, Modal, Card } from "react-bootstrap";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { axiosInstance, headersForJwt } from "../../util/axiosConfig";
import Accordion from "react-bootstrap/Accordion";
import { useForm, Controller } from "react-hook-form";
import Container from "react-bootstrap/Container";
import {
  HighChartPieChart,
  HighChartAreaChart,
} from "../../components/Charts/Charts";
import JobList from "../Jobs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { right } from "@popperjs/core";
import TenantsList from "../Tenants/Tenants";
import noImage from "../../assets/dist/img/no-img.png";
import LightboxComponent from '../../components/Lightbox';