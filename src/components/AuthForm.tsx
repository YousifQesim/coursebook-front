import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import zxcvbn from 'zxcvbn';
import * as Yup from 'yup';

// Define the AuthFormProps interface
interface AuthFormProps {
  handleSubmit: (formData: FormData) => void;
  isLoginMode: boolean;
}

// Define the FormData interface
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

// Define the validation schema using Yup
const createValidationSchema = (isLoginMode: boolean) => {
  return Yup.object().shape({
    name: !isLoginMode ? Yup.string().required('Name is required') : Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: !isLoginMode ? Yup.string().oneOf([Yup.ref('password')], 'Passwords must match') : Yup.string(),
    rememberMe: Yup.boolean(),
  });
};

// Define the AuthForm component
const AuthForm: React.FC<AuthFormProps> = ({ handleSubmit, isLoginMode }) => {
  const [passwordStrength, setPasswordStrength] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Define the validation schema based on the current login mode
  const validationSchema = createValidationSchema(isLoginMode);

  // Function to get Tailwind CSS class based on password strength
  const getPasswordStrengthClass = (strength: number) => {
    if (strength <= 1) {
      return 'border-red-500 text-red-500';
    } else if (strength === 2) {
      return 'border-orange-500 text-orange-500';
    } else {
      return 'border-green-500 text-green-500';
    }
  };

  // Function to get password strength indicator text
  const getPasswordStrengthIndicator = (strength: number) => {
    if (strength === 0 || strength === 1) {
      return 'Weak';
    } else if (strength === 2) {
      return 'Fair';
    } else {
      return 'Strong';
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ handleChange,setFieldValue  }) => (
        <Form className="space-y-4">
          {!isLoginMode && (
            <>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="name" component="p" className="text-red-500 mb-2" />
            </>
          )}

          <Field
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <ErrorMessage name="email" component="p" className="text-red-500 mb-2" />

          <div className="relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`w-full p-2 border rounded-md focus:border-password-strength focus:outline-none ${passwordStrength !== null && !isLoginMode ? getPasswordStrengthClass(passwordStrength) : ''}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);
                const strength = zxcvbn(e.target.value).score;
                setPasswordStrength(strength);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prevState => !prevState)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            >
              {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
              <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {!isLoginMode && passwordStrength !== null && (
            <p className={`password-strength ${getPasswordStrengthClass(passwordStrength)}`}>
              {getPasswordStrengthIndicator(passwordStrength)}
            </p>
          )}
          <ErrorMessage name="password" component="p" className="text-red-500 mb-2" />

          {!isLoginMode && (
            <>
            <div className='relative'>

              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-2 border border-gray-300 rounded-md"
                />
                  <button
              type="button"
              onClick={() => setShowConfirmPassword(prevState => !prevState)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            >
              {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
              <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              )}
            </button>
                </div>
              <ErrorMessage name="confirmPassword" component="p" className="text-red-500 mb-2" />
            </>
          )}

          <div>
            <Field type="checkbox" name="rememberMe" id="rememberMe" className="mr-2" />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
