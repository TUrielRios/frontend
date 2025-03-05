import React, { useState } from "react";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import Header from "../../components/Header/Header";
import { ChevronDown } from "lucide-react";

const Form = () => {
    const navigate = useNavigate();
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleNavigate = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        if (termsAccepted) {
            navigate("/questionnaire");
        }
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    return (
        <div className={styles.container}>
            <Header logo={logo} />

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
                    <form className={styles.form} onSubmit={handleNavigate}>
                        <div className={styles.formGroup}>
                            <label>Nombre y apellido*</label>
                            <input type="text" placeholder="Ingrese su nombre y apellido" className={styles.inputlarge} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email*</label>
                            <input type="email" placeholder="Ingrese su email" className={styles.inputlarge} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Compañía*</label>
                            <input type="text" placeholder="Nombre de la compañía" className={styles.inputlarge} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Industria/Sector*</label>
                            <div className={styles.selectWrapper}>
                                <select className={styles.select} required>
      <option value="1">Tecnología / Software</option> 
      <option value="2">Servicios Financieros</option> 
      <option value="18">Educación / Academia</option> 
      <option value="19">Salud / Farmacia</option> 
      <option value="20">Cosmética</option> 
      <option value="21">Turismo</option> 
      <option value="22">Alimentación y Bebidas</option> 
      <option value="23">Moda / Indumentaria</option> 
      <option value="24">Energía</option> 
      <option value="25">Consultoría</option> 
      <option value="26">Gobierno / ONGs</option> 
      <option value="27">Entretenimiento / Medios</option> 
      <option value="28">Transporte / Logística</option> 
      <option value="29">Automotriz</option> 
      <option value="30">Construcción / Infraestructura</option> 
      <option value="31">Agricultura</option> 
      <option value="32">Decoración / Hogar</option> 
      <option value="33">Higiene /&nbsp;Bienestar</option> 
      <option value="34">Otro</option> 
                                </select>
                                <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Cargo/Posición*</label>
                            <div className={styles.selectWrapper}>
                                <select className={styles.select} required>
                                  <option value="1">CEO / Fundador</option> 
                                  <option value="2">Director(a) de marketing</option> 
                                  <option value="3">Director(a) de comunicación</option> 
                                  <option value="4">Gerente de producto</option> 
                                  <option value="5">Gerente de marca</option> 
                                  <option value="6">Consultor(a)</option> 
                                  <option value="7">Emprendedor(a)</option> 
                                  <option value="8">Diseñador(a)</option> 
                                  <option value="9">Community manager</option> 
                                  <option value="10">Freelancer</option> 
                                  <option value="11">Académico / Docente</option> 
                                  <option value="12">Estudiante</option> 
                                  <option value="13">Otro</option> 
                                </select>
                                <ChevronDown className={styles.selectIcon} size={20} color="#0041FF" />
                            </div>
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkbox}>
                                <input type="checkbox" />
                                <span>Acepto recibir comunicaciones de La cocina.</span>
                            </label>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    required
                                    onChange={handleTermsChange} // Actualiza el estado cuando el checkbox cambia
                                />
                                <span>
                                    Acepto la{" "}
                                    <a href="#" className={styles.link}>
                                        política de privacidad
                                    </a>.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!termsAccepted} // Deshabilitado si termsAccepted es false
                        >
                            Comenzar el cuestionario
                        </button>

                        <p className={styles.timeEstimate}>Solo tomará 20 minutos</p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Form;