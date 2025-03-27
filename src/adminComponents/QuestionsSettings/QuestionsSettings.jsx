"use client"

import { useState, useEffect } from "react"
import { Save, Edit, X, RefreshCw, Search, FileText, Plus, Trash2, AlertCircle } from "lucide-react"
import styles from "./QuestionsSettings.module.css"

// Importar iconos animados
import validacionSocialIcono from "../../assets/iconos-animados/validacion-social-icono.gif"
import atractivoIcono from "../../assets/iconos-animados/atractivo-icono.gif"
import reciprocidadIcono from "../../assets/iconos-animados/reciprocidad-icono.gif"
import autoridadIcono from "../../assets/iconos-animados/autoridad-icono.gif"
import autenticidadIcono from "../../assets/iconos-animados/autenticidad-icono.gif"
import consistenciaIcono from "../../assets/iconos-animados/compromiso-icono.gif"

const QuestionsSettings = () => {
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [editedQuestion, setEditedQuestion] = useState({
    text: "",
    category: "",
    phase: "",
    modalidad: "Curso" // Valor por defecto
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [phases, setPhases] = useState([])
  const [selectedPhase, setSelectedPhase] = useState(null)

  // Cargar preguntas desde la API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/preguntas")
        if (!response.ok) {
          throw new Error("Error al cargar las preguntas")
        }
        const data = await response.json()
        setQuestions(data)

        // Extract unique phases
        const uniquePhases = [...new Set(data.map((q) => q.phase))]
        setPhases(uniquePhases)

        // Set default selected phase if available
        if (uniquePhases.length > 0 && !selectedPhase) {
          setSelectedPhase(uniquePhases[0])
        }

        setLoading(false)
      } catch (err) {
        setError("Error al cargar las preguntas: " + err.message)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Seleccionar una pregunta para editar
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question)
    setEditedQuestion({
      text: question.text,
      category: question.category,
      phase: question.phase,
      modalidad: question.modalidad // Añade esto

    })
    setError(null)
    setSuccess(null)
    setDeleteConfirm(false)
    setIsCreating(false)
  }

  // Iniciar creación de nueva pregunta
  const handleCreateNew = () => {
    setSelectedQuestion(null)
    setEditedQuestion({
      text: "",
      category: "",
      phase: selectedPhase || "",
      modalidad: "Curso" // Valor por defecto

    })
    setError(null)
    setSuccess(null)
    setDeleteConfirm(false)
    setIsCreating(true)
  }

  // Manejar cambios en los campos de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Guardar cambios en una pregunta
  const handleSaveQuestion = async () => {
    // Validar campos
    if (!editedQuestion.text || !editedQuestion.category || !editedQuestion.phase) {
      setError("Todos los campos son obligatorios")
      return
    }

    try {
      setSaving(true)
      setError(null)

      let response
      let method
      let url = "https://lacocina-backend-deploy.vercel.app/preguntas"
      const body = {
        text: editedQuestion.text,
        category: editedQuestion.category,
        phase: editedQuestion.phase,
        modalidad: editedQuestion.modalidad // Añade esto

      }

      if (isCreating) {
        // Crear nueva pregunta
        method = "POST"
      } else {
        // Actualizar pregunta existente
        method = "PUT"
        url = `${url}/${selectedQuestion.id}`
      }

      response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Error al ${isCreating ? "crear" : "actualizar"} la pregunta`)
      }

      const updatedQuestion = await response.json()

      // Actualizar el estado local
      if (isCreating) {
        setQuestions([...questions, updatedQuestion])
        setSelectedQuestion(updatedQuestion)
        setIsCreating(false)
      } else {
        const updatedQuestions = questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
        setQuestions(updatedQuestions)
        setSelectedQuestion(updatedQuestion)
      }

      setSuccess(`Pregunta ${isCreating ? "creada" : "actualizada"} correctamente`)

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError(`Error al ${isCreating ? "crear" : "actualizar"} la pregunta: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Eliminar una pregunta
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return

    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`https://lacocina-backend-deploy.vercel.app/preguntas/${selectedQuestion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la pregunta")
      }

      // Actualizar el estado local
      const updatedQuestions = questions.filter((q) => q.id !== selectedQuestion.id)
      setQuestions(updatedQuestions)
      setSelectedQuestion(null)
      setDeleteConfirm(false)
      setSuccess("Pregunta eliminada correctamente")

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Error al eliminar la pregunta: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Cancelar la edición
  const handleCancelEdit = () => {
    if (isCreating) {
      setIsCreating(false)
      setSelectedQuestion(null)
    } else if (selectedQuestion) {
      setEditedQuestion({
        text: selectedQuestion.text,
        category: selectedQuestion.category,
        phase: selectedQuestion.phase,
      })
    }
    setError(null)
    setSuccess(null)
    setDeleteConfirm(false)
  }

  // Filtrar preguntas por término de búsqueda
  const filteredQuestions = questions.filter(
    (question) =>
      question.modalidad === editedQuestion.modalidad && // Filtra por modalidad
      (selectedPhase ? question.phase === selectedPhase : true) &&
      (searchTerm
        ? question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.phase.toLowerCase().includes(searchTerm.toLowerCase())
        : true),
  )

  // Mapeo de fases a iconos y nombres
  const phaseIcons = {
    "VALIDACIÓN SOCIAL": {
      icon: validacionSocialIcono,
      name: "Validación Social",
    },
    ATRACTIVO: {
      icon: atractivoIcono,
      name: "Atractivo",
    },
    RECIPROCIDAD: {
      icon: reciprocidadIcono,
      name: "Reciprocidad",
    },
    AUTORIDAD: {
      icon: autoridadIcono,
      name: "Autoridad",
    },
    AUTENTICIDAD: {
      icon: autenticidadIcono,
      name: "Autenticidad",
    },
    "CONSISTENCIA Y COMPROMISO": {
      icon: consistenciaIcono,
      name: "Consistencia y Compromiso",
    },
  }

  return (
    <div className={styles.settingsPage}>

      <div className={styles.content}>
        <div className={styles.centeredContainer}>
          <h1 className={styles.pageTitle}>Gestión de Preguntas</h1>
          <p className={styles.pageDescription}>
            Administra las preguntas que se muestran en la aplicación. Selecciona un factor para ver sus preguntas.
          </p>

              {/* Selector de Modalidad */}
    <div className={styles.modalitySelector}>
      <div className={styles.modalityTabs}>
        <button
          className={`${styles.modalityTab} ${editedQuestion.modalidad === 'Curso' ? styles.activeModality : ''}`}
          onClick={() => setEditedQuestion(prev => ({ ...prev, modalidad: 'Curso' }))}
        >
          Curso
        </button>
        <button
          className={`${styles.modalityTab} ${editedQuestion.modalidad === 'Taller' ? styles.activeModality : ''}`}
          onClick={() => setEditedQuestion(prev => ({ ...prev, modalidad: 'Taller' }))}
        >
          Taller
        </button>
      </div>
    </div>

          <div className={styles.phaseTabs}>
            {Object.keys(phaseIcons).map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`${styles.phaseTab} ${selectedPhase === phase ? styles.activePhase : ""}`}
                title={phaseIcons[phase].name}
              >
                <div className={styles.phaseIconWrapper}>
                  <img
                    src={phaseIcons[phase].icon || "/placeholder.svg"}
                    alt={phaseIcons[phase].name}
                    className={styles.phaseIcon}
                  />
                </div>
                {selectedPhase === phase && <div className={styles.activeIndicator}></div>}
              </button>
            ))}
          </div>

          <div className={styles.questionEditorContainer}>
            <div className={styles.questionsList}>
              <div className={styles.listHeader}>
                <div className={styles.searchContainer}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar preguntas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchTerm && (
                    <button className={styles.clearSearchBtn} onClick={() => setSearchTerm("")}>
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button className={styles.addButton} onClick={handleCreateNew} title="Añadir nueva pregunta">
                  <Plus size={18} />
                </button>
              </div>

              {loading ? (
                <div className={styles.loadingContainer}>
                  <RefreshCw size={24} className={styles.loadingIcon} />
                  <p>Cargando preguntas...</p>
                </div>
              ) : (
                <div className={styles.questionsListItems}>
                  {filteredQuestions.length === 0 ? (
                    <p className={styles.noResults}>No se encontraron preguntas</p>
                  ) : (
                    <>
                      <div className={styles.questionCount}>Mostrando {filteredQuestions.length} preguntas</div>
                      {filteredQuestions.map((question) => (
                        <div
                          key={question.id}
                          className={`${styles.questionItem} ${selectedQuestion?.id === question.id ? styles.selected : ""}`}
                          onClick={() => handleSelectQuestion(question)}
                        >
                          <FileText size={18} className={styles.questionIcon} />
                          <div className={styles.questionItemContent}>
                            <h3>{question.text}</h3>
                            <div className={styles.questionMeta}>
                              <span className={styles.phase}>{question.phase}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className={styles.questionEditor}>
              {selectedQuestion || isCreating ? (
                <>
                  <div className={styles.editorHeader}>
                    <h2>{isCreating ? "Nueva Pregunta" : "Editar Pregunta"}</h2>
                    <div className={styles.editorActions}>
                      {!isCreating && (
                        <button
                          className={`${styles.deleteButton} ${deleteConfirm ? styles.confirmDelete : ""}`}
                          onClick={() => (deleteConfirm ? handleDeleteQuestion() : setDeleteConfirm(true))}
                          title={deleteConfirm ? "Confirmar eliminación" : "Eliminar pregunta"}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button className={styles.cancelButton} onClick={handleCancelEdit} title="Cancelar cambios">
                        <X size={18} />
                      </button>
                      <button
                        className={styles.saveButton}
                        onClick={handleSaveQuestion}
                        disabled={saving}
                        title={isCreating ? "Crear pregunta" : "Guardar cambios"}
                      >
                        {saving ? <RefreshCw size={18} className={styles.savingIcon} /> : <Save size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && <div className={styles.errorMessage}>{error}</div>}
                  {success && <div className={styles.successMessage}>{success}</div>}
                  {deleteConfirm && (
                    <div className={styles.deleteConfirmMessage}>
                      <AlertCircle size={18} />
                      <span>¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.</span>
                    </div>
                  )}

                  <div className={styles.editorContent}>
                    <div className={styles.formGroup}>
                      <label htmlFor="text">Pregunta</label>
                      <textarea
                        id="text"
                        name="text"
                        value={editedQuestion.text}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Escribe la pregunta aquí..."
                        rows={4}
                      />
                    </div>

                    <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                        <label htmlFor="phase">Factor</label>
                        <select
                          id="phase"
                          name="phase"
                          value={editedQuestion.phase}
                          onChange={handleInputChange}
                          className={styles.input}
                        >
                          <option value="">Selecciona un factor</option>
                          {Object.keys(phaseIcons).map((phase) => (
                            <option key={phase} value={phase}>
                              {phaseIcons[phase].name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="modalidad">Modalidad</label>
                        <select
                          id="modalidad"
                          name="modalidad"
                          value={editedQuestion.modalidad}
                          onChange={handleInputChange}
                          className={styles.input}
                        >
                          <option value="Curso">Curso</option>
                          <option value="Taller">Taller</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {!isCreating && selectedQuestion && (
                    <div className={styles.editorFooter}>
                      <div className={styles.questionInfo}>
                        <span>ID: {selectedQuestion.id}</span>
                        <span>Creada: {new Date(selectedQuestion.createdAt).toLocaleString()}</span>
                        <span>Modalidad: {selectedQuestion.modalidad}</span>
                        <span>Actualizada: {new Date(selectedQuestion.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noQuestionSelected}>
                  <Edit size={48} className={styles.noQuestionIcon} />
                  <h2>Selecciona una pregunta para editar</h2>
                  <p>Haz clic en una de las preguntas de la lista para comenzar a editarla o crea una nueva.</p>
                  <button className={styles.createButton} onClick={handleCreateNew}>
                    <Plus size={18} />
                    <span>Crear nueva pregunta</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionsSettings

