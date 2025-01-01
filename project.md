You are an assistant helping to build a Pomodoro timer app in React Native using Expo. 

The project setup is complete, and the app will be tested on an iOS simulator. 

Note: Tasks will be checked (✅) when they are completed. Each sub-task will be marked with [x] when done.

### Task:
Help implement the basic Pomodoro timer functionality with the following requirements:

1. **Timer Logic:** ✅
   - The app should have a timer that counts down from 25 minutes.
   - Include buttons to Start, Pause, and Reset the timer.
   - Timer should transition to a 5-minute break when it reaches 0.
   - Display the current mode ("Work" or "Break") on the screen.

2. **UI Layout:** ✅
   - A simple screen layout:
     - Text to display the current timer (in MM:SS format).
     - A label for the mode ("Work" or "Break").
     - Buttons for Start, Pause, and Reset.

3. **State Management:** ✅
   - Use React `useState` and `useEffect` hooks to manage timer state.
   - Include state variables for:
     - `timeLeft` (in seconds).
     - `isRunning` (boolean to track if the timer is running).
     - `mode` ("Work" or "Break").

4. **Countdown Logic:** ✅
   - Use `setInterval` inside `useEffect` for the countdown.
   - Clear the interval when the timer is paused or reset.

5. **Basic Styling:** ✅
   - Use basic `StyleSheet` for styling (e.g., centered content, buttons with padding, etc.).

### Enhancements To Implement:

1. **Visual Feedback:** ⬜️
   - [x] Different background colors for Work/Break modes
   - [x] Circular progress indicator around the timer
   - [x] Button press effects (opacity/scale changes)
   - [x] Smooth color transitions between modes

2. **Audio & Haptic Feedback:** ⬜️
   - [ ] Sound notification when timer ends
   - [ ] Vibration when timer ends
   - [ ] Optional tick sound for each second
   - [ ] Haptic feedback on button presses

3. **Additional Controls:** ⬜️
   - [ ] Skip to next mode button
   - [ ] Custom time input for Work/Break periods
   - [ ] Session counter (number of completed pomodoros)
   - [ ] Long break after 4 work sessions

4. **Settings & Preferences:** ⬜️
   - [ ] Toggle sounds on/off
   - [ ] Toggle vibrations on/off
   - [ ] Customize work/break durations
   - [ ] Theme selection (light/dark)

5. **Extra Features:** ⬜️
   - [ ] Local notifications when app is in background
   - [ ] Widget for current timer status
   - [ ] Statistics tracking (daily/weekly focus time)
   - [ ] Task list integration

### Output:
Provide a complete React Native component implementing the above functionality. Ensure the code is clean, well-commented, and optimized for testing on an iOS simulator.

---

### Additional Notes:
- Assume this is the only screen in the app for now.
- No external libraries are required; use only built-in React Native features.
- Include example styles to ensure the layout looks reasonable on iOS.

