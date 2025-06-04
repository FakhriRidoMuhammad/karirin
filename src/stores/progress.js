import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'

export const useProgressStore = defineStore('progress', () => {
  // State
  const skills = ref([])
  const achievements = ref([])
  const goals = ref([])
  const level = ref(1)
  const experience = ref(0)

  // Computed
  const experienceToNextLevel = computed(() => level.value * 1000)
  const levelProgress = computed(() => (experience.value / experienceToNextLevel.value) * 100)
  const recentAchievements = computed(() => {
    return achievements.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  })
  const upcomingGoals = computed(() => {
    return goals.value
      .filter(goal => !goal.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
  })

  // Actions
  async function fetchProgress() {
    try {
      const [skillsRes, achievementsRes, goalsRes, statsRes] = await Promise.all([
        api.get('/progress/skills'),
        api.get('/progress/achievements'),
        api.get('/progress/goals'),
        api.get('/progress/stats')
      ])

      skills.value = skillsRes.data
      achievements.value = achievementsRes.data
      goals.value = goalsRes.data
      level.value = statsRes.data.level
      experience.value = statsRes.data.experience

      return { success: true }
    } catch (error) {
      console.error('Failed to fetch progress:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch progress'
      }
    }
  }

  async function addSkill(skillData) {
    try {
      const response = await api.post('/progress/skills', skillData)
      skills.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to add skill:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add skill'
      }
    }
  }

  async function updateSkill(skillId, skillData) {
    try {
      const response = await api.put(`/progress/skills/${skillId}`, skillData)
      const index = skills.value.findIndex(s => s.id === skillId)
      if (index !== -1) {
        skills.value[index] = response.data
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to update skill:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update skill'
      }
    }
  }

  async function addGoal(goalData) {
    try {
      const response = await api.post('/progress/goals', goalData)
      goals.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to add goal:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add goal'
      }
    }
  }

  async function completeGoal(goalId) {
    try {
      const response = await api.put(`/progress/goals/${goalId}/complete`)
      const index = goals.value.findIndex(g => g.id === goalId)
      if (index !== -1) {
        goals.value[index] = response.data
      }
      // Update experience and level
      experience.value = response.data.newExperience
      level.value = response.data.newLevel
      return { success: true }
    } catch (error) {
      console.error('Failed to complete goal:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to complete goal'
      }
    }
  }

  // Initialize
  fetchProgress()

  return {
    // State
    skills,
    achievements,
    goals,
    level,
    experience,
    // Computed
    experienceToNextLevel,
    levelProgress,
    recentAchievements,
    upcomingGoals,
    // Actions
    fetchProgress,
    addSkill,
    updateSkill,
    addGoal,
    completeGoal
  }
}) 