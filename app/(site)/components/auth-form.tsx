"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/inputs/input";
import { useState, useCallback, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./auth-social-button";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const router = useRouter();
    const session = useSession();
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        if(session?.status === 'authenticated'){
            router.push('/users');
        }
    },[session?.status, router])

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER')
        } else {
            setVariant('LOGIN');
        }
    }, [variant])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'LOGIN') {
            // NextAuth SignIn
            signIn('credentials', {
                ...data,
                redirect:false
            })
            .then((callback)=>{
                if(callback?.error){
                   toast.error('Invalid Credentials') 
                }
                if(callback?.ok && !callback?.error){
                    toast.success('Logged in!')
                    router.push('/users');
                }
            })
            .finally(()=> setIsLoading(false))
        }

        if (variant === 'REGISTER') {
            axios.post('/api/register', data)
            .then(()=> signIn('credentials',data))
            .catch(()=> toast.error('Something went wrong!'))
            .finally(()=> setIsLoading(false))
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        // NextAuth Social SignIn
        signIn(action, {redirect: false})
        .then((callback)=> {
            if(callback?.error){
                toast.error("Invalid Credentials!")
            }
            if(callback?.ok && !callback?.error){
                toast.success("Logged In!")
                router.push('/users');
            }
        })


    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {variant === 'REGISTER' && (

                        <Input
                            id="name"
                            lable="Name"
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                    )}
                    <Input
                        id="email"
                        type="email"
                        lable="Email Address"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <Input
                        id="password"
                        type="password"
                        lable="Password"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === 'LOGIN' ? 'Sign In' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={()=>socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={()=>socialAction('google')}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div className="">
                        {variant === 'LOGIN'? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <div onClick={toggleVariant} className="underline cursor-pointer">
                        {variant === 'LOGIN'? 'Create Account' : 'Login'}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AuthForm;