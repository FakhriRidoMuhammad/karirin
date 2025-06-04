import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'

export const useMentorshipStore = defineStore('mentorship', () => {
  // State
  const mentors = ref([])
  const mentees = ref([])
  const sessions = ref([])
  const requests = ref([])

  // Computed
  const activeMentors = computed(() => 
    mentors.value.filter(mentor => mentor.status === 'active')
  )
  const pendingRequests = computed(() => 
    requests.value.filter(request => request.status === 'pending')
  )
  const upcomingSessions = computed(() => {
    const now = new Date()
    return sessions.value
      .filter(session => new Date(session.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  })

  // Actions
  async function fetchMentorships() {
    try {
      const [mentorsRes, menteesRes, sessionsRes, requestsRes] = await Promise.all([
        api.get('/mentorship/mentors'),
        api.get('/mentorship/mentees'),
        api.get('/mentorship/sessions'),
        api.get('/mentorship/requests')
      ])

      mentors.value = mentorsRes.data
      mentees.value = menteesRes.data
      sessions.value = sessionsRes.data
      requests.value = requestsRes.data

      return { success: true }
    } catch (error) {
      console.error('Failed to fetch mentorships:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch mentorships'
      }
    }
  }

  async function sendMentorRequest(mentorId, message) {
    try {
      const response = await api.post('/mentorship/requests', {
        mentorId,
        message
      })
      requests.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to send mentor request:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send request'
      }
    }
  }

  async function respondToRequest(requestId, accept) {
    try {
      const response = await api.put(`/mentorship/requests/${requestId}`, {
        status: accept ? 'accepted' : 'rejected'
      })
      const index = requests.value.findIndex(r => r.id === requestId)
      if (index !== -1) {
        requests.value[index] = response.data
      }
      if (accept) {
        // Add to mentors/mentees list based on role
        const request = requests.value[index]
        if (request.role === 'mentor') {
          mentees.value.push(request.requester)
        } else {
          mentors.value.push(request.requester)
        }
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to respond to request:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to respond to request'
      }
    }
  }

  async function scheduleSession(mentorshipId, sessionData) {
    try {
      const response = await api.post('/mentorship/sessions', {
        mentorshipId,
        ...sessionData
      })
      sessions.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to schedule session:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to schedule session'
      }
    }
  }

  async function completeSession(sessionId, feedback) {
    try {
      const response = await api.put(`/mentorship/sessions/${sessionId}/complete`, {
        feedback
      })
      const index = sessions.value.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        sessions.value[index] = response.data
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to complete session:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to complete session'
      }
    }
  }

  // Initialize
  fetchMentorships()

  return {
    // State
    mentors,
    mentees,
    sessions,
    requests,
    // Computed
    activeMentors,
    pendingRequests,
    upcomingSessions,
    // Actions
    fetchMentorships,
    sendMentorRequest,
    respondToRequest,
    scheduleSession,
    completeSession
  }
}) 