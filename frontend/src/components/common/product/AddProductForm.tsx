import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ROUTES } from "../../../constants/Routes";
import axios from "axios";
import { getAllCompanies } from "../../../api/companyApi";
import { addProduct, updateProduct, getProductById } from "../../../api/productApi";
import CategorySelector from "../category/CategorySelector";

const AddProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    productName: "", company: "", category: "", hsnCode: "", batch: "", expiry: "", mrp: "", purchasePrice: "", sellingPrice: "", gstPercent: "", stock: "", minStock: "", stockStatus: "In Stock", description: "",
  });

  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id, 
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        productName: productData.productName || "",
        company: productData.company?._id || "",
        category: productData.category || "",
        hsnCode: productData.hsnCode || "",
        batch: productData.batch || "",
        expiry: productData.expiry || "",
        mrp: productData.mrp || "",
        purchasePrice: productData.purchasePrice || "",
        sellingPrice: productData.sellingPrice || "",
        gstPercent: productData.gstPercent || "",
        stock: productData.stock || "",
        minStock: productData.minStock || "",
        stockStatus: productData.stockStatus || "In Stock",
        description: productData.description || "",
      });
    }
  }, [productData]);

  const mutation = useMutation({
    mutationFn: (data: any) => (id ? updateProduct(id, data) : addProduct(data)),
    onSuccess: () => {
      alert(id ? "Product updated successfully!" : "Product added successfully!");
      navigate(ROUTES.PRODUCTS.GET_PRODUCTS);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const getErrorMessage = () => {
    if (axios.isAxiosError(mutation.error)) {
      return mutation.error.response?.data?.message;
    }
    return "Something went wrong";
  };

  if (isProductLoading || isCompaniesLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#050d1c] text-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#0b172a]/95 p-8 ring-1 ring-white/5">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm text-slate-400">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">Company</label>
            {isCompaniesLoading ? (
              <p>Loading companies...</p>
            ) : (
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2"
                required
              >
                <option value="">Select Company</option>
                {companiesData?.companies?.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">Category</label>
            <CategorySelector value={formData.category} onChange={(v: string) => setFormData((p) => ({ ...p, category: v }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN Code" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="text" name="batch" value={formData.batch} onChange={handleChange} placeholder="Batch" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} placeholder="MRP" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} placeholder="Purchase Price" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} placeholder="Selling Price" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="number" name="gstPercent" value={formData.gstPercent} onChange={handleChange} placeholder="GST %" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
            <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} placeholder="Minimum Stock" className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block mb-3 text-sm text-slate-400">Stock Status</label>
            <div className="flex flex-wrap gap-6">
              {["In Stock", "Low Stock", "Out Of Stock"].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="stockStatus" value={status} checked={formData.stockStatus === status} onChange={handleChange} className={`accent-${status === "In Stock" ? "green" : status === "Low Stock" ? "yellow" : "red"}-500`} />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full bg-[#0f2037] border border-[#2a466f] rounded-lg px-4 py-2" placeholder="Enter product description" />
          </div>

          {mutation.isError && <p className="text-red-400 text-sm text-center">{getErrorMessage()}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg bg-[#1f334f] hover:bg-[#29456b] transition">Cancel</button>
            <button type="submit" className="rounded-lg border border-sky-400/40 bg-[#177db8] px-6 py-2 text-white transition hover:bg-[#1f8bcb]">{id ? "Update Product" : "Add Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;

