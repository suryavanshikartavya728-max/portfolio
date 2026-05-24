"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import Link from "next/link";

export default function Task2ProblemStatement() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task2)]">
          Task 2: Representation at Competitions
        </h1>
        <p className="text-muted-foreground mb-8">
          Interactive Lunar Dataset Dashboard
        </p>

        <TaskSubNav taskNumber={2} />

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 p-6 rounded-xl border border-[var(--color-star-task2)]/20 mb-8 mt-6">
            <p className="text-foreground/90 leading-relaxed font-serif text-lg italic m-0">
              "As a software team member of STAC, you will represent both STAC and Indian Institute of Technology Mandi at various national and international competitions such as NASA Space Apps Challenge, Inter IIT Tech Meet, the ISRO Space Hackathon, and many more.

To evaluate whether you are capable of representing IIT Mandi in competitions like Inter IIT Tech Meet, we are providing you with one of the challenging problem statements inspired by previous years’ work. We understand that these are not single-person problem statements and are usually solved by teams over weeks of effort. Because of that, we are not expecting a complete solution.

Instead, we want to evaluate your thinking ability, problem-solving approach, creativity, technical understanding, and how you break down and approach complex real-world problems."
            </p>
          </div>
          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Background</h3>
          <p className="text-muted-foreground leading-relaxed">
            At the Inter IIT Tech Meet 13.0, the Space Technology and Astronomy Cell (STAC) secured an 5 place among all the IITs. Such challenge involved processing data from the CLASS (Chandrayaan-2 Large Area Soft X-ray Spectrometer) payload on the Chandrayaan-2 mission.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            For this task, you are required to build an interactive dashboard to visualize and analyze lunar X-ray fluorescence datasets.
          </p>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Data Visualization:</strong> Implement at least two interactive visualizations (e.g., scatter plots, heatmaps, or histograms) using the provided dataset.</li>
            <li><strong>Filtering:</strong> Allow users to filter the data interactively based on various parameters available in the dataset.</li>
            <li><strong>Analysis Section:</strong> Include a section that explains the significance of the dataset and the visualizations provided.</li>
            <li><strong>Responsiveness:</strong> Ensure the dashboard works seamlessly on both desktop and mobile devices.</li>
          </ul>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Deliverables</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>A working frontend or full-stack dashboard application.</li>
            <li>Source code hosted on a private GitHub repository (with access granted to the specified evaluator).</li>
            <li>A deployed, live version of the application.</li>
            <li>Provide a few sample output images from your dashboard in your repository's README.</li>
          </ul>

          <div className="bg-[var(--color-star-task2)]/10 border border-[var(--color-star-task2)]/30 rounded-xl p-4 mt-8">
            <h4 className="font-bold text-[var(--color-star-task2)] mb-2 font-syne">Bonus Points</h4>
            <ul className="list-disc list-inside text-sm text-[var(--color-star-task2)]/80 space-y-1">
              <li>Implementation of advanced interactive mapping using WebGL or similar technologies.</li>
              <li>Perform client-side data aggregations and statistical summaries.</li>
              <li>A sleek UI with smooth transitions and animations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
