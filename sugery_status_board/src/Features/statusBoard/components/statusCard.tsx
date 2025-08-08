import { StatusCardData } from "../utils/utils";

export default function StatusCard() {
  return (
    <>
      {StatusCardData.map((card) => (
        <article
          key={card.status}
          className="flex flex-col items-center justify-center space-y-2 border border-viking-100 bg-viking-50 p-4 rounded-2xl shadow-sm min-w-[150px] text-center"
        >
          <div className={`h-6 w-6 rounded-full ${card.indicator}`} />
          <div>
            <h3 className="font-semibold text-sm text-viking-950">{card.status}</h3>
            <p className="text-xs text-viking-700">{card.desc}</p>
          </div>
        </article>
      ))}
    </>
  );
}
