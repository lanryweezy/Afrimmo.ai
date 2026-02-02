// Accessibility utilities for the application

// Focus trap for modal dialogs
export const focusTrap = (container: HTMLElement, firstElement?: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstFocusableElement = firstElement || focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Clean up function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

// Announce to screen readers
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after a delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Toggle high contrast mode
export const toggleHighContrast = () => {
  const body = document.body;
  const isHighContrast = body.classList.contains('high-contrast');
  
  if (isHighContrast) {
    body.classList.remove('high-contrast');
    localStorage.removeItem('high-contrast');
  } else {
    body.classList.add('high-contrast');
    localStorage.setItem('high-contrast', 'true');
  }
};

// Check if high contrast mode is enabled
export const isHighContrastEnabled = () => {
  return document.body.classList.contains('high-contrast') || 
         localStorage.getItem('high-contrast') === 'true';
};

// Initialize high contrast based on saved preference
export const initHighContrast = () => {
  if (isHighContrastEnabled()) {
    document.body.classList.add('high-contrast');
  }
};

// Add skip link for keyboard navigation
export const addSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link sr-only focusable';
  skipLink.tabIndex = 0;

  document.body.insertBefore(skipLink, document.body.firstChild);

  skipLink.addEventListener('focus', () => {
    skipLink.classList.remove('sr-only');
  });

  skipLink.addEventListener('blur', () => {
    skipLink.classList.add('sr-only');
  });
};

// Initialize accessibility features
export const initAccessibility = () => {
  initHighContrast();
  addSkipLink();
};

// ARIA attributes helper
export const getAriaAttributes = (props: {
  label?: string;
  describedBy?: string;
  controls?: string;
  expanded?: boolean;
  hidden?: boolean;
}) => {
  const attrs: Record<string, string | boolean> = {};

  if (props.label) attrs['aria-label'] = props.label;
  if (props.describedBy) attrs['aria-describedby'] = props.describedBy;
  if (props.controls) attrs['aria-controls'] = props.controls;
  if (props.expanded !== undefined) attrs['aria-expanded'] = props.expanded;
  if (props.hidden !== undefined) attrs['aria-hidden'] = props.hidden;

  return attrs;
};