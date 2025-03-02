import styles from "./OptionsList.module.css"

const OPTIONS = ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"]

const OptionsList = ({ selectedOption, onSelect }) => {
  return (
    <div className={styles.options}>
      {OPTIONS.map((option) => (
        <label key={option} className={styles.optionLabel}>
          <input
            type="radio"
            name="question"
            value={option}
            checked={selectedOption === option}
            onChange={(e) => onSelect(e.target.value)}
            className={styles.optionInput}
          />
          <span className={styles.optionText}>{option}</span>
        </label>
      ))}
    </div>
  )
}

export default OptionsList

