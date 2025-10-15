import { useRef } from "react";
import { InfoBlock } from "./InfoBlock";
import ContentBlock from "./ContentBlock";
import { cards } from "../../data/content";
import lightning from "../../assets/icons/lightning.svg";
import { Button } from "../../ui/Button";
import styles from "./index.module.css";
import { useLockAndScroll } from "../../hooks/useLockAndScroll";

const HorizontalBlock = () => {
	const wrapperRef = useRef(null);
	const scrollerRef = useRef(null);

	useLockAndScroll(wrapperRef, scrollerRef);

	return (
		<section
			ref={wrapperRef}
			className={styles.wrapper}
			role="region"
			aria-labelledby="career-path-heading"
			aria-describedby="career-path-description"
		>
			<InfoBlock />

			<div ref={scrollerRef} className={styles.scrollContainer}>
				{cards.map((card) => (
					<ContentBlock
						key={card.id}
						card={card}
						icon={lightning}
					/>
				))}
			</div>

			<Button classNameButton="tabletButton" aria-label="Agendar una consulta">
				Agenda una consulta
			</Button>
		</section>
	);
};

export default HorizontalBlock;
