"use server"
import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";


const SMTP_HOST = process.env.SMTP_HOST ?? ''
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
const EMAIL_FROM = process.env.EMAIL_FROM ?? ''


export async function sendMail({to, subject, text, html, attachments, fromName}: {
  to: string,
  subject: string,
  text?: string,
  html?: string,
  attachments?: Attachment[],
  fromName?: string
}) { 
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })
  await transporter.verify()
  const from = fromName ? `${fromName} <${EMAIL_FROM}>` : EMAIL_FROM
  transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments
  },
  (err, info) => {
    console.error(err)
    console.log(info)
  })

}
