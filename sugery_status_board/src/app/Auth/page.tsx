import Link from "next/link";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { LuLogIn } from "react-icons/lu";

// auth module
export default function AuthModule() {
  return (
    <article className="w-full max-w-md mx-auto flex flex-col justify-center p-6 shadow-lg rounded-lg bg-white">
  <h1 className="text-2xl font-bold text-center text-steel-blue-900 mb-2">
    Access Live Orbit
  </h1>
  <h2 className="text-steel-blue-700 text-center mb-6">
    Login to access surgery data or continue as a visitor to view the status
    board.
  </h2>
  <form className="space-y-4" action="">
    <div>
      <label htmlFor="user-email" className="block text-steel-blue-800 mb-1">
        <span className="text-red-600">*</span>Email:
      </label>
      <input
        required
        id="email"
        type="email"
        className="w-full p-3 border rounded-lg border-steel-blue-300 focus:outline-none focus:ring-2 focus:ring-steel-blue-500"
        placeholder="eg, johndoe@gmail.com"
      />
    </div>
    <div>
      <label
        htmlFor="user-password"
        className="block text-steel-blue-800 mb-1"
      >
        <span className="text-red-600">*</span>Password:
      </label>
      <input
        required
        type="password"
        className="w-full p-3 border rounded-lg border-steel-blue-300 focus:outline-none focus:ring-2 focus:ring-steel-blue-500"
        placeholder="*****"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-steel-blue-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 hover:bg-steel-blue-700 transition-colors"
    >
      <span>Sign In</span>
      <LuLogIn />
    </button>

    <p className="text-center text-steel-blue-600 underline cursor-pointer hover:text-steel-blue-800">
      Show dummy credentials
    </p>
  </form>

  <hr className="my-6 border-steel-blue-200" />

  <Link
    href={"/"}
    className="w-full bg-steel-blue-100 text-steel-blue-800 py-3 rounded-lg flex justify-center items-center space-x-2 hover:bg-steel-blue-200 transition-colors"
  >
    <span>Continue as visitor</span>
    <MdOutlineMonitorHeart size="16" />
  </Link>
</article>
  );
}
