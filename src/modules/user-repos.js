import { Octokit } from '@octokit/core';

const { client_token } = require('../config.json');

export default async function base(){
  const octokit = new Octokit({ auth: `${client_token}`});
  return(
    <script type='module'>
      const response = await octokit.request('GET /user/repos');

      console.log(response);
    </script>
  );
}