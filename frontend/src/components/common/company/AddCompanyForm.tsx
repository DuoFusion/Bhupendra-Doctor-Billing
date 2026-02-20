import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addCompany, updateCompany, getCompanyById } from "../../../api/companyApi";
import { ROUTES } from "../../../constants/Routes";

interface CompanyFormData {
  companyName: string;
  gstNumber: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
}

const AddCompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [logo, setLogo] = useState<File | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    gstNumber: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        companyName: data.companyName || "",
        gstNumber: data.gstNumber || "",
        phone: data.phone || "",
        email: data.email || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        address: data.address || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      id ? updateCompany(id, data) : addCompany(data),
    onSuccess: () => {
      alert(id ? "Company updated successfully!" : "Company added successfully!");
      navigate(ROUTES.COMPANY.GET_COMPANY);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      logo,
    });
  };

  const getErrorMessage = () => {
    if (axios.isAxiosError(mutation.error)) {
      return mutation.error.response?.data?.message;
    }
    return "Something went wrong";
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Pincode
              </label>
              <input
                type="number"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Company Logo
            </label>

            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-indigo-500 transition bg-gray-800">
              {logo ? (
                <div className="flex flex-col items-center text-green-400">
                  <Image size={28} />
                  <span className="text-sm mt-2">Logo Selected</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={28} />
                  <span className="text-sm mt-2">
                    {id ? "Change Logo" : "Click to Upload Logo"}
                  </span>
                </div>
              )}

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setLogo(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
            >
              {id ? "Update Company" : "Add Company"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCompanyForm;
