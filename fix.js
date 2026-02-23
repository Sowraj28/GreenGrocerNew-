const fs = require("fs");

const files = [
  "src/app/api/auth/register/route.ts",
  "src/app/api/categories/route.ts",
  "src/app/api/orders/route.ts",
  "src/app/api/products/route.ts",
  "src/app/api/upload/route.ts",
  "src/app/api/admin/customers/route.ts",
  "src/app/api/admin/stats/route.ts",
  "src/app/api/orders/[id]/route.ts",
  "src/app/api/products/[id]/route.ts",
];

files.forEach((f) => {
  try {
    let c = fs.readFileSync(f, "utf8");

    // Remove ALL dynamic prisma imports
    c = c.replace(
      /\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);/g,
      "",
    );

    // Remove static prisma imports
    c = c.replace(
      /import\s*\{\s*prisma\s*\}\s*from\s*['"]@\/lib\/prisma['"];?\n?/g,
      "",
    );

    // Add ONE dynamic import after first try {
    c = c.replace(
      /(try\s*\{)/,
      '$1\n    const { prisma } = await import("@/lib/prisma");',
    );

    fs.writeFileSync(f, c);
    console.log("Fixed:", f);
  } catch (e) {
    console.log("Skip:", f, e.message);
  }
});
