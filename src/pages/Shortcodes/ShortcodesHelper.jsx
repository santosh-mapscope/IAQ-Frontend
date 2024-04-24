/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from 'ckeditor4-react';
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import { Col, Button, Row, Form, Modal, Container } from "react-bootstrap";
import Swal from "sweetalert2";

import { FaFileCsv, FaEye, FaEyeSlash } from "react-icons/fa";
import { BiSolidCloudUpload, BiPlus, BiMinus } from "react-icons/bi";

import { useDropzone } from "react-dropzone";
import { AiOutlineClose } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Table from "react-bootstrap/Table";
// import DualListBox from "react-dual-listbox";
// import "react-dual-listbox/lib/react-dual-listbox.css";

import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';


import toast, { Toaster } from "react-hot-toast";

import { right } from "@popperjs/core";

const userData = JSON.parse(localStorage.getItem("user"));


export const AddEditModal = (props) => {

  const [isEditMode, setIsEditMode] = useState(false); // State to determine if it's in edit mode
  const [selectContentType, setSelectContentType] = useState("Text");
  const [shortcodeDetails, setShortcodeDetails] = useState("");


  const [expressionOptions, setExpressionOptions] = useState("");
  const [fieldOptions, setFieldOptions] = useState("");
  const [conditionOptions, setConditionOptions] = useState("");
  const [shortcodeTableColumnOption, setShortcodeTableColumnOption] = useState("");


  const shortCodeEditor = useRef(null)

  const getExpressionDD = async () => {
    await axiosInstance
      .post("master/getExpressionDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Expression" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
            valueField: item.valueField,
            expValueField: item.expValueField
          })),
        ];
        setExpressionOptions(data);
      })
      .catch((err) => { });
  };

  const getFieldVariableDD = async () => {
    await axiosInstance
      .post("master/getFieldVariableDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Field" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setFieldOptions(data);
      })
      .catch((err) => { });
  };

  const getShortcodeConditionDD = async () => {
    await axiosInstance
      .post("master/getShortcodeConditionDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Condition" },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setConditionOptions(data);
      })
      .catch((err) => { });
  };

  const getShortcodeTableColumnDD = async () => {
    await axiosInstance
      .post("master/getShortcodeTableColumnDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          // { value: "", label: "Select Condition" },
          ...res.data.data.list.map((item) => ({
            value: item.id, // Convert id to string, if needed
            label: item.displayName,
          })),
        ];
        setShortcodeTableColumnOption(data);
      })
      .catch((err) => { });
  };
  useEffect(() => {
    getExpressionDD();
    getFieldVariableDD();
    getShortcodeConditionDD();
    getShortcodeTableColumnDD();
  }, []);

  const {
    showAddShortcodeModal,
    showShortcodeEditModal,
    handleCloseShortcodeModal,
    editData, // Data for editing, pass null for adding
  } = props;

  const { register, getValues, setValue, handleSubmit, watch, reset, control, formState: { errors } } = useForm();
  const [validated, setValidated] = useState(false);
  const [isDependent, setIsDependent] = useState(false);
  const [shortcodeDD, setShortcodeDD] = useState([]);

  const getAllShortcodeDD = async () => {
    axiosInstance
      .post("master/getShortcodeDD", [], { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "", label: "Select Shortcode", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setShortcodeDD(data);
      })
      .catch((err) => { });
  };
  const dependentCondition = [{ value: "", label: "Select operator", isDisabled: true },
  { value: "true", label: "True" },
  { value: "false", label: "False" }];

  const [expressionDDViews, setExpressionDDViews] = useState([
    {
      expressionId: null,
      value: false,
      expValue1: false,
      expValue2: false
    }
  ]);

  // Shortcode Views
  const [shortcodeViews, setShortcodeViews] = useState([
    {
      expressionId: null,
      fieldId: null,
      conditionId: null,
      value: '',
      operator: '',
      expressionValue1: null,
      expressionValue2: null
    },
  ]);

  // Dependent Shortcode Views
  const [dependentShortcodeViews, setDependentShortcodeViews] = useState([
    {
      depententId: null,
      condition: null,
      operator: null,
    },
  ]);

  // Add Shortcode Views
  const addShortcodeView = () => {
    const newShortcodeView = {
      expressionId: null,
      fieldId: null,
      conditionId: null,
      value: '',
      expressionValue1 : null,
      expressionValue2 : null
    };
    // Add operator starting from the second shortcode view
    // if (shortcodeViews.length > 0) {
    newShortcodeView.operator = ''; // Initialize operator as an empty string
    // }
    setShortcodeViews([...shortcodeViews, newShortcodeView]);

    // Dynamic value fields according to shortcodeViews
    const newExpressionDDViews = {
      expressionId: null,
      value: false,
      expValue1: false,
      expValue2: false
    };
    setExpressionDDViews([...expressionDDViews, newExpressionDDViews]);

  };

  // Add Dependent Shortcode Views
  const addDependentShortcodeView = () => {
    const newDependentShortcodeView = {
      depententId: null,
      condition: null,
      operator: null
    };
    // Add operator starting from the second shortcode view
    // if (shortcodeViews.length > 0) {
    newDependentShortcodeView.operator = ''; // Initialize operator as an empty string
    // }
    setDependentShortcodeViews([...dependentShortcodeViews, newDependentShortcodeView]);
  };

  // Remove Shortcode Views
  const removeShortcodeView = (index) => {
    if (shortcodeViews.length > 1) {
      const updatedViews = [...shortcodeViews];
      updatedViews.splice(index, 1);
      setShortcodeViews(updatedViews);
    }
    // Dynamic value fields according to shortcodeViews
    if (expressionDDViews.length > 1) {
      const updatedExpressionDDViews = [...expressionDDViews];
      updatedExpressionDDViews.splice(index, 1);
      setExpressionDDViews(updatedExpressionDDViews);
    }
  };
  // Remove Dependent Shortcode Views
  const removeDependentShortcodeView = (index) => {
    if (dependentShortcodeViews.length > 1) {
      const updatedViews = [...dependentShortcodeViews];
      updatedViews.splice(index, 1);
      setDependentShortcodeViews(updatedViews);
    }
  };
  // Handel dependent mapping change
  const handleDependentShortcodeChange = (value, index) => {
    const updatedViews = [...dependentShortcodeViews];
    updatedViews[index].depententId = Number(value);
    setDependentShortcodeViews(updatedViews);
  };
  const handleDependentConditionChange = (value, index) => {
    const updatedViews = [...dependentShortcodeViews];
    updatedViews[index].condition = value;
    setDependentShortcodeViews(updatedViews);
  };
  const handleDependentOperatorChange = (value, index) => {
    const updatedViews = [...dependentShortcodeViews];
    updatedViews[index].operator = value;
    setDependentShortcodeViews(updatedViews);
  };


  // Handel ruledata change

  const handleExpressionChange = (value, valueField, expValueField, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].expressionId = Number(value);
    setShortcodeViews(updatedViews);

    // Update field values according to expression DD
    const updatedExpressionDDViews = [...expressionDDViews];
    updatedExpressionDDViews[index].expressionId = Number(value);

    if (valueField === true && expValueField === true) {
      updatedExpressionDDViews[index].value = true;
      updatedExpressionDDViews[index].expValue1 = true;
      updatedExpressionDDViews[index].expValue2 = false;
    } else if (valueField === false && expValueField === true) {
        updatedExpressionDDViews[index].value = false;
        updatedExpressionDDViews[index].expValue1 = true;
        updatedExpressionDDViews[index].expValue2 = true;
    } else if (valueField === true && expValueField === false) {
      updatedExpressionDDViews[index].value = true;
      updatedExpressionDDViews[index].expValue1 = false;
      updatedExpressionDDViews[index].expValue2 = false;
    } else {
      updatedExpressionDDViews[index].value = false;
      updatedExpressionDDViews[index].expValue1 = false;
      updatedExpressionDDViews[index].expValue2 = false;
    }
    setExpressionDDViews(updatedExpressionDDViews);
  };

  const handleFieldChange = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].fieldId = Number(value);
    setShortcodeViews(updatedViews);
  };

  // const handleCompareChange = (value, index) => {
  //   const updatedViews = [...shortcodeViews];
  //   updatedViews[index].compare = value;
  //   setShortcodeViews(updatedViews);
  // };

  const handleConditionChange = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].conditionId = Number(value);
    setShortcodeViews(updatedViews);
  };

  const handleValueChange = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].value = value;
    setShortcodeViews(updatedViews);
  };

  const handleExpValue1Change = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].expressionValue1 = value;
    setShortcodeViews(updatedViews);
  };

  const handleExpValue2Change = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].expressionValue2 = value;
    setShortcodeViews(updatedViews);
  };

  const handleOperatorChange = (value, index) => {
    const updatedViews = [...shortcodeViews];
    updatedViews[index].operator = value;
    setShortcodeViews(updatedViews);
  };

  const [selected, setSelected] = useState([]);

  const onSubmit = (event) => {
    if (isEditMode) {
      // Perform update operation based on the data

      const data = {
        // userId: Number(userData.userDetails.userId),
        id: editData.id,
        name: event.shortcodeName,
        tag: event.shortcodeTag,
        isDependent: event.isDependent,
        // ruleDataDtos: shortcodeViews
      };
      if (event.isDependent === true) {
        data.dependentShortcodeMappingDtos = dependentShortcodeViews;
      } else {
        data.ruleDataDtos = shortcodeViews;
      }
      if (selectContentType === "All") {
        data.isTableText = true;
        data.isTable = false;
        data.details = shortcodeDetails;
        data.tableColumnId = selected;
      } else if (selectContentType === "Table") {
        data.isTableText = false;
        data.isTable = true;
        data.tableColumnId = selected;
      } else if (selectContentType === "Text") {
        data.isTableText = false;
        data.isTable = false;
        data.details = shortcodeDetails;
      } else {
        data.isTableText = false;
        data.isTable = false;
      }
      const formdata = new FormData()
      formdata.append("data", JSON.stringify(data));

      Swal.fire({
        title: "Please confirm",
        text: "Do you want to update this Shortcode?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const toastId = toast.loading("Loading...");
          axiosInstance
            .post("shortcode/editShortcode", formdata, { headers: headersForJwt })
            .then((res) => {
              toast.dismiss();
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Shortcode updated successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                reset();
                setShortcodeViews([]);
                setDependentShortcodeViews([]);
                handleCloseShortcodeModal();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: "Shortcode updation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });

    } else {

      const data = {
        // userId: Number(userData.userDetails.userId),
        tag: event.shortcodeTag,
        name: event.shortcodeName,
        isDependent: event.isDependent,
      };
      if (event.isDependent === true) {
        data.dependentShortcodeMappingDtos = dependentShortcodeViews;
      } else {
        data.ruleDataDtos = shortcodeViews;
      }
      if (selectContentType === "All") {
        data.isTableText = true;
        data.isTable = false;
        data.details = shortcodeDetails;
        data.tableColumnId = selected;
      } else if (selectContentType === "Table") {
        data.isTableText = false;
        data.isTable = true;
        data.tableColumnId = selected;
      } else if (selectContentType === "Text") {
        data.isTableText = false;
        data.isTable = false;
        data.details = shortcodeDetails;
      } else {
        data.isTableText = false;
        data.isTable = false;
      }

     
      const formdata = new FormData()
      formdata.append("data", JSON.stringify(data))

      Swal.fire({
        title: "Please confirm",
        text: "Do you want to create this shortcode?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const toastId = toast.loading("Loading...");
          axiosInstance
            .post("shortcode/addShortcode", formdata, { headers: headersForJwt })
            .then((res) => {
              toast.dismiss();
              if (res && res.data.status === 1) {
                Swal.fire({
                  icon: 'success',
                  title: "Shortcode created successfully",
                  showConfirmButton: false,
                  timer: 2000
                });
                reset();
                setShortcodeViews([]);
                setDependentShortcodeViews([]);
                handleCloseShortcodeModal();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: res.data.message,
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: "Shortcode creation failed. Try after some time",
                showConfirmButton: false,
                timer: 2000
              })
            });
        }
      });
    }
  }
  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "alignment",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockquote",
        "|",
        "insertTable",
        "mediaEmbed",
        "|",
        "link",
        "unlink",
        "|",
        "imageUpload",
        "imageInsert",
        "imageResize",
        "pageBreak",
        "alignment",
        "wordCount",
        "underline",
        "highlight", // Add the 'highlight' button to the toolbar
        "findAndReplace", // Add the 'findAndReplace' button to the toolbar
        "fontBackgroundColor", // Add the 'fontBackgroundColor' button to the toolbar
        "fontColor",
        "fontFamily", // Add the 'fontFamily' button to the toolbar
        "fontSize",
        "styles", // Add the 'styles' button to the toolbar
        "specialCharacters", // Add the 'specialCharacters' button to the toolbar
        "sourceEditing", // Add the 'sourceEditing' button to the toolbar
        "showBlocks", // Add the 'showBlocks' button to the toolbar
        "selectAll", // Add the 'selectAll' button to the toolbar

        "autoformat", // Add the 'autoformat' button to the toolbar
        "|",
        "insertCodeBlock",
        "codeBlock",
        "|",
        "horizontalLine",
        "specialCharacters",
        "|",
        "removeFormat",
        "|",
        "undo",
        "redo",
        // Add or remove items as needed based on your requirement
      ],
      shouldNotGroupWhenFull: true, // This prevents items from grouping when the toolbar is too narrow
    },
    // Other configurations as needed
  };




  const initializeFields = async (editData) => {
    if (editData) {
      // Set the edit mode
      setIsEditMode(true);
      // Clear existing shortcode views
      setShortcodeViews([]);
      setDependentShortcodeViews([]);
      setSelectContentType(editData && editData.isTable === false ? (editData.isTableText === true ? "All" : "Text") : "Table");


      // Reset the form fields with default values
      reset({
        shortcodeName: editData && editData.name ? editData.name : "",
        shortcodeTag: editData && editData.tag ? editData.tag : "",
        isDependent: editData && editData.isDependent ? editData.isDependent : false,
      });
      setIsDependent(editData.isDependent);
      if (editData.isDependent === false) {
        // Populate shortcodeViews array with data from editData
        setTimeout(async () => {
          const shortcodeViewsData = editData.ruleDataDtos.map((ruleData) => ({
            expressionId: ruleData.expressionId.toString(),
            fieldId: ruleData.fieldId.toString(),
            conditionId: ruleData.conditionId.toString(),
            value: ruleData.value,
            operator: ruleData.operator.toString() || "", // Make sure to handle the case when operator is undefined
            expressionValue1 : ruleData.expressionValue1 || "",
            expressionValue2 : ruleData.expressionValue2 || ""
          }));

          const expressionDDViewsData = editData.ruleDataDtos.map((ruleData) => ({
            expressionId: ruleData.expressionId.toString(),
            value: (ruleData.value !== null && ruleData.value !== "") ? true: false,
            expValue1: (ruleData.expressionValue1 !== null && ruleData.expressionValue1 !== "") ? true: false,
            expValue2: (ruleData.expressionValue2 !== null && ruleData.expressionValue2 !== "") ? true: false,
          }));

          setShortcodeViews(shortcodeViewsData);
          setExpressionDDViews(expressionDDViewsData);
          shortcodeViewsData.forEach((shortcode, index) => {
            setValue(`operator${index}`, shortcode.operator);
          });
          await setSelected(editData && editData.tableColumnId ? editData.tableColumnId : []);
        }, 500);
      } else {
        // Populate shortcodeViews array with data from editData
        setTimeout(async () => {
          const dependentShortcodeViewsData = editData.dependentShortcodeMappingDtos.map((dependentShortcode) => ({
            depententId: dependentShortcode.depententId.toString(),
            condition: dependentShortcode.condition.toString(),
            operator: dependentShortcode.operator || false, // Make sure to handle the case when operator is undefined
          }));
          await setDependentShortcodeViews(dependentShortcodeViewsData);
          dependentShortcodeViewsData.forEach((shortcode, index) => {
            setValue(`dependentOperator${index}`, shortcode.operator);
          });
          await setSelected(editData && editData.tableColumnId ? editData.tableColumnId : []);
        }, 500);
      }





    } else {
      // Set the Add mode 
      setIsEditMode(false);
      // Reset the form fields with default values for adding
      reset({
        shortcodeName: "",
        shortcodeTag: "",
      });
      setSelected([]);
      setIsDependent(false);

      // Initialize shortcode views with a default view
      setShortcodeViews([
        {
          expressionId: null,
          fieldId: null,
          conditionId: null,
          value: "",
          operator: "",
          expressionValue1:null,
          expressionValue2:null
        },
      ]);
      setExpressionDDViews([
        {
          expressionId: null,
          value: false,
          expValue1: false,
          expValue2: false
        }
      ]);
      setDependentShortcodeViews([
        {
          depententId: null,
          condition: null,
          operator: null,
        },
      ]);


    

    }
  };
  
  // Call initializeFields in useEffect when editData is available
  useEffect(() => {
    reset();
    initializeFields(props.editData);
  }, [props.editData]);


  useEffect(() => {
    getAllShortcodeDD();
    if (window.CKEDITOR) {
      // Modify CKEditor configuration here
      window.CKEDITOR.config.allowedContent = true; // Adjust CKEditor configuration as needed
      window.CKEDITOR.config.versionCheck = false;
      window.CKEDITOR.config.toolbar = [
        {
          name: "document",
          items: [
            "Source",
            "-",
            "Save",
            "NewPage",
            "ExportPdf",
            "Preview",
            "Print",
            "-",
            "Templates",
          ],
        },
        {
          name: "clipboard",
          items: [
            "Cut",
            "Copy",
            "Paste",
            "PasteText",
            "PasteFromWord",
            "-",
            "Undo",
            "Redo"
          ],
        },
        {
          name: "editing",
          items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
        },
        {
          name: "forms",
          items: [
            "Form",
            "Checkbox",
            "Radio",
            "TextField",
            "Textarea",
            "Select",
            "Button",
            "ImageButton",
            "HiddenField",
          ],
        },
        "/",
        {
          name: "basicstyles",
          items: [
            "Bold",
            "Italic",
            "Underline",
            "Strike",
            "Subscript",
            "Superscript",
            "-",
            "CopyFormatting",
            "RemoveFormat",
          ],
        },
        {
          name: "paragraph",
          items: [
            "NumberedList",
            "BulletedList",
            "-",
            "Outdent",
            "Indent",
            "-",
            "Blockquote",
            "CreateDiv",
            "-",
            "JustifyLeft",
            "JustifyCenter",
            "JustifyRight",
            "JustifyBlock",
            "-",
            "BidiLtr",
            "BidiRtl",
            "Language",
          ],
        },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        {
          name: "insert",
          items: [
            "Image",
            "Table",
            "HorizontalRule",
            "Smiley",
            "SpecialChar",
            "PageBreak",
            "Iframe",
          ],
        },
        "/",
        { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
        { name: "Line Height", items: ["lineheight"] },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "tools", items: ["Maximize", "ShowBlocks"] },
        { name: "about", items: ["About"] },

      ];
      // Add more font names to the font dropdown
      window.CKEDITOR.config.font_names =
        "Arial/Arial, Helvetica, sans-serif;" +
        "Times New Roman/Times New Roman, Times, serif;" +
        "Verdana/Verdana, Geneva, sans-serif;" +
        "Century Gothic/Century Gothic, sans-serif;" +
        "Georgia/Georgia, serif;" +
        "Comic Sans MS/Comic Sans MS, cursive;" +
        "Trebuchet MS/Trebuchet MS, sans-serif;" +
        "Palatino Linotype/Palatino Linotype, Book Antiqua, Palatino, serif;" +
        "Arial Black/Arial Black, Gadget, sans-serif;" +
        "Tahoma/Tahoma, Geneva, sans-serif;" +
        "Courier New/Courier New, Courier, monospace;" +
        "Impact/Impact, Charcoal, sans-serif;" +
        "Lucida Console/Lucida Console, Monaco, monospace;";

      // You can continue to add more fonts in the same format

      // Optional: Set the default font
      // window.CKEDITOR.config.fontSize_defaultLabel = '14px';
      window.CKEDITOR.config.font_defaultLabel = "Arial";


      window.CKEDITOR.config.line_height =
        "1/1;" +
        "1.5/1.5;" +
        "2/2;" +
        "2.5/2.5;" +
        "3/3";
      window.CKEDITOR.config.line_height_defaultLabel = "1.5";

    }




  }, []);

  const handleEditorReady = (editorName, event) => {
   
    shortCodeEditor.current = event.editor
    if (shortCodeEditor.current) {
      shortCodeEditor.current.setData(
        props?.editData?.details ?? ""
      );
    }
  };
  const handelIsdependent = async () => {
    setIsDependent(!isDependent);
  }


  return (
    <Modal
      centered
      show={showAddShortcodeModal || showShortcodeEditModal}
      onHide={handleCloseShortcodeModal}
      dialogClassName="modal-60w"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton className="modal-header-section">
        <Modal.Title id="contained-modal-title-vcenter" className="ml-4">
          {isEditMode ? "Edit Shortcode" : "Add Shortcode"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example inside-padding user-modal">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Container fluid>
            <Row className="mb-3">
              {/* Shortcode Name */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Shortcode Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="shortcodeName"
                  {...register("shortcodeName", {
                    required: " Shortcode name required",
                  })}
                />
                {errors.shortcodeName && (
                  <span className="text-danger">{errors.shortcodeName.message}</span>
                )}
              </Col>

              {/* Shortcode Tag */}
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Label className="newSize">
                  Shortcode Tag <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="form-control-add-user newSize"
                  name="shortcodeTag"
                  {...register("shortcodeTag", {
                    required: " Shortcode Tag required",
                  })}
                />
                {errors.shortcodeTag && (
                  <span className="text-danger">{errors.shortcodeTag.message}</span>
                )}
              </Col>
              <Col lg={4} md={6} xs={12} className="mb-3">
                <Form.Group controlId="isDependent">
                  <Form.Label></Form.Label>
                  <Form.Check
                    label="Is dependent shortcode?"
                    className='me-3'
                    type='checkbox'
                    placeholder='Is dependent shortcode?'
                    checked={isDependent}
                    {...register("isDependent", {
                      onChange: (e) => { handelIsdependent() }
                    })}
                  // onChange={(e) => {
                  //   setIsDependent(e.target.value); // Set the state based on the selected value
                  // }}
                  // defaultChecked={roleDetails.isAdd}
                  />
                </Form.Group>
              </Col>




              {isDependent === false ? (
                //  Shortcode Views 
                <Col lg={12} className="mb-3">
                  <h6 className="mt-3 mb-3">
                    Shortcode Views
                    <span className="add-shortcode mx-3">
                      <Button
                        className="btn-equpt"
                        variant="secondary"
                        size="sm"
                        onClick={addShortcodeView}
                      >
                        <BiPlus />
                      </Button>
                    </span>
                  </h6>

                  {shortcodeViews.map((shortcode, index) => (
                    <Row key={index} className="mb-2">
                      <Col sm={2}>
                        <Form.Label className="newSize">
                          Expression <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={control}
                          name={`expressionName${index}`}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={expressionOptions}
                                className={`expressionName${index}`}
                                {...register(`expressionName${index}`, {
                                  required: "Expression Name required",
                                  validate: shortcode.expressionId ==="" || "Expression Name required",
                                })}
                                defaultValue={
                                  Array.isArray(expressionOptions)
                                    ? expressionOptions.find((option) => option.value === shortcode.expressionId)
                                    : null
                                }
                                placeholder="Select Expression"
                                onChange={(e) => {
                                  handleExpressionChange(e.value, e.valueField, e.expValueField, index)
                                  setValue(`expressionName${index}`, e);
                                  // setValue(`compareName${index}`, `${e.label}(${getValues(`fieldName${index}`)})`);
                                }}
                                clearButton
                              />
                              {errors[`expressionName${index}`] && (
                                <span className="text-danger">{errors[`expressionName${index}`].message}</span>
                              )}
                            </>
                          )}
                        />

                        {/* <Select
                         options={expressionOptions}
                         className={`expressionName${index}`}
                         defaultValue={
                           Array.isArray(expressionOptions)
                             ? expressionOptions.find((option) => option.value === shortcode.expressionId)
                             : null
                         }
                         onChange={(e) => {
                           handleExpressionChange(e.value, index)
                           setValue(`expressionName${index}`, e.label); // Set the expression name
                           setValue(`compareName${index}`, `${e.label}(${getValues(`fieldName${index}`)})`);
                         }}
                         // {...register(`expressionName${index}`, {
                         //   required: "Expression Name required",
                         // })}
                       />
                        {errors[`expressionName${index}`] && (
                         <span className="text-danger">{errors[`expressionName${index}`].message}</span>
                       )} */}
                      </Col>


                      <Col sm={2}>
                        <Form.Label className="newSize">
                          Field <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={control}
                          name={`fieldName${index}`}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={fieldOptions}
                                className={`fieldName${index}`}
                                {...register(`fieldName${index}`, {
                                  required: "Field Name required",
                                  validate: shortcode.fieldId ==="" || "Field Name required",
                                })}
                                defaultValue={
                                  Array.isArray(fieldOptions)
                                    ? fieldOptions.find((option) => option.value === shortcode.fieldId)
                                    : null
                                }
                                placeholder="Select Field"
                                onChange={(e) => {
                                  handleFieldChange(e.value, index)
                                  setValue(`fieldName${index}`, e); // Save the selected field name
                                  // setValue(`compareName${index}`, `${getValues(`expressionName${index}`)}(${e.label})`);
                                }}
                              />
                              {errors[`fieldName${index}`] && (
                                <span className="text-danger">{errors[`fieldName${index}`].message}</span>
                              )}
                            </>
                          )}
                        />


                        {/* <Select
                         options={fieldOptions}
                         className={`fieldName${index}`}
                         defaultValue={
                           Array.isArray(fieldOptions)
                             ? fieldOptions.find((option) => option.value === shortcode.fieldId)
                             : null
                         }
                         onChange={(e) => {
                           handleFieldChange(e.value, index)
                           setValue(`fieldName${index}`, e.label); // Save the selected field name
                           setValue(`compareName${index}`, `${getValues(`expressionName${index}`)}(${e.label})`);
                         }}
                       /> */}
                      </Col>
                      {/* <Col sm={2}>
                       <Form.Label className="newSize">
                         Compare <span className="text-danger">*</span>
                       </Form.Label>
                       <div className="short-code-fix-inside">
                         <Form.Control
                           type="text"
                           size="sm"
                           className="form-control-add-user newSize"
                           name={`compareName${index}`}
                           {...register(`compareName${index}`)}
                           readOnly
                         />
                       </div>
                     </Col> */}
                      <Col sm={2}>
                        <Form.Label className="newSize">
                          Condition <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={control}
                          name={`conditionName${index}`}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={conditionOptions}
                                className={`conditionName${index}`}
                                {...register(`conditionName${index}`, {
                                  required: "Condition Name required",
                                  validate: shortcode.conditionId === "" || shortcode.conditionId === null || "Condition Name required",
                                })}
                                defaultValue={
                                  Array.isArray(conditionOptions)
                                    ? conditionOptions.find((option) => option.value === shortcode.conditionId)
                                    : null
                                }
                                placeholder="Select Condition"
                                onChange={(e) => {
                                  handleConditionChange(e.value, index)
                                  setValue(`conditionName${index}`, e);
                                }}
                              />
                              {errors[`conditionName${index}`] && (
                                <span className="text-danger">{errors[`conditionName${index}`].message}</span>
                              )}
                            </>
                          )}
                        />

                        {/* <Select
                         options={conditionOptions}
                         defaultValue={
                           Array.isArray(conditionOptions)
                             ? conditionOptions.find((option) => option.value === shortcode.conditionId)
                             : null
                         }
                         onChange={(e) => handleConditionChange(e.value, index)}
                       /> */}

                      </Col>


                      {/* value */}
                        {expressionDDViews[index].value === true? (
                      // {shortcode.expressionId !== 5 ? (
                        <Col sm={3}>
                          <Form.Label className="newSize">
                            Value
                          </Form.Label>
                          {/* <div className="short-code-fix-inside"> */}
                          {/* <Controller
                          control={control}
                          name={`value${index}`}
                          render={({ field }) => (
                            <>
                              <input
                                {...field}
                                type="number"
                                // className="form-control-add-user newSize"
                                // name="shortcodeValue"
                                {...register(`shortcodeValue${index}`, {
                                  required: "Value required",
                                })}
                                defaultValue={shortcode.value}
                                placeholder="Enter Value"
                                onChange={(e) => handleValueChange(e.target.value, index)}
                              />
                              {errors[`shortcodeValue${index}`] && (
                                <span className="text-danger">{errors[`shortcodeValue${index}`].message}</span>
                              )}
                            </>
                          )}
                        />
                        </div> */}



                          <div className="short-code-fix-inside">
                            <Form.Control
                              type="text"
                              size="sm"
                              className="form-control-add-user newSize"
                              name="shortcodeValue"
                              defaultValue={shortcode.value}
                              onChange={(e) => handleValueChange(e.target.value, index)}
                              {...register(`shortcodeValue${index}`, {
                                required: "Value required",
                                onChange: (e) => {
                                handleValueChange(e.target.value, index);
                                },
                              })}
                            />
                            {errors[`shortcodeValue${index}`] && (
                              <span className="text-danger">{errors[`shortcodeValue${index}`].message}</span>
                            )}
                          </div>
                        </Col>
                      ) : null}

                      {/* Expression value1 */}
                      {/* {isExpVal1 === true ? ( */}
                      {/* {shortcode.expressionId >= 2 && shortcode.expressionId <= 5 ? ( */}
                        {expressionDDViews[index].expValue1 === true? (
                        <Col sm={2}>
                          <Form.Label className="newSize">
                            Expression Value 1
                          </Form.Label>
                          <div className="short-code-fix-inside">
                            <Form.Control
                              type="text"
                              size="sm"
                              className="form-control-add-user newSize"
                              name="expressionValue1"
                              defaultValue={shortcode.expressionValue1}
                              // onChange={(e) => handleExpValue1Change(e.target.value, index)}
                              {...register(`expressionValue1${index}`, {
                                required: "Expression Value required",
                                onChange: (e) => {
                                  handleExpValue1Change(e.target.value, index);
                                },
                              })}
                            />
                            {errors[`expressionValue1${index}`] && (
                              <span className="text-danger">{errors[`expressionValue1${index}`].message}</span>
                            )}
                          </div>
                        </Col>
                      ) : null}

                      {/* Expression value2 */}
                      {/* {isExpVal2 === true ? ( */}
                      {/* {shortcode.expressionId === 5 ? ( */}
                        {expressionDDViews[index].expValue2 === true? (
                        <Col sm={2}>
                          <Form.Label className="newSize">
                            Expression Value 2
                          </Form.Label>
                          <div className="short-code-fix-inside">
                            <Form.Control
                              type="text"
                              size="sm"
                              className="form-control-add-user newSize"
                              name="expressionValue2"
                              defaultValue={shortcode.expressionValue2}
                              // onChange={(e) => handleExpValue2Change(e.target.value, index)}
                              {...register(`expressionValue2${index}`, {
                                required: "Expression Value required",
                                onChange: (e) => {
                                  handleExpValue2Change(e.target.value, index);
                                },
                              })}
                            />
                            {errors[`expressionValue2${index}`] && (
                              <span className="text-danger">{errors[`expressionValue2${index}`].message}</span>
                            )}
                          </div>
                        </Col>
                      ) : null}
                      <Col sm={1}>
                        <div className="btn-equt">
                          <span className="add-sort-code">
                            <Button
                              className="btn-equpt"
                              variant="secondary"
                              size="sm"
                              onClick={() => removeShortcodeView(index)}
                            >
                              <BiMinus />
                            </Button>
                          </span>
                        </div>
                      </Col>
                      {index < shortcodeViews.length - 1 && (
                        <Col sm={12} className="text-center m-3">
                          <Form.Label className="newSize">Operator <span className="text-danger">*</span></Form.Label>
                          <div>
                            <Controller
                              control={control}
                              name={`operator${index}`}
                              rules={{
                                validate: {
                                  operatorRequired: (value) => shortcode.operator === 'and' || shortcode.operator === 'or' || 'Operator is required',
                                },
                              }}
                              defaultValue={shortcode.operator} // Set the initial value here
                              render={({ field }) => (
                                <>
                                  <Form.Check
                                    inline
                                    type="radio"
                                    id={`operator-and-${index}`}
                                    label="AND"
                                    value="and"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleOperatorChange('and', index); // Call your custom onChange handler
                                    }}
                                    defaultChecked={field.value === 'and'}
                                  />
                                  <Form.Check
                                    inline
                                    type="radio"
                                    id={`operator-or-${index}`}
                                    label="OR"
                                    value="or"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleOperatorChange('or', index); // Call your custom onChange handler
                                    }}
                                    defaultChecked={field.value === 'or'}
                                  />
                                </>
                              )}
                            />

                          </div>
                          {errors[`operator${index}`] && (
                            <span className="text-danger">{errors[`operator${index}`].message}</span>
                          )}
                        </Col>





                      )}
                    </Row>
                  ))}
                </Col>
              ) : (
                //Dependent Shortcode Views 
                <Col lg={12} className="mb-3">
                  <h6 className="mt-3 mb-3">
                    Dependent Shortcode Views
                    <span className="add-shortcode mx-3">
                      <Button
                        className="btn-equpt"
                        variant="secondary"
                        size="sm"
                        onClick={addDependentShortcodeView}
                      >
                        <BiPlus />
                      </Button>
                    </span>
                  </h6>

                  {dependentShortcodeViews.map((dependentShortcode, dependentIndex) => (
                    <Row key={dependentIndex} className="mb-2">
                      <Col sm={4}>
                        <Form.Label className="newSize">
                          Dependent Shortcode Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={control}
                          name={`shortcodeName${dependentIndex}`}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={shortcodeDD}
                                name={`shortcodeName${dependentIndex}`}
                                {...register(`shortcodeName${dependentIndex}`, {
                                  required: "Shortcode Name required",
                                  validate: dependentShortcode.depententId === "" && "Shortcode jName required",
                                })}
                                defaultValue={
                                  Array.isArray(shortcodeDD)
                                    ? shortcodeDD.find((option) => option.value === dependentShortcode.depententId)
                                    : null
                                }
                                placeholder="Select Shortcode"
                                onChange={(e) => {
                                  handleDependentShortcodeChange(e.value, dependentIndex)
                                  setValue(`shortcodeName${dependentIndex}`, e);
                                  // setValue(`compareName${dependentIndex}`, `${e.label}(${getValues(`fieldName${dependentIndex}`)})`);
                                }}
                                clearButton
                              />
                              {errors[`shortcodeName${dependentIndex}`] && (
                                <span className="text-danger">{errors[`shortcodeName${dependentIndex}`].message}</span>
                              )}
                            </>
                          )}
                        />
                      </Col>

                      <Col sm={4}>
                        <Form.Label className="newSize">
                          Condition <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                          control={control}
                          name={`dependentConditionName${dependentIndex}`}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={dependentCondition}
                                className={`dependentConditionName${dependentIndex}`}
                                {...register(`dependentConditionName${dependentIndex}`, {
                                  required: "Condition required",
                                  validate: dependentShortcode.condition === "" && "Condition required",
                                })}
                                defaultValue={
                                  Array.isArray(dependentCondition)
                                    ? dependentCondition.find((option) => option.value === dependentShortcode.condition)
                                    : null
                                }
                                // defaultValue={value=dependentShortcode.condition}
                                placeholder="Select Condition"
                                onChange={(e) => {
                                  handleDependentConditionChange(e.value, dependentIndex)
                                  setValue(`dependentConditionName${dependentIndex}`, e);
                                }}
                              />
                              {errors[`dependentConditionName${dependentIndex}`] && (
                                <span className="text-danger">{errors[`dependentConditionName${dependentIndex}`].message}</span>
                              )}
                            </>
                          )}
                        />
                      </Col>

                      <Col sm={1}>
                        <div className="btn-equt">
                          <span className="add-sort-code">
                            <Button
                              className="btn-equpt"
                              variant="secondary"
                              size="sm"
                              onClick={() => removeDependentShortcodeView(dependentIndex)}
                            >
                              <BiMinus />
                            </Button>
                          </span>
                        </div>
                      </Col>

                      {dependentIndex < dependentShortcodeViews.length - 1 && (
                        <Col sm={12} className="text-center m-3">
                          <Form.Label className="newSize">Operator <span className="text-danger">*</span></Form.Label>
                          <div>
                            <Controller
                              control={control}
                              name={`dependentOperator${dependentIndex}`}
                              rules={{
                                validate: {
                                  operatorRequired: () => dependentShortcode.operator === 'and' || dependentShortcode.operator === 'or' || 'Operator is required',
                                },
                              }}
                              defaultValue={dependentShortcode.operator} // Set the initial value here
                              render={({ field }) => (
                                <>
                                  <Form.Check
                                    inline
                                    type="radio"
                                    label="AND"
                                    value="and"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleDependentOperatorChange('and', dependentIndex); // Call your custom onChange handler
                                    }}
                                    defaultChecked={field.value === 'and'}
                                  />
                                  <Form.Check
                                    inline
                                    type="radio"
                                    label="OR"
                                    value="or"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleDependentOperatorChange('or', dependentIndex); // Call your custom onChange handler
                                    }}
                                    defaultChecked={field.value === 'or'}
                                  />
                                </>
                              )}
                            />
                          </div>
                          {errors[`dependentOperator${dependentIndex}`] && (
                            <span className="text-danger">{errors[`dependentOperator${dependentIndex}`].message}</span>
                          )}
                        </Col>
                      )}
                    </Row>
                  ))}

                </Col>
              )}


              {/* Content Type */}
              <Col lg={12} className="mb-3">
                <Row>
                  <Col lg={2} >
                    <span className="mt-3 mb-3"> Content Type : </span>
                  </Col>
                  <Col lg={1} >
                    <input
                      type="radio"
                      value="All"
                      checked={selectContentType === "All"}
                      onChange={() => setSelectContentType("All")}
                    />
                    All
                  </Col>
                  <Col lg={1}  >
                    <input
                      type="radio"
                      value="Text"
                      checked={selectContentType === "Text"}
                      onChange={() => setSelectContentType("Text")}
                    />
                    Text
                  </Col>
                  <Col lg={1} >
                    <input
                      type="radio"
                      value="Table"
                      checked={selectContentType === "Table"}
                      onChange={() => setSelectContentType("Table")}
                    />
                    Table
                  </Col>
                </Row>

              </Col>


              {selectContentType === "All" || selectContentType === "Text" ? (
                <Col lg="12" className="mb-3">
                  <Form.Label className="newSize">
                    Details <span className="text-danger">*</span>
                  </Form.Label>
                  <CKEditor
                    data='' // Initial empty data
                    onReady={(editor) => {
                    }}
                    onChange={(event) => {
                      const data = event.editor.getData()
                      setShortcodeDetails(data)
                    }}

                    config={{
                      language: 'en',
                      height: 300,
                      filebrowserImageBrowseUrl: 'http://siaqreporting.com/LiveEditor/assetmanager/asset.php', // Path to your PHP file browser script

                      on: {
                        instanceReady: (event) => {
                          // Call handleEditorReady and pass the editor instance
                          handleEditorReady('shortCodeEditor', event);
                          // Call the original on.instanceReady function if needed
                          // ...
                        },
                      },
                      // Other configurations...
                    }}
                  />




                </Col>
              ) : null}

              {selectContentType === "All" || selectContentType === "Table" ? (
                <Col lg="12" className="mb-3">
                  <Form.Label className="newSize">
                    Select Table Column <span className="text-danger">*</span>
                  </Form.Label>
                  <DualListBox
                    icons={{
                      moveLeft: '<',
                      moveAllLeft: '<<',
                      moveRight: '>',
                      moveAllRight: '>>'
                    }}
                    options={shortcodeTableColumnOption}
                    selected={selected}
                    onChange={(value) => setSelected(value)}
                  />
                </Col>
              ) : null}

            </Row>




          </Container>

          {/* Submit Button */}
          <Button style={{ float: "right" }} className="mt-3" type="submit">
            {isEditMode ? "Update Shortcode" : "Add Shortcode"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
