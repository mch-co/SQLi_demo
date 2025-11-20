import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await getConnection();

    try {
      const [comments] = await connection.execute(
        "SELECT id, username, comment, created_at FROM comments ORDER BY created_at DESC"
      );
      await connection.end();

      return NextResponse.json({
        success: true,
        data: comments,
      });
    } catch (dbError: unknown) {
      await connection.end();
      const err = dbError as { message?: string };
      return NextResponse.json(
        { success: false, error: err.message },
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

export async function POST(request: Request) {
  try {
    const { username, comment, vulnerable } = await request.json();

    if (!username || !comment) {
      return NextResponse.json(
        { error: "username et comment sont requis" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      if (vulnerable) {
        // VULNÉRABLE : Stocke le commentaire sans validation
        // Le payload malveillant est stocké tel quel dans la base de données
        const insertQuery = `INSERT INTO comments (username, comment) VALUES ('${username}', '${comment}')`;

        await connection.execute(insertQuery);
        await connection.end();

        return NextResponse.json({
          success: true,
          message: "Commentaire ajouté (version vulnérable)",
          query: insertQuery,
        });
      } else {
        // SÉCURISÉ : Utilise des requêtes préparées
        const insertQuery =
          "INSERT INTO comments (username, comment) VALUES (?, ?)";

        await connection.execute(insertQuery, [username, comment]);
        await connection.end();

        return NextResponse.json({
          success: true,
          message: "Commentaire ajouté (version sécurisée)",
        });
      }
    } catch (dbError: unknown) {
      await connection.end();
      const err = dbError as { message?: string };
      return NextResponse.json(
        { success: false, error: err.message },
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

export async function DELETE() {
  try {
    const connection = await getConnection();

    try {
      await connection.execute("DELETE FROM comments");
      await connection.end();

      return NextResponse.json({
        success: true,
        message: "Tous les commentaires ont été supprimés",
      });
    } catch (dbError: unknown) {
      await connection.end();
      const err = dbError as { message?: string };
      return NextResponse.json(
        { success: false, error: err.message },
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
