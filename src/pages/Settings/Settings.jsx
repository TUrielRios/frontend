import { useState, useEffect, useRef } from "react"
import { Save, Edit, X, RefreshCw, Search, FileText, Eye, EyeOff } from "lucide-react"
import styles from "./Settings.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"

const Settings = () => {
  const [texts, setTexts] = useState([])
  const [selectedText, setSelectedText] = useState(null)
  const [editedValue, setEditedValue] = useState("")
  const [displayValue, setDisplayValue] = useState("") // Valor para mostrar en el textarea
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const textareaRef = useRef(null)

  // Cargar textos desde la API
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/textos")
        if (!response.ok) {
          throw new Error("Error al cargar los textos")
        }
        const data = await response.json()
        setTexts(data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los textos: " + err.message)
        setLoading(false)
      }
    }

    fetchTexts()
  }, [])

  // Actualizar el valor de visualización cuando cambia el valor editado
  useEffect(() => {
    if (editedValue) {
      // Convertir <br/> a saltos de línea para mostrar en el textarea
      setDisplayValue(editedValue.replace(/<br\/>/g, "\n"))
    }
  }, [editedValue])

  // Seleccionar un texto para editar
  const handleSelectText = (text) => {
    setSelectedText(text)
    setEditedValue(text.value)
    // Convertir <br/> a saltos de línea para mostrar en el textarea
    setDisplayValue(text.value.replace(/<br\/>/g, "\n"))
    setError(null)
    setSuccess(null)
  }

  // Manejar cambios en el textarea
  const handleTextareaChange = (e) => {
    const newDisplayValue = e.target.value
    setDisplayValue(newDisplayValue)
    // Convertir saltos de línea a <br/> para almacenar
    setEditedValue(newDisplayValue.replace(/\n/g, "<br/>"))
  }

  // Guardar cambios en un texto
  const handleSaveText = async () => {
    if (!selectedText) return

    try {
      setSaving(true)
      setError(null)

      // Adaptado según la implementación del backend
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/textos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: selectedText.key,
          value: editedValue,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar los cambios")
      }

      const updatedText = await response.json()

      // Actualizar el estado local con el texto actualizado
      const updatedTexts = texts.map((text) => (text.id === updatedText.id ? updatedText : text))
      setTexts(updatedTexts)
      setSelectedText(updatedText)
      setSuccess("Texto actualizado correctamente")

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Error al guardar los cambios: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditedValue(selectedText.value)
    setDisplayValue(selectedText.value.replace(/<br\/>/g, "\n"))
    setError(null)
    setSuccess(null)
  }

  // Filtrar textos por término de búsqueda
  const filteredTexts = texts.filter(
    (text) =>
      text.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Formatear la clave para mostrarla más legible
  const formatKey = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Renderizar HTML desde el texto
  const renderHTML = (html) => {
    return { __html: html }
  }

  return (
    <div className={styles.settingsPage}>
      <AdminHeader username="Administrador" />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Configuración de Textos</h1>
        <p className={styles.pageDescription}>
          Edita los textos que se muestran en la aplicación. Los cambios se aplicarán inmediatamente.
        </p>

        <div className={styles.textEditorContainer}>
          <div className={styles.textsList}>
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar textos..."
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

            {loading ? (
              <div className={styles.loadingContainer}>
                <RefreshCw size={24} className={styles.loadingIcon} />
                <p>Cargando textos...</p>
              </div>
            ) : (
              <div className={styles.textsListItems}>
                {filteredTexts.length === 0 ? (
                  <p className={styles.noResults}>No se encontraron textos</p>
                ) : (
                  filteredTexts.map((text) => (
                    <div
                      key={text.id}
                      className={`${styles.textItem} ${selectedText?.id === text.id ? styles.selected : ""}`}
                      onClick={() => handleSelectText(text)}
                    >
                      <FileText size={18} className={styles.textIcon} />
                      <div className={styles.textItemContent}>
                        <h3>{formatKey(text.key)}</h3>
                        <p>{text.value.substring(0, 60).replace(/<br\/>/g, " ")}...</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className={styles.textEditor}>
            {selectedText ? (
              <>
                <div className={styles.editorHeader}>
                  <h2>{formatKey(selectedText.key)}</h2>
                  <div className={styles.editorActions}>
                    <button
                      className={styles.previewToggle}
                      onClick={() => setShowPreview(!showPreview)}
                      title={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
                    >
                      {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                      disabled={editedValue === selectedText.value}
                      title="Cancelar cambios"
                    >
                      <X size={18} />
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveText}
                      disabled={editedValue === selectedText.value || saving}
                      title="Guardar cambios"
                    >
                      {saving ? <RefreshCw size={18} className={styles.savingIcon} /> : <Save size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                <div className={styles.editorContent}>
                  <div className={styles.textareaContainer}>
                    <textarea
                      ref={textareaRef}
                      value={displayValue}
                      onChange={handleTextareaChange}
                      className={styles.textarea}
                      placeholder="Edita el texto aquí..."
                    />
                    <div className={styles.editorNote}>
                      <p>Presiona Enter para crear un salto de línea</p>
                    </div>
                  </div>

                  {showPreview && (
                    <div className={styles.previewContainer}>
                      <h3 className={styles.previewTitle}>Vista previa</h3>
                      <div className={styles.preview} dangerouslySetInnerHTML={renderHTML(editedValue)} />
                    </div>
                  )}
                </div>

                <div className={styles.editorFooter}>
                  <div className={styles.textInfo}>
                    <span>Última actualización: {new Date(selectedText.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className={styles.editorTips}>
                    <p>
                      <strong>Consejos:</strong> Los saltos de línea se insertan automáticamente al presionar Enter.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.noTextSelected}>
                <Edit size={48} className={styles.noTextIcon} />
                <h2>Selecciona un texto para editar</h2>
                <p>Haz clic en uno de los textos de la lista para comenzar a editarlo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

