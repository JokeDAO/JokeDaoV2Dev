import { useDistributeRewards } from "@hooks/useDistributeRewards";
import Reward from "../Reward";

interface PayeeERC20RewardProps {
  payee: number;
  tokenAddress: string;
  share: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  showPreviouslyDistributed?: boolean;
}

export const PayeeERC20Reward = (props: PayeeERC20RewardProps) => {
  const {
    payee,
    tokenAddress,
    share,
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    showPreviouslyDistributed,
  } = props;
  const {
    queryTokenBalance,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    contractWriteReleaseToken,
    txRelease,
  } = useDistributeRewards(
    Number(payee),
    Number(share),
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    "erc20",
    tokenAddress,
  );

  return (
    <Reward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      queryRankRewardsReleased={queryRankRewardsReleased}
      contractWriteRelease={contractWriteReleaseToken}
      showPreviouslyDistributed={showPreviouslyDistributed}
      txRelease={txRelease}
    />
  );
};

export default PayeeERC20Reward;
