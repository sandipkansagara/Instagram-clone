import { useState, useCallback } from 'react';
import type { z } from 'zod';

type FormData = Record<string, any>;
type Errors = Record<string, string>;

interface UseInertiaFormWithZodReturn<T extends FormData> {
    clientErrors: Errors;
    validateField: (field: keyof T, value: any) => void;
    validateForm: (data: T) => boolean;
    clearClientError: (field: keyof T) => void;
    clearAllClientErrors: () => void;
}

/**
 * Hook to add Zod client-side validation to Inertia forms
 * Works alongside server-side validation without interfering
 */
export function useInertiaFormWithZod<T extends FormData>(
    schema: z.ZodSchema<T>,
): UseInertiaFormWithZodReturn<T> {
    const [clientErrors, setClientErrors] = useState<Errors>({});

    const validateField = useCallback(
        (field: keyof T, value: any) => {
            // Create a partial object with just this field for validation
            const partialData = { [field]: value } as Partial<T>;

            // Validate the entire schema but only check for this field's error
            const result = schema.safeParse(partialData);

            setClientErrors((prev) => {
                const newErrors = { ...prev };
                if (result.success) {
                    delete newErrors[field as string];
                } else {
                    const fieldError = result.error.issues.find(
                        (err: any) => err.path[0] === field,
                    );
                    if (fieldError) {
                        newErrors[field as string] = fieldError.message;
                    }
                }
                return newErrors;
            });
        },
        [schema],
    );

    const validateForm = useCallback(
        (data: T) => {
            const result = schema.safeParse(data);
            if (result.success) {
                setClientErrors({});
                return true;
            } else {
                const newErrors: Errors = {};
                result.error.issues.forEach((err: any) => {
                    const path = err.path.join('.');
                    newErrors[path] = err.message;
                });
                setClientErrors(newErrors);
                return false;
            }
        },
        [schema],
    );

    const clearClientError = useCallback((field: keyof T) => {
        setClientErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
        });
    }, []);

    const clearAllClientErrors = useCallback(() => {
        setClientErrors({});
    }, []);

    return {
        clientErrors,
        validateField,
        validateForm,
        clearClientError,
        clearAllClientErrors,
    };
}
