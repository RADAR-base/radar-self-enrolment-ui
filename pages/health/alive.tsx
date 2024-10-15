import { ServerResponse } from "http"
import { GetServerSideProps } from "next"
import React from "react"

// Use Node.js's ServerResponse

const Alive = () => {
  return <div>Healthy!</div>
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
}: {
  res: ServerResponse
}) => {
  res.statusCode = 200

  return {
    props: {},
  }
}

export default Alive
