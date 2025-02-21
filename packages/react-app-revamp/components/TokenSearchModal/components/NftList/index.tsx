import useSearchNfts, { NFTMetadata } from "@hooks/useSearchNfts";
import { FC } from "react";
import TokenSearchListNft from "./component/Nft";
import SimpleBar from "simplebar-react";

interface NftsSearchListProps {
  selectedChain: string;
  searchValue: string;
  onSelectNft?: (nft: NFTMetadata) => void;
}

const NftsSearchList: FC<NftsSearchListProps> = ({ selectedChain, searchValue, onSelectNft }) => {
  const { data: nfts, error, isLoading } = useSearchNfts(selectedChain, searchValue);

  if (error) {
    return (
      <p className="text-[16px] text-negative-11 font-bold normal-case">
        there was an issue while loading NFTs, please reload the page.
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14 normal-case">loading NFT results</p>;
  }

  if (!nfts?.length) {
    return <p className="text-[16px] text-neutral-14 font-sabo normal-case">NFT not found</p>;
  }

  return (
    <div className="h-72 animate-reveal">
      <SimpleBar style={{ maxHeight: "100%", height: "100%" }} className="h-full" autoHide={false}>
        <div className="flex flex-col gap-6 h-full">
          {nfts.map(nft => (
            <TokenSearchListNft key={nft.address} nft={nft} onSelectNft={onSelectNft} />
          ))}
        </div>
      </SimpleBar>
    </div>
  );
};

export default NftsSearchList;
