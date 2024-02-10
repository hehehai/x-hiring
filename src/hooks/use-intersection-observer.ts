"use client";

import React from "react";

export const useIntersectionObserver = <T extends HTMLElement | null>(
  ref: React.MutableRefObject<T>,
  options: {
    threshold?: number | number[];
    logicFn?: (entry: IntersectionObserverEntry) => boolean;
  } = {
    threshold: 0,
  },
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setIsIntersecting(
          options?.logicFn ? options.logicFn(entry) : entry.isIntersecting,
        );
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    const refCurrent = ref.current;

    return () => {
      if (refCurrent) {
        observer.unobserve(refCurrent);
      }
    };
  }, [options, ref]);

  return isIntersecting;
};
