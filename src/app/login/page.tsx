'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, isLoading, error: authError } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    
    // Basic validation
    let hasErrors = false;
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call login function from auth context
      await login(formData.email, formData.password);
      // Router push will be handled by AuthContext based on user role
    } catch (err) {
      console.error('Login error:', err);
      setErrors({
        ...newErrors,
        general: err instanceof Error ? err.message : 'Login failed. Please try again.'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">🐾</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Staff Login
            </h2>
            <p className="text-gray-600">
              Sign in to access the veterinary system
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormInput
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="staff@vetclinic.com"
              required
            />
            
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            {(errors.general || authError) && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {errors.general || authError}
              </div>
            )}
            
            {/* Link */}
            <div className="flex items-center justify-start text-sm">
              <button 
                type="button"
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Home
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-base py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold mb-2 text-gray-700">Demo Credentials:</p>
              <div className="text-sm space-y-1 text-gray-600">
                <p>• Admin: admin@vetclinic.com / admin123</p>
                <p>• Doctor: doctor@vetclinic.com / doctor123</p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
