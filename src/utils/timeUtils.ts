export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatTotalFocusTime(completedSessions: number, workDuration: number): string {
  const totalMinutes = completedSessions * workDuration;
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round((totalMinutes % 60) / 5) * 5;
  
  if (hours === 0) {
    if (remainingMinutes === 0) return '0 minutes';
    return `${remainingMinutes} minutes`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours > 1 ? 's' : ''}, ${remainingMinutes} minutes`;
} 