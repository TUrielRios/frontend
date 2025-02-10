import styles from "./Landing.module.css"
import graphic from "../../assets/diamantte-azul.svg"
import { useNavigate } from "react-router-dom"
import logo from '../../assets/logo.png'
import HeroSection from "../../components/HeroSection/HeroSection"
import Footer from "../../components/Footer/Footer"

const Landing = () => {
    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate("/form")
    }
  return (
    <div className={styles.container}>

      <header className={styles.header}>
        <img
          src={logo}
          alt="La Cocina"
          className={styles.logo}
        />
        <button className={styles.menuButton}>
          <span className={styles.menuIcon}>≡</span>
        </button>
      </header>
      {/* PRIMERA SECCION*/}
      <section className={styles.hero}>
        <HeroSection />
      </section>
      {/* SEGUNDA SECCION*/}

      <main className={styles.main}>
        <p className={styles.mainDescription}>
          Un modelo innovador que explora cómo las marcas pueden influir
          <br />
          eficazmente en el comportamiento del consumidor
          <br />a través de 6 factores.
        </p>

        <div className={styles.contentGrid}>
          <img
            src={graphic}
            alt="Diagrama hexagonal"
            className={styles.hexagonImage}
          />

          <div className={styles.modelContent}>
            <h2>El modelo</h2>
            <p>
              La matriz de Influencia de la influencia, es un modelo innovador que explora cómo las marcas pueden
              influir en el comportamiento del consumidor de una forma.
            </p>
            <p>
              La fórmula de Influencia, utiliza la técnica en el contexto creado por los 6 factores, que son el
              resultado de años de investigación en Consumer Generated Content, Neurociencia y Analytics.
            </p>
            <p>
              El éxito del Diamante de la Influencia radica en encontrar un balance entre los factores, que se adapte a
              los objetivos de cada marca, su categoría y mercado, para lograr influir en el comportamiento deseado.
            </p>
          </div>
        </div>

        <div className={styles.cta}>
          <h2>
            La clave del Branding
            <br />
            más que vender, es Influir
          </h2>
          <p>
            Te invitamos a conocer
            <br />
            el poder de influencia de tu marca
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.downloadButton}>Descargar PDF ↓</button>
            <button className={styles.actionButton} onClick={handleNavigate}>Comenzar</button>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Landing

