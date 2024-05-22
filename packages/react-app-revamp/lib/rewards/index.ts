import { isSupabaseConfigured } from "@helpers/database";

export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

export const getNetBalances = async (rewardsModuleAddress: string): Promise<RewardToken[]> => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: fundings, error: fundingError } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address, amount_paid_in, amount_paid_out")
      .eq("rewards_module_address", rewardsModuleAddress);

    if (fundingError) {
      throw new Error(fundingError.message);
    }

    const balances = fundings.reduce(
      (acc, transaction) => {
        const tokenAddress = transaction.token_address;
        if (tokenAddress) {
          if (!acc[tokenAddress]) {
            acc[tokenAddress] = { tokenAddress, balance: 0 };
          }
          if (transaction.amount_paid_in) {
            acc[tokenAddress].balance += transaction.amount_paid_in;
          }
          if (transaction.amount_paid_out) {
            acc[tokenAddress].balance -= transaction.amount_paid_out;
          }
        }
        return acc;
      },
      {} as { [key: string]: RewardToken },
    );

    return Object.values(balances).filter(token => token.balance > 0);
  }

  return [];
};

export const getPaidBalances = async (rewardsModuleAddress: string): Promise<RewardToken[]> => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: transactions, error: transactionError } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address, amount_paid_in, amount_paid_out")
      .eq("rewards_module_address", rewardsModuleAddress);

    if (transactionError) {
      throw new Error(transactionError.message);
    }

    const balances = transactions.reduce(
      (acc, transaction) => {
        const tokenAddress = transaction.token_address;
        if (tokenAddress) {
          if (!acc[tokenAddress]) {
            acc[tokenAddress] = { tokenAddress, balance: 0 };
          }
          if (transaction.amount_paid_out) {
            acc[tokenAddress].balance += transaction.amount_paid_out;
          }
        }
        return acc;
      },
      {} as { [key: string]: RewardToken },
    );

    return Object.values(balances).filter(token => token.balance > 0);
  }

  return [];
};
