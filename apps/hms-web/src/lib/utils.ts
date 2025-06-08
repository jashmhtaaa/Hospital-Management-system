}
}

/**
 * Utility function for merging class names with Tailwind CSS;
 */
export const cn = (...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
