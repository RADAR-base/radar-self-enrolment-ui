import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const styles = StyleSheet.create({
    page: { backgroundColor: 'tomato' },
    section: { color: 'white', textAlign: 'center', margin: 30 }
  });

  return await new NextResponse()
}