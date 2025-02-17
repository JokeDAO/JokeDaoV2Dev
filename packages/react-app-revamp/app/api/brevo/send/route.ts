import { NextResponse } from "next/server";
import apiInstance, { isBrevoConfigured } from "@config/brevo";
import * as Brevo from "@getbrevo/brevo";

export async function POST(req: Request) {
  if (!isBrevoConfigured) {
    return NextResponse.json({ error: "brevo is not configured" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { to, templateId, params } = body;

    if (!to || !templateId) {
      return NextResponse.json(
        { error: "missing required parameters: to and templateId are required" },
        { status: 400 },
      );
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.to = to;
    sendSmtpEmail.templateId = templateId;

    if (params) {
      sendSmtpEmail.params = params;
    }

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("error sending email:", error);
    return NextResponse.json({ error: error.message ?? "failed to send email" }, { status: 400 });
  }
}
