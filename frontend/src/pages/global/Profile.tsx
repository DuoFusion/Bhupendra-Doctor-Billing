import ProfileCard from "../../components/common/profile/ProfileCard";
import ProfileDetailsForm from "../../components/common/profile/ProfileDetailsForm";

const Profile = () => {
  return (
    <div className="min-h-[calc(100vh-7rem)] bg-[#050d1c] px-3 py-4 text-slate-100 sm:px-5 sm:py-6 lg:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ProfileCard />
        </div>

        <div className="lg:col-span-8">
          <ProfileDetailsForm role="admin" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
