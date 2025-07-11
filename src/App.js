"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import "./App.css"
import Form from "./pages/Form/Form"
import LoginPage from "./pages/LoginPage/LoginPage"
import Questionnaire from "./pages/Questionnaire/Questionnaire"
import Users from "./pages/Users/Users"
import Stats from "./pages/Stats/Stats"
import Admin from "./adminComponents/Admin/Admin"

// Constante para el tiempo de expiración (1 semana en milisegundos)
const ACCESS_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000 // 7 días

// Componente de contexto para manejar el acceso a nivel global
function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  // Estados de acceso
  const [appAccess, setAppAccess] = useState(false)
  const [adminAccess, setAdminAccess] = useState(false)
  const [appAccessInfo, setAppAccessInfo] = useState(null)
  const [adminAccessInfo, setAdminAccessInfo] = useState(null)
  const [accessLoaded, setAccessLoaded] = useState(false) // Nuevo estado para controlar la carga

  // Función para verificar si el acceso es válido basado en el timestamp
  const isAccessValid = (accessData) => {
    if (!accessData || !accessData.valid || !accessData.validatedAt) return false

    const validatedTime = new Date(accessData.validatedAt).getTime()
    const currentTime = new Date().getTime()

    // Verificar si el acceso ha expirado
    return currentTime - validatedTime < ACCESS_EXPIRATION_TIME
  }

  // Función para guardar el estado de acceso en localStorage
  const saveAccessToStorage = (type, accessInfo) => {
    try {
      const accessData = {
        type,
        accessInfo,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("userAccess", JSON.stringify(accessData))
      console.log(`Acceso ${type} guardado en localStorage`)
    } catch (error) {
      console.error("Error al guardar acceso en localStorage:", error)
    }
  }

  // Función para cargar el estado de acceso desde localStorage
  const loadAccessFromStorage = () => {
    try {
      const savedAccess = localStorage.getItem("userAccess")
      if (!savedAccess) {
        console.log("No hay acceso guardado en localStorage")
        return null
      }

      const accessData = JSON.parse(savedAccess)
      console.log("Acceso encontrado en localStorage:", accessData)

      // Verificar que el acceso no haya expirado
      if (!isAccessValid(accessData.accessInfo)) {
        console.log("Acceso expirado, eliminando...")
        localStorage.removeItem("userAccess")
        return null
      }

      return accessData
    } catch (error) {
      console.error("Error al cargar acceso desde localStorage:", error)
      localStorage.removeItem("userAccess")
      return null
    }
  }

  // Función para limpiar el acceso del localStorage
  const clearAccessFromStorage = () => {
    localStorage.removeItem("userAccess")
    console.log("Acceso eliminado del localStorage")
  }

  // Cargar el estado de acceso al inicializar la aplicación
  useEffect(() => {
    const savedAccess = loadAccessFromStorage()

    if (savedAccess) {
      if (savedAccess.type === "app") {
        setAppAccess(true)
        setAppAccessInfo(savedAccess.accessInfo)
        console.log("Acceso de app restaurado")
      } else if (savedAccess.type === "admin") {
        setAdminAccess(true)
        setAdminAccessInfo(savedAccess.accessInfo)
        console.log("Acceso de admin restaurado")
      }
    }

    setAccessLoaded(true)
  }, [])

  // Detector de cambio de sección (app general vs admin)
  useEffect(() => {
    // Solo ejecutar después de que se haya cargado el estado de acceso
    if (!accessLoaded) return

    const currentPath = location.pathname

    // Si estamos en una ruta de admin y venimos de una ruta normal (o viceversa)
    const isAdminRoute = currentPath.startsWith("/admin")
    const isAppRoute = !isAdminRoute && currentPath !== "/app-login" && currentPath !== "/admin-login"

    // Automáticamente invalidar el acceso opuesto al cambiar de sección
    if (isAdminRoute && !adminAccess) {
      // Si entramos a admin sin acceso admin, invalidar y redirigir
      setAppAccess(false)
      setAppAccessInfo(null)
      navigate("/admin-login", { replace: true })
    } else if (isAppRoute && !appAccess) {
      // Si entramos a app sin acceso app, invalidar y redirigir
      setAdminAccess(false)
      setAdminAccessInfo(null)
      navigate("/app-login", { replace: true })
    }
  }, [location.pathname, appAccess, adminAccess, navigate, accessLoaded])

  // Manejo de acceso exclusivo - solo uno a la vez
  const handleAppAccess = (accessInfo) => {
    // Al acceder a la app general, invalidar acceso de admin si existía
    setAdminAccess(false)
    setAdminAccessInfo(null)

    // Establecer nuevo acceso a app general
    setAppAccess(true)
    setAppAccessInfo(accessInfo)

    // Guardar en localStorage
    saveAccessToStorage("app", accessInfo)
  }

  const handleAdminAccess = (accessInfo) => {
    // Al acceder al panel de admin, invalidar acceso a app general si existía
    setAppAccess(false)
    setAppAccessInfo(null)

    // Establecer nuevo acceso a admin
    setAdminAccess(true)
    setAdminAccessInfo(accessInfo)

    // Guardar en localStorage
    saveAccessToStorage("admin", accessInfo)
  }

  // Verificador periódico para comprobar si los accesos han expirado
  useEffect(() => {
    const checkAccessValidity = () => {
      try {
        const isAppValid = isAccessValid(appAccessInfo)
        const isAdminValid = isAccessValid(adminAccessInfo)

        if (appAccess && !isAppValid) {
          console.log("Acceso de app expirado")
          setAppAccess(false)
          setAppAccessInfo(null)
          clearAccessFromStorage()
        }

        if (adminAccess && !isAdminValid) {
          console.log("Acceso de admin expirado")
          setAdminAccess(false)
          setAdminAccessInfo(null)
          clearAccessFromStorage()
        }
      } catch (e) {
        console.error("Error verificando validez de acceso:", e)
      }
    }

    // Verificar al inicio y cada 15 minutos
    checkAccessValidity()
    const intervalId = setInterval(checkAccessValidity, 15 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [appAccess, adminAccess, appAccessInfo, adminAccessInfo])

  // Función para cerrar sesión (útil para desarrollo o botón de logout)
  const handleLogout = () => {
    setAppAccess(false)
    setAdminAccess(false)
    setAppAccessInfo(null)
    setAdminAccessInfo(null)
    clearAccessFromStorage()
    navigate("/app-login", { replace: true })
  }

  // Mostrar loading mientras se carga el estado de acceso
  if (!accessLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        Cargando...
      </div>
    )
  }

  return (
    <main>
      {/* Botón de logout para desarrollo */}
      {/* {process.env.NODE_ENV === "development" && (appAccess || adminAccess) && (
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            background: "#ff4444",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )} */}

      <Routes>
        {/* Rutas de login */}
        <Route
          path="/app-login"
          element={
            appAccess ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage title="Acceso a la aplicación" onSuccess={handleAppAccess} tipo="general" redirectPath="/" />
            )
          }
        />

        <Route
          path="/admin-login"
          element={
            adminAccess ? (
              <Navigate to="/admin" replace />
            ) : (
              <LoginPage
                title="Acceso de administrador"
                onSuccess={handleAdminAccess}
                tipo="admin"
                redirectPath="/admin"
              />
            )
          }
        />

        {/* Rutas públicas (protegidas por código general) */}
        <Route
          path="/"
          element={
            <ProtectedRoute hasAccess={appAccess} loginPath="/app-login">
              <Form />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute hasAccess={appAccess} loginPath="/app-login">
              <Questionnaire />
            </ProtectedRoute>
          }
        />

        {/* Rutas de admin (requieren acceso admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute hasAccess={adminAccess} loginPath="/admin-login">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute hasAccess={adminAccess} loginPath="/admin-login">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute hasAccess={adminAccess} loginPath="/admin-login">
              <Stats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

// Componente para proteger rutas
function ProtectedRoute({ children, hasAccess, loginPath }) {
  const location = useLocation()

  if (!hasAccess) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }
  return children
}

export default App
