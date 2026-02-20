import ProductTable from "../../components/common/product/ProductTable";

const Product = () => {
  return (
    <div className="mt-6 min-h-[calc(100vh-7rem)] bg-[#050d1c] text-slate-100">
      <div className="w-full overflow-hidden rounded-2xl bg-[#0b172a]/95">
        <ProductTable />
      </div>
    </div>
  );
};

export default Product;
