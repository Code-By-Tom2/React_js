import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome to NGO Connect
          </h1>
          <p className="text-lg text-gray-400">
            Choose how you'd like to make a difference today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 hover:bg-zinc-900/70 transition-all">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Continue as Donor</h2>
              <p className="text-gray-400">
                Browse NGO profiles and make donations to support their causes
              </p>
              <Link href="/donor" className="block">
                <Button className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6">
                  Browse NGOs
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 hover:bg-zinc-900/70 transition-all">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Continue as NGO</h2>
              <p className="text-gray-400">
                Register your NGO or login to manage your profile
              </p>
              <Link href="/ngo/login" className="block">
                <Button className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6">
                  Login / Register
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}