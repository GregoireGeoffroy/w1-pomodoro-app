import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { LineChart, BarChart } from 'react-native-chart-kit'
import { useStatistics } from '@/context/StatisticsContext'
import { useState } from 'react'
import { useThemeColors } from '@/hooks/useThemeColors'

export default function Statistics() {
  const { colorScheme } = useColorScheme()
  const { statistics } = useStatistics()
  const colors = useThemeColors()
  const screenWidth = Dimensions.get('window').width
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week')

  // Get last 7 days or 30 days of data
  const getDaysArray = (numDays: number) => {
    return [...Array(numDays)].map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()
  }

  const days = timeframe === 'week' ? getDaysArray(7) : getDaysArray(30)

  const periodData = days.map(date => {
    const stats = statistics.dailyStats[date] || {
      completedPomodoros: 0,
      totalFocusTime: 0,
      completedTasks: 0
    }
    return stats
  })

  // Calculate totals
  const totalPomodoros = periodData.reduce((sum, day) => sum + day.completedPomodoros, 0)
  const totalFocusTime = periodData.reduce((sum, day) => sum + day.totalFocusTime, 0)
  const totalTasks = periodData.reduce((sum, day) => sum + day.completedTasks, 0)
  const averagePomodoros = Math.round(totalPomodoros / days.length * 10) / 10

  const chartData = {
    labels: timeframe === 'week' ? 
      days.map(date => date.split('-')[2]) : // Show days for week view
      days.map((_, i) => i % 3 === 0 ? days[i].split('-')[2] : ''), // Show every 3rd day for month
    datasets: [{
      data: periodData.map(day => day.completedPomodoros)
    }]
  }

  const focusTimeData = {
    labels: timeframe === 'week' ? 
      days.map(date => date.split('-')[2]) :
      days.map((_, i) => i % 3 === 0 ? days[i].split('-')[2] : ''),
    datasets: [{
      data: periodData.map(day => Math.round(day.totalFocusTime / 60 * 10) / 10) // Convert to hours
    }]
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Statistics
            </Text>
          </View>

          {/* Time Period Selector */}
          <View className="flex-row space-x-2 mb-4">
            <Pressable
              onPress={() => setTimeframe('week')}
              className={`px-4 py-2 rounded-full ${
                timeframe === 'week' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text className={`${
                timeframe === 'week' ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}>
                Week
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTimeframe('month')}
              className={`px-4 py-2 rounded-full ${
                timeframe === 'month' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text className={`${
                timeframe === 'month' ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}>
                Month
              </Text>
            </Pressable>
          </View>

          {/* Period Summary */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {timeframe === 'week' ? 'This Week' : 'This Month'}
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">
                  {totalPomodoros}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pomos
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">
                  {Math.round(totalFocusTime / 60 * 10) / 10}h
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Focus Time
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">
                  {averagePomodoros}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Daily Avg
                </Text>
              </View>
            </View>
          </View>

          {/* Pomodoro Chart */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Completed Pomodoros
            </Text>
            <LineChart
              data={chartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                backgroundGradientFrom: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                backgroundGradientTo: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => 
                  colorScheme === 'dark' ? 
                    `rgba(255, 255, 255, ${opacity})` : 
                    `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#3b82f6"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>

          {/* Focus Time Chart */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Focus Time (hours)
            </Text>
            <BarChart
              data={focusTimeData}
              width={screenWidth - 48}
              height={220}
              yAxisSuffix="h"
              yAxisLabel=""
              chartConfig={{
                backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                backgroundGradientFrom: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                backgroundGradientTo: colorScheme === 'dark' ? '#1f2937' : '#f9fafb',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => 
                  colorScheme === 'dark' ? 
                    `rgba(255, 255, 255, ${opacity})` : 
                    `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
} 