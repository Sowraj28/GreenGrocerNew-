export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { userAuthOptions, adminAuthOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(userAuthOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { items, totalAmount, address, phone } = await req.json();

    for (const item of items) {
      await prisma.productVariant.updateMany({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { userId } });

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        address,
        phone,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            weight: item.weight,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } }, user: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check admin session first
    const adminSession = await getServerSession(adminAuthOptions);
    if (adminSession && (adminSession.user as any).role === "admin") {
      const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } }, user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    // Then check user session
    const userSession = await getServerSession(userAuthOptions);
    if (userSession) {
      const userId = (userSession.user as any).id;
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
