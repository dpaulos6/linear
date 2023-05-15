import React, { useEffect, useState } from 'react'
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  BellIcon, 
  BellAlertIcon, 
  MagnifyingGlassIcon, 
  CodeBracketIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Profile from './Profile';
import './Home.scss';

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home(){
  const [myRepos, setMyRepos] = useState([]);
  const [publicRepos, setPublicRepos] = useState([]);
  
  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /user/repos",{
      type: 'owner',
    })
    .then(response => {
      console.log(response);
      setMyRepos(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /repositories")
    .then(response => {
      console.log(response);
      setPublicRepos(response.data);
    })
    .catch(error => console.error(error));
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Linear</title>
      </Helmet>

      <Navbar/>

      <div className='main-content h-full overflow-hidden p-6 py-12 lg:px-0 '>
        <div className='repos h-full space-y-4'>
          <div className="box my-repos">
            <div className='repos-header'>
              <p className='text-md text-slate-800'>My repositories</p>
              <button className='inline-flex bg-[#20E75C] px-4 py-2 rounded-md text-xl items-center'>
                <PlusIcon className="h-5 w-5 mr-1 flex-none  text-white cursor-pointer" aria-hidden="true" />
                <p className='text-white'>New</p>
              </button>
            </div>
            <div className='repos-search'>
              <input className='linear-search flex text-base bg-slate-100/75 rounded-md w-full h-10' type='search' placeholder='Search' />
            </div>
            <div className='scroll linear-scroll pr-4'>
              {myRepos.map(item => (
                <div className='flex flex-row w-full repo-item transition'>
                  {item.private ? (
                    <EyeSlashIcon className="repo-private-icon h-5 w-5 my-auto mr-2 flex-none cursor-pointer" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="repo-public-icon h-5 w-5 my-auto mr-2 flex-none cursor-pointer" aria-hidden="true" />
                  )}
                  <img src={item.owner.avatar_url} alt={item.owner.login + " Avatar"} className='flex w-5 h-5 my-auto mr-2 rounded-full cursor-pointer' />
                  <span key={item.id} data-link={item.full_name} className='repo-name mr-2 inline-flex'>
                    <Link key={item.owner.id} to={'/Profile?username='+item.owner.login} className='repo-name-url'>{item.owner.login}</Link>
                    <p key={''}>/</p>
                    <Link key={item.id} to={'/Repo?username='+item.owner.login+'&repo='+item.name} className='repo-name-url'>{item.name}</Link>
                  </span>
                  <p key={item.language} className='hidden lg:flex items-center justify-end text-base text-gray-700/50'>{item.language}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="box public-repos">
            <div className='repos-header space-x-4'>
              <p className='text-md w-full text-slate-800'>Public repositories</p>
              <input className='linear-search flex text-base bg-slate-100/75 rounded-md w-full h-10' type='search' placeholder='Search' />
            </div>
            <div className='scroll linear-scroll pr-4'>
              {publicRepos.map(item => (
                <div className='flex flex-row w-full repo-item transition'>
                  {item.private ? (
                    <EyeSlashIcon className="repo-private-icon h-5 w-5 my-auto mr-2 flex-none cursor-pointer" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="repo-public-icon h-5 w-5 my-auto mr-2 flex-none cursor-pointer" aria-hidden="true" />
                  )}
                  <img src={item.owner.avatar_url} alt={item.owner.login + " Avatar"} className='flex w-5 h-5 my-auto mr-2 rounded-full' />
                  <span key={item.id} data-link={item.full_name} className='repo-name mr-2 inline-flex'>
                    <Link key={item.owner.id} to={'/Profile?username='+item.owner.login} className='repo-name-url'>{item.owner.login}</Link>
                    <p key={''}>/</p>
                    <Link key={item.id} to={'/Repo?username='+item.owner.login+'&repo='+item.name} className='repo-name-url'>{item.name}</Link>
                  </span>
                  <p key={item.language} className='hidden lg:flex items-center justify-end text-base text-gray-700/50'>{item.language}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='sidebar'>
          
        </div>
      </div>
    </>
  );
}