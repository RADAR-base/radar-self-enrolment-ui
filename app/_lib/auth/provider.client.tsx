"use client"
import React, { createContext, useState } from "react";

export type Participant = {
  userId?: string
  loggedIn: boolean 
} | null

export const ParticipantContext = createContext({} as Participant)

interface ParticipantProviderProps {
  children: React.ReactNode
  participant: Participant
}

export default function ParticipantProvider({children, participant}: ParticipantProviderProps) {
  return (
    <ParticipantContext.Provider value={participant}>
      {children}
    </ParticipantContext.Provider>
  )
}