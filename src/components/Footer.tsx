export default function Footer() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-5">
      <footer className="w-full max-w-6xl rounded-2xl card-glass before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none">
        <div className="relative px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 z-10">
          <p>
            &copy; {new Date().getFullYear()} slickLink. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:askvishal.me@gmail.com"
              className="hover:text-white transition-colors duration-300">
              Mail
            </a>
            <a
              href="https://github.com/rajput-vishal01"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300">
              GitHub
            </a>
            <a
              href="https://askvishal.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
