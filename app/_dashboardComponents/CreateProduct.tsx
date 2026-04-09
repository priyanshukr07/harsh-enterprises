"use client";

import { useId } from "react";
import React, { useState, useEffect, useMemo } from "react";
import {
  Sprout,
  Leaf,
  Sun,
  Droplets,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { CreatePro } from "@/providers/toolkit/features/CreateProductSlice";
import { useSession } from "next-auth/react";

interface ImageUploadBoxProps {
  value?: string; // current image url (main OR last uploaded)
  onUpload: (url: string) => void;
  onDelete?: (url: string) => void;
}

export function ImageUploadBox({
  value,
  onUpload,
  onDelete,
}: ImageUploadBoxProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Max file size is 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUpload(data.url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      onDelete?.(value);
    } catch {
      alert("Failed to delete image");
    }
  };

  return (
    <div
      className="relative w-37.5 h-37.5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        accept="image/*"
        id={inputId}
        className="hidden"
        onChange={handleSelect}
      />

      <label
        htmlFor={inputId}
        className="
          relative w-full h-full
          rounded-xl border-2 border-dashed
          border-slate-300 dark:border-slate-600
          overflow-hidden cursor-pointer
          flex items-center justify-center
          bg-slate-50 dark:bg-slate-900
        "
      >
        {/* IMAGE PREVIEW */}
        {value && (
          <img
            src={value}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* HOVER OVERLAY */}
        {(isHovering || !value) && (
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-xs font-medium transition">
            <Upload className="w-5 h-5 mb-1" />
            Click to upload
          </div>
        )}

        {/* UPLOADING OVERLAY */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs animate-pulse">
            Uploading…
          </div>
        )}
      </label>

      {/* DELETE BUTTON */}
      {value && (
        <button
          type="button"
          onClick={handleDelete}
          className="
            absolute top-1 right-1
            w-5 h-5 rounded-full
            bg-red-600 text-white
            flex items-center justify-center
            text-sm font-bold
            hover:bg-red-700
          "
          title="Delete image"
        >
          x
        </button>
      )}
    </div>
  );
}

