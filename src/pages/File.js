import { React, Fragment, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { 
  CodeBracketIcon,
  FolderIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  Square2StackIcon,
  ArrowsUpDownIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline'
import { DiGitBranch } from "react-icons/di";
import { IoMdArrowDropdown } from "react-icons/io";

import Navbar from '../components/Navbar';

import { Octokit } from "@octokit/core";
import { Helmet } from 'react-helmet';

import './Repo.scss';

const fileExtensions = ["JPG","PNG","GIF","WEBP","TIFF","PSD","RAW","BMP","HEIF","INDD","JPEG","SVG","AI","EPS","PDF"]

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

export default function Repo(){
  const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
  const [url] = useSearchParams();
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [file, setFile] = useState([]);
  const [fileBase64String, setFileBase64String] = useState("");

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
      setCommits(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}",{
      owner: owner,
      repo: repo,
      path: path,
    })
    .then(response => {
      setFile(response.data);
      setFileBase64String(getFileType() !== 'match' ? response.data.content : "");
    })
    .catch(error => console.error(error));
  }, []);

  function getFileType() {
    let str = ""
    
    fileExtensions.forEach((item)=>{
      if(str === 'match') return false;
      const pathExt = path.split('.')[1]
      pathExt.includes(item.toLowerCase()) ? str = 'match' : str = ""
    })
    return str
  }

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

  const fileName = path.split('/')[path.split('/').length-1];
  const fileLanguage = path.split('.')[path.split('.').length-1];
  const splitPath = path.split('/')

  return (
    <>
      <Helmet>
        <title>Linear - {owner+"/"+repo}</title>
      </Helmet>
      <Navbar/>

      <div className='w-full flex flex-col pt-4 px-12 border-b-2'>
        <span className='inline-flex my-2 text-2xl'>
          <FolderIcon className='flex w-5 mr-2 my-auto'/>
          <p className='text-blue-500 hover:underline cursor-pointer'>{owner}</p>
          <p className='text-gray-300 mx-0.5'>/</p>
          <p className='text-blue-500 hover:underline cursor-pointer'>{repo}</p>
          {splitPath.map(item => (
            <>
              <p className='text-gray-300 mx-0.5'>/</p>
              {item === fileName 
                ? <p className='text-blue-500 font-semibold hover:underline cursor-pointer'>{item}</p>
                : <p className='text-blue-500 hover:underline cursor-pointer'>{item}</p>
              }
            </>
          ))}
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
                                className={(
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
                              className={(
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
                  <p className='text-lg text-slate-800'>{commits[0].commit.message}</p>
                </>
              ) : ""}
            </div>
          </div>
          <div className='w-full max-w-6xl h-full space-y-4 mx-auto'>
            <div className="w-full min -w-2xl">
              <div className=''>
                {getFileType() !== 'match' ? (
                  <SyntaxHighlighter language={fileLanguage} style={github} className="w-full">
                    {decodeBase64}
                  </SyntaxHighlighter>
                ):(
                  <div className='flex items-center'>
                    <img src={file.download_url} alt={file.name} className='flex mx-auto' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}