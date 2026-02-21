import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCategory, getCategories, updateCategory } from "../../../api/categoryApi";
import { getCurrentUser } from "../../../api/authApi";

interface Props {
  onClose?: () => void;
  initialName?: string;
  categoryId?: string;
}

const AddCategoryForm = ({ onClose, initialName, categoryId }: Props) => {
  const [name, setName] = useState(initialName || "");
  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  const suggestions = useMemo(() => {
    const payload = categoriesData?.data;
    if (!payload) return [] as string[];

    const docs = Array.isArray(payload) ? payload : [];
    const isAdmin = currentUser?.user?.role === "admin";
    const editDoc = docs.find((d: any) => d._id === categoryId);
    const targetUserId = isAdmin
      ? (editDoc?.userId?._id || editDoc?.userId)
      : currentUser?.user?._id;

    return docs
      .filter((d: any) => {
        const uid = d?.userId?._id || d?.userId;
        return isAdmin ? uid === targetUserId : uid === currentUser?.user?._id;
      })
      .map((d: any) => d?.name)
      .filter(Boolean);
  }, [categoriesData, currentUser, categoryId]);

  const addMut = useMutation({
    mutationFn: (payload: { name: string }) => addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      onClose && onClose();
    },
  });

  const updateMut = useMutation({
    mutationFn: (payload: { id: string; name: string }) => updateCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      onClose && onClose();
    },
  });

  const isEdit = !!initialName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (isEdit) {
      updateMut.mutate({
        id: categoryId!,
        name: name.trim(),
      });
    } else {
      addMut.mutate({ name: name.trim() });
    }
  };

  const isLoading = isEdit ? updateMut.isPending : addMut.isPending;
  const isError = isEdit ? updateMut.isError : addMut.isError;
  const error = isEdit ? updateMut.error : addMut.error;

  return (
    <div className="bg-[#0b172a]/95 rounded-xl border border-[#1e3354] p-6">
      <h3 className="mb-4 text-lg font-medium">
        {isEdit ? "Update Category" : "Add Category"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm text-slate-400">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter category"
            required
          />
        </div>

        {name && suggestions.length > 0 && (
          <div className="text-sm text-slate-400 space-y-1">
            {suggestions
              .filter((s: any) =>
                s.toString().toLowerCase().includes(name.toLowerCase())
              )
              .slice(0, 6)
              .map((s: any) => (
                <div
                  key={s}
                  className="px-3 py-1 bg-[#0f2037] rounded cursor-pointer hover:bg-[#1f334f]"
                  onClick={() => setName(s)}
                >
                  {s}
                </div>
              ))}
          </div>
        )}

        {isError && (
          <p className="text-red-400">
            {(error as any)?.response?.data?.message ||
              (isEdit
                ? "Failed to update category"
                : "Failed to add category")}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setName("");
              onClose && onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#1f334f] hover:bg-[#29456b] text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg border border-sky-400/40 bg-[#177db8] px-4 py-2 text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
          >
            {isEdit ? "Update" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;