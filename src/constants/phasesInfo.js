import { FaThumbsUp, FaStar } from "react-icons/fa"
import { PiSunFill } from "react-icons/pi"
import { RxUpdate } from "react-icons/rx"
import { GiConfirmed } from "react-icons/gi"
import { AiFillBank } from "react-icons/ai"
import numberBg1 from "../assets/numeros-svg/1.png"
import numberBg2 from "../assets/numeros-svg/2.png"
import numberBg3 from "../assets/numeros-svg/3.png"
import numberBg4 from "../assets/numeros-svg/4.png"
import numberBg5 from "../assets/numeros-svg/5.png"
import numberBg6 from "../assets/numeros-svg/6.png"

const phaseInfo = {
  "VALIDACIÓN SOCIAL": {
    factor: "Primer Factor",
    number: numberBg1,
    icon: FaThumbsUp,
    description:["Principio fundamental en la psicología del consumidor, basado en el deseo innato de pertenecer y ser aceptado.",
      "En branding, se activa cuando los consumidores ven que otros, especialmente aquellos que respetan o admiran, utilizan un producto o servicio. Este comportamiento genera una atracción natural hacia la marca, motivada por el deseo de ser parte de un grupo o tendencia.",
      "La validación social actua como un atajo mental: si muchas personas ya han optado por una marca, es probable que sea una opción segura y confiable.",
    ]
  },
  ATRACTIVO: {
    factor: "Segundo Factor",
    number: numberBg2,
    icon: PiSunFill,
    description:["El atractivo en el branding se refiere a la capacidad de una marca para captar y mantener la atención de su público objetivo. Más allá de la estética, abarca cómo una marca satisface las motivaciones fundamentales de su audiencia, desde necesidades funcionales hasta deseos emocionales. Es la mezcla de forma y sustancia que hace que una marca no solo sea visible, sino también memorable.", "El atractivo no es un atributo superficial; es un componente esencial que determina si los consumidores elegirán interactuar con una marca en un mercado saturado de opciones.",
    ]
  },
  RECIPROCIDAD: {
    factor: "Tercer Factor",
    number: numberBg3,
    icon: RxUpdate,
    description:["La reciprocidad es un principio psicológico que postula que las personas tienden a devolver los favores o compensar las acciones recibidas.", "En el branding, esto significa que cuando una marca ofrece valor antes de pedir algo a cambio, como contenido útil, productos gratuitos o experiencias exclusivas, los consumidores se sienten inclinados a corresponder con lealtad o compras.", "Este principio es la base de estrategias como el modelo freemium, donde las marcas primero ofrecen algo valioso sin costo, con la expectativa de que los usuarios eventualmente se conviertan en clientes de pago.",
    ]
  },
  AUTORIDAD: {
    factor: "Cuarto Factor",
    number: numberBg4,
    icon: AiFillBank,
    description:["La autoridad en el branding se refiere al nivel de confianza y respeto que una marca ha ganado en su industria o entre su audiencia. Las marcas con autoridad no solo son reconocidas, sino que también son vistas como líderes de opinión y referentes en su campo. Esta autoridad puede ser el resultado de años de experiencia, innovacion constante o la capacidad de ofrecer soluciones fiables y de alta calidad.", "Una marca con autoridad no necesita esforzarse demasiado para ser escuchada; su reputación habla por sí misma.",
    ]
  },
  AUTENTICIDAD: {
    factor: "Quinto Factor",
    number: numberBg5,
    icon: FaStar,
    description:["La autenticidad es el pegamento que une la identidad de una marca con las expectativas de los consumidores. En un mundo donde la transparencia es cada vez más valorada, las marcas auténticas en su propósito, valores y acciones ganan la confianza y admiración de su público. La autenticidad no se puede fabricar; debe ser intrínseca y evidente en cada aspecto de la marca.", "Ser auténtico significa ser coherente en lo que se dice y se hace, y ser fiel a la identidad de la marca, incluso cuando las tendencias del mercado sugieren lo contrario.",
    ]
  },
  "CONSISTENCIA Y COMPROMISO": {
    factor: "Sexto Factor",
    number: numberBg6,
    icon: GiConfirmed,
    description:["El compromiso y la consistencia son fundamentales para generar confianza en una marca. Cuando una marca se compromete con una promesa y la cumple de manera consistente a lo largo del tiempo, construye una reputación sólida y confiable.", "En un entorno donde muchas marcas fallan en cumplir lo que prometen, aquellas que lo logran se destacan y ganan la lealtad de los consumidores.", "La consistencia no sólo se refiere a mantener la calidad del producto o servicio, sino también a la coherencia en la comunicación, el diseño y la experiencia del cliente.",
    ]
  },


}
export default phaseInfo;