import styles from "./Form.module.css"
import { useNavigate } from "react-router-dom"
import logo from '../../assets/logo.png'


const Form = () => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate("/questionnaire")
    }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img
          src={logo}
          alt="La Cocina"
          className={styles.logo}
        />
        <div className={styles.userIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
          </svg>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            El diamante de
            <br />
            la influencia
          </h1>
          <p className={styles.subtitle}>Conocé el poder de influencia de tu marca.</p>
          <p className={styles.description}>
            Con este cuestionario de autoevaluación, vas a poder identificar las áreas de mejora para enfocar tus
            esfuerzos estratégicos en fortalecer los factores clave y, de esta manera, potenciar tu influencia en el
            comportamiento y la percepción de tus clientes.
          </p>
          <p className={styles.privacy}>
            Recordá que la información que proporciones es confidencial y solo se utilizará para fines estadísticos.
          </p>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Compañía*</label>
              <input type="text" placeholder="Nombre de la compañía" className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label>Industria/Sector*</label>
              <select className={styles.select}>
                <option>Ingrese la industria o sector</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Cargo/Posición*</label>
              <select className={styles.select}>
                <option>Ingrese su cargo/posición</option>
              </select>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Acepto recibir comunicaciones de La cocina.</span>
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>
                  Acepto la{" "}
                  <a href="#" className={styles.link}>
                    política de privacidad.
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className={styles.submitButton} onClick={handleNavigate}>
              Comenzar el cuestionario
            </button>

            <p className={styles.timeEstimate}>Sólo tomará xx minutos</p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Form

