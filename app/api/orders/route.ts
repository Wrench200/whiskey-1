import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Generate a unique order ID
function generateOrderId(): string {
  return `GBW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Email configuration - using environment variables
const getEmailTransporter = async () => {
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

  // Option 2: Ethereal Email for development/testing (creates test account automatically)
  // This will actually send emails to a test inbox at https://ethereal.email
  if (process.env.NODE_ENV !== 'production') {
    try {
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
      console.log('📧 Using Ethereal Email for testing:');
      console.log(`   Test account: ${testAccount.user}`);
      console.log(`   View emails at: https://ethereal.email`);
      return transporter;
    } catch (error) {
      console.error('⚠️  Failed to create Ethereal Email account:', error);
      console.warn('⚠️  SMTP not configured. Emails will be logged to console only.');
      return null;
    }
  }

  // Option 3: For production without SMTP, log emails to console
  // In production, you should always configure SMTP
  console.warn('⚠️  SMTP not configured. Emails will be logged to console only.');
  return null;
};

// Get base URL for images (needs to be absolute for emails)
// Set NEXT_PUBLIC_SITE_URL or SITE_URL in your .env.local file
// Example: NEXT_PUBLIC_SITE_URL=https://yourdomain.com
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
}

// Get absolute image URL
function getImageUrl(imagePath: string | null): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = getBaseUrl();
  // Remove leading slash if present and add it properly
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
}

