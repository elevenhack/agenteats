import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createOrganization } from '../actions/onboarding'

export default async function OnboardingPage() {
  const { userId, orgId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Found</h1>
          <p>Please create or join an organization in Clerk first.</p>
        </div>
      </div>
    )
  }

  // Check if organization already exists
  const existingOrg = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  })

  if (existingOrg) {
    redirect('/menu')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to AgentEats!</h1>
        <p className="text-gray-600 mb-8">
          Let's set up your restaurant to start taking AI-powered phone orders.
        </p>

        <form action={createOrganization} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              placeholder="Joe's Pizza"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              placeholder="123 Main St, New York, NY"
            />
          </div>

          <div>
            <label htmlFor="typicalWaitTime" className="block text-sm font-medium mb-2">
              Typical Wait Time
            </label>
            <input
              type="text"
              id="typicalWaitTime"
              name="typicalWaitTime"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              placeholder="15-20 minutes"
            />
          </div>

          <div>
            <label htmlFor="menu" className="block text-sm font-medium mb-2">
              Menu
            </label>
            <textarea
              id="menu"
              name="menu"
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent font-mono text-sm"
              placeholder="Enter your menu in markdown format...

Example:
# Pizza
- Margherita - $12
- Pepperoni - $14

# Drinks
- Soda - $2
- Water - $1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6c47ff] text-white rounded-lg font-medium py-3 hover:bg-[#5a3de0] transition-colors"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  )
}
