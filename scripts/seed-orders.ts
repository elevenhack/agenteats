import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const sampleOrders = [
  {
    whoItsFor: 'John Smith',
    orders: '1x Margherita Pizza, 1x Garlic Bread, 2x Coke',
    status: 'new',
  },
  {
    whoItsFor: 'Sarah Johnson',
    orders: '2x Pepperoni Pizza, 1x Caesar Salad, 1x Sprite',
    status: 'new',
  },
  {
    whoItsFor: 'Mike Wilson',
    orders: '1x BBQ Chicken Pizza, 3x Buffalo Wings, 1x Lemonade',
    status: 'preparing',
  },
  {
    whoItsFor: 'Emily Brown',
    orders: '1x Vegetarian Supreme, 1x Mushroom Soup, 2x Water',
    status: 'preparing',
  },
  {
    whoItsFor: 'David Lee',
    orders: '3x Meat Lovers Pizza, 2x Cheesy Breadsticks, 4x Pepsi',
    status: 'ready',
  },
  {
    whoItsFor: 'Jessica Taylor',
    orders: '1x Hawaiian Pizza, 1x Greek Salad, 1x Iced Tea',
    status: 'ready',
  },
  {
    whoItsFor: 'Chris Martinez',
    orders: '2x Four Cheese Pizza, 1x Tiramisu, 2x Coffee',
    status: 'new',
  },
  {
    whoItsFor: 'Amanda Garcia',
    orders: '1x Spicy Italian, 2x Mozzarella Sticks, 1x Root Beer',
    status: 'delivered',
  },
  {
    whoItsFor: 'Ryan Thomas',
    orders: '1x Supreme Pizza, 1x Chicken Tenders, 1x Chocolate Shake',
    status: 'new',
  },
  {
    whoItsFor: 'Nicole Anderson',
    orders: '2x Capricciosa, 1x Bruschetta, 2x San Pellegrino',
    status: 'preparing',
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Get the first organization in the database
  const organization = await prisma.organization.findFirst()

  if (!organization) {
    console.error('❌ No organization found in the database.')
    console.log('Please create an organization first via the welcome page.')
    process.exit(1)
  }

  console.log(`📍 Found organization: ${organization.name || organization.clerkOrgId}`)

  // Create orders
  for (const order of sampleOrders) {
    const created = await prisma.order.create({
      data: {
        orgId: organization.id,
        whoItsFor: order.whoItsFor,
        orders: order.orders,
        status: order.status,
      },
    })
    console.log(`✅ Created order for ${created.whoItsFor}`)
  }

  console.log('\n🎉 Successfully seeded 10 orders!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
