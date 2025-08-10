"use client";
import { SvgMonitor, SvgUser } from "@/components/icons";
import Link from "next/link";
import { handleLogin } from "../../Features/auth/utils/authHandler";
import { useRouter } from "next/navigation";
import { useState } from "react";

// auth module
export default function AuthModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleLogin(email, password);
    if (success) {
      router.push("/"); // 🔁 redirect after successful login
    } else {
      setError("Invalid email or password");
    }
  };
  return (
    <article className="sm:w-[60%] md:w-[40%] w-[80%] mx-auto flex flex-col justify-center p-4 shadow m-2 items-center">
      <h1 className="font-bold font-header text-lg text-center">
        Acess Life Orbit{" "}
      </h1>
      <h2 className="text-gray-600 text-center">
        Login to access surgery data or continue as visitor to access status
        board
      </h2>
      <form className="grid grid-cols-1 gap-y-2 " onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user-email">
            <span className="text-red-600">*</span>Email:
          </label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            className="w-[100%] p-2 border rounded border-gray-300 outline-viking-200"
            placeholder="eg johndoe@gmail.com"
          />
        </div>
        <div>
          <label htmlFor="user-password">
            <span className="text-red-600">*</span>Password:
          </label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-[100%] p-2 rounded border border-gray-300 outline-viking-200"
            placeholder="*****"
          />
        </div>

        <button
          type="submit"
          className="bg-viking-400 w-[80%] flex justify-center items-center space-x-3 py-2 mx-[10%] mt-2 rounded-lg text-white hover:bg-viking-200 cursor-pointer"
        >
          <p>Sign In</p>
          <SvgUser />
        </button>
        <p className="text-sm text-center text-red-400"> {error}</p>

        {/* <button className="px-1.5 ">Show dummy credentials</button> */}
      </form>

      <hr className="w-[90%] mx-[5%] text-gray-500 mt-6 mb-4 " />

      <Link
        href={"/"}
        className="bg-gray-100 w-[80%] flex justify-center items-center space-x-3 py-2 mx-[10%] mt-2 rounded-lg text-viking-950 hover:bg-gray-400 cursor-pointer"
      >
        Continue as visitor
        <SvgMonitor className="size-4" />
      </Link>
    </article>
  );
}
