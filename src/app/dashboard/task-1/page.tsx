"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";

export default function Task1ProblemStatement() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task1)]">
          Task 1: Club's Software Management
        </h1>
        <p className="text-muted-foreground mb-8">
          Inventory Management System
        </p>

        <TaskSubNav taskNumber={1} />

        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Background</h3>
          <p className="text-muted-foreground leading-relaxed">
            STAC frequently issues hardware components (like Arduino, Raspberry Pi, telescopes, and sensors) to its members. Currently, this process is managed manually via spreadsheets, which leads to inefficiencies, lost equipment, and lack of accountability. 
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We need a robust, digital Inventory Management System to handle the lifecycle of equipment borrowing, tracking, and returns.
          </p>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Authentication & Authorization:</strong> Implement role-based access control with three roles: Admin, Core Member, and Volunteer.</li>
            <li><strong>Dashboard:</strong> Display total items, items issued, and pending requests.</li>
            <li><strong>Inventory Tracking:</strong> Admins can add, edit, or remove inventory items (Name, Category, Total Quantity, Available Quantity).</li>
            <li><strong>Borrowing Workflow:</strong> Users can browse available items and submit a borrow request.</li>
            <li><strong>Approval System:</strong> Admins can approve or reject pending borrow requests.</li>
            <li><strong>Return Workflow:</strong> Users can mark items as returned, which updates the available quantity upon admin confirmation.</li>
          </ul>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Deliverables</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>A working full-stack application.</li>
            <li>Source code hosted on a private GitHub repository (with access granted to the specified evaluator).</li>
            <li>A deployed, live version of the application.</li>
            <li>Dummy credentials for the three roles to test the system.</li>
          </ul>

          <div className="bg-[var(--color-star-task1)]/10 border border-[var(--color-star-task1)]/30 rounded-xl p-4 mt-8">
            <h4 className="font-bold text-[var(--color-star-task1)] mb-2 font-syne">Bonus Points</h4>
            <ul className="list-disc list-inside text-sm text-[var(--color-star-task1)]/80 space-y-1">
              <li>Email notifications for request approvals or overdue items.</li>
              <li>QR Code generation and scanning for quick check-in/check-out.</li>
              <li>A mobile-responsive, aesthetically pleasing UI matching the STAR theme.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
