import { React, Fragment, useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Menu, Transition, Disclosure } from '@headlessui/react'
import { 
  ChevronDownIcon,
  CodeBracketIcon,
  FolderIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  Square2StackIcon,
  ArrowsUpDownIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  CubeTransparentIcon,
  EllipsisHorizontalIcon,
  
} from '@heroicons/react/24/outline'
import { DiGitBranch } from "react-icons/di";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdFolder } from "react-icons/md";
import { FiFile } from "react-icons/fi";

import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

import './Repo.scss';
import { Button } from '@mui/material';

const repoNav = [
  { name: 'Code', icon: CodeBracketIcon, active: true },
  { name: 'Issues', icon: ExclamationCircleIcon, active: false },
  { name: 'Pull requests', icon: ArrowsUpDownIcon, active: false },
  { name: 'Actions', icon: CubeTransparentIcon, active: false },
  { name: 'Projects', icon: Square2StackIcon, active: false },
  { name: 'Wiki', icon: BookOpenIcon, active: false },
  { name: 'Security', icon: ShieldCheckIcon, active: false },
  { name: 'Insights', icon: ChartBarIcon, active: false },
  { name: 'Settings', icon: Cog6ToothIcon, active: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Repo(){
  const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
  const [url] = useSearchParams();
  const [repos, setRepo] = useState([]);
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);

  const owner = url.get('username');
  const repo = url.get('repo');
  const path = url.get('path');
  
  useEffect(() => {
    octokit
    .request("GET /repos/{owner}/{repo}/branches",{
      owner: owner,
      repo: repo,
    })
    .then(response => {
      console.log(response);
      setBranches(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    octokit
    .request("GET /repos/{owner}/{repo}/commits",{
      owner: owner,
      repo: repo,
    })
    .then(response => {
      console.log(response);
      setCommits(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}",{
      owner: owner,
      repo: repo,
      path: path ? path : "",
    })
    .then(response => {
      console.log(response);
      setRepo(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  const commitDisclosureSpan = document.querySelector('.commit-disclosure-span');
  function openCommitDisclosure(){
    commitDisclosureSpan.classList.toggle('hidden');
  }

  function openFolderAccordion(str){
    const folderAccordion = document.getElementById('#'+str);
    folderAccordion.classList.toggle('hidden');
  }

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
            {repoNav.map(item => (
              <div className='inline-flex gap-2 text-lg px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-gray-200'>
                {item.active === true ? (
                  <>
                    <item.icon className='flex text-blue-600 w-5 my-auto'/>
                    <p className='text-blue-600'>{item.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon className='flex w-5 my-auto'/>
                    <p>{item.name}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>


        <div className='w-full max-w-6xl h-full space-y-4 mt-6 mx-auto'>
          <div className='repo-extra inline-flex items-center space-x-4'>
            <div className=''>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <DiGitBranch className="-mr-1 h-6 w-6 text-gray-500" aria-hidden="true" />
                    <span className='text-base'>
                      {branches.map(item => (
                        <p key={item.id}>
                          {item.name === "master" ? (
                            item.name
                          ) : (
                            ""
                          )}
                        </p>
                      ))}
                    </span>
                    <IoMdArrowDropdown className="-mr-1 h-6 w-6 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 z-10 mt-2 min-w-[10rem] w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {branches
                        .map(item => (
                        <Menu.Item key={item.id}>
                          {({ active }) => (
                            branches.length > 1 ? (
                              item.name !== "master" ? (
                                <span
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'inline-flex w-full px-4 py-2 text-sm cursor-pointer'
                                  )}
                                >
                                  <>
                                    <DiGitBranch className="mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
                                    <p>{item.name}</p>
                                  </>
                                </span>
                              ) : <></>
                            ) : (
                              <span
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'inline-flex w-full px-4 py-2 text-sm cursor-pointer'
                                )}
                              >
                                <p>No other branches</p>
                              </span>
                            )
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className='inline-flex space-x-1 branch-counter hover:text-blue-600'>
              <DiGitBranch className="-mr-1 h-6 w-6 text-gray-900" aria-hidden="true" />
              <p className='font-bold'>{branches.length > 0 ? (branches.length) : ""}</p>
              <p>branches</p>
            </div>
          </div>

          <div className="box repo-files w-full min -w-2xl">
            <div id='commit-disclosure' className='bg-white'>
              <div className='repo-content-header space-x-2 p-4 items-center'>
                {commits.length > 0 ? (
                  <>
                    <img src={commits[0].author.avatar_url} alt={commits[0].author.login + ' avatar'} className='w-7 h-7 rounded-full overflow-hidden' />
                    <p className='text-lg text-slate-800 font-bold'>{commits[0].author.login}</p>
                    <p className='text-lg text-slate-800'>
                      {commits[0].commit.message.length < 60 ? (
                        commits[0].commit.message
                      ) : (
                        <span className='inline-flex space-x-2 items-center'>
                          <p className=''>
                            {commits[0].commit.message.split("\n\n")[0]}
                          </p>
                          <p className='ellipsis-expander bg-gray-200 select-none' onClick={()=> openCommitDisclosure()}>
                            ...
                          </p>
                        </span>
                      )}
                    </p>
                  </>
                ) : ""}
              </div>
              <div className='hidden commit-disclosure-span bg-gray-50 px-16 py-4 items-center'>
                <p className='font-bold mb-1'>
                  {commits.length > 0 ? (
                    commits[0].commit.message.split("\n\n")[0]
                  ) : ""}
                </p>
                <p className='text-gray-600'>
                  {commits.length > 0 ? (
                    commits[0].commit.message.split("\n\n")[1]
                  ) : ""}
                </p>
              </div>
            </div>
            <div className='select-none'>
              {repos
              .sort((a, b) => a.type.localeCompare(b.type))
              .map(item => (
                <>
                  {item.type === 'dir' ? (
                    <a
                      className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-xl bg-[#f2f2f2] hover:bg-white'
                      href={'/Repo?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path}
                    >
                      <span 
                        data-link={item.full_name} 
                        className='repo-name px-4 py-1 w-full inline-flex items-center space-x-1'
                      >
                          <>
                            <MdFolder />
                            <p className=''>{item.name}</p>
                          </>
                      </span>
                    </a>
                  ):(
                    <a 
                      className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-xl bg-[#f2f2f2] hover:bg-white'
                      href={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path}
                    >
                      <span 
                        data-link={item.full_name} 
                        className='repo-name px-4 py-1 w-full inline-flex items-center space-x-1'
                      >
                          <>
                            <FiFile />
                            <p className=''>{item.name}</p>
                          </>
                      </span>
                    </a>
                  )}
                  <>
                    {/* {item.type === 'dir' ? (
                      <div id="folder-accordion" className='hidden'>
                        <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-lg bg-[#ececec] hover:bg-white/75'>
                          <span 
                            data-link={item.full_name} 
                            className='repo-name px-4 pl-8 py-1 w-full inline-flex items-center space-x-1'
                          >
                            <MdFolder />
                            <Link key={item.id} 
                            to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                            className='repo-name-url'>Folder 1</Link>
                          </span>
                        </div>
                        <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-lg bg-[#ececec] hover:bg-white/75'>
                          <span 
                            data-link={item.full_name} 
                            className='repo-name px-4 pl-8 py-1 w-full inline-flex items-center space-x-1'
                          >
                            <FiFile />
                            <Link key={item.id} 
                            to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                            className='repo-name-url'>File 1</Link>
                          </span>
                        </div>
                        <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-lg bg-[#ececec] hover:bg-white/75'>
                          <span 
                            data-link={item.full_name} 
                            className='repo-name px-4 pl-8 py-1 w-full inline-flex items-center space-x-1'
                          >
                            <FiFile />
                            <Link key={item.id} 
                            to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                            className='repo-name-url'>File 2</Link>
                          </span>
                        </div>
                        <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-lg bg-[#ececec] hover:bg-white/75'>
                          <span 
                            data-link={item.full_name} 
                            className='repo-name px-4 pl-8 py-1 w-full inline-flex items-center space-x-1'
                          >
                            <FiFile />
                            <Link key={item.id} 
                            to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                            className='repo-name-url'>File 3</Link>
                          </span>
                        </div>
                        <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-lg bg-[#ececec] hover:bg-white/75'>
                          <span 
                            data-link={item.full_name} 
                            className='repo-name px-4 pl-8 py-1 w-full inline-flex items-center space-x-1'
                          >
                            <FiFile />
                            <Link key={item.id} 
                            to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                            className='repo-name-url'>File 4</Link>
                          </span>
                        </div>
                      </div>
                    ) : null} */}
                  </>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}