import { useDistributeRewardStore, useDistributeRewards } from "@hooks/useDistributeRewards";
import Reward from "../Reward";

interface PayeeNativeRewardProps {
  payee: number;
  share: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  showPreviouslyDistributed?: boolean;
}

export const PayeeNativeReward = (props: PayeeNativeRewardProps) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule, chainId, showPreviouslyDistributed } = props;
  const { queryTokenBalance, handleDistributeRewards } = useDistributeRewards(
    Number(payee),
    Number(share),
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    "native",
  );

  const {
    isDistributeRewardsLoading,
    isReleasableRewardsLoading,
    isReleasedRewardsLoading,
    releasableRewards,
    releasedRewards,
  } = useDistributeRewardStore(state => state);

  return (
    <Reward
      queryTokenBalance={queryTokenBalance}
      rewardsReleasable={releasableRewards}
      rewardsReleased={releasedRewards}
      showPreviouslyDistributed={showPreviouslyDistributed}
      handleDistributeRewards={handleDistributeRewards}
      isReleasableRewardsLoading={isReleasableRewardsLoading}
      isDistributeRewardsLoading={isDistributeRewardsLoading}
      isReleasedRewardsLoading={isReleasedRewardsLoading}
    />
  );
};
