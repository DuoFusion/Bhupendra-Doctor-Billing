import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAllCompanies } from "../../../api/companyApi";
import { getAllProducts } from "../../../api/productApi";
import { getCurrentUser } from "../../../api/authApi";
import { addBill, getBillById, updateBill } from "../../../api/billApi";
import { ROUTES } from "../../../constants/Routes";

const GenerateBillForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const { data: currentUserData, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState<number | "">(1);
  const [freeQty, setFreeQty] = useState<number | "">(0);
  const [itemDiscount, setItemDiscount] = useState<number | "">(0);
  const [items, setItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [billDiscount, setBillDiscount] = useState<number | "">(0);
  const [billStatus, setBillStatus] = useState<string>("");
  const [itemErrors, setItemErrors] = useState<{ product?: string; qty?: string }>(
    {}
  );
  const [formErrors, setFormErrors] = useState<{ company?: string; items?: string; paymentMethod?: string; billStatus?: string }>({});

  const userId = currentUserData?.user?._id;
  const myCompanies = companiesData?.companies?.filter((c: any) => {
    if (currentUserData?.user?.role === "admin") return true;
    return c.user?._id === userId;
  });

  const productsForCompany = productsData?.products?.filter((p: any) => p.company?._id === selectedCompany) || [];

  useEffect(() => {
    if (id) return;
    setSelectedProduct("");
    setItems([]);
  }, [selectedCompany, id]);

  const { data: billData, isLoading: isBillLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: () => getBillById(id as string),
    enabled: !!id,
  });

  const companyOptions = (() => {
    const base = myCompanies ? [...myCompanies] : [];
    if (!billData) return base;
    const billCompanyId = billData.company?._id || billData.company || billData.items?.[0]?.company?._id || billData.items?.[0]?.company;
    if (!billCompanyId) return base;
    const exists = base.find((c: any) => c._id === billCompanyId);
    if (exists) return base;
    const companyName = billData.company?.companyName || billData.items?.[0]?.company?.companyName || billData.companyName || "Selected Company";
    return [...base, { _id: billCompanyId, companyName }];
  })();

  useEffect(() => {
    if (!billData) return;
    const b = billData;
    setSelectedCompany(
      b.company?._id || b.company || b.items?.[0]?.company?._id || b.items?.[0]?.company || ""
    );
    setPaymentMethod(b.paymentMethod || "Cash");
    setBillDiscount(b.discount ?? 0);
    setBillStatus(b.status || b.billStatus || "");

    const mappedItems = (b.items || []).map((it: any) => {
      const prod = it.product || {};
      return {
        product: prod._id || prod,
        productName: prod.productName || it.productName || "",
        qty: it.qty || 0,
        freeQty: it.freeQty || 0,
        discount: it.discount || 0,
        sellingPrice: prod.sellingPrice || it.sellingPrice || 0,
        gstPercent: prod.gstPercent || it.gstPercent || 0,
      };
    });

    setItems(mappedItems);
  }, [billData]);

  const subtotal = items.reduce((sum, it) => {
    const line = (it.qty * it.sellingPrice) - (Number(it.discount) || 0);
    return sum + line;
  }, 0);

  const gstTotal = items.reduce((sum, it) => {
    const taxable = (it.qty * it.sellingPrice) - (Number(it.discount) || 0);
    return sum + (taxable * (Number(it.gstPercent) || 0)) / 100;
  }, 0);

  const grandTotal = subtotal + gstTotal - (Number(billDiscount) || 0);

  const addItemToList = () => {
    const newItemErrors: any = {};
    if (!selectedCompany) newItemErrors.product = "Select a company first";
    if (!selectedProduct) newItemErrors.product = "Please select a product";
    setItemErrors(newItemErrors);
    if (Object.keys(newItemErrors).length > 0) return;

    const productObj = productsForCompany.find((p: any) => p._id === selectedProduct);
    if (!productObj) {
      setItemErrors({ product: "Selected product not found" });
      return;
    }

    const newItem = {
      product: productObj._id,
      productName: productObj.productName,
      qty: qty === "" ? 0 : Number(qty),
      freeQty: Number(freeQty) || 0,
      discount: Number(itemDiscount) || 0,
      gstPercent: productObj.gstPercent || 0,
      sellingPrice: productObj.sellingPrice,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedProduct("");
    setQty(1);
    setFreeQty(0);
    setItemDiscount(0);
    setItemErrors({});
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: (data: any) => (id ? updateBill(id, data) : addBill(data)),
    onSuccess: () => {
      alert(id ? "Bill updated successfully" : "Bill generated successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      navigate(ROUTES.BILL.GET_BILLS);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFormErrors: any = {};
    if (!selectedCompany) newFormErrors.company = "Please select a company";
    if (items.length === 0) newFormErrors.items = "Add at least one item to generate bill";
    if (!paymentMethod) newFormErrors.paymentMethod = "Select a payment method";
    if (!billStatus) newFormErrors.billStatus = "Select a bill status";

    setFormErrors(newFormErrors);
    if (Object.keys(newFormErrors).length > 0) return;

    const payload = {
      user: userId,
      company: selectedCompany,
      items: items.map((it) => ({ product: it.product, qty: it.qty, freeQty: it.freeQty, discount: it.discount })),
      paymentMethod,
      discount: Number(billDiscount) || 0,
      billStatus: billStatus,
    };

    mutation.mutate(payload);
  };

  const getErrorMessage = () => {
    if (axios.isAxiosError(mutation.error)) {
      return mutation.error.response?.data?.message;
    }
    return "Something went wrong";
  };

  if (isUserLoading || isCompaniesLoading || isProductsLoading || isBillLoading) return <p>Loading...</p>;

return (
  <div className="min-h-screen bg-gray-950 text-gray-200 p-4 sm:p-6">
    <div className="max-w-6xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">

      <div className="mb-6">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-8">Generate Bill</h2>

      <form className="space-y-10" onSubmit={handleSubmit}>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Select Company</label>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="">Select Company</option>
            {companyOptions?.map((c: any) => (
              <option key={c._id} value={c._id}>{c.companyName}</option>
            ))}
          </select>
          {formErrors.company && <p className="text-red-400 text-sm mt-2">{formErrors.company}</p>}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-lg font-semibold mb-6">Add Product Item</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 text-sm text-gray-400">Product</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} disabled={!selectedCompany}>
                <option value="">Select Product</option>
                {productsForCompany.map((p: any) => (
                  <option key={p._id} value={p._id}>{p.productName}</option>
                ))}
              </select>
              {itemErrors.product && <p className="text-red-400 text-sm mt-2">{itemErrors.product}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Qty</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={qty} onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))} disabled={!selectedCompany} />
              {itemErrors.qty && <p className="text-red-400 text-sm mt-2">{itemErrors.qty}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Free Qty (optional)</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={freeQty} onChange={(e) => setFreeQty(e.target.value === "" ? "" : Number(e.target.value))} disabled={!selectedCompany} />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Item Discount (optional)</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={itemDiscount} onChange={(e) => setItemDiscount(e.target.value === "" ? "" : Number(e.target.value))} disabled={!selectedCompany} />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button type="button" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition w-full sm:w-auto" onClick={addItemToList} disabled={!selectedCompany}>Add Item</button>
            <div className="text-sm text-gray-400 text-right">{items.length} item(s) added</div>
          </div>

          {formErrors.items && <p className="text-red-400 text-sm mt-2">{formErrors.items}</p>}

          {items.length > 0 && (
            <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-gray-400 text-xs">
                  <tr>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Free</th>
                    <th className="px-3 py-2">Item Discount</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40 transition">
                      <td className="px-3 py-2">{it.productName}</td>
                      <td className="px-3 py-2">{it.qty}</td>
                      <td className="px-3 py-2">{it.freeQty}</td>
                      <td className="px-3 py-2">{it.discount}</td>
                      <td className="px-3 py-2">₹{(((it.qty * it.sellingPrice) - (Number(it.discount) || 0)) || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" className="px-2 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition" onClick={() => removeItem(idx)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h4 className="text-sm text-gray-400 mb-3">Summary</h4>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm mt-2"><span>GST</span><span>₹{gstTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm mt-2"><span>Bill Discount</span><span>- ₹{(Number(billDiscount) || 0).toFixed(2)}</span></div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
              <span className="text-sm text-gray-400">Grand Total</span>
              <span className="text-lg font-semibold text-white">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <label className="block mb-3 text-sm text-gray-400">Payment Method</label>
            <div className="flex flex-wrap gap-6">
              {["Cash", "UPI", "Card", "Net Banking"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="paymentMethod" value={method} className="accent-indigo-500" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            {formErrors.paymentMethod && <p className="text-red-400 text-sm mt-2">{formErrors.paymentMethod}</p>}
          </div>

          <div>
            <label className="block mb-3 text-sm text-gray-400">Bill Status</label>
            <div className="flex flex-wrap gap-6">
              {["Paid", "Unpaid", "Cancelled"].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="billStatus" value={s} className="accent-indigo-500" checked={billStatus === s} onChange={() => setBillStatus(s)} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            {formErrors.billStatus && <p className="text-red-400 text-sm mt-2">{formErrors.billStatus}</p>}
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8">
          <label className="block mb-2 text-sm text-gray-400">Bill Discount (optional)</label>
          <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" value={billDiscount} onChange={(e) => setBillDiscount(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>

        {mutation.isError && <p className="text-red-400 text-sm text-center">{getErrorMessage()}</p>}

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition w-full sm:w-auto">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-md w-full sm:w-auto">Generate Bill</button>
        </div>

      </form>
    </div>
  </div>
);

};

export default GenerateBillForm;
