import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'campaigns.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load campaigns from file
async function loadCampaigns() {
  try {
    await ensureDataDirectory();
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save campaigns to file
async function saveCampaigns(campaigns: any[]) {
  await ensureDataDirectory();
  await fs.writeFile(dataFilePath, JSON.stringify(campaigns, null, 2));
}

export async function POST(request: Request) {
  try {
    const campaign = await request.json();
    
    // Add validation here in production
    if (!campaign.title || !campaign.targetAmount || !campaign.purpose || !campaign.deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add created timestamp and ID
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      updates: []
    };

    // Load existing campaigns
    const campaigns = await loadCampaigns();
    
    // Add new campaign
    campaigns.push(newCampaign);
    
    // Save updated campaigns
    await saveCampaigns(campaigns);

    return NextResponse.json(newCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const campaigns = await loadCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
} 