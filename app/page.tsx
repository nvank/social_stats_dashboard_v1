//app/page.tsx --> Frontend

"use client";

import React, { useState, useEffect } from 'react';
import Head from "next/head";

export default function SocialMediaCrawler() {

  const [totalSubscribers, setTotalSubscribers] = useState(null);

  useEffect(() => {

      const fetchData = async () => {
      console.log("Fetching Data...");
      const response = await fetch('/api/invoke_lambda');
      const result = await response.json();
      const allData = JSON.parse(result.body);
      const subscribersObj = allData.data[0].subscribers;
      const subscribersCount = subscribersObj.N;
      setTotalSubscribers(subscribersCount);
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title> Social Stats</title>
      </Head>
      <div>
        <h1>Watch the AWS Fundamentals Community grow☀️</h1>
      </div>
      <div>
        <p>ConvertKit</p>
        <p>Newsletter Subscribers: {totalSubscribers} </p> 
      </div>
    </>
  );

};
