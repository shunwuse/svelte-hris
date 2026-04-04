import type { SubmitFunction } from '@sveltejs/kit';

export interface EnhanceSubmitOptions {
  setSubmitting?: (isSubmitting: boolean) => void;
  onRedirect?: () => void;
}

export function createSubmitEnhancer(
  options: EnhanceSubmitOptions = {},
): SubmitFunction {
  return () => {
    options.setSubmitting?.(true);

    return async ({ result, update }) => {
      try {
        if (result.type === 'redirect') {
          options.onRedirect?.();
        }

        await update();
      } finally {
        options.setSubmitting?.(false);
      }
    };
  };
}
