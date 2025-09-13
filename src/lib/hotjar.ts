// Hotjar utility functions for custom event tracking

/**
 * Trigger a custom Hotjar event
 * @param eventName - Name of the event to trigger
 */
export const triggerHotjarEvent = (eventName: string): void => {
  if (typeof window !== 'undefined' && window.hj) {
    try {
      window.hj('event', eventName);
    } catch (error) {
      console.warn('Failed to trigger Hotjar event:', error);
    }
  }
};

/**
 * Identify a user in Hotjar
 * @param userId - Unique identifier for the user
 * @param userAttributes - Additional user attributes
 */
export const identifyHotjarUser = (
  userId: string,
  userAttributes?: Record<string, unknown>
): void => {
  if (typeof window !== 'undefined' && window.hj) {
    try {
      window.hj('identify', userId, userAttributes);
    } catch (error) {
      console.warn('Failed to identify Hotjar user:', error);
    }
  }
};

/**
 * Trigger a custom Hotjar trigger
 * @param triggerName - Name of the trigger to activate
 */
export const triggerHotjarTrigger = (triggerName: string): void => {
  if (typeof window !== 'undefined' && window.hj) {
    try {
      window.hj('trigger', triggerName);
    } catch (error) {
      console.warn('Failed to trigger Hotjar trigger:', error);
    }
  }
};

/**
 * Document generation specific events
 */
export const HotjarEvents = {
  // Upload flow events
  DOCUMENT_UPLOADED: 'document_uploaded',
  VARIABLES_DETECTED: 'variables_detected',

  // Fill flow events
  VARIABLES_FILLED: 'variables_filled',
  SECTION_ADDED: 'section_added',
  MERGE_STARTED: 'merge_started',
  MERGE_COMPLETED: 'merge_completed',

  // Preview events
  PREVIEW_OPENED: 'preview_opened',
  PREVIEW_ZOOMED: 'preview_zoomed',

  // Export events
  EXPORT_STARTED: 'export_started',
  EXPORT_COMPLETED: 'export_completed',
  DOWNLOAD_INITIATED: 'download_initiated',

  // Error events
  UPLOAD_ERROR: 'upload_error',
  MERGE_ERROR: 'merge_error',
  EXPORT_ERROR: 'export_error',
  PREVIEW_ERROR: 'preview_error',
} as const;

/**
 * Track document generation workflow events
 */
export const trackDocumentEvent = (event: keyof typeof HotjarEvents, metadata?: Record<string, unknown>): void => {
  const eventName = HotjarEvents[event];
  triggerHotjarEvent(eventName);

  // Log for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Hotjar Event: ${eventName}`, metadata);
  }
};