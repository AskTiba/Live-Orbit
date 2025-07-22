import { IconType } from "react-icons";

interface HomeCardProps {
  Icon: IconType;
  header: string;
  desc: string;
}

export default function HomeCard({ Icon, header, desc }: HomeCardProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <Icon size={40} className="text-steel-blue-600 mb-4" />
      <h1 className="font-bold text-xl text-steel-blue-900 text-center mb-2">
        {header}
      </h1>
      <p className="text-steel-blue-700 text-center text-base">{desc}</p>
    </div>
  );
}
