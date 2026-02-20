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
    <div className="bg-[#0b172a]/90 rounded-2xl border border-[#244066]">
      <div className="px-6 py-4 border-b border-[#213a60] flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Users</h2>
        <button
          onClick={() => navigate(ROUTES.ADMIN.MANAGE_USERS)}
          className="flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200 transition"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-200 hidden sm:table">
          <thead className="bg-[#10223d] text-slate-300 uppercase text-[11px] tracking-[0.08em]">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {recentUsers.length > 0 ? (
              recentUsers.map((user: any) => (
                <tr key={user._id} className="hover:bg-[#122642]/70 transition">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-sky-600/20 text-sky-300"
                        : "bg-green-600/20 text-green-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
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
            <div key={user._id} className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-sky-600/20 text-sky-300' : 'bg-green-600/20 text-green-400'}`}>{user.role}</p>
                  <p className="text-sm text-slate-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Recent Users</div>
        )}
      </div>
    </div>
  );
};

export default UserRecentTable;




