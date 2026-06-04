"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";

export default function Task4ProblemStatement() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-orange-500">
          Task 4: Hardware Systems Development
        </h1>
        <p className="text-muted-foreground mb-8">
          Design the Electrical Subsystem for a high-altitude atmospheric mission
        </p>

        <TaskSubNav taskNumber={4} />

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 p-6 rounded-xl border border-orange-500/20 mb-8 mt-6">
            <p className="text-foreground/90 leading-relaxed font-serif text-lg italic m-0">
              A student team is developing a CanSat for a high-altitude atmospheric mission. The CanSat will be launched aboard a sounding rocket to an altitude of approximately 1000 m above ground level. After deployment, the CanSat must descend safely while collecting and transmitting scientific and engineering data.
            </p>
          </div>
          
          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Mission Requirements</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Your task is to design the complete Electrical Subsystem and select the necessary avionics and sensors required to fulfill the mission objectives. The final design should be realistic, technically feasible, and based on commercially available components. The CanSat shall:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>R1:</strong> Measure atmospheric pressure continuously throughout the mission.</li>
            <li><strong>R2:</strong> Measure ambient temperature continuously throughout the mission.</li>
            <li><strong>R3:</strong> Measure acceleration and orientation of the CanSat.</li>
            <li><strong>R4:</strong> Determine and transmit GPS/GNSS position during flight.</li>
            <li><strong>R5:</strong> Measure and report battery voltage and battery current.</li>
            <li><strong>R6:</strong> Transmit telemetry to a ground station at a minimum rate of 1 Hz.</li>
            <li><strong>R7:</strong> Store all sensor data locally in case telemetry is lost.</li>
            <li><strong>R8:</strong> Record video from deployment until landing.</li>
            <li><strong>R9:</strong> Provide an audio recovery beacon after landing.</li>
            <li><strong>R10:</strong> Operate continuously for 2 hours on the launch pad and 15 minutes of flight operations with a minimum design margin of 25%.</li>
          </ul>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Design Constraints</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>C1:</strong> Total CanSat mass shall not exceed 1.0 kg</li>
            <li><strong>C2:</strong> The Electrical Subsystem mass shall not exceed 300 g</li>
            <li><strong>C3:</strong> Lithium-polymer batteries are strictly prohibited</li>
            <li><strong>C4:</strong> Maximum project budget for electrical components: ₹10,000</li>
            <li><strong>C5:</strong> Only commercially available components may be used.</li>
            <li><strong>C6:</strong> The design must survive launch vibration, shock loading, and temporary communication loss.</li>
          </ul>

          <h3 className="text-xl font-bold font-syne mt-8 mb-4">Required Deliverables</h3>
          
          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part A — System Architecture</h4>
          <p className="text-muted-foreground leading-relaxed">Create a block diagram showing: Battery, Voltage regulators, Microcontroller, Sensors, Telemetry module, Data storage, Camera, Recovery beacon. All power and communication connections should be clearly shown (conceptual).</p>
          
          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part B — Component Selection</h4>
          <p className="text-muted-foreground leading-relaxed">Select components for: Pressure Sensor, Temperature Sensor, IMU, GNSS Module, Microcontroller, Telemetry Module, Data Storage, Camera, Battery Monitoring System, Recovery Beacon. Provide Component Name, Operating Voltage, Current Consumption, Communication Interface, Cost, and Justification.</p>

          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part C — Trade Study</h4>
          <p className="text-muted-foreground leading-relaxed">For at least one sensor category, the microcontroller, and the telemetry module, compare a minimum of 3 candidate components and justify the final selection (include Advantages, Disadvantages, Score).</p>

          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part D — Electrical Power Subsystem Design</h4>
          <p className="text-muted-foreground leading-relaxed">Design the complete EPS including Battery Selection (type, configuration, capacity, total stored energy), Power Distribution (voltage rails, regulator types, protection mechanisms), and Power Protection (reverse polarity, over-current, switch design, battery mounting).</p>

          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part E — Power Budget</h4>
          <p className="text-muted-foreground leading-relaxed">Create a detailed power budget calculating Peak Power Consumption, Average Power Consumption, Total Mission Energy Consumption, Required Battery Capacity, and Battery Margin.</p>

          <h4 className="text-lg font-bold font-syne mt-6 mb-2">Part F — Circuit Design (Electrical Schematic)</h4>
          <p className="text-muted-foreground leading-relaxed">Create a circuit-level schematic showing how the selected components are electrically connected. The schematic may be created using KiCad, EasyEDA, Altium, Proteus, Draw.io, or hand-drawn scanned diagram provided it is legible.</p>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mt-8">
            <h4 className="font-bold text-orange-400 mb-2 font-syne">Submission Instructions</h4>
            <p className="text-orange-400 text-sm leading-relaxed">
              Compile all required deliverables (diagrams, tables, calculations, schematics) into a single document or folder. Upload your files to Google Drive, ensure the link is publicly accessible (Anyone with the link can view), and submit the Google Drive link in the Submission tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
