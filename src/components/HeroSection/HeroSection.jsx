import React from "react"
import styles from "./HeroSection.module.css"
import gif from "../../assets/diamante-animacion-dos.gif"


const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>
          El diamante
          <br />
          de la influencia
        </h1>
        <button className={styles.primaryButton}>Ir al diamante →</button>
      </div>
      <div className={styles.heroShape}>
        <img src={gif} alt="Diamante de la influencia" />
      </div>
    </section>
  )
}

export default HeroSection

