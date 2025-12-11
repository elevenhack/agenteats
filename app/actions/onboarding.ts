'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createElevenLabsAgent } from '@/lib/elevenlabs'

export async function createOrganization(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  if (!orgId) {
    throw new Error('No organization found')
  }

  const name = formData.get('name') as string
  const menu = formData.get('menu') as string
  const location = formData.get('location') as string
  const typicalWaitTime = formData.get('typicalWaitTime') as string

  // Fetch the Clerk organization to get the agent ID or any other data
  const client = await clerkClient()
  const clerkOrg = await client.organizations.getOrganization({
    organizationId: orgId,
  })

  // Create ElevenLabs agent with restaurant information
  const agentId = await createElevenLabsAgent({
    restaurantName: name,
    location,
    menu,
  })

  // Create the organization in the database with the agent ID
  await prisma.organization.create({
    data: {
      clerkOrgId: orgId,
      agentId,
      name,
      menu,
      location,
      typicalWaitTime,
    },
  })

  redirect('/')
}
