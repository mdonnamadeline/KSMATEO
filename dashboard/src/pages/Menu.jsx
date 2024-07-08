import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    Modal,
    Box,
    TextField,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./Menu.css";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 15,
    p: 2,
};

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [dataList, setDataList] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [openAddToOrder, setOpenAddToOrder] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/viewmenu`
            );
            setDataList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleOpenAddToOrder = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setOpenAddToOrder(true);
    };

    const handleCloseAddToOrder = () => {
        setOpenAddToOrder(false);
        setSelectedProduct(null);
    };

    const handleQuantityChange = (operation) => {
        setQuantity((prevQuantity) =>
            operation === "+" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
        );
    };

    const handleAddToCart = () => {
        if (user) {
            // Implement the logic to add the product to the cart
            // For example, you could dispatch an action or call an API
            // to add the product to the cart with the selected quantity
            console.log(`Add ${quantity} ${selectedProduct.name} to cart`);
            navigate("/cart", {
                state: {
                    cartItems: [{ ...selectedProduct, quantity }],
                },
            });
            handleCloseAddToOrder();
        } else {
            handleCloseAddToOrder();
            setOpen(true); // Open the sign up/login modal
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="menu">
            <Navbar />
            <div className="menu-main">
                <h1 className="menu-Title">MENU</h1>
                <div className="menu-list">
                    {dataList.length > 0 ? (
                        dataList
                            .filter((menu) => !menu.disabled)
                            .map((menu) => (
                                <ProductCard
                                    key={menu._id}
                                    menu={menu}
                                    user={user}
                                    handleOpen={handleOpenAddToOrder}
                                />
                            ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </div>
            </div>

            {/* Modal for Add to Order */}
            <Modal
                open={openAddToOrder}
                onClose={handleCloseAddToOrder}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    {selectedProduct && (
                        <>
                            <Typography
                                id="modal-title"
                                variant="h6"
                                component="h2"
                            >
                                {selectedProduct.name}
                            </Typography>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`${VITE_REACT_APP_API_HOST}/uploads/${selectedProduct.image}`}
                                alt={selectedProduct.name}
                                sx={{ mt: 2, mb: 2, objectFit: "contain" }} 
                            />
                            <Typography id="modal-description" sx={{ mt: 2 }}>
                                {selectedProduct.description}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                ₱{selectedProduct.price} x {quantity} = ₱
                                {selectedProduct.price * quantity}
                            </Typography>
                            <div
                                className="quantity-control"
                                style={{ marginTop: "16px" }}
                            >
                                <IconButton
                                    onClick={() => handleQuantityChange("-")}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <TextField
                                    value={quantity}
                                    inputProps={{
                                        readOnly: true,
                                        style: { textAlign: "center" },
                                    }}
                                    sx={{ width: "60px", mx: 2 }}
                                />
                                <IconButton
                                    onClick={() => handleQuantityChange("+")}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <Button
                                variant="contained"
                                onClick={handleAddToCart}
                                sx={{
                                    mt: 2,
                                    backgroundColor: "rgb(161,27,27)",
                                    "&:hover": {
                                        backgroundColor: "rgb(135,22,22)",
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Modal for Sign Up/Login */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Register first!
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        You need to sign up or login to place an order.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/signup")}
                        sx={{
                            mt: 2,
                            mr: 2,
                            backgroundColor: "rgb(161,27,27)",
                            "&:hover": { backgroundColor: "rgb(135,22,22)" },
                        }}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                        sx={{
                            mt: 2,
                            backgroundColor: "rgb(161,27,27)",
                            "&:hover": { backgroundColor: "rgb(135,22,22)" },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

function ProductCard({ menu, user, handleOpen }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    return (
        <Card className="product-card">
            <CardHeader
                title={
                    <div style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
                        {menu.name}
                    </div>
                }
                subheader={`₱${menu.price}`}
            />
            <CardMedia
                component="img"
                height="100"
                image={imageUrl}
                alt={menu.name}
            />
            <CardContent>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    style={{ fontSize: "12px" }}
                >
                    {menu.description}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        marginTop: "10px",
                        width: "300px",
                        color: "white",
                        backgroundColor: "red",
                    }}
                    onClick={() => handleOpen(menu)}
                >
                    {user ? "Add to Order" : "Order Now"}
                </Button>
            </CardContent>
        </Card>
    );
}
