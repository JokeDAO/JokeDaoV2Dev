"use client";

import { type TweetProps, TweetSkeleton, useTweet } from "react-tweet";
import CustomTweetNotFound from "./custom-not-found";
import { MyTweet } from "./custom-tweet";

export const Tweet = ({ id, apiUrl, fallback = <TweetSkeleton />, components, onError }: TweetProps) => {
  const { data, error, isLoading } = useTweet(id, apiUrl);

  if (isLoading) return <div id="tweet-skeleton">{fallback}</div>;
  if (error || !data) {
    return <CustomTweetNotFound id={id} error={onError ? onError(error) : error} />;
  }

  return <MyTweet tweet={data} components={components} />;
};
