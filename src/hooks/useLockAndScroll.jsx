import { useEffect } from "react";

export const useLockAndScroll = (wrapperRef, scrollerRef) => {
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const scroller = scrollerRef.current;
		if (!wrapper || !scroller) return;

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

		const onWrapperEnter = () => lock();
		const onWrapperLeave = () => unlock();

		const onWheel = (e) => {
			// allow native horizontal if trackpad
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
				if (!locked) lock();
				return;
			}
			if (!locked) lock();
			e.preventDefault();
			scroller.scrollLeft += e.deltaY;
		};

		wrapper.addEventListener("mouseenter", onWrapperEnter);
		wrapper.addEventListener("mouseleave", onWrapperLeave);
		wrapper.addEventListener("wheel", onWheel, { passive: false });
		scroller.addEventListener("wheel", onWheel, { passive: false });

		return () => {
			wrapper.removeEventListener("mouseenter", onWrapperEnter);
			wrapper.removeEventListener("mouseleave", onWrapperLeave);
			wrapper.removeEventListener("wheel", onWheel);
			scroller.removeEventListener("wheel", onWheel);
			unlock();
		};
	}, [wrapperRef, scrollerRef]);
};
