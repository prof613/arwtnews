// SendGrid email API endpoint
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { to, subject, message } = req.body

  // For now, just log the alert instead of sending email
  // (since you don't have SendGrid set up yet)
  console.log("🚨 ALERT TRIGGERED:")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("Message:", message)
  console.log("---")

  // Return success so the app doesn't break
  res.status(200).json({ message: "Alert logged successfully" })
}
