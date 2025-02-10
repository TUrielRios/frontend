import React from "react"
import styles from "./HeroSection.module.css"

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>
          El diamante
          <br />
          de la influencia
        </h1>
        <button className={styles.primaryButton}>Comenzar →</button>
      </div>
      <div className={styles.heroShape}>
        <div className={styles.radarChart}>
          <div className={styles.radarArea}></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

