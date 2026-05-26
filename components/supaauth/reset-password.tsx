'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
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

const FormSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
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
          <h1 className="font-bold">Set New Password</h1>
          <p className="text-sm">Please enter your new password below.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export function ResetPasswordForm() {
  const [passwordReveal, setPasswordReveal] = useState(false)
  const [confirmPasswordReveal, setConfirmPasswordReveal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createSupabaseBrowser()
    if (!isPending) {
      startTransition(async () => {
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        })
        
        if (error) {
          toast.error(error.message)
        } else {
          toast.success("Password updated successfully!")
          router.push('/')
          router.refresh()
        }
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="h-8" type={passwordReveal ? 'text' : 'password'} {...field} />
                  <div
                    className="absolute right-2 top-[30%] cursor-pointer group"
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {passwordReveal ? (
                      <FaRegEye className="group-hover:scale-105 transition-all" />
                    ) : (
                      <FaRegEyeSlash className="group-hover:scale-105 transition-all" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="h-8" type={confirmPasswordReveal ? 'text' : 'password'} {...field} />
                  <div
                    className="absolute right-2 top-[30%] cursor-pointer group"
                    onClick={() => setConfirmPasswordReveal(!confirmPasswordReveal)}
                  >
                    {confirmPasswordReveal ? (
                      <FaRegEye className="group-hover:scale-105 transition-all" />
                    ) : (
                      <FaRegEyeSlash className="group-hover:scale-105 transition-all" />
                    )}
                  </div>
                </div>
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
          Update Password
        </Button>
      </form>
    </Form>
  )
}
