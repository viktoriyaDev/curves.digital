import styles from "./index.module.css";

export const Button = ({ children, onClick, classNameButton, type = "button", ariaLabel }) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`${styles.button} ${classNameButton ? styles[classNameButton] : ""}`}
			aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
		>
			{children}
		</button>
	);
};
