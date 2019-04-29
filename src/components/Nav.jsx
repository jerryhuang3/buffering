import React from "react";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <NavLink to="/">Home |</NavLink>
      <NavLink to="/login"> Login |</NavLink>
      <NavLink to="/signup"> Signup |</NavLink>
      <NavLink to="/profile"> Profile |</NavLink>
    </div>
  );
};

export default Nav;
