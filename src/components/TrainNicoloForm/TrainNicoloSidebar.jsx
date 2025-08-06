"use client"

import { Box } from "@mui/material"
import TrainNicoloForm from "./TrainNicoloForm"

export default function TrainNicoloSidebar({ isOpen, onClose }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: isOpen ? 0 : "-300px", // Slide in/out from right
        width: "300px", // Fixed width for the sidebar
        height: "100%",
        backgroundColor: "white",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
        borderRadius: "0 20px 20px 0", // Rounded only on the left side when closed
        transition: "right 0.3s ease-in-out",
        zIndex: 999, // Below the toggle button, above main content
        overflowY: "auto", // Scrollable content inside sidebar
        p: 2, // Padding inside the sidebar
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TrainNicoloForm />
    </Box>
  )
}
