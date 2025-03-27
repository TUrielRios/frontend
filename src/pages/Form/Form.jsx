"use client"

import { useState } from "react"
import styles from "./Form.module.css"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import Header from "../../components/Header/Header"
import { ChevronDown } from "lucide-react"
import textos from "../../constants/constants"

const Form = () => {
  const navigate = useNavigate()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formType, setFormType] = useState(null) // null, 'taller', or 'curso'
  const [formData, setFormData] = useState({
    // Campos comunes
    compania: "",
    industriaSector: "",
    areaDesempeno: "",
    // Campos específicos de curso
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
        industriaSector: formData.industriaSector || "",
        areaDesempeno: formData.areaDesempeno || "",
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
        userData.industriaSector = formData.industriaSector || ""
        userData.areaDesempeno = formData.areaDesempeno || ""
        userData.cargo = formData.cargo || ""
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

  // Update the renderFormTypeSelection function to remove the title and add blue background
  const renderFormTypeSelection = () => {
    return (
      <div className={styles.formTypeSelection}>
        <div className={styles.formTypeOptions}>
          <div className={styles.formTypeCard} onClick={() => handleFormTypeSelect("taller")}>
            <div className={styles.formTypeIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={styles.formTypeCardTitle}>TALLER</h3>
          </div>
          <div className={styles.formTypeCard} onClick={() => handleFormTypeSelect("curso")}>
            <div className={styles.formTypeIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={styles.formTypeCardTitle}>CURSO</h3>
          </div>
        </div>
      </div>
    )
  }

  // Update the renderTallerForm and renderCursoForm functions to add the title
  // First, update the renderTallerForm function
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
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
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
              <option value="Directorio">Directorio</option>
              <option value="Administración/Finanzas">Administración/Finanzas</option>
              <option value="Comercial/Ventas">Comercial/Ventas</option>
              <option value="Marketing"> Marketing</option>
              <option value="Diseño/Comunicación">Diseño/Comunicación</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Legales">Legales</option>
              <option value="Investigación y desarrollo">Investigación y desarrollo</option>
              <option value="Ingeniería de planta">Ingeniería de planta</option>
              <option value="Otro">Otro</option>
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
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

  // Now update the renderCursoForm function
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
            className={styles.inputlarge}
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
              <option value="Curso IAE Comunicación Institucional 250311">Curso IAE Comunicación Institucional 250311</option>
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
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
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
              <option value="Directorio">Directorio</option>
              <option value="Administración/Finanzas">Administración/Finanzas</option>
              <option value="Comercial/Ventas">Comercial/Ventas</option>
              <option value="Marketing"> Marketing</option>
              <option value="Diseño/Comunicación">Diseño/Comunicación</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Legales">Legales</option>
              <option value="Investigación y desarrollo">Investigación y desarrollo</option>
              <option value="Ingeniería de planta">Ingeniería de planta</option>
              <option value="Otro">Otro</option>
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
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
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
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

  // Update the return statement to have different container classes for the first and second slides
  return (
    <div className={styles.container}>
      <Header logo={logo} />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            El diamante de
            <br />
            la influencia
          </h1>
          <p className={styles.subtitle}>Conocé el poder de influencia de tu marca.</p>
          <p className={styles.description}>{textos.parrafo_formulario}</p>
          <p className={styles.privacy}>
            Recordá que la información que proporciones es confidencial y solo se utilizará para fines estadísticos.
          </p>
        </div>

        <div className={formType === null ? styles.formContainerBlue : styles.formContainer}>
          {formType === null ? (
            renderFormTypeSelection()
          ) : (
            <>
              <button onClick={handleBackToSelection} className={styles.backButton}>
                ← Volver
              </button>
              {formType === "taller" ? renderTallerForm() : renderCursoForm()}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Form

