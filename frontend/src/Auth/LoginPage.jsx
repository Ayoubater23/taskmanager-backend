import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/projects', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result === true) {
            navigate('/projects');
        } else {
            setError(result);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full p-10 space-y-8 bg-white shadow-2xl rounded-xl border border-gray-100 transform transition duration-500 hover:shadow-3xl">

                <div className="text-center">
                    <svg className="mx-auto h-12 w-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg shadow-md transition duration-300 ease-in-out ${
                            loading
                                ? 'bg-indigo-400 cursor-not-allowed text-indigo-50'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="text-sm text-center pt-4">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
