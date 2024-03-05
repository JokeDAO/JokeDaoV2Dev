import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { utils } from "ethers";

interface ButtonWithdrawErc20RewardProps {
  queryTokenBalance: any;
  handleWithdraw: () => Promise<void>;
  isLoading: boolean;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { queryTokenBalance, handleWithdraw, isLoading } = props;

  if (queryTokenBalance.data.value.toString() === "") return null;

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full md:w-[650px]">
        <p>
          {queryTokenBalance?.decimals <= 18
            ? parseFloat(utils.formatEther(queryTokenBalance.data.value))
            : parseFloat(utils.formatUnits(queryTokenBalance.data.value, queryTokenBalance.data.decimals))}{" "}
          <span className="uppercase">${queryTokenBalance.data.symbol}</span>
        </p>
        <ButtonV3
          isDisabled={isLoading}
          size={ButtonSize.EXTRA_SMALL}
          colorClass="bg-gradient-withdraw"
          onClick={handleWithdraw}
        >
          Withdraw
        </ButtonV3>
      </section>
    </li>
  );
};

export default ButtonWithdraw;
