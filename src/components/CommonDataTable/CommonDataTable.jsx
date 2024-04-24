import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";

import { axiosInstance, headersForJwt, headersForJwtWithJson } from "../../util/axiosConfig";

import { Col, Button, Row, Form, Modal } from "react-bootstrap";
import { FaUser, FaRedo, FaLock, FaEye, FaEyeSlash, FaInfo } from "react-icons/fa";


import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { userAtom } from "../../Atom/CommonAtom";
import { useRecoilState } from "recoil";
import { right } from "@popperjs/core";
import Profileicon from "../../assets/images/user2-160x160.jpg";
import SuspenseFallback from "../../util/SuspenseFallback";


export const CommonDataTable = (props) => {
  const {
    data,
    columns,
    loading,
    totalRows,
    currentPage,
    handlePerRowsChange,
    handlePageChange,
  } = props;

  const [filterText, setFilterText] = useState('');
  const customStyles = {
    headRow: {
      style: {
        color: "#939597",
        backgroundColor: "#fff",
        paddingLeft: '1%',
      },
    },

    headCells: {
      style: {
        color: "#98989C",
        paddingLeft: "2px",
      },
    },

    rows: {
      style: {
        minHeight: "50px",
        background: "#fff",
        fontSize: "12px",
      },
      stripedStyle: {
        color: "#404D61",
        backgroundColor: "#ECF1F6",
      },
    },

    cells: {
      style: {
        paddingLeft: "1em",
        paddingRight: "1em",
      },
    },
  };
  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );


  const paginationOptions = {
    rowsPerPageText: '',
    showPaginationBottom: false,
  };

  return (
    <div>
      <div className="d-flex justify-content-end align-items-start mb-2 white-bg">
        <Form.Group  className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search List..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border-non"
            autoComplete="off"
          />
        </Form.Group>
      </div>

      <DataTable
        useFilters
        columns={columns}
        bootstrap4
        data={filteredData}
        progressPending={loading}
        progressComponent={<SuspenseFallback />}
        pagination
        paginationTotalRows={totalRows}
        paginationDefaultPage={currentPage}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationServer
        striped
        highlightOnHover
        customStyles={customStyles}
        paginationPerPageOptions={[]}
        // paginationRowsPerPageOptions={[]}
        paginationComponentOptions={paginationOptions}
        className="box-tab"
      />
    </div >
  );
};
