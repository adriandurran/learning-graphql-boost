import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Signout from './Auth/Signout';

const Navbar = ({ session }) => {
  return (
    <nav>
      {session && session.getCurrentUser ? (
        <NavbarAuth session={session} />
      ) : (
        <NavbarUnAuth />
      )}
    </nav>
  );
};

const NavbarUnAuth = () => (
  <ul>
    <li>
      <NavLink to="/" exact>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to="/search">Search</NavLink>
    </li>
    <li>
      <NavLink to="/signin">Sign in</NavLink>
    </li>
    <li>
      <NavLink to="/signup">Sign Up</NavLink>
    </li>
  </ul>
);

const NavbarAuth = ({ session }) => (
  <Fragment>
    <ul>
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/search">Search</NavLink>
      </li>
      <li>
        <NavLink to="#">Add Recipe</NavLink>
      </li>
      <li>
        <NavLink to="#">Profile</NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
    <h4>
      Welcome, <strong>{session.getCurrentUser.username}</strong>
    </h4>
  </Fragment>
);

export default Navbar;
