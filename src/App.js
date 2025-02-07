import React from "react"
import MarketingQuiz from "./components/MarketingQuiz/MarketingQuiz"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // <-- Cambiado aquí

import "./App.css"
import Landing from "./pages/Landing/Landing"
import Form from "./pages/Form/Form";
import Questionnaire from "./pages/Questionnaire/Questionnaire";

function App() {
    return (
      <Router> {/* Cambiado de Routes a Router */}
        <main>
          <Routes> {/* Este es el contenedor correcto para Route */}
            <Route path="/" element={<Landing />} />
            <Route path="/form" element={<Form />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        </main>
      </Router>
      )
}

export default App