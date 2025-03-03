import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import styles from "./Users.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"
import UserModal from "./UserModal"

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    industry: "",
  })
  const [filteredUsers, setFilteredUsers] = useState([])

  // Mock data
  const users = [
    {
      id: 1,
      name: "Ana García",
      email: "ana@techsolutions.com",
      company: "Tech Solutions",
      role: "CEO",
      industry: "Tecnología",
      completionDate: "2024-03-01",
      score: 8.5,
      results: {
        "VALIDACIÓN SOCIAL": 8,
        ATRACTIVO: 9,
        RECIPROCIDAD: 7,
        AUTORIDAD: 8,
        AUTENTICIDAD: 9,
        "CONSISTENCIA Y COMPROMISO": 8,
      },
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@marketingpro.com",
      company: "Marketing Pro",
      role: "Director",
      industry: "Marketing",
      completionDate: "2024-02-28",
      score: 7.9,
      results: {
        "VALIDACIÓN SOCIAL": 7,
        ATRACTIVO: 8,
        RECIPROCIDAD: 8,
        AUTORIDAD: 7,
        AUTENTICIDAD: 8,
        "CONSISTENCIA Y COMPROMISO": 9,
      },
    },
    {
      id: 3,
      name: "Laura Martínez",
      email: "laura@freelance.com",
      company: "Freelance",
      role: "Freelancer",
      industry: "Diseño",
      completionDate: "2024-03-05",
      score: 8.2,
      results: {
        "VALIDACIÓN SOCIAL": 8,
        ATRACTIVO: 9,
        RECIPROCIDAD: 8,
        AUTORIDAD: 7,
        AUTENTICIDAD: 9,
        "CONSISTENCIA Y COMPROMISO": 8,
      },
    },
    {
      id: 4,
      name: "Miguel Rodríguez",
      email: "miguel@ventas.com",
      company: "Ventas Express",
      role: "Fundador",
      industry: "Ventas",
      completionDate: "2024-03-10",
      score: 7.5,
      results: {
        "VALIDACIÓN SOCIAL": 7,
        ATRACTIVO: 8,
        RECIPROCIDAD: 7,
        AUTORIDAD: 8,
        AUTENTICIDAD: 7,
        "CONSISTENCIA Y COMPROMISO": 8,
      },
    },
    {
      id: 5,
      name: "Sofía Ramírez",
      email: "sofia@techdev.com",
      company: "Tech Development",
      role: "CTO",
      industry: "Tecnología",
      completionDate: "2024-03-15",
      score: 8.7,
      results: {
        "VALIDACIÓN SOCIAL": 9,
        ATRACTIVO: 8,
        RECIPROCIDAD: 9,
        AUTORIDAD: 9,
        AUTENTICIDAD: 8,
        "CONSISTENCIA Y COMPROMISO": 9,
      },
    },
    {
      id: 6,
      name: "Javier Moreno",
      email: "javier@marketingdigital.com",
      company: "Marketing Digital",
      role: "Manager",
      industry: "Marketing",
      completionDate: "2024-03-12",
      score: 7.8,
      results: {
        "VALIDACIÓN SOCIAL": 8,
        ATRACTIVO: 7,
        RECIPROCIDAD: 8,
        AUTORIDAD: 7,
        AUTENTICIDAD: 8,
        "CONSISTENCIA Y COMPROMISO": 8,
      },
    },
  ]

  // Extraer roles y industrias únicos de los datos
  const roles = [...new Set(users.map((user) => user.role))]
  const industries = [...new Set(users.map((user) => user.industry))]

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...users]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.company.toLowerCase().includes(searchLower),
      )
    }

    // Aplicar filtro de rol
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role)
    }

    // Aplicar filtro de industria
    if (filters.industry) {
      result = result.filter((user) => user.industry === filters.industry)
    }

    setFilteredUsers(result)
  }, [searchTerm, filters])

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      role: "",
      industry: "",
    })
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || filters.role || filters.industry

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
              <select value={filters.role} onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}>
                <option value="">Todos los roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.industry}
                onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
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
                    <th>Rol</th>
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
                          <span className={styles.nameInitial}>{user.name.charAt(0)}</span>
                          <div>
                            <p>{user.name}</p>
                            <small>{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.company}</td>
                      <td>{user.role}</td>
                      <td>{user.industry}</td>
                      <td>{new Date(user.completionDate).toLocaleDateString()}</td>
                      <td>
                        <span className={styles.score}>{user.score.toFixed(1)}</span>
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

