import { AuctionMailParameters, MailOptions } from "@/types/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const user = process.env.EMAIL;
const pass = process.env.PASSWORD;
const domain = process.env.NEXT_PUBLIC_URL;

if (!user || !pass || !domain) {
  throw new Error("Missing required environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
});

export async function POST(request: Request) {
  try {
    const {
      auctionListerName,
      auctionListerEmail,
      bidderName,
      bidderEmail,
      itemId,
      itemName,
      bidAmount,
      expiresOn,
    }: AuctionMailParameters = await request.json();

    console.log("Sending bid notification...");

    // Email for Bidder
    const bidderMailOptions: MailOptions = {
      from: "noreply@bidxpert.com",
      to: bidderEmail,
      subject: "✅ Bid Placed Successfully | BidXpert",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border-radius: 8px 8px 0 0;
              }
              .content {
                margin-top: 20px;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                color: #888;
                font-size: 0.9em;
              }
              .button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                display: inline-block;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Bid Placed Successfully</h2>
                <p>Thank you for using BidXpert, ${bidderName}!</p>
              </div>
              <div class="content">
                <p>Hello ${bidderName},</p>
                <p>Congratulations! You have successfully placed a bid on the item "<strong>${itemName}</strong>".</p>
                <p><strong>Auction Details:</strong></p>
                <ul>
                  <li><strong>Item Name:</strong> ${itemName}</li>
                  <li><strong>Bid Amount:</strong> ${bidAmount} USD</li>
                  <li><strong>End Date:</strong> ${expiresOn}</li>
                  <li><strong>Auction Lister:</strong> ${auctionListerName} (${auctionListerEmail})</li>
                </ul>
                <p>The auction will conclude on <strong>${expiresOn}</strong>. We wish you the best of luck!</p>
                <p>If you’d like to view the item or monitor your bid, please click the button below:</p>
                <a href="${domain}auction/${itemId}" class="button">View Auction Item</a>
              </div>
              <div class="footer">
                <p>Thank you for choosing BidXpert!</p>
                <p>&copy; ${new Date().getFullYear()} BidXpert, Inc. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>`,
      text: `Hello ${bidderName},\n\nCongratulations! You have successfully placed a bid on the item "${itemName}".\n\nAuction Details:\nItem Name: ${itemName}\nBid Amount: ${bidAmount} USD\nEnd Date: ${expiresOn}\nAuction Lister: ${auctionListerName} (${auctionListerEmail})\n\nThank you for using BidXpert!\n\n© ${new Date().getFullYear()} BidXpert, Inc. All rights reserved.`,
    };

    // Email for Lister
    const listerMailOptions: MailOptions = {
      from: "noreply@bidxpert.com",
      to: auctionListerEmail,
      subject: "✨ New Bid Received | BidXpert",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border-radius: 8px 8px 0 0;
              }
              .content {
                margin-top: 20px;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                color: #888;
                font-size: 0.9em;
              }
              .button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                display: inline-block;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Bid Received</h2>
                <p>Thank you for using BidXpert, ${auctionListerName}!</p>
              </div>
              <div class="content">
                <p>Hello ${auctionListerName},</p>
                <p>${bidderName} has placed a bid on your item "<strong>${itemName}</strong>".</p>
                <p><strong>Auction Details:</strong></p>
                <ul>
                  <li><strong>Item Name:</strong> ${itemName}</li>
                  <li><strong>Bidder Name:</strong> ${bidderName} (${bidderEmail})</li>
                  <li><strong>Bid Amount:</strong> ${bidAmount} USD</li>
                  <li><strong>Auction End Date:</strong> ${expiresOn}</li>
                </ul>
                <p>You can keep track of bids or view details by clicking the button below:</p>
                <a href="${domain}auction/${itemId}" class="button">View Auction Details</a>
              </div>
              <div class="footer">
                <p>Thank you for using BidXpert!</p>
                <p>&copy; ${new Date().getFullYear()} BidXpert, Inc. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>`,
      text: `Hello ${auctionListerName},\n\n${bidderName} has placed a bid on your item "${itemName}".\n\nAuction Details:\nItem Name: ${itemName}\nBidder Name: ${bidderName} (${bidderEmail})\nBid Amount: ${bidAmount} USD\nAuction End Date: ${expiresOn}\n\nThank you for using BidXpert!\n\n© ${new Date().getFullYear()} BidXpert, Inc. All rights reserved.`,
    };

    // Send emails in parallel
    const [bidderEmailResult, listerEmailResult] = await Promise.allSettled([
      transporter.sendMail(bidderMailOptions),
      transporter.sendMail(listerMailOptions),
    ]);

    if (bidderEmailResult.status === "rejected")
      console.error("Error sending bidder email:", bidderEmailResult.reason);

    if (listerEmailResult.status === "rejected")
      console.error("Error sending lister email:", listerEmailResult.reason);

    console.log("Emails sent successfully");

    return NextResponse.json(
      { message: "Bid notifications processed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: `Failed to send notification: ${error}` },
      { status: 500 }
    );
  }
}
