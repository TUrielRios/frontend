import React from "react";
import { HelpCircle, LayoutDashboard, Users as UsersIcon, Key, Settings as SettingsIcon, BookOpen } from "lucide-react";
import styles from "./Help.module.css";
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader";

const Help = () => {
  const sections = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={24} />,
      description: "Vista general con métricas clave y resultados de talleres.",
      features: [
        "Resumen estadístico de usuarios activos y tasa de finalización",
        "Gráficos de resultados por área de desempeño",
        "Visualización del gap entre áreas",
        "Acceso rápido a talleres anteriores"
      ],
      tips: [
        "Podés hacer clic en 'Vista previa' para ver detalles ampliados de cada gráfico",
        "Descarga los gráficos como imágenes PNG para compartirlos"
      ]
    },
    {
      title: "Usuarios",
      icon: <UsersIcon size={24} />,
      description: "Gestión completa de todos los usuarios del sistema.",
      features: [
        "Listado completo de usuarios con filtros avanzados",
        "Visualización de resultados individuales",
        "Eliminación de usuarios individual o masiva",
        "Paginación para navegar entre muchos registros"
      ],
      tips: [
        "Usa los filtros por modalidad (Taller/Curso) para encontrar usuarios específicos",
        "Selecciona múltiples usuarios con los checkboxes para acciones masivas",
        "Podés hacer clic en cualquier usuario para ver su información detallada"
      ]
    },
    {
      title: "Códigos de Acceso",
      icon: <Key size={24} />,
      description: "Creación y administración de códigos para registro.",
      features: [
        "Generación de códigos aleatorios o personalizados",
        "Filtrado por tipo (General/Admin) y estado",
        "Visualización de fecha de creación y uso",
        "Eliminación de códigos no utilizados"
      ],
      tips: [
        "Genera códigos únicos para cada taller o curso",     
      ]
    },
    {
      title: "Configuración",
      icon: <SettingsIcon size={24} />,
      description: "Personalización de textos y preguntas del sistema.",
      features: [
        "Edición de todos los textos mostrados en la aplicación",
        "Vista previa en tiempo real de los cambios",
        "Gestión de preguntas y opciones de respuesta",
        "Historial de última actualización por texto"
      ],
      tips: [
        "Usa saltos de línea (Enter) para mejorar la legibilidad de textos largos",
        "Revisa siempre la vista previa antes de guardar cambios",
        "Las modificaciones aquí afectan directamente a la experiencia del usuario"
      ]
    }
  ];

  return (
    <div className={styles.helpPage}>      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <HelpCircle size={32} className={styles.helpIcon} />
            <h1>Centro de Ayuda</h1>
          </div>
          <p className={styles.subtitle}>
            Guía completa para el uso del panel de administración
          </p>
        </div>

        <div className={styles.sectionsGrid}>
          {sections.map((section, index) => (
            <div key={index} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  {section.icon}
                </div>
                <h3>{section.title}</h3>
              </div>
              
              <p className={styles.sectionDescription}>{section.description}</p>
              
              <div className={styles.featuresList}>
                <h4>Funcionalidades principales:</h4>
                <ul>
                  {section.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.tipsList}>
                <h4>Consejos útiles:</h4>
                <ul>
                  {section.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.additionalHelp}>
          <h2>¿Necesitas más ayuda?</h2>
          <p>
            Si tienen preguntas adicionales o encuentran algún problema, 
            por favor contactar al equipo de de Web Architects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;