import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // <-- Cambiado aquí
import "./App.css"
import Form from "./pages/Form/Form";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Users from "./pages/Users/Users";
import Stats from "./pages/Stats/Stats";
import Admin from "./adminComponents/Admin/Admin"

function App() {
    return (
      <Router> {/* Cambiado de Routes a Router */}
        <main>
          <Routes> {/* Este es el contenedor correcto para Route */}
            <Route path="/" element={<Form />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/admin" element={<Admin/>} />
            <Route path="/admin/users" element={<Users/>} />
            <Route path="/admin/stats" element={<Stats/>} />

          </Routes>
        </main>
      </Router>
      )
}

export default App