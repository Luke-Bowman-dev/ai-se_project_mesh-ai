import "./Header.css"; 
import { NavLink, useLocation, useNavigate } from "react-router-dom"; 
import logo from "../../assets/logo.png"; 
import hamburgerButton from "../../assets/hamburger-btn.png"; 
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import logoutIcon from "../../assets/logout-icon.png";
import chevronUp from "../../assets/chevron-up.png";
import chevronDown from "../../assets/chevron-down.png";

type Props = { 
  onMenuOpen: () => void; 
  onMenuClose: () => void; 
  isMobileMenuOpen: boolean; 
}; 

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
  const {isAuthenticated, currentUser, logout} = useAuth();
  const location = useLocation(); 
  const isChatPage = location.pathname.startsWith("/chat");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  function getNavLinkClass({ isActive }: { isActive: boolean }) { 
    return isActive ? "header__nav-link header__nav-link_active" : "header__nav-link"; 
  } 

  
  let groupClassName = isMobileMenuOpen ? 'header__group header__group_mobile' : 'header__group';

  // 2. If it's the chat page, append your chat-mode styles directly to the group container instead
  if (isMobileMenuOpen && isChatPage) {
    groupClassName += ' header__group_chat-mode';
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return ( 
    <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'} > 
      <button type="button" className="header__menu-btn" aria-label="Open menu" onClick={onMenuOpen} > 
        <img src={hamburgerButton} /> 
      </button> 
      <img src={logo} alt="Mesh AI logo" className="header__logo" /> 

      {isAuthenticated && (
        <div className={groupClassName}>
          <nav className="header__nav"> 
            <NavLink to="/knowledge" className={getNavLinkClass} onClick={onMenuClose}>Knowledge Base</NavLink> 
            <NavLink to="/chat" className={getNavLinkClass} onClick={onMenuClose}>Chat</NavLink> 
          </nav>
          <div className="header__dropdown-container">
            <button type="button" className="header__dropdown-btn" aria-haspopup="menu" aria-expanded={isAccountMenuOpen} onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} >
              <p className="header__username">{currentUser?.name}'s Account</p>
              <img className="header__dropdown-btn__img" src={isAccountMenuOpen ? chevronUp : chevronDown}/>
            </button>

            {isAccountMenuOpen && (
              <ul className="header__menu" role="menu">
                <li role="none">
                  <button role="menuitem" type="button" className="header__menu__logout-btn" onClick={handleLogout} >
                    <p className="header__menu__logout-btn__text">Logout</p>
                    <img className="header__menu__logout-btn__img" src={logoutIcon}/>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </ div>
      )}
    </header> 
  ); 
}