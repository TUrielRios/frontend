import { X, Mail, Building2, Briefcase, Calendar, Award, User, MessageSquare } from "lucide-react"
import styles from "./UserModal.module.css"
import AdminChart from "../../adminComponents/AdminChart/AdminChart"

const UserModal = ({ user, onClose }) => {
  // Preparar datos en el formato que UserChart espera
  const chartData = {
    "ATRACTIVO": user.atractivo || 0,
    "VALIDACIÓN SOCIAL": user.validacionSocial || 0,
    "RECIPROCIDAD": user.reciprocidad || 0,
    "AUTORIDAD": user.autoridad || 0,
    "AUTENTICIDAD": user.autenticidad || 0,
    "CONSISTENCIA Y COMPROMISO": user.consistenciaCompromiso || 0
  }

  // Calcular promedio general
  const validScores = Object.values(chartData).filter(score => score > 0)
  const averageScore = validScores.length > 0 
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.userProfile}>
              <div className={styles.profileHeader}>
                <span className={styles.nameInitial}>
                  {user.modalidad === 'Taller' ? 'T' : user.name?.charAt(0) || 'U'}
                </span>
                <div className={styles.profileInfo}>
                  <h2>
                    {user.modalidad === 'Taller' 
                      ? `Usuario Taller del ${new Date(user.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}`
                      : user.name}
                  </h2>
                  <span className={`${styles.role} ${user.modalidad === 'Taller' ? styles.tallerRole : styles.cursoRole}`}>
                    {user.modalidad === 'Taller' ? 'Participante Taller' : user.cargo || 'Participante Curso'}
                  </span>
                </div>
              </div>

              <div className={styles.profileDetails}>
                {user.modalidad === 'Curso' && (
                  <div className={styles.detailItem}>
                    <Mail size={18} />
                    <span>{user.email}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <Building2 size={18} />
                  <span>{user.compania}</span>
                </div>
                <div className={styles.detailItem}>
                  <Briefcase size={18} />
                  <span>{user.industriaSector}</span>
                </div>
                <div className={styles.detailItem}>
                  <User size={18} />
                  <span>{user.areaDesempeno}</span>
                </div>
                <div className={styles.detailItem}>
                  <Calendar size={18} />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.modalidad === 'Curso' && user.curso && (
                  <div className={styles.detailItem}>
                    <Award size={18} />
                    <span>{user.curso}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.factorsList}>
              <h3>Factores de Influencia</h3>
              {Object.entries(chartData).map(([factor, score]) => (
                <div key={factor} className={styles.factorItem}>
                  <div className={styles.factorInfo}>
                    <span className={styles.factorName}>{factor}</span>
                    <span className={styles.factorScore}>
                      {score > 0 ? score.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className={styles.factorBar}>
                    <div 
                      className={styles.factorProgress} 
                      style={{ 
                        width: `${(score / 10) * 100}%`,
                        opacity: score > 0 ? 1 : 0.3
                      }} 
                    />
                  </div>
                </div>
              ))}

              {averageScore && (
                <div className={styles.averageScore}>
                  <div className={styles.factorInfo}>
                    <span className={styles.factorName}>Promedio General</span>
                    <span className={styles.factorScore}>{averageScore}</span>
                  </div>
                  <div className={styles.factorBar}>
                    <div 
                      className={styles.averageProgress} 
                      style={{ width: `${(averageScore / 10) * 100}%` }} 
                    />
                  </div>
                </div>
              )}

              {/* Sección de Feedback */}
              <div className={styles.feedbackSection}>
                <h3>
                  <MessageSquare size={18} style={{ marginRight: '8px' }} />
                  Feedback del Usuario
                </h3>
                {user.mensajeFeedback ? (
                  <div className={styles.feedbackContent}>
                    <p>{user.mensajeFeedback}</p>
                  </div>
                ) : (
                  <div className={styles.noFeedback}>
                    <p>El usuario no ha dejado feedback</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Usamos UserChart aquí */}
          <div className={styles.mainContent}>
            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <h3>Análisis de Factores</h3>
                <div className={styles.chartContainer}>
                  <AdminChart 
                    data={chartData} 
                    type="radar" 
                    theme="light" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal