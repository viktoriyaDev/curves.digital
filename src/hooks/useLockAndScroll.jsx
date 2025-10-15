import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		let locked = false;
		let isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
		let isTouching = false;
		let touchStartX = 0;
		let touchStartY = 0;
		let lastTouchX = 0;
		let velocity = 0;
		let momentumID = null;

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

		const onWheel = (e) => {
			if (isTouchDevice) return; // не мешаем мобильным
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			e.preventDefault();
			lock();
			scroller.scrollLeft += e.deltaY;
		};

		const smoothMomentum = () => {
			if (Math.abs(velocity) < 0.3) return;
			scroller.scrollLeft -= velocity;
			velocity *= 0.95;
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

			// Горизонтальный свайп → активируем скролл
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				scroller.scrollLeft -= deltaX;
				velocity = deltaX;
			}

			lastTouchX = touchX;
		};

		const onTouchEnd = () => {
			isTouching = false;
			cancelAnimationFrame(momentumID);
			momentumID = requestAnimationFrame(smoothMomentum);
			unlock();
		};

		// Добавим плавный нативный скролл
		scroller.style.scrollBehavior = "smooth";
		scroller.style.webkitOverflowScrolling = "touch";

		// Привязки событий
		if (!isTouchDevice) {
			wrapper.addEventListener("mouseenter", lock);
			wrapper.addEventListener("mouseleave", unlock);
			scroller.addEventListener("wheel", onWheel, { passive: false });
		}

		wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
		wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
		wrapper.addEventListener("touchend", onTouchEnd);

		return () => {
			wrapper.removeEventListener("mouseenter", lock);
			wrapper.removeEventListener("mouseleave", unlock);
			scroller.removeEventListener("wheel", onWheel);
			wrapper.removeEventListener("touchstart", onTouchStart);
			wrapper.removeEventListener("touchmove", onTouchMove);
			wrapper.removeEventListener("touchend", onTouchEnd);
			cancelAnimationFrame(momentumID);
			unlock();
		};
	}, [wrapperRef, scrollerRef]);
};
