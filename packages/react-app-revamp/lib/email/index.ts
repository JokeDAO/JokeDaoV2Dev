import { EmailType, EmailTypeParams, EmailTypeWithParams } from "./types";

async function getEmailFromWalletAddress(walletAddress: string): Promise<string | null> {
  const config = await import("@config/supabase");
  const supabase = config.supabase;

  if (!supabase) {
    throw new Error("supabase is not configured");
  }

  try {
    const { data: emailData } = await supabase
      .from("email_signups")
      .select("email_address")
      .eq("user_address", walletAddress)
      .limit(1)
      .single();

    return emailData?.email_address || null;
  } catch {
    return null;
  }
}

async function findTemplateIdByType(emailType: EmailType): Promise<string | null> {
  try {
    const templatesResponse = await fetch("/api/brevo/get-templates");
    const templatesData = await templatesResponse.json();

    if (!templatesData.success) {
      return null;
    }

    const templates = templatesData.templates;

    if (!templates || !Array.isArray(templates)) {
      return null;
    }

    const template = templates.find((t: { id: number }) => t.id === emailType);

    return template?.id || null;
  } catch (error) {
    console.log("error finding template:", error);
    return null;
  }
}

export async function sendEmail<T extends EmailType>(
  walletAddress: string,
  emailType: T,
  params?: T extends EmailTypeWithParams ? EmailTypeParams[T] : undefined,
): Promise<boolean> {
  try {
    const recipientEmail = await getEmailFromWalletAddress(walletAddress);
    if (!recipientEmail) {
      return false;
    }

    const templateId = await findTemplateIdByType(emailType);
    if (!templateId) {
      return false;
    }

    const response = await fetch("/api/brevo/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [{ email: recipientEmail }],
        templateId,
        ...(params && { params }),
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.log(`failed to send email: ${data.error}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(`error in email sending process:`, error);
    return false;
  }
}
