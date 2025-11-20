import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, vulnerable } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "username est requis" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      if (vulnerable) {
        // VULNÉRABLE : Utilise directement le username stocké dans une requête SQL
        // C'est ici que la SQLi stockée s'exécute (Second-Order)
        const query = `SELECT * FROM users WHERE username = '${username}'`;

        console.log("Executing query:", query);
        const [rows] = await connection.execute(query);
        await connection.end();

        return NextResponse.json({
          success: true,
          data: rows,
          query: query,
          message: "Recherche avec username stocké (vulnérable)",
        });
      } else {
        // SÉCURISÉ : Utilise des requêtes préparées
        const query = "SELECT * FROM users WHERE username = ?";

        const [rows] = await connection.execute(query, [username]);
        await connection.end();

        return NextResponse.json({
          success: true,
          data: rows,
          message: "Recherche avec username stocké (sécurisée)",
        });
      }
    } catch (dbError: unknown) {
      await connection.end();
      const err = dbError as { message?: string; sqlMessage?: string };

      console.error("Database error:", err);

      if (vulnerable) {
        return NextResponse.json(
          {
            success: false,
            error: err.message,
            sqlMessage: err.sqlMessage,
            username: username,
          },
          { status: 200 } // Changé en 200 pour afficher l'erreur dans l'interface
        );
      }

      return NextResponse.json(
        { success: false, error: "Erreur lors de la recherche" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
