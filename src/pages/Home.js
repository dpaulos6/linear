import React, { useEffect, useState } from 'react';
import './Home.css';

import { Octokit } from "@octokit/core";

const { client_token } = require('../config.json');

export default function Home(){
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const octokit = new Octokit({ auth: `${client_token}` });
    octokit
      .request("GET /user/repos",{
        type: 'owner',
      })
      .then(response => {
        setRepos(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <div className="repos">
        {repos.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
    </>
  );
}