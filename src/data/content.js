import consultation from "../assets/images/consultation.png";
import bootcampDesktop from "../assets/images/bootcamp.png";
import videoChat from "../assets/images/video-chat.png";
import linkedin from "../assets/images/linkedin.png";
import community from "../assets/images/community.png";
import bootcampTablet from "../assets/images/bootcamp-tablet.png";
import { getResponsiveImage } from "../utils/responsive";



export const cards = [
	{
		id: 1,
		indicator: "Plan de carrera seguro",
		title: "Consulta de carrera <br/> gratuita",
		description: "Obtendrás un plan personalizado basado en tus fortalezas, objetivos y experiencia",
		image: consultation,
	},
	{
		id: 2,
		indicator: "Habilidades tech en demanda",
		title: "Bootcamp en línea",
		description: "Aprende de forma práctica todo lo necesario para convertirte en Analista de Datos",
		image: getResponsiveImage(bootcampDesktop, bootcampTablet),
	},
	{
		id: 3,
		indicator: "¿Estás listo para ser contratado?",
		title: "Acelerador de carrera",
		description:
			"Trabajarás 1 a 1 con un coach personal para elaborar un CV llamativo, armar un portafolio de proyectos reales y llegar a tus entrevistas preparado",
		image: videoChat,
	},
	{
		id: 4,
		indicator: "Ingresos remotos + equilibrio trabajo-vida",
		title: "Tu primer empleo tech",
		description:
			"Podrás ganar desde $30,000 MXN al mes, <br/> con la oportunidad de trabajar a nivel global",
		image: linkedin,
	},
	{
		id: 5,
		indicator: "Una red que te respalda",
		title: "Apoyo de la comunidad TripleTen",
		description:
			"Conectarás con personas afines, para <br/> compartir logros y seguir creciendo juntos",
		image: community,
	},
];
