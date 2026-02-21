import { useNavigate } from "react-router-dom";
import { ArrowRight, View } from "lucide-react";
import { ROUTES } from "../../../constants/Routes";

type Props = {
  bills: any[];
  currentUserRole?: string;
};

const BillRecentTable = ({ bills = [], currentUserRole }: Props) => {
  const navigate = useNavigate();

  const isAdmin = currentUserRole === "admin";

  const recentBills = (bills || [])
    .slice()
    .sort((a: any, b: any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#0b172a]/90 rounded-2xl border border-[#244066]">
      <div className="px-6 py-4 border-b border-[#213a60] flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Bills</h2>

        <button
          onClick={() => navigate(ROUTES.BILL.GET_BILLS)}
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
              <th className="px-6 py-4">SR No</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Bill Number</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total GST</th>
              <th className="px-6 py-4">Items</th>
              {isAdmin && <th className="px-6 py-4">Created By</th>}
              <th className="px-6 py-4">Sub Total</th>
              <th className="px-6 py-4">Grand Total</th>
              <th className="px-6 py-4 text-center">View Invoice</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {recentBills.length > 0 ? (
              recentBills.map((bill: any, index: number) => (
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
                    {bill.items?.[0]?.productName || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {bill.items?.[0]?.company?.companyName || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {bill.createdAt
                      ? new Date(bill.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">Rs {bill.totalGST}</td>

                  <td className="px-6 py-4">{bill.items?.length}</td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-400">
                      {bill.user?.name || "-"} <br />
                      {bill.user?.email || ""}
                    </td>
                  )}

                  <td className="px-6 py-4 font-semibold text-sky-300">
                    Rs {bill.subTotal}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-400">
                    Rs {bill.grandTotal}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"
                      onClick={() => navigate(ROUTES.BILL.VIEW_INVOICE.replace(":id", bill._id))}
                    >
                      <View size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 12 : 11}
                  className="text-center py-6 text-slate-400"
                >
                  No Recent Bills
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden p-4 space-y-4">
        {recentBills.length > 0 ? (
          recentBills.map((bill: any) => (
            <div key={bill._id} className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4" >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{bill.billNumber}</h3>
                  <p className="text-sm text-slate-400">{bill.items?.[0]?.productName || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">Rs {bill.grandTotal}</p>
                  <p className="text-sm text-slate-400">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-200">
                <p>Items: {bill.items?.length || 0}</p>
                {isAdmin && <p>By: {bill.user?.name || '-'}</p>}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition"
                  onClick={() => navigate(ROUTES.BILL.VIEW_INVOICE.replace(':id', bill._id))}
                >
                  <View size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400">No Recent Bills</div>
        )}
      </div>
    </div>
  );
};

export default BillRecentTable;