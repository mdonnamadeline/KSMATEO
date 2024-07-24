import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Grid } from "@mui/material";
import Navbar from "./Navbar";
import Zinger from "../images/zinger.jpg";
import Dasurv from "../images/dasurv.jpg";
import "../styles/Home.css";
import "../styles/Business.css";

export default function Home() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsResponse = await axios.get(
                    "http://192.168.10.18:1337/api/projects/KFC"
                );
                setProjects(projectsResponse.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="home">
            <Navbar />
            <div className="homecon">
                <img src={Zinger} alt="Zinger" />
                <img src={Dasurv} alt="Dasurv" />
            </div>
            <div className="flex-container">
                <div className="main-content">
                    <div className="head-con">PARTNERS</div>
                    <Grid container spacing={2} className="cards-container">
                        {projects.map((item) => {
                            const imageUrl = `http://192.168.10.18:1337/uploads/${item.image}`;

                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4}
                                    key={item._id}
                                >
                                    <Card className="business-card">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img src={imageUrl} alt={item.name} />
                                        </a>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
            </div>
        </div>
    );
}