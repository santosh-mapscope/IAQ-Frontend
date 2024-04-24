import React from "react"; 
 
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../assets/plugins/fontawesome-free/css/all.min.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';  
import { Outlet } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import '../assets/css/style.scss';
import '../App.css'
import SidebarButton from "./SidebarButton";
//import '../dashboard.css'

const MasterLayout = () => { 
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);  
  const propsForSideBarNav ={
    collapsed,
    toggled,  
    setCollapsed,
    setToggled
  }
 
  return (
    
        <div className="app"> 
            
        <Sidebar {...propsForSideBarNav}/>    
        <main className="content">
        <Navigation  {...propsForSideBarNav}/>
        <Outlet/>
        </main>
        </div>
      
        // <Navbar className="Navbar-top"/>
   
  );
};
export default MasterLayout;
