// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const player = JSON.parse(req.body);
    if (req.method === "POST") {
      try {
        const data = await prisma.player.update({
          where: { name: player.name },
          data: {
            name: player.name,
            score: player.score,
            quote: player.quote,
          },
        });
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}
