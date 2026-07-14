import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { createReport, uploadImage } from '../services/supabaseService'
import { CATEGORIES } from '../components/FilterBar'
import toast from 'react-hot-toast'
import { ArrowLeft, UploadCloud, Info, Loader2, Phone, MapPin, Clipboard } from 'lucide-react'

const CreateReport = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      status: '',
      location: '',
      contact: '',
    },
  })

  // Handle local image file selector changes
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
    // Clear image error in react-hook-form manually if set
    setValue('image', file)
  }

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to report an item.')
      return
    }

    if (!imageFile) {
      toast.error('An image of the item is required.')
      return
    }

    setSubmitting(true)
    let imageUrl = ''

    try {
      // 1. Upload report image to Storage
      const uploadPromise = uploadImage(imageFile, 'reports')
      toast.promise(uploadPromise, {
        loading: 'Uploading item image...',
        success: 'Image uploaded successfully!',
        error: (err) => err.message || 'Image upload failed.',
      })
      imageUrl = await uploadPromise

      // 2. Insert report entry in Database
      const reportPromise = createReport({
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        status: data.status,
        location: data.location.trim(),
        contact: data.contact.trim(),
        image_url: imageUrl,
        user_id: user.id,
      })

      toast.promise(reportPromise, {
        loading: 'Creating your report...',
        success: 'Report created successfully!',
        error: (err) => err.message || 'Failed to create report.',
      })

      await reportPromise
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating report:', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">
            Report a Lost or Found Item
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Provide details about the item so other campus users can help identify it.
          </p>
        </div>

        {/* Main Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Grid for General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Item Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Clipboard className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                      errors.title ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                    } rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all`}
                    placeholder="e.g. Keychain with Blue Lanyard"
                  />
                </div>
                {errors.title && <span className="text-rose-500 text-xs mt-1 block">{errors.title.message}</span>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`block w-full px-4 py-3 bg-slate-950 border ${
                    errors.category ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                  } rounded-xl text-sm text-white focus:outline-none focus:ring-2 cursor-pointer transition-all`}
                >
                  <option value="">Select a Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="text-rose-500 text-xs mt-1 block">{errors.category.message}</span>}
              </div>

              {/* Status (Lost vs Found) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className={`block w-full px-4 py-3 bg-slate-950 border ${
                    errors.status ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                  } rounded-xl text-sm text-white focus:outline-none focus:ring-2 cursor-pointer transition-all`}
                >
                  <option value="">Is the item Lost or Found?</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
                {errors.status && <span className="text-rose-500 text-xs mt-1 block">{errors.status.message}</span>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Campus Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                      errors.location ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                    } rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all`}
                    placeholder="e.g. Science Building 2nd Floor, Room 204"
                  />
                </div>
                {errors.location && <span className="text-rose-500 text-xs mt-1 block">{errors.location.message}</span>}
              </div>

              {/* Contact phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('contact', { required: 'Contact number is required' })}
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                      errors.contact ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                    } rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all`}
                    placeholder="e.g. +1 555-0199 or Campus Ext."
                  />
                </div>
                {errors.contact && <span className="text-rose-500 text-xs mt-1 block">{errors.contact.message}</span>}
              </div>

            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Detailed Description
              </label>
              <textarea
                rows="4"
                {...register('description', { required: 'Description is required' })}
                className={`block w-full px-4 py-3 bg-slate-950 border ${
                  errors.description ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-blue-500/50'
                } rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all resize-none`}
                placeholder="Provide distinctive details like color, brand, condition, or items inside the object..."
              />
              {errors.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description.message}</span>}
            </div>

            {/* Image Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Item Photograph
              </label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-6 bg-slate-950/40 relative hover:border-[#f97316]/50 transition-colors group">
                {imagePreview ? (
                  <div className="w-full relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl object-contain border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview('')
                        setValue('image', null)
                      }}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 border border-white/10 text-white rounded-lg px-2 py-1 text-xs transition-colors cursor-pointer"
                    >
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center py-6 cursor-pointer text-center">
                    <UploadCloud className="w-12 h-12 text-gray-500 mb-2 group-hover:text-[#f97316] transition-colors" />
                    <span className="text-sm font-semibold text-gray-300">Click to upload or drag & drop</span>
                    <span className="text-xs text-gray-500 mt-1">Acceptable formats: JPG, PNG, WEBP (Max 5MB)</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold rounded-xl text-center transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default CreateReport
