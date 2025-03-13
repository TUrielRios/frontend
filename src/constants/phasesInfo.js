import numberBg1 from "../assets/numeros-svg/1.png"
import numberBg2 from "../assets/numeros-svg/2.png"
import numberBg3 from "../assets/numeros-svg/3.png"
import numberBg4 from "../assets/numeros-svg/4.png"
import numberBg5 from "../assets/numeros-svg/5.png"
import numberBg6 from "../assets/numeros-svg/6.png"
import validacionSocialIcono from "../assets/iconos-animados/validacion-social-icono.gif"
import atractivoIcono from "../assets/iconos-animados/atractivo-icono.gif"
import reciprocidadIcono from "../assets/iconos-animados/reciprocidad-icono.gif"
import autoridadIcono from "../assets/iconos-animados/autoridad-icono.gif"
import autenticidadIcono from "../assets/iconos-animados/autenticidad-icono.gif"
import consistenciaIcono from "../assets/iconos-animados/compromiso-icono.gif"
import textos from "./constants"

const phaseInfo = {
  "VALIDACIÓN SOCIAL": {
    factor: "Primer Factor",
    number: numberBg1,
    icon: validacionSocialIcono,
    description: textos.validacion_social
  },
  ATRACTIVO: {
    factor: "Segundo Factor",
    number: numberBg2,
    icon: atractivoIcono,
    description: textos.atractivo
  },
  RECIPROCIDAD: {
    factor: "Tercer Factor",
    number: numberBg3,
    icon: reciprocidadIcono,
    description: textos.reciprocidad
  },
  AUTORIDAD: {
    factor: "Cuarto Factor",
    number: numberBg4,
    icon: autoridadIcono,
    description: textos.autoridad
  },
  AUTENTICIDAD: {
    factor: "Quinto Factor",
    number: numberBg5,
    icon: autenticidadIcono,
    description: textos.autenticidad
  },
  "CONSISTENCIA Y COMPROMISO": {
    factor: "Sexto Factor",
    number: numberBg6,
    icon: consistenciaIcono,
    description: textos.consistencia_y_compromiso
  },


}
export default phaseInfo;