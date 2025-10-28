// components/PDFDocument.js
import { Document, Page, Text, View, StyleSheet, Image, Svg, Polygon, Line, G } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  leftColumn: {
    width: '40%',
    paddingRight: 20,
  },
  rightColumn: {
    width: '60%',
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a2ff1',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0a2ff1',
    marginBottom: 10,
  },
  factorRow: {
    marginBottom: 10,
  },
  factorName: {
    fontSize: 9,
    color: '#0a2ff1',
    marginBottom: 4,
  },
  factorValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0a2ff1',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  barContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e6e8f0',
    borderRadius: 3,
    marginTop: 4,
    position: 'relative',
  },
  barFill: {
    height: 6,
    backgroundColor: '#0a2ff1',
    borderRadius: 3,
  },
  averageContainer: {
    backgroundColor: '#f0f2ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 10,
    color: '#3c3c3c',
  },
  averageValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0a2ff1',
  },
  chartContainer: {
    width: '100%',
    height: 400,
    marginTop: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
})

const PDFDocument = ({ chartData, icons }) => {
  const factores = [
    { nombre: 'ATRACTIVO', valor: chartData['ATRACTIVO'] },
    { nombre: 'VALIDACIÓN SOCIAL', valor: chartData['VALIDACIÓN SOCIAL'] },
    { nombre: 'RECIPROCIDAD', valor: chartData['RECIPROCIDAD'] },
    { nombre: 'AUTORIDAD', valor: chartData['AUTORIDAD'] },
    { nombre: 'AUTENTICIDAD', valor: chartData['AUTENTICIDAD'] },
    { nombre: 'CONSISTENCIA Y COMPROMISO', valor: chartData['CONSISTENCIA Y COMPROMISO'] }
  ]

  const promedio = factores.reduce((sum, f) => sum + f.valor, 0) / factores.length

  // Función para generar puntos del hexágono
  const generateHexPoints = (centerX, centerY, radius) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  // Función para calcular puntos de datos
  const calculateDataPoints = () => {
    const labels = [
      "ATRACTIVO",
      "RECIPROCIDAD", 
      "AUTORIDAD",
      "AUTENTICIDAD",
      "CONSISTENCIA Y COMPROMISO",
      "VALIDACIÓN SOCIAL",
    ]
    
    const points = []
    const center = { x: 150, y: 150 }
    const maxRadius = 84

    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      const value = chartData[labels[i]] || 0
      const clampedValue = Math.max(0, Math.min(10, value))
      const radius = (clampedValue / 10) * maxRadius

      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  const labelPositions = [
    { label: 'ATRACTIVO', angle: -90, radius: 115, icon: icons?.ATRACTIVO },
    { label: 'RECIPROCIDAD', angle: -30, radius: 125, icon: icons?.RECIPROCIDAD },
    { label: 'AUTORIDAD', angle: 30, radius: 125, icon: icons?.AUTORIDAD },
    { label: 'AUTENTICIDAD', angle: 90, radius: 115, icon: icons?.AUTENTICIDAD },
    { label: 'CONSISTENCIA', angle: 150, radius: 130, secondLine: 'Y COMPROMISO', icon: icons?.['CONSISTENCIA Y COMPROMISO'] },
    { label: 'VALIDACIÓN', angle: 210, radius: 125, secondLine: 'SOCIAL', icon: icons?.['VALIDACIÓN SOCIAL'] },
  ]

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Columna Izquierda - Factores */}
        <View style={styles.leftColumn}>
          <Text style={styles.title}>Análisis de Factores</Text>
          
          <Text style={styles.sectionTitle}>Factores de Influencia</Text>
          
          {factores.map((factor, index) => (
            <View key={index} style={styles.factorRow}>
              <View style={{ position: 'relative' }}>
                <Text style={styles.factorName}>{factor.nombre}</Text>
                <Text style={styles.factorValue}>{factor.valor.toFixed(1)}</Text>
              </View>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.barFill, 
                    { width: `${(factor.valor / 10) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}

          <View style={styles.averageContainer}>
            <Text style={styles.averageLabel}>Promedio General</Text>
            <Text style={styles.averageValue}>{promedio.toFixed(1)}</Text>
          </View>
        </View>

        {/* Columna Derecha - Gráfico Radar */}
        <View style={styles.rightColumn}>
          <View style={styles.chartContainer}>
            <Svg width="300" height="300" viewBox="0 0 300 300">
              {/* Hexágonos de fondo */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
                <Polygon
                  key={`hex-${index}`}
                  points={generateHexPoints(150, 150, 90 * scale)}
                  fill="white"
                  stroke="#0a2ff1"
                  strokeWidth="2"
                />
              ))}

              {/* Líneas radiales */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                const x2 = 150 + 90 * Math.cos(angle)
                const y2 = 150 + 90 * Math.sin(angle)
                return (
                  <Line
                    key={`line-${i}`}
                    x1="150"
                    y1="150"
                    x2={x2}
                    y2={y2}
                    stroke="#0a2ff1"
                    strokeWidth="0.5"
                    strokeDasharray="2 6"
                    opacity="0.1"
                  />
                )
              })}

              {/* Área de datos */}
              <Polygon
                points={calculateDataPoints()}
                fill="#3FFFF3"
                fillOpacity="0.3"
                stroke="#00ffff"
                strokeWidth="2"
              />

              {/* Etiquetas con iconos */}
              {labelPositions.map((item, index) => {
                const angleRad = (item.angle * Math.PI) / 180
                const x = 150 + item.radius * Math.cos(angleRad)
                const y = 150 + item.radius * Math.sin(angleRad)
                const iconX = x - 12
                const iconY = y - 30
                
                return (
                  <G key={index}>
                    {item.icon && (
                      <Image
                        x={iconX}
                        y={iconY}
                        style={styles.icon}
                        src={item.icon}
                      />
                    )}
                    <Text
                      x={x}
                      y={y}
                      fontSize="7"
                      fill="#0a2ff1"
                      textAnchor="middle"
                    >
                      {item.label}
                    </Text>
                    {item.secondLine && (
                      <Text
                        x={x}
                        y={y + 10}
                        fontSize="7"
                        fill="#0a2ff1"
                        textAnchor="middle"
                      >
                        {item.secondLine}
                      </Text>
                    )}
                  </G>
                )
              })}
            </Svg>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PDFDocument