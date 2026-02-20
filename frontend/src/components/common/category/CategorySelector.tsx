import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../api/categoryApi";
import { getCurrentUser } from "../../../api/authApi";

const CategorySelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUser });

  const userCategories = (() => {
    const payload = categoriesData?.data;
    if (!payload) return [] as string[];

    // If backend returns an array (admin view), flatten all categories for admin
    if (Array.isArray(payload)) {
      const isAdmin = currentUser?.user?.role === "admin";
      if (isAdmin) {
        const all: string[] = [];
        (payload as any[]).forEach((doc: any) => {
          (doc.categories || []).forEach((c: string) => all.push(c));
        });
        // dedupe and return
        return Array.from(new Set(all));
      }

      // for normal users, find the user's document
      const doc = payload.find((d: any) => d.user?._id === currentUser?.user?._id);
      return doc?.categories || [];
    }

    return payload?.categories || [];
  })();

  if (!userCategories || userCategories.length === 0) {
    return <p className="text-sm text-gray-400">No categories available. Please add a category first.</p>;
  }

  return (
    <select name="category" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" required>
      <option value="">Select Category</option>
      {userCategories.map((c: string) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
};

export default CategorySelector;
