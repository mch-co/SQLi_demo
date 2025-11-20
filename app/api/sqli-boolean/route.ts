import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    const connection = await getConnection();

    // VULNÉRABLE : Requête SQL avec concaténation directe
    // Permet l'injection SQL basée sur les booléens (Blind SQLi)
    const query = `SELECT id, username, email, role FROM users WHERE id = ${userId}`;

    try {
      const [rows] = await connection.execute(query);
      await connection.end();

      // Comportement typique d'une Blind SQLi :
      // - Si la condition est vraie, des résultats sont retournés
      // - Si la condition est fausse, aucun résultat n'est retourné
      // - L'attaquant peut extraire des données caractère par caractère

      const hasResults = Array.isArray(rows) && rows.length > 0;

      return NextResponse.json({
        success: true,
        found: hasResults,
        count: Array.isArray(rows) ? rows.length : 0,
        data: hasResults ? rows : [],
        query: query,
        message: hasResults ? "Utilisateur trouvé" : "Aucun utilisateur trouvé",
      });
    } catch (dbError: unknown) {
      await connection.end();

      const err = dbError as {
        message?: string;
        code?: string;
      };

      // En cas d'erreur SQL, on retourne simplement "non trouvé"
      // Cela cache l'erreur mais permet toujours l'exploitation booléenne
      return NextResponse.json(
        {
          success: false,
          found: false,
          count: 0,
          data: [],
          message: "Aucun utilisateur trouvé",
          query: query,
          error: err.message,
        },
        { status: 200 } // Note : statut 200 pour ne pas révéler l'erreur
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
