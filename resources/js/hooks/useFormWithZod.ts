import { useState, useCallback } from 'react';
import { z } from 'zod';

type FormData = Record<string, any>;
type Errors = Record<string, string>;

interface UseFormWithZodReturn<T extends FormData> {
    data: T;
    errors: Errors;
    setData: (key: keyof T, value: any) => void;
    setErrors: (errors: Errors) => void;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => void;
    validate: () => boolean;
    isValid: boolean;
    reset: () => void;
}

export function useFormWithZod<T extends FormData>(
    schema: z.ZodSchema<T>,
    initialData: T,
): UseFormWithZodReturn<T> {
    const [data, setDataState] = useState<T>(initialData);
    const [errors, setErrors] = useState<Errors>({});

    const setData = useCallback(
        (key: keyof T, value: any) => {
            setDataState((prev) => ({ ...prev, [key]: value }));
            // Clear error for the field being updated
            if (errors[key as string]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[key as string];
                    return newErrors;
                });
            }
        },
        [errors],
    );

    const handleChange = useCallback(
        (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >,
        ) => {
            const { name, value } = e.target;
            setData(name as keyof T, value);
        },
        [setData],
    );

    const validate = useCallback(() => {
        const result = schema.safeParse(data);
        if (result.success) {
            setErrors({});
            return true;
        } else {
            const newErrors: Errors = {};
            result.error.issues.forEach((err: any) => {
                const path = err.path.join('.');
                newErrors[path] = err.message;
            });
            setErrors(newErrors);
            return false;
        }
    }, [data, schema]);

    const isValid = Object.keys(errors).length === 0;

    const reset = useCallback(() => {
        setDataState(initialData);
        setErrors({});
    }, [initialData]);

    return {
        data,
        errors,
        setData,
        setErrors,
        handleChange,
        validate,
        isValid,
        reset,
    };
}
