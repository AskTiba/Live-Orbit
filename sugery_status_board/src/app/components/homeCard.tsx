export default function HomeCard({
  Icon,
  header,
  desc,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  header: string;
  desc: string;
}) {
  return (
    <article className="flex mx-auto flex-col rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-viking-50 border border-viking-100 sm:w-[20vw] w-[45vw] items-center text-center space-y-4 cursor-pointer">
      <div className="bg-viking-200/20 w-16 h-16 flex justify-center items-center rounded-full shadow-inner">
        <Icon className="text-viking-400 size-8 sm:size-10 stroke-2" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-viking-950 capitalize">
          {header}
        </h2>
        <p className="text-sm sm:text-base text-viking-700 leading-relaxed">
          {desc}
        </p>
      </div>
    </article>
  );
}
