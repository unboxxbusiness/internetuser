"use client";

import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Payment } from "@/lib/types";
import { AppUser } from "@/app/auth/actions";

export function DownloadInvoiceButton({ payment, user }: { payment: Payment, user: AppUser }) {

  const handleDownload = () => {
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${payment.id}</title>
          <style>
            body { font-family: sans-serif; margin: 0; padding: 2rem; background-color: #f8f9fa; color: #212529; }
            .container { max-width: 800px; margin: auto; background-color: #ffffff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h1 { color: #0d6efd; border-bottom: 2px solid #dee2e6; padding-bottom: 1rem; margin-bottom: 2rem; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
            .header div { display: flex; flex-direction: column; }
            .header span { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
            th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #dee2e6; }
            th { background-color: #e9ecef; }
            .total { text-align: right; font-size: 1.25rem; font-weight: bold; margin-top: 2rem; }
            .footer { margin-top: 3rem; text-align: center; font-size: 0.8rem; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice</h1>
            <div class="header">
              <div>
                <span>Billed To:</span>
                ${user.name}<br>
                ${user.email}
              </div>
              <div>
                <span>Invoice ID:</span> ${payment.id.substring(0,8)}...<br>
                <span>Date:</span> ${new Date(payment.date).toLocaleDateString()}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subscription: ${payment.plan}</td>
                  <td>$${payment.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">
              Total: $${payment.amount.toFixed(2)}
            </div>
            <div class="footer">
              Thank you for your business!
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${payment.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download Invoice
    </Button>
  );
}
