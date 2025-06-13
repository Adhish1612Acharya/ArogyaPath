const verificationLink = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
const emailBody = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #222;">
      <div style="max-width: 500px; margin: auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
        <h2 style="color: #1976d2;">Welcome to ArogyaPath!</h2>
        <p>Hi,</p>
        <p>Thank you for registering with <b>ArogyaPath</b>. To complete your sign up and activate your account, please verify your email address by clicking the button below:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}" style="background: #1976d2; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
            Verify My Email
          </a>
        </p>
        <p>If the button above does not work, copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best Regards,<br/>The ArogyaPath Team</p>
      </div>
    </body>
  </html>
`;