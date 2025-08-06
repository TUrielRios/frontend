"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { ArrowUp, Paperclip, MessageSquare, User, FileText } from "lucide-react" // Importamos FileText para el icono del PPT
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import axios from "axios"

export default function NicoloChatInterface({ tallerData }) {
  const [selectedCompania, setSelectedCompania] = useState("")
  const [selectedIndustriaSector, setSelectedIndustriaSector] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedAreaDesempeno, setSelectedAreaDesempeno] = useState("")
  const [chatInput, setChatInput] = useState("") // This is now for the *actual* input field
  const [messages, setMessages] = useState([]) // Stores the chat history
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingPPT, setLoadingPPT] = useState(false) // Nuevo estado para el loading del PPT
  const [message, setMessage] = useState("") // For general status messages (error/success)
  const [isError, setIsError] = useState(false)

  const chatContainerRef = useRef(null)

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Extract unique values for filters
  const uniqueCompanias = useMemo(() => {
    const companias = new Set(tallerData.map((t) => t.compania).filter(Boolean))
    return Array.from(companias)
  }, [tallerData])

  const uniqueIndustriaSectores = useMemo(() => {
    const sectores = new Set(tallerData.map((t) => t.industriaSector).filter(Boolean))
    return Array.from(sectores)
  }, [tallerData])

  const uniqueSectores = useMemo(() => {
    const sectores = new Set(tallerData.map((t) => t.sector).filter(Boolean))
    return Array.from(sectores)
  }, [tallerData])

  const uniqueAreaDesempenos = useMemo(() => {
    const areas = new Set(tallerData.map((t) => t.areaDesempeno).filter(Boolean))
    return Array.from(areas)
  }, [tallerData])

  // Get the latest workshop data
  const latestTaller = useMemo(() => {
    if (!tallerData || tallerData.length === 0) return null
    return tallerData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  }, [tallerData])

  // Dynamic prompt suggestions
  const promptSuggestions = useMemo(() => {
    const suggestions = []
    if (latestTaller) {
      if (latestTaller.areaDesempeno) {
        suggestions.push(
          `Generá un análisis de ${latestTaller.areaDesempeno} del último taller de ${latestTaller.compania}`,
        )
      }
      if (latestTaller.sector) {
        suggestions.push(
          `Generá un análisis del sector ${latestTaller.sector} del último taller de ${latestTaller.compania}`,
        )
      }
      // Add more generic or dynamic prompts as needed
      suggestions.push("¿Cuáles son las tendencias clave en IA para 2025?")
      suggestions.push("¿Cómo puedo mejorar la validación social en mi empresa?")
    } else {
      suggestions.push("Generá un análisis general de la industria.")
      suggestions.push("¿Qué es Nicolo AI?")
    }
    return suggestions
  }, [latestTaller])

  const performAnalysis = useCallback(async (promptContent, params) => {
    setLoadingAnalysis(true)
    setMessage("")
    setIsError(false)

    // Add user message to chat history
    setMessages((prevMessages) => [...prevMessages, { id: Date.now() + "-user", role: "user", content: promptContent }])

    try {
      const response = await axios.post("http://localhost:3001/nicolo/analyze", params)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + "-nicolo",
          role: "nicolo",
          content: response.data.analisis,
          rawAnalysis: response.data.analisis,
        }, // Guardamos el análisis crudo
      ])
      setMessage("Análisis generado correctamente.")
      setIsError(false)
    } catch (error) {
      console.error("Error analyzing with Nicolo:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + "-error",
          role: "nicolo",
          content: `Error al generar el análisis: ${error.response?.data?.error || error.message}`,
        },
      ])
      setMessage(error.response?.data?.error || "Error al generar el análisis con Nicolo.")
      setIsError(true)
    } finally {
      setLoadingAnalysis(false)
    }
  }, [])

  const handlePromptClick = useCallback((prompt) => {
    setChatInput(prompt) // Set the prompt in the input field
    // No direct analysis call here, user must click send button
  }, [])

  const handleSendAnalysis = useCallback(async () => {
    let promptContent = chatInput.trim()
    if (!promptContent && !selectedCompania && !selectedIndustriaSector && !selectedSector && !selectedAreaDesempeno) {
      setMessage("Por favor, escribe una pregunta o selecciona parámetros para el análisis.")
      setIsError(true)
      return
    }

    // If chatInput is empty, construct a default prompt from selected filters
    if (!promptContent) {
      const selectedParams = []
      if (selectedCompania) selectedParams.push(`Compañía: ${selectedCompania}`)
      if (selectedIndustriaSector) selectedParams.push(`Industria/Sector: ${selectedIndustriaSector}`)
      if (selectedSector) selectedParams.push(`Sector: ${selectedSector}`)
      if (selectedAreaDesempeno) selectedParams.push(`Área de Desempeño: ${selectedAreaDesempeno}`)

      if (selectedParams.length > 0) {
        promptContent = `Generar análisis para ${selectedParams.join(", ")}.`
      } else {
        promptContent = "Generar un análisis general."
      }
    }

    const params = {
      compania: selectedCompania || (latestTaller ? latestTaller.compania : ""),
      industriaSector: selectedIndustriaSector || (latestTaller ? latestTaller.industriaSector : ""),
      sector: selectedSector || (latestTaller ? latestTaller.sector : ""),
      areaDesempeno: selectedAreaDesempeno || (latestTaller ? latestTaller.areaDesempeno : ""),
    }

    await performAnalysis(promptContent, params)
    setChatInput("") // Clear the input field after sending
  }, [
    chatInput,
    selectedCompania,
    selectedIndustriaSector,
    selectedSector,
    selectedAreaDesempeno,
    latestTaller,
    performAnalysis,
  ])

  const handleGeneratePPT = useCallback(async (analysisContent, companyName) => {
    setLoadingPPT(true)
    setMessage("")
    setIsError(false)
    try {
      const response = await axios.post(
        "http://localhost:3001/nicolo/generate-ppt",
        {
          compania: companyName,
          analisis: analysisContent,
        },
        {
          responseType: "blob", // Important: responseType 'blob' for file download
        },
      )

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      })

      // Create a link element and trigger the download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Informe_${companyName.replace(/\s+/g, "_") || "Nicolo"}_${new Date().toISOString().split("T")[0]}.pptx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      setMessage("PowerPoint generado y descargado correctamente.")
      setIsError(false)
    } catch (error) {
      console.error("Error al generar PowerPoint:", error)
      setMessage(error.response?.data?.error || "Error al generar el PowerPoint.")
      setIsError(true)
    } finally {
      setLoadingPPT(false)
    }
  }, [])

  const formControlSx = {
    minWidth: 120,
    flexGrow: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fcfcfc",
      "& fieldset": { borderColor: "#e0e0e0", borderWidth: "1px" },
      "&:hover fieldset": { borderColor: "#0a2ff1", borderWidth: "1px" },
      "&.Mui-focused fieldset": { borderColor: "#0a2ff1", borderWidth: "2px" },
    },
    "& .MuiInputLabel-root": { color: "#666", fontFamily: '"Red Hat Display", sans-serif' },
    "& .MuiInputBase-input": { fontFamily: '"Red Hat Display", sans-serif', color: "#333" },
  }

  // Get the latest Nicolo message that contains rawAnalysis
  const latestNicoloAnalysis = useMemo(() => {
    const nicoloMessages = messages.filter((msg) => msg.role === "nicolo" && msg.rawAnalysis)
    return nicoloMessages.length > 0 ? nicoloMessages[nicoloMessages.length - 1] : null
  }, [messages])

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Parameter Filters Row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 2 }}>
        <FormControl sx={formControlSx}>
          <InputLabel id="compania-label">Compañía</InputLabel>
          <Select
            labelId="compania-label"
            value={selectedCompania}
            label="Compañía"
            onChange={(e) => setSelectedCompania(e.target.value)}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            {uniqueCompanias.map((compania) => (
              <MenuItem key={compania} value={compania}>
                {compania}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlSx}>
          <InputLabel id="industria-sector-label">Industria/Sector</InputLabel>
          <Select
            labelId="industria-sector-label"
            value={selectedIndustriaSector}
            label="Industria/Sector"
            onChange={(e) => setSelectedIndustriaSector(e.target.value)}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            {uniqueIndustriaSectores.map((sector) => (
              <MenuItem key={sector} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlSx}>
          <InputLabel id="sector-label">Sector</InputLabel>
          <Select
            labelId="sector-label"
            value={selectedSector}
            label="Sector"
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {uniqueSectores.map((sector) => (
              <MenuItem key={sector} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlSx}>
          <InputLabel id="area-desempeno-label">Área de Desempeno</InputLabel>
          <Select
            labelId="area-desempeno-label"
            value={selectedAreaDesempeno}
            label="Área de Desempeño"
            onChange={(e) => setSelectedAreaDesempeno(e.target.value)}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            {uniqueAreaDesempenos.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Chat Display Area */}
      <Paper
        elevation={2}
        sx={{
          height: "400px", // Fixed height for chat history
          overflowY: "auto", // Scrollable
          p: 2,
          borderRadius: "16px",
          backgroundColor: "#fcfcfc",
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        ref={chatContainerRef}
      >
        {messages.length === 0 ? (
          <Typography sx={{ color: "#999", textAlign: "center", mt: "auto", mb: "auto" }}>
            ¡Empezá a chatear con Nicolo! Seleccioná una sugerencia o usá los filtros.
          </Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  maxWidth: "80%",
                  backgroundColor: msg.role === "user" ? "#e0e6ff" : "#ffffff", // Light blue for user, white for Nicolo
                  color: "#333",
                  fontFamily: '"Red Hat Display", sans-serif',
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
                  border: msg.role === "nicolo" ? "1px solid #e0e0e0" : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {msg.role === "nicolo" ? (
                    <MessageSquare size={18} color="#0a2ff1" style={{ marginRight: "8px" }} />
                  ) : (
                    <User size={18} color="#6a0dad" style={{ marginRight: "8px" }} />
                  )}
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: msg.role === "user" ? "#6a0dad" : "#0a2ff1" }}
                  >
                    {msg.role === "user" ? "Tú" : "Nicolo"}
                  </Typography>
                </Box>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#333" }} {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <Typography component="strong" variant="inherit" fontWeight="bold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <Typography component="em" variant="inherit" fontStyle="italic" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <Box
                        component="ul"
                        sx={{ pl: 2, mt: 1, mb: 1, listStyleType: "disc", color: "#333" }}
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <Typography
                        component="li"
                        variant="body2"
                        sx={{ mb: 0.5, lineHeight: 1.6, color: "#333" }}
                        {...props}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <Typography variant="h5" sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontWeight: 700 }} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontWeight: 600 }} {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 2, mb: 1, color: "#0a2ff1", fontWeight: 600 }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </Paper>
            </Box>
          ))
        )}
        {loadingAnalysis && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <CircularProgress size={20} sx={{ color: "#0a2ff1" }} />
            <Typography sx={{ ml: 1, color: "#666", fontFamily: '"Red Hat Display", sans-serif' }}>
              Nicolo está escribiendo...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Chat Input Field */}
      <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2} // Smaller input field
          placeholder="Escribí una pregunta o seleccioná una sugerencia..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendAnalysis()
            }
          }}
          InputProps={{
            sx: {
              borderRadius: "16px",
              backgroundColor: "#fcfcfc",
              "& fieldset": { borderColor: "#e0e0e0", borderWidth: "1px" },
              "&:hover fieldset": { borderColor: "#0a2ff1", borderWidth: "1px" },
              "&.Mui-focused fieldset": { borderColor: "#0a2ff1", borderWidth: "2px" },
              pr: 6, // Space for the send button
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontFamily: '"Red Hat Display", sans-serif',
              color: "#333",
              py: 1.5,
              px: 2,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendAnalysis} // Connect send button
          disabled={loadingAnalysis}
          sx={{
            position: "absolute",
            right: 10,
            bottom: 10,
            minWidth: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#0a2ff1",
            "&:hover": { backgroundColor: "#0926c9" },
            p: 0,
          }}
        >
          <ArrowUp size={20} />
        </Button>
      </Box>

      {/* Model Selection, Add Content, and Generate PPT Buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 4, mt: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value="GPT-4o mini"
            sx={{
              borderRadius: "10px",
              backgroundColor: "#fcfcfc",
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#e0e0e0" },
              "&.Mui-focused fieldset": { borderColor: "#0a2ff1" },
              "& .MuiSelect-select": {
                fontFamily: '"Red Hat Display", sans-serif',
                color: "#333",
                fontWeight: 500,
              },
            }}
          >
            <MenuItem value="GPT-4o mini">GPT-4o mini</MenuItem>
            <MenuItem value="GPT-4o">GPT-4o</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<Paperclip size={18} />}
          sx={{
            borderRadius: "10px",
            borderColor: "#e0e0e0",
            color: "#666",
            textTransform: "none",
            fontFamily: '"Red Hat Display", sans-serif',
            fontWeight: 500,
            "&:hover": { borderColor: "#0a2ff1", backgroundColor: "#f5f5f5" },
          }}
        >
          Añadir contenido
        </Button>
        {latestNicoloAnalysis && ( // Solo muestra el botón si hay un análisis de Nicolo
          <Button
            variant="contained"
            onClick={() =>
              handleGeneratePPT(
                latestNicoloAnalysis.rawAnalysis,
                selectedCompania || (latestTaller ? latestTaller.compania : "Informe"),
              )
            }
            disabled={loadingPPT}
            startIcon={loadingPPT ? <CircularProgress size={20} color="inherit" /> : <FileText size={18} />}
            sx={{
              backgroundColor: "#0a2ff1",
              color: "white",
              "&:hover": { backgroundColor: "#0926c9", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" },
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              fontFamily: '"Red Hat Display", sans-serif',
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {loadingPPT ? "Generando PPT..." : "Generar PPT"}
          </Button>
        )}
      </Box>

      {/* Suggested Prompts */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 5 }}>
        {promptSuggestions.map((prompt, index) => (
          <Paper
            key={index}
            elevation={2}
            onClick={() => handlePromptClick(prompt)}
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#e0e0e0",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
              transition: "all 0.2s ease-in-out",
              maxWidth: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(33.33% - 11px)" },
              flexGrow: 1,
              fontFamily: '"Red Hat Display", sans-serif',
              color: "#333",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            {prompt}
          </Paper>
        ))}
      </Box>

      {/* General status message (error/success) */}
      {message && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: isError ? "#F44336" : "#4CAF50",
            fontFamily: '"Red Hat Display", sans-serif',
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  )
}
