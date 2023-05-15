import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

export default function Repo(){
  const [url] = useSearchParams();
  const [repos, setRepo] = useState([]);

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repos/{owner}/{repo}",{
      owner: url.get('username'),
      repo: url.get('repo'),
    })
    .then(response => {
      console.log(response);
      setRepo(response.data);
    })
    .catch(error => console.error(error));
  }, );

  return (
    <>
      <Helmet>
        <title>Linear - {url.get('username')+"/"+url.get('repo')}</title>
      </Helmet>
      <Navbar/>
      <h1>Repo</h1>
    </>
  );
}