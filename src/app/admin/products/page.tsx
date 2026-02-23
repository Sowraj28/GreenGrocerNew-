"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiLink,
  FiImage,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface Variant {
  id?: string;
  weight: string;
  price: number | string;
  stock: number | string;
}
interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  isActive: boolean;
  variants: Variant[];
  category?: { name: string };
}

const emptyForm = {
  name: "",
  description: "",
  imageUrl: "",
  categoryId: "",
  variants: [{ weight: "", price: "", stock: "" }] as any[],
};

type ImageInputMode = "url" | "upload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<ImageInputMode>("url");
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageMode("url");
    setUploadPreview("");
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
      variants: product.variants.map((v) => ({
        weight: v.weight,
        price: v.price,
        stock: v.stock,
      })),
    });
    setImageMode("url");
    setUploadPreview(product.imageUrl || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProducts();
      toast.success("Product deleted");
    } else toast.error("Delete failed");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setUploadPreview(base64);
      setUploading(true);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        if (res.ok) {
          const data = await res.json();
          setForm((f) => ({ ...f, imageUrl: data.url }));
          setUploadPreview(data.url);
          toast.success("Image uploaded to Cloudinary!");
        } else {
          // Cloudinary not configured — store base64 as fallback
          setForm((f) => ({ ...f, imageUrl: base64 }));
          toast("Image saved locally. Configure Cloudinary for CDN hosting.", {
            icon: "ℹ️",
          });
        }
      } catch {
        setForm((f) => ({ ...f, imageUrl: base64 }));
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      variants: form.variants.map((v) => ({
        weight: v.weight,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    };
    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      fetchProducts();
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setUploadPreview("");
      toast.success(editing ? "Product updated!" : "Product added!");
    } else {
      toast.error("Failed to save product");
    }
  };

  const addVariant = () =>
    setForm({
      ...form,
      variants: [...form.variants, { weight: "", price: "", stock: "" }],
    });
  const removeVariant = (i: number) =>
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });
  const updateVariant = (i: number, key: string, value: string) => {
    const v = [...form.variants];
    v[i] = { ...v[i], [key]: value };
    setForm({ ...form, variants: v });
  };

  const previewSrc =
    imageMode === "upload" ? uploadPreview || form.imageUrl : form.imageUrl;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          Products
        </h1>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Products table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Variants</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : products.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-50 flex-shrink-0">
                            {p.imageUrl ? (
                              <Image
                                src={p.imageUrl}
                                alt={p.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-xl flex h-full items-center justify-center">
                                🥬
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {p.category?.name || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v: any) => (
                            <span
                              key={v.id}
                              className="badge bg-brand-50 text-brand-primary"
                            >
                              {v.weight} • ₹{v.price}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          {p.variants.map((v: any) => (
                            <p
                              key={v.id}
                              className={`text-xs font-medium ${v.stock < 10 ? "text-red-500" : "text-gray-600"}`}
                            >
                              {v.weight}: {v.stock} units
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`badge ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 hover:bg-brand-50 rounded-lg text-brand-primary transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-display text-xl font-bold text-gray-800">
                {editing ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                  placeholder="e.g. Fresh Tomatoes"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Product description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image — dual mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>

                {/* Toggle buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImageMode("url");
                      setUploadPreview("");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      imageMode === "url"
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-gray-200 text-gray-600 hover:border-brand-light"
                    }`}
                  >
                    <FiLink size={15} /> Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      imageMode === "upload"
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-gray-200 text-gray-600 hover:border-brand-light"
                    }`}
                  >
                    <FiUpload size={15} /> Upload from Device
                  </button>
                </div>

                {/* URL input */}
                {imageMode === "url" && (
                  <input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                )}

                {/* File upload drop zone */}
                {imageMode === "upload" && (
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-brand-primary hover:bg-brand-50 transition-all flex flex-col items-center gap-2 text-gray-400 hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium text-brand-primary">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <FiImage size={32} />
                          <span className="text-sm font-semibold">
                            Click to select image from device
                          </span>
                          <span className="text-xs">
                            JPG, PNG, WebP supported
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Preview — shows for both modes */}
                {previewSrc && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                      <img
                        src={previewSrc}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        Image Preview
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, imageUrl: "" });
                          setUploadPreview("");
                        }}
                        className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Variants{" "}
                    <span className="text-gray-400 font-normal">
                      (Weight / Price / Stock)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1 text-brand-primary text-sm font-medium hover:text-brand-dark"
                  >
                    <FiPlus size={16} /> Add Variant
                  </button>
                </div>
                <div className="space-y-2">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={v.weight}
                        onChange={(e) =>
                          updateVariant(i, "weight", e.target.value)
                        }
                        className="input-field flex-1"
                        placeholder="e.g. 500g"
                        required
                      />
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) =>
                          updateVariant(i, "price", e.target.value)
                        }
                        className="input-field flex-1"
                        placeholder="Price ₹"
                        required
                        min="0"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) =>
                          updateVariant(i, "stock", e.target.value)
                        }
                        className="input-field flex-1"
                        placeholder="Stock"
                        required
                        min="0"
                      />
                      {form.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="p-2 text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : editing ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
