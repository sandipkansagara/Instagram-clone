import { z } from 'zod';

// HTML entities to prevent XSS in plain text rendering
const DANGEROUS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
];

/**
 * Check if content contains potentially dangerous patterns
 */
export function containsDangerousPatterns(content: string): boolean {
    return DANGEROUS_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Strip whitespace and normalize text for display
 */
export function sanitizeText(text: string): string {
    if (typeof text !== 'string') return '';

    return text
        .trim()
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .slice(0, 10000); // Prevent extremely long strings
}

/**
 * Sanitize user bio/profile content (plain text, max length)
 */
export function sanitizeProfileContent(
    content: string,
    maxLength: number = 500,
): string {
    if (!content) return '';
    if (containsDangerousPatterns(content)) return '';

    return sanitizeText(content).slice(0, maxLength);
}

/**
 * Sanitize post caption
 */
export function sanitizeCaption(caption: string): string {
    if (!caption) return '';
    if (containsDangerousPatterns(caption)) return '';

    return sanitizeText(caption).slice(0, 255);
}

/**
 * Sanitize comment body
 */
export function sanitizeComment(comment: string): string {
    if (!comment) return '';
    if (containsDangerousPatterns(comment)) return '';

    return sanitizeText(comment).slice(0, 2000);
}

/**
 * Check if URL is safe for image/video src
 */
export function isSafeMediaUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;

    try {
        const parsed = new URL(url, window.location.origin);
        // Only allow same-origin or whitelisted domains
        const allowedOrigins = [
            window.location.origin,
            process.env.VITE_APP_URL,
        ];

        return allowedOrigins.some((origin) => parsed.origin === origin);
    } catch {
        return false;
    }
}

/**
 * Sanitize external URLs with validation
 */
export function sanitizeUrl(url: string): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url, window.location.origin);

        // Prevent dangerous protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }

        return parsed.toString();
    } catch {
        return null;
    }
}

/**
 * Rate limiting error handling
 */
export interface RateLimitError {
    isRateLimited: boolean;
    retryAfter?: number;
    message: string;
}

/**
 * Check if error is a rate limiting error (429 status)
 */
export function isRateLimitError(error: any): boolean {
    return error?.response?.status === 429;
}

/**
 * Parse rate limit information from error response
 */
export function parseRateLimitError(error: any): RateLimitError {
    const status = error?.response?.status;
    const retryAfter = error?.response?.headers?.['retry-after'];

    if (status === 429) {
        return {
            isRateLimited: true,
            retryAfter: retryAfter ? parseInt(retryAfter, 10) : 60,
            message: 'Too many requests. Please slow down and try again later.',
        };
    }

    return {
        isRateLimited: false,
        message: 'An error occurred',
    };
}

/**
 * Format retry message
 */
export function formatRateLimitMessage(retryAfter: number): string {
    const minutes = Math.ceil(retryAfter / 60);
    return `Please try again in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}

/**
 * Zod + Sanitization integration
 */
export function validateAndSanitize<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
):
    | { success: true; data: T }
    | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
            errors[err.path.join('.')] = err.message;
        });
        return { success: false, errors };
    }

    // Additional sanitization for text fields
    const sanitized = sanitizeObject(result.data);
    return { success: true, data: sanitized };
}

/**
 * Sanitize object values recursively
 */
function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        return sanitizeText(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
    }
    return obj;
}
