import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="logo" id="headerLogo">
  <img src="./Logo.png" alt="Logo" />
</div>
      <nav className="nav-menu">
        <ul>
          <li><a href="#">ABOUT US</a></li>
          <li><a href="#">PRODUCTS</a></li>
          <li><a href="#">SERVICE & MAINTENANCE</a></li>
          <li><a href="#">RESOURCES</a></li>
                    <li><a href="#">CONTACT US</a></li>

        </ul>
      </nav>
    </header>
  );
}
