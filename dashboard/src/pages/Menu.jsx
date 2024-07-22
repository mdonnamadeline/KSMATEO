import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Navbar from "./Navbar";
import "../styles/Menu.css";

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
    const [cartItemCount, setCartItemCount] = useState(0); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        updateCartItemCount(); 
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/api/menu`
            );
            setDataList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateCartItemCount = () => {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItemCount(cartItems.length); 
    };

    const handleOpenAddToOrder = (product) => {
        if (user) {
            setSelectedProduct(product);
            setQuantity(1);
            setOpenAddToOrder(true);
        } else {
            setOpen(true); 
        }
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

    const handleAddToCart = async () => {
        if (user) {
            const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const newItem = {
                ...selectedProduct,
                quantity,
                addedDate: new Date().toLocaleString(),
            };

            //new:check stock availability
            if (newItem.quantity > selectedProduct.quantity) {
                alert("Insufficient stock! Only " + selectedProduct.quantity + "items available.");
                return;
            }
    
            try {
                console.log('Updating stock with:', {
                    productId: selectedProduct._id,
                    quantity: quantity,
                });
    
                await axios.put(`${VITE_REACT_APP_API_HOST}/api/menu/update-stock`, {
                    productId: selectedProduct._id,
                    quantity: quantity,
                });
    
                const updatedCartItems = [...cartItems, newItem];
                localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
                updateCartItemCount();
    
                alert("Item added to cart!");
                handleCloseAddToOrder();
            } catch (error) {
                console.error("Error updating stock quantity:", error);
                alert("There was an error adding the item to your cart.");
            }
        } else {
            setOpen(true);
        }
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredMenuItems = dataList.filter((menu) =>
        `${menu.name} ${menu.description} ${menu.price}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="menu">
            <Navbar cartItemCount={cartItemCount} />{" "}
            <div className="searchBar">
                <TextField
                    label="Search Menu"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: 2 }}
                />
            </div>
            <div className="menu-main">
                <h1 className="menu-Title">MENU</h1>
                <div className="menu-list">
                    {filteredMenuItems.length > 0 ? (
                        filteredMenuItems
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
            {user && (
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
                                <Typography
                                    id="modal-description"
                                    sx={{ mt: 2 }}
                                >
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
                                        onClick={() =>
                                            handleQuantityChange("-")
                                        }
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
                                        onClick={() =>
                                            handleQuantityChange("+")
                                        }
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
            )}
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
                {menu.quantity > 0 ? (
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
                ) : (
                    <Button
                        variant="contained"
                        disabled
                        style={{
                            marginTop: "10px",
                            width: "300px",
                            color: "white",
                            backgroundColor: "grey",
                        }}
                    >
                        Not Available
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}