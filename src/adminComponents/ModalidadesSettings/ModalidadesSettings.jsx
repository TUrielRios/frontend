"use client"
import { useState, useEffect } from "react"
import { RefreshCw, Settings, CheckCircle, XCircle } from "lucide-react"
import styles from "./ModalidadesSettings.module.css"

const ModalidadesSettings = () => {
  const [modalidades, setModalidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Cargar modalidades desde la API
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/modalidades")
        if (!response.ok) {
          throw new Error("Error al cargar las modalidades")
        }
        const data = await response.json()
        setModalidades(data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las modalidades: " + err.message)
        setLoading(false)
      }
    }
    fetchModalidades()
  }, [])

  // Actualizar estado de una modalidad
  const handleToggleModalidad = async (modalidadId, currentState) => {
    try {
      setSaving((prev) => ({ ...prev, [modalidadId]: true }))
      setError(null)

      const response = await fetch(`https://lacocina-backend-deploy.vercel.app/modalidades/${modalidadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          habilitado: !currentState,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la modalidad")
      }

      const updatedModalidad = await response.json()

      // Actualizar el estado local
      setModalidades((prev) =>
        prev.map((modalidad) =>
          modalidad.id === modalidadId ? { ...modalidad, habilitado: updatedModalidad.habilitado } : modalidad,
        ),
      )

      setSuccess(`Modalidad ${updatedModalidad.habilitado ? "activada" : "desactivada"} correctamente`)

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Error al actualizar la modalidad: " + err.message)
    } finally {
      setSaving((prev) => ({ ...prev, [modalidadId]: false }))
    }
  }

  return (
    <div className={styles.modalidadesContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Settings size={24} className={styles.titleIcon} />
          <div>
            <h2 className={styles.title}>Configuración de Modalidades</h2>
            <p className={styles.description}>Activa o desactiva las modalidades disponibles para los usuarios</p>
          </div>
        </div>
        {loading && <RefreshCw size={20} className={styles.loadingIcon} />}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <RefreshCw size={32} className={styles.loadingSpinner} />
          <p>Cargando modalidades...</p>
        </div>
      ) : (
        <div className={styles.modalidadesList}>
          {modalidades.map((modalidad) => (
            <div key={modalidad.id} className={styles.modalidadItem}>
              <div className={styles.modalidadInfo}>
                <div className={styles.modalidadHeader}>
                  <h3 className={styles.modalidadName}>{modalidad.nombre}</h3>
                  <div className={styles.statusBadge}>
                    {modalidad.habilitado ? (
                      <CheckCircle size={16} className={styles.activeIcon} />
                    ) : (
                      <XCircle size={16} className={styles.inactiveIcon} />
                    )}
                    <span className={modalidad.habilitado ? styles.activeText : styles.inactiveText}>
                      {modalidad.habilitado ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
                <p className={styles.modalidadDescription}>
                  {modalidad.habilitado
                    ? `Los usuarios pueden acceder al ${modalidad.nombre.toLowerCase()}`
                    : `El ${modalidad.nombre.toLowerCase()} no está disponible para los usuarios`}
                </p>
              </div>

              <div className={styles.toggleSection}>
                <span className={styles.toggleLabel}>{modalidad.habilitado ? "Activa" : "Inactiva"}</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={modalidad.habilitado}
                    onChange={() => handleToggleModalidad(modalidad.id, modalidad.habilitado)}
                    disabled={saving[modalidad.id]}
                  />
                  <span className={styles.slider}>
                    {saving[modalidad.id] && <RefreshCw size={12} className={styles.toggleLoadingIcon} />}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalidades.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <Settings size={48} className={styles.emptyIcon} />
          <h3>No hay modalidades configuradas</h3>
          <p>No se encontraron modalidades en el sistema</p>
        </div>
      )}
    </div>
  )
}

export default ModalidadesSettings
