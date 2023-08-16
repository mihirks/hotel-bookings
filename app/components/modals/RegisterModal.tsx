'use client'

import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useState,useCallback } from 'react';
import { FieldValues,SubmitHandler,useForm } from 'react-hook-form';

import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import Button from '../Button';

import { signIn } from 'next-auth/react'
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

const RegisterModal = () => {
const registerModal =useRegisterModal();
const loginModal =useLoginModal();
const [isLoading,setisLoading] =useState(false);

const {
    register,
    handleSubmit,
    formState:{
        errors,
    }
} =useForm<FieldValues>({
    defaultValues:{
        name: '',
        email: '',
        password: '',
    },
});


const onSubmit: SubmitHandler<FieldValues> = (data) => {
    
    const {name,email,password} = data
    // console.log(name,email);
    // console.log(password);

    const pwd_check = {
        capital: /(?=.*[A-Z])/,
        length: /(?=.{7,13}$)/,
        specialChar: /[!@#\$%\^&\*\.]/,
        digit: /(?=.*[0-9])/,
    };

    const email_check ={
        in: /(?=.*@.*.in)/,
        com: /(?=.*@.*\.com)/,
        specialChar: /^[!@#\$%\^&\*\.]/
    }
    const validPwd = pwd_check.capital.test(password) && pwd_check.length.test(password) && pwd_check.specialChar.test(password) && pwd_check.digit.test(password)
    const validEmail = (email_check.in.test(email) || email_check.com.test(email)) && !email_check.specialChar.test(email) 
    if(!validEmail){
        toast.error('Please enter valid email address')
        return
    }
    if(!validPwd){
        toast.error("Please use valid password format");
        return
    }
    setisLoading(true);

    axios.post('/api/register',data)
    .then(() => {
        registerModal.onClose();
    })
    .catch((error) => {
        toast.error('Something went wrong')
    })
    .finally(() => {
        setisLoading(false)
    })
}

const bodyContent =(
    <div className='flex flex-col gap-3'>
        <Heading 
        title='Welcome to Airbnb'
        subtitle='Create an account' />

        <Input 
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />

        <Input 
        id='name'
        label='Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />

        <Input 
        id='password'
        type="password"
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />

    </div>
)
    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />

            <Button 
                outline
                label='Continue with Google'
                icon={FcGoogle}
                onClick={() =>signIn('google')}            
            />
            <Button 
                outline
                label='Continue with GitHub'
                icon={AiFillGithub}
                onClick={() =>signIn('github')}            
            />

            <div className='flex flex-row gap-2 justify-center'>
                <div>
                    Already have an account?
                </div>
                <div className='text-neutral-800 hover:underline hover:cursor-pointer' onClick={()=>{
                    registerModal.onClose();
                    setTimeout(loginModal.onOpen,100);
                }}>
                    Log in
                </div>
            </div>
        </div>
        
    )

    return ( 
        <Modal 
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        onClose={registerModal.onClose}
        title='Register'
        actionlabel='Continue'
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
        />
     );
}
 
export default RegisterModal
