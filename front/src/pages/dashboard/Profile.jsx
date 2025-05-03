'use client';
import { logout } from '@/utils/redux/user';
import { Button } from '@/components/ui/button';
import { User, KeyRound, Mail, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/hooks/redux/use-user';
import { useDispatch } from 'react-redux';

// Import your existing components
import AvatarForm from '@/components/dashboard/profile/AvatarForm';
import DeleteUser from '@/components/dashboard/profile/DeleteUser';
import UpdateDataForm from '@/components/dashboard/profile/UpdateDataForm';
import UpdatePassword from '@/components/dashboard/profile/UpdatePassword';
import { useNavigate } from 'react-router-dom';
import Tables from './Tables';

function Profile() {
  const navigate = useNavigate();
  const { data } = useUser();
  const { email, phone } = data;
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 ">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            LogOut
          </Button>
        </div>
      </div>

      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile information and manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Update Form */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <AvatarForm data={data} />
            <div className="flex-1 ">
              <div className=" flex justify-end">
                <UpdateDataForm data={data} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 p-5 rounded-xl bg-muted/50">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="font-medium text-lg">{email}</p>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </div>
              <p className="font-medium text-lg">{phone || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tables />

      {/* Account Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your password and account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Management */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-medium">Password Management</h3>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            <UpdatePassword data={data} />
          </div>

          <Separator />

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <DeleteUser id={data._id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
