import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import styles from "./Users.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"
import UserModal from "./UserModal"

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    modalidad: "",
    industry: "",
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener usuarios reales del backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        
        // Obtener usuarios de Taller y Curso en paralelo
        const [tallerResponse, cursoResponse] = await Promise.all([
          fetch("https://lacocina-backend-deploy.vercel.app/usuarios/taller"),
          fetch("https://lacocina-backend-deploy.vercel.app/usuarios/curso")
        ])

        if (!tallerResponse.ok || !cursoResponse.ok) {
          throw new Error("Error al cargar usuarios")
        }

        const tallerUsers = await tallerResponse.json()
        const cursoUsers = await cursoResponse.json()

        // Mapear a formato común
        const formattedTallerUsers = tallerUsers.map(user => ({
          ...user,
          modalidad: 'Taller',
          name: `Usuario ${user.codigoTaller}`,
          email: '',
          role: 'Participante Taller',
          completionDate: user.createdAt
        }))

        const formattedCursoUsers = cursoUsers.map(user => ({
          ...user,
          modalidad: 'Curso',
          name: `${user.nombre} ${user.apellido}`,
          email: user.email,
          role: user.cargo || 'Participante Curso',
          completionDate: user.createdAt
        }))

        setUsers([...formattedTallerUsers, ...formattedCursoUsers])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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

  // Extraer industrias únicas
  const industries = [...new Set(users.map((user) => user.industriaSector))]

  // Aplicar filtros y búsqueda
  const filteredUsers = usersWithScore.filter(user => {
    // Filtro de búsqueda
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.compania.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de modalidad
    const matchesModalidad = !filters.modalidad || user.modalidad === filters.modalidad

    // Filtro de industria
    const matchesIndustry = !filters.industry || user.industriaSector === filters.industry

    return matchesSearch && matchesModalidad && matchesIndustry
  })

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      modalidad: "",
      industry: "",
    })
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || filters.modalidad || filters.industry

  if (loading) return <div className={styles.loading}>Cargando usuarios...</div>
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
          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar usuario..."
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
                onChange={(e) => setFilters(prev => ({ ...prev, modalidad: e.target.value }))}
              >
                <option value="">Todas las modalidades</option>
                <option value="Taller">Taller</option>
                <option value="Curso">Curso</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              >
                <option value="">Todas las industrias</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
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
              <div className={styles.resultsCount}>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </div>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Empresa</th>
                    <th>Tipo</th>
                    <th>Industria</th>
                    <th>Fecha</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
  <tr key={user.id} onClick={() => setSelectedUser(user)} className={styles.userRow}>
    <td>
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
          {user.modalidad === 'Taller' && (
            <small className={styles.tallerCode}>{user.codigoTaller}</small>
          )}
        </div>
      </div>
    </td>
    <td>{user.compania}</td>
    <td>
      <span className={`${styles.userType} ${user.modalidad === 'Taller' ? styles.taller : styles.curso}`}>
        {user.modalidad}
      </span>
    </td>
    <td>{user.industriaSector}</td>
    <td>
      {new Date(user.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}
    </td>
    <td>
      <span className={styles.score}>
        {user.score ? user.score.toFixed(1) : 'N/A'}
      </span>
    </td>
  </tr>
))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}

export default Users