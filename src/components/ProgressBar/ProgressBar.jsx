import styles from "./ProgressBar.module.css"

const ProgressBar = ({ current, total }) => {
  const progressPercentage = (current / total) * 100

  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progressPercentage}%` }} />
    </div>
  )
}

export default ProgressBar

