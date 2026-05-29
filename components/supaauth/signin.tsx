'use client'

import React, { useState, useTransition } from 'react'
import Social from './social'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
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

export default function SignIn() {
  const searchParams = useSearchParams()
  const appName = process.env.NEXT_PUBLIC_APP_NAME!
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON!

  // Get the value of the 'next' parameter
  const next = searchParams.get('next')
  return (
    <div className="w-full sm:w-[26rem] shadow sm:p-5  border dark:border-zinc-800 rounded-md">
      <div className="p-5 space-y-5">
        <div className="text-center space-y-3">
          <Image
            src={appIcon}
            alt={`${appName} Logo`}
            width={50}
            height={50}
            className=" rounded-full mx-auto"
          />
          <h1 className="font-bold">Sign in to {appName}</h1>
          <p className="text-sm">Welcome back! Please sign in to continue</p>
        </div>
        <Social redirectTo={next || '/'} />
        <div className="flex items-center gap-5">
          <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
          <div className="text-sm">or</div>
          <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
        </div>
        <SignInForm redirectTo={next || '/'} />
      </div>
    </div>
  )
}


export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const [isPending, startTransition] = useTransition()
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

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
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
            shouldCreateUser: true,
          },
        })
        if (error) {
          toast.error(error.message)
        } else {
          setSentEmail(data.email)
          setEmailSent(true)
          toast.success('Magic link sent! Check your email inbox.')
        }
      })
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl">📧</div>
        <div>
          <p className="font-semibold text-sm">Check your email</p>
          <p className="text-xs text-muted-foreground mt-1">
            We sent a magic login link to <span className="font-medium text-foreground">{sentEmail}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click the link in your email to sign in — no password needed!
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => {
            setEmailSent(false)
            setSentEmail('')
            form.reset()
          }}
        >
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" font-semibold  test-sm">Email Address</FormLabel>
              <FormControl>
                <Input className="h-8" placeholder="example@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
        >
          <AiOutlineLoading3Quarters className={cn(!isPending ? 'hidden' : 'block animate-spin')} />
          Send Magic Link
        </Button>
      </form>
      <div className="text-center text-sm mt-4">
        <h1>
          Don&apos;t have an account yet?{' '}
          <Link
            href={redirectTo ? `/register?next=` + redirectTo : '/register'}
            className="text-blue-400"
          >
            Register
          </Link>
        </h1>
      </div>
    </Form>
  )
}
