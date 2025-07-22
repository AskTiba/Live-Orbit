import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import Logo from "./Logo";

export default function Footer() {
  const developers = [
    { name: "Shamuran", git: "https://github.com/Ahmad-nba" },
    { name: "Shubham", git: "https://github.com/1" },
    { name: "Anthony", git: "https://github.com/" },
    // { name: "Gisele", git: "https://github.com/" },
    // { name: "Tushar", git: "https://github.com/" },
    // { name: "jd", git: "https://github.com/" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Status Board", href: "/status" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="bg-steel-blue-950 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4">
              <Logo color="white" width={150} height={40} />
            </Link>

            <div className="flex flex-col gap-2 text-center ml-3 md:text-left">
              <p className="text-steel-blue-300 text-sm">
                Real-time patient progress tracking.
              </p>
              <Link
                href="https://github.com/chingu-voyages/v56-tier2-team-23"
                target="_blank"
                rel="noopener noreferrer"
                className="text-steel-blue-300 hover:text-white transition-colors flex items-center justify-center md:justify-start space-x-2"
              >
                <FiGithub size={20} />
                <span className="text-sm">View on GitHub</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-around md:justify-between gap-8 md:gap-0">
            {/* Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 text-steel-blue-100">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-steel-blue-300 hover:text-steel-blue-100 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Development Team */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 text-steel-blue-100">
                Development Team
              </h3>
              <ul className="space-y-2">
                {developers.map((dev) => (
                  <li key={dev.name}>
                    <Link
                      href={dev.git}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-steel-blue-300 hover:text-steel-blue-100 transition-colors text-sm"
                    >
                      {dev.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-steel-blue-800 pt-8 text-center text-steel-blue-400 text-sm">
          <p>&copy; {year} Surgery Status Board. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
