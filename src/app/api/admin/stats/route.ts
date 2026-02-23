export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");

    const [totalProducts, totalOrders, totalCustomers, orders] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({ select: { totalAmount: true, status: true } }),
      ]);

    const totalRevenue = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
