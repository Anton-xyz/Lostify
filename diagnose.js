import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8')
  envContent.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join('=').trim()
      process.env[key] = value
    }
  })
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Testing connection to Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key (truncated):', supabaseAnonKey?.substring(0, 20) + '...')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Environment variables are missing.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runDiagnostics() {
  console.log('\n--- Checking Tables ---')
  
  // Test profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  if (profilesError) {
    console.error('❌ Profiles table error:', profilesError.message)
  } else {
    console.log('✅ Profiles table exists and is accessible.')
  }

  // Test reports table
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('*')
    .limit(1)

  if (reportsError) {
    console.error('❌ Reports table error:', reportsError.message)
  } else {
    console.log('✅ Reports table exists and is accessible.')
  }

  console.log('\n--- Checking Storage Buckets ---')
  
  // Test storage
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets()

  if (bucketsError) {
    console.error('❌ Storage buckets error:', bucketsError.message)
  } else {
    console.log('✅ Storage is accessible. Found buckets:')
    buckets.forEach(b => {
      console.log(` - ${b.name} (Public: ${b.public})`)
    })

    const hasReports = buckets.some(b => b.name === 'reports')
    const hasAvatars = buckets.some(b => b.name === 'avatars')

    if (!hasReports) console.warn('⚠️ Warning: "reports" bucket is missing!')
    if (!hasAvatars) console.warn('⚠️ Warning: "avatars" bucket is missing!')
  }
}

runDiagnostics()
