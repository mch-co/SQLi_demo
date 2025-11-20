import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    // Validation de l'entrée
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return NextResponse.json(
        { error: "userId doit être un nombre valide" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // SÉCURISÉ : Utilisation de requêtes préparées (prepared statements)
    const query = "SELECT * FROM users WHERE id = ?";

    try {
      const [rows] = await connection.execute(query, [userIdNum]);
      await connection.end();

      return NextResponse.json({
        success: true,
        data: rows,
        message: "Requête sécurisée avec prepared statement",
      });
    } catch {
      await connection.end();

      // SÉCURISÉ : Message d'erreur générique sans détails techniques
      return NextResponse.json(
        {
          success: false,
          error: "Une erreur est survenue lors de la récupération des données",
        },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
