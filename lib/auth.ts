import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { redirect } from 'next/navigation'

export async function requireOnboarding() {
  const { userId, orgId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (!orgId) {
    return null
  }

  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  })

  if (!organization) {
    redirect('/onboarding')
  }

  return organization
}

export async function getOrganization() {
  const { orgId } = await auth()

  if (!orgId) {
    return null
  }

  return await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
}
