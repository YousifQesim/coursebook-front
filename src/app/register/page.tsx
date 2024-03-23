"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            const response = await axios.post(`http://127.0.0.1:5000/api/register`, formData);
            const { token } = response.data;
            localStorage.setItem('token', token); // Store token in local storage
            console.log('Signup successful', token);
            // Redirect user to dashboard or home page upon successful signup
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error.response.data); // Handle error response
            setError('Signup failed');
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
