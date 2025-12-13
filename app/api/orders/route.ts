import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Generate a unique order ID
function generateOrderId(): string {
  return `GBW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Email configuration - using environment variables
const getEmailTransporter = () => {
  // For development, you can use a service like Ethereal Email or configure SMTP
  // For production, use a service like SendGrid, Mailgun, or AWS SES
  
  // Option 1: Gmail SMTP (requires app password)
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

  // Option 2: For testing without SMTP, log emails to console
  // In production, you should always configure SMTP
  console.warn('⚠️  SMTP not configured. Emails will be logged to console only.');
  return null;
};

// Customer confirmation email template
function getCustomerEmailTemplate(orderData: any, orderId: string) {
  const itemsList = orderData.items.map((item: any) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const optionsPrice = item.selectedOptions
      ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
        (item.selectedOptions.engraving ? 15.99 : 0) +
        (item.selectedOptions.insurance ? 2.99 : 0) +
        (item.selectedOptions.expressShipping ? 9.99 : 0)
      : 0;
    const totalItemPrice = (itemPrice + optionsPrice) * item.quantity;

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <small>${item.brand} - Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${totalItemPrice.toFixed(2)}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Golden Barrel Whiskey</h1>
        </div>
        <div class="content">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order, ${orderData.firstName}!</p>
          <p>Your order has been received and is being processed.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h4>Shipping Address:</h4>
            <p>
              ${orderData.firstName} ${orderData.lastName}<br>
              ${orderData.address}<br>
              ${orderData.city}, ${orderData.state} ${orderData.zipCode}<br>
              ${orderData.country}
            </p>
            
            <h4>Contact Information:</h4>
            <p>
              Email: ${orderData.email}<br>
              Phone: ${orderData.phone}
            </p>
            
            <h4>Order Items:</h4>
            <table>
              ${itemsList}
              <tr>
                <td style="padding: 10px; border-top: 2px solid #333; font-weight: bold;">Total</td>
                <td style="padding: 10px; border-top: 2px solid #333; text-align: right; font-weight: bold;">
                  $${orderData.total}
                </td>
              </tr>
            </table>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>If you have any questions, please contact us at info@goldenbarrelwhiskey.com</p>
        </div>
        <div class="footer">
          <p>© 2025 Golden Barrel Whiskey. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Store notification email template
function getStoreEmailTemplate(orderData: any, orderId: string) {
  const itemsList = orderData.items.map((item: any) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const optionsPrice = item.selectedOptions
      ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
        (item.selectedOptions.engraving ? 15.99 : 0) +
        (item.selectedOptions.insurance ? 2.99 : 0) +
        (item.selectedOptions.expressShipping ? 9.99 : 0)
      : 0;
    const totalItemPrice = (itemPrice + optionsPrice) * item.quantity;

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <small>${item.brand} - Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${totalItemPrice.toFixed(2)}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received</h1>
        </div>
        <div class="content">
          <h2>Order #${orderId}</h2>
          
          <div class="order-details">
            <h3>Customer Information</h3>
            <p>
              <strong>Name:</strong> ${orderData.firstName} ${orderData.lastName}<br>
              <strong>Email:</strong> ${orderData.email}<br>
              <strong>Phone:</strong> ${orderData.phone}
            </p>
            
            <h3>Shipping Address</h3>
            <p>
              ${orderData.address}<br>
              ${orderData.city}, ${orderData.state} ${orderData.zipCode}<br>
              ${orderData.country}
            </p>
            
            ${orderData.specialInstructions ? `
              <h3>Special Instructions</h3>
              <p>${orderData.specialInstructions}</p>
            ` : ''}
            
            <h3>Order Items</h3>
            <table>
              ${itemsList}
              <tr>
                <td style="padding: 10px; border-top: 2px solid #333; font-weight: bold;">Total</td>
                <td style="padding: 10px; border-top: 2px solid #333; text-align: right; font-weight: bold;">
                  $${orderData.total}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.email || !orderData.phone || !orderData.firstName || !orderData.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Get email transporter
    const transporter = getEmailTransporter();

    // Store email (configure this in environment variables)
    const storeEmail = process.env.STORE_EMAIL || 'orders@goldenbarrelwhiskey.com';

    // Send customer confirmation email
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
          to: orderData.email,
          subject: `Order Confirmation - ${orderId}`,
          html: getCustomerEmailTemplate(orderData, orderId),
        });
        console.log(`✅ Customer confirmation email sent to ${orderData.email}`);
      } catch (emailError) {
        console.error('Error sending customer email:', emailError);
        // Continue even if email fails - don't fail the order
      }
    } else {
      // Log email content to console if SMTP is not configured
      console.log('📧 Customer Email (SMTP not configured):');
      console.log('To:', orderData.email);
      console.log('Subject:', `Order Confirmation - ${orderId}`);
      console.log('HTML:', getCustomerEmailTemplate(orderData, orderId));
    }

    // Send store notification email
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
          to: storeEmail,
          subject: `New Order Received - ${orderId}`,
          html: getStoreEmailTemplate(orderData, orderId),
        });
        console.log(`✅ Store notification email sent to ${storeEmail}`);
      } catch (emailError) {
        console.error('Error sending store email:', emailError);
        // Continue even if email fails - don't fail the order
      }
    } else {
      // Log email content to console if SMTP is not configured
      console.log('📧 Store Email (SMTP not configured):');
      console.log('To:', storeEmail);
      console.log('Subject:', `New Order Received - ${orderId}`);
      console.log('HTML:', getStoreEmailTemplate(orderData, orderId));
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Failed to process order', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

