"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./LoginPage.module.css"
import Header from "../../components/Header/Header"
import { ChevronRight } from "lucide-react"
import logoLight from "../../assets/logo.png"
import logoDark from "../../assets/logo-black.png"

const API_URL = "https://lacocina-backend-deploy.vercel.app"

const LoginPage = ({ title, onSuccess, tipo, redirectPath }) => {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || redirectPath

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validar el código con el backend
      const response = await fetch(`${API_URL}/codigos-acceso/validar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo: accessCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al validar código")
      }

      // Verificar que el tipo de código coincida con el tipo de login
      if (data.valido && data.tipo === tipo) {
        try {
          // Marcar el código como usado y ESPERAR a que termine
          const usarResponse = await fetch(`${API_URL}/codigos-acceso/usar`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codigo: accessCode }),
          })

          if (!usarResponse.ok) {
            const usarData = await usarResponse.json()
            throw new Error(usarData.mensaje || "Error al marcar código como usado")
          }

          // Crear info de acceso con timestamp de validación
          const accessInfo = {
            valid: true,
            validatedAt: new Date().toISOString(),
            code: accessCode,
          }

          // Llamar a onSuccess con la información de acceso para que App.js la procese
          onSuccess(accessInfo)

          // Navegar después de completar todo el proceso
          navigate(from, { replace: true })
        } catch (usarError) {
          setError("Error al procesar el código: " + usarError.message)
        }
      } else if (data.valido) {
        setError(
          `Este código es válido para ${data.tipo === "admin" ? "administrador" : "acceso general"}, no para ${tipo === "admin" ? "administrador" : "acceso general"}`,
        )
      } else {
        setError("Código no válido. Por favor, verifica e intenta nuevamente.")
      }
    } catch (err) {
      setError(err.message || "Ha ocurrido un error. Por favor, inténtalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header logoDark={logoDark} logoLight={logoLight} />

      <main className={styles.main}>
        {/* Left column with content */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            ¡Bienvenidos <br />
            al diamante de
            <br />
            la influencia!
          </h1>
        </div>

        {/* Right column with login form */}
        <div className={styles.rightColumn}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>{title}</h2>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="accessCode">Código de acceso*</label>
                <input
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Ingresa tu código de acceso"
                  className={styles.inputlarge}
                  required
                  aria-label="Código de acceso"
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !accessCode}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  "Verificando..."
                ) : (
                  <>
                    Ingresar <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
