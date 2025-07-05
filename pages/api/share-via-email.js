import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  // Now accepting senderName in the request body
  const { to, from, subject, url, title, senderName } = req.body

  if (!to || !from || !subject || !url || !title) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  // Use the sender's name if provided, otherwise default to "Someone"
  const fromText = senderName ? `${senderName}` : "Someone"

  const emailContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #B22234;">A Message from Red, White and True News</h2>
      <p>${fromText} thought you would be interested in the following article:</p>
      <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
        <h3 style="margin-top: 0;">
          <a href="${url}" style="color: #3C3B6E; text-decoration: none;">${title}</a>
        </h3>
        <p>You can read the full article by clicking the link below:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 15px; background-color: #B22234; color: #fff; text-decoration: none; border-radius: 3px;">
          Read More
        </a>
      </div>
      <p style="font-size: 12px; color: #777; margin-top: 20px;">
        This email was sent via the share feature on Red, White and True News.
      </p>
    </div>
  `

  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: emailContent,
  }

  try {
    await sgMail.send(msg)
    res.status(200).json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error)
    res.status(500).json({ success: false, message: "Error sending email" })
  }
}
