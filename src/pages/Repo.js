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
  { name: 'Code', icon: CodeBracketIcon },
  { name: 'Issues', icon: ExclamationCircleIcon },
  { name: 'Pull requests', icon: ArrowsUpDownIcon },
  { name: 'Actions', icon: CubeTransparentIcon },
  { name: 'Projects', icon: Square2StackIcon },
  { name: 'Wiki', icon: BookOpenIcon },
  { name: 'Security', icon: ShieldCheckIcon },
  { name: 'Insights', icon: ChartBarIcon },
  { name: 'Settings', icon: Cog6ToothIcon },
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
  const [tags, setTags] = useState([]);
  
    useEffect(() => {
      octokit
      .request("GET /repos/{owner}/{repo}/branches",{
        owner: url.get('username'),
        repo: url.get('repo'),
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
      owner: url.get('username'),
      repo: url.get('repo'),
    })
    .then(response => {
      console.log(response);
      setCommits(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
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

  const commitDisclosure = document.querySelector('#commit-disclosure');
  const commitDisclosureSpan = document.querySelector('.commit-disclosure-span');
  function openCommitDisclosure(str){
    commitDisclosureSpan.classList.toggle('hidden');
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
                <item.icon className='flex w-5 my-auto'/>
                {item.name}
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
                          {item.name == "master" ? (
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
                              item.name != "master" ? (
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
                          <p className='ellipsis-expander bg-gray-300 select-none' onClick={()=> openCommitDisclosure()}>
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
                <div className='flex flex-col w-full repo-content-item text-blue-400 m-0 text-xl bg-[#f2f2f2] hover:bg-white'>
                  <span data-link={item.full_name} className='repo-name px-4 py-1 w-full inline-flex items-center space-x-1'>
                    {item.type == 'file' ? (
                      <FiFile />
                    ):(
                      <MdFolder />
                    )}
                    <Link key={item.id} 
                    to={'/File?username='+url.get('username')+'&repo='+url.get('repo')+'&path='+item.path} 
                    className='repo-name-url'>{item.name}</Link>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}