import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <Card className="bg-white shadow-xl rounded-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">RecruiterHub</h1>
              <p className="text-gray-600">Professional recruiting platform</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Streamline your recruitment process with our comprehensive platform
              </p>
              
              <Button 
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Sign In to Continue
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Secure authentication powered by Replit
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
