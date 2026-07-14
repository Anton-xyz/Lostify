import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

/**
 * Uploads an image to a specified Supabase storage bucket
 * @param {File} file - The file object to upload
 * @param {string} bucket - The bucket name ('reports' or 'avatars')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImage = async (file, bucket) => {
  if (!file) {
    throw new Error('No file selected')
  }

  // Validate file size (max 5 MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size exceeds the 5 MB limit.')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WEBP are accepted.')
  }

  // Create unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Upload error detail:', error)
    throw new Error(error.message || 'Error uploading file to storage.')
  }

  // Get Public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Create a new report
 * @param {object} reportData - Fields for the report (title, description, category, status, location, contact, image_url, user_id)
 */
export const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()

  if (error) {
    throw error
  }
  return data[0]
}

/**
 * Update an existing report
 * @param {string} reportId - ID of the report to edit
 * @param {object} updateData - Key-values to update
 */
export const updateReport = async (reportId, updateData) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updateData)
    .eq('id', reportId)
    .select()

  if (error) {
    throw error
  }
  return data[0]
}

/**
 * Delete a report
 * @param {string} reportId - ID of the report to delete
 */
export const deleteReport = async (reportId) => {
  const { data, error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)

  if (error) {
    throw error
  }
  return data
}

/**
 * Fetch reports with live search, filters, and sorting
 * @param {object} params - Filters like { query, category, status }
 */
export const getReports = async ({ query = '', category = '', status = '' } = {}) => {
  let request = supabase
    .from('reports')
    .select('*, profiles:user_id(username, avatar_url)')
    .order('created_at', { ascending: false })

  if (query.trim()) {
    request = request.ilike('title', `%${query.trim()}%`)
  }

  if (category) {
    request = request.eq('category', category)
  }

  if (status) {
    request = request.eq('status', status)
  }

  const { data, error } = await request

  if (error) {
    throw error
  }
  return data
}

/**
 * Fetch a single report by ID, including reporter details
 * @param {string} reportId - ID of the report
 */
export const getReportById = async (reportId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*, profiles:user_id(username, avatar_url)')
    .eq('id', reportId)
    .single()

  if (error) {
    throw error
  }
  return data
}

/**
 * Fetch reports created by a specific user
 * @param {string} userId - User's UUID
 */
export const getUserReports = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
}

/**
 * Update user profile details
 * @param {string} userId - User UUID
 * @param {object} profileData - { username, avatar_url }
 */
export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()

  if (error) {
    throw error
  }
  return data[0]
}
