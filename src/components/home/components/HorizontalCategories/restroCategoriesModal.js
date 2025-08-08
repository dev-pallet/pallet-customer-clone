import React from "react";
import { useMediaQuery, Modal, Box } from "@mui/material";
import "./restroCategories.css";
import CloseIcon from "@mui/icons-material/Close";
const RestroCategoriesModal = ({ level1Cat, openModal, setOpenModal }) => {
  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ backgroundColor: "white" }}
        hideBackdrop
      >
        <div className="modal-content">
          <Box className="modal-header">
            <h3 style={{ fontFamily: "sans-serif" }}>All Categories</h3>
            <CloseIcon
              onClick={() => setOpenModal(false)}
              style={{ cursor: "pointer" }}
            />
          </Box>

          <div className="modal-category-list">
            {level1Cat?.map((item, index) => (
              <div className="category-badge" key={index}>
                <p style={{ color: "white", fontFamily: "sans-serif" }}>
                  {item?.categoryName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RestroCategoriesModal;
