import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		const IS_TOUCH_DEVICE = window.matchMedia("(pointer: coarse)").matches;
		let locked = false;

		// --- Shared lock helpers ---
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

		// ---------------- DESKTOP LOGIC (unchanged) ----------------
		const onWheelDesktop = (e) => {
			if (IS_TOUCH_DEVICE) return; // skip if touch device
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
				if (!locked) lock();
				return;
			}
			if (!locked) lock();
			e.preventDefault();
			scroller.scrollLeft += e.deltaY; // smooth precise scroll
		};

		// ---------------- MOBILE / TABLET LOGIC ----------------
		let isTouching = false;
		let touchStartX = 0;
		let touchStartY = 0;
		let lastTouchX = 0;
		let velocity = 0;
		let momentumID = null;

		// ⚡ Longer & faster inertia (mobile only)
		const smoothMomentum = () => {
			if (Math.abs(velocity) < 0.15) return;
			scroller.scrollLeft -= velocity;
			velocity *= 0.96; // slower decay → longer glide
			momentumID = requestAnimationFrame(smoothMomentum);
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

			// Horizontal scroll only
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				const speedFactor = 9; // fast & fluid scrolling
				scroller.scrollLeft -= deltaX * speedFactor;
				velocity = deltaX * (speedFactor + 2.5); // stronger momentum
			}

			lastTouchX = touchX;
		};

		const onTouchEnd = () => {
			isTouching = false;
			cancelAnimationFrame(momentumID);
			momentumID = requestAnimationFrame(smoothMomentum);
			unlock();
		};

		// --- Scroll performance tuning ---
		scroller.style.scrollBehavior = "smooth";
		scroller.style.webkitOverflowScrolling = "touch";
		scroller.style.touchAction = "pan-x";
		scroller.style.willChange = "scroll-position";

		// --- Event listeners ---
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

		// --- Cleanup ---
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
