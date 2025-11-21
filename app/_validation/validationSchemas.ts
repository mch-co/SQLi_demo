import { z } from "zod";

// Regex pour détecter et bloquer les patterns d'injection SQL
const SQL_INJECTION_PATTERN =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE|CAST|CONVERT|SCRIPT|JAVASCRIPT|ONERROR|ONLOAD)\b|--|;|\/\*|\*\/|xp_|sp_|'|\"|`|\\|<|>)/gi;

// Validation personnalisée pour les chaînes sans injection SQL
const sqlSafeString = (fieldName: string) =>
  z.string().refine((val) => !SQL_INJECTION_PATTERN.test(val), {
    message: `${fieldName} contient des caractères ou mots-clés non autorisés`,
  });

export const userSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .max(255, "Email trop long")
    .trim()
    .toLowerCase()
    .refine((val) => !SQL_INJECTION_PATTERN.test(val), {
      message: "Email contient des caractères non autorisés",
    }),

  username: sqlSafeString("Nom d'utilisateur")
    .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
    .max(100, "Le nom d'utilisateur ne peut pas dépasser 100 caractères")
    .trim()
    .refine((val) => /^[a-zA-Z0-9_-]+$/.test(val), {
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores",
    }),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
    .trim()
    .refine((val) => /[A-Z]/.test(val), {
      message: "Le mot de passe doit contenir au moins une majuscule",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Le mot de passe doit contenir au moins une minuscule",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Le mot de passe doit contenir au moins un chiffre",
    })
    .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
      message: "Le mot de passe doit contenir au moins un caractère spécial",
    }),

  role: sqlSafeString("Rôle")
    .min(2, "Le rôle doit contenir au moins 2 caractères")
    .max(100, "Le rôle ne peut pas dépasser 100 caractères")
    .trim()
    .refine((val) => /^[a-zA-Z_]+$/.test(val), {
      message: "Le rôle ne peut contenir que des lettres et underscores",
    })
    .refine(
      (val) =>
        ["admin", "user", "moderator", "guest"].includes(val.toLowerCase()),
      {
        message:
          "Rôle non reconnu. Valeurs autorisées: admin, user, moderator, guest",
      },
    ),
});
