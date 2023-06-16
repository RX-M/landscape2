import { RefObject, useCallback, useEffect, useState } from 'react';

export const useOutsideClick = (
  refs: RefObject<HTMLElement>[],
  enabled: boolean,
  onClickOutside: (e: MouseEvent) => void
): [boolean] => {
  const [isActive, setActive] = useState(false);

  const isOutside = useCallback(
    (e: MouseEvent) => {
      const test = refs.map((ref) => {
        if (ref.current === null) return true;
        return !ref.current.contains(e.target as HTMLElement);
      });

      return test.every(Boolean);
    },
    [refs]
  );

  const onEvent = useCallback(
    (e: MouseEvent) => {
      if (isOutside(e) && enabled) {
        setActive(true);
        onClickOutside(e);
      }
    },
    [isOutside, onClickOutside, enabled]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onEvent);

    return () => {
      document.removeEventListener('mousedown', onEvent);
    };
  }, [refs, onClickOutside, onEvent]);

  return [isActive];
};
