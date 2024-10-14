import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

const baseURL = process.env.HYDRA_ADMIN_URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { loginChallenge, subject, remember } = req.body

    try {
      const response = await axios.put(
        `${baseURL}/oauth2/auth/requests/login/accept?login_challenge=${loginChallenge}`,
        {
          subject,
          remember,
        },
      )

      res.status(200).json({ redirect_to: response.data.redirect_to })
    } catch (error) {
      console.error("Error in API handler:", error)
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ message: error.response.data })
      } else {
        res.status(500).json({ message: "Internal Server Error" })
      }
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
