export function getEffectivePhase(settings: any) {
  if (!settings) return "submission";
  
  // Announcement phase is purely manual and overrides everything
  if (settings.phase === "announcement") return "announcement";
  
  const now = new Date();
  
  // Registration Phase: before start_time
  if (settings.start_time && now < new Date(settings.start_time)) {
    return "registration";
  }
  
  // Evaluation Phase: after deadline
  if (settings.deadline && now >= new Date(settings.deadline)) {
    return "evaluation";
  }
  
  // Submission Phase: between start_time and deadline
  return "submission";
}
