import { SvgGithub, SvgUsers } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  const developers = [
    { name: "Shamuran", git: "https://github.com/Ahmad-nba" },
    { name: "Shubham", git: "https://github.com/1" },
    { name: "Anthony", git: "https://github.com/" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-viking-950 text-viking-100 px-6 py-8 text-sm md:text-base flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
      {/* GitHub Link */}
      <Link
        href="https://github.com/chingu-voyages/V56-tier2-team-23"
        className="flex items-center space-x-2 hover:text-accentMain transition-colors cursor-pointer"
      >
        <SvgGithub className="text-xl" />
        <span>View Project on GitHub</span>
      </Link>

      {/* Developer Team */}
      <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-x-4 flex-wrap justify-center">
        <span className="flex items-center space-x-2 text-viking-300">
          <SvgUsers className="text-xl" />
          <span className="font-semibold">Development Team:</span>
        </span>
        <span className="flex items-center space-x-2 flex-wrap justify-center">
          {developers.map((dev, i) => (
            <span key={dev.git} className="flex items-center">
              <Link
                href={dev.git}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-accentMain transition-colors cursor-pointer"
              >
                <SvgGithub className="text-lg" />
                <span>{dev.name}</span>
              </Link>
              {i < developers.length - 1 && (
                <span className="mx-2 text-viking-400">•</span>
              )}
            </span>
          ))}
        </span>
      </div>

      {/* Copyright */}
      <div className="text-xs sm:text-sm text-viking-300">
        &copy; {year} Surgery Status Board. All rights reserved.
      </div>
    </footer>
  );
}