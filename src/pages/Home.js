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

{/* Auto complete search function */}
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].name.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
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

  const myReposSearch = document.querySelector('#myReposSearch');

  // if(myRepos.length > 0) autocomplete(myReposSearch, myRepos);

  const sidebar = document.querySelector('#sidebar');
  const navbar = document.querySelector('#navbar');
  
  return (
    <>
      <Helmet>
        <title>Linear</title>
      </Helmet>

      <Navbar/>

      <div className='main-page h-full lg:px-0 '>
        <div className='repos'>
          <div className="box my-repos p-6">
            <div className='repos-header'>
              <p className='text-md text-slate-800'>My repositories</p>
              <button className='inline-flex bg-[#20E75C] px-4 py-2 rounded-md text-xl items-center'>
                <PlusIcon className="h-5 w-5 mr-1 flex-none  text-white cursor-pointer" aria-hidden="true" />
                <p className='text-white'>New</p>
              </button>
            </div>
            <div className='repos-search'>
              <input id='myReposSearch' className='autocomplete rounded-md h-10 text-base' type='text' placeholder='Search' />
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
                    <Link key={item.id} to={'/Repo?username='+item.owner.login+'&repo='+item.name} className='repo-name-url'>{item.name}</Link>
                  </span>
                  <p key={item.language} className='hidden lg:flex items-center justify-end text-base text-gray-700/50'>{item.language}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div id='sidebar' className='sidebar'>
          <div class="sidebar sidebar-linear fixed top-[84px] bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-50">
            <div class="text-gray-700 text-xl">
              <div class="p-2.5 mt-1 flex items-center">
                <i class="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
                <h1 class="font-bold text-gray-700 text-[15px] ml-3">TailwindCSS</h1>
                <i
                  class="bi bi-x cursor-pointer ml-28 lg:hidden"
                  onclick="openSidebar()"
                ></i>
              </div>
              <div class="my-2 bg-gray-300 h-[1px]"></div>
            </div>
            <div
              class="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-300 text-gray-800"
            >
              <i class="bi bi-search text-sm"></i>
              <input
                type="text"
                placeholder="Search"
                class="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
              />
            </div>
            <div
              class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
            >
              <i class="bi bi-house-door-fill"></i>
              <span class="text-[15px] ml-4 text-gray-700 font-bold">Home</span>
            </div>
            <div
              class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
            >
              <i class="bi bi-bookmark-fill"></i>
              <span class="text-[15px] ml-4 text-gray-700 font-bold">Bookmark</span>
            </div>
            <div class="my-4 bg-gray-600 h-[1px]"></div>
            <div
              class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
              onclick="dropdown()"
            >
              <i class="bi bi-chat-left-text-fill"></i>
              <div class="flex justify-between w-full items-center">
                <span class="text-[15px] ml-4 text-gray-700 font-bold">Chatbox</span>
                <span class="text-sm rotate-180" id="arrow">
                  <i class="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              class="text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-bold"
              id="submenu"
            >
              <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                Social
              </h1>
              <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                Personal
              </h1>
              <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                Friends
              </h1>
            </div>
            <div
              class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
            >
              <i class="bi bi-box-arrow-in-right"></i>
              <span class="text-[15px] ml-4 text-gray-700 font-bold">Logout</span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}