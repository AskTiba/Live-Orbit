import { StatusCardData } from "../utils/utils";

export default function StatusCard() {
  return (
    <>
      {StatusCardData.map((card) => (
        <article
          key={card.status}
          className="flex flex-col items-center justify-center space-y-2 border border-gray-200 bg-white p-4 rounded-2xl shadow-sm min-w-[150px] text-center"
        >
          <div className={`h-6 w-6 rounded-full ${card.indicator}`} />
          <div>
            <h3 className="font-semibold text-sm text-gray-800">{card.status}</h3>
            <p className="text-xs text-gray-500">{card.desc}</p>
          </div>
        </article>
      ))}
    </>
  );
}
