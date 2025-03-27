import styles from "./UsersList.module.css"

const UsersList = ({ users }) => {
  // Función para calcular el score promedio de un usuario
  const calculateUserScore = (user) => {
    const scores = [
      user.validacionSocial,
      user.atractivo,
      user.reciprocidad,
      user.autoridad,
      user.autenticidad,
      user.consistenciaCompromiso
    ].filter(score => score !== null)
    
    return scores.length > 0 
      ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
      : 'N/A'
  }

  return (
    <div className={styles.usersList}>
      <h3>Usuarios Recientes</h3>
      {users.length === 0 ? (
        <p className={styles.noUsers}>No hay usuarios para mostrar</p>
      ) : (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.userRow}>
                <td>
                  <div className={styles.userName}>
                    <span className={styles.nameInitial}>
                      {user.modalidad === 'Taller' ? 'T' : user.nombre?.charAt(0) || 'U'}
                    </span>
                    <div>
                      <p>
                        {user.modalidad === 'Taller' 
                          ? `Usuario Taller del ${new Date(user.createdAt).toLocaleDateString()}`
                          : `${user.nombre} ${user.apellido}`}
                      </p>
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
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <span className={styles.score}>
                    {calculateUserScore(user)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsersList