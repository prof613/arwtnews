export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
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
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: "webcontact@redwhiteandtruenews.com",
                name: "RWT News Contact",
              },
            ],
            subject: `Website Contact: ${subject}`,
          },
        ],
        from: {
          email: "newsletter@redwhiteandtruenews.com",
          name: "RWT News Website",
        },
        reply_to: {
          email: email,
          name: name,
        },
        content: [
          {
            type: "text/html",
            value: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <p><em>This message was sent from the RWT News website contact form.</em></p>
            `,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`SendGrid error: ${response.status}`)
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    })
  }
}
