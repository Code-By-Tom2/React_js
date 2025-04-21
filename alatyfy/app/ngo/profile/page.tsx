"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layouts/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { Moon, Sun, ArrowLeft, Plus, Target, Calendar, Heart, DollarSign, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  purpose: string;
  deadline: string;
  status: string;
  createdAt: string;
}

interface NGO {
  id: string;
  name: string;
  email: string;
  description: string;
  location: string;
  website: string;
  phone: string;
  logo: string;
  impact: string;
  campaigns: Campaign[];
}

export default function NGOProfilePage() {
  const [ngo, setNGO] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Calculate total stats
  const getTotalStats = () => {
    if (!ngo?.campaigns) return { totalRaised: 0, totalTarget: 0, activeCampaigns: 0 };
    
    return ngo.campaigns.reduce((acc, campaign) => {
      return {
        totalRaised: acc.totalRaised + campaign.currentAmount,
        totalTarget: acc.totalTarget + campaign.targetAmount,
        activeCampaigns: acc.activeCampaigns + (campaign.status === 'active' ? 1 : 0),
      };
    }, { totalRaised: 0, totalTarget: 0, activeCampaigns: 0 });
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/ngo/login');
      return;
    }

    const fetchNGO = async () => {
      try {
        const response = await fetch(`/api/ngo/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch NGO data');
        }
        const data = await response.json();
        setNGO(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load NGO data",
          variant: "destructive",
        });
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
        const campaigns = await response.json();
        // Filter campaigns for this NGO
        const ngoCampaigns = campaigns.filter((campaign: Campaign) => campaign.ngoId === userId);
        setNGO(prev => prev ? { ...prev, campaigns: ngoCampaigns } : null);
      } catch (error: any) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchNGO();
    fetchCampaigns();
  }, [router, toast]);

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </PageContainer>
    );
  }

  if (!ngo) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">NGO Not Found</h2>
          <p className="mt-2 text-muted-foreground">Please complete your NGO setup first.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/ngo/dashboard')}
          >
            Go to Setup
          </Button>
        </div>
      </PageContainer>
    );
  }

  const stats = getTotalStats();

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">NGO Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/ngo/dashboard')}
                >
                  Edit Profile
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
              </div>
            </div>
          </div>
        </div>

        <div className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* NGO Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted mb-4">
                    {ngo.logo ? (
                      <Image
                        src={ngo.logo}
                        alt={ngo.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-center mb-2">{ngo.name}</h2>
                  <p className="text-sm text-muted-foreground text-center">{ngo.location}</p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Raised</p>
                    <p className="text-2xl font-bold">${stats.totalRaised.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Target</p>
                    <p className="text-2xl font-bold">${stats.totalTarget.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Campaigns Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-foreground">Your Campaigns</h3>
                <Button onClick={() => router.push('/ngo/dashboard')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              {ngo.campaigns && ngo.campaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {ngo.campaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-semibold text-foreground">{campaign.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created on {new Date(campaign.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Target Amount</p>
                            <p className="text-lg font-semibold text-foreground">
                              ${campaign.targetAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground font-medium">
                              ${campaign.currentAmount.toLocaleString()} (
                              {Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}%)
                            </span>
                          </div>
                          <Progress 
                            value={(campaign.currentAmount / campaign.targetAmount) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <p className="text-muted-foreground">{campaign.purpose}</p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => router.push(`/campaigns/${campaign.id}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No campaigns yet</p>
                    <Button variant="outline" onClick={() => router.push('/ngo/dashboard')}>
                      Create Your First Campaign
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 