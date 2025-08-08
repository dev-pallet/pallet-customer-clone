import React from "react";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";
import "../../App.css";
const CardUI = ({ children, onClick, ...props }) => {
  return (
    <Card className="payment-card-container" {...props}>
      <div onClick={onClick}>{children}</div>
    </Card>
  );
};

export default CardUI;
