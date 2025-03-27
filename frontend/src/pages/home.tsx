import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Heart, Leaf, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar userType="patient" />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Your Journey to Holistic Health Starts Here
                </h1>
                <p className="text-xl text-gray-600">
                  Connect with expert Ayurvedic practitioners and discover personalized wellness solutions.
                </p>
                <div className="space-x-4">
                  <Button size="lg" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/experts">Find Experts</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                  alt="Ayurvedic Medicine"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose AyurCare?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Leaf className="h-8 w-8 text-green-600" />,
                  title: 'Traditional Wisdom',
                  description: 'Access centuries-old healing practices adapted for modern life.',
                },
                {
                  icon: <Users className="h-8 w-8 text-green-600" />,
                  title: 'Expert Practitioners',
                  description: 'Connect with verified Ayurvedic doctors and specialists.',
                },
                {
                  icon: <Shield className="h-8 w-8 text-green-600" />,
                  title: 'Trusted Platform',
                  description: 'Secure, reliable, and privacy-focused healthcare platform.',
                },
                {
                  icon: <Heart className="h-8 w-8 text-green-600" />,
                  title: 'Personalized Care',
                  description: 'Get customized wellness plans tailored to your needs.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="inline-block p-3 bg-green-50 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer userType="patient" />
    </div>
  );
}