/**
 * @fileoverview New user creation page
 * @module app/admin/users/new/page
 *
 * Page for creating new user accounts with inline company creation support.
 */

import { type ReactElement } from "react";
import { UserForm } from "@/features/users/components/user-form";

/**
 * New user creation page
 *
 * Displays a form for creating new users with all required and optional fields.
 * Supports inline company creation when email domain doesn't match existing companies.
 *
 * @returns React element containing the new user form page
 */
export default function NewUserPage(): ReactElement {
  return (
    <div className="mx-auto max-w-3xl">
      <UserForm />
    </div>
  );
}
