import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { userAtom } from "../Atom/CommonAtom";
import Logoicon from "../assets/images/SIAQ-logo-95px.svg";
import SidebarButton from "./SidebarButton";
// import { useMediaQuery } from "react-responsive";


import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";


import { LuLayoutDashboard, LuUser2, LuUsers, LuSchool, LuClipboardList, LuUserCircle,LuMap } from "react-icons/lu";


import { useDispatch } from 'react-redux';
import { logout, selectUser } from "../Redux/Userslice";
import { useRecoilState } from 'recoil';
import Swal from 'sweetalert2'
import { ErrorToast, SuccessToast } from "../util/customToast/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ManageSurveyThreshold } from "../pages/ManageSurveyThreshold";
// import { faCheckSquare, faCoffee, } from '@fortawesome/fontawesome-free-solid'



const Sidebar = (props) => {

  const {
    collapsed,
    toggled,
    setCollapsed,
    setToggled
  } = props;


  // const [isMobileView, setIsMobileView] = useState(false); // State variable for mobile view
  // const isMobile = useMediaQuery({ maxWidth: 768 });
  // const isMobile = useMediaQuery({ maxWidth: 768 }); // Define a mobile screen size
  // const [collapsed, setCollapsed] = useState(isMobile); // Initially set to collapsed on mobile, open on desktop
  // if (isMobile && !isMobileView) {
  //   setIsMobileView(true);
  // } else if (!isMobile && isMobileView) {
  //   setIsMobileView(false);
  // }
  const [showManageSurveyThresholdModal, setShowManageSurveyThresholdModal] = useState(false);
  const [userData, setUserData] = useRecoilState(userAtom);
  let navigate = useNavigate();


  const dispatch = useDispatch();
  const handleLogout = (e) => {
    // SuccessToast("Successfully logged out!!");
    e.preventDefault();
    Swal.fire({
      title: 'Please confirm',
      text: "Do you want to logout this session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        SuccessToast("Successfully logged out!!");
        dispatch(logout());
        // SuccessToast("Successfully logged out!!");
      }
    })
    // dispatch(logout());
  };


  let sidebarContentListing;
  if (userData.menu.length > 0) {
    sidebarContentListing =
      userData.menu.length > 0 ? (
        userData.menu.map((menu) => (
          <Menu
            style={{
              paddingTop: "0px",
              paddingBottom: "0px",
              fontFamily: "sans-serif",
              fontSize: "20px",
            }}
            iconShape="circle"
            title={menu.menuName}
          >
            {menu.child.length > 0 ? (
              <SubMenu
                title={menu.menuName}
                icon={
                  (() => {
                    if (menu.menuName === 'Clients') {
                      return (
                        <LuUsers size={25} />
                      )
                    } else if (menu.menuName === 'Jobs') {
                      return (
                        <LuSchool size={25} />
                      )
                    }
                    else if (menu.menuName === 'Reports') {
                      return (
                        <LuClipboardList size={25} />
                      )
                    } else if(menu.menuName ==='Location Management'){
                      return(
                        <LuMap size={25}/>
                      )
                    }else {
                      return (
                        <LuUserCircle size={25} />
                      )
                    }
                  })()

                }
                style={{ fontSize: "19px" }}
              >
                {menu.child.map((child, index) => (
                  <MenuItem

                    style={{ fontSize: "18px" }}
                    key={index}
                    title={child.menuName}
                    // icon={<FontAwesomeIcon icon={child.menuIcon} />}
                    onClick={(e) =>
                      onClickMenuItem(e, child.module, menu.menuName, child)
                    }
                  >
                    {child.menuName}
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <>
                <MenuItem

                  style={{ fontSize: "19px" }}
                  title={menu.label}
                  icon={
                    (() => {
                      if (menu.menuName === 'Dashboard') {
                        return (
                          <LuLayoutDashboard size={25} />
                        )
                      } else if (menu.menuName === 'Users') {
                        return (
                          <LuUser2 size={25} />
                        )
                      } else {
                        return (
                          ''
                        )
                      }
                    })()

                  }
                  onClick={(e) =>
                    onClickMenuItem(e, menu.module, menu.menuName, menu)
                  }
                >
                  <a href="dashboard">
                    <span className="mtext">{menu.menuName}</span>
                  </a>
                </MenuItem>
              </>
            )}
          </Menu>
        ))
      ) : (
        <></>
      );
  }
  const onClickMenuItem = (e, targetUrl, labelName, menuId) => {
    // console.log(labelName);
    // console.log(targetUrl);
    e.preventDefault();

    const userId = 1;

    if (targetUrl === '/manageSurveyThreshold') {
      setShowManageSurveyThresholdModal(true);
    }

    if (targetUrl !== '/manageSurveyThreshold') {
      navigate(`${targetUrl}`);
      navigate({
        pathname: `${targetUrl}`,
        state: { menuId: menuId?.value },
      });
    }
  };

  const handleCloseManageSurveyThresholdModal = () => {
    setShowManageSurveyThresholdModal(false)
    // fetchUsers(1);
  };


  const ManageSurveyThresholdProps = {
    showManageSurveyThresholdModal,
    handleCloseManageSurveyThresholdModal,
    // CountryAll,
  };



  return (
    <>


      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
      // breakpoints={ sm: 400 }
      >
        {/* Header */}
        <SidebarHeader>

          {/* <SidebarContent>{sidebarContent}</SidebarContent> */}
          <Menu iconShape="circle">
            <MenuItem>
              <div>
                <img
                  src={Logoicon}
                  alt="SIAQ"
                  className="brand-image"
                  style={{ opacity: 1 }}
                />
              </div>
            </MenuItem>
          </Menu>
        </SidebarHeader>
        {/* Content */}

        {/* <SidebarContent>{sidebarContent}</SidebarContent> */}
        <SidebarContent>{sidebarContentListing}</SidebarContent>
        {/* Footer */}
        <SidebarFooter style={{ textAlign: "center" }}>
          <div className="sidebar-btn-wrapper" style={{ padding: "16px" }}>
            <p>
              Proactive Indoor Air Quality Reporting System
            </p>
          </div>
        </SidebarFooter>
      </ProSidebar>


      <ManageSurveyThreshold {...ManageSurveyThresholdProps} onHide={() => setShowManageSurveyThresholdModal(false)} />

    </>

  );
};

export default Sidebar;
