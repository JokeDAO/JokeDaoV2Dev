import button from "@components/UI/Button/styles";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ctaGoBackStyles = button({
  class: "w-full 2xs:w-auto",
});

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found - jokerace</title>
        <meta
          name="description"
          content="jokerace - contests for communities to make,
          execute, and reward decisions"
        />
      </Head>
      <div className="container m-auto sm:text-center">
        <h1 className="text-4xl font-black mb-3 text-primary-10">Page not found</h1>
        {/*  eslint-disable-next-line react/no-unescaped-entities */}
        <p className="text-neutral-12 mb-6">Sorry ! The page you are looking for was deleted or it doesn't exist.</p>
        <Link href="/" className={ctaGoBackStyles}>
          Go back to home page
        </Link>
      </div>
    </>
  );
};

export default Page;
