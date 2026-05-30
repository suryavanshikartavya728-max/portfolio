import React from "react";
import { Shield, AlertTriangle, Scale, BookOpen, CheckCircle2, Bot, Trophy, ShieldAlert } from "lucide-react";

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
            <p className="text-muted-foreground font-mono">Official Guidelines & Evaluation Policy for the STAR Test</p>
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
                You must invite the GitHub accounts <a href="https://github.com/Kartavya728" target="_blank" rel="noopener noreferrer" className="text-[var(--color-star-accent)] hover:underline">Kartavya728</a> and <a href="https://github.com/STAC-IITMandi" target="_blank" rel="noopener noreferrer" className="text-[var(--color-star-accent)] hover:underline">STAC-IITMandi</a> as collaborators to your private repository for evaluation purposes. Please ensure you also follow these GitHub profiles. If your repository is public, it will be flagged for plagiarism.
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

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-[var(--color-star-accent)]" />
              <h2 className="text-2xl font-bold font-syne">4. Submission Expectations & Flexibility</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed">
              <p>
                You are <strong>not required to complete all tasks</strong> in the STAR recruitment test. A strong and well-executed submission in even <strong>one task</strong> is sufficient to demonstrate your skills and problem-solving abilities.
              </p>
              <p>We value:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>Your approach to solving problems</li>
                <li>Your engineering and architectural decisions</li>
                <li>Your reasoning and experimentation process</li>
                <li>Your ability to explain and defend your implementation</li>
              </ul>
              <p>
                Even if your implementation is incomplete or partially working, you are <strong>strongly encouraged to submit your repository</strong> instead of skipping the test entirely.
              </p>
              <p className="mt-4 font-bold text-foreground">If you are unable to fully complete a task:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>Submit your GitHub repository with all attempted code.</li>
                <li>
                  Include a detailed <code>README.md</code> explaining:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Your thought process</li>
                    <li>Your implementation approach</li>
                    <li>Challenges you faced</li>
                    <li>Future improvements you planned</li>
                  </ul>
                </li>
                <li>Non-working or partially working code is completely acceptable if your approach and effort are clearly demonstrated.</li>
              </ul>
              <p className="mt-4 font-bold text-foreground">If you are unable to deploy your project:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>
                  You may provide a Google Drive link containing:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Screenshots/photos of your UI</li>
                    <li>Demo images/videos</li>
                    <li>Any supporting material</li>
                  </ul>
                </li>
                <li>
                  Include a <code>RUN.md</code> file containing:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Installation steps</li>
                    <li>Dependency setup commands</li>
                    <li>Environment variable setup</li>
                    <li>Exact commands required to run the project locally on our system</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Bot className="text-[var(--color-star-task1)]" />
              <h2 className="text-2xl font-bold font-syne">5. AI Usage Policy</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed">
              <p>
                You are allowed to use AI tools such as ChatGPT, Claude, Gemini, Copilot, or any other AI assistant during the assessment.
              </p>
              <p className="mt-4 font-bold text-foreground">However, please note:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>After the assessment, shortlisted candidates will go through an interview round.</li>
                <li>
                  During the interview, we will:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Review your codebase in depth</li>
                    <li>Ask questions regarding your implementation</li>
                    <li>Discuss your architectural and technical decisions</li>
                    <li>Evaluate your understanding of the technologies and frameworks used</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-4 font-bold text-foreground">If you use AI-generated code, ensure that:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>You fully understand the code you are submitting</li>
                <li>You can explain the logic and implementation details</li>
                <li>You have practical knowledge of the tech stack you used</li>
              </ul>
              <p className="font-bold text-[var(--color-star-danger)]">
                Blindly submitting AI-generated projects without understanding them will negatively affect your evaluation during interviews.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-[var(--color-star-task3)]" />
              <h2 className="text-2xl font-bold font-syne">6. Task 3 Leaderboard & Evaluation Policy</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed">
              <p>
                The Task 3 leaderboard updates automatically whenever a new submission is made or an existing submission is updated.
              </p>
              <p>Final rankings are calculated using the weighted aggregate of your submitted ML metrics:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>Accuracy → 40%</li>
                <li>F1 Score → 30%</li>
                <li>ROC-AUC → 30%</li>
              </ul>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center font-mono my-4">
                Total Score = 40(Accuracy) + 30(F1 Score) + 30(ROC-AUC)
              </div>
              <p>
                All metric values are normalized between <strong>0 and 100</strong> before the final weighted score calculation. Higher aggregate scores rank above lower scores on the leaderboard.
              </p>
              
              <p className="mt-6 font-bold text-foreground">Please note:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>The leaderboard scores shown during the assessment phase are <strong>not the final evaluation scores</strong>.</li>
                <li>After submissions close, shortlisted participants will receive a separate hidden evaluation CSV dataset that was kept aside exclusively for final testing.</li>
                <li>
                  You will be required to:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Run your trained model on the provided hidden dataset</li>
                    <li>Generate an output CSV file</li>
                    <li>Submit a CSV containing only a single column named <code>label</code></li>
                    <li>Preserve the exact row order provided in the evaluation CSV</li>
                  </ul>
                </li>
              </ul>
              <p>The final evaluation will be performed exclusively on this hidden dataset.</p>

              <h3 className="text-xl font-bold font-syne text-foreground mt-8">Submission Verification & Anti-Cheating Checks</h3>
              <p>
                The metrics you submit during the recruitment phase must closely match the actual performance of your code.
              </p>
              <p className="mt-4 font-bold text-foreground">Allowed score deviation:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>±5% tolerance between your submitted metrics and our evaluation results</li>
              </ul>
              <p className="mt-4 font-bold text-foreground">If your submitted metrics differ significantly:</p>
              <ol className="list-decimal list-outside ml-4 space-y-2">
                <li>We will rerun your submitted code on the dataset available at the time of your submission.</li>
                <li>
                  If the difference still exceeds 3%, then:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm text-[var(--color-star-danger)]">
                    <li>Your Task 3 submission will be disqualified</li>
                    <li>Penalty points may also be deducted from your other task evaluations</li>
                    <li>Your profile may be added to the internal cheating/watchlist database</li>
                  </ul>
                </li>
              </ol>
              <p className="text-[var(--color-star-danger)] font-bold mt-4">
                Any suspicious, manipulated, fabricated, or hardcoded predictions will result in strict action after notebook and code verification by the evaluation team.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-[var(--color-star-danger)]" />
              <h2 className="text-2xl font-bold font-syne text-[var(--color-star-danger)]">7. Strict Anti-Cheating Enforcement</h2>
            </div>
            <div className="pl-9 text-muted-foreground space-y-4 leading-relaxed border-l-2 border-[var(--color-star-danger)]/30 ml-3">
              <p>
                STAR maintains a strict integrity-first evaluation system.
              </p>
              <p className="mt-4 font-bold text-foreground">If we identify more than 5 confirmed cheating cases during the recruitment process:</p>
              <ul className="list-disc list-outside ml-4 space-y-2">
                <li>The list of disqualified participants may be publicly announced within the recruitment community.</li>
                <li>
                  Those candidates may receive a permanent ban from:
                  <ul className="list-[circle] list-outside ml-6 mt-2 space-y-1 text-sm">
                    <li>Future STAR recruitment drives</li>
                    <li>STAR internal competitions</li>
                    <li>Associated technical selections and opportunities</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-6 font-bold text-foreground">
                We strongly encourage originality, honesty, and genuine learning over inflated scores or copied solutions.
              </p>
            </div>
          </section>

          <div className="text-center pt-12 pb-8 mt-12">
            <h3 className="text-2xl font-bold font-syne text-[var(--color-star-task1)] tracking-widest uppercase">
              Andhera Kayam Rahe!
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
}
