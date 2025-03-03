import { Search } from "lucide-react"
import styles from "./UsersList.module.css"

const UsersList = ({ users }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Usuarios Recientes</h2>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input type="text" placeholder="Buscar usuario..." />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Empresa</th>
              <th>Industria</th>
              <th>Cargo</th>
              <th>Fecha</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.company}</td>
                <td>{user.industry}</td>
                <td>{user.position}</td>
                <td>{new Date(user.completionDate).toLocaleDateString()}</td>
                <td>
                  <span className={styles.score}>{user.score.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersList

