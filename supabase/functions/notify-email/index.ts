import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) return new Response('No record found', { status: 400 });

    const { user_id, type, amount, currency, recipient_name, recipient_account, reason, created_at } = record;

    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: { user }, error } = await supabase.auth.admin.getUserById(user_id);

    if (error || !user?.email) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const isDebit = type === 'debit';
    const formattedAmount = `${currency} ${Number(amount).toLocaleString()}`;
    const formattedDate = new Date(created_at).toLocaleString('en-KE', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Her&Him Bank</h1>
      <p style="margin:8px 0 0;color:#bbf7d0;font-size:14px;">Transaction Notification</p>
    </div>

    <!-- Amount Block -->
    <div style="background:${isDebit ? '#fef2f2' : '#f0fdf4'};padding:32px 40px;text-align:center;border-bottom:1px solid ${isDebit ? '#fecaca' : '#bbf7d0'};">
      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">${isDebit ? 'Amount Sent' : 'Amount Received'}</p>
      <h2 style="margin:0;font-size:40px;font-weight:800;color:${isDebit ? '#dc2626' : '#16a34a'};">${formattedAmount}</h2>
      <span style="display:inline-block;margin-top:12px;padding:4px 16px;background:${isDebit ? '#dc2626' : '#16a34a'};color:white;border-radius:999px;font-size:12px;font-weight:600;">
        ${isDebit ? ' SENT' : ' RECEIVED'}
      </span>
    </div>

    <!-- Details -->
    <div style="padding:32px 40px;">
      <h3 style="margin:0 0 20px;font-size:16px;color:#111827;">Transaction Details</h3>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">${isDebit ? 'Recipient' : 'Sender'}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:600;text-align:right;">${recipient_name}</td>
        </tr>
        ${recipient_account ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">Account</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:600;text-align:right;">${recipient_account}</td>
        </tr>` : ''}
        ${reason ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">Reason</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;font-weight:600;text-align:right;">${reason}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:12px 0;color:#6b7280;font-size:14px;">Date & Time</td>
          <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">If you did not make this transaction, please contact support immediately.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">© 2026 Her&Him Bank. All rights reserved.</p>
    </div>

  </div>
</body>
</html>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Her&Him Bank <onboarding@resend.dev>',
        to: [user.email],
        subject: isDebit
          ? ` You sent ${formattedAmount} to ${recipient_name}`
          : ` You received ${formattedAmount} from ${recipient_name}`,
        html: emailHtml
      })
    });

    const result = await emailRes.json();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});