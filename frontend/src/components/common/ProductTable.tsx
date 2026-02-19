import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { deleteProduct, getAllProducts } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";
import { getCurrentUser } from "../../api/authApi";

const ProductTable = () => {

  // Search and sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"category" | "price" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const navigate = useNavigate()
  const queryClient = useQueryClient();  

  const {data , isLoading , isError , error} = useQuery({
    queryKey : ["products"],
    queryFn : getAllProducts,
  })

  const productsList = useMemo(() => {
    const items = data?.products || [];

    const filtered = searchTerm
      ? items.filter((p: any) =>
          (p.productName || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

    if (!sortBy) return filtered;

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortBy === "category") {
        const aa = (a.category || "").toString().toLowerCase();
        const bb = (b.category || "").toString().toLowerCase();
        if (aa < bb) return sortOrder === "asc" ? -1 : 1;
        if (aa > bb) return sortOrder === "asc" ? 1 : -1;
        return (a.productName || "").toString().localeCompare((b.productName || "").toString());
      }

      if (sortBy === "price") {
        const pa = Number(a.sellingPrice || a.mrp || 0);
        const pb = Number(b.sellingPrice || b.mrp || 0);
        if (pa < pb) return sortOrder === "asc" ? -1 : 1;
        if (pa > pb) return sortOrder === "asc" ? 1 : -1;
        return (a.productName || "").toString().localeCompare((b.productName || "").toString());
      }

      return 0;
    });

    return sorted;
  }, [data?.products, searchTerm, sortBy, sortOrder]);

const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
});
  
const isAdmin = currentUser?.user?.role === "admin";
  

  const { mutate } = useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Product List</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input
              id="product-search"
              aria-label="Search by product name"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
            />

            <select
              aria-label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-200"
            >
              <option value="">No sort</option>
              <option value="category">Category (A → Z)</option>
              <option value="price">Price</option>
            </select>

            <button
              aria-pressed={sortOrder === "desc"}
              title="Toggle sort order"
              onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            {sortBy && (
              <span className="ml-2 text-sm text-gray-300">Sorted by: <strong className="text-white">{sortBy === 'category' ? 'Category' : 'Price'} ({sortOrder === 'asc' ? 'asc' : 'desc'})</strong></span>
            )}

            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition shadow-md" onClick={()=>navigate(ROUTES.PRODUCTS.ADD_PRODUCT)}>
              <FiPlus size={16} />
              Add Product
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300 hidden sm:table">

          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
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
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">

            {productsList?.length > 0 ? (
              productsList.map((item : any , index : number) => (
              <tr
                key={index}
                className="hover:bg-gray-800/60 transition"
              >
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {item.productName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.company?.companyName}
                </td>

               {isAdmin && <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  Name : {item.user?.name} <br />
                  {item.user?.email}
                </td>}

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.category}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.hsnCode}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{item.mrp}
                </td>

                <td className="px-6 py-4 text-green-400 font-medium whitespace-nowrap">
                  ₹{item.sellingPrice}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {item.gstPercent}%
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {item.stockStatus === "Out Of Stock" ? (
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                        Out Of Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        {item.stock}
                      </span>
                    )}
                </td>

                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  {item.expiry}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition"    onClick={() => navigate(`/update-product/${item._id}`)}>
                      <FiEdit size={16} />
                    </button>

                    <button className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition" onClick={()=>mutate(item._id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 11 : 10} className="text-center py-6 text-gray-400">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Mobile list view */}
      <div className="sm:hidden p-4 space-y-4">
        {productsList?.length > 0 ? (
          productsList.map((item: any) => (
            <div key={item._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-400">{item.company?.companyName || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">₹{item.sellingPrice}</p>
                  <p className="text-sm text-gray-400">{item.gstPercent}% GST</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
                <div>
                  <p>Category: {item.category || '-'}</p>
                  <p>HSN: {item.hsnCode || '-'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition" onClick={() => navigate(`/update-product/${item._id}`)}>
                    <FiEdit size={16} />
                  </button>
                  <button className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition" onClick={() => mutate(item._id)}>
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No Products Found</div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
