import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { writeContract } from "@wagmi/core";
import { ContractFactory } from "ethers";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork, useSigner } from "wagmi";
import { useDeployRewardsStore } from "./store";

export function useDeployRewardsPool() {
  const stateContestDeployment = useContractFactoryStore(state => state);
  const { ranks, shares, setDeployRewardsData, setIsLoading, setIsError, setIsSuccess, setDisplayCreatePool } =
    useDeployRewardsStore(state => state);
  const deployContestData = useDeployContestStore(state => state.deployContestData);
  const { chain } = useNetwork();
  const { refetch } = useSigner();

  async function deployRewardsPool() {
    try {
      stateContestDeployment.setIsLoading(true);
      stateContestDeployment.setIsSuccess(false);
      stateContestDeployment.setError(null);

      const signer = await refetch();
      setIsLoading(true);
      setDisplayCreatePool(false);
      const factoryCreateRewardsModule = new ContractFactory(
        RewardsModuleContract.abi,
        RewardsModuleContract.bytecode,
        //@ts-ignore
        signer.data,
      );

      // Deploy the rewards module
      const contractRewardsModule = await factoryCreateRewardsModule.deploy(
        ranks,
        shares,
        deployContestData.address,
        true,
      );

      // Toast for the first transaction
      toast.promise(contractRewardsModule.deployTransaction.wait(), {
        pending: "Creating rewards pool 1/2...",
        success: "Rewards pool created!",
        error: "Error deploying rewards pool",
      });

      // Wait for transaction to be executed
      await contractRewardsModule.deployTransaction.wait();

      const contractConfig = {
        addressOrName: deployContestData.address,
        contractInterface: DeployedContestContract.abi,
      };

      // Define the second promise for attaching the rewards module to the contest
      const txSetRewardsModule = await writeContract({
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModule.address],
      });

      // Toast for the second transaction
      toast.promise(txSetRewardsModule.wait(), {
        pending: "Attaching pool to contest 2/2",
        success: "congrats! your pool was successfully deployed!",
        error: "Error attaching pool to contest",
      });

      // Wait for the second transaction to complete
      await txSetRewardsModule.wait();

      setDeployRewardsData(contractRewardsModule.deployTransaction.hash, contractRewardsModule.address);

      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setIsSuccess(true);
      setIsSuccess(true);
    } catch (error) {
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setIsSuccess(false);
      stateContestDeployment.setError(error as CustomError);
      setIsError(true);
      setDisplayCreatePool(true);
    }
  }

  return {
    deployRewardsPool,
  };
}
