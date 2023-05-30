import Button from "@components/UI/Button";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { copyToClipboard } from "@helpers/copyToClipboard";
import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/localStorage";
import { isObjectEmpty } from "@helpers/object";
import { DuplicateIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import shallow from "zustand/shallow";
import { DialogModalDeployTransaction } from "../DialogModalDeployTransaction";
import { useStore } from "../store";
import Form from "./Form";
import { schema } from "./schema";
import { useDeployToken } from "./useDeployToken";

export const Step2 = () => {
  const { tokenDeployedToChain, setCurrentStep, dataDeployVotingToken, modalDeployTokenOpen, setModalDeployTokenOpen } =
    useStore(
      state => ({
        //@ts-ignore
        setCurrentStep: state.setCurrentStep,
        //@ts-ignore
        dataDeployVotingToken: state.dataDeployVotingToken,
        //@ts-ignore
        modalDeployTokenOpen: state.modalDeployTokenOpen,
        //@ts-ignore
        setModalDeployTokenOpen: state.setModalDeployTokenOpen,
        //@ts-ignore
        tokenDeployedToChain: state.tokenDeployedToChain,
      }),
      shallow,
    );
  const form = useForm({
    extend: validator({ schema }),
    onSubmit: values => {
      handleSubmitForm(values, false);
    },
  });
  const { handleSubmitForm, stateContractDeployment } = useDeployToken(form);
  const { isConnected } = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  const saveInputValues = () => {
    saveToLocalStorage("form-step-2", form.data());
  };

  useEffect(() => {
    const cachedInputs = loadFromLocalStorage("form-step-2");

    form.setFields(cachedInputs);
  }, []);

  useEffect(() => {
    // In case of resetting, we do not initalize localStorage again.
    if (isObjectEmpty(form.data())) return;

    saveInputValues();
  }, [form.data()]);

  return (
    <>
      <div className="tracking-wide pb-8">
        <h2 className="sr-only">Step 2: Mint a token</h2>
        <p className="font-bold text-lg mb-3">Let’s start by minting a token your community will use to vote.</p>
        <p className="text-neutral-11 text-xs">
          Tokens minted on other platforms <span className="font-bold">aren’t compatible with jokerace</span>. <br />{" "}
          Skip this step only if you want to re-use a token already minted on jokerace.
        </p>
      </div>
      <Form showSkipButton={true} isDeploying={stateContractDeployment.isLoading} {...form} />
      <DialogModalDeployTransaction
        isOpen={modalDeployTokenOpen}
        setIsOpen={setModalDeployTokenOpen}
        title="Token deployment transaction"
        isLoading={stateContractDeployment.isLoading}
        isSuccess={stateContractDeployment.isSuccess}
        error={stateContractDeployment.error}
        transactionHref={`${tokenDeployedToChain?.blockExplorers?.default?.url}/tx/${dataDeployVotingToken?.hash}`}
      >
        {stateContractDeployment.isSuccess && (
          <>
            <div className="mt-3 animate-appear relative">
              <span className="font-bold">Token address:</span>
              <div className="relative focus-within:text-opacity-50 hover:text-opacity-75">
                <button
                  onClick={() => copyToClipboard(dataDeployVotingToken?.address, "Token address copied !")}
                  title="Copy address"
                  className="w-full absolute z-10 inset-0 opacity-0"
                >
                  Copy address
                </button>
                <p className="pie-6 text-opacity-[inherit] text-neutral-12 font-mono overflow-hidden text-ellipsis">
                  {dataDeployVotingToken?.address}
                </p>
                <DuplicateIcon className="absolute w-5 top-1/2 inline-end-0 -translate-y-1/2" />
              </div>
            </div>
            <div className="pt-6 flex flex-col space-y-3 xs:flex-row xs:space-y-0 xs:space-i-3">
              <Button
                className="w-full py-1 xs:min-w-fit-content xs:w-auto"
                onClick={() => setCurrentStep(3)}
                disabled={!stateContractDeployment.isSuccess}
                intent="neutral-outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </DialogModalDeployTransaction>
    </>
  );
};

export default Step2;
