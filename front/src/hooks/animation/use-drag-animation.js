import { gsap } from 'gsap';
import { useRef, useState, useEffect } from 'react';

function useDragAnimation(children, effect) {
  const ref = useRef(null);
  const [prev, setPrev] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const effectArray =
    effect === null ? [children, prev, isAnimating] : [effect];

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      setPrev(children); // prevent mismatch
      return; // skip animation on first render
    }

    if (children !== prev && !isAnimating) {
      setIsAnimating(true);

      const timeline = gsap.timeline({
        defaults: { duration: 0.3, ease: 'power2.out' },
      });

      timeline
        .to(ref.current, { x: -720 })
        .add(() => {
          setPrev(children);
          gsap.set(ref.current, { x: 720 });
        }, '>')
        .to(
          ref.current,
          {
            x: 0,
            onComplete: () => {
              setIsAnimating(false);
            },
          },
          '>'
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...effectArray, isFirstRender]);

  return { ref, prev, isAnimating };
}

export { useDragAnimation };
