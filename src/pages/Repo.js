import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { Octokit } from "@octokit/core";

export default function Repo(){
  const [url] = useSearchParams();
  const [repo, setRepo] = useState();

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repos/{owner}/{repo}",{
      owner: url.get('username'),
      repo: url.get('repoId'),
    })
    .then(response => {
      console.log(response);
      setRepo(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}