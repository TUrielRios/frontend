"use client"

import { useState } from "react"
import { Box, Typography, Paper, CircularProgress, IconButton } from "@mui/material"
import { ChevronLeft, ChevronRight } from "lucide-react"
import NicoloChatInterface from "./NicoloChatInterface"
import TrainNicoloSidebar from "../TrainNicoloForm/TrainNicoloSidebar" // Importamos el nuevo componente de sidebar
import { useTallerData } from "../../hooks/useTallerData"
import logobot from "../../assets/logo-bot.png"

export default function NicoloAISection() {
  const { data, loading, error } = useTallerData()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, md: 5 },
          borderRadius: "20px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "1000px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative", // Necesario para posicionar la sidebar absolutamente
          overflow: "hidden", // Para que la sidebar no se desborde visualmente
        }}
      >
        {/* Top Banner - Replicated visually, but not functional */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            mb: 4,
            borderRadius: "12px",
            backgroundColor: "#0A2FF1", // Light purple background
            border: "1px solid #d0b8ff", // Purple border
            color: "#6a0dad", // Darker purple text
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#fff" }}>
            <Typography
              component="span"
              sx={{
                backgroundColor: "white",
                color: "#0A2FF1",
                px: 0.8,
                py: 0.2,
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              LIMITADO
            </Typography>
            Demo gratuita de Nicolo{" "}

          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#333",
              fontWeight: 800,
              fontFamily: '"Red Hat Display", sans-serif',
              textAlign: "center",
              mr: 1,
            }}
          >
            Empezá a hablar con
          </Typography>
          <img
            src={logobot} // Usamos <img> estándar
            alt="Logo de Nicolo"
            width={48}
            height={48}
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
          <Typography
            variant="h2"
            sx={{
              color: "#333",
              fontWeight: 800,
              fontFamily: '"Red Hat Display", sans-serif',
              textAlign: "center",
              ml: 1,
            }}
          >
            Nicolo
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "#666",
            fontWeight: 400,
            mb: 4,
            fontFamily: '"Red Hat Display", sans-serif',
            textAlign: "center",
            maxWidth: "700px",
            mx: "auto",
          }}
        >
          ¡Tu asistente de IA amigable! ¿Necesitas respuestas rápidas, sugerencias inteligentes o simplemente una
          conversación alegre? Nicolo está aquí para ayudarte con una sonrisa. ¡Empezá a chatear ahora! ✨
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <CircularProgress sx={{ color: "#0a2ff1" }} />
            <Typography sx={{ ml: 2, color: "#666" }}>Cargando datos de talleres...</Typography>
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error al cargar los datos: {error}
          </Typography>
        )}
        {!loading && !error && <NicoloChatInterface tallerData={data} />}

        {/* Sidebar Toggle Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 20,
            right: isSidebarOpen ? "calc(300px + 20px)" : 20, // Adjust position when open
            backgroundColor: "white",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
            },
            transition: "right 0.3s ease-in-out",
            zIndex: 1000, // Ensure it's above other content
            borderRadius: "12px",
            p: 1,
          }}
        >
          {isSidebarOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </IconButton>

        {/* Train Nicolo Sidebar */}
        <TrainNicoloSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </Paper>
    </Box>
  )
}
