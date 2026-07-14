import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile, uploadImage } from '../services/supabaseService'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Image as ImageIcon, Loader2, Save, UploadCloud } from 'lucide-react'

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Image states
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
    },
  })

  // Populate form with current user details
  useEffect(() => {
    if (profile) {
      setValue('username', profile.username || '')
      if (profile.avatar_url) {
        setImagePreview(profile.avatar_url)
      }
    }
  }, [profile, setValue])

  // Handle image selection & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validation (max 5 MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size exceeds the 5 MB limit.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload a JPG, PNG, or WEBP.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    if (!user) return
    setSaving(true)

    try {
      let finalAvatarUrl = profile?.avatar_url || ''

      // If a new image is selected, upload it first
      if (imageFile) {
        setUploading(true)
        try {
          const uploadPromise = uploadImage(imageFile, 'avatars')
          toast.promise(uploadPromise, {
            loading: 'Uploading profile image...',
            success: 'Image uploaded successfully!',
            error: (err) => err.message || 'Image upload failed.',
          })
          finalAvatarUrl = await uploadPromise
        } catch (err) {
          throw err
        } finally {
          setUploading(false)
        }
      }

      // Update database profile
      const updatePromise = updateUserProfile(user.id, {
        username: data.username.trim(),
        avatar_url: finalAvatarUrl,
      })

      toast.promise(updatePromise, {
        loading: 'Saving profile changes...',
        success: 'Profile updated successfully!',
        error: (err) => err.message || 'Profile update failed.',
      })

      await updatePromise
      await refreshProfile()
      setImageFile(null)
    } catch (error) {
      console.error('Error saving profile:', error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Profile Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Update your public username and display profile avatar.
          </p>
        </div>

        {/* Profile Card Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#f97316]/50 group-hover:border-[#f97316] transition-colors"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-gray-500 border-2 border-dashed border-white/10 group-hover:border-[#f97316]/50 transition-colors">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                
                {/* Upload overlay hover trigger */}
                <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-center text-white text-xs font-semibold">
                    <UploadCloud className="w-5 h-5 mx-auto mb-1 text-gray-200" />
                    <span>Upload Picture</span>
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="text-center">
                <span className="text-xs text-gray-400 font-medium">
                  Accepted formats: JPG, PNG, WEBP (Max 5 MB)
                </span>
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Display Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                  })}
                  className={`block w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                    errors.username ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                  } rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all`}
                  placeholder="e.g. JohnDoe"
                />
              </div>
              {errors.username && <span className="text-rose-500 text-xs mt-1 block">{errors.username.message}</span>}
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                {saving || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  )
}

export default Profile
