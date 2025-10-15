import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		const IS_TOUCH_DEVICE = window.matchMedia("(pointer: coarse)").matches;
		let locked = false;

		// --- shared lock helpers ---
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
			if (IS_TOUCH_DEVICE) return; // skip if touch
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

		// ⚡ Fast inertia (mobile only)
		const smoothMomentum = () => {
			if (Math.abs(velocity) < 0.2) return;
			scroller.scrollLeft -= velocity;
			velocity *= 0.85; // 4× faster decay (was ~0.96)
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

			// horizontal priority only
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				const speedFactor = 17.5; // 2.5× faster scroll (was ~7)
				scroller.scrollLeft -= deltaX * speedFactor;
				velocity = deltaX * (speedFactor + 2);
			}

			lastTouchX = touchX;
		};

		const onTouchEnd = () => {
			isTouching = false;
			cancelAnimationFrame(momentumID);
			momentumID = requestAnimationFrame(smoothMomentum);
			unlock();
		};

		// --- scroll behavior settings ---
		scroller.style.scrollBehavior = "smooth";
		scroller.style.webkitOverflowScrolling = "touch";
		scroller.style.touchAction = "pan-x";
		scroller.style.willChange = "scroll-position";

		// --- listeners ---
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

		// --- cleanup ---
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
