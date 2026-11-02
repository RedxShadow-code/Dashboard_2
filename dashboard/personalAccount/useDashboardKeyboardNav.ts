import { useEffect, useCallback } from 'react';

export interface UseDashboardKeyboardNavOptions {
  enabled?: boolean;
  totalCards: number;
  focusedCardIndex: number | null;
  setFocusedCardIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onEscape?: () => void;
  isBlocked?: boolean;
}

/**
 * Custom React hook to handle 'ArrowDown' and 'ArrowUp' keys (as well as ArrowRight and ArrowLeft)
 * to cycle focus smoothly through dashboard cards, and 'Escape' to reset active states,
 * clear focus, or collapse expanded content.
 */
export function useDashboardKeyboardNav({
  enabled = true,
  totalCards,
  focusedCardIndex,
  setFocusedCardIndex,
  onEscape,
  isBlocked = false,
}: UseDashboardKeyboardNavOptions) {
  const cycleNext = useCallback(() => {
    if (totalCards <= 0) return;
    setFocusedCardIndex((prev) => {
      const next = prev === null ? 0 : (prev + 1) % totalCards;
      setTimeout(() => {
        const el = document.querySelector(`[data-dashboard-card="${next}"]`);
        if (el) {
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          (el as HTMLElement).focus?.();
        }
      }, 10);
      return next;
    });
  }, [totalCards, setFocusedCardIndex]);

  const cyclePrev = useCallback(() => {
    if (totalCards <= 0) return;
    setFocusedCardIndex((prev) => {
      const next = prev === null ? totalCards - 1 : (prev - 1 + totalCards) % totalCards;
      setTimeout(() => {
        const el = document.querySelector(`[data-dashboard-card="${next}"]`);
        if (el) {
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          (el as HTMLElement).focus?.();
        }
      }, 10);
      return next;
    });
  }, [totalCards, setFocusedCardIndex]);

  const resetFocus = useCallback(() => {
    setFocusedCardIndex(null);
  }, [setFocusedCardIndex]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === 'Escape') {
        // Reset active states or collapse expanded content
        setFocusedCardIndex(null);
        onEscape?.();
        return;
      }

      if (isInput || isBlocked) return;

      // Cycle focus through cards with ArrowDown or ArrowRight
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        cycleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        // Cycle backwards with ArrowUp or ArrowLeft
        e.preventDefault();
        cyclePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isBlocked, cycleNext, cyclePrev, onEscape, setFocusedCardIndex]);

  return {
    cycleNext,
    cyclePrev,
    resetFocus,
  };
}

export default useDashboardKeyboardNav;
