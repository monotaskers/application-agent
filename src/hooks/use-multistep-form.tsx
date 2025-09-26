import { ReactElement, useCallback, useState } from 'react';

interface UseMultistepFormReturn {
  currentStepIndex: number;
  step: ReactElement | undefined;
  steps: ReactElement[];
  isFirstStep: boolean;
  isLastStep: boolean;
  goTo: (index: number) => void;
  next: () => void;
  back: () => void;
}

export default function useMultistepForm(steps: ReactElement[]): UseMultistepFormReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = useCallback((): void => {
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const back = useCallback((): void => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number): void => {
    setCurrentStepIndex(index);
  }, []);

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back
  };
}
