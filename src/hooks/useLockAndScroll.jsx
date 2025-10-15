import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		let locked = false;
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
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			e.preventDefault();
			lock();
			scroller.scrollLeft += e.deltaY;
		};

		const smoothMomentum = () => {
			if (Math.abs(velocity) < 0.5) return; // остановка
			scroller.scrollLeft -= velocity;
			velocity *= 0.95; // трение
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

			// если движение в основном горизонтальное
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				scroller.scrollLeft -= deltaX;
				velocity = deltaX; // сохраняем скорость
			}

			lastTouchX = touchX;
		};

		const onTouchEnd = () => {
			isTouching = false;
			cancelAnimationFrame(momentumID);
			momentumID = requestAnimationFrame(smoothMomentum);
			unlock();
		};

		wrapper.addEventListener("mouseenter", lock);
		wrapper.addEventListener("mouseleave", unlock);
		scroller.addEventListener("wheel", onWheel, { passive: false });

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
