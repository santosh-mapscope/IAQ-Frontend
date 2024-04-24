/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  axiosInstance,
  headersForJwt,
  headersForJwtWithJson,
} from "../../util/axiosConfig";
import Select from "react-select";
import Accordion from "react-bootstrap/Accordion";
import NestedCheckbox from "./NestedCheckbox";
import { Container } from "react-bootstrap";

import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import toast, { Toaster } from "react-hot-toast";
import {
  SuccessToastWithToastId,
  ErrorToastWithToastId,
} from "../../util/customToast";
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';

const userData = JSON.parse(localStorage.getItem('user'));
// import { async } from "q";

function RoleMenu() {
  const [isChecked, setIsChecked] = useState(false);
  const [roleList, setRoleList] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [menuData, setMenuData] = useState([]); // State to hold the menu data
  const [checkedMenuData, setCheckedMenuData] = useState({}); // State to hold the menu data
  const [checked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const { register, control, reset } = useForm();
  
  const getMenuByRoleId = (id, flag) => {
    let formData = new FormData();
    formData.append("roleId", id);
    formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("master/getMenuByRoleId", formData, { headers: headersForJwt })
      .then((res) => {
        if (flag == 0) {
          let menuI = [];
          let menuCheckData = {};
          res.data.data.list.map((item) => {
            if (item.parentId == 0) {
              let child = [];
              res.data.data.list.map((item2) => {
                if (item2.parentId != 0 && item2.parentId == item.menuId) {
                  child.push(item2);
                }
              });
              item.child = child;
              menuI.push(item);
            }
            menuCheckData[item.menuId] = false;
          });
          setMenuData(menuI);
          setCheckedMenuData(menuCheckData);
        } else {
          // let checkedMenu = [];
          // setCheckedMenuData(checkedMenu);
          // res.data.data.list.map((item) => {
          //   checkedMenu.push(item.menuId);
          // });
          // setCheckedMenuData(checkedMenu);
          // if(Object.keys(res.data.data).length > 0){
          //   res.data.data.list.map((item) => {
          //   checkedMenuData[item.menuId] = true;
          // });
          if (Object.keys(res.data.data).length > 0) {
            const updatedCheckedMenuData = {};
            res.data.data.list.forEach((item) => {
              updatedCheckedMenuData[item.menuId] = true;
            });
          
            // Set rest of the keys to false
            Object.keys(checkedMenuData).forEach((menuId) => {
              if (!(menuId in updatedCheckedMenuData)) {
                updatedCheckedMenuData[menuId] = false;
              }
            });
          
            setCheckedMenuData(updatedCheckedMenuData);
          } else {
            setAllCheckedToFalse();
          }
        }
      })
      .catch((err) => {
      });
  };

  const setAllCheckedToFalse = () => {
    const updatedCheckedMenuData = { ...checkedMenuData };
    Object.keys(updatedCheckedMenuData).forEach((menuId) => {
      updatedCheckedMenuData[menuId] = false;
    });
    setCheckedMenuData(updatedCheckedMenuData);
  };

  // const generateCheckboxTree = (data) => {
  //   return data.map((item) => {
  //     if (item.child && item.child.length > 0) {
  //       return (
  //         <NestedCheckbox key={item.menuId} label={item.menuName} //item.parentId}
  //           isChecked={checkedMenuData[item.menuI]}
  //           onChange={() => handleCheckboxChange(item.menuId, item.parentId)}
  //         >
  //           {generateCheckboxTree(item.child)}
  //         </NestedCheckbox>
  //       );
  //     } else {
  //       return (<NestedCheckbox key={item.menuId} label={item.menuName} parent={item.parentId}
  //         isChecked={checkedMenuData[item.menuId]}
  //         onChange={() => handleCheckboxChange(item.menuId, item.parentId)}
  //       />);
  //     }
  //   });
  // };

  const generateCheckboxTree = (data) => {
    return data.map((item) => {
      const isParent = item.child && item.child.length > 0;
      const isChecked = checkedMenuData[item.menuId];

      const handleParentCheckboxChange = (checked) => {
        // Update the parent and its children
        handleCheckboxChange(item.menuId, item.parentId, checked);

        // If it's a parent, recursively update its children
        if (isParent) {
          data[item.parentId].child.forEach(() => {
            handleParentCheckboxChange(checked);
          });
        }
      };

      return (
        <NestedCheckbox
          key={item.menuId}
          label={item.menuName}
          parent={item.parentId}
          isChecked={isChecked}
          onChange={(checked) => handleParentCheckboxChange(checked)}
        >
          {isParent ? generateCheckboxTree(item.child) : null}
        </NestedCheckbox>
      );
    });
  };

  const getAllRoleDD = async () => {
    let formData = new FormData();
    formData.append("userId", userData.userDetails.userId);
    axiosInstance
      .post("master/getRoleForRoleMenuDD", formData, { headers: headersForJwt })
      .then((res) => {
        const data = [
          { value: "0", label: "Select Role", isDisabled: true },
          ...res.data.data.list.map((item) => ({
            value: item.id.toString(), // Convert id to string, if needed
            label: item.name,
          })),
        ];
        setRoles(data);
      })
      .catch((err) => {
      });
  };

  const saveRoleMenu = () => {
    if (roleId == "" || roleId == null) {
      const toastId = toast.loading("Loading...");
      ErrorToastWithToastId("Select One Role Name..", toastId);
      return false;
    }
    const checkedMenuIds = Object.keys(checkedMenuData).filter(
      (menuId) => checkedMenuData[menuId] === true
    );

    const data = {
      userId: userData.userDetails.userId,
      menuId: checkedMenuIds,
    };
    let formData = new FormData();
    formData.append("roleId", roleId);
    formData.append("data", JSON.stringify(data));

    Swal.fire({
      title: "Please confirm",
      text: "Do you want to update this menu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Loading...");
        axiosInstance
          .post("master/updateRoleMenu", formData, { headers: headersForJwt })
          .then((res) => {
            toast.dismiss(toastId);
            if (res && res.data.status === 1) {
              Swal.fire({
                icon: "success",
                // title: "Role Created Successfully",
                text: "Menu updated successfully please logout to check",
                showConfirmButton: false,
                timer: 2000,
              });
              getAllRoleDD();
              getMenuByRoleId(-1, 0);
              reset({ roleId });
            } else {
              Swal.fire({
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 2000,
              });
            }
          })
          .catch(() => {
            toast.dismiss(toastId);
            Swal.fire({
              icon: "error",
              title: "Menu updation failed. Try after some time",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    });
  };

  useEffect(() => {
    getAllRoleDD();
    getMenuByRoleId(-1, 0);
  }, []);

  const handleRoleChange = (data) => {
    setRoleId(data); // Update the RoleId when the select input changes
    getMenuByRoleId(data, 1);
  };

  const handleCheckboxChange = (menuId, parentId, checked) => {
    const updatedCheckedMenuData = { ...checkedMenuData };

    // Function to recursively update child checkboxes
    const toggleChildCheckboxes = (menuItem) => {
      if (menuItem.child && menuItem.child.length > 0) {
        menuItem.child.forEach((childItem) => {
          updatedCheckedMenuData[childItem.menuId] =
            updatedCheckedMenuData[menuId];
          toggleChildCheckboxes(childItem);
        });
      }
    };

    // Update the checkbox for the clicked menuId
    updatedCheckedMenuData[menuId] = !updatedCheckedMenuData[menuId];

    // Check/uncheck parent checkboxes
    const menuItem = menuData.find((item) => item.menuId === menuId);
    if (menuItem) {
      toggleChildCheckboxes(menuItem);
    }

    const parentMenuItem = menuData.find((item) => item.menuId === parentId);
    if (parentMenuItem) {
      if (checked == true) {
        updatedCheckedMenuData[parentMenuItem.menuId] = true;
      } else {
        const check = parentMenuItem.child.every(
          (childItem) => updatedCheckedMenuData[childItem.menuId] === false
        );
        if (check == true) {
          updatedCheckedMenuData[parentMenuItem.menuId] = false;
        }
      }
    }
    setCheckedMenuData(updatedCheckedMenuData);
  };

  return (
    <>
      <Helmet title={"Role Menu | IAQ Reporting System"} />
      <Toaster position="top-center" className="toster" reverseOrder={false} />
      <div className="content-wrapper role-box">
        <div className="content-header">
          <div className="container-fluid">
            <h5 className="m-0 mt-3 mb-2">Role Menu Listing</h5>
            {/* <div className="row mt-4 ml-2">Role Menu Listing</div> */}
          </div>
        </div>
      </div>
      <section>
        <div className="role-box">
          <div className="col-lg-4 mt-3 mb-3">
            <Controller
              control={control}
              name="roleId"
              {...register("roleId")}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    size="sm"
                    options={roles}
                    placeholder="Select Role Name"
                    name="roleId"
                    onChange={(e) => {
                      field.onChange(e);
                      handleRoleChange(e.value);
                    }}
                    clearButton
                  />
                </>
              )}
            />
          </div>
          <Container fluid>
            {generateCheckboxTree(menuData)}{" "}
            {/* Render the generated checkbox tree */}
            <button
              onClick={() => saveRoleMenu()}
              className="btn btn-primary fz-14 mt-3"
            >
              Save
            </button>
          </Container>

          {/* <Container fluid>
            <NestedCheckbox
              label="Parent Checkbox"
              isChecked={isChecked}
              onChange={(value) => setIsChecked(value)} 
              
            >
              <NestedCheckbox label="Child Checkbox 1" isChecked={isChecked} />
              <NestedCheckbox label="Child Checkbox 2" isChecked={isChecked} />
            </NestedCheckbox>
          </Container> */}
        </div>
      </section>
    </>
  );
}
export default RoleMenu;
