export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    })
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contacts: [
          {
            email: email,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`SendGrid error: ${response.status}`)
    }

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again later.",
    })
  }
}