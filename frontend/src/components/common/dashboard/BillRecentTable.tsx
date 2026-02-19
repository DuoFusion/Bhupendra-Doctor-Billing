import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Bills</h2>

        <button
          onClick={() => navigate(ROUTES.BILL.GET_BILLS)}
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
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {recentBills.length > 0 ? (
              recentBills.map((bill: any, index: number) => (
                <tr key={bill._id} className="hover:bg-gray-800/60 transition">
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

                  <td className="px-6 py-4">₹ {bill.totalGST}</td>

                  <td className="px-6 py-4">{bill.items?.length}</td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-gray-400">
                      {bill.user?.name || "-"} <br />
                      {bill.user?.email || ""}
                    </td>
                  )}

                  <td className="px-6 py-4 font-semibold text-indigo-400">
                    ₹ {bill.subTotal}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-400">
                    ₹ {bill.grandTotal}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 11 : 10}
                  className="text-center py-6 text-gray-400"
                >
                  No Recent Bills
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile compact view */}
      <div className="sm:hidden p-4 space-y-4">
        {recentBills.length > 0 ? (
          recentBills.map((bill: any) => (
            <div key={bill._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4" >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{bill.billNumber}</h3>
                  <p className="text-sm text-gray-400">{bill.items?.[0]?.productName || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">₹{bill.grandTotal}</p>
                  <p className="text-sm text-gray-400">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-300">
                <p>Items: {bill.items?.length || 0}</p>
                {isAdmin && <p>By: {bill.user?.name || '-'}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No Recent Bills</div>
        )}
      </div>
    </div>
  );
};

export default BillRecentTable;
