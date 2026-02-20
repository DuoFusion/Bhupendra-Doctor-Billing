import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/Routes";
import { URL_KEYS } from "../../../constants/Url";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompany, getAllCompanies } from "../../../api/companyApi";
import { getCurrentUser } from "../../../api/authApi";

const CompanyTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  // Search state for companies
  const [companySearch, setCompanySearch] = useState("");

  const companiesList = useMemo(() => {
    const items = data?.companies || [];
    if (!companySearch) return items;
    const q = companySearch.toString().toLowerCase();
    return items.filter((c: any) =>
      (c.companyName || "").toString().toLowerCase().includes(q),
    );
  }, [data?.companies, companySearch]);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const isAdmin = currentUser?.user?.role === "admin";

  const { mutate } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  if (isLoading) return <p className="text-center p-6">Loading...</p>;
  if (isError)
    return (
      <p className="text-center p-6 text-red-400">
        {(error as any)?.response?.data?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="bg-[#0b172a]/90 rounded-2xl border border-[#244066]">
      <div className="px-6 py-4 border-b border-[#213a60]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Company List</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 ps-2">
            <label htmlFor="company-search" className="sr-only">
              Search companies
            </label>
            <input
              id="company-search"
              placeholder="Search by company name..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-[#0f2037] border border-[#2a466f] text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <button
              className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-sm px-4 py-2 rounded-lg transition "
              onClick={() => navigate(ROUTES.COMPANY.ADD_COMPANY)}
            >
              <Plus size={16} />
              Add Company
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-sm text-left text-slate-200 hidden sm:table">
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
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {companiesList?.length > 0 ? (
              companiesList.map((company: any) => (
                <tr
                  key={company._id}
                  className="hover:bg-[#122642]/70 transition"
                >
                  <td className="px-6 py-4 min-w-[220px] font-medium flex items-center gap-3">
                    <img
                      src={
                        company.logoImage
                          ? company.logoImage.startsWith("http")
                            ? company.logoImage
                            : `http://localhost:7000${URL_KEYS.UPLOAD.GET_IMAGE}/${company.logoImage}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={company.companyName || "logo"}
                      className="w-10 h-10 rounded-lg object-cover border border-[#2a466f]"
                    />
                    {company.companyName}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      Name : {company.user?.name} <br />
                      {company.user?.email}
                    </td>
                  )}

                  <td className="px-6 py-4">{company.gstNumber}</td>
                  <td className="px-6 py-4">{company.phone}</td>
                  <td className="px-6 py-4">{company.email}</td>
                  <td className="px-6 py-4">{company.city}</td>
                  <td className="px-6 py-4">{company.state}</td>
                  <td className="px-6 py-4">{company.pincode}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        className="p-2 bg-sky-600/20 text-sky-300 rounded-lg hover:bg-gradient-to-r from-sky-600 to-blue-600 hover:text-white transition"
                        onClick={() =>
                          navigate(`/update-company/${company._id}`)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => mutate(company._id)}
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
                <td
                  colSpan={isAdmin ? 9 : 8}
                  className="text-center py-6 text-slate-400"
                >
                  No Companies Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden p-4 space-y-4">
        {companiesList?.length > 0 ? (
          companiesList.map((company: any) => (
            <div
              key={company._id}
              className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    company.logoImage
                      ? company.logoImage.startsWith("http")
                        ? company.logoImage
                        : `http://localhost:7000${URL_KEYS.UPLOAD.GET_IMAGE}/${company.logoImage}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="logo"
                  className="w-12 h-12 rounded-lg object-cover border border-[#2a466f]"
                />

                <div>
                  <h3 className="text-white font-medium">
                    {company.companyName}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {company.city}, {company.state}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-200 space-y-1">
                <p>GST: {company.gstNumber}</p>
                <p>Phone: {company.phone}</p>
                <p>Email: {company.email}</p>
                <p>Pincode: {company.pincode}</p>

                {isAdmin && (
                  <p className="text-slate-400">
                    Added By: {company.user?.name}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/update-company/${company._id}`)}
                  className="p-2 bg-sky-600/20 text-sky-300 rounded-lg hover:bg-gradient-to-r from-sky-600 to-blue-600 hover:text-white transition"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => mutate(company._id)}
                  className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Companies Found</div>
        )}
      </div>
    </div>
  );
};

export default CompanyTable;



