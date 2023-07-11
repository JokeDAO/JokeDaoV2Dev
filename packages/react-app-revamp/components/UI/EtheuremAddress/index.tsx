/* eslint-disable @next/next/no-img-element */
import { useAvatarStore } from "@hooks/useAvatar";
import { getDefaultProfile } from "@services/lens/getDefaultProfile";
import { useQuery } from "@tanstack/react-query";
import { chain, useEnsName } from "wagmi";

const DEFAULT_AVATAR_URL = "/contest/avatar.svg"; // Default avatar url

interface EthereumAddressProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  displayLensProfile: boolean;
  textualVersion?: boolean;
}

const EthereumAddress = ({
  textualVersion,
  ethereumAddress,
  displayLensProfile,
  shortenOnFallback,
}: EthereumAddressProps) => {
  const shortAddress = `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`;
  const { avatars, setAvatar } = useAvatarStore(state => state);
  const avatarUrl = avatars[ethereumAddress] || DEFAULT_AVATAR_URL;

  const queryUserProfileLens = useQuery(
    ["lens-profile", ethereumAddress],
    async () => {
      try {
        const result = await getDefaultProfile({ ethereumAddress });
        if (result?.error) throw new Error(result?.error);
        return result?.data?.defaultProfile;
      } catch (e) {
        console.error(e);
      }
    },
    {
      enabled: displayLensProfile,
      onSuccess: data => {
        const newAvatarUrl =
          data?.picture?.original?.url?.replace("ipfs://", "https://lens.infura-ipfs.io/ipfs/") || DEFAULT_AVATAR_URL;
        setAvatar(ethereumAddress, newAvatarUrl);
      },
    },
  );

  const queryEns = useEnsName({
    chainId: chain.mainnet.id,
    address: ethereumAddress,
    enabled:
      (queryUserProfileLens?.isSuccess && queryUserProfileLens?.data === null) || queryUserProfileLens?.isError
        ? true
        : false,
  });

  const isLoading = queryUserProfileLens?.status === "loading";
  const isLensProfileAvailable = queryUserProfileLens?.status === "success" && queryUserProfileLens?.data !== null;
  const ensName = queryEns?.data;

  const displayName =
    (isLensProfileAvailable && queryUserProfileLens.data.handle) ||
    ensName ||
    (shortenOnFallback && !textualVersion && shortAddress) ||
    ethereumAddress;

  if (textualVersion) {
    return <span>{displayName}</span>;
  }

  const handleAddressClick = () => {
    window.open(`https://etherscan.io/address/${ethereumAddress}`, "_blank");
  };

  return (
    <span className="flex gap-2 items-center text-[16px] text-neutral-11 font-bold">
      <div className="flex items-center w-8 h-8 bg-neutral-5 rounded-full overflow-hidden">
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={avatarUrl}
          onError={() => setAvatar(ethereumAddress, DEFAULT_AVATAR_URL)}
          alt="avatar"
        />
      </div>
      {isLoading ? (
        <>Loading profile data...</>
      ) : (
        <a
          title={isLensProfileAvailable ? `View ${displayName}'s profile on LensFrens` : ""}
          className="text-[16px] text-neutral-11 font-bold no-underline cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          href={
            isLensProfileAvailable
              ? `https://lensfrens.xyz/${displayName}`
              : `https://etherscan.io/address/${ethereumAddress}`
          }
          onClick={handleAddressClick}
        >
          {displayName}
        </a>
      )}
    </span>
  );
};

export default EthereumAddress;
