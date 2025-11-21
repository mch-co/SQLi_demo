"use client";

import { userSchema } from "@/app/_validation/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Database, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

interface User {
  id: number;
  username: string;
  email: string;
  role: string | null;
  created_at: Date | null;
}

export default function BonnesPratiques() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    security?: any;
    errors?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [existingUsers, setExistingUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validation en temps réel
    try {
      const fieldSchema = userSchema.shape[field as keyof typeof formData];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message || "Erreur de validation",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitResult(null);
    setErrors({});

    try {
      // Validation côté client avec Zod
      const validatedData = userSchema.parse(formData);

      // Envoi vers l'API qui utilise Prisma ORM
      const response = await fetch("/api/Pratique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      // Vérifier si la réponse est bien du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La réponse du serveur n'est pas au format JSON");
      }

      const result = await response.json();

      if (result.success) {
        setSubmitResult({
          success: true,
          message: "Utilisateur créé avec succès (Validation + ORM) !",
          data: result.user,
          security: result.security,
        });
        // Réinitialiser le formulaire
        setFormData({ email: "", username: "", password: "", role: "" });
        // Charger la liste des utilisateurs
        loadUsers();
      } else {
        setSubmitResult({
          success: false,
          message: result.message || " Erreur lors de la création",
          errors: result.errors,
        });
      }
      setActiveTab("result");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        setSubmitResult({
          success: false,
          message: "❌ Validation échouée - Veuillez corriger les erreurs",
        });
      } else {
        console.error("Erreur lors de la soumission:", error);
        setSubmitResult({
          success: false,
          message:
            error instanceof Error
              ? `❌ ${error.message}`
              : "❌ Erreur de connexion au serveur",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/Pratique");

      // Vérifier si la réponse est bien du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("La réponse du serveur n'est pas au format JSON");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setExistingUsers(result.users);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  const testMaliciousInputs = [
    { label: "SQL Union", value: "admin' UNION SELECT * FROM users--" },
    { label: "SQL OR 1=1", value: "admin' OR '1'='1" },
    { label: "SQL Drop Table", value: "'; DROP TABLE users;--" },
    { label: "SQL Comment", value: "admin'--" },
    { label: "Script Tag", value: "<script>alert('XSS')</script>" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <Card className="border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Shield className="h-6 w-6" />
              Bonnes Pratiques - Validation + ORM
            </CardTitle>
            <CardDescription>
              Démonstration complète : Validation Zod + Prisma ORM pour une
              protection maximale contre SQLi
            </CardDescription>
          </CardHeader>
        </Card>

        <div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire avec Validation + ORM</CardTitle>
                <CardDescription>
                  Validation côté client (Zod) + Requêtes sécurisées avec Prisma
                  ORM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="text"
                      placeholder="utilisateur@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                    {!errors.email && formData.email && (
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Email valide
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nom d&apos;utilisateur
                    </label>
                    <Input
                      type="text"
                      placeholder="john_doe"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.username}
                      </p>
                    )}
                    {!errors.username && formData.username && (
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Nom valide
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mot de passe</label>
                    <Input
                      type="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rôle</label>
                    <Input
                      type="text"
                      placeholder="user, admin, moderator, guest"
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className={errors.role ? "border-red-500" : ""}
                    />
                    {errors.role && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? "Création en cours..."
                      : "Créer l'utilisateur (Validation + ORM)"}
                  </Button>
                </form>

                {/* Liste des utilisateurs créés */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      Utilisateurs créés ({existingUsers.length})
                    </h4>
                    <Button variant="outline" size="sm" onClick={loadUsers}>
                      Actualiser
                    </Button>
                  </div>
                  {existingUsers.length > 0 ? (
                    <div className="bg-slate-50 p-3 rounded-md border max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {existingUsers.map((user) => (
                          <div
                            key={user.id}
                            className="text-xs bg-white p-2 rounded border"
                          >
                            <div className="font-semibold">{user.username}</div>
                            <div className="text-muted-foreground">
                              {user.email} • {user.role || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Aucun utilisateur créé
                    </p>
                  )}
                </div>

                {/* Tests d'injection */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Test rapide - Entrées malveillantes
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {testMaliciousInputs.map((test, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            email: test.value,
                            username: test.value,
                            password: "Test123!",
                            role: test.value,
                          });
                        }}
                      >
                        {test.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
