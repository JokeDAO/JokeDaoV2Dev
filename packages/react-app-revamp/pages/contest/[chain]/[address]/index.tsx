import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { getLayout } from "@layouts/LayoutViewContest";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";

interface PageProps {
  address: string;
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props;
  const { contestName } = useContestStore(state => state);

  return (
    <>
      <NextSeo
        title="Using More of Config"
        description="This example uses more of the available config options."
        openGraph={{
          url: "https://www.url.ie/a",
          title: "Open Graph Title",
          description: "Open Graph Description",
          images: [
            {
              url: "https://www.example.ie/og-image-01.jpg",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
            {
              url: "https://www.example.ie/og-image-02.jpg",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
            { url: "https://www.example.ie/og-image-03.jpg" },
            { url: "https://www.example.ie/og-image-04.jpg" },
          ],
          siteName: "SiteName",
        }}
      />
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
