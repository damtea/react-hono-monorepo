import { DrizzleError } from "drizzle-orm";
import type { Context } from "hono";

// Postgres error types with known error codes
type PostgresError = {
  code?: string;
  detail?: string;
  message: string;
};

export function handleDrizzleError(error: unknown, c: Context) {
  // Handle Drizzle ORM-specific errors
  if (error instanceof DrizzleError) {
    console.error("Drizzle Error:", error.message);
    return c.json(
      {
        success: false,
        message: `Database Error: ${error.message}`,
      },
      500
    );
  }

  // Check for PostgreSQL errors (usually from query execution)
  if (typeof error === "object" && error !== null && "code" in error) {
    const pgError = error as PostgresError;

    // Handle unique constraint violation
    if (pgError.code === "23505") {
      return c.json(
        {
          success: false,
          message: "Duplicate entry detected. Please use a unique value.",
        },
        409
      );
    }

    // Handle foreign key constraint violation
    if (pgError.code === "23503") {
      return c.json(
        {
          success: false,
          message: "Foreign key violation. Invalid reference provided.",
        },
        400
      );
    }

    // Handle other known PostgreSQL errors
    if (pgError.code) {
      return c.json(
        {
          success: false,
          message: `Postgres Error: ${pgError.message}`,
        },
        500
      );
    }
  }

  // Handle unexpected errors
  console.error("Unknown Error:", error);
  return c.json(
    {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    },
    500
  );
}
