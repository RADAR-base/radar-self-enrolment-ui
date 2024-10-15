import { ServerResponse } from "http"
import { GetServerSideProps } from "next"
import React from "react"

const Ready = () => {
  return <div>Ready!</div>
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

export default Ready
