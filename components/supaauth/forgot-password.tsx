'use client'

import React, { useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const FormSchema = z.object({
  email: z.string().email({
    message: 'Invalid Email Address',
  }),
})

export default function ForgotPassword() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME!
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON!

  return (
    <div className="w-full sm:w-[26rem] shadow sm:p-5 border dark:border-zinc-800 rounded-md">
      <div className="p-5 space-y-5">
        <div className="text-center space-y-3">
          <Image
            src={appIcon}
            alt={`${appName} Logo`}
            width={50}
            height={50}
            className="rounded-full mx-auto"
          />
          <h1 className="font-bold">Reset Password</h1>
          <p className="text-sm">Enter your email to receive a password reset link.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createSupabaseBrowser()
    if (!isPending) {
      startTransition(async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })
        if (error) {
          toast.error(error.message)
        } else {
          toast.success("Password reset link sent to your email.")
          router.push('/signin')
        }
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Email Address</FormLabel>
              <FormControl>
                <Input className="h-8" placeholder="example@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center justify-center gap-2"
        >
          <AiOutlineLoading3Quarters className={cn(!isPending ? 'hidden' : 'block animate-spin')} />
          Send Reset Link
        </Button>
      </form>
      <div className="text-center text-sm mt-4">
        <h1>
          Remember your password?{' '}
          <Link href="/signin" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </h1>
      </div>
    </Form>
  )
}
