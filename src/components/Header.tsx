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
            <a href="">GRIND</a>
          </li>
          <li>
            <a href="">HUSTLE</a>
          </li>
          <li>
            <a href="">STRIVE</a>
          </li>
          <li>
            <a href="">THRIVE</a>
          </li>
          <li>
            <a href="">EXCEL</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
