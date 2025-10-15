import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		const IS_TOUCH_DEVICE = window.matchMedia("(pointer: coarse)").matches;
		let locked = false;

		const lock = () => {
			if (!locked) {
				document.body.style.overflowY = "hidden";
				document.body.style.overscrollBehaviorY = "none";
				locked = true;
			}
		};

		const unlock = () => {
			if (locked) {
				document.body.style.overflowY = "";
				document.body.style.overscrollBehaviorY = "";
				locked = false;
			}
		};

		// --- DESKTOP LOGIC (unchanged) ---
		const onWheelDesktop = (e) => {
			if (IS_TOUCH_DEVICE) return;
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
				if (!locked) lock();
				return;
			}
			if (!locked) lock();
			e.preventDefault();
			scroller.scrollLeft += e.deltaY;
		};

		// --- MOBILE LOGIC (faster scroll, inertia continues, no damping) ---
		let isTouching = false;
		let touchStartX = 0;
		let touchStartY = 0;
		let lastTouchX = 0;
		let velocity = 0;
		let momentumID = null;

		const continueMomentum = () => {
			scroller.scrollLeft -= velocity;
			requestAnimationFrame(continueMomentum);
		};

		const onTouchStart = (e) => {
			isTouching = true;
			cancelAnimationFrame(momentumID);
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			lastTouchX = touchStartX;
			velocity = 0;
			lock();
		};

		const onTouchMove = (e) => {
			if (!isTouching) return;
			const touchX = e.touches[0].clientX;
			const touchY = e.touches[0].clientY;
			const deltaX = touchX - lastTouchX;
			const deltaY = touchY - touchStartY;

			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				const speedFactor = 63 * 2; // 2× faster scroll speed
				scroller.scrollLeft -= deltaX * speedFactor;
				velocity = deltaX * speedFactor;
			}

			lastTouchX = touchX;
		};

		const onTouchEnd = () => {
			isTouching = false;
			cancelAnimationFrame(momentumID);
			momentumID = requestAnimationFrame(continueMomentum);
			unlock();
		};

		scroller.style.scrollBehavior = "smooth";
		scroller.style.webkitOverflowScrolling = "touch";
		scroller.style.touchAction = "pan-x";
		scroller.style.willChange = "scroll-position";

		if (IS_TOUCH_DEVICE) {
			wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
			wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
			wrapper.addEventListener("touchend", onTouchEnd);
		} else {
			wrapper.addEventListener("mouseenter", lock);
			wrapper.addEventListener("mouseleave", unlock);
			wrapper.addEventListener("wheel", onWheelDesktop, { passive: false });
			scroller.addEventListener("wheel", onWheelDesktop, { passive: false });
		}

		return () => {
			wrapper.removeEventListener("mouseenter", lock);
			wrapper.removeEventListener("mouseleave", unlock);
			wrapper.removeEventListener("wheel", onWheelDesktop);
			scroller.removeEventListener("wheel", onWheelDesktop);
			wrapper.removeEventListener("touchstart", onTouchStart);
			wrapper.removeEventListener("touchmove", onTouchMove);
			wrapper.removeEventListener("touchend", onTouchEnd);
			cancelAnimationFrame(momentumID);
			unlock();
		};
	}, [wrapperRef, scrollerRef]);
};
