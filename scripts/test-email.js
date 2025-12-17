/**
 * Test script for email sending functionality
 * 
 * Usage:
 *   node scripts/test-email.js
 * 
 * Make sure you have your SMTP credentials in .env.local:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_SECURE=false
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password
 *   SMTP_FROM=Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>
 *   STORE_EMAIL=orders@goldenbarrelwhiskey.com
 */

// Try to load dotenv if available, otherwise assume env vars are set
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, assume env vars are set in environment
  console.log('Note: dotenv not found. Make sure environment variables are set.');
}

const nodemailer = require('nodemailer');

async function getEmailTransporter() {
  // Check if SMTP is configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('📧 Using configured SMTP settings:');
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
    console.log(`   User: ${process.env.SMTP_USER}`);
    console.log(`   From: ${process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>'}`);
    console.log('');
    
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
  console.log('⚠️  SMTP not configured, using Ethereal Email for testing...');
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log(`   Test account: ${testAccount.user}`);
  console.log(`   View emails at: https://ethereal.email`);
  console.log('');
  return transporter;
}

async function testEmailSending() {
  try {
    console.log('🧪 Testing email sending functionality...\n');
    
    const transporter = await getEmailTransporter();
    
    // Test customer email
    const testCustomerEmail = process.env.TEST_EMAIL || 'test@example.com';
    const storeEmail = process.env.STORE_EMAIL || 'orders@goldenbarrelwhiskey.com';
    
    console.log('📤 Sending test customer confirmation email...');
    const customerMailOptions = {
      from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
      to: testCustomerEmail,
      subject: 'Test Order Confirmation - GBW-TEST-12345',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #111827;">Test Email - Order Confirmation</h1>
            <p>This is a test email to verify your SMTP configuration is working correctly.</p>
            <p><strong>Order ID:</strong> GBW-TEST-12345</p>
            <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
            <p>If you received this email, your email configuration is working! ✅</p>
          </div>
        </body>
        </html>
      `,
      text: `Test Email - Order Confirmation\n\nThis is a test email to verify your SMTP configuration is working correctly.\nOrder ID: GBW-TEST-12345\nTest Date: ${new Date().toLocaleString()}\n\nIf you received this email, your email configuration is working! ✅`,
    };
    
    const customerInfo = await transporter.sendMail(customerMailOptions);
    
    // Check if using Ethereal Email
    if (customerInfo.messageId && customerInfo.messageId.includes('ethereal')) {
      const previewUrl = nodemailer.getTestMessageUrl(customerInfo);
      console.log('✅ Customer test email sent!');
      console.log(`   Preview URL: ${previewUrl}`);
    } else {
      console.log(`✅ Customer test email sent to: ${testCustomerEmail}`);
      console.log(`   Message ID: ${customerInfo.messageId}`);
    }
    
    console.log('');
    
    // Test store email
    console.log('📤 Sending test store notification email...');
    const storeMailOptions = {
      from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
      to: storeEmail,
      subject: 'Test - New Order Received - GBW-TEST-12345',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #111827;">Test Email - New Order Notification</h1>
            <p>This is a test email to verify your SMTP configuration is working correctly.</p>
            <p><strong>Order ID:</strong> GBW-TEST-12345</p>
            <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
            <p>If you received this email, your email configuration is working! ✅</p>
          </div>
        </body>
        </html>
      `,
      text: `Test Email - New Order Notification\n\nThis is a test email to verify your SMTP configuration is working correctly.\nOrder ID: GBW-TEST-12345\nTest Date: ${new Date().toLocaleString()}\n\nIf you received this email, your email configuration is working! ✅`,
    };
    
    const storeInfo = await transporter.sendMail(storeMailOptions);
    
    // Check if using Ethereal Email
    if (storeInfo.messageId && storeInfo.messageId.includes('ethereal')) {
      const previewUrl = nodemailer.getTestMessageUrl(storeInfo);
      console.log('✅ Store test email sent!');
      console.log(`   Preview URL: ${previewUrl}`);
    } else {
      console.log(`✅ Store test email sent to: ${storeEmail}`);
      console.log(`   Message ID: ${storeInfo.messageId}`);
    }
    
    console.log('');
    console.log('🎉 Email test completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check your inbox (and spam folder) for the test emails');
    console.log('2. If using Ethereal Email, visit the preview URLs above');
    console.log('3. If emails are not received, check your SMTP credentials');
    
  } catch (error) {
    console.error('❌ Error testing email:', error);
    console.error('');
    console.error('Common issues:');
    console.error('1. SMTP credentials not configured in .env.local');
    console.error('2. Incorrect SMTP host, port, or credentials');
    console.error('3. Gmail requires an "App Password" instead of regular password');
    console.error('4. Firewall or network blocking SMTP connections');
    process.exit(1);
  }
}

// Run the test
testEmailSending();

