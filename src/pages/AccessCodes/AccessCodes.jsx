import { useState, useEffect } from "react"
import { Search, Filter, X, Plus, Trash2, Check, XCircle } from "lucide-react"
import styles from "./AccessCodes.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"

const AccessCodes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    tipo: "",
    estado: ""
  })
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewCodeForm, setShowNewCodeForm] = useState(false)
  const [newCode, setNewCode] = useState({
    codigo: "",
    tipo: "general",
    descripcion: ""
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  // Función para generar un código aleatorio
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Obtener códigos de acceso del backend
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true)
        
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/codigos-acceso")
        
        if (!response.ok) {
          throw new Error("Error al cargar códigos de acceso")
        }

        const data = await response.json()
        setCodes(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCodes()
  }, [])

  // Crear nuevo código de acceso
  const handleCreateCode = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitLoading(true)
      setSubmitMessage(null)
      
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/codigos-acceso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCode)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.mensaje || "Error al crear código de acceso")
      }

      const data = await response.json()
      
      // Añadir nuevo código a la lista
      setCodes(prevCodes => [...prevCodes, data])
      
      // Resetear formulario
      setNewCode({
        codigo: "",
        tipo: "general",
        descripcion: ""
      })
      
      setSubmitMessage({
        type: "success",
        text: "Código creado exitosamente"
      })
      
      // Ocultar formulario después de 2 segundos
      setTimeout(() => {
        setShowNewCodeForm(false)
        setSubmitMessage(null)
      }, 2000)
      
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: err.message
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  // Eliminar código de acceso
  const handleDeleteCode = async (codeId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este código de acceso?")) {
      return
    }
    
    try {
      const response = await fetch(`https://lacocina-backend-deploy.vercel.app/codigos-acceso/${codeId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error("Error al eliminar código de acceso")
      }
      
      // Eliminar código de la lista
      setCodes(prevCodes => prevCodes.filter(code => code._id !== codeId))
      
    } catch (err) {
      alert("Error al eliminar código: " + err.message)
    }
  }

  // Aplicar filtros y búsqueda
  const filteredCodes = codes.filter(code => {
    // Filtro de búsqueda
    const matchesSearch = !searchTerm || 
      code.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.descripcion && code.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro de tipo
    const matchesTipo = !filters.tipo || code.tipo === filters.tipo

    // Filtro de estado
    const matchesEstado = !filters.estado || 
      (filters.estado === "usado" && code.usado) ||
      (filters.estado === "disponible" && !code.usado)

    return matchesSearch && matchesTipo && matchesEstado
  })

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      tipo: "",
      estado: ""
    })
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || filters.tipo || filters.estado

  if (loading) return <div className={styles.loading}>Cargando códigos de acceso...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  return (
    <div className={styles.codesPage}>
      <AdminHeader username="Administrador" />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Códigos de Acceso</h1>
            {hasActiveFilters && (
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                <X size={16} /> Limpiar filtros
              </button>
            )}
          </div>
          
          <button 
            className={styles.createButton}
            onClick={() => setShowNewCodeForm(prev => !prev)}
          >
            <Plus size={18} /> {showNewCodeForm ? 'Cancelar' : 'Crear Código'}
          </button>
          
          {showNewCodeForm && (
            <div className={styles.newCodeFormContainer}>
              <form className={styles.newCodeForm} onSubmit={handleCreateCode}>
                <div className={styles.formGroup}>
                  <label>Código</label>
                  <div className={styles.codeInputGroup}>
                    <input
                      type="text"
                      placeholder="Código de acceso"
                      value={newCode.codigo}
                      onChange={(e) => setNewCode(prev => ({ ...prev, codigo: e.target.value }))}
                      required
                    />
                    <button 
                      type="button" 
                      className={styles.generateBtn}
                      onClick={() => setNewCode(prev => ({ ...prev, codigo: generateRandomCode() }))}
                    >
                      Generar
                    </button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Tipo</label>
                  <select 
                    value={newCode.tipo}
                    onChange={(e) => setNewCode(prev => ({ ...prev, tipo: e.target.value }))}
                    required
                  >
                    <option value="general">General</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Descripción</label>
                  <input
                    type="text"
                    placeholder="Descripción o propósito del código"
                    value={newCode.descripcion}
                    onChange={(e) => setNewCode(prev => ({ ...prev, descripcion: e.target.value }))}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Creando...' : 'Crear Código'}
                  </button>
                </div>
                
                {submitMessage && (
                  <div className={`${styles.message} ${styles[submitMessage.type]}`}>
                    {submitMessage.type === 'success' ? <Check size={16} /> : <XCircle size={16} />}
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </div>
          )}
          
          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar códigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className={styles.clearSearchBtn} onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className={styles.filterGroup}>
              <Filter size={20} />
              <select 
                value={filters.tipo}
                onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
              >
                <option value="">Todos los tipos</option>
                <option value="general">General</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.estado}
                onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
              >
                <option value="">Todos los estados</option>
                <option value="disponible">Disponibles</option>
                <option value="usado">Usados</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.codesList}>
          {filteredCodes.length === 0 ? (
            <div className={styles.noResults}>
              <p>No se encontraron códigos con los filtros aplicados</p>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsCount}>
                Mostrando {filteredCodes.length} de {codes.length} códigos
              </div>
              <table className={styles.codesTable}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Fecha Uso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCodes.map((code) => (
                    <tr key={code._id} className={styles.codeRow}>
                      <td>
                        <div className={styles.codeCell}>
                          <span className={styles.codeText}>{code.codigo}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.codeType} ${code.tipo === 'admin' ? styles.admin : styles.general}`}>
                          {code.tipo === 'admin' ? 'Admin' : 'General'}
                        </span>
                      </td>
                      <td>{code.descripcion || '-'}</td>
                      <td>
                        <span className={`${styles.codeStatus} ${code.usado ? styles.used : styles.available}`}>
                          {code.usado ? 'Usado' : 'Disponible'}
                        </span>
                      </td>
                      <td>
                        {new Date(code.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        {code.fechaUso ? new Date(code.fechaUso).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteCode(code._id)}
                          title="Eliminar código"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccessCodes