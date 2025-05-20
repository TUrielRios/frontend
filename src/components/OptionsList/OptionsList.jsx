import styles from "./OptionsList.module.css"

//const OPTIONS = ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"]
//Orden de opciones invertido
const OPTIONS = ["Siempre", "La mayoría de las veces", "A veces", "Casi nunca", "Nunca"]

const OptionsList = ({ selectedOption, onSelect }) => {
  return (
    <div className={styles.options}>
      {OPTIONS.map((option) => (
        <label 
          key={option} 
          className={`${styles.optionLabel} ${selectedOption === option ? styles.selected : ''}`}
        >
          <input
            type="radio"
            name="question"
            value={option}
            checked={selectedOption === option}
            onChange={(e) => onSelect(e.target.value)}
            className={styles.optionInput}
          />
          <span className={styles.customRadio}></span>
          <span className={styles.optionText}>{option}</span>
        </label>
      ))}
    </div>
  )
  
}

export default OptionsList