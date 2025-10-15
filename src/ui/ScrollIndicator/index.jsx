import styles from "./index.module.css";

const ScrollIndicator = ({ text, icon }) => {
	return (
		<div className={styles.scrollIndicator} role="status" aria-live="polite">
			{icon && (
				<img className={styles.icon} src={icon} alt="Decorative lightning icon" aria-hidden="true" />
			)}
			<span className={styles.text}>{text}</span>
			<span className={styles.divider} role="presentation" aria-hidden="true" />
		</div>
	);
};

export default ScrollIndicator;
