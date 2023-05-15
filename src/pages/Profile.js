import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet';

import Navbar from '../components/Navbar';

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
      <Helmet>
        <title>Linear - {url.get('username')+"/"+url.get('repo')}</title>
      </Helmet>
      <Navbar/>
      <h1>Profile</h1>
    </>
  );
}