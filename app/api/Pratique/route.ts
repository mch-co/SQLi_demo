import { userSchema } from "@/app/_validation/validationSchemas";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validation avec Zod
    const validatedData = userSchema.parse(body);

    // 2. Utilisation de Prisma ORM (requêtes préparées automatiques)
    const newUser = await prisma.users.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: validatedData.password, // À hasher en production !
        role: validatedData.role,
      },
    });

    return NextResponse.json({
      success: true,
      message: " Utilisateur créé avec succès (validation + ORM)",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        created_at: newUser.created_at,
      },
      security: {
        validation: "✓ Validation Zod passée",
        orm: "✓ Prisma ORM (requêtes préparées)",
        protection: "✓ Protection contre SQLi garantie",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "❌ Validation échouée",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Erreur serveur:", error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Récupérer tous les utilisateurs avec Prisma
export async function GET(request: NextRequest) {
  try {
    // Tester la connexion
    await prisma.$connect();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    let users;

    if (username) {
      // Validation du paramètre de recherche
      const cleanUsername = username.trim();

      // Recherche sécurisée avec Prisma
      users = await prisma.users.findMany({
        where: {
          username: {
            contains: cleanUsername,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    } else {
      users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
      security: {
        orm: "✓ Prisma ORM utilisé",
        protection: "✓ Requêtes préparées automatiques",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur lors de la récupération",
        error: error instanceof Error ? error.message : "Erreur inconnue",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
