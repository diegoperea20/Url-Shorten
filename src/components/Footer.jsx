import "./footer.css";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-text">
            Created by{" "}
            <Link
              href="https://github.com/diegoperea20"
              className="footer-link"
            >
              Diego Ivan Perea Montealegre
            </Link>
          </p>
          <p className="footer-copyright">
            © {currentYear} URL Shortener. All rights reserved.
          </p>
        </div>

        <div className="footer-social">
          <Link
            href="https://github.com/diegoperea20"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/diego-perea-montealegre"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin />
          </Link>
          <Link
            href="https://diegoperea20.github.io/diego-ivan-perea-montealegre-cv/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Web site Profile"
          >
            <FaGlobe />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
