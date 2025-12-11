'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
  const { userId, orgId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  if (!orgId) {
    throw new Error('No organization found')
  }

  // Find the organization by clerkOrgId
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  })

  if (!organization) {
    return []
  }

  const orders = await prisma.order.findMany({
    where: { orgId: organization.id },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const { userId, orgId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  if (!orgId) {
    throw new Error('No organization found')
  }

  // Find the organization by clerkOrgId
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  })

  if (!organization) {
    throw new Error('Organization not found')
  }

  // Verify the order belongs to this organization
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      orgId: organization.id,
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  })

  revalidatePath('/')
}
