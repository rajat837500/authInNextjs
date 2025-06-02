// src/app/unauthorized/page.tsx

"use client";
export default function Unauthorized() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Access Denied</h1>
      <p className="mt-2 text-lg">You do not have permission to view this page.</p>
    </div>
  );
}
