import logo from "../logo.svg";
import "./header-style.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <img src={logo} alt="" />
      <h1>BUBBLE</h1>
    </header>
  );
};

export default Header;
