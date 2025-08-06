"use client"
import { useState } from "react"
import axios from "axios"
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material"
import { Brain } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function AnalyzeNicoloForm() {
  const [compania, setCompania] = useState("")
  const [industriaSector, setIndustriaSector] = useState("")
  const [sector, setSector] = useState("")
  const [areaDesempeno, setAreaDesempeno] = useState("")
  const [analysisResult, setAnalysisResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAnalysisResult("")
    setMessage("")
    setIsError(false)
    try {
      const response = await axios.post("http://localhost:3001/nicolo/analyze", {
        compania,
        industriaSector,
        sector,
        areaDesempeno,
      })
      setAnalysisResult(response.data.analisis)
      setMessage("Análisis generado correctamente.")
      setIsError(false)
    } catch (error) {
      console.error("Error analyzing with Nicolo:", error)
      setMessage(error.response?.data?.error || "Error al generar el análisis con Nicolo.")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px", // More rounded text fields
      backgroundColor: "#fcfcfc", // Slightly off-white background for inputs
      "& fieldset": { borderColor: "#e0e0e0", borderWidth: "1px" }, // Lighter, thinner border
      "&:hover fieldset": { borderColor: "#0a2ff1", borderWidth: "1px" }, // Keep border thin on hover
      "&.Mui-focused fieldset": { borderColor: "#0a2ff1", borderWidth: "2px" }, // Thicker border on focus
    },
    "& .MuiInputLabel-root": { color: "#666", fontFamily: '"Red Hat Display", sans-serif' },
    "& .MuiInputBase-input": { fontFamily: '"Red Hat Display", sans-serif', color: "#333" },
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" sx={{ color: "#0a2ff1", fontWeight: 700, fontFamily: '"Red Hat Display", sans-serif' }}>
        Analizar con Nicolo
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}> {/* Slightly increased gap */}
        <TextField
          label="Compañía"
          value={compania}
          onChange={(e) => setCompania(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={textFieldSx}
        />
        <TextField
          label="Industria/Sector"
          value={industriaSector}
          onChange={(e) => setIndustriaSector(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={textFieldSx}
        />
        <TextField
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={textFieldSx}
        />
        <TextField
          label="Área de Desempeño"
          value={areaDesempeno}
          onChange={(e) => setAreaDesempeno(e.target.value)}
          fullWidth
          required
          variant="outlined"
          sx={textFieldSx}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Brain size={20} />}
          sx={{
            backgroundColor: "#0a2ff1",
            color: "white",
            "&:hover": { backgroundColor: "#0926c9", boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.25)" }, // More prominent hover shadow
            padding: "0.85rem 1.75rem", // Slightly larger button
            borderRadius: "14px", // More rounded button
            fontSize: "1.05rem", // Slightly larger font
            fontWeight: 600, // Bolder text
            alignSelf: "flex-start",
            fontFamily: '"Red Hat Display", sans-serif',
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)", // Subtle initial shadow
            transition: "all 0.3s ease-in-out",
          }}
        >
          {loading ? "Generando Análisis..." : "Generar Análisis"}
        </Button>
      </Box>
      {message && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: isError ? "#F44336" : "#4CAF50",
            fontFamily: '"Red Hat Display", sans-serif',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
      {analysisResult && (
        <Paper elevation={6} sx={{ p: { xs: 2, md: 3 }, mt: 3, backgroundColor: "#f9f9f9", borderRadius: "16px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}> {/* More rounded and subtle shadow */}
          <Typography
            variant="h6"
            sx={{ color: "#0a2ff1", mb: 2, fontFamily: '"Red Hat Display", sans-serif', fontWeight: 700 }}
          >
            Resultado del Análisis para {compania || "la compañía"}:
          </Typography>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Red Hat Display", sans-serif',
                    lineHeight: 1.7, // Slightly increased line height for readability
                    color: "#333",
                    mb: 1,
                  }}
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <Typography component="strong" variant="inherit" fontWeight="bold" {...props} />
              ),
              em: ({ node, ...props }) => <Typography component="em" variant="inherit" fontStyle="italic" {...props} />,
              ul: ({ node, ...props }) => (
                <Box component="ul" sx={{ pl: 2, mt: 1, mb: 1, listStyleType: "disc", color: "#333" }} {...props} />
              ),
              li: ({ node, ...props }) => (
                <Typography
                  component="li"
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    fontFamily: '"Red Hat Display", sans-serif',
                    lineHeight: 1.7,
                    color: "#333",
                  }}
                  {...props}
                />
              ),
              h1: ({ node, ...props }) => (
                <Typography
                  variant="h5"
                  sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontFamily: '"Red Hat Display", sans-serif', fontWeight: 700 }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <Typography
                  variant="h6"
                  sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontFamily: '"Red Hat Display", sans-serif', fontWeight: 600 }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontFamily: '"Red Hat Display", sans-serif', fontWeight: 600 }}
                  {...props}
                />
              ),
            }}
          >
            {analysisResult}
          </ReactMarkdown>
        </Paper>
      )}
    </Box>
  )
}