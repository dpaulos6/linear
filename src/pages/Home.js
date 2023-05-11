import React, { useEffect, useState } from 'react'
import { Dialog, Disclosure } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  BellIcon, 
  BellAlertIcon, 
  MagnifyingGlassIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline'
import { Helmet } from 'react-helmet';

import './Home.scss';

import { Octokit } from "@octokit/core";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [repos, setRepos] = useState([]);
  
  useEffect(() => {
    const octokit = new Octokit({ auth: `${process.env.REACT_APP_CLIENT_TOKEN}` });
    octokit
    .request("GET /user/repos",{
      type: 'owner',
    })
    .then(response => {
      console.log(response);
      setRepos(response.data);
    })
    .catch(error => console.error(error));
  }, []);
  
  return (
    <>

      <header className="">
        <nav className="mx-auto flex h-24 items-center border-b-2 border-b-slate-200 p-6 lg:py-6" aria-label="Global">
          <div className="flex w-12">
            <a href="#" className="flex mx-auto">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="linearlogo_nobg.png" alt="" />
            </a>
          </div>
          <div className="hidden w-max items-center text-slate-600 px-4 md:flex md:gap-x-6 lg:gap-x-12">
            <a href="#" className="text-sm font-semibold leading-6 hover:text-slate-800 transition">
              Pull Requests
            </a>
            <a href="#" className="text-sm font-semibold leading-6 hover:text-slate-800 transition">
              Issues
            </a>
            <a href="#" className="text-sm font-semibold leading-6 hover:text-slate-800 transition">
              Explore
            </a>
          </div>
          {/* Menu Toggler */}
          <div className="flex ml-auto md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex w-full xl:max-w-2xl max-w-lg h-full py-1 items-center lg:gap-x-12">
            <input className='linear-search hidden lg:flex mx-auto lg:mx-20 bg-gray-200/75 rounded-md w-full h-full' type='search' placeholder='Search' />
            <MagnifyingGlassIcon className="h-9 w-9 lg:hidden flex-none text-slate-600 cursor-pointer" aria-hidden="true" />
          </div>
          <div className="hidden w-fit md:flex md:flex-1 lg:justify-end">
            <BellIcon className="h-9 w-9 flex-none  text-slate-600 cursor-pointer" aria-hidden="true" />
            <UserCircleIcon className="h-9 w-9 flex-none  text-slate-600 cursor-pointer" aria-hidden="true" />
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Marketplace
                  </a>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Company
                  </a>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className='main-content p-6 lg:p-0 lg:py-8'>
        <div className="repos">
          {repos.map(item => (
            <div className='flex flex-row'>
              <EyeIcon className="h-5 w-5 my-auto mr-2 flex-none cursor-pointer" aria-hidden="true" />
              <p key={item.id} data-link={item.full_name} className=''>{item.name}</p>
            </div>
          ))}
        </div>
        <div className='sidebar'>
          
        </div>
      </div>
    </>
  );
}