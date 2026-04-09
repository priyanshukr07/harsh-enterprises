import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

/**
 * Extract Cloudinary public_id from secure URL
 * Example:
 * https://res.cloudinary.com/demo/image/upload/v1234/products/abc.jpg
 * → products/abc
 */
function extractPublicId(url: string) {
  const parts = url.split("/");
  const uploadIndex = parts.findIndex((p) => p === "upload");

  if (uploadIndex === -1) return null;

  const publicIdWithExt = parts
    .slice(uploadIndex + 2)
    .join("/")
    .split(".")[0];

  return publicIdWithExt;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { message: "Image URL is required" },
        { status: 400 }
      );
    }

    const publicId = extractPublicId(url);

    if (!publicId) {
      return NextResponse.json(
        { message: "Invalid Cloudinary URL" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { message: "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      publicId,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { message: "Server error while deleting image" },
      { status: 500 }
    );
  }
}
