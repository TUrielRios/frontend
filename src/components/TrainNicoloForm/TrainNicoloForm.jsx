"use client"

import { useState, useEffect } from "react"
import { Box, TextField, Button, Typography, CircularProgress, IconButton, Paper } from "@mui/material"
import { Send, Plus, X } from "lucide-react"
import axios from "axios" // Importamos axios

// Default examples for initial load if nothing in localStorage
const defaultEjemplos = [
  {
    input: "Empresa: TravelNow\\nPuntuaciones: Atractivo: 3, Autenticidad: 5, Autoridad: 8",
    output:
      "🔍 *Análisis:*\\n- **Atractivo (3):** La marca carece de elementos visuales o mensajes que capten la atención del cliente. Es fundamental rediseñar la identidad visual para que sea más vibrante y diferenciadora.\\n- **Autenticidad (5):** Hay una base, pero se percibe inconsistencia en el tono de comunicación. Trabajar en una narrativa unificada puede reforzar la percepción de autenticidad.\\n- **Autoridad (8):** Excelente posicionamiento como referente en el sector. Mantener esta autoridad con contenidos de valor y alianzas estratégicas.\\n\\n✅ *Recomendaciones:*\\n- Redefinir paleta de colores y estilo gráfico para captar más atención.\\n- Crear un manual de tono y voz para unificar la comunicación.\\n- Mantener publicaciones en blogs y conferencias para seguir siendo un referente.",
  },
  {
    input: "Empresa: EcoFoods\\nPuntuaciones: Validación Social: 2, Consistencia: 6, Reciprocidad: 7",
    output:
      "🔍 *Análisis:*\\n- **Validación Social (2):** Hay muy pocas reseñas positivas y testimonios visibles. Esto debilita la confianza en la marca.\\n- **Consistencia (6):** Hay esfuerzos pero no se sostienen en el tiempo.\\n- **Reciprocidad (7):** Buen nivel de interacción con los clientes, pero se puede reforzar con estrategias de fidelización.\\n\\n✅ *Recomendaciones:*\\n- Incentivar a los clientes actuales a dejar reseñas en redes sociales y Google.\\n- Planificar un calendario de publicaciones y campañas para mantener consistencia.\\n- Crear un programa de fidelidad para reforzar la reciprocidad.",
  },
]

export default function TrainNicoloForm() {
  const [promptBase, setPromptBase] = useState("")
  const [ejemplos, setEjemplos] = useState(defaultEjemplos)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPromptBase = localStorage.getItem("nicoloPromptBase")
    const savedEjemplos = localStorage.getItem("nicoloEjemplos")
    if (savedPromptBase) {
      setPromptBase(savedPromptBase)
    }
    if (savedEjemplos) {
      try {
        setEjemplos(JSON.parse(savedEjemplos))
      } catch (e) {
        console.error("Failed to parse examples from localStorage", e)
        setEjemplos(defaultEjemplos) // Fallback to default if parsing fails
      }
    }
  }, [])

  const handleAddExample = () => {
    setEjemplos([...ejemplos, { input: "", output: "" }])
  }

  const handleRemoveExample = (index) => {
    setEjemplos(ejemplos.filter((_, i) => i !== index))
  }

  const handleExampleChange = (index, field, value) => {
    const newEjemplos = [...ejemplos]
    newEjemplos[index] = { ...newEjemplos[index], [field]: value }
    setEjemplos(newEjemplos)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)

    try {
      // Save data to localStorage (as before)
      localStorage.setItem("nicoloPromptBase", promptBase)
      localStorage.setItem("nicoloEjemplos", JSON.stringify(ejemplos))

      // Prepare the data for the backend
      const dataToSend = {
        promptBase: promptBase,
        ejemplos: ejemplos,
      }

      // Send data to the backend
      const response = await axios.post("http://localhost:3001/nicolo/train", dataToSend)

      console.log("Respuesta del backend:", response.data)
      setMessage("Nicolo entrenado y datos guardados correctamente.")
      setIsError(false)
    } catch (error) {
      console.error("Error al entrenar a Nicolo:", error)
      setMessage(error.response?.data?.error || "Error al entrenar a Nicolo.")
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: { xs: 1, md: 3 }, display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Typography variant="h5" sx={{ color: "#0a2ff1", fontWeight: 700, fontFamily: '"Red Hat Display", sans-serif' }}>
        Entrenar a Nicolo
      </Typography>
      <TextField
        label="Prompt Base"
        multiline
        rows={8}
        value={promptBase}
        onChange={(e) => setPromptBase(e.target.value)}
        fullWidth
        required
        variant="outlined"
        sx={textFieldSx}
      />
      <Typography
        variant="h6"
        sx={{ color: "#0a2ff1", fontWeight: 700, mt: 2, fontFamily: '"Red Hat Display", sans-serif' }}
      >
        Ejemplos de Entrenamiento
      </Typography>
      {ejemplos.map((example, index) => (
        <Paper
          key={index}
          elevation={2} // Subtle elevation for each example box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #e0e0e0", // Lighter border
            p: { xs: 1.5, md: 2 },
            borderRadius: "16px", // More rounded corners
            position: "relative",
            backgroundColor: "#fcfcfc", // Consistent light background
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.08)", // More prominent shadow
          }}
        >
          <TextField
            label={`Ejemplo ${index + 1} - Input`}
            multiline
            rows={4}
            value={example.input}
            onChange={(e) => handleExampleChange(index, "input", e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={textFieldSx}
          />
          <TextField
            label={`Ejemplo ${index + 1} - Output`}
            multiline
            rows={4}
            value={example.output}
            onChange={(e) => handleExampleChange(index, "output", e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={textFieldSx}
          />
          {ejemplos.length > 1 && (
            <IconButton
              aria-label="remove example"
              onClick={() => handleRemoveExample(index)}
              sx={{
                position: "absolute",
                top: 12, // Adjusted position
                right: 12, // Adjusted position
                color: "#F44336",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.2)" },
                borderRadius: "10px", // More rounded
                p: "8px", // Slightly larger hit area
              }}
            >
              <X size={20} />
            </IconButton>
          )}
        </Paper>
      ))}
      <Button
        type="button" // Important: type="button" to prevent form submission
        onClick={handleAddExample}
        variant="outlined"
        startIcon={<Plus size={20} />}
        sx={{
          borderColor: "#0a2ff1",
          color: "#0a2ff1",
          "&:hover": { borderColor: "#0926c9", color: "#0926c9", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
          padding: "0.75rem 1.5rem",
          borderRadius: "14px", // More rounded
          fontSize: "1rem",
          fontWeight: 600, // Bolder text
          alignSelf: "flex-start",
          fontFamily: '"Red Hat Display", sans-serif',
          transition: "all 0.3s ease-in-out",
        }}
      >
        Añadir Ejemplo
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
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
        {loading ? "Guardando..." : "Entrenar a Nicolo (Guardar)"}
      </Button>
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
    </Box>
  )
}
