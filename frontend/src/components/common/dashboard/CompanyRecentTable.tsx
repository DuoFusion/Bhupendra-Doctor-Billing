import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "../../../constants/Routes";

type Props = {
  companies: any[];
  currentUserRole?: string;
};

const CompanyRecentTable = ({ companies = [], currentUserRole }: Props) => {
  const navigate = useNavigate();

  const isAdmin = currentUserRole === "admin";

  const recentCompanies = (companies || [])
    .slice()
    .sort((a: any, b: any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#0b172a]/90 rounded-2xl border border-[#244066]">
      <div className="px-6 py-4 border-b border-[#213a60] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Companies</h2>
        <button
          onClick={() => navigate(ROUTES.COMPANY.GET_COMPANY)}
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
              <th className="px-6 py-4">Company</th>
              {isAdmin && <th className="px-6 py-4">Added By</th>}
              <th className="px-6 py-4">GST</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">Pincode</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {recentCompanies.length > 0 ? (
              recentCompanies.map((company: any) => (
                <tr key={company._id} className="hover:bg-[#122642]/70 transition">
                  <td className="px-6 py-4 font-medium text-white">
                    {company.companyName}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-400">
                      {company.user?.name} <br />
                      {company.user?.email}
                    </td>
                  )}

                  <td className="px-6 py-4">{company.gstNumber}</td>
                  <td className="px-6 py-4">{company.phone}</td>
                  <td className="px-6 py-4">{company.email}</td>
                  <td className="px-6 py-4">{company.city}</td>
                  <td className="px-6 py-4">{company.state}</td>
                  <td className="px-6 py-4">{company.pincode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center py-6 text-slate-400">
                  No Recent Companies
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile compact view */}
      <div className="sm:hidden p-4 space-y-4">
        {recentCompanies.length > 0 ? (
          recentCompanies.map((company: any) => (
            <div key={company._id} className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{company.companyName}</h3>
                  <p className="text-sm text-slate-400">{company.email || company.phone || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Recent Companies</div>
        )}
      </div>
    </div>
  );
};

export default CompanyRecentTable;



