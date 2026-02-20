import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "../../../constants/Routes";

type Props = {
  products: any[];
  currentUserRole?: string;
};

const ProductRecentTable = ({ products = [], currentUserRole }: Props) => {
  const navigate = useNavigate();

  const isAdmin = currentUserRole === "admin";

  const recentProducts = (products || [])
    .slice()
    .sort((a: any, b: any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#0b172a]/90 rounded-2xl border border-[#244066]">
      <div className="px-6 py-4 border-b border-[#213a60] flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Products</h2>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS.GET_PRODUCTS)}
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
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Company</th>
              {isAdmin && <th className="px-6 py-4">Added By</th>}
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">HSN</th>
              <th className="px-6 py-4">MRP</th>
              <th className="px-6 py-4">Selling</th>
              <th className="px-6 py-4">GST%</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Expiry</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1f3557]">
            {recentProducts.length > 0 ? (
              recentProducts.map((item: any) => (
                <tr key={item._id} className="hover:bg-[#122642]/70 transition">
                  <td className="px-6 py-4 font-medium text-white">{item.productName}</td>
                  <td className="px-6 py-4">{item.company?.companyName}</td>

                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-400">
                      {item.user?.name} <br />
                      {item.user?.email}
                    </td>
                  )}

                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.hsnCode}</td>
                  <td className="px-6 py-4">₹{item.mrp}</td>
                  <td className="px-6 py-4 text-green-400 font-medium">₹{item.sellingPrice}</td>
                  <td className="px-6 py-4">{item.gstPercent}%</td>
                  <td className="px-6 py-4">{item.stock}</td>
                  <td className="px-6 py-4 text-slate-400">{item.expiry}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 10 : 9} className="text-center py-6 text-slate-400">
                  No Recent Products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Mobile compact view */}
        <div className="sm:hidden p-4 space-y-4">
          {recentProducts.length > 0 ? (
            recentProducts.map((product: any) => (
              <div key={product._id} className="bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-sm text-slate-400">{product.description || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{product.sku || ''}</p>
                    <p className="text-sm text-slate-400">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400">No Recent Products</div>
          )}
        </div>
    </div>
  );
};

export default ProductRecentTable;



