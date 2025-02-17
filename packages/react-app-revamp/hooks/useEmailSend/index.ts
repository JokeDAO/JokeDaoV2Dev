import { EmailType, EmailTypeParams, EmailTypeWithParams } from "lib/email/types";
import { sendEmail as sendEmailLib } from "lib/email";

export function useEmailSend() {
  const sendEmail = async <T extends EmailType>(
    walletAddress: string,
    emailType: T,
    params?: T extends EmailTypeWithParams ? EmailTypeParams[T] : undefined,
  ): Promise<boolean> => {
    try {
      return await sendEmailLib(walletAddress, emailType, params);
    } catch {
      return false;
    }
  };

  return { sendEmail };
}
