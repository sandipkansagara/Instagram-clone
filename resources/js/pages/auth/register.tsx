import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInertiaFormWithZod } from '@/hooks/useInertiaFormWithZod';
import AuthLayout from '@/layouts/auth-layout';
import { registerSchema } from '@/lib/schemas';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const { clientErrors, validateField, clearClientError } =
        useInertiaFormWithZod(registerSchema);
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    onChange={(e) => {
                                        validateField('name', e.target.value);
                                    }}
                                    onBlur={(e) =>
                                        validateField('name', e.target.value)
                                    }
                                    aria-invalid={
                                        !!errors?.name || !!clientErrors.name
                                    }
                                    aria-describedby={
                                        errors?.name || clientErrors.name
                                            ? 'name-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="name-error"
                                    message={errors?.name || clientErrors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    onChange={(e) => {
                                        validateField('email', e.target.value);
                                    }}
                                    onBlur={(e) =>
                                        validateField('email', e.target.value)
                                    }
                                    aria-invalid={
                                        !!errors?.email || !!clientErrors.email
                                    }
                                    aria-describedby={
                                        errors?.email || clientErrors.email
                                            ? 'email-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="email-error"
                                    message={
                                        errors?.email || clientErrors.email
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                        validateField(
                                            'password',
                                            e.target.value,
                                        );
                                        clearClientError(
                                            'password_confirmation',
                                        ); // Clear confirmation error when password changes
                                    }}
                                    onBlur={(e) =>
                                        validateField(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    aria-invalid={
                                        !!errors?.password ||
                                        !!clientErrors.password
                                    }
                                    aria-describedby={
                                        errors?.password ||
                                        clientErrors.password
                                            ? 'password-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="password-error"
                                    message={
                                        errors?.password ||
                                        clientErrors.password
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    onChange={(e) => {
                                        validateField(
                                            'password_confirmation',
                                            e.target.value,
                                        );
                                    }}
                                    onBlur={(e) =>
                                        validateField(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    aria-invalid={
                                        !!errors?.password_confirmation ||
                                        !!clientErrors.password_confirmation
                                    }
                                    aria-describedby={
                                        errors?.password_confirmation ||
                                        clientErrors.password_confirmation
                                            ? 'password-confirmation-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="password-confirmation-error"
                                    message={
                                        errors?.password_confirmation ||
                                        clientErrors.password_confirmation
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
