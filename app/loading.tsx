import { PageLoading } from "@/components/sections";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <PageLoading label="Loading page" />
    </div>
  );
}