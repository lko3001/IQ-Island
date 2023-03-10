import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const player = JSON.parse(req.body);
    if (req.method === "POST") {
      try {
        const data = await prisma.player.create({
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
