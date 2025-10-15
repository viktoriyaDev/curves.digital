import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

		let locked = false;
		let touchStartX = 0;
		let touchStartY = 0;
		let isTouching = false;

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

		// Desktop mouse + wheel
		const onWheel = (e) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal
			e.preventDefault();
			lock();
			scroller.scrollLeft += e.deltaY;
		};

		// Touch gestures (mobile)
		const onTouchStart = (e) => {
			isTouching = true;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			lock();
		};

		const onTouchMove = (e) => {
			if (!isTouching) return;
			const deltaX = e.touches[0].clientX - touchStartX;
			const deltaY = e.touches[0].clientY - touchStartY;

			// Если движение по горизонтали больше — включаем горизонтальный скролл
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				scroller.scrollLeft -= deltaX;
				touchStartX = e.touches[0].clientX;
			}
		};

		const onTouchEnd = () => {
			isTouching = false;
			unlock();
		};

		// Mouse hover logic
		wrapper.addEventListener("mouseenter", lock);
		wrapper.addEventListener("mouseleave", unlock);
		scroller.addEventListener("wheel", onWheel, { passive: false });

		// Touch logic
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
			unlock();
		};
	}, [wrapperRef, scrollerRef]);
};