const CreateProduct = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<string>("");

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  // Thread attributes
  const [denier, setDenier] = useState("");
  const [length, setLength] = useState("");
  const [material, setMaterial] = useState("");
  const [plyCount, setPlyCount] = useState("");
  const [spoolWeight, setSpoolWeight] = useState("");
  const [strength, setStrength] = useState("");

  // Cocopeat attributes
  const [weight, setWeight] = useState("");
  const [ecLevel, setEcLevel] = useState("");
  const [compression, setCompression] = useState("");
  const [moisture, setMoisture] = useState("");
  const [ph, setPh] = useState("");
  const [expansion, setExpansion] = useState("");
  const [grade, setGrade] = useState("");

  // Tray attributes
  const [cavities, setCavities] = useState("");
  const [cellVolume, setCellVolume] = useState("");
  const [trayMaterial, setTrayMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [thickness, setThickness] = useState("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const productTypes = useMemo(
    () => [
      { id: "threads", label: "Threads" },
      { id: "cocopeat", label: "Cocopeat" },
      { id: "seedling-tray", label: "Seedling Tray" },
    ],
    []
  );

  const addSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (colorInput.trim()) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setOtherImages(otherImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (categoryType !== "threads") {
      setColors([]);
      setColorInput("");
    }
  }, [categoryType]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("product-draft");
    if (!savedDraft) return;

    const d = JSON.parse(savedDraft);

    setName(d.name || "");
    setDescription(d.description || "");
    setPrice(d.price || "");
    setMainImage(d.mainImage || "");
    setOtherImages(d.otherImages || []);
    setQuantity(d.quantity || "");
    setSizes(d.sizes || []);
    setColors(d.categoryType === "threads" ? d.colors || [] : []);
    setCategories(d.categories || []);
    setCategoryType(d.categoryType || "");

    setDenier(d.denier || "");
    setLength(d.length || "");
    setMaterial(d.material || "");
    setPlyCount(d.plyCount || "");
    setSpoolWeight(d.spoolWeight || "");
    setStrength(d.strength || "");

    setWeight(d.weight || "");
    setEcLevel(d.ecLevel || "");
    setCompression(d.compression || "");
    setMoisture(d.moisture || "");
    setPh(d.ph || "");
    setExpansion(d.expansion || "");
    setGrade(d.grade || "");

    setCavities(d.cavities || "");
    setCellVolume(d.cellVolume || "");
    setTrayMaterial(d.trayMaterial || "");
    setDimensions(d.dimensions || "");
    setThickness(d.thickness || "");
    setRows(d.rows || "");
    setColumns(d.columns || "");
  }, []);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);
  const buildCreateProductPayload = () => {
    const payload: any = {
      name,
      description,
      price: parseFloat(price),
      mainImage,
      otherImages,
      quantity: parseInt(quantity),
      sizes,
      categoryType,
      userId: session?.user?.id,
    };

    if (categoryType === "threads") {
      Object.assign(payload, {
        colors,
        denier,
        length: length ? parseFloat(length) : undefined,
        material,
        plyCount: plyCount ? parseInt(plyCount) : undefined,
        spoolWeight: spoolWeight ? parseFloat(spoolWeight) : undefined,
        strength: strength ? parseFloat(strength) : undefined,
      });
    }

    if (categoryType === "cocopeat") {
      Object.assign(payload, {
        weight: weight ? parseFloat(weight) : undefined,
        ecLevel,
        compression,
        moisture: moisture ? parseFloat(moisture) : undefined,
        ph: ph ? parseFloat(ph) : undefined,
        expansion: expansion ? parseFloat(expansion) : undefined,
        grade,
      });
    }

    if (categoryType === "seedling-tray") {
      Object.assign(payload, {
        cavities: cavities ? parseInt(cavities) : undefined,
        cellVolume: cellVolume ? parseInt(cellVolume) : undefined,
        trayMaterial,
        dimensions,
        thickness: thickness ? parseFloat(thickness) : undefined,
        rows: rows ? parseInt(rows) : undefined,
        columns: columns ? parseInt(columns) : undefined,
      });
    }

    return payload;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !name ||
      !description ||
      !price ||
      !mainImage ||
      !quantity ||
      !categoryType
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = buildCreateProductPayload();

      // 🔥 Redux async thunk call
      const result = await dispatch(CreatePro(payload)).unwrap();

      // If we reach here → success
      setSuccess("Product created successfully!");
      localStorage.removeItem("product-draft");

      // Reset form (same as before)
      handleStartOver();
    } catch (err: any) {
      // Centralized error handling
      setError(err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem("product-draft");

    setName("");
    setDescription("");
    setPrice("");
    setMainImage("");
    setOtherImages([]);
    setQuantity("");
    setSizes([]);
    setColors([]);
    setCategories([]);
    setCategoryType("");

    setDenier("");
    setLength("");
    setMaterial("");
    setPlyCount("");
    setSpoolWeight("");
    setStrength("");

    setWeight("");
    setEcLevel("");
    setCompression("");
    setMoisture("");
    setPh("");
    setExpansion("");
    setGrade("");

    setCavities("");
    setCellVolume("");
    setTrayMaterial("");
    setDimensions("");
    setThickness("");
    setRows("");
    setColumns("");

    setError("");
    setSuccess("");
  };

  const buildDraftPayload = () => ({
    name,
    description,
    price,
    mainImage,
    otherImages,
    quantity,
    sizes,
    colors,
    categories,
    categoryType,

    // Thread
    denier,
    length,
    material,
    plyCount,
    spoolWeight,
    strength,

    // Cocopeat
    weight,
    ecLevel,
    compression,
    moisture,
    ph,
    expansion,
    grade,

    // Tray
    cavities,
    cellVolume,
    trayMaterial,
    dimensions,
    thickness,
    rows,
    columns,
  });

  const handleSaveDraft = () => {
    const draft = buildDraftPayload();
    localStorage.setItem("product-draft", JSON.stringify(draft));
    setSuccess("Draft saved successfully");
  };

  return (
    <div className="space-y-6 bg-background text-foreground">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold bg-background text-foreground flex items-center gap-2">
          <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
          Product Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium bg-background text-foreground mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Premium Cotton Thread"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-muted-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your product..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-muted-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Product Type * (select one)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {productTypes.map((type) => {
            const isActive = categoryType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setCategoryType(type.id)}
                className={`
                  px-4 py-3 rounded-xl border text-sm font-semibold transition-all
                  flex items-center justify-center gap-2
                  ${
                    isActive
                      ? "bg-green-600 text-white border-green-600 shadow-full scale-[1.02]"
                      : "bg-background text-foreground border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-500 hover:text-green-600"
                  }
                `}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sun className="w-5 h-5 text-green-600 dark:text-green-400" />
          Pricing & Inventory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
        <div className=" flex-1 mr-4 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700 ">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Available Sizes
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyUp={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSize())
              }
              placeholder="e.g., Small, Medium, Large"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={addSize}
              className="sm:w-auto w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <Plus className="w-5 h-5 mx-auto" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {categoryType === "threads" && (
          <div className="flex-1 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Available Colors
            </h2>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addColor())
                }
                placeholder="e.g., Red, Blue, Green"
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={addColor}
                className="sm:w-auto w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <Plus className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          Product Images
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 mr-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Main Image *
            </label>
            <ImageUploadBox
              value={mainImage}
              onUpload={(url) => setMainImage(url)}
              onDelete={() => setMainImage("")}
            />

            {/* {mainImage && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                {mainImage}
              </p>
            )} */}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Images
            </label>
            <ImageUploadBox
              value={otherImages.at(-1)}
              onUpload={(url) => setOtherImages((prev) => [...prev, url])}
              onDelete={(url) =>
                setOtherImages((prev) => prev.filter((img) => img !== url))
              }
            />

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {otherImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={img}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {categoryType === "threads" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-green-600 dark:text-green-400" />
            Thread Attributes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Denier
              </label>
              <input
                type="text"
                value={denier}
                onChange={(e) => setDenier(e.target.value)}
                placeholder="e.g., 150D"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Length (meters)
              </label>
              <input
                type="number"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., Cotton, Polyester"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Ply Count
              </label>
              <input
                type="number"
                value={plyCount}
                onChange={(e) => setPlyCount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Spool Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={spoolWeight}
                onChange={(e) => setSpoolWeight(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Strength (N)
              </label>
              <input
                type="number"
                step="0.01"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {categoryType === "cocopeat" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-green-600 dark:text-green-400" />
            Cocopeat Attributes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                EC Level
              </label>
              <input
                type="text"
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value)}
                placeholder="e.g., Low, Medium, High"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Compression
              </label>
              <input
                type="text"
                value={compression}
                onChange={(e) => setCompression(e.target.value)}
                placeholder="e.g., 5:1"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Moisture (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                pH Level
              </label>
              <input
                type="number"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Expansion Ratio
              </label>
              <input
                type="number"
                step="0.01"
                value={expansion}
                onChange={(e) => setExpansion(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g., Premium, Standard"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {categoryType === "seedling-tray" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-green-600 dark:text-green-400" />
            Seedling Tray Attributes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Number of Cavities
              </label>
              <input
                type="number"
                value={cavities}
                onChange={(e) => setCavities(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Cell Volume (ml)
              </label>
              <input
                type="number"
                value={cellVolume}
                onChange={(e) => setCellVolume(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Tray Material
              </label>
              <input
                type="text"
                value={trayMaterial}
                onChange={(e) => setTrayMaterial(e.target.value)}
                placeholder="e.g., Plastic, Biodegradable"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g., 50cm x 25cm x 5cm"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Thickness (mm)
              </label>
              <input
                type="number"
                step="0.01"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Rows
              </label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Columns
              </label>
              <input
                type="number"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:flex-1 px-6 py-3 cursor-pointer bg-linear-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 transition-all shadow-lg shadow-green-500/30 dark:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Publish Product"}
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="w-full sm:flex-1 px-6 py-3 cursor-pointer border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={handleStartOver}
          className="w-full sm:flex-1 px-6 py-3 cursor-pointer border border-red-300 text-red-600 bg-white rounded-lg font-semibold hover:bg-red-50 transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
