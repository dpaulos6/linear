import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { TextareaAutosize } from '@mui/material';

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

import './Repo.scss';

export default function Repo(){
  const [url] = useSearchParams();
  const [files, setFiles] = useState([]);
  const [fileBase64String, setFileBase64String] = useState("");

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}",{
      owner: url.get('username'),
      repo: url.get('repo'),
      path: url.get('file'),
    })
    .then(response => {
      console.log(response);
      setFiles(response.data);
      setFileBase64String(response.data.content ? response.data.content : "");
    })
    .catch(error => console.error(error));
  }, []);


  const decodeFileBase64 = (base64String) => {
    // From Bytestream to Percent-encoding to Original string
    return decodeURIComponent(
      atob(base64String)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const decodeBase64 = decodeFileBase64(
    fileBase64String.substring(fileBase64String.indexOf(",") + 1)
  );

  return (
    <>
      <Helmet>
        <title>Linear - {url.get('username')+"/"+url.get('repo')}</title>
      </Helmet>
      <Navbar/>

      <div className='m-4 '>
        {()=>{
          if(url.get('type') === 'file'){
            <textarea value={decodeBase64} className='w-full code-viewer linear-scroll'/>
          } else {
            {files.map(item => (
              <p>{item.name}</p>
            ))}
          }
        }}
      </div>
    </>
  );
}