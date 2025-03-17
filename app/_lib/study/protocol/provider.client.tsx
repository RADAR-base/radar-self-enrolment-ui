"use client"
import React, { createContext, useState } from "react";
import { StudyProtocol } from "../protocol";

export const ProtocolContext = createContext({} as StudyProtocol)

interface ProtocolProviderProps {
  children: React.ReactNode
  protocol: StudyProtocol
}

export default function ProtocolProvider({children, protocol}: ProtocolProviderProps) {
  return (
    <ProtocolContext.Provider value={protocol}>
      {children}
    </ProtocolContext.Provider>
  )
}