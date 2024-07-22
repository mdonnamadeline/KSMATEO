import React from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../images/logo.png";

export default function Sidebar() {
    const handleHome = () => {
        Navigate("/home");
    };

    return (
        <div className="sidebar">
            <div className="sidebar-items">
                <Link to="/dashboard">
                <img
                    src={logo}
                    alt="Logo"
                    style={{ marginRight: "auto" }}
                    onClick={handleHome}
                />
                </Link>
                <Link to="/home" className="sidebar-item">
                    Home
                </Link>
                <Link to="/menu" className="sidebar-item">
                    Menu
                </Link>
                <Link to="/manageuser" className="sidebar-item">
                    MANAGE USER
                </Link>
                <Link to="/manageproduct" className="sidebar-item">
                    PRODUCT INVENTORY
                </Link>
                <Link to="/businesstobusiness" className="sidebar-item">
                    YOU BILI DITO
                </Link>
                <Link to="/reports" className="sidebar-item">
                    REPORTS
                </Link>
                <Link to="/login" className="sidebar-item">
                    LOGOUT
                </Link>
            </div>
        </div>
    );
}
