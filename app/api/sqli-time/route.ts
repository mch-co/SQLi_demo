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
    // Permet l'injection SQL basée sur le temps (Time-based Blind SQLi)
    const query = `SELECT id, username, email, role FROM users WHERE id = ${userId}`;

    const startTime = Date.now();

    try {
      const [rows] = await connection.execute(query);
      const executionTime = Date.now() - startTime;

      await connection.end();

      // Dans une Time-based Blind SQLi, l'attaquant observe le temps de réponse
      // Si la condition est vraie, la requête prend plus de temps (via SLEEP)
      // Si la condition est fausse, la requête est rapide

      const hasResults = Array.isArray(rows) && rows.length > 0;

      return NextResponse.json({
        success: true,
        found: hasResults,
        count: Array.isArray(rows) ? rows.length : 0,
        data: hasResults ? rows : [],
        query: query,
        executionTime: executionTime,
        message: hasResults
          ? `Utilisateur trouvé (${executionTime}ms)`
          : `Aucun utilisateur trouvé (${executionTime}ms)`,
      });
    } catch (dbError: unknown) {
      const executionTime = Date.now() - startTime;
      await connection.end();

      const err = dbError as {
        message?: string;
        code?: string;
      };

      // Même en cas d'erreur, on retourne le temps d'exécution
      // Cela permet à l'attaquant d'exploiter la vulnérabilité
      return NextResponse.json(
        {
          success: false,
          found: false,
          count: 0,
          data: [],
          message: `Aucun utilisateur trouvé (${executionTime}ms)`,
          query: query,
          executionTime: executionTime,
          error: err.message,
        },
        { status: 200 }
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