// Customer confirmation email template
function getCustomerEmailTemplate(orderData: any, orderId: string) {
  const logoUrl = getImageUrl('/Logo.png');
  const baseUrl = getBaseUrl();
  
  const itemsList = orderData.items.map((item: any) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const optionsPrice = item.selectedOptions
      ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
        (item.selectedOptions.engraving ? 15.99 : 0) +
        (item.selectedOptions.insurance ? 2.99 : 0) +
        (item.selectedOptions.expressShipping ? 9.99 : 0)
      : 0;
    const totalItemPrice = (itemPrice + optionsPrice) * item.quantity;
    const itemImageUrl = getImageUrl(item.imageUrl);

    const optionsList = item.selectedOptions ? [
      item.selectedOptions.giftWrapping ? 'Gift Wrapping' : null,
      item.selectedOptions.giftMessage ? `Gift Message: "${item.selectedOptions.giftMessage}"` : null,
      item.selectedOptions.engraving ? 'Custom Engraving' : null,
      item.selectedOptions.insurance ? 'Shipping Insurance' : null,
      item.selectedOptions.expressShipping ? 'Express Shipping' : null,
    ].filter(Boolean) : [];

    return `
      <tr>
        <td style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="width: 100px; padding-right: 15px; vertical-align: top;">
                ${itemImageUrl ? `
                  <img src="${itemImageUrl}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: contain; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;" />
                ` : `
                  <div style="width: 100px; height: 100px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">No Image</div>
                `}
              </td>
              <td style="vertical-align: top;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${item.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${item.brand}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
                  <strong>Quantity:</strong> ${item.quantity}
                </p>
                ${optionsList.length > 0 ? `
                  <div style="margin-top: 8px; padding: 8px; background-color: #f9fafb; border-radius: 4px;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 500;">Options:</p>
                    <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12px; color: #374151;">
                      ${optionsList.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </td>
              <td style="vertical-align: top; text-align: right; padding-left: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
                  $${totalItemPrice.toFixed(2)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6; color: #374151;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header with Logo -->
              <tr>
                <td style="background-color: #111827; padding: 30px 40px; text-align: center;">
                  ${logoUrl ? `
                    <img src="${logoUrl}" alt="Golden Barrel Whiskey" style="max-width: 200px; height: auto;" />
                  ` : `
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Golden Barrel Whiskey</h1>
                  `}
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #111827;">Order Confirmation</h2>
                  <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
                    Thank you for your order, <strong>${orderData.firstName}</strong>!
                  </p>
                  <p style="margin: 0 0 32px 0; font-size: 16px; color: #374151;">
                    Your order has been received and is being processed. We'll send you another email when your order ships.
                  </p>
                  
                  <!-- Order Info Card -->
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #6b7280; font-size: 14px; display: inline-block; width: 120px;">Order ID:</strong>
                          <span style="color: #111827; font-size: 14px; font-weight: 600;">${orderId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #6b7280; font-size: 14px; display: inline-block; width: 120px;">Order Date:</strong>
                          <span style="color: #111827; font-size: 14px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Shipping Address -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">Shipping Address</h3>
                    <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.8;">
                      ${orderData.firstName} ${orderData.lastName}<br>
                      ${orderData.address}<br>
                      ${orderData.city}, ${orderData.state} ${orderData.zipCode}<br>
                      ${orderData.country}
                    </p>
                  </div>
                  
                  <!-- Contact Info -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">Contact Information</h3>
                    <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.8;">
                      <strong>Email:</strong> ${orderData.email}<br>
                      <strong>Phone:</strong> ${orderData.phone}
                    </p>
                  </div>
                  
                  <!-- Order Items -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #111827;">Order Items</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      ${itemsList}
                      <tr>
                        <td colspan="3" style="padding: 24px; background-color: #111827; border-top: 2px solid #111827;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 0;">
                                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">Total</p>
                              </td>
                              <td style="padding: 0; text-align: right;">
                                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">$${orderData.total}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Footer Message -->
                  <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                      If you have any questions about your order, please don't hesitate to contact us.
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      <a href="mailto:info@goldenbarrelwhiskey.com" style="color: #111827; text-decoration: none; font-weight: 600;">info@goldenbarrelwhiskey.com</a>
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    © 2025 Golden Barrel Whiskey. All rights reserved.
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
                    <a href="${baseUrl}" style="color: #6b7280; text-decoration: none;">Visit our website</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Store notification email template
function getStoreEmailTemplate(orderData: any, orderId: string) {
  const logoUrl = getImageUrl('/Logo.png');
  const baseUrl = getBaseUrl();
  
  const itemsList = orderData.items.map((item: any) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const optionsPrice = item.selectedOptions
      ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
        (item.selectedOptions.engraving ? 15.99 : 0) +
        (item.selectedOptions.insurance ? 2.99 : 0) +
        (item.selectedOptions.expressShipping ? 9.99 : 0)
      : 0;
    const totalItemPrice = (itemPrice + optionsPrice) * item.quantity;
    const itemImageUrl = getImageUrl(item.imageUrl);

    const optionsList = item.selectedOptions ? [
      item.selectedOptions.giftWrapping ? 'Gift Wrapping (+$5.99)' : null,
      item.selectedOptions.giftMessage ? `Gift Message: "${item.selectedOptions.giftMessage}"` : null,
      item.selectedOptions.engraving ? 'Custom Engraving (+$15.99)' : null,
      item.selectedOptions.insurance ? 'Shipping Insurance (+$2.99)' : null,
      item.selectedOptions.expressShipping ? 'Express Shipping (+$9.99)' : null,
    ].filter(Boolean) : [];

    return `
      <tr>
        <td style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="width: 100px; padding-right: 15px; vertical-align: top;">
                ${itemImageUrl ? `
                  <img src="${itemImageUrl}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: contain; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;" />
                ` : `
                  <div style="width: 100px; height: 100px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">No Image</div>
                `}
              </td>
              <td style="vertical-align: top;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${item.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${item.brand}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
                  <strong>Quantity:</strong> ${item.quantity}
                </p>
                ${optionsList.length > 0 ? `
                  <div style="margin-top: 8px; padding: 8px; background-color: #fef3c7; border-radius: 4px; border-left: 3px solid #f59e0b;">
                    <p style="margin: 0; font-size: 12px; color: #92400e; font-weight: 500;">Options:</p>
                    <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12px; color: #78350f;">
                      ${optionsList.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </td>
              <td style="vertical-align: top; text-align: right; padding-left: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
                  $${totalItemPrice.toFixed(2)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6; color: #374151;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 30px 40px; text-align: center;">
                  ${logoUrl ? `
                    <img src="${logoUrl}" alt="Golden Barrel Whiskey" style="max-width: 200px; height: auto;" />
                  ` : `
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Golden Barrel Whiskey</h1>
                  `}
                  <h2 style="margin: 20px 0 0 0; color: #fbbf24; font-size: 20px; font-weight: 600;">NEW ORDER RECEIVED</h2>
                </td>
              </tr>
              
              <!-- Alert Badge -->
              <tr>
                <td style="background-color: #fef3c7; padding: 16px 40px; border-bottom: 2px solid #f59e0b;">
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #92400e; text-align: center;">
                    🎉 Order #${orderId} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Customer Information -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">Customer Information</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #6b7280; font-size: 14px; display: inline-block; width: 100px;">Name:</strong>
                          <span style="color: #111827; font-size: 16px; font-weight: 500;">${orderData.firstName} ${orderData.lastName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #6b7280; font-size: 14px; display: inline-block; width: 100px;">Email:</strong>
                          <a href="mailto:${orderData.email}" style="color: #111827; font-size: 16px; text-decoration: none; font-weight: 500;">${orderData.email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #6b7280; font-size: 14px; display: inline-block; width: 100px;">Phone:</strong>
                          <a href="tel:${orderData.phone}" style="color: #111827; font-size: 16px; text-decoration: none; font-weight: 500;">${orderData.phone}</a>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Shipping Address -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">Shipping Address</h3>
                    <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.8;">
                      ${orderData.firstName} ${orderData.lastName}<br>
                      ${orderData.address}<br>
                      ${orderData.city}, ${orderData.state} ${orderData.zipCode}<br>
                      ${orderData.country}
                    </p>
                  </div>
                  
                  ${orderData.specialInstructions ? `
                    <!-- Special Instructions -->
                    <div style="margin-bottom: 32px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px;">
                      <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #92400e;">Special Instructions</h3>
                      <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">${orderData.specialInstructions}</p>
                    </div>
                  ` : ''}
                  
                  <!-- Order Items -->
                  <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #111827; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">Order Items</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      ${itemsList}
                      <tr>
                        <td colspan="3" style="padding: 24px; background-color: #111827; border-top: 2px solid #111827;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 0;">
                                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">Order Total</p>
                              </td>
                              <td style="padding: 0; text-align: right;">
                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #fbbf24;">$${orderData.total}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    © 2025 Golden Barrel Whiskey. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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

    // Validate minimum order amount ($250)
    const orderTotal = parseFloat(orderData.total) || 0;
    const MINIMUM_ORDER_AMOUNT = 250;
    if (orderTotal < MINIMUM_ORDER_AMOUNT) {
      return NextResponse.json(
        { 
          error: 'Minimum order amount not met',
          message: `The minimum order amount is $${MINIMUM_ORDER_AMOUNT}.00. Your current order total is $${orderTotal.toFixed(2)}.`,
          minimumAmount: MINIMUM_ORDER_AMOUNT,
          currentTotal: orderTotal
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Get email transporter (async for Ethereal Email fallback)
    const transporter = await getEmailTransporter();

    // Store email (configure this in environment variables)
    const storeEmail = process.env.STORE_EMAIL || 'orders@goldenbarrelwhiskey.com';

    // Send customer confirmation email
    if (transporter) {
      try {
        const customerMailOptions = {
          from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
          to: orderData.email,
          subject: `Order Confirmation - ${orderId}`,
          html: getCustomerEmailTemplate(orderData, orderId),
        };
        
        const customerInfo = await transporter.sendMail(customerMailOptions);
        
        // If using Ethereal Email, log the preview URL
        if (process.env.NODE_ENV !== 'production' && customerInfo.messageId) {
          const previewUrl = nodemailer.getTestMessageUrl(customerInfo);
          if (previewUrl) {
            console.log(`✅ Customer confirmation email sent to ${orderData.email}`);
            console.log(`   Preview URL: ${previewUrl}`);
          } else {
            console.log(`✅ Customer confirmation email sent to ${orderData.email}`);
          }
        } else {
          console.log(`✅ Customer confirmation email sent to ${orderData.email}`);
        }
      } catch (emailError) {
        console.error('❌ Error sending customer email:', emailError);
        // Continue even if email fails - don't fail the order
      }
    } else {
      // Log email content to console if SMTP is not configured
      console.warn('⚠️  Customer Email (SMTP not configured):');
      console.log('To:', orderData.email);
      console.log('Subject:', `Order Confirmation - ${orderId}`);
      console.log('HTML:', getCustomerEmailTemplate(orderData, orderId));
    }

    // Send store notification email
    if (transporter) {
      try {
        const storeMailOptions = {
          from: process.env.SMTP_FROM || 'Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>',
          to: storeEmail,
          subject: `New Order Received - ${orderId}`,
          html: getStoreEmailTemplate(orderData, orderId),
        };
        
        const storeInfo = await transporter.sendMail(storeMailOptions);
        
        // If using Ethereal Email, log the preview URL
        if (process.env.NODE_ENV !== 'production' && storeInfo.messageId) {
          const previewUrl = nodemailer.getTestMessageUrl(storeInfo);
          if (previewUrl) {
            console.log(`✅ Store notification email sent to ${storeEmail}`);
            console.log(`   Preview URL: ${previewUrl}`);
          } else {
            console.log(`✅ Store notification email sent to ${storeEmail}`);
          }
        } else {
          console.log(`✅ Store notification email sent to ${storeEmail}`);
        }
      } catch (emailError) {
        console.error('❌ Error sending store email:', emailError);
        // Continue even if email fails - don't fail the order
      }
    } else {
      // Log email content to console if SMTP is not configured
      console.warn('⚠️  Store Email (SMTP not configured):');
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

