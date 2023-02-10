import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await prisma.player.findMany();
    return res.status(200).json(data);
  } catch (err) {
    console.log("error4", err);
    return res.status(500).json(err);
  }
}
