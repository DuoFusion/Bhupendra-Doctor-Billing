import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "../../../constants/Routes";

type Props = {
  users: any[];
};

const UserRecentTable = ({ users = [] }: Props) => {
  const navigate = useNavigate();

  const recentUsers = (users || [])
    .slice()
    .sort((a: any, b: any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Users</h2>
        <button
          onClick={() => navigate(ROUTES.ADMIN.MANAGE_USERS)}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300 hidden sm:table">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {recentUsers.length > 0 ? (
              recentUsers.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-800/60 transition">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-indigo-600/20 text-indigo-400"
                        : "bg-green-600/20 text-green-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  No Recent Users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile compact view */}
      <div className="sm:hidden p-4 space-y-4">
        {recentUsers.length > 0 ? (
          recentUsers.map((user: any) => (
            <div key={user._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-green-600/20 text-green-400'}`}>{user.role}</p>
                  <p className="text-sm text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No Recent Users</div>
        )}
      </div>
    </div>
  );
};

export default UserRecentTable;
