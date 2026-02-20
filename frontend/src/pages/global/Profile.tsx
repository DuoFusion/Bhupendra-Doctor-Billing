import ProfileCard from "../../components/common/profile/ProfileCard";
import ProfileDetailsForm from "../../components/common/profile/ProfileDetailsForm";

const Profile = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-1/3 w-full">
          <ProfileCard />
        </div>

        <div className="lg:w-2/3 w-full">
          <ProfileDetailsForm role="admin" />
        </div>

      </div>
    </div>
  );
};

export default Profile;