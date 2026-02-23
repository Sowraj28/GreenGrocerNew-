import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { userAuthOptions, adminAuthOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const adminSession = await getServerSession(adminAuthOptions);
    const userSession = await getServerSession(userAuthOptions);
    if (!adminSession && !userSession)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();

    // Admin actions — status change or item checkbox
    const adminSession = await getServerSession(adminAuthOptions);
    if (adminSession && (adminSession.user as any).role === "admin") {
      if (body.status) {
        const order = await prisma.order.update({
          where: { id: params.id },
          data: { status: body.status },
          include: { items: { include: { product: true } }, user: true },
        });
        return NextResponse.json(order);
      }

      if (body.itemId !== undefined && body.checked !== undefined) {
        const item = await prisma.orderItem.update({
          where: { id: body.itemId },
          data: { checked: body.checked },
        });
        return NextResponse.json(item);
      }
    }

    // User actions — cancel order
    const userSession = await getServerSession(userAuthOptions);
    if (userSession && body.cancel) {
      const userId = (userSession.user as any).id;
      const order = await prisma.order.findUnique({ where: { id: params.id } });
      if (!order || order.userId !== userId)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      if (order.status !== "PLACED")
        return NextResponse.json({ error: "Cannot cancel" }, { status: 400 });

      const items = await prisma.orderItem.findMany({
        where: { orderId: params.id },
      });
      for (const item of items) {
        await prisma.productVariant.updateMany({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }

      const updated = await prisma.order.update({
        where: { id: params.id },
        data: { status: "CANCELLED" },
        include: { items: { include: { product: true } }, user: true },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json(
      { error: "Unauthorized or invalid request" },
      { status: 401 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
