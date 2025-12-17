import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

async function getEmailTransporter() {
  // Check if SMTP is configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Email for testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    const transporter = await getEmailTransporter();
    const storeEmail = process.env.STORE_EMAIL || 'orders@goldenbarrelwhiskey.com';
    const isEthereal = !process.env.SMTP_HOST;

    // Test customer email
    const customerMailOptions = {
      from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
      to: testEmail,
      subject: 'Test Order Confirmation - Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #111827; margin-bottom: 20px;">✅ Email Test - Order Confirmation</h1>
            <p style="color: #374151; line-height: 1.6;">This is a test email to verify your SMTP configuration is working correctly.</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Order ID:</strong> GBW-TEST-${Date.now()}</p>
              <p style="margin: 8px 0;"><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong>SMTP Status:</strong> ${isEthereal ? 'Using Ethereal Email (Test Mode)' : 'Using Configured SMTP'}</p>
            </div>
            <p style="color: #374151; line-height: 1.6; margin-top: 20px;">
              If you received this email, your email configuration is working correctly! 🎉
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Email Test - Order Confirmation\n\nThis is a test email to verify your SMTP configuration is working correctly.\nOrder ID: GBW-TEST-${Date.now()}\nTest Date: ${new Date().toLocaleString()}\n\nIf you received this email, your email configuration is working! ✅`,
    };

    const customerInfo = await transporter.sendMail(customerMailOptions);
    let customerPreviewUrl = null;
    
    if (isEthereal && customerInfo.messageId) {
      customerPreviewUrl = nodemailer.getTestMessageUrl(customerInfo);
    }

    // Test store email
    const storeMailOptions = {
      from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
      to: storeEmail,
      subject: 'Test - New Order Received - Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #111827; margin-bottom: 20px;">✅ Email Test - New Order Notification</h1>
            <p style="color: #374151; line-height: 1.6;">This is a test email to verify your SMTP configuration is working correctly.</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Order ID:</strong> GBW-TEST-${Date.now()}</p>
              <p style="margin: 8px 0;"><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong>SMTP Status:</strong> ${isEthereal ? 'Using Ethereal Email (Test Mode)' : 'Using Configured SMTP'}</p>
            </div>
            <p style="color: #374151; line-height: 1.6; margin-top: 20px;">
              If you received this email, your email configuration is working correctly! 🎉
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Email Test - New Order Notification\n\nThis is a test email to verify your SMTP configuration is working correctly.\nOrder ID: GBW-TEST-${Date.now()}\nTest Date: ${new Date().toLocaleString()}\n\nIf you received this email, your email configuration is working! ✅`,
    };

    const storeInfo = await transporter.sendMail(storeMailOptions);
    let storePreviewUrl = null;
    
    if (isEthereal && storeInfo.messageId) {
      storePreviewUrl = nodemailer.getTestMessageUrl(storeInfo);
    }

    return NextResponse.json({
      success: true,
      message: 'Test emails sent successfully',
      customer: {
        email: testEmail,
        messageId: customerInfo.messageId,
        previewUrl: customerPreviewUrl,
      },
      store: {
        email: storeEmail,
        messageId: storeInfo.messageId,
        previewUrl: storePreviewUrl,
      },
      smtpConfigured: !isEthereal,
      note: isEthereal 
        ? 'Using Ethereal Email for testing. Check preview URLs to view emails.'
        : 'Using configured SMTP. Check your inbox for the test emails.',
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: 'POST to /api/test-email with { "testEmail": "your-email@example.com" }',
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  });
}


