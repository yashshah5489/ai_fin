import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { User } from "@shared/schema";
import UserProfileForm from "@/components/shared/UserProfileForm";
import { Cog, Lock, Bell, FileText, User as UserIcon } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Using a fixed user ID for demo purposes
        const userId = 1;
        const profile = await getUserProfile(userId);
        setUser(profile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleUpdateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedProfile = await updateUserProfile(user.id, data);
      setUser(updatedProfile);
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout 
      title="Profile" 
      description="Manage your account settings and preferences"
    >
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      ) : user ? (
        <Tabs defaultValue="personal">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold mb-4">
                    {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold">{user.fullName || user.username}</h2>
                  <p className="text-gray-500 text-sm">{user.email || "No email provided"}</p>
                </div>
                
                <div className="mt-6 space-y-1">
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                    <TabsTrigger 
                      value="personal" 
                      className="justify-start rounded-md w-full"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Personal Information
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start rounded-md w-full"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preferences" 
                      className="justify-start rounded-md w-full"
                    >
                      <Cog className="h-4 w-4 mr-2" />
                      Preferences
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start rounded-md w-full"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="documents" 
                      className="justify-start rounded-md w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-3">
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserProfileForm
                      user={user}
                      onSubmit={handleUpdateProfile}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium mb-2">Change Password</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Update your password to keep your account secure
                        </p>
                        
                        <form className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                              placeholder="Enter current password" 
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                              placeholder="Enter new password" 
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                              placeholder="Confirm new password" 
                            />
                          </div>
                          
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                            Update Password
                          </button>
                        </form>
                      </div>
                      
                      <div className="pt-6 border-t">
                        <h3 className="text-md font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md">
                          Enable Two-Factor Authentication
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-md font-medium mb-3">Theme</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border rounded-md p-3 flex items-center cursor-pointer bg-blue-50 border-blue-300">
                            <div className="h-4 w-4 rounded-full bg-blue-600 mr-2"></div>
                            <span className="text-sm">Light Blue</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <div className="h-4 w-4 rounded-full bg-green-600 mr-2"></div>
                            <span className="text-sm">Green</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <div className="h-4 w-4 rounded-full bg-purple-600 mr-2"></div>
                            <span className="text-sm">Purple</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-md font-medium mb-3">Currency</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border rounded-md p-3 flex items-center cursor-pointer bg-blue-50 border-blue-300">
                            <span className="text-sm">USD ($)</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <span className="text-sm">EUR (€)</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <span className="text-sm">GBP (£)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-md font-medium mb-3">Language</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border rounded-md p-3 flex items-center cursor-pointer bg-blue-50 border-blue-300">
                            <span className="text-sm">English</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <span className="text-sm">Spanish</span>
                          </div>
                          <div className="border rounded-md p-3 flex items-center cursor-pointer">
                            <span className="text-sm">French</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-primary text-white rounded-md">
                        Save Preferences
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="text-sm font-medium">Email Notifications</h3>
                          <p className="text-xs text-gray-500">Receive email updates about account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="text-sm font-medium">Investment Alerts</h3>
                          <p className="text-xs text-gray-500">Get notified about significant changes in your investments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="text-sm font-medium">News Digest</h3>
                          <p className="text-xs text-gray-500">Weekly digest of financial news related to your portfolio</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="text-sm font-medium">Goal Progress</h3>
                          <p className="text-xs text-gray-500">Updates about your financial goals progress</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center py-3">
                        <div>
                          <h3 className="text-sm font-medium">AI Insights</h3>
                          <p className="text-xs text-gray-500">Personalized AI-generated financial insights</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <button className="px-4 py-2 bg-primary text-white rounded-md mt-4">
                        Save Notification Settings
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No documents saved</h3>
                      <p className="text-gray-500 mb-4">
                        Documents uploaded in other sections will appear here for easy access
                      </p>
                      <button className="px-4 py-2 bg-primary text-white rounded-md">
                        Upload Document
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      ) : (
        <div className="py-12 text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">User not found</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find your user profile
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
