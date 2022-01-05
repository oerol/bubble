import logo from "../logo.svg";
import "./header-style.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <div id="logo-holder">
        {" "}
        <img src={logo} alt="" />
        <h1>BUBBLE</h1>
      </div>

      <div id="menu-items">
        <ul>
          <li>
            <a href="">News</a>
          </li>
          <li>
            <a href="">Observing</a>
          </li>
          <li>
            <a href="">Resources</a>
          </li>
          <li>
            <a href="">Community</a>
          </li>
          <li>
            <a href="">About Us</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
