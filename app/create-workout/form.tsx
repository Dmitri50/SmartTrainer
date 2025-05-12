"use client";

import { createWorkout } from '@/app/actions';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
    message: "",
};

export default function Form({
    children
}: {
    children: React.ReactNode
}) {
    const [state, formAction] = useFormState(createWorkout, initialState);

    function SubmitButton() {
        const { pending } = useFormStatus();

        return <button type="submit" className='border rounded p-2 bg-blue-700 text-white font-bold' aria-disabled={pending}>GENERATE PLAN</button>;
    }

    return (
        <form action={formAction} className='w-full max-w-lg mt-32 mx-auto'>
            <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                    <label htmlFor="title" className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                        Enter workout title: </label>
                    <input type="text" id="title" name="title" required className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    </input>
                </div>
            </div>

            <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                    <label htmlFor="weight" className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                        Enter weight:
                    </label>
                    <input type="number" id="weight" name="weight" placeholder="Pounds" required className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    </input>
                </div>
            </div>

            <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 md:mb:-0'>
                    <label htmlFor="height" className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Enter height: </label>
                    <div className='flex w-full'>
                        <input type="number" id="height-ft" name="height-ft" placeholder="Feet" required className='appearance-none mr-8 block w-60 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                        </input>
                        <input type="number" id="height-in" name="height-in" placeholder="Inches" required className='appearance-none block w-60 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                        </input>
                    </div>
                </div>
            </div>

            <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                    <label htmlFor="experience-level" className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Enter experience level: </label>
                    <select id='experience-level' name='experience-level' defaultValue='' required className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                        <option value='' disabled>
                            Select your experience level
                        </option>
                        <option key='novice' value='novice' className='text-black'>
                            Novice
                        </option>
                        <option key='intermediate' value='intermediate' className='text-black'>
                            Intermediate
                        </option>
                        <option key='expert' value='expert' className='text-black'>
                            Expert
                        </option>
                    </select>
                </div>
            </div>

            <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                    <label htmlFor="goal" className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                        Enter your workout goal: </label>
                    <input type="text" id="goal" name="goal" placeholder="e.g., Build muscle, Lose weight, Improve endurance" required className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                    </input>
                </div>
            </div>

            {/* community drop down */}
            {children}

            <SubmitButton />

            <p role="status">
                {state?.message}
            </p>
        </form>
    );
}

