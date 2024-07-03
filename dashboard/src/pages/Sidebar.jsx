import React from 'react'
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../images/logo.png";

export default function Sidebar() {

    const handleHome = () => {
        navigate("/home");
    };

  return (
    <div className="sidebar">
    <div className="sidebar-items">
    <img src={logo} alt="Logo" style={{ marginRight: "auto" }} onClick={handleHome}/> 
      <Link to="/home" className="sidebar-item">HOME</Link>
      <Link to="/menu" className="sidebar-item">MENU</Link>
      <Link to="/manageuser" className="sidebar-item">MANAGE USER</Link>
      <Link to="/manageproduct" className="sidebar-item">MANAGE PRODUCT</Link>
      <Link to="/login" className="sidebar-item">LOGOUT</Link>
    </div>
  </div>
  )
}
 