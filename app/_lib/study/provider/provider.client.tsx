"use client"
import React, { createContext } from "react";
import { StudyProtocol } from "../protocol";

export const ProtocolContext = createContext({} as StudyProtocol)

export default function ProtocolProvider({children}: any, protocol: StudyProtocol) {
  return (
    <ProtocolContext.Provider value={protocol}>
      {children}
    </ProtocolContext.Provider>
  )
}