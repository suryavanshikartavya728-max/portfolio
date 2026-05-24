import React from "react";
import { Shield, AlertTriangle, Scale, BookOpen } from "lucide-react";

export default function RulebookPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--color-star-border)]">
          <div className="p-4 bg-[var(--color-star-accent)]/10 rounded-2xl text-[var(--color-star-accent)]">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-syne mb-2">STAR Rulebook</h1>
            <p className="text-muted-foreground font-mono">Official Guidelines & Evaluation Policy</p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[var(--color-star-accent)]" />
              <h2 className="text-2xl font-bold font-syne">1. Repository Rules</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed">
              <p>
                All code submissions must be hosted on <strong>GitHub</strong>. 
                Your repositories must be set to <strong>PRIVATE</strong> from the moment of creation.
              </p>
              <p>
                You must invite the GitHub account <code>Kartavya28</code> as a collaborator to your private repository for evaluation purposes. If your repository is public, it will be flagged for plagiarism.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-[var(--color-star-danger)]" />
              <h2 className="text-2xl font-bold font-syne text-[var(--color-star-danger)]">2. Zero Tolerance Plagiarism Policy</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed border-l-2 border-[var(--color-star-danger)]/30 ml-3">
              <p>
                The Space Technology and Astronomy Cell strictly adheres to a zero-tolerance policy regarding code plagiarism.
              </p>
              <p>
                If we find that your codebase matches another applicant's code, or is an exact copy of a pre-existing open-source project without attribution, <strong>both</strong> parties will be immediately disqualified from the recruitment drive.
              </p>
              <p>
                The use of LLMs (like ChatGPT, Claude) is allowed for debugging and structural guidance, but auto-generating your entire project is highly discouraged as we evaluate your architectural choices during the interview phase.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-[var(--color-star-task2)]" />
              <h2 className="text-2xl font-bold font-syne">3. Evaluation Criteria</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed">
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li><strong>Functionality:</strong> Does the code do what the problem statement asked for?</li>
                <li><strong>Code Quality:</strong> Is the code modular, readable, and well-documented?</li>
                <li><strong>UI/UX (For Web Tasks):</strong> Is the interface intuitive and responsive?</li>
                <li><strong>Performance & ML Metrics (For Task 3):</strong> Accuracy and validity of your mathematical models.</li>
              </ul>
              <p className="mt-4">
                Attempting multiple tasks is appreciated but not strictly required. A stellar submission in a single task is better than mediocre submissions across all three.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
