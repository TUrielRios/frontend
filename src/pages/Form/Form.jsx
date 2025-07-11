"use client"
import { useState, useEffect } from "react"
import styles from "./Form.module.css"
import { useNavigate } from "react-router-dom"
import gif from "../../assets/diamante-animacion-dos.gif"
import Header from "../../components/Header/Header"
import { ChevronDown } from "lucide-react"
import textos from "../../constants/constants"
import logoLight from "../../assets/logo.png"
import logoDark from "../../assets/logo-black.png"
import PrivacyPolicyModal from "../../components/PrivacyPolicyModal/PrivacyPolicyModal"

const Form = () => {
  const navigate = useNavigate()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [formType, setFormType] = useState(null) // null, 'taller', or 'curso'
  const [formData, setFormData] = useState({
    // Campos comunes
    compania: "",
    industriaSector: "",
    industriaSectorOtro: "",
    sector: "",
    areaDesempeno: "",
    areaDesempenoOtro: "",
    // Campos específicos de curso
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
    cargoOtro: "",
    curso: "", // Añadido campo curso
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [descripcionTexto, setDescripcionTexto] = useState(textos.parrafo_formulario)
  const [loading, setLoading] = useState(false)

  // Estado para las modalidades dinámicas
  const [modalidades, setModalidades] = useState([])
  const [loadingModalidades, setLoadingModalidades] = useState(true)

  // Estado para almacenar los labels dinámicos y su visibilidad
  const [labels, setLabels] = useState({
    compania: { value: "Compañía", isHidden: false },
    industria: { value: "Industria", isHidden: false },
    sector: { value: "Sector", isHidden: false },
    areaDesempeno: { value: "Área de Desempeño", isHidden: false },
  })
  const [loadingLabels, setLoadingLabels] = useState(true)

  // Estado para almacenar las opciones de los dropdowns
  const [dropdownOptions, setDropdownOptions] = useState({
    curso: [],
    compania: [],
    industriaSector: [],
    sector: [],
    areaDesempeno: [],
    cargo: [],
  })

  // Estado para controlar la carga de los desplegables
  const [loadingDropdowns, setLoadingDropdowns] = useState({
    curso: false,
    compania: false,
    industriaSector: false,
    sector: false,
    areaDesempeno: false,
    cargo: false,
  })

  // Función para cargar las modalidades desde la API
  const cargarModalidades = async () => {
    setLoadingModalidades(true)
    try {
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/modalidades")
      if (!response.ok) {
        throw new Error(`Error al cargar las modalidades: ${response.status}`)
      }
      const data = await response.json()
      console.log("Modalidades cargadas:", data)
      setModalidades(data)
    } catch (err) {
      console.error("Error al cargar las modalidades:", err)
      // Fallback a modalidades por defecto en caso de error (cambiar 'activo' por 'habilitado')
      setModalidades([
        { nombre: "Curso", habilitado: true },
        { nombre: "Taller", habilitado: true },
      ])
    } finally {
      setLoadingModalidades(false)
    }
  }

  // Función para cargar los labels dinámicos desde la API
  const cargarLabels = async () => {
    setLoadingLabels(true)
    try {
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/textos")
      if (!response.ok) {
        throw new Error(`Error al cargar los labels: ${response.status}`)
      }
      const data = await response.json()
      // Crear un objeto con los labels y su visibilidad basado en las keys
      const labelsMap = {}
      data.forEach((item) => {
        switch (item.key) {
          case "titulo_campo_uno":
            labelsMap.compania = { value: item.value, isHidden: item.isHidden || false }
            break
          case "titulo_campo_dos":
            labelsMap.industria = { value: item.value, isHidden: item.isHidden || false }
            break
          case "titulo_campo_tres":
            labelsMap.sector = { value: item.value, isHidden: item.isHidden || false }
            break
          case "titulo_campo_cuatro":
            labelsMap.areaDesempeno = { value: item.value, isHidden: item.isHidden || false }
            break
        }
      })
      // Actualizar el estado con los nuevos labels, manteniendo los defaults si no se encuentran
      setLabels((prevLabels) => ({
        ...prevLabels,
        ...labelsMap,
      }))
    } catch (err) {
      console.error("Error al cargar los labels:", err)
      // Mantener los labels por defecto en caso de error
    } finally {
      setLoadingLabels(false)
    }
  }

  // Función para cargar las opciones de los dropdowns desde la API
  const cargarOpcionesDropdown = async () => {
    const endpoints = {
      curso: "https://lacocina-backend-deploy.vercel.app/desplegables/curso",
      compania: "https://lacocina-backend-deploy.vercel.app/desplegables/compania",
      industriaSector: "https://lacocina-backend-deploy.vercel.app/desplegables/industriaSector",
      sector: "https://lacocina-backend-deploy.vercel.app/desplegables/sector",
      areaDesempeno: "https://lacocina-backend-deploy.vercel.app/desplegables/areaDesempeno",
      cargo: "https://lacocina-backend-deploy.vercel.app/desplegables/cargo",
    }

    // Para cada categoría, inicializamos la carga y hacemos la petición
    for (const [category, url] of Object.entries(endpoints)) {
      setLoadingDropdowns((prev) => ({ ...prev, [category]: true }))
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Error al cargar opciones de ${category}: ${response.status}`)
        }
        const data = await response.json()
        // Ordenamos las opciones según el campo "orden"
        const sortedOptions = data.sort((a, b) => a.orden - b.orden).map((item) => item.valor)
        setDropdownOptions((prev) => ({
          ...prev,
          [category]: sortedOptions,
        }))
      } catch (err) {
        console.error(`Error al cargar opciones de ${category}:`, err)
      } finally {
        setLoadingDropdowns((prev) => ({ ...prev, [category]: false }))
      }
    }
  }

  // Función para cargar el texto según el tipo de formulario
  const cargarTexto = async (tipo) => {
    if (!tipo) return
    setLoading(true)
    try {
      const endpoint =
        tipo === "taller"
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

  // Cargar los labels, las opciones de los dropdowns y las modalidades al montar el componente
  useEffect(() => {
    cargarLabels()
    cargarOpcionesDropdown()
    cargarModalidades()
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
        industriaSector:
          formData.industriaSector === "Otro" && formData.industriaSectorOtro
            ? `Otro: ${formData.industriaSectorOtro}`
            : formData.industriaSector || "",
        sector: formData.sector,
        areaDesempeno:
          formData.areaDesempeno === "Otro" && formData.areaDesempenoOtro
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
        userData.curso = formData.curso
        userData.cargo =
          formData.cargo === "Otro" && formData.cargoOtro ? `Otro: ${formData.cargoOtro}` : formData.cargo || ""
        userData.compania = formData.compania // Asegúrate de incluir este campo también
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

  // Agrega esta función para manejar el click en el enlace
  const handlePrivacyClick = (e) => {
    e.preventDefault()
    setShowPrivacyModal(true)
  }

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked)
  }

  const handleFormTypeSelect = (type) => {
    // Buscar la modalidad en el array para verificar si está habilitada
    const modalidad = modalidades.find((m) => m.nombre.toLowerCase() === type.toLowerCase())

    // Solo permitir la selección si la modalidad está habilitada (cambiar 'activo' por 'habilitado')
    if (modalidad && modalidad.habilitado) {
      setFormType(type)
      // Guardar la modalidad seleccionada
      const modalidadNombre = type === "taller" ? "Taller" : "Curso"
      localStorage.setItem("selectedModalidad", modalidadNombre)
    }
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
        <option key={index} value={option}>
          {option}
        </option>
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
    ) : categoryId === "curso" ? (
      <>
        <option value="Curso 1">Curso 1</option>
        <option value="Curso 2">Curso 2</option>
        <option value="Curso 3">Curso 3</option>
      </>
    ) : null
  }

  // Función para renderizar los botones de modalidades dinámicamente
  const renderModalidadButtons = () => {
    if (loadingModalidades) {
      return (
        <div className={styles.formTypeOptions}>
          <div className={styles.loadingModalidades}>Cargando modalidades...</div>
        </div>
      )
    }

    return (
      <div className={styles.formTypeOptions}>
        {modalidades.map((modalidad, index) => {
          const isActive = modalidad.habilitado // Cambiar 'activo' por 'habilitado'
          const buttonType = modalidad.nombre.toLowerCase()

          return (
            <button
              key={index}
              className={`${styles.formTypeButton} ${!isActive ? styles.formTypeButtonDisabled : ""}`}
              onClick={() => handleFormTypeSelect(buttonType)}
              disabled={!isActive}
              title={!isActive ? `${modalidad.nombre} no disponible` : `Seleccionar ${modalidad.nombre}`}
            >
              {modalidad.nombre.toUpperCase()}
            </button>
          )
        })}
      </div>
    )
  }

  // Formulario para TALLER
  const renderTallerForm = () => {
    return (
      <form className={styles.form} onSubmit={handleNavigate}>
        <h2 className={styles.formTitle}>Preguntas Clasificatorias</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {!labels.compania.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.compania.value}*</label>
            <div className={styles.selectWrapper}>
              <select
                name="compania"
                value={formData.compania}
                onChange={handleSelectChange}
                className={styles.select}
                required
              >
                <option value="">Seleccione una opción</option>
                {renderDropdownOptions("compania")}
              </select>
              <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
            </div>
          </div>
        )}

        {!labels.industria.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.industria.value}*</label>
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
        )}

        {!labels.sector.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.sector.value}*</label>
            <div className={styles.selectWrapper}>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleSelectChange}
                className={styles.select}
                required
              >
                <option value="">Seleccione una opción</option>
                {renderDropdownOptions("sector")}
              </select>
              <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
            </div>
          </div>
        )}

        {!labels.areaDesempeno.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.areaDesempeno.value}*</label>
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
        )}

        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}>
            <input type="checkbox" required onChange={handleTermsChange} />
            <span>
              Acepto la{" "}
              <a href="#" className={styles.link} onClick={handlePrivacyClick}>
                política de privacidad
              </a>
              .
            </span>
          </label>
        </div>

        {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}

        <button type="submit" className={styles.submitButton} disabled={!termsAccepted || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Comenzar el cuestionario"}
        </button>
        <p className={styles.timeEstimate}>Solo tomará 10 minutos</p>
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
              <option value="">Seleccione una opción</option>
              {renderDropdownOptions("curso")}
            </select>
            <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
          </div>
        </div>

        {!labels.compania.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.compania.value}*</label>
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
        )}

        {!labels.industria.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.industria.value}*</label>
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
        )}

        {!labels.sector.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.sector.value}*</label>
            <div className={styles.selectWrapper}>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleSelectChange}
                className={styles.select}
                required
              >
                <option value="">Seleccione una opción</option>
                {renderDropdownOptions("sector")}
              </select>
              <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
            </div>
          </div>
        )}

        {!labels.areaDesempeno.isHidden && (
          <div className={styles.formGroup}>
            <label>{loadingLabels ? "Cargando..." : labels.areaDesempeno.value}*</label>
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
        )}

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
              <a href="#" className={styles.link} onClick={handlePrivacyClick}>
                política de privacidad
              </a>
              .
            </span>
          </label>
        </div>

        {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}

        <button type="submit" className={styles.submitButton} disabled={!termsAccepted || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Comenzar el cuestionario"}
        </button>
        <p className={styles.timeEstimate}>Solo tomará 10 minutos</p>
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
            El Diamante de
            <br />
            la Influencia
          </h1>
          <p className={styles.description}>{loading ? "Cargando..." : descripcionTexto}</p>
          <p className={styles.footerFormContainer}>
            Recordá que la información que proporciones es confidencial y se utilizará únicamente con fines
            estadísticos.
          </p>

          {/* Botones de selección debajo del texto */}
          {formType === null && renderModalidadButtons()}
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
