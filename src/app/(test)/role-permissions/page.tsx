"use client";

import { useState } from "react";
import {
  useAuth,
  useHasRole,
  useHasMinRole,
  useHasPermission,
} from "@/lib/auth/gateways/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { type UserRole } from "@/features/auth/schemas/role.schema";
import { getUserPermissionsClient } from "@/lib/auth/permission-checker-client";
import PageContainer from "@/components/layout/page-container";

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: "member",
    label: "Member",
    description: "Basic user with limited permissions",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Elevated permissions for managing content",
  },
  {
    value: "superadmin",
    label: "Superadmin",
    description: "Full access, can create custom roles",
  },
];

// Group permissions by category for better display
const permissionCategories = [
  {
    name: "Users",
    permissions: [
      PERMISSIONS.users.view,
      PERMISSIONS.users.create,
      PERMISSIONS.users.edit,
      PERMISSIONS.users.delete,
      PERMISSIONS.users.assignRole,
      PERMISSIONS.users.viewAll,
    ],
  },
  {
    name: "Roles",
    permissions: [
      PERMISSIONS.roles.view,
      PERMISSIONS.roles.create,
      PERMISSIONS.roles.edit,
      PERMISSIONS.roles.delete,
      PERMISSIONS.roles.assign,
    ],
  },
  {
    name: "Settings",
    permissions: [
      PERMISSIONS.settings.view,
      PERMISSIONS.settings.edit,
      PERMISSIONS.settings.system,
    ],
  },
];

export default function RolePermissionsPage(): React.JSX.Element {
  const { user, role, loading } = useAuth();
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);

  // Client-side permission checks (using hooks)
  const isAdmin = useHasRole("admin");
  const isSuperadmin = useHasRole("superadmin");
  const hasMinAdmin = useHasMinRole("admin");
  const canViewUsers = useHasPermission(PERMISSIONS.users.view);
  const canCreateUsers = useHasPermission(PERMISSIONS.users.create);
  const canEditUsers = useHasPermission(PERMISSIONS.users.edit);
  const canDeleteUsers = useHasPermission(PERMISSIONS.users.delete);
  const canManageRoles = useHasPermission(PERMISSIONS.roles.create);

  // Get permissions for current or simulated role
  const effectivePermissions = simulatedRole
    ? ROLE_PERMISSIONS[simulatedRole]
    : getUserPermissionsClient(user);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current User & Role</CardTitle>
            <CardDescription>
              Your actual authentication state and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "Not logged in"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-xs">{user?.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Role</p>
                <p className="font-medium capitalize">{role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Simulated Role</p>
                <p className="font-medium capitalize">
                  {simulatedRole || "None (using actual role)"}
                </p>
              </div>
            </div>

            {user && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">App Metadata:</p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(user.app_metadata || {}, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Role Simulation</CardTitle>
            <CardDescription>
              Simulate different roles to see what permissions they would have
              (does not change your actual role)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {roles.map((roleOption) => (
                <button
                  key={roleOption.value}
                  onClick={() =>
                    setSimulatedRole(
                      simulatedRole === roleOption.value
                        ? null
                        : roleOption.value
                    )
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    simulatedRole === roleOption.value
                      ? "border-primary bg-primary/5"
                      : simulatedRole === null && role === roleOption.value
                        ? "border-primary/50 bg-muted"
                        : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold">{roleOption.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {roleOption.description}
                  </div>
                  {simulatedRole === roleOption.value && (
                    <div className="text-xs text-primary mt-2">
                      ✓ Simulating
                    </div>
                  )}
                  {simulatedRole === null && role === roleOption.value && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Your current role
                    </div>
                  )}
                </button>
              ))}
            </div>
            {simulatedRole && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Simulation Mode:</strong> Showing permissions for{" "}
                  <code className="bg-muted px-2 py-1 rounded">
                    {simulatedRole}
                  </code>{" "}
                  role. Your actual role in the database is still{" "}
                  <code className="bg-muted px-2 py-1 rounded">{role}</code>.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Client-Side Gateway Hooks Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Auth Gateway Hooks</CardTitle>
            <CardDescription>
              Results from client-side permission checking hooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasRole(&quot;admin&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {isAdmin ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasRole(&quot;superadmin&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {isSuperadmin ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasMinRole(&quot;admin&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {hasMinAdmin ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasPermission(&quot;users.view&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {canViewUsers ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasPermission(&quot;users.create&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {canCreateUsers ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasPermission(&quot;users.edit&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {canEditUsers ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasPermission(&quot;users.delete&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {canDeleteUsers ? "✓ True" : "✗ False"}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  useHasPermission(&quot;roles.create&quot;)
                </p>
                <p className="text-lg font-semibold mt-1">
                  {canManageRoles ? "✓ True" : "✗ False"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions by Category */}
        <Card>
          <CardHeader>
            <CardTitle>
              Permissions for{" "}
              {simulatedRole ? `${simulatedRole} (simulated)` : role} Role
            </CardTitle>
            <CardDescription>
              All permissions available to the{" "}
              {simulatedRole ? "simulated" : "current"} role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-semibold mb-3">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {category.permissions?.map((permission) => {
                      const hasPermission = effectivePermissions.some(
                        (perm) =>
                          perm === PERMISSIONS.all ||
                          perm === permission ||
                          (perm.endsWith(".*") &&
                            permission.startsWith(perm.slice(0, -2) + "."))
                      );
                      return (
                        <div
                          key={permission}
                          className={`p-2 rounded border text-sm ${
                            hasPermission
                              ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                              : "bg-muted border-border opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{hasPermission ? "✓" : "✗"}</span>
                            <code className="text-xs">{permission}</code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {effectivePermissions.includes(PERMISSIONS.all) && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Wildcard Permission:</strong> This role has the{" "}
                  <code className="bg-muted px-2 py-1 rounded">*</code>{" "}
                  permission, which grants access to everything.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Role Permissions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Default Role Permissions Reference</CardTitle>
            <CardDescription>
              Default permissions assigned to each system role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((roleOption) => {
                const rolePerms = ROLE_PERMISSIONS[roleOption.value];
                const hasAll = rolePerms.includes(PERMISSIONS.all);
                return (
                  <div key={roleOption.value} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{roleOption.label}</h4>
                      <span className="text-xs text-muted-foreground">
                        {hasAll
                          ? "All permissions"
                          : `${rolePerms.length} permissions`}
                      </span>
                    </div>
                    {hasAll ? (
                      <p className="text-sm text-muted-foreground">
                        Has wildcard permission (<code>*</code>) - full access
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rolePerms.slice(0, 10).map((perm) => (
                          <code
                            key={perm}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {perm}
                          </code>
                        ))}
                        {rolePerms.length > 10 && (
                          <span className="text-xs text-muted-foreground">
                            +{rolePerms.length - 10} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
