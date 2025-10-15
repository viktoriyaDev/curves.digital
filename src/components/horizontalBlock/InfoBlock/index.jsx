import { Button } from "../../../ui/Button";
import styles from "./index.module.css";

export const InfoBlock = () => {
	return (
		<header className={styles.infoBlock} role="banner" aria-labelledby="career-path-heading">
			<h1 id="career-path-heading" className={styles.title}>
				Tu camino paso <br /> a paso{" "}
				<span>
					hacia tu <br /> primer empleo <br /> tech
				</span>
			</h1>

			<Button aria-label="Agendar una consulta">Agenda una consulta</Button>
		</header>
	);
};
