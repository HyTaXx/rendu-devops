import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [showSuccess, setShowSuccess] = useState(false);

  // Synchroniser le mode avec defaultMode quand il change
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    if (mode === "login") {
      onClose();
    } else {
      // Show success message for registration and switch to login
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMode("login");
      }, 2000);
    }
  };

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setShowSuccess(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-600">
              You can now log in with your credentials.
            </p>
          </div>
        ) : (
          <>
            {mode === "login" ? (
              <LoginForm
                onSuccess={handleSuccess}
                onSwitchToRegister={handleSwitchMode}
              />
            ) : (
              <RegisterForm
                onSuccess={handleSuccess}
                onSwitchToLogin={handleSwitchMode}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
