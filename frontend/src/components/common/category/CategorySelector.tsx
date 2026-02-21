import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../api/categoryApi";
import { getCurrentUser } from "../../../api/authApi";

const CategorySelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUser });

  const userCategories = (() => {
    const payload = categoriesData?.data;
    if (!payload || !Array.isArray(payload)) return [] as string[];

    const isAdmin = currentUser?.user?.role === "admin";
    if (isAdmin) {
      return Array.from(new Set(payload.map((d: any) => d?.name).filter(Boolean)));
    }

    return payload
      .filter((d: any) => (d?.userId?._id || d?.userId) === currentUser?.user?._id)
      .map((d: any) => d?.name)
      .filter(Boolean);
  })();

  if (!userCategories || userCategories.length === 0) {
    return <p className="text-sm text-slate-400">No categories available. Please add a category first.</p>;
  }

  return (
    <select name="category" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" required>
      <option value="">Select Category</option>
      {userCategories.map((c: string) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
};

export default CategorySelector;