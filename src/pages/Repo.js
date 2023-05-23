import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { 
  CodeBracketIcon,
  FolderIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

import './Repo.scss';

export default function Repo(){
  const [url] = useSearchParams();
  const [repos, setRepo] = useState([]);

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repos/{owner}/{repo}/contents",{
      owner: url.get('username'),
      repo: url.get('repo'),
    })
    .then(response => {
      console.log(response);
      setRepo(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <>
      <Helmet>
        <title>Linear - {url.get('username')+"/"+url.get('repo')}</title>
      </Helmet>
      <Navbar/>

      <div className='h-full'>
        <div className='w-full flex flex-col pt-4 px-12 border-b-2'>
          <span className='inline-flex my-2 text-2xl'>
            <FolderIcon className='flex w-5 mr-2 my-auto'/>
            <p className='text-blue-500 hover:underline cursor-pointer'>{url.get('username')}</p>
            <p className='text-gray-300 mx-0.5'>/</p>
            <p className='text-blue-500 font-bold hover:underline cursor-pointer'>{url.get('repo')}</p>
          </span>
          <div className='w-full space-x-2 py-2'>
            <div className='inline-flex gap-2 text-lg px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-gray-200'>
              <CodeBracketIcon className='flex w-5 my-auto'/>
              Code
            </div>
            <div className='inline-flex gap-2 text-lg px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-gray-200'>
              <ExclamationCircleIcon className='flex w-5 my-auto'/>
              Issues
            </div>
            <div className='inline-flex gap-2 text-lg px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-gray-200'>
              <CodeBracketIcon className='flex w-5 my-auto'/>
              Code
            </div>
            <div className='inline-flex gap-2 text-lg px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-gray-200'>
              <CodeBracketIcon className='flex w-5 my-auto'/>
              Code
            </div>
          </div>
        </div>


        <div className='repos h-full space-y-4'>
          <div className="box my-repos">
            <div className='repos-header'>
              <p className='text-md text-slate-800'>{url.get('repo') + " repository content"}</p>
            </div>
            <div className='repos-search'>
              <input className='linear-search flex text-base bg-slate-100/75 rounded-md w-full h-10' type='search' placeholder='Search' />
            </div>
            <div className='scroll linear-scroll pr-4'>
              {repos.map(item => (
                <div className='flex flex-row w-full repo-item transition'>
                  <span key={item.id} data-link={item.full_name} className='repo-name mr-2 inline-flex'>
                    <Link key={item.id} to={''} className='repo-name-url'>{item.name}</Link>
                  </span>
                  <p key={item.language} className='hidden lg:flex items-center justify-end text-base text-gray-700/50'>{item.language}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}