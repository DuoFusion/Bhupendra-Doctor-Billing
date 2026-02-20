import CategoryTable from "../../components/common/category/CategoryTable";

const Category = () => {
  return (
    <div className="mt-6 min-h-[calc(100vh-7rem)] bg-[#050d1c] text-slate-100">
      <div className="w-full overflow-hidden rounded-2xl border border-[#1e3354] bg-[#0b172a]/95 shadow-[0_20px_50px_rgba(2,8,23,0.45)]">
        <CategoryTable />
      </div>
    </div>
  );
};

export default Category;
