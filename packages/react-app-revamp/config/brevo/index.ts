import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_BREVO_API_KEY!);

export const isBrevoConfigured = process.env.NEXT_PUBLIC_BREVO_API_KEY !== undefined;

export default apiInstance;
