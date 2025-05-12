'use server';

import { ZodError, z } from 'zod';
import { db } from '@/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateAIWorkoutPlan } from './lib/workoutAI';

export async function createWorkout(prevState: any, formData: FormData) {
    let workoutID;

    const schema = z.object({
        title: z.string().min(1),
        weight: z.coerce.number().gte(50).lte(1000),
        feet: z.coerce.number().gte(3).lte(8),
        inches: z.coerce.number().gte(0).lt(12),
        level: z.string(),
        community: z.coerce.number(),
        goal: z.string().min(1),
    });

    try {
        const data = schema.parse({
            title: formData.get('title'),
            weight: formData.get('weight'),
            feet: formData.get('height-ft'),
            inches: formData.get('height-in'),
            level: formData.get('experience-level'),
            community: formData.get('community'),
            goal: formData.get('goal'),
        });

        // Generate workout plan using AI
        const workoutPlan = await generateAIWorkoutPlan({
            height: data.feet,
            weight: data.weight,
            experience: data.level as 'novice' | 'intermediate' | 'advanced',
            goal: data.goal,
        });

        const workout = await db.workout.create({
            data: {
                title: data.title,
                monday: workoutPlan.monday,
                tuesday: workoutPlan.tuesday,
                wednesday: workoutPlan.wednesday,
                thursday: workoutPlan.thursday,
                friday: workoutPlan.friday,
            },
        });

        if (data.community != 0) {
            await db.community.update({
                where: {
                    id: data.community
                },
                data: {
                    workouts: {
                        connect: {
                            id: workout.id
                        },
                    },
                },
            });
        }
        revalidatePath('/', 'layout');
        workoutID = workout.id;
        redirect(`/workouts/${workoutID}`);
    }
    catch (e) {
        if (e instanceof ZodError) {
            let errorMessage = '';
            e.errors.forEach((error) => {
                errorMessage = errorMessage + error.path[0].toString().toUpperCase() + ": " + error.message + ". ";
            });
            return { success: false, error: errorMessage };
        }
        else {
            return { success: false, error: 'Failed to add workout', details: e };
        }
    }
}

function generateWorkout(index: number) {
    let monday, tuesday, wednesday, thursday, friday;

    if (index < 8) {
        monday = 'Bodyweight Squats, 3 sets of 12 reps';
        tuesday = 'Push-ups, 3 sets of 15 reps';
        wednesday = 'Bodyweight Pull-ups, 3 sets of 10 reps';
        thursday = 'Plank, 3 sets of 30 seconds';
        friday = 'Jogging, 20 minutes';
    }
    else if (index < 12) {
        monday = 'Deadlift, 4 sets of 10 reps';
        tuesday = 'Bench Press, 4 sets of 8 reps';
        wednesday = 'Bent Over Row, 4 sets of 10 reps';
        thursday = 'Leg Press, 4 sets of 12 reps';
        friday = 'HIIT Cardio, 15 minutes';
    }
    else if (index < 16) {
        monday = 'Clean and Jerk, 5 sets of 5 reps';
        tuesday = 'Snatch, 5 sets of 5 reps';
        wednesday = 'Front Squat, 5 sets of 5 reps';
        thursday = 'Muscle Ups, 5 sets of 5 reps';
        friday = 'Long Distance Running, 30 minutes';
    }
    else {
        monday = 'Squat, Heavy, 5 sets of 3 reps';
        tuesday = 'Bench Press, Heavy, 5 sets of 3 reps';
        wednesday = 'Deadlift, Heavy, 5 sets of 3 reps';
        thursday = 'Overhead Press, Heavy, 5 sets of 3 reps';
        friday = 'Sprint Intervals, 20 minutes';
    }

    return { monday, tuesday, wednesday, thursday, friday };
}

export async function createCommunity(prevState: any, formData: FormData) {

    const schema = z.object({
        name: z.string().min(1),
    });

    try {
        const data = schema.parse({
            name: formData.get('name'),
        });

        const workout = await db.community.create({
            data: {
                name: data.name,
            },
        });

        revalidatePath('/community');
    }
    catch (e) {
        return { message: 'Failed to add community' };
    }
    
    redirect('/community');
}

// export async function testIndex(prevState: any, formData: FormData) {

//     const schema = z.object({
//         title: z.string().min(1),
//         weight: z.coerce.number().gte(50).lte(1000),
//         feet: z.coerce.number().gte(3).lte(8),
//         inches: z.coerce.number().gte(0).lt(12),
//         level: z.string(),
//         community: z.coerce.number(),
//     });

//     const data = schema.parse({
//         title: formData.get('title'),
//         weight: formData.get('weight'),
//         feet: formData.get('height-ft'),
//         inches: formData.get('height-in'),
//         level: formData.get('experience-level'),
//         community: formData.get('community'),
//     });

//     const heightInInches = (data.feet * 12) + data.inches;

//     let index = 10 * (data.weight / 150) * (heightInInches / 75);

//     switch (data.level) {
//         case 'novice':
//             index = index * 1;
//             break;
//         case 'intermediate':
//             index = index * 1.25;
//             break;
//         case 'expert':
//             index = index * 1.5;
//     }

//     return { message: index.toString() };
// }