import { Loader } from "lucide-react";

const buttonLoader = (isLoading, initialStatus) => {
  const label =
    {
      true: (
        <div className="flex gap-2">
          <Loader className="animate-spin" /> <span>Loading...</span>
        </div>
      ),
      false: initialStatus,
    }[isLoading] || initialStatus;

  return label;
};

export { buttonLoader };
