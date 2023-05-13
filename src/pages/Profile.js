import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { Octokit } from "@octokit/core";

export default function Profile(){
  const [url] = useSearchParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /users/{username}",{
      username: url.get('username'),
    })
    .then(response => {
      console.log(response);
      setUser(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}