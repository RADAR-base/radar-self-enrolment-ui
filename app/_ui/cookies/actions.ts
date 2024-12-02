"use server"
import { cookies } from 'next/headers'


export type CookieChoice = "all" | "functional" | "reject"

export async function acceptOrRejectCookies(choice: CookieChoice) {
  const cookieStore = await cookies()
  let expiresDate = new Date()
  expiresDate.setDate(expiresDate.getDate() + 180)
  const expires = (choice == "reject") ? undefined : expiresDate
  cookieStore.set("cookieChoice", choice, {expires: expires})
}