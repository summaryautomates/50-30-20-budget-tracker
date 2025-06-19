
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, UserPlus } from 'lucide-react';

const GuestBanner = () => {
  const { isGuest } = useAuth();
  const navigate = useNavigate();

  if (!isGuest) return null;

  return (
    <Card className="bg-amber-900/20 border-amber-500/30 mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-amber-400 font-medium">Guest Mode Active</p>
            <p className="text-amber-300/70 text-sm">
              Your data will not be saved. Sign up to keep your progress!
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/auth')}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Sign Up
        </Button>
      </CardContent>
    </Card>
  );
};

export default GuestBanner;
