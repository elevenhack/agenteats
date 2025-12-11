import { Phone, DollarSign, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import Dashboard from '@/components/Dashboard'
import AgentDemo from '@/components/AgentDemo'

export default function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  )
}

function LandingPage() {
  return (
    <main className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative px-4 py-20 mx-auto max-w-7xl overflow-hidden min-h-[50vh]">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 w-full h-full">
          
        </div>

        <div className="relative z-10 text-center mb-16">
          {/* <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
            Now serving 100+ restaurants nationwide
          </div> */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AgentEats
            <br />
            <span className="text-3xl md:text-5xl text-gray-600 font-normal">Never Miss Another Order</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Automated phone ordering that works 24/7. No staff training, no per-order fees, 
            no missed calls. Just more revenue for your restaurant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
         
          </div>
          <p className="text-sm text-gray-500">Free 14-day trial • No credit card required • Setup in 5 minutes</p>
        </div>

       

      </section>

      {/* Demo Agent */}
      <section className="px-4 py-16  grid grid-cols-2 max-w-6xl mx-auto gap-8">

        
          <AgentDemo />
   
        <div className="flex flex-col justify-center items-start">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Customer calls your number</li>
            <li>• AI agent takes the order naturally</li>
            <li>• Order sent directly to your kitchen system</li>
            <li>• No commission, no middleman</li>
             <li>• Try it out on the left!</li>
          </ul>
        </div>
      </section>


      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Automate Phone Orders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our system handles every aspect of phone ordering so you can focus on cooking great food</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Natural Conversations</h3>
              <p className="text-gray-600">Handles complex orders, modifications, and questions just like your best staff member would</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Availability</h3>
              <p className="text-gray-600">Never miss an order again. Works during busy hours, after closing, and on holidays</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Zero Commission</h3>
              <p className="text-gray-600">Keep 100% of your revenue. No per-order fees, no percentage cuts, just a simple monthly subscription</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu Integration</h3>
              <p className="text-gray-600">Automatically syncs with your menu, prices, and availability. Updates in real-time</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Accuracy</h3>
              <p className="text-gray-600">95% accuracy rate with built-in order confirmation and customer verification</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Setup</h3>
              <p className="text-gray-600">Get started in 5 minutes. No technical knowledge required, we handle everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-blue-50">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-700 font-medium">Always Available</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-green-50">
            <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
            <div className="text-gray-700 font-medium">Commission Fees</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-purple-50">
            <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Order Accuracy</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stop Losing Money on Phone Orders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Small restaurants struggle with phone orders while delivery apps charge 20-30% commission. 
              There&apos;s a better way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-6">The Old Way</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Staff Always Needed</div>
                    <div className="text-gray-600">Someone must always answer phones during busy hours</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">High Commission Fees</div>
                    <div className="text-gray-600">UberEats, DoorDash charge 20-30% per order</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Missed Orders</div>
                    <div className="text-gray-600">Busy kitchens mean missed calls and lost revenue</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">The AgentEats Way</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">AI Handles Everything</div>
                    <div className="text-gray-600">Natural conversations, order taking, payment processing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Zero Commission</div>
                    <div className="text-gray-600">Flat monthly fee, keep 100% of your order value</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Never Miss a Call</div>
                    <div className="text-gray-600">24/7 availability, even during rush hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Automate Phone Orders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Conversations</h3>
              <p className="text-gray-600">AI that sounds human, understands accents, and handles complex orders</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Processing</h3>
              <p className="text-gray-600">Secure credit card processing over the phone with PCI compliance</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Integration</h3>
              <p className="text-gray-600">Orders sent directly to your POS system or kitchen printer</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600">Remembers regular customers and their favorite orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            No setup fees, no per-order charges, no hidden costs
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200">
            <div className="text-5xl font-bold text-blue-600 mb-4">$99</div>
            <div className="text-xl text-gray-700 mb-6">per month, unlimited orders</div>
            <div className="space-y-3 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Unlimited phone orders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">24/7 AI phone agent</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">POS system integration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Payment processing</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Customer support</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors w-full">
              Start Free Trial
            </button>
          </div>

          <div className="mt-8 text-gray-600">
            <strong>Compare:</strong> UberEats charges 20-30% per order. 
            With just 10 orders of $25 each, you&apos;d pay $50-75 in fees. 
            AgentEats costs the same regardless of order volume.
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Automate Your Phone Orders?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of restaurants saving thousands on order fees
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Free 14-Day Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-2xl font-bold text-white mb-4">AgentEats</div>
          <div className="text-gray-400 mb-8">AI-powered phone ordering for restaurants</div>
          <div className="text-gray-500 text-sm">
            © 2024 AgentEats. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
