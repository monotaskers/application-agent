/**
 * @fileoverview API route handler for avatar upload operations
 * @module app/api/auth/avatar
 */

import { createClient } from "@/utils/supabase/server";
import { updateProfile } from "@/lib/auth/profile";
import { errorResponseSchema } from "@/features/auth/schemas/profile.schema";
import type { NextRequest } from "next/server";

/**
 * Maximum file size for avatar uploads (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Allowed MIME types for avatar images
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Storage bucket name for avatars
 */
const AVATARS_BUCKET = "avatars";

/**
 * POST /api/auth/avatar
 * Uploads an avatar image to Supabase Storage and updates the user's profile
 *
 * @param request - Next.js request object with FormData containing the avatar file
 * @returns JSON response with avatar URL or error
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        errorResponseSchema.parse({
          error: "UNAUTHORIZED",
          message: "User not authenticated",
        }),
        { status: 401 }
      );
    }

    // Parse FormData from request
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return Response.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: "No file provided",
        }),
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return Response.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }),
        { status: 400 }
      );
    }

    // Generate unique filename: user-id-timestamp.extension
    const fileExtension = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const fileName = `${user.id}-${timestamp}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return Response.json(
        errorResponseSchema.parse({
          error: "UPLOAD_ERROR",
          message: `Failed to upload avatar: ${uploadError.message}`,
        }),
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(AVATARS_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return Response.json(
        errorResponseSchema.parse({
          error: "UPLOAD_ERROR",
          message: "Failed to generate avatar URL",
        }),
        { status: 500 }
      );
    }

    // Update profile with new avatar URL
    const profile = await updateProfile({
      avatar_url: urlData.publicUrl,
    });

    return Response.json(
      {
        avatar_url: profile.avatar_url,
        message: "Avatar uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading avatar:", error);

    return Response.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to upload avatar",
      }),
      { status: 500 }
    );
  }
}
