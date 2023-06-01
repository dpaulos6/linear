import React, { useEffect, useState } from 'react'
import { Dialog, Disclosure } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { 
  UserCircleIcon, 
  BellIcon, 
  MagnifyingGlassIcon, 
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

export default function Navbar(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <>
      <header className="">
        <nav id='navbar' className="flex h-24 w-full items-center bg-white p-6 lg:py-6" aria-label="Global">
          <div className="flex w-12">
            <a href="/" className="flex mx-auto">
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
          <div className="flex w-fit lg:w-full lg:max-w-2xl h-full py-1 items-center">
            <input className='linear-search hidden lg:flex items-center mx-auto lg:mx-20 bg-gray-200/75 rounded-md w-full h-full' type='search' placeholder='Search' />
            <MagnifyingGlassIcon className="h-9 w-9 lg:hidden flex-none text-slate-600 cursor-pointer" aria-hidden="true" />
          </div>
          <div className="hidden w-full -md:max-w-xs md:flex md:flex-1 md:justify-end">
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
      
    </>
  );
}