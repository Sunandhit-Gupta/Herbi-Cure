import React from 'react'
import "../components_css/NavBar.css"
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import logo_jpg_herbi_cure from "../assets/logo_jpg_herbi_cure.png" //importing logo



export const NavBar = () => {
  return (
    <div  className='NavBar_Container'>
        <div className='left_nav_content'>
           <Link to = "/">
            <img src= {logo_jpg_herbi_cure} alt='lama-img' />
           </Link>

            <Link to= "/About">Blog</Link>
           <Link to= "/Readme">Readme</Link>
            <a href='https://github.com/Sunandhit-Gupta'>Github</a>
        </div>
        <div className='right_nav_content'>

            <div className='search_bar'>
            <div className='search_icon' > <IoIosSearch/></div>
            <input placeholder= ' Search Models '/>
            </div>

            <div>
            <a href='#'>Models</a>
            <a href='#'> Sign in</a>
            <a href='#'><button>Downloads</button></a>
            </div>
        </div>
    </div>
  )
}
