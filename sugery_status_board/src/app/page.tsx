"use client";
import { cardData } from "@/utils/cardData";
import AuthModule from "./Auth/page";
import HomeCard from "./components/homeCard";
import Image from "next/image";
import logo from "../../public/assets/logo.svg";
import { useAuth } from "@/Features/auth/hooks/useAuth";
import { useAuthStore } from "@/Features/auth/store/useAuthStore";
import SvgUser from "@/components/icons/User";

export default function HomePage() {
  const { isLoggedIn, fullName, role } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  return (
    <main>
      <section className="flex flex-col justify-center items-center mt-10 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Image
            src={logo}
            alt="Live Orbit Logo"
            width={200}
            height={100}
            className="object-contain mb-4"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-viking-950 leading-tight mb-4">
            Live Orbit: Patient Progress Tracking
          </h1>
          <h3 className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Keeping families, loved ones informed and surgical teams coordinated
            with real-time patient progress tracking.
          </h3>
        </div>
      </section>
      {/* card section  */}
      <section className="grid mt-12 gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {cardData.map((card) => {
          return (
            <HomeCard
              key={card.desc}
              Icon={card.Icon}
              header={card.header}
              desc={card.desc}
            />
          );
        })}
      </section>
      {/* auth module */}
      <section className="mx-auto mt-10">
        {!isLoggedIn ? (
          <AuthModule />
        ) : (
          <section className="flex flex-col mx-auto mb-8 py-6 justify-center items-center shadow-lg rounded-lg bg-white p-6 w-[90%] sm:w-[50%] lg:w-[30%] space-y-4 border border-gray-100">
            <section className="flex justify-center items-center space-x-3 text-viking-950">
              <SvgUser className="size-6" />
              <p className="text-xl font-semibold">Welcome, {fullName}!</p>
            </section>
            <p className="text-gray-700 text-lg">
              You are logged in as:{" "}
              <span className="font-bold text-accentMain capitalize">
                {role}
              </span>
            </p>
            <button
              onClick={() => logout()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md w-full max-w-xs cursor-pointer"
            >
              Log Out
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
// land page
