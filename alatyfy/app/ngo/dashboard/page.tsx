"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layouts/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Moon, Sun, Upload, Image as ImageIcon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Progress } from "@/components/ui/progress";
import { useUnifiedToast } from "@/hooks/use-unified-toast";
import { useMountedTheme } from "@/hooks/use-mounted-theme";

interface NGO {
  id: string;
  name: string;
  email: string;
  description: string;
  location: string;
  website: string;
  phone: string;
  logo: string;
  donationNeeded: number;
  purpose: string;
  impact: string;
  createdAt: string;
  updatedAt: string;
}

interface DonationCampaign {
  title: string;
  targetAmount: number;
  purpose: string;
  deadline: string;
}

interface NgoProfile {
  id: string;
  organizationName: string;
  isVerified: boolean;
  verificationStatus: string;
}

interface Campaign {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: string;
}

export default function DashboardPage() {
  const [ngo, setNGO] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedNGO, setEditedNGO] = useState<NGO | null>(null);
  const [campaign, setCampaign] = useState<DonationCampaign>({
    title: "",
    targetAmount: 0,
    purpose: "",
    deadline: ""
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepStatus, setStepStatus] = useState({
    basicInfo: false,
    donationNeeds: false,
    impact: false
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [profile, setProfile] = useState<NgoProfile | null>(null);
  
  const router = useRouter();
  const { success, error: unifiedError } = useUnifiedToast();
  const { theme, setTheme } = useTheme();
  const { mounted } = useMountedTheme();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!userId) {
      router.push('/ngo/login');
      return;
    }

    const fetchNGO = async () => {
      try {
        const response = await fetch(`/api/ngo/${userId}`, {
          headers: {
            'x-ngo-name': userName || '',
            'x-ngo-email': userEmail || '',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch NGO data');
        }
        
        const data = await response.json();
        
        setNGO(data);
        setEditedNGO(data);
        
        if (data.name && data.name !== userName) {
          localStorage.setItem('userName', data.name);
        }
        
        if (data.logo) {
          setImagePreview(data.logo);
        }

        // Update step status based on existing data
        setStepStatus({
          basicInfo: Boolean(data.name && data.phone && data.website && data.location),
          donationNeeds: Boolean(data.donationNeeded),
          impact: Boolean(data.purpose && data.impact)
        });
      } catch (error: any) {
        setError(error.message);
        unifiedError('Failed to load NGO data');
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        unifiedError('Failed to load campaigns');
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/ngo/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch NGO profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching NGO profile:', error);
        unifiedError('Failed to load NGO profile');
      }
    };

    fetchNGO();
    fetchCampaigns();
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/ngo/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const { url: imageUrl } = await uploadToCloudinary(file);

      if (imageUrl) {
        setEditedNGO(prev => prev ? {...prev, logo: imageUrl} : null);
        await handleSaveAndNext();
      }
    } catch (error: any) {
      unifiedError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!editedNGO) return;

    try {
      const response = await fetch(`/api/ngo/${editedNGO.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedNGO),
      });

      if (!response.ok) {
        throw new Error('Failed to update NGO details');
      }

      setNGO(editedNGO);
      
      // Update step status
      if (currentStep === 1) {
        setStepStatus(prev => ({ ...prev, basicInfo: true }));
      } else if (currentStep === 2) {
        setStepStatus(prev => ({ ...prev, donationNeeds: true }));
      } else if (currentStep === 3) {
        setStepStatus(prev => ({ ...prev, impact: true }));
      }

      // Move to next step
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      }

      success('Information saved successfully');
    } catch (error: any) {
      unifiedError('Error saving information');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.isVerified) {
      unifiedError('Your NGO profile must be verified before creating campaigns');
      return;
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaign,
          ngoId: profile.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      success('Campaign created successfully');
      setCampaign({
        title: "",
        targetAmount: 0,
        purpose: "",
        deadline: ""
      });
    } catch (err) {
      unifiedError('Failed to create campaign');
    }
  };

  const renderStepIndicator = () => (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Setup Progress</h2>
        <span className="text-sm text-muted-foreground">
          {Math.round(
            (Object.values(stepStatus).filter(Boolean).length / 3) * 100
          )}% Complete
        </span>
      </div>
      <Progress 
        value={(Object.values(stepStatus).filter(Boolean).length / 3) * 100}
        className="h-2 mb-6"
      />
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground'
                    : stepStatus[step === 1 ? 'basicInfo' : step === 2 ? 'donationNeeds' : 'impact']
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepStatus[step === 1 ? 'basicInfo' : step === 2 ? 'donationNeeds' : 'impact'] ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`w-20 h-1 mx-2 ${
                  stepStatus[step === 1 ? 'basicInfo' : 'donationNeeds']
                    ? 'bg-green-500'
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <p className="text-sm text-muted-foreground">
          {currentStep === 1 ? 'Basic Information' : 
           currentStep === 2 ? 'Donation Needs' : 
           'Impact & Description'}
        </p>
      </div>
    </div>
  );

  if (!mounted) return null;

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (!profile?.isVerified) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Verification Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your NGO profile needs to be verified before you can create campaigns.
              {profile?.verificationStatus === "PENDING" && (
                <span className="block mt-2 text-muted-foreground">
                  Your verification is pending. Please wait for admin approval.
                </span>
              )}
            </p>
            {!profile?.verificationStatus && (
              <Button onClick={() => router.push("/ngo/verification")}>
                Complete Verification
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageContainer>
        <div className="min-h-screen bg-background">
          <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-foreground">NGO Setup</h1>
                  {Object.values(stepStatus).every(Boolean) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <Check className="w-4 h-4 mr-1" />
                      Complete
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/ngo/profile')}
                    disabled={!Object.values(stepStatus).some(Boolean)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-24 pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderStepIndicator()}
              
              <Card className="p-6 shadow-lg border-t-4 border-primary">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="flex flex-col items-center space-y-4 mb-6">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="NGO Logo"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="logo" className="cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? "Uploading..." : "Upload Logo"}</span>
                          </div>
                        </Label>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                          id="name"
                          value={editedNGO?.name || ''}
                          onChange={(e) => setEditedNGO(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="text-lg font-medium"
                          placeholder="Enter your organization name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedNGO?.email || ''}
                          className="text-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editedNGO?.phone || ''}
                          onChange={(e) => setEditedNGO(prev => prev ? {...prev, phone: e.target.value} : null)}
                          className="text-lg"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editedNGO?.website || ''}
                          onChange={(e) => setEditedNGO(prev => prev ? {...prev, website: e.target.value} : null)}
                          className="text-lg"
                          placeholder="Enter your website URL"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editedNGO?.location || ''}
                          onChange={(e) => setEditedNGO(prev => prev ? {...prev, location: e.target.value} : null)}
                          className="text-lg"
                          placeholder="Enter your location"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Donation Needs</h2>
                    <div>
                      <Label htmlFor="donationNeeded">Target Donation Amount</Label>
                      <Input
                        id="donationNeeded"
                        type="number"
                        value={editedNGO?.donationNeeded || ''}
                        onChange={(e) => setEditedNGO(prev => prev ? {...prev, donationNeeded: parseFloat(e.target.value)} : null)}
                        className="text-lg"
                        placeholder="Enter target donation amount"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose of Donations</Label>
                      <Textarea
                        id="purpose"
                        value={editedNGO?.purpose || ''}
                        onChange={(e) => setEditedNGO(prev => prev ? {...prev, purpose: e.target.value} : null)}
                        className="min-h-[150px]"
                        placeholder="Explain how the donations will be used"
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
                    <div>
                      <Label htmlFor="campaignTitle">Campaign Title</Label>
                      <Input
                        id="campaignTitle"
                        value={campaign.title}
                        onChange={(e) => setCampaign(prev => ({ ...prev, title: e.target.value }))}
                        className="text-lg"
                        placeholder="Enter campaign title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetAmount">Target Amount</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        value={campaign.targetAmount}
                        onChange={(e) => setCampaign(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) }))}
                        className="text-lg"
                        placeholder="Enter target amount"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaignPurpose">Campaign Purpose</Label>
                      <Textarea
                        id="campaignPurpose"
                        value={campaign.purpose}
                        onChange={(e) => setCampaign(prev => ({ ...prev, purpose: e.target.value }))}
                        className="min-h-[150px]"
                        placeholder="Describe the purpose of your campaign"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Campaign Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={campaign.deadline}
                        onChange={(e) => setCampaign(prev => ({ ...prev, deadline: e.target.value }))}
                        className="text-lg"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  <div className="flex-1" />
                  {currentStep < 3 ? (
                    <Button onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                  ) : (
                    <Button onClick={handleCreateCampaign}>
                      Post Campaign
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}