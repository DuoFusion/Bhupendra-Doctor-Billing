import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCategory, getCategories, updateCategory } from "../../../api/categoryApi";
import { getCurrentUser } from "../../../api/authApi";

interface Props {
  onClose?: () => void;
  initialName?: string;
  userId?: string;
}

const AddCategoryForm = ({ onClose, initialName, userId }: Props) => {
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

  // Suggestions logic (works for both admin & user)
  const suggestions = useMemo(() => {
    const payload = categoriesData?.data;
    if (!payload) return [] as string[];

    // Admin case (array of user documents)
    if (Array.isArray(payload)) {
      const targetUserId =
        currentUser?.user?.role === "admin" && userId
          ? userId
          : currentUser?.user?._id;

      const doc = payload.find((d: any) => d.user?._id === targetUserId);
      return doc?.categories || [];
    }

    // Normal user case
    return payload?.categories || [];
  }, [categoriesData, currentUser, userId]);

  const addMut = useMutation({
    mutationFn: (payload: { name: string }) => addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      onClose && onClose();
    },
  });

  const updateMut = useMutation({
    mutationFn: (payload: {
      oldName: string;
      newName: string;
      userId?: string;
    }) => updateCategory(payload),
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
        oldName: initialName!,
        newName: name.trim(),
        userId,
      });
    } else {
      addMut.mutate({ name: name.trim() });
    }
  };

  // ✅ TanStack v5 fix
  const isLoading = isEdit ? updateMut.isPending : addMut.isPending;
  const isError = isEdit ? updateMut.isError : addMut.isError;
  const error = isEdit ? updateMut.error : addMut.error;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Category" : "Add Category"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter category"
            required
          />
        </div>

        {/* Live Suggestions */}
        {name && suggestions.length > 0 && (
          <div className="text-sm text-gray-400 space-y-1">
            {suggestions
              .filter((s : any) =>
                s.toString().toLowerCase().includes(name.toLowerCase())
              )
              .slice(0, 6)
              .map((s :any) => (
                <div
                  key={s}
                  className="px-3 py-1 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
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
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
          >
            {isEdit ? "Update" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;