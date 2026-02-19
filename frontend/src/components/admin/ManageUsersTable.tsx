import  { useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "../../api/userApi";

const ManageUsersTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Search and sort state
  const [userSearch, setUserSearch] = useState("");
  const [userSortOrder, setUserSortOrder] = useState<"asc" | "desc">("asc");

  const usersList = useMemo(() => {
    const items = data?.users || [];
    const q = userSearch?.toString().toLowerCase() || "";
    const filtered = q
      ? items.filter((u: any) => (u.name || "").toString().toLowerCase().includes(q))
      : items;

    const mapped = [...filtered].sort((a: any, b: any) => {
      const rolePriority = (r: string) => {
        const rr = (r || "").toString().toLowerCase();
        if (rr === "admin") return 0;
        if (rr === "user") return 1;
        return 2; 
      };

      const pa = rolePriority(a.role);
      const pb = rolePriority(b.role);
      if (pa === pb) return (a.name || "").toString().localeCompare((b.name || "").toString());
      return userSortOrder === "asc" ? pa - pb : pb - pa;
    });

    return mapped;
  }, [data?.users, userSearch, userSortOrder]);

  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading)
    return <p className="text-white p-6">Loading...</p>;

  if (isError)
    return (
      <p className="text-red-400 p-6">
        {(error as Error).message}
      </p>
    );

return (
  <div className="bg-gray-900 rounded-xl border border-gray-800">
    <div className="px-6 py-4 border-b border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          User Management
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            placeholder="Search by user name..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={userSortOrder}
            onChange={(e) => setUserSortOrder(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="asc">Role: Admin → User</option>
            <option value="desc">Role: User → Admin</option>
          </select>

          <button
            onClick={() => navigate(ROUTES.ADMIN.ADD_USERS)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition shadow-md"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>
    </div>

    {/* ================= DESKTOP TABLE ================= */}
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm text-left text-gray-300 hidden sm:table">
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {usersList?.length > 0 ? (
            usersList.map((user: any) => (
              <tr
                key={user._id}
                className="hover:bg-gray-800/60 transition"
              >
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {user.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-indigo-600/20 text-indigo-400"
                        : "bg-green-600/20 text-green-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/update-user/${user._id}`)
                      }
                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => mutate(user._id)}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-400">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* ================= MOBILE CARD VIEW ================= */}
    <div className="sm:hidden p-4 space-y-4">
      {usersList?.length > 0 ? (
        usersList.map((user: any) => (
          <div
            key={user._id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {user.email}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  user.role === "admin"
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "bg-green-600/20 text-green-400"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() =>
                  navigate(`/update-user/${user._id}`)
                }
                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => mutate(user._id)}
                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">
          No Users Found
        </div>
      )}
    </div>
  </div>
  );


};

export default ManageUsersTable;
