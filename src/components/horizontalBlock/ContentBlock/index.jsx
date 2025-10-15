import styles from "./index.module.css";
import ScrollIndicator from "../../../ui/ScrollIndicator";

const ContentBlock = ({ card, className, icon }) => {
	const { title, description, image, indicator } = card;

	return (
		<article
			className={`${styles.block} ${className || ""}`}
			aria-labelledby={`block-title-${card.id}`}
			aria-describedby={`block-desc-${card.id}`}
		>
			<ScrollIndicator text={indicator} icon={icon} />

			<div className={styles.content}>
				<header className={styles.textContent}>
					{title && (
						<h2
							id={`block-title-${card.id}`}
							className={styles.title}
							dangerouslySetInnerHTML={{ __html: title }}
						/>
					)}

					{description && (
						<p
							id={`block-desc-${card.id}`}
							className={styles.description}
							dangerouslySetInnerHTML={{ __html: description }}
						/>
					)}
				</header>

				{image && (
					<figure className={styles.imageWrapper}>
						<img
							src={image}
							alt={title.replace(/<[^>]*>/g, "")}
							loading="lazy"
						/>
					</figure>
				)}
			</div>
		</article>
	);
};

export default ContentBlock;
