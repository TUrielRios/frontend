"use client"

import { useState, useEffect, useRef } from "react"
import { Download } from "lucide-react"
import RadarChart from "../RadarChart/RadarChart"
import AdminChartPDF from "./AdminChartPDF"
import portadaImage from "../../assets/portada-pdf/portada.png"
import logo from "../../assets/logo_clara_dots_blue.svg"

const ResultsPhase = ({ phaseScores, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedbackQuestion, setFeedbackQuestion] = useState(
    "¿Te gustaría dejarnos algún comentario o feedback sobre tu experiencia?"
  )
  const [loadingQuestion, setLoadingQuestion] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  const radarChartRef = useRef(null)
  const radarChartLightRef = useRef(null)

  useEffect(() => {
    const cargarPreguntaFeedback = async () => {
      setLoadingQuestion(true)
      try {
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/textos")
        if (!response.ok) throw new Error(`Error: ${response.status}`)
        
        const data = await response.json()
        const preguntaFeedback = data.find((item) => item.key === "pregunta_fase_final")
        
        if (preguntaFeedback?.value) {
          setFeedbackQuestion(preguntaFeedback.value)
        }
      } catch (err) {
        console.error("Error al cargar la pregunta de feedback:", err)
      } finally {
        setLoadingQuestion(false)
      }
    }

    cargarPreguntaFeedback()
  }, [])

  const formatDescription = (text) => text.replace(/<br\/>/g, "<br/><br/>")
  const createMarkup = (text) => ({ __html: text })

  const chartData = {
    "ATRACTIVO": phaseScores["ATRACTIVO_avg"] || 0,
    "VALIDACIÓN SOCIAL": phaseScores["VALIDACIÓN SOCIAL_avg"] || 0,
    "RECIPROCIDAD": phaseScores["RECIPROCIDAD_avg"] || 0,
    "AUTORIDAD": phaseScores["AUTORIDAD_avg"] || 0,
    "AUTENTICIDAD": phaseScores["AUTENTICIDAD_avg"] || 0,
    "CONSISTENCIA Y COMPROMISO": phaseScores["CONSISTENCIA Y COMPROMISO_avg"] || 0,
  }

  const allPhases = Object.keys(chartData)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (feedback.trim()) {
      onFeedbackSubmit(feedback)
      setIsSubmitted(true)
    }
  }

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const { jsPDF } = await import('jspdf')
      const { Canvg } = await import('canvg')

      const pdf = new jsPDF('l', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // ============================================
      // PÁGINA 1: PORTADA CON RELACIÓN DE ASPECTO
      // ============================================
      
      // Convertir la imagen importada a base64
      const response = await fetch(portadaImage)
      const blob = await response.blob()
      const reader = new FileReader()
      
      const portadaBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      
      // Crear una imagen para obtener sus dimensiones
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = portadaBase64
      })
      
      const imgWidth = img.width
      const imgHeight = img.height
      const imgAspectRatio = imgWidth / imgHeight
      const pageAspectRatio = pageWidth / pageHeight
      
      let finalWidth, finalHeight, x, y
      
      if (imgAspectRatio > pageAspectRatio) {
        // La imagen es más ancha que la página
        finalWidth = pageWidth
        finalHeight = pageWidth / imgAspectRatio
        x = 0
        y = (pageHeight - finalHeight) / 2
      } else {
        // La imagen es más alta que la página
        finalHeight = pageHeight
        finalWidth = pageHeight * imgAspectRatio
        x = (pageWidth - finalWidth) / 2
        y = 0
      }
      
      // Fondo azul detrás de la imagen
      pdf.setFillColor(4, 59, 255) // RGB equivalente a #0A2FF1
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      // Agregar la imagen centrada con relación de aspecto correcta
      pdf.addImage(portadaBase64, 'PNG', x, y, finalWidth, finalHeight)

      // ============================================
      // FECHA DINÁMICA SOBRE LA PORTADA
      // Tapamos la fecha fija con un rect azul y dibujamos la nueva
      // usando un canvas con Red Hat Display (ya cargada en el browser).
      // ============================================
      const today = new Date()
      const fechaActual = today.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      // X alineado con el texto "Resultado" / "El Diamante" de la portada
      // Y al ~76% del alto de la página
      const fechaX = pageWidth * 0.565
      const fechaY = pageHeight * 0.765
      const fechaBoxW = pageWidth * 0.42
      const fechaBoxH = pageHeight * 0.22

      // Rectángulo azul para tapar AMBAS líneas de fecha grabadas en la imagen
      pdf.setFillColor(4, 59, 255)
      pdf.rect(fechaX, fechaY - 5, fechaBoxW, fechaBoxH, 'F')

      // --- Renderizar la fecha con Red Hat Display usando canvas del browser ---
      // El browser ya tiene cargada la fuente, así que la usamos directamente.
      const fontCanvas = document.createElement('canvas')
      const scale = 4 // super-resolución para que quede nítido en PDF
      fontCanvas.width = 800 * scale
      fontCanvas.height = 60 * scale
      const fontCtx = fontCanvas.getContext('2d')
      fontCtx.scale(scale, scale)
      // Fondo transparente (no hacemos fillRect → queda sobre el rect azul)
      fontCtx.font = '400 28px "Red Hat Display", sans-serif'
      fontCtx.fillStyle = 'rgba(100, 220, 210, 1)'
      fontCtx.textBaseline = 'middle'
      fontCtx.fillText(fechaActual, 0, 30)

      const dateImgData = fontCanvas.toDataURL('image/png')
      // Ancho en mm: ~68mm; alto: ~6mm (equivalente al font 12pt de jsPDF)
      pdf.addImage(dateImgData, 'PNG', fechaX, fechaY - 6, 68, 6)

      // ============================================
      // PÁGINA 2: RESULTADOS
      // ============================================
      
      pdf.addPage()
      
      // Fondo blanco
      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')

      // Agregar logo en la esquina superior derecha
      try {
        const logoResponse = await fetch(logo)
        const logoBlob = await logoResponse.blob()
        const logoReader = new FileReader()
        
        const logoBase64 = await new Promise((resolve) => {
          logoReader.onloadend = () => resolve(logoReader.result)
          logoReader.readAsDataURL(logoBlob)
        })
        
        // Tamaño del logo (ajustable)
        const logoWidth = 25
        const logoHeight = 8
        const logoX = pageWidth - logoWidth - 10
        const logoY = 10
        
        pdf.addImage(logoBase64, 'SVG', logoX, logoY, logoWidth, logoHeight)
      } catch (error) {
        console.error('Error al cargar el logo:', error)
      }

      // Título principal - más pequeño
      pdf.setFontSize(18)
      pdf.setFont(undefined, 'bold')
      pdf.setTextColor(10, 47, 241)
      pdf.text('Análisis de factores', 15, 22)

      // Capturar y agregar el gráfico radar (lado derecho)
      if (radarChartLightRef.current) {
        const svgElement = radarChartLightRef.current.querySelector('svg')
        
        if (svgElement) {
          const canvas = document.createElement('canvas')
          canvas.width = 800
          canvas.height = 800
          const ctx = canvas.getContext('2d')
          
          const svgString = new XMLSerializer().serializeToString(svgElement)
          
          const v = await Canvg.from(ctx, svgString)
          await v.render()
          
          const radarImgData = canvas.toDataURL('image/png')
          
          // Gráfico más pequeño y mejor posicionado
          const radarWidth = 110
          const radarHeight = 110
          const xPosition = pageWidth - radarWidth - 20
          const yPosition = 40
          
          pdf.addImage(radarImgData, 'PNG', xPosition, yPosition, radarWidth, radarHeight)
        }
      }

      // Título de sección - más pequeño
      let yPos = 42
      pdf.setFontSize(13)
      pdf.setFont(undefined, 'bold')
      pdf.setTextColor(10, 47, 241)
      pdf.text('Factores de Influencia', 15, yPos)
      
      yPos += 10

      const factores = [
        { nombre: 'ATRACTIVO', valor: chartData['ATRACTIVO'] },
        { nombre: 'VALIDACIÓN SOCIAL', valor: chartData['VALIDACIÓN SOCIAL'] },
        { nombre: 'RECIPROCIDAD', valor: chartData['RECIPROCIDAD'] },
        { nombre: 'AUTORIDAD', valor: chartData['AUTORIDAD'] },
        { nombre: 'AUTENTICIDAD', valor: chartData['AUTENTICIDAD'] },
        { nombre: 'CONSISTENCIA Y COMPROMISO', valor: chartData['CONSISTENCIA Y COMPROMISO'] }
      ]

      const maxValor = 10
      const barWidth = 100
      const barHeight = 4 // Barras más delgadas

      factores.forEach((factor) => {
        // Nombre del factor
        pdf.setFontSize(9.5)
        pdf.setFont(undefined, 'bold')
        pdf.setTextColor(10, 47, 241)
        pdf.text(factor.nombre, 15, yPos)
        
        // Valor numérico
        const valorText = factor.valor.toFixed(1)
        pdf.setFontSize(9.5)
        pdf.setFont(undefined, 'bold')
        pdf.setTextColor(10, 47, 241)
        pdf.text(valorText, 15 + barWidth + 3, yPos)
        
        yPos += 3
        
        // Barra de fondo (gris claro) con bordes redondeados
        pdf.setFillColor(230, 232, 245)
        pdf.roundedRect(15, yPos, barWidth, barHeight, 2, 2, 'F')
        
        // Barra de valor (azul) con bordes redondeados
        const fillWidth = (factor.valor / maxValor) * barWidth
        pdf.setFillColor(10, 47, 241)
        pdf.roundedRect(15, yPos, fillWidth, barHeight, 2, 2, 'F')
        
        yPos += 9
      })

      // Separador visual
      yPos += 2
      pdf.setDrawColor(200, 200, 220)
      pdf.setLineWidth(0.4)
      pdf.line(15, yPos, 15 + barWidth + 15, yPos)
      yPos += 8

      // Promedio General
      pdf.setFontSize(11)
      pdf.setFont(undefined, 'bold')
      pdf.setTextColor(10, 47, 241)
      pdf.text('PROMEDIO GENERAL', 15, yPos)
      
      const promedio = factores.reduce((sum, f) => sum + f.valor, 0) / factores.length
      pdf.setFont(undefined, 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(10, 47, 241)
      pdf.text(promedio.toFixed(1), 15 + barWidth + 3, yPos)
      
      yPos += 3
      
      // Barra del promedio con bordes redondeados
      pdf.setFillColor(230, 232, 245)
      pdf.roundedRect(15, yPos, barWidth, barHeight, 2, 2, 'F')
      
      const promedioFillWidth = (promedio / maxValor) * barWidth
      pdf.setFillColor(10, 47, 241)
      pdf.roundedRect(15, yPos, promedioFillWidth, barHeight, 2, 2, 'F')

      pdf.save(`diamante-influencia-${new Date().getTime()}.pdf`)
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Hubo un error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="resultsContainer" style={{
      display: 'flex',
      padding: '0 4rem',
      gap: '2rem',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flex: 1
    }}>
      <div className="resultsContent" style={{ flex: 1, width: '600px' }}>
        {!isSubmitted ? (
          <>
            <h1 className="resultsTitle" style={{
              fontSize: '48px',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'white',
              marginBottom: '30px',
              fontFamily: '"Red Hat Display", sans-serif'
            }}>
              ¡Felicitaciones por completar el cuestionario!
            </h1>
            
            <div className="feedbackForm" style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <label htmlFor="feedback" className="feedbackLabel" style={{
                color: 'white',
                fontSize: '1.1rem',
                fontFamily: '"Red Hat Display", sans-serif'
              }}>
                {loadingQuestion ? "Cargando..." : feedbackQuestion}
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="feedbackInput"
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontFamily: '"Red Hat Display", sans-serif',
                  fontSize: '1rem',
                  resize: 'vertical',
                  minHeight: '100px',
                  backgroundColor: 'white'
                }}
              />
              <button 
                type="submit" 
                onClick={handleSubmit}
                className="feedbackSubmit"
                style={{
                  backgroundColor: 'white',
                  color: '#0041ff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginTop: '20px',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start',
                  width: '40%'
                }}
              >
                Enviar
              </button>
            </div>

            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="downloadResultsBtn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                padding: '12px 24px',
                borderRadius: '30px',
                
                fontSize: '16px',
                fontWeight: 500,
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '20px',
                alignSelf: 'flex-start',
                width: '40%',
                opacity: isGeneratingPDF ? 0.6 : 1
              }}
            >
              <Download size={20} />
              {isGeneratingPDF ? 'Generando PDF...' : 'Descargar mis resultados'}
            </button>
          </>
        ) : (
          <div className="thanksContainer" style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
          }}>
            <h1 className="thanksTitle" style={{
              fontSize: '48px',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'white',
              marginBottom: '30px',
              fontFamily: '"Red Hat Display", sans-serif',
              textAlign: 'left'
            }}>
              ¡Gracias por participar!
            </h1>
            <div 
              className="thanksText"
              style={{
                color: 'white',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                fontFamily: '"Red Hat Display", sans-serif',
                textAlign: 'left',
                maxWidth: '600px'
              }}
              dangerouslySetInnerHTML={createMarkup(formatDescription("Ahora que conocés el perfil de influencia de tu marca, cómo estás posicionado y dónde podés seguir creciendo, te invitamos a trabajar juntos estrategias para potenciar los diferentes factores."))}
            />

            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="downloadBookBtn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#0000ff',
                border: 'none',
                borderRadius: '2rem',
                fontWeight: 500,
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '2rem',
                opacity: isGeneratingPDF ? 0.6 : 1
              }}
            >
              <Download size={20} />
              {isGeneratingPDF ? 'Generando...' : 'Descargar resultado'}
            </button>
          </div>
        )}
      </div>

      {!isSubmitted && (
        <div className="resultsChartContainer" style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%'
        }}>
          <div ref={radarChartRef} style={{ width: '100%' }}>
            <RadarChart
              data={chartData}
              theme="dark"
              completedPhases={allPhases}
            />
          </div>
        </div>
      )}

      {/* AdminChart LIGHT oculto para capturar en PDF */}
      <div 
        ref={radarChartLightRef} 
        style={{ 
          position: 'fixed',
          left: '-100vw',
          top: 0,
          width: '700px', 
          height: '700px',
          background: 'white',
          zIndex: -9999
        }}
      >
        <AdminChartPDF
          data={chartData}
          completedPhases={allPhases}
        />
      </div>
    </div>
  )
}

export default ResultsPhase