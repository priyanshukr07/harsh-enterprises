export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image");

  return res.json(); // { url, public_id }
}
