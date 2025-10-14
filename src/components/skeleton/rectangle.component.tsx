export const Skeleton = ({
  type,
}: {
  type: "square" | "rectangle" | "circle";
}) => {
  return (
    <div
      role="status"
      className="z-1 h-12 w-full bg-gray-300 rounded-sm animate-pulse dark:bg-gray-300"
    />
  );
};
