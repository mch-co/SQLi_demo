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
    // Permet l'injection SQL basée sur les erreurs
    const query = `SELECT id, username, email, role FROM users WHERE id = ${userId}`;

    try {
      const [rows] = await connection.execute(query);
      await connection.end();

      return NextResponse.json({
        success: true,
        data: rows,
        query: query,
      });
    } catch (dbError: unknown) {
      await connection.end();

      // Narrow unknown to a safer shape before accessing properties
      const err = dbError as {
        message?: string;
        code?: string;
        sqlMessage?: string;
        errno?: number;
      };

      // VULNÉRABLE : Expose l'erreur SQL complète
      // L'attaquant peut extraire des informations via les messages d'erreur
      return NextResponse.json(
        {
          success: false,
          error: err.message ?? "Une erreur est survenue",
          code: err.code,
          sqlMessage: err.sqlMessage,
          errno: err.errno,
          query: query,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
