'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Instagram,
  LinkedIn,
  Autorenew,
  Lock,
  Login,
  Twitter,
  YouTube,
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { api } from '@/services/api';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    //setIsLoading(true);
    
    // try {
    //   const response = await api.auth.login(data) as any;
      
    //   console.log('Login response:', response);

    //   // Check if login was successful
    //   if (response && response.data && response.data.token) {
    //     toast.success(`🎉 Login successful! ${response.data.message || 'Welcome back!'}`);

    //     // Handle different user roles
    //     switch (response.data.user.role) {
    //       case 'USER':
    //         Cookies.set("utoken", response.data.token, { sameSite: "lax", secure: true });
    //         localStorage.setItem("user", JSON.stringify(response.data.user));
    //         router.push('/user/dashboard');
    //         break;
    //       case 'ADMIN': 
    //         Cookies.set("atoken", response.data.token, { sameSite: "lax", secure: true });
    //         localStorage.setItem("auser", JSON.stringify(response.data.user));
    //         router.push('/admin/dashboard');
    //         break;
    //       case 'SUPERADMIN':
    //         Cookies.set("stoken", response.data.token, { sameSite: "lax", secure: true });
    //         localStorage.setItem("suser", JSON.stringify(response.data.user));
    //         router.push('/superadmin/dashboard');
    //         break;
    //       default:
    //         // Default fallback
    //         toast.error('❌ Login Failed: Unknown user role');          
    //         break;
    //     }
    //   } else {
    //     toast.error('❌ Login Failed: Invalid response from server');
    //   }
    // } catch (error: any) {
    //   console.error('Login error:', error);
      
    //   // Extract meaningful error message
    //   let errorMessage = 'Login failed. Please try again.';
      
    //   if (error.message) {
    //     errorMessage = error.message;
    //   }
      
    //   // Handle specific error cases
    //   if (error.status === 401) {
    //     errorMessage = error.message || 'Invalid credentials. Please check your email and password.';
    //   } else if (error.status === 403) {
    //     errorMessage = error.message || 'Access forbidden. Please contact administrator.';
    //   } else if (error.status === 404) {
    //     errorMessage = 'Service not found. Please try again later.';
    //   } else if (error.status >= 500) {
    //     errorMessage = 'Server error. Please try again later.';
    //   }
      
    //   toast.error(`❌ ${errorMessage}`);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className='w-full'>
      <Toaster position="top-right" />

      <Card className="w-full lg:max-w-md bg-background text-foreground border border-border shadow-md rounded-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="typo-h1 font-bold text-center text-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-muted">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-3">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        autoComplete="email"
                        className="p-3 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-3">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="p-3"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted hover:text-foreground hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <VisibilityOff className="h-4 w-4" />
                          ) : (
                            <Visibility className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Autorenew className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Login className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center my-4 before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border">
            <span className="relative bg-background px-3 text-xs text-muted leading-none">OR</span>
          </div>

          {/* Google Button */}
          <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted/20">
            <img src="images/google-icon.svg" height={16} width={16} alt="Google Icon" />
            <span className="ml-2">Sign in with Google</span>
          </Button>

          {/* Footer Links */}
          <div className="flex items-center justify-between pt-5 text-sm text-muted">
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Driver Login
            </a>
          </div>

          {/* Social Icons */}
          <div className="mt-5">
            <ul className="flex gap-3 text-primary">
              <li><Link href="#"><Facebook /></Link></li>
              <li><Link href="#"><LinkedIn /></Link></li>
              <li><Link href="#"><YouTube /></Link></li>
              <li><Link href="#"><Instagram /></Link></li>
              <li><Link href="#"><Twitter /></Link></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
