import React, { createContext, useContext, useReducer, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface StatEntry {
  date: string
  completedPomodoros: number
  totalFocusTime: number // in minutes
  completedTasks: number
}

interface Statistics {
  dailyStats: Record<string, StatEntry>
  lastUpdate: string
}

interface StatisticsContextType {
  statistics: Statistics
  addCompletedPomodoro: (focusTime: number) => void
  addCompletedTask: () => void
}

const initialStats: Statistics = {
  dailyStats: {},
  lastUpdate: new Date().toISOString()
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined)

// Actions
type Action = 
  | { type: 'ADD_POMODORO'; payload: { focusTime: number } }
  | { type: 'ADD_TASK' }
  | { type: 'LOAD_STATS'; payload: Statistics }

function statisticsReducer(state: Statistics, action: Action): Statistics {
  const today = new Date().toISOString().split('T')[0]
  
  switch (action.type) {
    case 'ADD_POMODORO': {
      const currentDayStats = state.dailyStats[today] || {
        date: today,
        completedPomodoros: 0,
        totalFocusTime: 0,
        completedTasks: 0
      }

      return {
        ...state,
        lastUpdate: new Date().toISOString(),
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            ...currentDayStats,
            completedPomodoros: currentDayStats.completedPomodoros + 1,
            totalFocusTime: currentDayStats.totalFocusTime + action.payload.focusTime
          }
        }
      }
    }
    
    case 'ADD_TASK': {
      const currentDayStats = state.dailyStats[today] || {
        date: today,
        completedPomodoros: 0,
        totalFocusTime: 0,
        completedTasks: 0
      }

      return {
        ...state,
        lastUpdate: new Date().toISOString(),
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            ...currentDayStats,
            completedTasks: currentDayStats.completedTasks + 1
          }
        }
      }
    }

    case 'LOAD_STATS':
      return action.payload

    default:
      return state
  }
}

export function StatisticsProvider({ children }: { children: React.ReactNode }) {
  const [statistics, dispatch] = useReducer(statisticsReducer, initialStats)

  // Load saved statistics on mount
  useEffect(() => {
    async function loadStats() {
      try {
        const saved = await AsyncStorage.getItem('@pomodoro_stats')
        if (saved) {
          dispatch({ type: 'LOAD_STATS', payload: JSON.parse(saved) })
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    }
    loadStats()
  }, [])

  // Save statistics when they change
  useEffect(() => {
    async function saveStats() {
      try {
        await AsyncStorage.setItem('@pomodoro_stats', JSON.stringify(statistics))
      } catch (error) {
        console.error('Error saving statistics:', error)
      }
    }
    saveStats()
  }, [statistics])

  const addCompletedPomodoro = (focusTime: number) => {
    dispatch({ type: 'ADD_POMODORO', payload: { focusTime } })
  }

  const addCompletedTask = () => {
    dispatch({ type: 'ADD_TASK' })
  }

  return (
    <StatisticsContext.Provider 
      value={{ 
        statistics, 
        addCompletedPomodoro, 
        addCompletedTask 
      }}
    >
      {children}
    </StatisticsContext.Provider>
  )
}

export function useStatistics() {
  const context = useContext(StatisticsContext)
  if (!context) {
    throw new Error('useStatistics must be used within a StatisticsProvider')
  }
  return context
} 