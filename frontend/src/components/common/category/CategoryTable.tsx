import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getCategories, deleteCategory } from "../../../api/categoryApi";
import { getCurrentUser } from "../../../api/authApi";
import AddCategoryForm from "./AddCategoryForm";
import { useConfirm } from "../confirm/ConfirmProvider";
import TablePaginationControls from "../table/TablePaginationControls";

const CategoryTable = () => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { data, isLoading, isError, error } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUser });

  const isAdmin = currentUser?.user?.role === "admin";

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<{ name: string; userId?: string } | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const categoriesList = useMemo(() => {
    const payload = data?.data;
    if (!payload) return [] as any[];

    if (isAdmin) {
      const rows: any[] = [];
      (payload as any[]).forEach((doc: any) => {
        (doc.categories || []).forEach((c: string) => rows.push({ name: c, user: doc.user }));
      });
      return rows.filter((r) => r.name.toString().toLowerCase().includes(search.toLowerCase()));
    }

    const arr = (payload?.categories) || [];
    return arr.filter((n: string) => n.toString().toLowerCase().includes(search.toLowerCase())).map((n: string) => ({ name: n }));
  }, [data, isAdmin, search]);

  const categoriesTable = useReactTable({
    data: categoriesList,
    columns: [{ id: "row", accessorFn: (row) => row }],
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const paginatedCategories = categoriesTable.getRowModel().rows.map((row) => row.original);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, isAdmin]);

  const { mutate } = useMutation({ mutationFn: (payload :  { name: string }) => deleteCategory(payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }) });

  const handleDeleteCategory = async (payload: { name: string }) => {
    const shouldDelete = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      intent: "danger",
    });
    if (shouldDelete) mutate(payload);
  };

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-400">{(error as any)?.response?.data?.message || "Something went wrong"}</p>;

  return (
    <div className="rounded-2xl bg-[#0b172a]/90 ring-1 ring-white/5">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Category List</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 ps-2">
            <input
              placeholder="Search by category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-[#0f2037] border border-[#2a466f] text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <button className="flex items-center gap-2 rounded-lg border border-sky-400/40 bg-[#177db8] px-4 py-2 text-sm text-white transition hover:bg-[#1f8bcb]" onClick={() => setShowAdd(true)}>
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-left text-slate-200 hidden sm:table">
          <thead className="bg-[#10223d] text-slate-300 uppercase text-[11px] tracking-[0.08em]">
            <tr>
              <th className="px-6 py-4">Category</th>
              {isAdmin && <th className="px-6 py-4">Added By</th>}
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {categoriesList?.length > 0 ? (
              paginatedCategories.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#122642]/70 transition">
                  <td className="px-6 py-4">{item.name}</td>
                  {isAdmin && <td className="px-6 py-4 text-slate-400 whitespace-nowrap">Name : {item.user?.name} <br /> {item.user?.email}</td>}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setEditItem({ name: item.name, userId: item.user?._id }); setShowEdit(true); }} className="rounded-lg bg-sky-600/20 p-2 text-sky-300 transition hover:bg-[#1f8bcb] hover:text-white"><Pencil size={16} /></button>
                      <button onClick={() => handleDeleteCategory({ name: item.name })} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="text-center py-6 text-slate-400">No Categories Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden p-4 space-y-4">
        {categoriesList?.length > 0 ? (
          paginatedCategories.map((item: any, idx: number) => (
            <div key={idx} className="rounded-xl bg-[#0b172a]/95 p-4 ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{item.name}</h3>
                  {isAdmin && <p className="text-sm text-slate-400">Added By: {item.user?.name}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditItem({ name: item.name, userId: item.user?._id }); setShowEdit(true); }} className="rounded-lg bg-sky-600/20 p-2 text-sky-300 transition hover:bg-[#1f8bcb] hover:text-white"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteCategory({ name: item.name })} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Categories Found</div>
        )}
      </div>

      <TablePaginationControls table={categoriesTable} />

      {showAdd && (
        <div className="p-6">
          <AddCategoryForm onClose={() => setShowAdd(false)} />
        </div>
      )}

      {showEdit && editItem && (
        <div className="p-6">
          <AddCategoryForm initialName={editItem.name} userId={editItem.userId} onClose={() => { setShowEdit(false); setEditItem(null); }} />
        </div>
      )}
    </div>
  );
};

export default CategoryTable;



