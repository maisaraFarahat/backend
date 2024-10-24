import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor() {
    // Set your SendGrid API Key from environment variables
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  // Method to send an email using SendGrid
  async sendMail(to: string, subject: string, html: string, text?: string) {
    const msg = {
      to,  // Recipient email
      from: process.env.SENDGRID_VERIFIED_SENDER, // Sender email (must be verified with SendGrid)
      subject,  // Email subject
      text: text || html,  // Plain text body (fallback to HTML if text is not provided)
      html,  // HTML body
    };

    try {
      const response = await sgMail.send(msg);
      console.log(`Email sent successfully: ${response[0].statusCode}`);
    } catch (error) {
      console.error('Error sending email:', error.response?.body || error);
      throw new Error('Failed to send email');
    }
  }
}
