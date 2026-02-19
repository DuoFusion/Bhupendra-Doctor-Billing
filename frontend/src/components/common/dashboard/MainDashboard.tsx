import {
  Building2,
  Package,
  Receipt,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../../api/authApi";
import { getAllBills } from "../../../api/billApi";
import { getAllProducts } from "../../../api/productApi";
import { getAllCompanies } from "../../../api/companyApi";
import { getAllUsers } from "../../../api/userApi";
import BillRecentTable from "./BillRecentTable";
import ProductRecentTable from "./ProductRecentTable";
import CompanyRecentTable from "./CompanyRecentTable";
import UserRecentTable from "./UserRecentTable";

const MainDashboard = () => {
  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const role = currentUserData?.user?.role;
  const { data: billsData } = useQuery({ queryKey: ["bills"], queryFn: getAllBills });
  const { data: productsData } = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const { data: companiesData } = useQuery({ queryKey: ["companies"], queryFn: getAllCompanies });
  const { data: usersData } = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

  const allBills = billsData?.bills || [];
  const allProducts = productsData?.products || [];
  const allCompanies = companiesData?.companies || [];
  const allUsers = usersData?.users || [];

  const currentUserId = currentUserData?.user?._id;

  const filteredBills = role === "admin" ? allBills : allBills.filter((b: any) => String(b.user?._id || b.user) === String(currentUserId));
  const filteredProducts = role === "admin" ? allProducts : allProducts.filter((p: any) => String(p.user?._id || p.user) === String(currentUserId));
  const filteredCompanies = role === "admin" ? allCompanies : allCompanies.filter((c: any) => String(c.user?._id || c.user) === String(currentUserId));
  const filteredUsers = role === "admin" ? allUsers : [];

  const totalBills = filteredBills.length;
  const totalProducts = filteredProducts.length;
  const totalCompanies = filteredCompanies.length;

  const cards = [
    { title: "Total Companies", value: totalCompanies, icon: Building2 },
    { title: "Total Products", value: totalProducts, icon: Package },
    { title: "Total Bills", value: totalBills, icon: Receipt },
    ...(role === "admin"
      ? [{ title: "Total Users", value: allUsers.length, icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 space-y-10">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <h2 className="text-3xl font-bold text-white mt-2">
                  {card.value}
                </h2>
              </div>
              <div className="bg-indigo-600/20 p-3 rounded-xl text-indigo-400">
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {role === "admin" ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <BillRecentTable bills={filteredBills} currentUserRole={role} />
            <UserRecentTable users={filteredUsers} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ProductRecentTable products={filteredProducts} currentUserRole={role} />
            <CompanyRecentTable companies={filteredCompanies} currentUserRole={role} />
          </div>
        </>
      ) : (
        <>
          {/* Row 1: Bills full width */}
          <div className="grid grid-cols-1 gap-6">
            <BillRecentTable bills={filteredBills} currentUserRole={role} />
          </div>

          {/* Row 2: Products + Companies side-by-side */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ProductRecentTable products={filteredProducts} currentUserRole={role} />
            <CompanyRecentTable companies={filteredCompanies} currentUserRole={role} />
          </div>
        </>
      )}
    </div>
  );
};

export default MainDashboard;
