import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data available",
  description = "There is nothing to display here yet.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
        <Inbox size={26} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-smart-primary">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-smart-secondary">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
