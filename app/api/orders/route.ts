import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { orgId, whoItsFor, orders } = body

    // Validate required fields
    if (!orgId || !whoItsFor || !orders) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, whoItsFor, and orders are required' },
        { status: 400 }
      )
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        orgId,
        whoItsFor,
        orders,
        status: 'new',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
