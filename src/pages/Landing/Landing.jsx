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
    const handleDownload = () => {
      window.open("https://www.lacocina-identidad.com/libros/libro-el-diamante-de-la-influencia/", "_blank");
  };
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
            La matriz del Diamante de la Influencia, es un modelo innovador que analiza seis factores clave que influyen en las decisiones del consumidor de una marca.

            </p>
            <p>
            Su formato de hexágono, coloca a la marca en el centro rodeada por los seis factores de Cialdini: Validación Social, Atractivo, Reciprocidad, Consistencia y Compromiso, Autenticidad, y Autoridad.
            </p>
            <p>
            El éxito del Diamante de Influencia radica en encontrar un balance entre la interacción de los factores. Cuando se logra esta sinergia, la marca no solo crece, sino que se vuelve indiscutiblemente poderosa.
            </p>
          </div>
        </div>

        <div className={styles.cta}>
          <h2>
            <span style={{fontWeight:"900"}}>La clave del Branding</span>
            <br />
            <span>más que vender, es Influir</span>
          </h2>
          <p>
            Te invitamos a conocer
            <br />
            el poder de influencia de tu marca
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.downloadButton} onClick={handleDownload}>Descargar el libro ↓</button>
            <button className={styles.actionButton} onClick={handleNavigate}>Ir a la app</button>
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

