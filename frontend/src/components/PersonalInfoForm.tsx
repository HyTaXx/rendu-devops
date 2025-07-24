import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/auth";
import { userService } from "@/services/user";
import { AuthService } from "@/services/auth";

interface PersonalInfoFormProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onCancel: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onUserUpdated,
  onCancel,
}) => {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstname.trim() || !lastname.trim()) {
      setError("Le prénom et le nom sont obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await userService.updateCurrentUser({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      });

      // Mettre à jour l'utilisateur dans le localStorage aussi
      AuthService.setUser(updatedUser);

      onUserUpdated(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Erreur lors de la mise à jour des informations");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = firstname !== user.firstname || lastname !== user.lastname;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Modifier mes informations</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
              maxLength={50}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            L'email ne peut pas être modifié
          </p>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={loading || !hasChanges}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
