import  { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, View } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/Routes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBills, deleteBill } from "../../../api/billApi";
import { getCurrentUser } from "../../../api/authApi";

const BillTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bills"],
    queryFn: getAllBills,
  });

  console.log(data)

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const [billSearch, setBillSearch] = useState("");
  const [billSortBy, setBillSortBy] = useState<"status" | "grandTotal" | "">("");
  const [billSortOrder, setBillSortOrder] = useState<"asc" | "desc">("asc");

  const billsList = useMemo(() => {
    const items = data?.bills || [];

    const search = (bill: any) => {
      if (!billSearch) return true;
      const q = billSearch.toString().toLowerCase();
      if ((bill.billNumber || "").toString().toLowerCase().includes(q)) return true;
      if ((bill.user?.name || "").toString().toLowerCase().includes(q)) return true;
      if ((bill.items?.[0]?.productName || "").toString().toLowerCase().includes(q)) return true;
      if ((bill.items?.[0]?.company?.companyName || "").toString().toLowerCase().includes(q)) return true;
      return false;
    };

    const filtered = items.filter(search);

    if (!billSortBy) return filtered;

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (billSortBy === "status") {
        const sa = (a.billStatus || "").toString().toLowerCase();
        const sb = (b.billStatus || "").toString().toLowerCase();
        if (sa === sb) return 0;
        const orderVal = (val: string) => (val === "paid" ? 1 : 0);
        const ra = orderVal(sa);
        const rb = orderVal(sb);
        if (ra < rb) return billSortOrder === "asc" ? -1 : 1;
        if (ra > rb) return billSortOrder === "asc" ? 1 : -1;
        return 0;
      }

      if (billSortBy === "grandTotal") {
        const va = Number(a.grandTotal || 0);
        const vb = Number(b.grandTotal || 0);
        if (va < vb) return billSortOrder === "asc" ? -1 : 1;
        if (va > vb) return billSortOrder === "asc" ? 1 : -1;
        return 0;
      }

      return 0;
    });

    return sorted;
  }, [data?.bills, billSearch, billSortBy, billSortOrder]);

  const isAdmin = currentUser?.user?.role === "admin";

  const { mutate } = useMutation({
    mutationFn: deleteBill,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bills"] }),
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
          <h2 className="text-lg font-semibold text-white">Bill List</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="bill-search" className="sr-only">Search bills</label>
            <input
              id="bill-search"
              aria-label="Search by bill number or product"
              placeholder="Search by bill number, product, company or user..."
              value={billSearch}
              onChange={(e) => setBillSearch(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-[#0f2037] border border-[#2a466f] text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-[260px]"
            />

            <select
              aria-label="Sort bills by"
              value={billSortBy}
              onChange={(e) => setBillSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm bg-[#0f2037] border border-[#2a466f] text-slate-100"
            >
              <option value="">No sort</option>
              <option value="status">Status (Paid / Unpaid)</option>
              <option value="grandTotal">Grand Total</option>
            </select>

            <button
              aria-pressed={billSortOrder === "desc"}
              title="Toggle sort order"
              onClick={() => setBillSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
              className="px-3 py-2 rounded-lg bg-[#0f2037] border border-[#2a466f] text-slate-100"
            >
              {billSortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button
              onClick={() => navigate(ROUTES.BILL.GENERATE_BILL)}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              <Plus size={16} />
              Generate Bill
            </button>

            {billSortBy && (
              <span className="ml-2 text-sm text-slate-200">Sorted by: <strong className="text-white">{billSortBy === 'status' ? 'Status' : 'Grand Total'} ({billSortOrder})</strong></span>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1800px] w-full text-sm text-left text-slate-200 hidden sm:table">
          <thead className="bg-[#10223d] text-slate-300 uppercase text-[11px] tracking-[0.08em]">
            <tr>
              <th className="px-6 py-4">SR No</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Bill Number</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total GST</th>
              <th className="px-6 py-4">Items</th>
              {isAdmin && <th className="px-6 py-4">Created By</th>}
              <th className="px-6 py-4">Sub Total</th>
              <th className="px-6 py-4">Grand Total</th>
              <th className="px-6 py-4 text-center">View Invoice</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {billsList?.length > 0 ? (
              billsList.map((bill: any, index: number) => (
                <tr key={bill._id} className="hover:bg-[#122642]/70 transition">
                  
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        bill.billStatus === "Paid"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {bill.billStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">{bill.billNumber}</td>

                  <td className="px-6 py-4">
                 {bill.items?.length
                    ? bill.items.map((item : any) => item.productName).join(", ")
                    : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {bill.items?.[0]?.company?.companyName || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {bill.createdAt
                      ? new Date(bill.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    ₹ {bill.totalGST}
                  </td>

                  <td className="px-6 py-4">
                    {bill.items?.length}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-400">
                      {bill.user?.name || "-"} <br />
                      {bill.user?.email || ""}
                    </td>
                  )}

                  <td className="px-6 py-4 font-semibold text-sky-300">
                    ₹ {bill.subTotal}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-400">
                    ₹ {bill.grandTotal}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition" onClick={()=>  navigate(ROUTES.BILL.VIEW_INVOICE.replace(":id", bill._id))}>
                      <View size={16} />
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(ROUTES.BILL.UPDATE_BILL.replace(":id", bill._id))
                        }
                        className="p-2 bg-sky-600/20 text-sky-300 rounded-lg hover:bg-gradient-to-r from-sky-600 to-blue-600 hover:text-white transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => mutate(bill._id)}
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
                  colSpan={isAdmin ? 13 : 12}
                  className="text-center py-6 text-slate-400"
                >
                  No Bills Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden p-4 space-y-4">
        {billsList?.length > 0 ? (
          billsList.map((bill: any) => (
            <div key={bill._id} className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{bill.billNumber}</h3>
                  <p className="text-sm text-slate-400">{bill.user?.name || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">₹{bill.grandTotal}</p>
                  <p className="text-sm text-slate-400">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-200">
                <p>Items: {bill.items?.length || 0}</p>
                <p>Products: {bill.items?.map((it:any) => it.productName).slice(0,3).join(', ')}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => navigate(ROUTES.BILL.VIEW_INVOICE.replace(':id', bill._id))} className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition">
                  <View size={16} />
                </button>
                <button onClick={() => navigate(ROUTES.BILL.UPDATE_BILL.replace(':id', bill._id))} className="p-2 bg-sky-600/20 text-sky-300 rounded-lg hover:bg-gradient-to-r from-sky-600 to-blue-600 hover:text-white transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => mutate(bill._id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Bills Found</div>
        )}
      </div>
    </div>
  );
};

export default BillTable;



