import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import CreateRewardsFundingPoolSubmit from "./components/Buttons/Submit";
import CreateRewardsFundPool from "./components/FundPool";

const CreateRewardsFunding = () => {
  const { sendFundsToRewardsModuleV3 } = useFundRewardsModule();
  const { address } = useAccount();
  const { rewards, setCancel } = useFundRewardsStore(state => state);
  const deployRewardsData = useDeployRewardsStore(state => state.deployRewardsData);

  const fundPool = async () => {
    const populatedRewards =
      rewards.length > 0 &&
      rewards
        .filter(reward => reward.amount !== "")
        .map(reward => ({
          ...reward,
          currentUserAddress: address,
          tokenAddress: reward.address,
          isErc20: reward.address.startsWith("0x"),
          rewardsContractAddress: deployRewardsData.address,
          amount: ethers.utils.parseUnits(reward.amount, 18).toString(),
        }));
    await sendFundsToRewardsModuleV3({ rewards: populatedRewards });
  };

  const onCancelFundingPool = () => {
    setCancel(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <p className="text-[24px] font-bold text-primary-10">last step! let’s fund this rewards pool 💸</p>
        <div className="text-[16px] flex flex-col gap-2">
          <p>if you’re ready, let’s fund the rewards pool below.</p>
          <p>
            likewise, <span className="italic">literally anyone</span> (including you!) can always fund it later by{" "}
            <br />
            sending tokens to the address on the rewards page.
          </p>
          <p>
            just remember: <span className="font-bold">rewards must be on the same chain as the contest.</span>
          </p>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-[24px] font-bold text-primary-10">what tokens should we add?</p>
      </div>
      <div className="mt-8">
        <CreateRewardsFundPool />
      </div>
      <div className="mt-10">
        <CreateRewardsFundingPoolSubmit onClick={fundPool} onCancel={onCancelFundingPool} />
      </div>
    </div>
  );
};

export default CreateRewardsFunding;
