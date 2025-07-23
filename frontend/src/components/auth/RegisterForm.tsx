import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ApiErrorException } from "@/lib/http-client";
import type { RegisterData } from "@/types/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors([]);

    try {
      await register(formData);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiErrorException) {
        setError(err.message);
        // Handle validation errors if they exist
        if (err.status === 400) {
          try {
            const errorData = JSON.parse(err.message);
            if (errorData.errors) {
              setErrors(errorData.errors);
            } else if (errorData.details) {
              setErrors(errorData.details);
            }
          } catch {
            // If parsing fails, just show the original message
          }
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 12 characters with uppercase, lowercase,
            number, and special character.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {errors.length > 0 && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
