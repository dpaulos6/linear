import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { TextareaAutosize } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

import './Repo.scss';

const fileExtensions = ["JPG","PNG","GIF","WEBP","TIFF","PSD","RAW","BMP","HEIF","INDD","JPEG","SVG","AI","EPS","PDF"]

export default function Repo(){
  const [url] = useSearchParams();
  const [file, setFile] = useState([]);
  const [fileBase64String, setFileBase64String] = useState("");
  
  const owner = url.get('username');
  const repo = url.get('repo');
  const path = url.get('path');

  function getFileType() {
    let str = ""
    
    fileExtensions.forEach((item)=>{
      if(str === 'match') return false;
      const pathExt = path.split('.')[1]
      pathExt.includes(item.toLowerCase()) ? str = 'match' : str = ""
      console.log(pathExt, item.toLowerCase(), str)
    })
    return str
  }

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}",{
      owner: owner,
      repo: repo,
      path: path,
    })
    .then(response => {
      console.log(response);
      console.log(getFileType())
      setFile(response.data);
      setFileBase64String(getFileType() !== 'match' ? response.data.content : "");
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
        <title>Linear - {owner+"/"+repo}</title>
      </Helmet>
      <Navbar/>

      <div className='p-4 pt-0'>
        <div className='w-full max-w-6xl h-full space-y-4 mt-6 mx-auto'>
          <div className="box repo-files w-full min -w-2xl">
            <div id='commit-disclosure' className='bg-white'>
              <div className='repo-content-header space-x-2 p-4 items-center'>
                <>
                  <img src={""} className='w-7 h-7 rounded-full overflow-hidden' />
                  <p className='text-lg text-slate-800 font-bold'></p>
                  <span className='text-lg text-slate-800'>
                    <span className='inline-flex space-x-2 items-center'>
                      <p className=''>
                        {}
                      </p>
                      <p className='ellipsis-expander bg-gray-200 select-none'>
                        ...
                      </p>
                    </span>
                  </span>
                </>
              </div>
              <div className='hidden commit-disclosure-span bg-gray-50 px-16 py-4 items-center'>
                
              </div>
            </div>
            <div className=''>
              {()=>{
                let verify = getFileType()
                verify !== 'match' ? (
                  <SyntaxHighlighter language={path.split(".")[1]} style={github} className="w-full">
                    {decodeBase64}
                  </SyntaxHighlighter>
                ):(
                  <div className='flex items-center'>
                    <img src={file.download_url} alt={file.name} className='flex mx-auto' />
                  </div>
                )}
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}