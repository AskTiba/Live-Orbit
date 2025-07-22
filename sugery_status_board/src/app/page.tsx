import { cardData } from "@/utils/cardData";
import AuthModule from "./Auth/page";
import HomeCard from "./components/homeCard";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="w-24 h-24 bg-accentMain2 rounded-lg mx-auto mb-6"></div>
        <h1 className="text-5xl font-bold text-steel-blue-900 mb-4">
          Welcome to Live Orbit
        </h1>
        <p className="text-lg text-steel-blue-700 max-w-2xl mx-auto">
          Keeping families and loved ones informed with real-time patient
          progress tracking, ensuring seamless coordination among surgical
          teams.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardData.map((card) => (
            <HomeCard
              key={card.desc}
              Icon={card.Icon}
              header={card.header}
              desc={card.desc}
            />
          ))}
        </div>
      </section>

      {/* Auth Section */}
      <section className="py-16 bg-steel-blue-50 rounded-lg">
        <div className="max-w-lg mx-auto">
          <AuthModule />
        </div>
      </section>
    </main>
  );
}
// land page
