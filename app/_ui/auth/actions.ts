"use server"
import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'

async function logout(): Promise<boolean> {
  const auth = new AuthServer();
  return (await auth.logOut()).ok
}

async function login(email: string, password: string): Promise<boolean> {
  const auth = new AuthServer();
  auth.signIn(email, password)
  return true
}