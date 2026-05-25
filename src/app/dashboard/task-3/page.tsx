"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";

export default function Task3ProblemStatement() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task3)]">
          Task 3: Lead Software Projects
        </h1>
        <p className="text-muted-foreground mb-8">
          Lunar Terrain Classification & ML Pipeline
        </p>

        <TaskSubNav taskNumber={3} />

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 p-6 rounded-xl border border-[var(--color-star-task3)]/20 mb-8 mt-6">
            <p className="text-foreground/90 leading-relaxed font-serif text-lg italic m-0">
              "This task focuses on your project development and problem-solving skills. You will work through one of STAC’s previous research projects while also demonstrating your AI/ML understanding and engineering approach.

The assessment is based around lunar surface analysis using Digital Elevation Models (DEMs) and includes working with LinaDEM, STAC’s official Python library for terrain analysis and scientific computing. The goal is to evaluate how effectively you can understand existing systems, build upon them, and apply AI/ML techniques to real research workflows."
            </p>
          </div>
          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Background</h3>
          <p className="text-muted-foreground leading-relaxed">
            The club heavily relies on advanced simulations to train its models. For this task, we are utilizing the proprietary <code>lunadem</code> Python library. This library interfaces with a real, live lunar dataset consisting of geological and sensor data.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Your goal is to train a machine learning model capable of classifying the lunar terrain based on raw sensor readings.
          </p>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Data Acquisition:</strong> Use the library to fetch historical training data via <code>get_previously_available_data()</code>. This will provide you with 8 raw sensor features.</li>
            <li><strong>Feature Engineering:</strong> Use the 4 provided extraction functions in the library to build 4 additional derived features.</li>
            <li><strong>Model Training:</strong> Train a classifier on the combined 12 features.</li>
            <li><strong>Validation:</strong> Use <code>predict_label()</code> to check your model's accuracy against our internal reference engine.</li>
            <li><strong>Live Inference:</strong> Your final pipeline must be able to ingest live data streams via <code>get_current_data()</code>.</li>
          </ul>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-8">
            <h4 className="font-bold text-red-400 mb-2 font-syne">Leaderboard & Academic Honesty</h4>
            <p className="text-red-400 text-sm leading-relaxed mb-2">
              Your submitted metrics will populate the live Task 3 Leaderboard.
            </p>
            <p className="text-red-400 text-sm font-bold leading-relaxed">
              WARNING: All submitted metrics will be verified manually by running your notebook. Intentionally submitting fake or incorrect scores to boost your rank will result in negative points and possible public penalization.
            </p>
          </div>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Deliverables</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>A Jupyter Notebook (or equivalent) hosted on a private GitHub repository. You must add the GitHub accounts <code>Kartavya728</code> and <code>STAC-IITMandi</code> as collaborators to your repository.</li>
            <li>A detailed README explaining your ML pipeline, feature engineering, and model choices.</li>
            <li>Submission of your finalized metrics on the Submission tab.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
