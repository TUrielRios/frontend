import styles from "./ProgressBar.module.css"

const ProgressBar = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;
  const formattedPercentage = Math.round(progressPercentage);
  
  return (
    <div className={styles.progressBar}>
      <div 
        className={styles.progress} 
        style={{ width: `${progressPercentage}%` }}
      >
        <span className={styles.percentageText}>{formattedPercentage}%</span>
      </div>
      {/* Texto alternativo que se muestra cuando la barra es muy pequeña */}
      {progressPercentage < 15 && (
        <span className={styles.percentageTextOutside}>{formattedPercentage}%</span>
      )}
    </div>
  )
}

export default ProgressBar