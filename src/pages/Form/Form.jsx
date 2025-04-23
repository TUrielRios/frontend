import { useState, useEffect } from "react"
import styles from "./Form.module.css"
import { useNavigate } from "react-router-dom"
import gif from "../../assets/diamante-animacion-dos.gif"
import Header from "../../components/Header/Header"
import { ChevronDown } from "lucide-react"
import textos from "../../constants/constants"
import logoLight from "../../assets/logo.png"
import logoDark from "../../assets/logo-black.png"

const Form = () => {
  const navigate = useNavigate()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formType, setFormType] = useState(null) // null, 'taller', or 'curso'
  const [formData, setFormData] = useState({
    // Campos comunes
    compania: "",
    industriaSector: "",
    industriaSectorOtro: "",
    areaDesempeno: "",
    areaDesempenoOtro: "",
    // Campos específicos de curso
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
    cargoOtro: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [descripcionTexto, setDescripcionTexto] = useState(textos.parrafo_formulario)
  const [loading, setLoading] = useState(false)
  
  // Estado para almacenar las opciones de los dropdowns
  const [dropdownOptions, setDropdownOptions] = useState({
    industriaSector: [],
    areaDesempeno: [],
    cargo: []
  })
  
  // Estado para controlar la carga de los desplegables
  const [loadingDropdowns, setLoadingDropdowns] = useState({
    industriaSector: false,
    areaDesempeno: false,
    cargo: false
  })

  // Función para cargar las opciones de los dropdowns desde la API
  const cargarOpcionesDropdown = async () => {
    const endpoints = {
      industriaSector: "https://lacocina-backend-deploy.vercel.app/desplegables/industriaSector",
      areaDesempeno: "https://lacocina-backend-deploy.vercel.app/desplegables/areaDesempeno",
      cargo: "https://lacocina-backend-deploy.vercel.app/desplegables/cargo"
    }
    
    // Para cada categoría, inicializamos la carga y hacemos la petición
    for (const [category, url] of Object.entries(endpoints)) {
      setLoadingDropdowns(prev => ({ ...prev, [category]: true }))
      
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Error al cargar opciones de ${category}: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Ordenamos las opciones según el campo "orden"
        const sortedOptions = data.sort((a, b) => a.orden - b.orden)
          .map(item => item.valor)
        
        setDropdownOptions(prev => ({
          ...prev,
          [category]: sortedOptions
        }))
      } catch (err) {
        console.error(`Error al cargar opciones de ${category}:`, err)
      } finally {
        setLoadingDropdowns(prev => ({ ...prev, [category]: false }))
      }
    }
  }

  // Función para cargar el texto según el tipo de formulario
  const cargarTexto = async (tipo) => {
    if (!tipo) return

    setLoading(true)
    try {
      const endpoint = tipo === "taller" 
        ? "https://lacocina-backend-deploy.vercel.app/textos/texto_taller"
        : "https://lacocina-backend-deploy.vercel.app/textos/texto_curso"
        
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`Error al cargar el texto: ${response.status}`)
      }
      
      const data = await response.json()
      setDescripcionTexto(data.value)
    } catch (err) {
      console.error("Error al cargar el texto:", err)
      // Mantener el texto predeterminado en caso de error
    } finally {
      setLoading(false)
    }
  }

  // Cargar las opciones de los dropdowns al montar el componente
  useEffect(() => {
    cargarOpcionesDropdown()
  }, [])

  // Efecto para cargar el texto cuando cambia el tipo de formulario
  useEffect(() => {
    if (formType) {
      cargarTexto(formType)
    } else {
      // Restaurar el texto original cuando no hay selección
      setDescripcionTexto(textos.parrafo_formulario)
    }
  }, [formType])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (e) => {
    const { name } = e.target
    const selectedText = e.target.options[e.target.selectedIndex].text
    console.log(`Seleccionado para ${name}: ${selectedText}`)
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedText,
    }))
  }

  const handleNavigate = async (e) => {
    e.preventDefault()

    if (!termsAccepted) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Preparar los datos según el tipo de formulario
      const userData = {
        modalidad: formType === "taller" ? "Taller" : "Curso",
        compania: formData.compania,
        industriaSector: formData.industriaSector === "Otro" && formData.industriaSectorOtro 
          ? `Otro: ${formData.industriaSectorOtro}` 
          : formData.industriaSector || "",
        areaDesempeno: formData.areaDesempeno === "Otro" && formData.areaDesempenoOtro 
          ? `Otro: ${formData.areaDesempenoOtro}` 
          : formData.areaDesempeno || "",
        validacionSocial: null,
        atractivo: null,
        reciprocidad: null,
        autoridad: null,
        autenticidad: null,
        consistenciaCompromiso: null,
      }

      // Agregar campos adicionales si es un curso
      if (formType === "curso") {
        userData.nombre = formData.nombre
        userData.apellido = formData.apellido
        userData.email = formData.email
        userData.curso = "Curso IAE Comunicación Institucional 250311" // Valor por defecto
        userData.compania = formData.compania
        userData.cargo = formData.cargo === "Otro" && formData.cargoOtro 
          ? `Otro: ${formData.cargoOtro}` 
          : formData.cargo || ""
      }

      console.log("Enviando datos al backend:", userData)

      // Enviar datos al backend
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al crear el usuario: ${errorText}`)
      }

      const data = await response.json()
      console.log("Usuario creado con éxito:", data)

      // Guardar el ID del usuario y la modalidad para usarlos en el cuestionario
      localStorage.setItem("userId", data.id)
      localStorage.setItem("selectedModalidad", userData.modalidad)

      // Navegar al cuestionario
      navigate("/questionnaire")
    } catch (err) {
      console.error("Error completo:", err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked)
  }

  const handleFormTypeSelect = (type) => {
    setFormType(type)
    // Guardar la modalidad seleccionada
    const modalidad = type === "taller" ? "Taller" : "Curso"
    localStorage.setItem("selectedModalidad", modalidad)
  }

  const handleBackToSelection = () => {
    setFormType(null)
  }

  // Función para renderizar opciones dinámicas de un dropdown
  const renderDropdownOptions = (categoryId) => {
    const options = dropdownOptions[categoryId] || []
    const isLoading = loadingDropdowns[categoryId]
    
    if (isLoading) {
      return <option value="">Cargando opciones...</option>
    }
    
    if (options.length > 0) {
      return options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))
    }
    
    // Opciones de fallback por si falla la carga de la API
    return categoryId === "industriaSector" ? (
      <>
        <option value="Tecnología / Software">Tecnología / Software</option>
        <option value="Servicios Financieros">Servicios Financieros</option>
        <option value="Educación / Academia">Educación / Academia</option>
        <option value="Salud / Farmacia">Salud / Farmacia</option>
        <option value="Cosmética">Cosmética</option>
        <option value="Turismo">Turismo</option>
        <option value="Alimentación y Bebidas">Alimentación y Bebidas</option>
        <option value="Moda / Indumentaria">Moda / Indumentaria</option>
        <option value="Energía">Energía</option>
        <option value="Consultoría">Consultoría</option>
        <option value="Gobierno / ONGs">Gobierno / ONGs</option>
        <option value="Entretenimiento / Medios">Entretenimiento / Medios</option>
        <option value="Transporte / Logística">Transporte / Logística</option>
        <option value="Automotriz">Automotriz</option>
        <option value="Construcción / Infraestructura">Construcción / Infraestructura</option>
        <option value="Agricultura">Agricultura</option>
        <option value="Decoración / Hogar">Decoración / Hogar</option>
        <option value="Higiene / Bienestar">Higiene / Bienestar</option>
        <option value="Otro">Otro</option>
      </>
    ) : categoryId === "areaDesempeno" ? (
      <>
        <option value="Directorio">Directorio</option>
        <option value="Administración/Finanzas">Administración/Finanzas</option>
        <option value="Comercial/Ventas">Comercial/Ventas</option>
        <option value="Marketing">Marketing</option>
        <option value="Diseño/Comunicación">Diseño/Comunicación</option>
        <option value="Recursos Humanos">Recursos Humanos</option>
        <option value="Legales">Legales</option>
        <option value="Investigación y desarrollo">Investigación y desarrollo</option>
        <option value="Ingeniería de planta">Ingeniería de planta</option>
        <option value="Otro">Otro</option>
      </>
    ) : categoryId === "cargo" ? (
      <>
        <option value="CEO / Fundador">CEO / Fundador</option>
        <option value="Director(a) de marketing">Director(a) de marketing</option>
        <option value="Director(a) de comunicación">Director(a) de comunicación</option>
        <option value="Gerente de producto">Gerente de producto</option>
        <option value="Gerente de marca">Gerente de marca</option>
        <option value="Consultor(a)">Consultor(a)</option>
        <option value="Emprendedor(a)">Emprendedor(a)</option>
        <option value="Diseñador(a)">Diseñador(a)</option>
        <option value="Community manager">Community manager</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Académico / Docente">Académico / Docente</option>
        <option value="Estudiante">Estudiante</option>
        <option value="Otro">Otro</option>
      </>
    ) : null
  }

  // Formulario para TALLER
  const renderTallerForm = () => {
    return (
      <form className={styles.form} onSubmit={handleNavigate}>
        <h2 className={styles.formTitle}>Preguntas Clasificatorias</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Compañía*</label>
          <input
            type="text"
            name="compania"
            value={formData.compania}
            onChange={handleInputChange}
            placeholder="Nombre de la compañía"
            className={styles.inputlarge}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Industria/Sector*</label>
          <div className={styles.selectWrapper}>
            <select
              name="industriaSector"
              value={formData.industriaSector}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("industriaSector")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
          {formData.industriaSector === "Otro" && (
            <input
              type="text"
              name="industriaSectorOtro"
              value={formData.industriaSectorOtro}
              onChange={handleInputChange}
              placeholder="Especifique la industria/sector"
              className={styles.inputlarge}
              style={{ marginTop: "10px" }}
              required
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Área de Desempeño*</label>
          <div className={styles.selectWrapper}>
            <select
              name="areaDesempeno"
              value={formData.areaDesempeno}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("areaDesempeno")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
          {formData.areaDesempeno === "Otro" && (
            <input
              type="text"
              name="areaDesempenoOtro"
              value={formData.areaDesempenoOtro}
              onChange={handleInputChange}
              placeholder="Especifique el área de desempeño"
              className={styles.inputlarge}
              style={{ marginTop: "10px" }}
              required
            />
          )}
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>Acepto recibir comunicaciones de La cocina.</span>
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" required onChange={handleTermsChange} />
            <span>
              Acepto la{" "}
              <a href="#" className={styles.link}>
                política de privacidad
              </a>
              .
            </span>
          </label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={!termsAccepted || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Comenzar el cuestionario"}
        </button>

        <p className={styles.timeEstimate}>Solo tomará 20 minutos</p>
      </form>
    )
  }

  // Formulario para CURSO
  const renderCursoForm = () => {
    return (
      <form className={styles.form} onSubmit={handleNavigate}>
        <h2 className={styles.formTitle}>Preguntas Clasificatorias</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Nombre y apellido*</label>
          <div className={styles.nameFields}>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className={styles.inputMedium}
              required
            />
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Apellido"
              className={styles.inputMedium}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Ingrese su email"
            className={styles.inputMedium}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Curso*</label>
          <div className={styles.selectWrapper}>
            <select
              name="curso"
              value={formData.curso}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="Curso IAE Comunicación Institucional 250311">
                Curso IAE Comunicación Institucional 250311
              </option>
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Compañía*</label>
          <input
            type="text"
            name="compania"
            value={formData.compania}
            onChange={handleInputChange}
            placeholder="Nombre de la compañía"
            className={styles.inputlarge}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Industria/Sector*</label>
          <div className={styles.selectWrapper}>
            <select
              name="industriaSector"
              value={formData.industriaSector}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("industriaSector")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
          {formData.industriaSector === "Otro" && (
            <input
              type="text"
              name="industriaSectorOtro"
              value={formData.industriaSectorOtro}
              onChange={handleInputChange}
              placeholder="Especifique la industria/sector"
              className={styles.inputlarge}
              style={{ marginTop: "10px" }}
              required
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Área de Desempeño*</label>
          <div className={styles.selectWrapper}>
            <select
              name="areaDesempeno"
              value={formData.areaDesempeno}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("areaDesempeno")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
          {formData.areaDesempeno === "Otro" && (
            <input
              type="text"
              name="areaDesempenoOtro"
              value={formData.areaDesempenoOtro}
              onChange={handleInputChange}
              placeholder="Especifique el área de desempeño"
              className={styles.inputlarge}
              style={{ marginTop: "10px" }}
              required
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Cargo/Posición*</label>
          <div className={styles.selectWrapper}>
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleSelectChange}
              className={styles.select}
              required
            >
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("cargo")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
          {formData.cargo === "Otro" && (
            <input
              type="text"
              name="cargoOtro"
              value={formData.cargoOtro}
              onChange={handleInputChange}
              placeholder="Especifique el cargo/posición"
              className={styles.inputlarge}
              style={{ marginTop: "10px" }}
              required
            />
          )}
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>Acepto recibir comunicaciones de La cocina.</span>
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" required onChange={handleTermsChange} />
            <span>
              Acepto la{" "}
              <a href="#" className={styles.link}>
                política de privacidad
              </a>
              .
            </span>
          </label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={!termsAccepted || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Comenzar el cuestionario"}
        </button>

        <p className={styles.timeEstimate}>Solo tomará 20 minutos</p>
      </form>
    )
  }

  return (
    <div className={styles.container}>
      <Header logoDark={logoDark} logoLight={logoLight} />

      <main className={styles.main}>
        {/* Columna izquierda con el contenido y botones */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            El diamante de
            <br />
            la influencia
          </h1>
          <p className={styles.subtitle}>Conocé el poder de influencia de tu marca.</p>
          <p className={styles.description}>
            {loading ? "Cargando..." : descripcionTexto}
          </p>
          <p className={styles.privacy}>
            Recordá que la información que proporciones es confidencial y solo se utilizará para fines estadísticos.
          </p>

          {/* Botones de selección debajo del texto */}
          {formType === null && (
            <div className={styles.formTypeOptions}>
              <button className={styles.formTypeButton} onClick={() => handleFormTypeSelect("taller")}>
                TALLER
              </button>
              <button className={styles.formTypeButton} onClick={() => handleFormTypeSelect("curso")}>
                CURSO
              </button>
            </div>
          )}
        </div>

        {/* Columna derecha con el GIF o el formulario */}
        <div className={styles.rightColumn}>
          {formType === null ? (
            // Mostrar el GIF cuando no se ha seleccionado un tipo de formulario
            <div className={styles.gifContainer}>
              <img src={gif || "/placeholder.svg"} alt="Diamante de la influencia" className={styles.diamanteGif} />
            </div>
          ) : (
            // Mostrar el formulario correspondiente cuando se ha seleccionado un tipo
            <div className={styles.formContainer}>
              <button onClick={handleBackToSelection} className={styles.backButton}>
                ← Volver
              </button>
              {formType === "taller" ? renderTallerForm() : renderCursoForm()}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Form