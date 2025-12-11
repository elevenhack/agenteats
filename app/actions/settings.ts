'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getOrganizationSettings() {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return null
  }

  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    select: {
      id: true,
      name: true,
      location: true,
      typicalWaitTime: true,
      menu: true,
      agentId: true,
    },
  })

  return organization
}

export async function updateOrganizationSettings(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  if (!orgId) {
    throw new Error('No organization found')
  }

  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const typicalWaitTime = formData.get('typicalWaitTime') as string

  await prisma.organization.update({
    where: { clerkOrgId: orgId },
    data: {
      name,
      location,
      typicalWaitTime,
    },
  })

  return { success: true }
}

export async function updateMenu(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  if (!orgId) {
    throw new Error('No organization found')
  }

  const menu = formData.get('menu') as string

  await prisma.organization.update({
    where: { clerkOrgId: orgId },
    data: {
      menu,
    },
  })

  return { success: true }
}
