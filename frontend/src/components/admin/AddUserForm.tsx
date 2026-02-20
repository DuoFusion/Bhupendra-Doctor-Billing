import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signupUser } from "../../api/authApi";
import { getUserById, updateUser } from "../../api/userApi";
import { ROUTES } from "../../constants/Routes";

const AddUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data?.user && isEdit) {
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
    }
  }, [data, isEdit]);

  const addMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate(ROUTES.ADMIN.MANAGE_USERS);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData: {
      id: string;
      name: string;
      email: string;
      role: string;
    }) =>
      updateUser(formData.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }),
    onSuccess: () => {
      navigate(ROUTES.ADMIN.MANAGE_USERS);
    },
  });

  const handleSubmit = () => {
    if (isEdit && id) {
      updateMutation.mutate({
        id,
        name,
        email,
        role,
      });
    } else {
      addMutation.mutate({
        name,
        email,
        password,
        role,
      });
    }
  };

  const mutation = isEdit ? updateMutation : addMutation;

  const getErrorMessage = () => {
    if (axios.isAxiosError(mutation.error)) {
      return mutation.error.response?.data?.message;
    }
    return "Something went wrong";
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-[#050d1c] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#050d1c] px-4 py-10">
      <div className="max-w-md mx-auto bg-[#0b172a]/95 border border-[#1e3354] rounded-2xl p-8 shadow-xl relative">

        <button
          onClick={() => navigate(ROUTES.ADMIN.MANAGE_USERS)}
          className="absolute -top-12 left-0 bg-[#0f2037] hover:bg-[#1f334f] text-white px-4 py-2 rounded-lg text-sm transition"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold text-white text-center mb-8">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />

          {!isEdit && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f2037] text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 py-3 rounded-lg font-medium text-white transition"
          >
            {mutation.isPending
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update User"
              : "Add User"}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;

