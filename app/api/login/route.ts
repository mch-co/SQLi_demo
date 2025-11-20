import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Route de connexion avec version sécurisée et vulnérable
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, mode = "secure" } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      );
    }

    let users: User[];

    if (mode === "vulnerable") {
      // Version VULNÉRABLE - Ne jamais utiliser en production!
      // Concaténation directe des entrées utilisateur dans la requête SQL
      const sqlQuery = `SELECT id, username, email, role FROM users WHERE username = '${username}' AND password = '${password}'`;

      console.log(" Requête vulnérable:", sqlQuery);
      users = await query<User[]>(sqlQuery);
    } else {
      // Version SÉCURISÉE - Utilisation de requêtes préparées
      const sqlQuery =
        "SELECT id, username, email, role FROM users WHERE username = ? AND password = ?";

      console.log("Requête sécurisée avec paramètres:", sqlQuery);
      users = await query<User[]>(sqlQuery, [username, password]);
    }

    if (users.length > 0) {
      const user = users[0];
      return NextResponse.json({
        success: true,
        message: "Connexion réussie",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        mode,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Nom d'utilisateur ou mot de passe incorrect",
          mode,
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la connexion",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
