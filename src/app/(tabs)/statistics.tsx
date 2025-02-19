import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStatistics } from '@/context/StatisticsContext'
import { useThemeColors } from '@/hooks/useThemeColors'

export default function Statistics() {
  const { statistics } = useStatistics()
  const colors = useThemeColors()

  // Get date arrays for different periods
  const getDateArray = (days: number) => {
    return [...Array(days)].map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    })
  }

  // Get stats for a period
  const getPeriodStats = (dates: string[]) => {
    const periodData = dates.map(date => 
      statistics.dailyStats[date] || {
        completedPomodoros: 0,
        totalFocusTime: 0,
        completedTasks: 0
      }
    )

    const totalPomodoros = periodData.reduce((sum, day) => sum + day.completedPomodoros, 0)
    const totalFocusTime = periodData.reduce((sum, day) => sum + day.totalFocusTime, 0)

    return { totalPomodoros, totalFocusTime }
  }

  const today = getDateArray(1)
  const yesterday = [getDateArray(2)[1]] // Get just yesterday
  const week = getDateArray(7)
  const month = getDateArray(30)
  const year = getDateArray(365)

  const todayStats = getPeriodStats(today)
  const yesterdayStats = getPeriodStats(yesterday)
  const weekStats = getPeriodStats(week)
  const monthStats = getPeriodStats(month)
  const yearStats = getPeriodStats(year)

  const StatCard = ({ title, stats }: { 
    title: string, 
    stats: { totalPomodoros: number, totalFocusTime: number }
  }) => (
    <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </Text>
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {stats.totalPomodoros}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Total Pomos
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {Math.round(stats.totalFocusTime / 60 * 10) / 10}h
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Focus Time
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Statistics
            </Text>
          </View>

          <StatCard title="Today" stats={todayStats} />
          <StatCard title="Yesterday" stats={yesterdayStats} />
          <StatCard title="This Week" stats={weekStats} />
          <StatCard title="This Month" stats={monthStats} />
          <StatCard title="This Year" stats={yearStats} />

        </ScrollView>
      </SafeAreaView>
    </View>
  )
} 