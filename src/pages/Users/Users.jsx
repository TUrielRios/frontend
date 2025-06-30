import React, { useState, useEffect } from "react"
import { Search, Filter, X, RefreshCw, Trash2, Download } from "lucide-react"
import styles from "./Users.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"
import UserModal from "./UserModal"

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    modalidad: "",
    industry: "",
    compania: "",
    sector: "",
    areaDesempeno: ""
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [uniqueFilters, setUniqueFilters] = useState({
    industries: [],
    companies: [],
    sectors: [],
    areas: []
  })
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

 // Función para descargar feedbacks
  const downloadFeedbacks = () => {
    // Filtrar usuarios con feedback no vacío
    const usersWithFeedback = users.filter(
      user => user.mensajeFeedback && user.mensajeFeedback.trim() !== ""
    )

    if (usersWithFeedback.length === 0) {
      alert("No hay feedbacks para descargar")
      return
    }

    // Crear contenido del archivo
    let fileContent = ""
    usersWithFeedback.forEach(user => {
      fileContent += `=== Feedback ID: ${user.id} ===\n`
      fileContent += `Empresa: ${user.compania || 'N/A'}\n`
      fileContent += `Fecha: ${new Date(user.createdAt).toLocaleString()}\n`
      fileContent += `Área: ${user.areaDesempeno || 'N/A'}\n`
      fileContent += `Feedback:\n${user.mensajeFeedback}\n\n`
    })

    // Crear blob y descargar
    const blob = new Blob([fileContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `feedbacks_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Fetch users function extracted for reusability
const fetchUsers = async () => {
  try {
    setLoading(true);
    
    // Obtener usuarios de Taller y Curso en paralelo
    const [tallerResponse, cursoResponse] = await Promise.all([
      fetch("https://lacocina-backend-deploy.vercel.app/usuarios/taller"),
      fetch("https://lacocina-backend-deploy.vercel.app/usuarios/curso")
    ]);

    if (!tallerResponse.ok || !cursoResponse.ok) {
      throw new Error("Error al cargar usuarios");
    }

    const tallerUsers = await tallerResponse.json();
    const cursoUsers = await cursoResponse.json();

    // Mapear a formato común
    const formattedTallerUsers = tallerUsers.map(user => ({
      ...user,
      modalidad: 'Taller',
      name: `Usuario ${user.codigoTaller}`,
      email: '',
      role: 'Participante Taller',
      completionDate: user.createdAt
    }));

    const formattedCursoUsers = cursoUsers.map(user => ({
      ...user,
      modalidad: 'Curso',
      name: `${user.nombre} ${user.apellido}`,
      email: user.email,
      role: user.cargo || 'Participante Curso',
      completionDate: user.createdAt
    }));

    const allUsers = [...formattedTallerUsers, ...formattedCursoUsers];
    setUsers(allUsers);

    // Función para normalizar nombres de empresas
    const normalizeCompanies = (users) => {
      const companyMap = new Map();
      
      users.forEach(user => {
        if (!user.compania) return;
        
        const lowerCaseName = user.compania.toLowerCase().trim();
        if (!companyMap.has(lowerCaseName)) {
          companyMap.set(lowerCaseName, user.compania);
        }
      });
      
      return Array.from(companyMap.values()).sort((a, b) => a.localeCompare(b));
    };

    // Extraer valores únicos para los filtros
    setUniqueFilters({
      industries: [...new Set(allUsers.map(user => user.industriaSector).filter(Boolean))].sort(),
      companies: normalizeCompanies(allUsers),
      sectors: [...new Set(allUsers.map(user => user.sector).filter(Boolean))].sort(),
      areas: [...new Set(allUsers.map(user => user.areaDesempeno).filter(Boolean))].sort()
    });

    setLoading(false);
    setIsRefreshing(false);
    setSelectedUsers([]);
  } catch (err) {
    setError(err.message);
    setLoading(false);
    setIsRefreshing(false);
  }
};

  // Obtener usuarios reales del backend
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle reload button click
  const handleReload = () => {
    setIsRefreshing(true)
    fetchUsers()
  }

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    )
  }

  // Select all users on current page
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(currentUsers.map(user => user.id || user._id))
    }
  }

  // Delete selected users
  const deleteSelectedUsers = async () => {
    try {
      setLoading(true)
      
      // Determinar el endpoint correcto basado en el tipo de usuario
      const isTallerUser = users.some(user => 
        selectedUsers.includes(user.id || user._id) && user.modalidad === 'Taller'
      )
      
      const isCursoUser = users.some(user => 
        selectedUsers.includes(user.id || user._id) && user.modalidad === 'Curso'
      )

      let deletePromises = []

      if (isTallerUser) {
        deletePromises.push(
          fetch(`https://lacocina-backend-deploy.vercel.app/usuarios`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedUsers })
          })
        )
      }

      if (isCursoUser) {
        deletePromises.push(
          fetch(`https://lacocina-backend-deploy.vercel.app/usuarios`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedUsers })
          })
        )
      }

      const responses = await Promise.all(deletePromises)
      const allOk = responses.every(response => response.ok)

      if (!allOk) {
        throw new Error('Error al eliminar algunos usuarios')
      }

      await fetchUsers()
      setShowDeleteConfirmation(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Delete single user
  const deleteUser = async (userId) => {
    try {
      setLoading(true)
      
      const userToDelete = users.find(user => (user.id || user._id) === userId)
      if (!userToDelete) return

      const endpoint = userToDelete.modalidad === 'Taller' 
        ? `https://lacocina-backend-deploy.vercel.app/usuarios/${userId}`
        : `https://lacocina-backend-deploy.vercel.app/usuarios/${userId}`

      const response = await fetch(endpoint, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario')
      }

      await fetchUsers()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Calcular score promedio para cada usuario
  const usersWithScore = users.map(user => {
    const scores = [
      user.validacionSocial,
      user.atractivo,
      user.reciprocidad,
      user.autoridad,
      user.autenticidad,
      user.consistenciaCompromiso
    ].filter(score => score !== null)
    
    const average = scores.length > 0 
      ? (scores.reduce((a, b) => a + b, 0) / scores.length)
      : null

    return {
      ...user,
      score: average || 0
    }
  })

  // Aplicar filtros y búsqueda
  const filteredUsers = usersWithScore.filter(user => {
    // Filtro de búsqueda
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.compania?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtros adicionales
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true
      return user[key] === value
    })

    return matchesSearch && matchesFilters
  })

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      modalidad: "",
      industry: "",
      compania: "",
      sector: "",
      areaDesempeno: ""
    })
    setCurrentPage(1)
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || Object.values(filters).some(Boolean)

  if (loading && !isRefreshing) return <div className={styles.loading}>Cargando usuarios...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  return (
    <div className={styles.usersPage}>
      <AdminHeader username="Administrador" />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Usuarios</h1>
            {hasActiveFilters && (
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                <X size={16} /> Limpiar filtros
              </button>
            )}
          </div>
          {/* Contenedor principal de filtros */}
          <div className={styles.filtersContainer}>
            {/* Primera fila de filtros */}
            <div className={styles.filtersRow}>
              <div className={styles.searchBar}>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar usuario, empresa..."
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
                  value={filters.modalidad}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, modalidad: e.target.value }))
                    setCurrentPage(1)
                  }}
                >
                  <option value="">Todas las modalidades</option>
                  <option value="Taller">Taller</option>
                  <option value="Curso">Curso</option>
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <select
                  value={filters.industry}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, industry: e.target.value }))
                    setCurrentPage(1)
                  }}
                >
                  <option value="">Todas las industrias</option>
                  {uniqueFilters.industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Segunda fila de filtros */}
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <select
                  value={filters.compania}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, compania: e.target.value }))
                    setCurrentPage(1)
                  }}
                >
                  <option value="">Todas las empresas</option>
                  {uniqueFilters.companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <select
                  value={filters.sector}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, sector: e.target.value }))
                    setCurrentPage(1)
                  }}
                >
                  <option value="">Todos los sectores</option>
                  {uniqueFilters.sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <select
                  value={filters.areaDesempeno}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, areaDesempeno: e.target.value }))
                    setCurrentPage(1)
                  }}
                >
                  <option value="">Todas las áreas</option>
                  {uniqueFilters.areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Tercera fila con botones */}
            <div className={styles.actionsRow}>
              <button 
                className={styles.downloadBtn}
                onClick={downloadFeedbacks}
                title="Descargar todos los feedbacks"
              >
                <Download size={20} />
                <span>Descargar Feedbacks</span>
              </button>
              
              <button 
                className={`${styles.reloadBtn} ${isRefreshing ? styles.spinning : ''}`}
                onClick={handleReload}
                disabled={isRefreshing}
              >
                <RefreshCw size={20} />
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        
        </div>

        <div className={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noResults}>
              <p>No se encontraron usuarios con los filtros aplicados</p>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className={styles.actionsBar}>
                {selectedUsers.length > 0 && (
                  <>
                    <span>{selectedUsers.length} usuario(s) seleccionado(s)</span>
                    <button 
                      className={styles.deleteSelectedBtn}
                      onClick={() => setShowDeleteConfirmation(true)}
                    >
                      <Trash2 size={16} /> Eliminar seleccionados
                    </button>
                  </>
                )}
              </div>
              
              <div className={styles.resultsCount}>
                Mostrando {Math.min(indexOfFirstUser + 1, filteredUsers.length)}-{Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
              </div>
              
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length > 0 && selectedUsers.length === currentUsers.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Usuario</th>
                    <th>Empresa</th>
                    <th>Tipo</th>
                    <th>Industria</th>
                    <th>Sector</th>
                    <th>Área</th>
                    <th>Fecha</th>
                    <th>Resultado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id || user._id} className={styles.userRow}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id || user._id)}
                          onChange={() => toggleUserSelection(user.id || user._id)}
                        />
                      </td>
                      <td onClick={() => setSelectedUser(user)}>
                        <div className={styles.userName}>
                          <span className={styles.nameInitial}>
                            {user.modalidad === 'Taller' ? 'T' : user.name.charAt(0)}
                          </span>
                          <div>
                            <p>
                              {user.modalidad === 'Taller' 
                                ? `Usuario Taller del ${new Date(user.createdAt).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}`
                                : user.name}
                            </p>
                            {user.email && <small>{user.email}</small>}
                          </div>
                        </div>
                      </td>
                      <td onClick={() => setSelectedUser(user)}>{user.compania}</td>
                      <td onClick={() => setSelectedUser(user)}>
                        <span className={`${styles.userType} ${user.modalidad === 'Taller' ? styles.taller : styles.curso}`}>
                          {user.modalidad}
                        </span>
                      </td>
                      <td onClick={() => setSelectedUser(user)}>{user.industriaSector}</td>
                      <td onClick={() => setSelectedUser(user)}>{user.sector}</td>
                      <td onClick={() => setSelectedUser(user)}>{user.areaDesempeno}</td>
                      <td onClick={() => setSelectedUser(user)}>
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td onClick={() => setSelectedUser(user)}>
                        <span className={styles.score}>
                          {user.score ? user.score.toFixed(1) : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm(`¿Estás seguro de que deseas eliminar a ${user.name}?`)) {
                              deleteUser(user.id || user._id)
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className={styles.paginationBtn}
                  >
                    Anterior
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(number => 
                        number === 1 || 
                        number === totalPages || 
                        Math.abs(number - currentPage) <= 1
                      )
                      .map((number, index, array) => {
                        if (index > 0 && array[index - 1] !== number - 1) {
                          return (
                            <React.Fragment key={`ellipsis-${number}`}>
                              <span className={styles.ellipsis}>...</span>
                              <button
                                onClick={() => paginate(number)}
                                className={`${styles.pageNumber} ${currentPage === number ? styles.activePage : ''}`}
                              >
                                {number}
                              </button>
                            </React.Fragment>
                          )
                        }
                        return (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`${styles.pageNumber} ${currentPage === number ? styles.activePage : ''}`}
                          >
                            {number}
                          </button>
                        )
                      })}
                  </div>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className={styles.paginationBtn}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar {selectedUsers.length} usuario(s) seleccionado(s)? Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmDeleteBtn}
                onClick={deleteSelectedUsers}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users  