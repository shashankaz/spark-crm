import { Request } from "express";
import arcjet, { validateEmail } from "@arcjet/node";
import { env } from "../../config/env";

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

export const validateEmailWithArcjet = async ({
  req,
  email,
}: {
  req: Request;
  email: string;
}): Promise<boolean> => {
  const decision = await aj.protect(req, {
    email,
  });

  return decision.isDenied();
};
