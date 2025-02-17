import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";
import { useEmailSend } from "@hooks/useEmailSend";
import { EmailType } from "lib/email/types";
import moment from "moment";
import { useState } from "react";

const useEmailSignup = () => {
  const [isLoading, setLoading] = useState(false);
  const { sendEmail } = useEmailSend();

  const subscribeUser = async (
    email_address: string,
    user_address: string | null = null,
    showToasts: boolean = true,
  ) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      showToasts && toastLoading("Subscribing...");
      try {
        const { error } = await supabase.from("email_signups").insert([
          {
            email_address,
            user_address,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        ]);

        await sendEmail(user_address ?? "", EmailType.SignUpConfirmation);
        setLoading(false);
        if (error) {
          showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
          return;
        }
        showToasts && toastSuccess("You have been subscribed successfully.");
      } catch (error: any) {
        setLoading(false);
        showToasts && toastError("There was an error while subscribing. Please try again later.", error.message);
      }
    }
  };

  const checkIfEmailExists = async (emailAddress: string, displayToasts: boolean = true) => {
    if (isSupabaseConfigured) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("email_signups")
          .select("email_address")
          .eq("email_address", emailAddress);
        setLoading(false);
        if (error) {
          displayToasts && toastError("There was an error while checking. Please try again later.", error.message);
          return false;
        }
        if (data?.length) {
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        setLoading(false);
        displayToasts && toastError("There was an error while checking. Please try again later.", error.message);
        return false;
      }
    }
  };

  return { subscribeUser, checkIfEmailExists, isLoading };
};

export default useEmailSignup;
