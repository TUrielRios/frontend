import styles from "./PrivacyPolicyModal.module.css"

const PrivacyPolicyModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Política de Privacidad</h2>
        <div className={styles.modalText}>
          <p>En La Cocina Identidad de Marcas, valoramos y respetamos tu privacidad. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas a través de nuestro sitio web https://www.lacocina-identidad.com/. Al utilizar nuestro sitio, aceptas los términos de esta política.</p>
          
          <h3>1. Información que recopilamos:</h3>
          <p>No recopilaremos ninguna información personal (como tu nombre, dirección, número de teléfono, número de identificación o dirección de correo electrónico) a menos que la proporciones voluntariamente.</p>
          <p>Cuando interactúas con nuestro sitio web, procesamos diferentes tipos de datos incluyendo:</p>
          <p><strong>Información de navegación:</strong> podemos recopilar información sobre la visita a nuestro sitio web, como la dirección IP, el tipo de navegador y el tipo de dispositivo, páginas visitadas, la fecha y hora de acceso y el sitio web desde el que llegaste. Esto se realiza a través de herramientas como Google Tag Manager.</p>
          <p><strong>Información de contacto:</strong> al proporcionarnos voluntariamente tus datos personales a través de nuestros formularios de contacto, recopilamos tu nombre, dirección de correo electrónico y número de teléfono para poder comunicarnos y responder las consultas.</p>
          <p><strong>Información de empresa:</strong> al completar formulario para la descarga del libro o interactuar con la app del Diamante de la Influencia, procesamos datos de tu empresa (nombre y la industria a la que pertenece) y/o datos personales y de contacto (nombre, apellido, cargo/profesión, dirección de correo electrónico).</p>

          <h3>2. Uso de la información recopilada:</h3>
          <p>Utilizamos la información personal que recopilamos para los siguientes propósitos:</p>
          <p><strong>Comunicación:</strong> Al completar el formulario de contacto o de descarga del libro, los datos que nos facilitás se utilizarán para procesar tu solicitud, responder tus consultas, o proporcionarte información sobre nuestros servicios.</p>
          <p><strong>Mejora de servicios:</strong> para comprender mejor las necesidades de nuestros usuarios y mejorar nuestros servicios y sitio web.</p>
          <p><strong>Marketing:</strong> con tu consentimiento previo, podemos utilizar tu información de contacto para enviarte comunicaciones sobre nuestros servicios, novedades y eventos que puedan ser de tu interés. Siempre te ofreceremos la opción de darte de baja de estas comunicaciones.</p>
          <p><strong>Análisis y seguimiento:</strong> utilizamos Google Tag Manager para analizar el tráfico del sitio web, comprender el comportamiento de los usuarios y optimizar la experiencia del sitio.</p>
          <p><strong>Publicidad (a través de Meta Pixel):</strong> podemos utilizar Meta Pixel para rastrear las conversiones de anuncios de Meta (Facebook e Instagram), optimizar campañas publicitarias, crear audiencias personalizadas y remarketing. La información recopilada a través de Meta Pixel está sujeta a la política de privacidad de Meta.</p>

          <h3>3. Compartir tu Información:</h3>
          <p>No compartimos tu información personal con terceros, excepto en las siguientes circunstancias limitadas:</p>
          <p><strong>Proveedores de Servicios:</strong> Podemos compartir información con proveedores de servicios que nos asisten en la operación de nuestro sitio web, el envío de correos electrónicos o el análisis de datos. Estos proveedores están obligados contractualmente a proteger tu información y no utilizarla para otros fines.</p>
          <p><strong>Cumplimiento Legal:</strong> Podemos divulgar tu información personal si así lo exige la ley o en respuesta a una orden judicial o solicitud gubernamental válida.</p>
          <p><strong>Consentimiento:</strong> Compartiremos tu información con terceros únicamente con tu consentimiento explícito.</p>

          <h3>4. Seguridad de tu Información:</h3>
          <p>Implementamos medidas de seguridad para proteger tu información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Estas medidas incluyen protocolos de seguridad técnicos y organizativos. Sin embargo, debes tener en cuenta que ninguna transmisión de datos a través de Internet o sistema de almacenamiento electrónico es completamente segura.</p>

          <h3>5. Tus Derechos:</h3>
          <p>De acuerdo con la Ley de Protección de Datos Personales N° 25.326 en Argentina, tienes los siguientes derechos con respecto a tu información personal:</p>
          <p><strong>Derecho de acceso:</strong> podés solicitar información sobre los datos personales que tenemos sobre ti.</p>
          <p><strong>Derecho de rectificación:</strong> podés solicitar la corrección de cualquier dato personal que sea inexacto o incompleto.</p>
          <p><strong>Derecho de supresión (o "derecho al olvido"):</strong> podés solicitar la eliminación de tus datos personales de nuestros registros, siempre que no exista una obligación legal que nos impida hacerlo.</p>
          <p><strong>Derecho de oposición:</strong> podés oponerte al tratamiento de tus datos personales para fines de marketing directo o cuando existan motivos legítimos y fundados relacionados con tu situación particular.</p>
          <p>Para ejercer estos derechos, por favor, contáctanos a través de los datos de contacto proporcionados al final de esta política.</p>

          <h3>6. Cookies de terceros:</h3>
          <p>Nuestro sitio web utiliza cookies de terceros con el objetivo de mejorar la experiencia de navegación y analizar el tráfico del sitio. Estas cookies son gestionadas por proveedores externos.</p>
          <p>Al utilizar nuestro sitio web, consientes el uso de estas cookies de terceros para los fines descritos. Puedes gestionar las preferencias de cookies a través de la configuración de tu navegador. La mayoría de los navegadores permiten ver, gestionar, eliminar y bloquear las cookies de los sitios web.</p>

          <h3>7. Google Tag Manager y Meta Pixel:</h3>
          <p><strong>Google Tag Manager:</strong> utilizamos Google Tag Manager, un servicio de gestión de etiquetas proporcionado por Google LLC. Google Tag Manager en sí mismo no recopila datos personales, pero facilita la implementación y gestión de otras etiquetas y códigos de seguimiento en nuestro sitio web, incluyendo Google Analytics y otras herramientas de terceros. Para obtener más información sobre las prácticas de privacidad de Google, consulta su política de privacidad: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>.</p>
          <p><strong>Meta Pixel:</strong> Utilizamos Meta Pixel, un servicio de análisis y publicidad proporcionado por Meta Platforms, Inc. (anteriormente Facebook, Inc.). Meta Pixel utiliza cookies y otras tecnologías de seguimiento para recopilar información sobre las acciones de los usuarios en nuestro sitio web, lo que nos permite medir la efectividad de nuestros anuncios en Meta, crear audiencias personalizadas para publicidad y realizar remarketing. La información recopilada a través de Meta Pixel se transmite a Meta y está sujeta a su política de privacidad: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">https://www.facebook.com/privacy/policy/</a>. Puedes gestionar tus preferencias de publicidad en Meta a través de la configuración de tu cuenta de Facebook e Instagram.</p>

          <h3>8. Enlaces a nuestras redes sociales:</h3>
          <p>Nuestro sitio web contiene enlaces a nuestras páginas en diversas plataformas de redes sociales, incluyendo YouTube, Spotify, Instagram y LinkedIn. Te informamos que estas plataformas son responsables de sus propios sitios web y del procesamiento de los datos personales que realices en ellas, de acuerdo con sus respectivas condiciones de uso y políticas de privacidad.</p>
          <p>Al hacer clic en estos enlaces y acceder a nuestras páginas de redes sociales, tu interacción estará regida por las políticas de privacidad de cada plataforma. Te recomendamos revisar detenidamente las disposiciones de protección de datos de la plataforma correspondiente para comprender cómo se recopilan, utilizan y protegen tus datos personales en esos entornos:</p>
          <ul>
            <li>YouTube: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
            <li>Spotify: <a href="https://www.spotify.com/ar/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">https://www.spotify.com/ar/legal/privacy-policy/</a></li>
            <li>Instagram: <a href="https://help.instagram.com/155833707900388" target="_blank" rel="noopener noreferrer">https://help.instagram.com/155833707900388</a></li>
            <li>LinkedIn: <a href="https://es.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://es.linkedin.com/legal/privacy-policy</a></li>
          </ul>
          <p>La Cocina Identidad de Marcas no se hace responsable de las prácticas de privacidad ni del contenido de estos sitios web de terceros.</p>

          <h3>9. Cambios en esta política de privacidad:</h3>
          <p>Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas de información. Publicaremos cualquier cambio en esta página y notificaremos sobre cualquier modificación significativa. Te recomendamos revisar esta política de privacidad de forma regular.</p>

          <h3>10. Contacto:</h3>
          <p>Si tienes alguna pregunta sobre esta política de privacidad o sobre la protección de datos, por favor contáctanos a través de:</p>
          <ul>
            <li>Correo electrónico: <a href="mailto:contacto@lacocina-identidad.com">contacto@lacocina-identidad.com</a></li>
            <li>Formulario de contacto: <a href="https://www.lacocina-identidad.com/contacto/" target="_blank" rel="noopener noreferrer">https://www.lacocina-identidad.com/contacto/</a></li>
            <li>Dirección postal: Av. del Mirador 530, Dpto. 419 Lofts de la Bahía. Nordelta. C.P. 1670. Tigre, Buenos Aires. Argentina</li>
          </ul>
          <p>Última actualización: abril de 2025</p>
        </div>
        <button onClick={onClose} className={styles.modalCloseButton}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default PrivacyPolicyModal